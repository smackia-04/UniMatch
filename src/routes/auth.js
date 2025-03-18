const express = require("express");
const router = express.Router();
const User = require("../models/user");
const { validateSignUpData } = require('../utils/validator');
const bcrypt = require("bcrypt");
const validator = require("validator");

router.post("/signup", async (req, res) => {
    try {
        //Validation
        validateSignUpData(req);
        //Extraction
        const { firstName, lastName, emailId, password, photoURL, age, gender } = req.body;
        //Encryption
        const passwordHash = await bcrypt.hash(password, 10);

        const user = new User({
            firstName,
            lastName,
            age,
            gender,
            emailId,
            password: passwordHash,
        });
        await user.save();
        res.status(200).send("User Added successfully");
    } catch (err) {
        res.status(500).send("Error saving the user: " + err.message);
    }
});

router.post("/login", async (req, res) => {
    try {
        const { emailId, password } = req.body;
        if (!validator.isEmail(emailId) || !validator.isStrongPassword(password)) {
            throw new Error("Enter valid emailId and password!");
        };
        const user = await User.findOne({ emailId: emailId });
        if (!user) {
            throw new Error("User Not Found!");
        };
        const isPasswordValid = await user.validatePassword(password);
        if (isPasswordValid) {
            const token = await user.getJWT();
            res.cookie("token", token, {expires: new Date(Date.now() + 24*3600000)});
            res.status(200).send("You are succesfully logged in.");
        }
        else {
            throw new Error("Invalid credentials!");
        }

    } catch (err) {
        res.status(500).send("Error: " + err.message);
    }
});

router.post("/logout", async(req, res) => {
    res
    .cookie("token", null, {expires: new Date(Date.now())})
    .send("User logged out successfully");
});



module.exports = router;