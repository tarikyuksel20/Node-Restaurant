const mongoose = require("mongoose");

const courierSchema = new mongoose.Schema({
    courier_id: {
        type: Number,
        unique: true,
        required: true
    },
    courier_name: {
        type: String,
        required: true
    },
    courier_email: {
        type: String,
        required: true,
        unique: true
    },
    courier_password: {
        type: String,
        required: true
    },
    courier_phone: {
        type: String,
        required: true
    },
    // Array to store chosen restaurants, references Restaurant model
    choose_restaurant: [{
        type: mongoose.Schema.Types.ObjectId,
        ref: 'Restaurant'
    }]
});

module.exports = mongoose.model("Courier", courierSchema);
