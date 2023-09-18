const express = require("express");
const router = express.Router();
const User = require("../models/userModel");
const Doctor = require("../models/doctorModel");
const bcrypt = require("bcryptjs");
const jwt = require("jsonwebtoken");
const authMiddleware = require("../middlewares/authMiddleware");
const Appointment = require("../models/appointmentModel");
const moment = require("moment");


router.post("/register", async (req, res) => {

    try {
        const userExist = await User.findOne({email: req.body.email});
        if(userExist){
            return res.status(400).send({ message: "User Already Exists. " , success: false});
        }
        const password = req.body.password;
        const salt = await bcrypt.genSalt(10);
        const hashedPassword = await bcrypt.hash(password,salt);
        req.body.password = hashedPassword;
        const newuser = new User(req.body);
        await newuser.save();
        res.status(200).send({ message: "User Created Successfull. " , success: true});

    } catch (error) {
        console.log(error);
        res.status(500).send({ message: "User Creating Error. " , success: false, error});

    }
});


router.post("/login", async (req, res) => {
    try {
        const user = await User.findOne({email: req.body.email});
        if(!user){
            return res.status(200).send({ message: "User Does not Exists. " , success: false});
        }

        const isMatch = await bcrypt.compare(req.body.password,user.password);

        if(!isMatch){
            return res.status(200).send({ message: "Password is Incorrect. " , success: false});
        }else{
            const token = jwt.sign({id: user._id},"mysecret",{
                expiresIn:"1d"
            });
            res.status(200).send({ message: "Login successfull. " , success: true, data: token});
        }
    
    } catch (error) {
        console.log(error);
        res.status(500).send({ message: "Error Logging In." , success: false, error});
    }
});


router.post("/get-user-info-by-id" , authMiddleware, async (req, res) => {

    try {
        const user = await User.findOne({_id: req.body.userId});
        user.password = undefined;

        if(!user){

            return res.status(200).send({ message: "User Does not Exists. " , success: false});

        }else{

            res.status(200).send({ success: true , data: user,
            });

        }

    } catch (error) {
        res.status(500).send({ message: "Error getting user info... " , success: false, error});

    }

})


router.post("/apply-doctor-account", authMiddleware, async (req, res) => {

    try {
        const newDoctor = new Doctor({...req.body, status: "pending"})
        await newDoctor.save();
        const adminUser = await User.findOne({isAdmin: true});


        const unseenNotifications = adminUser.unseenNotifications;
        unseenNotifications.push({
            type: "new-doctor-requset",
            message: `${newDoctor.firstName} ${newDoctor.lastName} has applied for a doctor account`,
            data: {
                doctorId: newDoctor._id,
                name: newDoctor.firstName + " " + newDoctor.lastName,
            },
            onClickPath: "/admin/doctorslist",
        })
        await User.findByIdAndUpdate(adminUser._id, {unseenNotifications});
        res.status(200).send({ success: true , message: "Doctor Account Applied Successfully. " });
    } catch (error) {
        console.log(error);
        res.status(500).send({ message: "Error Applying Doctor. " , success: false, error});

    }
});



router.post("/mark-all-notifications-as-seen", authMiddleware, async (req, res) => {

    try {
        const user = await User.findOne({_id: req.body.userId});
        const unseenNotifications = user.unseenNotifications;
        const seenNotifications = user.seenNotifications;
        seenNotifications.push(...unseenNotifications);
        user.unseenNotifications = [];
        user.seenNotifications = seenNotifications;
        const updatedUser = await user.save();
        updatedUser.password = undefined;

        res.status(200).send({ message: "All notifications marked as seen. ",success: true , data: updatedUser, });
    } catch (error) {
        console.log(error);
        res.status(500).send({ message: "Error Applying Doctor. " , success: false, error});

    }
});



router.post("/delete-all-notifications", authMiddleware, async (req, res) => {

    try {
        const user = await User.findOne({_id: req.body.userId});
        user.seenNotifications = [];
        user.unseenNotifications = [];
        const updatedUser = await user.save();
        updatedUser.password = undefined;

        res.status(200).send({ success: true , message: "All notifications deleted. ", data: updatedUser, });
    } catch (error) {
        console.log(error);
        res.status(500).send({ message: "Error Applying Doctor. " , success: false, error});

    }
});


router.get("/get-all-approved-doctors", authMiddleware, async (req, res) => {
    try {
        const doctors = await Doctor.find({status: "approved"});
        res.status(200).send({ message: "Doctors fetched successfully.", success: true, data: doctors });
    } catch (error) {
        console.error(error);
        res.status(500).send({ message: "Error fetching doctors.", success: false, error: error.message });
    }
});


router.post("/book-appointment", authMiddleware, async (req, res) => {
    try {
        req.body.status = "pending";
        //req.body.date = moment(req.body.date, 'DD-MM-YYYY');
        //req.body.date = moment(req.body.date, "ddd MMM DD YYYY HH:mm:ss ZZ").format("DD-MM-YYYY");
        // req.body.time = moment(req.body.time).toISOString();
        const newAppointment = await Appointment(req.body);
        await newAppointment.save();
        const user = await User.findOne({_id: req.body.doctorInfo.userId});
        user.unseenNotifications.push({
            type: "new-appointment-request",
            message: `A new appointment request has been made by ${req.body.userInfo.name}`,
            onclickPath: "/doctor/appointment"
        });
        await user.save();
        res.status(200).send({ message: "Appointment booked successfully.", success: true });
    } catch (error) {
        console.error(error);
        res.status(500).send({ message: "Error booking appointment.", success: false, error: error.message });
    }
});


router.post("/check-booking-availability", authMiddleware, async (req, res) => {
    try {

        //const date = moment(req.body.date, 'DD-MM-YYYY').toISOString();
        const date = req.body.date;
        console.log(req.body.time)
        console.log(req.body.date)
        console.log(date)
        const fromTime = moment(req.body.time, 'HH:mm').clone().subtract(1, 'hours').format("HH:mm");
        const toTime = moment(req.body.time, 'HH:mm').clone().add(1, 'hours').format("HH:mm");
        const doctorId = req.body.doctorId;
        const appointments = await Appointment.find({
            doctorId,
            date,
            time: { $gte: fromTime, $lte: toTime },
        });

        
        if((appointments.length > 0)){
            return res.status(200).send({ message: "Appointments not available.", success: false });
        }else{
            return res.status(200).send({ message: "Appointments available.", success: true });
        }
    } catch (error) {
        console.error(error);
        res.status(500).send({ message: "Error booking appointment.", success: false, error: error.message });
    }
});


router.get("/get-appointments-by-user-id", authMiddleware, async (req, res) => {
    try {

        const appointments = await Appointment.find({userId: req.body.userId});
    
        res.status(200).send({ message: "Appointment fetched successfully.", success: true, data: appointments });

    } catch (error) {
        console.error(error);
        res.status(500).send({ message: "Error booking appointment.", success: false, error: error.message });
    }
});



module.exports = router;