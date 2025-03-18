const jwt = require("jsonwebtoken");
const User = require("../models/user")

const userAuth = async (req, res, next) => {
    try {
        const { token } = req.cookies;
        if(!token) throw new Error("Invalid token!");
        const { _id } = jwt.verify(token, "Uni@Match$2025");
        const user = await User.findById(_id);
        if (!user) throw new Error("User Not Found");
        req.user = user;
        next();
    } catch (err) {
        res.status(400).send("ERROR: " + err.message);
    }
}

module.exports = { userAuth };