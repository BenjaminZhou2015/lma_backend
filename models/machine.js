const mongoose = require("./db.js");
const { boolean } = require("joi");

const MachineSchema = mongoose.Schema({
    sn: {
        type: String,
        required: true
    },
    isAvailable: Boolean,
    isReserved: {
        type: Boolean,
        default: false
    },
    //for machine which is not picked up by user who use it 
    //related function:updateNonPickupMachineStatus
    isPickedUp: {
        type: Boolean,
        default: true
    },
    machineType: String, // washer, dryer
    startTime: {
        type: Date,
        default: Date.UTC(1970, 0, 1)
    },
    userID: String,
    userReservedID: String,
    locationID: String,
    scanString: String  //base64(id)
});
MachineSchema.set('versionKey', false)
module.exports = mongoose.model("Machine", MachineSchema, "machines");


