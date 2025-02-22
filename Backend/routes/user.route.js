import express from "express";
import {
    login,
    logout,
    register,
    verifyEmailOTP,
    UpdateProfile,
    updateApplicantStatus, // Import the new function
} from "../controllers/user.controller.js";
import isAuthenticated from "../middlewares/isAuthenticated.js";
import { singleUpload } from "../middlewares/multer.js";

const router = express.Router();

// User registration (with optional file upload)
router.route("/register").post(singleUpload, register);

// OTP verification
router.route("/verify-otp").post(verifyEmailOTP);

// User login
router.route("/login").post(login);

// User logout
router.route("/logout").get(logout);

// Update profile (requires authentication and file upload)
router.route("/profile/update").post(isAuthenticated, singleUpload, UpdateProfile);

// New route to update applicant status
router.route("/applicant/:id/status/:status").post(isAuthenticated, updateApplicantStatus); // Added this line

export default router;
