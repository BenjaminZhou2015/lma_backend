const mongoose = require("./db.js");
const { number } = require("joi");
var LocationSchema = mongoose.Schema({
    name: String,
    email: {
        type: String
    },
    defaultRunningTime: {
        type: Number,
        default: 50
    },
    defaultReservationExpireTime: {
        type: Number,
        default: 15
    },
    defaultPickupTime: {
        type: Number,
        default: 20
    }
})
LocationSchema.set('versionKey', false)

module.exports = mongoose.model("Location", LocationSchema, "locations");