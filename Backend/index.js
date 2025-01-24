import express from "express";
import cookieParser from "cookie-parser";
import cors from "cors";
import dotenv from "dotenv";
import connectDB from "./utils/db.js";
import userRoute from "./routes/user.route.js";
import CompanyRoute from "./routes/company.route.js";
import jobRoute from "./routes/job.route.js";
import { sendEmail } from "./utils/email.js"; // Import your email utility

dotenv.config(); // Load environment variables

const app = express();

// Middleware
app.use(express.json());
app.use(express.urlencoded({ extended: true }));
app.use(cookieParser());

// CORS setup
const corsOptions = {
    origin: 'http://localhost:5173', // Replace with your frontend URL in production
    credentials: true,
};
app.use(cors(corsOptions));

// Logging for debugging
console.log("EMAIL_USER:", process.env.EMAIL_USER || "undefined");
console.log("EMAIL_PASS:", process.env.EMAIL_PASS || "undefined");

// Route configurations
const PORT = process.env.PORT || 3000;

app.use("/api/v1/user", userRoute);
app.use("/api/v1/company", CompanyRoute);
app.use("/api/v1/job", jobRoute);

// Test Email Route
app.get("/test-email", async (req, res) => {
    try {
        // Replace with your test recipient email
        const testRecipient = "joshiaavash111@gmail.com";
        const testSubject = "Test Email from Nodemailer";
        const testText = "This is a test email to verify Nodemailer functionality.";

        await sendEmail(testRecipient, testSubject, testText);

        res.status(200).send("Test email sent successfully!");
    } catch (error) {
        console.error("Error sending test email:", error);
        res.status(500).send("Failed to send test email.");
    }
});

// Start the server
app.listen(PORT, async () => {
    try {
        await connectDB(); // Ensure the database connection is successful
        console.log(`Connected to MongoDB`);
        console.log(`Server running at port ${PORT}`);
    } catch (error) {
        console.error("Error connecting to MongoDB:", error);
        process.exit(1); // Exit the process if DB connection fails
    }
});
