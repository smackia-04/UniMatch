const validator = require("validator");
const User = require("../models/user");

const validateSignUpData = (req) => {
    const { firstName, lastName, emailId, password, photoURL, age } = req.body;

    if (!firstName || !lastName) {
        throw new Error("Please enter a valid name!");
    }
    if (!validator.isEmail(emailId)) {
        throw new Error("Invalid Email Id:" + email);
    }
    if (!validator.isStrongPassword(password)) {
        throw new Error("Password must conatains 1 Uppercase, 1 Lowercase, and 1 Number and 1 symbol and should be atleast 8 characters");
    };
    if (photoURL && !validator.isURL(photoURL)) {
        throw new Error("Invalid URL:" + photoURL);
    };
    if (age < 18) {
        throw new Error("Your age should be more than 18!");
    }
};

const validateEditProfile = (req) => {
    const ALLOWED_UPDATES = [
        "firstName", "lastName", "age", "gender", "emailId", "about", "skills", "photoURL", "dateOfBirth"
    ];

    const isUpdateAllowed = Object.keys(req.body).every((k) => ALLOWED_UPDATES.includes(k));

    if (!isUpdateAllowed) {
        throw new Error("Update is not allowed!");
    }
};

module.exports = { 
    validateSignUpData,
    validateEditProfile,
};