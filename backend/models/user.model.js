import mongoose from "mongoose";

const user = new mongoose.Schema({
    username: {
        type: String,
        required: true
    },
    phone: {
        type: String,
        required: true
    },
    email: {
        type: String,
        required: true
    },
    password: {
        type: String,
        required: true
    },
    birthday: {
        type: Date,
        required: true
    },
    gender: {
        type: String,
        enum: ["male", "female", "others"]
    }
}, {timestamps: true});

const User = mongoose.model('User', user);

export default User;