import nodemailer from "nodemailer";
import jwt from "jsonwebtoken";
import User from "@/models/users.models";

export const sendMail = async ({
  email,
  emailType,
  userId,
}: {
  email: string;
  emailType: "VERIFY" | "RESET";
  userId?: string;
}) => {
  try {
    // Always fetch user by email
    const user = await User.findOne({ email });
    if (!user) {
      throw new Error("User not found with that email");
    }

    let subject = "";
    let html = "";

    // Create transporter
    const transport = nodemailer.createTransport({
      host: "smtp.gmail.com",
      port: 465,
      secure: true,
      auth: {
        user: process.env.USER, // Gmail or SMTP username
        pass: process.env.PASSWORD, // App password
      },
    });

    // 🟢 Case 1: Email Verification (OTP)
    if (emailType === "VERIFY") {
      const otp = Math.floor(100000 + Math.random() * 900000).toString();
      const otpExpiry = Date.now() + 5 * 60 * 1000; // 5 minutes

      await User.findByIdAndUpdate(user._id, {
        verifyOtp: otp,
        verifyOtpExpiry: otpExpiry,
      });

      subject = "Your Verification Code";
      html = `
        <div style="font-family: Arial, sans-serif; padding: 10px;">
          <h2>${subject}</h2>
          <p>Your OTP code is:</p>
          <h1 style="color:#4f46e5; letter-spacing: 4px;">${otp}</h1>
          <p>This code will expire in <strong>5 minutes</strong>.</p>
          <p>If you didn't request this, you can ignore this email.</p>
        </div>
      `;
    }

    // 🔵 Case 2: Password Reset (JWT Link)
    else if (emailType === "RESET") {
      // Generate a short-lived JWT (15 min)
      const token = jwt.sign(
        { userId: user._id, email: user.email },
        process.env.JWT_SECRET as string,
        { expiresIn: "15m" }
      );

      // Create the reset link
      const resetLink = `${process.env.FRONTEND_URL}/reset-password?token=${token}`;

      // Save token (optional, can be used for invalidation)
      await User.findByIdAndUpdate(user._id, {
        resetToken: token,
        resetTokenExpiry: Date.now() + 15 * 60 * 1000,
      });

      subject = "Password Reset Request";
      html = `
        <div style="font-family: Arial, sans-serif; padding: 10px;">
          <h2>${subject}</h2>
          <p>Click the button below to reset your password:</p>
          <a href="${resetLink}" 
             style="display:inline-block;padding:12px 20px;background-color:#4f46e5;color:white;text-decoration:none;border-radius:6px;font-weight:bold;">
            Reset Password
          </a>
          <p>This link will expire in <strong>15 minutes</strong>.</p>
          <p>If you didn’t request a password reset, please ignore this email.</p>
        </div>
      `;
    }

    // ✉️ Send email
    const res = await transport.sendMail({
      from: `"CollabX" <${process.env.USER}>`,
      to: email,
      subject,
      html,
    });

    console.log("✅ Email sent:", res.messageId);
    return res;
  } catch (error) {
    console.error("❌ Error sending email:", error);
    throw new Error("Failed to send email");
  }
};
