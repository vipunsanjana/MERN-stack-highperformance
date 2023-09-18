const express = require("express");
const router = express.Router();
const Doctor = require("../models/doctorModel");
const authMiddleware = require("../middlewares/authMiddleware");
const Appointment = require("../models/appointmentModel");
const User = require("../models/userModel");


router.post("/get-doctor-info-by-user-id" , authMiddleware, async (req, res) => {

    try {
        const doctor = await Doctor.findOne({ userId: req.body.userId});
        res.status(200).send({ message: "Doctor info fetched successfully. " , success: true, data: doctor});


    } catch (error) {
        res.status(500).send({ message: "Error getting doctor info... " , success: false, error});

    }

})


router.post("/get-doctor-info-by-id" , authMiddleware, async (req, res) => {

    try {
        const doctor = await Doctor.findOne({ _id: req.body.doctorId});
        res.status(200).send({ message: "Doctor info fetched successfully. " , success: true, data: doctor});


    } catch (error) {
        res.status(500).send({ message: "Error getting doctor info... " , success: false, error});

    }

})


router.post("/update-doctor-profile" , authMiddleware, async (req, res) => {

    try {
        const doctor = await Doctor.findOneAndUpdate({ userId: req.body.userId}, req.body);
        res.status(200).send({ success: true, message: "Doctor profile updated successfully. " ,  data: doctor,});
    } catch (error) {
        res.status(500).send({ message: "Error getting doctor info... " , success: false, error});

    }

})


router.get("/get-appointments-by-doctor-id", authMiddleware, async (req, res) => {
    try {

        const doctor = await Doctor.findOne({userId: req.body.userId});
        console.log(doctor.phoneNumber)
        const appointments = await Appointment.find({doctorId: doctor._id});
        res.status(200).send({ message: "Appointment fetched successfully.", success: true, data: appointments });

    } catch (error) {
        console.error(error);
        res.status(500).send({ message: "Error booking appointment.", success: false, error: error.message });
    }
})


router.post("/change-appointment-status", authMiddleware, async (req, res) => {
    try {
        const { appointmentId, status } = req.body;
        const appointment = await Appointment.findByIdAndUpdate(appointmentId, {status,});

        const user = await User.findOne({_id: appointment.userId});
        const unseenNotifications = user.unseenNotifications;
        unseenNotifications.push({
            type: "Appointment-status-changed",
            message: `Your appointment status has been ${status}`,
            onClickPath: "/appointment",
        })
        
        await user.save();
        res.status(200).send({ message: "Appointment changed successfuly. ", success: true  });
    } catch (error) {
        console.error(error);
        res.status(500).send({ message: "Error changing appointment status.", success: false, error: error.message });
    }
});


module.exports = router;
