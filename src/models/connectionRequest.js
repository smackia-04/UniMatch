const { Schema, model } = require("mongoose");
const User = require("./user");

const connectionRequest = new Schema(
    {
        fromUserId: {
            type: Schema.Types.ObjectId,
            required: true,
            ref: User,
        },
        toUserId: {
            type: Schema.Types.ObjectId,
            required: true,
            ref: User,
        },
        status: {
            type: String,
            required: true,
            enum: {
                values: ["interested", "ignored", "accepted", "rejected", "pending"],
                message: `{VALUE} is not supported`,
            },
        },
    },
    { timestamps: true },
);

connectionRequest.index({fromUserId: 1, toUserId: 1});

connectionRequest.pre("save", function(next) {
    const request = this;
    if(request.fromUserId.equals(request.toUserId))
    {
        throw new Error("You can't send connection request to yourself");
    }
    next();
});

const ConnectionRequest = model("ConnectionRequest", connectionRequest);
module.exports = ConnectionRequest;