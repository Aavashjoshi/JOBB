import mongoose from "mongoose";

const userSchema = new mongoose.Schema({
    fullname: {
        type: String,
        required: true
    },
    email: {
        type: String,
        required: true,
        unique: true
    },
    phoneNumber: {
        type: Number,
        required: true
    },
    password: {
        type: String,
        required: true,
    },
    role: {
        type: String,
        enum: ['student', 'recruiter'],
        required: true
    },
    profile: {
        bio: { type: String },
        skills: [{ type: String }],
        resume: { type: String }, // URL to resume file
        resumeOriginalName: { type: String },
        company: { type: mongoose.Schema.Types.ObjectId, ref: 'Company' },
        profilePhoto: {
            type: String,
            default: ""
        }
    },
    isEmailVerified: { 
        type: Boolean, 
        default: false // New field to track email verification status
    },
    emailOTP: { 
        type: String // New field to store the OTP 
    },
    emailOTPExpiry: { 
        type: Date // New field to store OTP expiry time
    },
}, { timestamps: true });

export const User = mongoose.model('User', userSchema);
