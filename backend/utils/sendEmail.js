 import nodemailer from "nodemailer";
import dotenv from "dotenv";

dotenv.config();
console.log(process.env.EMAIL, process.env.APP_PASSWORD);
const sendEmail = async (options) => {
  // --- Transporter তৈরি ---
  const transporter = nodemailer.createTransport({
    host: process.env.SMTP_HOST,
    port: parseInt(process.env.SMTP_PORT),
    secure: process.env.SMTP_PORT == 465, // 465 হলে SSL, 587 হলে TLS
    auth: {
      user: process.env.EMAIL,
      pass: process.env.APP_PASSWORD,
    },
  });

  // --- Message ---
  const message = {
    from: `${process.env.SMTP_FROM_NAME} <${process.env.SMTP_FROM_EMAIL}>`,
    to: options.email,
    subject: options.subject,
    html: options.message, // HTML body
  };

  try {
    await transporter.sendMail(message);
    console.log(`✅ Email sent to ${options.email}`);
  } catch (error) {
    console.error("❌ Email send failed:", error);
    throw error;
  }
};

 
export default sendEmail;
