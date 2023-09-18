const express = require("express");
const router = express.Router();
const User = require("../models/userModel");
const Doctor = require("../models/doctorModel");
const authMiddleware = require("../middlewares/authMiddleware");

router.get("/get-all-doctors", authMiddleware, async (req, res) => {
    try {
        const doctors = await Doctor.find({});
        res.status(200).send({ message: "Doctors fetched successfully.", success: true, data: doctors });
    } catch (error) {
        console.error(error);
        res.status(500).send({ message: "Error fetching doctors.", success: false, error: error.message });
    }
});

router.get("/get-all-users", authMiddleware, async (req, res) => {
    try {
        const users = await User.find({});
        res.status(200).send({ message: "Users fetched successfully.", success: true, data: users });
    } catch (error) {
        console.error(error);
        res.status(500).send({ message: "Error fetching users.", success: false, error: error.message });
    }
});

router.post("/change-doctor-status", authMiddleware, async (req, res) => {
    try {
        const { doctorId, status, userId } = req.body;
        const doctor = await Doctor.findByIdAndUpdate(doctorId, {status,});
        const user = await User.findOne({_id: doctor.userId});
        const unseenNotifications = user.unseenNotifications;
        unseenNotifications.push({
            type: "new-doctor-requset-changed",
            message: `Your doctor account has been ${status}`,
            onClickPath: "/notifications",
        })
        user.isDoctor = status === "approved" ? true : false;
        await user.save();
        res.status(200).send({ message: "Doctor status updated. ", success: true , data: doctor, });
    } catch (error) {
        console.error(error);
        res.status(500).send({ message: "Error fetching users.", success: false, error: error.message });
    }
});




module.exports = router;
