import { User } from "../models/user.model.js";
import { sendEmail } from "../utils/email.js"; // Import the email utility
import bcrypt from "bcryptjs";
import jwt from "jsonwebtoken";
import getDataUri from "../utils/datauri.js";
import cloudinary from "../utils/cloudinary.js";
import { Application } from "../models/application.model.js";

// User Registration
export const register = async (req, res) => {
    try {
        const { fullname, email, phoneNumber, password, role } = req.body;

        // Validate required fields
        if (!fullname || !email || !phoneNumber || !password || !role) {
            return res.status(400).json({
                message: "Something is missing.",
                success: false,
            });
        }

        // Check if file exists
        const file = req.file;
        if (!file) {
            return res.status(400).json({
                message: "Profile photo is required.",
                success: false,
            });
        }

        // Convert file to Data URI
        const fileUri = getDataUri(file);

        // Upload profile photo to Cloudinary
        let cloudResponse;
        try {
            cloudResponse = await cloudinary.uploader.upload(fileUri.content);
        } catch (err) {
            console.error("Cloudinary upload error:", err);
            return res.status(500).json({
                message: "Failed to upload profile photo to Cloudinary.",
                success: false,
            });
        }

        // Check if the user already exists
        const existingUser = await User.findOne({ email });
        if (existingUser) {
            return res.status(400).json({
                message: "User already exists with this email.",
                success: false,
            });
        }

        // Hash the password
        const hashedPassword = await bcrypt.hash(password, 10);

        // Generate OTP
        const otp = Math.floor(100000 + Math.random() * 900000);
        const otpExpiry = Date.now() + 10 * 60 * 1000; // OTP valid for 10 minutes

        // Create new user
        await User.create({
            fullname,
            email,
            phoneNumber,
            password: hashedPassword,
            role,
            profile: {
                profilePhoto: cloudResponse.secure_url,
            },
            emailOTP: otp.toString(),
            emailOTPExpiry: otpExpiry,
        });

        // Send OTP email
        const emailSubject = "Email Verification - Your OTP Code";
        const emailText = `Hello ${fullname},\n\nYour OTP for email verification is: ${otp}\nThis OTP will expire in 10 minutes.`;
        await sendEmail(email, emailSubject, emailText);

        return res.status(201).json({
            message: "Account created successfully. Please verify your email.",
            success: true,
        });
    } catch (error) {
        console.error("Register error:", error);
        return res.status(500).json({
            message: "Internal server error.",
            success: false,
        });
    }
};

// Email OTP Verification
export const verifyEmailOTP = async (req, res) => {
    try {
        const { email, otp } = req.body;

        // Find user by email
        const user = await User.findOne({ email });
        if (!user) {
            return res.status(400).json({
                message: "User not found.",
                success: false,
            });
        }

        // Check if OTP has expired
        if (Date.now() > user.emailOTPExpiry) {
            return res.status(400).json({
                message: "OTP has expired.",
                success: false,
            });
        }

        // Check if OTP matches
        if (user.emailOTP !== otp) {
            return res.status(400).json({
                message: "Invalid OTP.",
                success: false,
            });
        }

        // Mark email as verified
        user.isEmailVerified = true;
        user.emailOTP = null; // Clear OTP
        user.emailOTPExpiry = null; // Clear OTP expiry
        await user.save();

        return res.status(200).json({
            message: "Email successfully verified.",
            success: true,
        });
    } catch (error) {
        console.error("OTP verification error:", error);
        return res.status(500).json({
            message: "Internal server error.",
            success: false,
        });
    }
};

// User Login
export const login = async (req, res) => {
    try {
        const { email, password, role } = req.body;

        if (!email || !password || !role) {
            return res.status(400).json({
                message: "Something is missing.",
                success: false,
            });
        }

        // Find user by email
        let user = await User.findOne({ email });
        if (!user) {
            return res.status(400).json({
                message: "Incorrect email or password.",
                success: false,
            });
        }

        // Check password
        const isPasswordMatch = await bcrypt.compare(password, user.password);
        if (!isPasswordMatch) {
            return res.status(400).json({
                message: "Incorrect email or password.",
                success: false,
            });
        }

        // Check role
        if (role !== user.role) {
            return res.status(400).json({
                message: "Account doesn't exist with this role.",
                success: false,
            });
        }

        // Generate JWT token
        const token = jwt.sign({ userId: user._id }, process.env.SECRET_KEY, { expiresIn: "1d" });

        // Filter user data for response
        user = {
            _id: user._id,
            fullname: user.fullname,
            email: user.email,
            phoneNumber: user.phoneNumber,
            role: user.role,
            profile: user.profile,
        };

        return res.status(200)
            .cookie("token", token, { maxAge: 24 * 60 * 60 * 1000, httpOnly: true, sameSite: "strict" })
            .json({
                message: `Welcome back, ${user.fullname}!`,
                user,
                success: true,
            });
    } catch (error) {
        console.error("Login error:", error);
        return res.status(500).json({
            message: "Internal server error.",
            success: false,
        });
    }
};

// User Logout
export const logout = async (req, res) => {
    try {
        return res.status(200).cookie("token", "", { maxAge: 0 }).json({
            message: "Logged out successfully.",
            success: true,
        });
    } catch (error) {
        console.error("Logout error:", error);
        return res.status(500).json({
            message: "Internal server error.",
            success: false,
        });
    }
};

// Update User Profile
export const UpdateProfile = async (req, res) => {
    try {
        const { fullname, email, phoneNumber, bio, skills } = req.body;

        const file = req.file;

        // Upload file to Cloudinary if present
        let cloudResponse;
        if (file) {
            const fileUri = getDataUri(file);
            try {
                cloudResponse = await cloudinary.uploader.upload(fileUri.content);
            } catch (err) {
                console.error("Cloudinary upload error:", err);
                return res.status(500).json({
                    message: "Failed to upload file to Cloudinary.",
                    success: false,
                });
            }
        }

        const userId = req.id; // Middleware authentication
        let user = await User.findById(userId);

        if (!user) {
            return res.status(400).json({
                message: "User not found.",
                success: false,
            });
        }

        // Update user fields
        if (fullname) user.fullname = fullname;
        if (email) user.email = email;
        if (phoneNumber) user.phoneNumber = phoneNumber;
        if (bio) user.profile.bio = bio;
        if (skills) user.profile.skills = skills.split(",");

        if (cloudResponse) {
            user.profile.resume = cloudResponse.secure_url;
            user.profile.resumeOriginalName = file.originalname;
        }

        await user.save();

        return res.status(200).json({
            message: "Profile updated successfully.",
            user,
            success: true,
        });
    } catch (error) {
        console.error("Update profile error:", error);
        return res.status(500).json({
            message: "Internal server error.",
            success: false,
        });
    }
};

// Update Applicant Status
export const updateApplicantStatus = async (req, res) => {
    try {

        const { id, status } = req.params; // Get the applicant ID and status from params

        // Ensure valid status (success or rejection)
        if (!["accepted", "rejected"].includes(status)) {
            return res.status(400).json({
                message: "Invalid status. It should be either 'accepted' or 'rejected'.",
                success: false,
            });
        }
        const application = await Application.findOne({ _id: id }).populate('applicant');
        if (!application) {
            return res.status(404).json({
                message: "Application not found.",
                success: false
            })
        };

        // update the status
        application.status = status.toLowerCase();
        await application.save();






        // Send success/rejection email to the applicant
        const emailSubject = `Your application status is: ${status}`;
        const emailText = `Dear ${application.applicant.fullname},\n\nWe  inform you that your application has been ${status}.`;

        await sendEmail(application.applicant.email, emailSubject, emailText);

        return res.status(200).json({
            message: `Applicant status updated to "${status}" and email sent.`,
            success: true,
        });
    } catch (error) {
        console.error("Error updating applicant status:", error);
        return res.status(500).json({
            message: "Internal server error.",
            success: false,
        });
    }
};
