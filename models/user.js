const mongoose = require("./db.js");
var UserSchema = mongoose.Schema({
    firstName: {
        type: String, trim: true

    },
    lastName: {
        type: String, trim: true
    },
    email: { type: String, trim: true },
    password: String,
    registerDate: {
        type: Date,
        default: new Date()
    },
    locationID: String
})
UserSchema.set('versionKey', false)

module.exports = mongoose.model("User", UserSchema, "users");