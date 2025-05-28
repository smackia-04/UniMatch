const express = require("express");
const router = express.Router();
const { userAuth } = require('../middlewares/auth');
const User = require("../models/user");
const bcrypt = require("bcrypt");
const validator = require("validator");
const { validateEditProfile } = require("../utils/validator");

router.get("/profile/view", userAuth, (req, res) => {
    try {
        const user = req.user;
        if (!user) throw new Error("User Not Found");
        res.send(user);
    } catch (err) {
        res.status(500).send("ERROR: " + err.message);
    }
});
router.delete("/profile/delete", userAuth, async (req, res) => {
    const { _id } = req.user
    try {
        const user = await User.findByIdAndDelete({ _id: _id });
        if (user == null) res.status(404).send("User not found!");
        else res.status(200).send("User deleted succesfully");
    } catch (err) {
        res.send("something went wrong!!!");
    }
});

router.patch("/profile/edit", userAuth, async (req, res) => {
    const user = req.user;
    try {

        validateEditProfile(req);

        Object.keys(req.body).forEach((keys) => (user[keys] = req.body[keys]));
        await user.save();
        res.status(200).send(`${user.firstName}, your profile is updated successfully!`);
    } catch (err) {
        res.status(400).send("ERROR: " + err.message);
    }
});

router.patch("/profile/changePassword", userAuth, async (req, res) => {
    try {
        const user = req.user;
        if (!user) {
            return res.status(400).json({ error: "Please login again" });
        }
        const ALLOWED_UPDATES = [
            "oldPassword","newPassword",
        ];
    
        const isUpdateAllowed = Object.keys(req.body).every((k) => ALLOWED_UPDATES.includes(k));
        if (!isUpdateAllowed) {
            throw new Error("Update is not allowed!");
        }

        const { oldPassword, newPassword } = req.body;
        if(!validator.isStrongPassword)
        {
            throw new Error("Password is not strong.");
        }
        const isPasswordValid = await user.validatePassword(oldPassword);
        if (!isPasswordValid) {
            throw new Error("Invalid Password");
        }
        const passwordHash = await bcrypt.hash(newPassword, 10);
        user.password = passwordHash;
        await user.save();
        res.status(200).send("Password Updated successfully");
    } catch (err) {
        res.status(400).json({ error: err.message });
    }
});

app.get("/api/v1/users/:userId", async(req, res) => {
    try {
        //Getting the userId from the request params
        const userId = req.params.userId;

        //Test case 1:-

        if(!userId){
            throw new Error("Please enter userId");
        }

        const string = new RegExp(/^[a-z0-9]+$/i);
        const isValidUserId = string.test(userId);


        const user = await User.findOne({username: userId});
        if(!user)
        {
            throw new Error("No user found with this username.")
        }
        res.status(200).json({
            message: user,
        })
    } catch(err) {
        res.status(400).json({
            error: err.message,
        });
    };
});

module.exports = router;