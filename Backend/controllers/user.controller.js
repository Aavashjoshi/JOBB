import { User } from "../models/user.model.js";
import bcrypt from "bcryptjs";
import jwt from "jsonwebtoken";
import { sendEmail } from "../utils/email.js"; // Import the email utility
import getDataUri from "../utils/datauri.js";
import cloudinary from "../utils/cloudinary.js";   
// User registration with OTP email verification
export const register = async (req, res) => {
    try {
        const { fullname, email, phoneNumber, password, role } = req.body;

        if (!fullname || !email || !phoneNumber || !password || !role) {
            return res.status(400).json({
                message: "Something is missing",
                success: false
            });
        }

        const user = await User.findOne({ email });
        if (user) {
            return res.status(400).json({
                message: 'User already exists with this email.',
                success: false,
            });
        }

        // Hash the password
        const hashedPassword = await bcrypt.hash(password, 10);

        // Generate OTP (6-digit)
        const otp = Math.floor(100000 + Math.random() * 900000); // Generates a 6-digit OTP
        const otpExpiry = Date.now() + 10 * 60 * 1000; // OTP expires in 10 minutes

        // Create the user with email verification fields
        const newUser = await User.create({
            fullname,
            email,
            phoneNumber,
            password: hashedPassword,
            role,
            emailOTP: otp.toString(), // Store OTP in the database
            emailOTPExpiry: otpExpiry, // Store OTP expiration time
        });

        // Send OTP email
        const emailSubject = "Email Verification - Your OTP Code";
        const emailText = `Hello ${fullname},\n\nYour OTP for email verification is: ${otp}\nThis OTP will expire in 10 minutes.`;
        await sendEmail(email, emailSubject, emailText);

        return res.status(201).json({
            message: "Account Created Successfully. Please verify your email.",
            success: true
        });
    } catch (error) {
        console.log(error);
        return res.status(500).json({
            message: "Internal server error.",
            success: false
        });
    }
};

// OTP verification function
export const verifyEmailOTP = async (req, res) => {
    try {
        const { email, otp } = req.body; // Get email and OTP from the request body

        const user = await User.findOne({ email });
        if (!user) {
            return res.status(400).json({
                message: "User not found.",
                success: false,
            });
        }

        // Check if the OTP has expired
        if (Date.now() > user.emailOTPExpiry) {
            return res.status(400).json({
                message: "OTP has expired.",
                success: false,
            });
        }

        // Check if the provided OTP is correct
        if (user.emailOTP !== otp) {
            return res.status(400).json({
                message: "Invalid OTP.",
                success: false,
            });
        }

        // OTP is valid, mark the email as verified
        user.isEmailVerified = true;
        user.emailOTP = null; // Clear OTP after verification
        user.emailOTPExpiry = null; // Clear OTP expiry time
        await user.save();

        return res.status(200).json({
            message: "Email successfully verified.",
            success: true,
        });
    } catch (error) {
        console.log(error);
        return res.status(500).json({
            message: "Internal server error.",
            success: false,
        });
    }
};

// User login
export const login = async (req, res) => {
    try {
        const { email, password, role } = req.body;
        if (!email || !password || !role) {
            return res.status(400).json({
                message: "Something is missing",
                success: false
            });
        };
        let user = await User.findOne({ email });
        if (!user) {
            return res.status(400).json({
                message: "Incorrect email or password.",
                success: false,
            });
        }
        const isPasswordMatch = await bcrypt.compare(password, user.password);
        if (!isPasswordMatch) {
            return res.status(400).json({
                message: "Incorrect email or password.",
                success: false,
            });
        }
        if (role !== user.role) {
            return res.status(400).json({
                message: "Account doesn't exist with current role.",
                success: false
            });
        };
        const tokenData = {
            userId: user._id
        }
        const token = await jwt.sign(tokenData, process.env.SECRET_KEY, { expiresIn: '1d' });

        user = {
            _id: user._id,
            fullname: user.fullname,
            email: user.email,
            phoneNumber: user.phoneNumber,
            role: user.role,
            profile: user.profile
        }

        return res.status(200).cookie("token", token, { maxAge: 1 * 24 * 60 * 60 * 1000, httpOnly: true, sameSite: 'strict' }).json({
            message: `Welcome back ${user.fullname}`,
            user,
            success: true
        })
    } catch (error) {
        console.log(error);
    }
}

// User logout
export const logout = async (req, res) => {
    try {
        return res.status(200).cookie("token", "", { maxAge: 0 }).json({
            message: "Logged out successfully.",
            success: true
        })
    } catch (error) {
        console.log(error);
    }
}

// Update user profile
export const UpdateProfile = async (req, res) => {
    try {
        const { fullname, email, phoneNumber, bio, skills } = req.body;

        const file = req.file;
        // Cloudinary image upload (resume/photo)
        const fileUri = getDataUri(file);
        const cloudResponse = await cloudinary.uploader.upload(fileUri.content);  

        let skillsArray;
        if (skills) {
            skillsArray = skills.split(",");
        }

        const userId = req.id; // Middleware authentication

        let user = await User.findById(userId);

        if (!user) {
            return res.status(400).json({
                message: "User Not Found.",
                success: false
            })
        }

        // Update user data
        if (fullname) user.fullname = fullname;
        if (email) user.email = email;
        if (phoneNumber) user.phoneNumber = phoneNumber;
        if (bio) user.profile.bio = bio;
        if (skills) user.profile.skills = skillsArray;

        // Upload resume and save
        if (cloudResponse) {
            user.profile.resume = cloudResponse.secure_url; // Save the Cloudinary URL
            user.profile.resumeOriginalName = file.originalname; // Save the original file name
        }
        
        await user.save();

        user = {
            _id: user._id,
            fullname: user.fullname,
            email: user.email,
            phoneNumber: user.phoneNumber,
            role: user.role,
            profile: user.profile
        }

        return res.status(200).json({
            message: "Profile Updated Successfully.",
            user,
            success: true
        })
    } catch (error) {
        console.log(error);
    }
}