import nodemailer from "nodemailer";

// Create a transporter for sending emails using Gmail (or any other provider)
const transporter = nodemailer.createTransport({
  service: "gmail", // You can use other email providers, e.g., "outlook" or "smtp"
  auth: {
    user: 'a23251928@gmail.com', // Your email address
    pass:'kqpy cniw jrhh btse' // Your email password or app-specific password
  },
});

// Function to send the email
export const sendEmail = (to, subject, text) => {
  const mailOptions = {
    from: process.env.EMAIL_USER, // Sender address (your email)
    to, // Recipient's email
    subject, // Subject of the email
    text, // Body text of the email
  };

  // Send email using the transporter
  return transporter.sendMail(mailOptions);
};
