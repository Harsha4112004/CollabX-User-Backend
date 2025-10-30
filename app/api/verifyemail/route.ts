import { connect } from "@/db/dbConfig";
import User from "@/models/users.models";
import { NextResponse, NextRequest } from "next/server";

connect();

export async function POST(request: NextRequest) {
  try {
    const { email, otp } = await request.json();

    const user = await User.findOne({ email });
    if (!user) return NextResponse.json({ message: "User not found" }, { status: 404 });

    if (
      !user.verifyOtp ||
      user.verifyOtp !== otp ||
      user.verifyOtpExpiry < new Date()
    ) {
      return NextResponse.json({ message: "Invalid or expired OTP" }, { status: 400 });
    }

    // OTP is valid
    user.isVerified = true;
    user.verifyOtp = undefined;
    user.verifyOtpExpiry = undefined;
    await user.save();

    return NextResponse.json({ message: "Email verified successfully" });
  } catch (error) {
    console.error(error);
    return NextResponse.json({ message: "Server error" }, { status: 500 });
  }
}
