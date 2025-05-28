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
            if(existingConnectionRequest.status.includes("accepted"))
            {
                throw new Error(`You are already a connection with ${toUser.firstName} `);
            }
            else if(existingConnectionRequest.status.includes("rejected"))
            {
                throw new Error(`You are already rejected by ${toUser.firstName}`);
            }
            else throw new Error("Request is pending!");
        };

        const connectionRequest = new ConnectionRequest({
            fromUserId,
            toUserId,
            status,
        });
        const data = await connectionRequest.save();
        (status == "interested") ?
            res.status(200).json({
                message: `${req.user.firstName +" "+req.user.lastName} is ${status} in ${toUser.firstName +" "+toUser.lastName}.`,
                data,
            }) :
            res.status(200).json({
                message: `${toUser.firstName} is ignored succesfully.`,
                data,
            })

    } catch (err) {
        res.status(400).json({ error: err.message });
    }
});

router.post(
    "/request/review/:status/:requestId",
    userAuth,
    async (req, res) => {
        try {
            const loggedInUser = req.user; // check if the loggedInUser must be the toUser
            if(!loggedInUser)
            {
                throw new Error("Unauthorised. Please login again.");
            }
            const { status, requestId } = req.params;

            //check if the requestStatus must be "interested";
            //check it the status must includes either "accepted" or "rejected"
            const allowedStatus = ["accepted", "rejected"];
            if (!allowedStatus.includes(status)) {
                throw new Error(`Invalid status type: ${status}`);
            };

            const connectionRequest = await ConnectionRequest.findOne({
                _id: requestId,
                toUserId: loggedInUser._id,
                status: "interested",
            });
            if(!connectionRequest)
            {
                throw new Error("Connection request does not exist!");
            };

            connectionRequest.status = status;
            const data = await connectionRequest.save();

            res.status(200).json({ message: "Connection request " + status, data});

        } catch (err) {
            res.status(400).json({
                error: err.message,
            })
        }
    }
);

module.exports = router;