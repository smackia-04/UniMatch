const express = require('express');
const connectDB = require("./config/database");
const app = express();
const port = 3000;

const User = require("./models/user");
const cookieParser = require("cookie-parser");

app.use(express.json());
app.use(cookieParser());

const authRouter = require("./routes/auth");
const profileRouter = require("./routes/profile");
const connectionRequestRouter = require("./routes/request");
const userConnections = require("./routes/userConnections");

app.use("/", authRouter);
app.use("/", profileRouter);
app.use("/", connectionRequestRouter);
app.use("/", userConnections);


app.get("/user", async (req, res) => {
    const userFirstName = req.body.firstName;
    try {
        const user = await User.find({ firstName: userFirstName });
        if (user?.length === 0) res.status(404).send("User Not Found!");
        else res.status(200).send(user);
    } catch (err) {
        res.status(500).send("Something went wrong" + err.message);
    }
});

app.get("/feed", async (req, res) => {
    try {
        const user = await User.find({});
        if (user?.length === 0) res.status(404).send("User Not Found!");
        else res.status(200).send(user);
    } catch (err) {
        res.status(500).send("Something went wrong" + err.message);
    }
});




connectDB()
    .then(() => {
        console.log('Database connection established...');
        app.listen(port, () => {
            console.log(`Server is successfully listening on port ${port}`);
        });
    })
    .catch((err) => {
        console.error("Database cannot be connected");
        console.log(err);
    });
