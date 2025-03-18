const express = require("express");
const router = express.Router();
const { userAuth } = require("../middlewares/auth");
const ConnectionRequest = require("../models/connectionRequest");
const mongoose = require("mongoose");
const User = require("../models/user");

router.post("/request/send/:status/:toUserId", userAuth, async (req, res) => {
    try {
        const fromUserId = req.user._id;
        if (!req.user) {
            throw new Error("Unauthorised! Please login again!");
        };
        const toUserId = req.params.toUserId;
        //Checking if toUser is present in our database
        // if (mongoose.Types.ObjectId.isValid(toUserId)) {
        //     return res.status(400).json({ error: "Invalid user ID" });
        // };
        const toUser = await User.findById(toUserId);
        if (!toUser) {
            return res.status(400).json({ error: "Invalid user ID" });
        };

        //Also check if both userIds are not same
        //This case was handled using schema.pre method

        const status = req.params.status;
        const allowedStatus = ["interested", "ignored"];
        if (!allowedStatus.includes(status)) {
            throw new Error("Invalid request!");
        }
        //Check if there is already pending request between both the user to avoid duplicacy
        const existingConnectionRequest = await ConnectionRequest.findOne({
            $or: [
                {
                    fromUserId: fromUserId,
                    toUserId: toUserId,
                },
                {
                    fromUserId: toUserId,
                    toUserId: fromUserId,
                }
            ]
        });
        if (existingConnectionRequest) {
            throw new Error("Request is pending!");
        };

        const connectionRequest = new ConnectionRequest({
            fromUserId,
            toUserId,
            status,
        });
        const data = await connectionRequest.save();
        (status == "interested") ?
            res.status(200).json({
                message: `${req.user.firstName} is ${status} in ${toUser.firstName}.`,
                data,
            }) :
            res.status(200).json({
                message: `${toUser.firstName} is ignored succesfully.`,
                data,
            })

    } catch (err) {
        res.status(400).json({ error: err.message });
    }
})

module.exports = router;