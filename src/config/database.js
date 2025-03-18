const mongoose = require("mongoose");

const connectDB = async () => {
    await mongoose.connect("mongodb+srv://UniMatch:freeforall@cluster0.1ox5v.mongodb.net/");
}
module.exports = connectDB;
