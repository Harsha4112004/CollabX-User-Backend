import nodemailer from "nodemailer";
import User from "@/models/users.models";

export const sendMail = async ({
  email,
  emailType,
  userId,
}: {
  email: string;
  emailType: "VERIFY" | "RESET";
  userId: string;
}) => {
  try {
    // Generate 6-digit OTP
    const otp = Math.floor(100000 + Math.random() * 900000).toString();

    // Save OTP and expiry (5 mins)
    const otpExpiry = Date.now() + 5 * 60 * 1000; // 5 minutes

    if (emailType === "VERIFY") {
      await User.findByIdAndUpdate(userId, {
        verifyOtp: otp,
        verifyOtpExpiry: otpExpiry,
      });
    } else if (emailType === "RESET") {
      await User.findByIdAndUpdate(userId, {
        resetOtp: otp,
        resetOtpExpiry: otpExpiry,
      });
    }

    // Create transporter
    const transport = nodemailer.createTransport({
      host: "smtp.gmail.com",
      port: 465,
      secure: true,
      auth: {
        user: process.env.USER,     // your Gmail (or custom domain)
        pass: process.env.PASSWORD, // App Password (not raw Gmail password)
      },
    });

    // Email body content
    const subject =
      emailType === "VERIFY"
        ? "Your Verification Code"
        : "Password Reset Code";

    const html = `
      <div style="font-family: Arial, sans-serif; padding: 10px;">
        <h2>${subject}</h2>
        <p>Your OTP code is:</p>
        <h1 style="color:#4f46e5; letter-spacing: 4px;">${otp}</h1>
        <p>This code will expire in <strong>5 minutes</strong>.</p>
        <p>If you didn't request this, you can ignore this email.</p>
      </div>
    `;

    // Send the email
    const res = await transport.sendMail({
      from: `"Autobots Omega" <${process.env.USER}>`,
      to: email,
      subject,
      html,
    });

    console.log("OTP Email sent:", res.messageId);
    return res;
  } catch (error) {
    console.error("Error sending OTP email:", error);
    throw new Error("Failed to send OTP email");
  }
};
