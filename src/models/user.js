const mongoose = require("mongoose");
const validator = require("validator");
const jwt = require("jsonwebtoken");
const bcrypt = require("bcrypt");

const userSchema = new mongoose.Schema({
    firstName: {
        type: String,
        required : true,
        trim: true,
        maxLength: [25, "First name too large"],
      match: /^[a-zA-Z]+$/,
    },
    lastName: {
        type: String,
        trim: true,
        maxLength: [25, "Last name too large"],
      match: /^[a-zA-Z]+$/,
    },
    age: {
        type: Number,
        get: function () {
            if (!this.dateOfBirth) return null;
            const diff = Date.now() - this.dateOfBirth.getTime();
            return Math.floor(diff / (365.25 * 24 * 60 * 60 * 1000));
          },
        validate(value) {
            if(value < 18)
                {
                    throw new Error("Your age should be more than 18!")
                }
            },
    },
    gender:{
        type: String,
        default: "male",
        lowercase: true,
        enum: ["male", "female", "other"],
    },
    dateOfBirth: {
        type: Date,
    },
    emailId: {
        type: String,
        unique: true,
        lowercase: true,
        required: true,
        trim: true,
        minLength: [3, "Email too small"],
        maxLength: [30, "Email too large"],
        validate(value) {
            if(!validator.isEmail(value))
            {
                throw new Error("Invalid Email Id:" + value);
            };
        }
    },
    password: {
        type: String,
        required: true,
        validate(val) {
            if(!validator.isStrongPassword(val))
            {
                throw new Error("Password must conatains 1 Uppercase, 1 Lowercase, and 1 Number and 1 symbol and should be atleast 8 characters");
            };
        }
    },
    about: {
        type: String, 
        default: "Write about yourself here!",
        maxLength: [500, "Too many words"],
        trim: true,

    },
    photoURL: {
        type: String,
        validate(val) {
            if(!validator.isURL(val))
            {
                throw new Error("Invalid URL:" + val);
            };
        }
    },
    skills: {
        type: [String],
        validate(arr) {
            if(arr.length > 5)
            {
                throw new Error("You can't add more than 5 skills");
            }
        },
    },
    
},
{
    timestamps: true
},
);

userSchema.index({emailId: 1});

userSchema.methods.getJWT = async function() {
    const user = this;
    const token = await jwt.sign({ _id: user._id }, "Uni@Match$2025", {expiresIn: "1d"});

    return token;
}
userSchema.methods.validatePassword = async function (password) {
    const isPasswordValid = await bcrypt.compare(password, this.password);
    return isPasswordValid;
}

const User = mongoose.model("User", userSchema);
module.exports = User;