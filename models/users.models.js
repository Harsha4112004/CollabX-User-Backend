import mongoose from "mongoose";

const userschema = new mongoose.Schema(
  {
    username: {
      type: String,
      required: [true, "please provide username"],
      unique: true,
    },
    email: {
      type: String,
      required: [true, "please provide email"],
      unique: true,
    },
    password: { type: String, required: [true, "please provide password"] },
    isVerified: { type: Boolean, default: false },
    isAdmin: { type: Boolean, default: false },

    // JWT-based tokens (optional, can keep for password reset links)
    forgotPasswordToken: { type: String },
    forgotPasswordExpiry: { type: Date },
    verifyToken: { type: String },
    verifyTokenExpiry: { type: Date },

    // OTP fields for email verification
    verifyOtp: { type: String },
    verifyOtpExpiry: { type: Date },

    // OTP fields for password reset (optional)
    resetOtp: { type: String },
    resetOtpExpiry: { type: Date },
  },
  { timestamps: true }
);

const User = mongoose.models.Users || mongoose.model("Users", userschema);
export default User;
