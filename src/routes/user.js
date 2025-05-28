const express = require("express");
const router = express.Router();
const { userAuth } = require("../middlewares/auth");
const ConnectionRequest = require("../models/connectionRequest");
const User = require("../models/user");
const USER_SAFE_DATA = "firstName lastName userName age gender photoURL about skills";

router.get("/user/requests/received", userAuth, async(req, res) => {
    try {
        const loggedInUser = req.user;
        if(!loggedInUser) {
            throw new Error("Unauthorised! Please login again.");
        }
        
        const connectionRequests = await ConnectionRequest.find({
            toUserId: loggedInUser._id,
            status: "interested",
        }).populate("fromUserId", ["firstName", "lastName", "userName", "age", "gender", "photoURL", "about", "skills"]);
        if(!connectionRequests) {
            throw new Error("Sorry, no new request found.");
        };
        res.status(200).json({
            message: "Data is fetched successfully",
            data: connectionRequests,
        });
    } catch (err) {
        res.status(400).json({
            error: err.message,
        });
    }
});

router.get("/user/requests/sent", userAuth, async(req, res) => {
    try {
        const loggedInUser = req.user;
        if (!loggedInUser) {
            return res
              .status(401)
              .json({ error: "Unauthorized. Please login again." });
          }
      
          const requestSent = await ConnectionRequest.find({
            fromUserId: loggedInUser._id,
            status: "interested",
          }).populate("fromUserId toUserId", [
            "firstName",
            "lastName",
            "userName",
            "about",
            "skills",
            "gender",
            "photoURL",
          ]);
          if(!requestSent)
          {
            throw new Error("No request sent!");
          }
          res.status(200).json({ message: requestSent });
    } catch(err) {
        res.status(400).json({error : err.message});
    }
});

router.get("/user/connections", userAuth, async(req, res) => {
    try {
        const loggedInUser = req.user;
        if(!loggedInUser){
            throw new Error("Unauthorised! Please login again.");
        };

        const connections = await ConnectionRequest.find({
            $or: [
                { toUserId: loggedInUser._id, status: "accepted"},
                { fromUserId: loggedInUser._id, status: "accepted"},
            ],
        }).populate("fromUserId toUserId", USER_SAFE_DATA );
        if(!connections) {
            throw new Error("No connections found!");
        }
        const data = connections.map((row) => {
            if(row.fromUserId._id.equals(loggedInUser._id)) return row.toUserId;
            else return row.fromUserId;
        });
        res.status(200).send({connections: data});
    } catch(err) {
        res.status(400).json({error: err.message});
    }
});

router.get(
    "/user/feed",
    userAuth,
    async (req, res) => {
        try {
            const loggedInUser = req.user;
            //User should see any card except:
            //- his own
            //- his connections
            //- the one he ignored
            //- already sent the connection request
            if(!loggedInUser) throw new Error("Unauthorised access! Please login again.");

            const connectionRequests = await ConnectionRequest.find({
                $or: [
                    {fromUserId: loggedInUser._id},
                    {toUserId: loggedInUser._id},
                ]
            }).select("fromUserId toUserId");

            const page = parseInt(req.query.page) < 1 ? 1 : parseInt(req.query.page) || 1;
            const limit = parseInt(req.query.limit) > 50 
            ? 50 
            : parseInt(req.query.limi) < 1 
            ? 1
            : parseInt(req.query.limit) || 10; 

            const hideUsersFromFeed = new Set();

            connectionRequests.forEach((req) => {
                hideUsersFromFeed.add(req.fromUserId.toString());
                hideUsersFromFeed.add(req.toUserId.toString());
            });
            const feedUsers = await User.find({
                $and: [
                    {_id: {$nin: Array.from(hideUsersFromFeed)}},
                    {_id: {$ne: loggedInUser._id}},
                ]
            })
            .select([
                "firstName",
                "lastName",
                "age",
                "gender",
                "userName",
                "about",
                "skills",
            ])
            .skip((page-1)*limit)
            .limit(limit);


            res.status(200).json({
                message: "Users are fetched successfully",
                data: feedUsers,
            })
        } catch(err) {
            res.status(400).json({
                error: err.message,
            })
        }
    },
);

module.exports = router;