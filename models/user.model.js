const mongoose = require("mongoose");
const Schema = mongoose.Schema;


const userSchema = new Schema({
    email: {
        type: String,
        required: true,
        unique: true,
        trim: true,
        match: [/^\w+([\.-]?\w+)*@\w+([\.-]?\w+)*(\.\w{2,3})+$/, 'Please fill a valid email address']
    },
    password: {
        type: String,
        required: true,
        trim: true
    },
    firstName: {
        type: String,
        required: true,
        trim: true
    },
    lastName: {
        type: String,
        trim: true
    },
    contacts: {
        phoneNumber: { type: String },
        otherContact: { type: String },
        instagramAccount: { type: String }
    },
    firstLogin: { type: Boolean },
    isActive: {
        required: true,
        type: Boolean
    }
    //Add here more info in the schema
}, {
    timestamps: true,
})

const User = mongoose.model("User", userSchema);

module.exports = User; 