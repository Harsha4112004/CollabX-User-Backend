import User from "@/models/users.models";
import { NextResponse, NextRequest } from "next/server";
import { connect } from "@/db/dbConfig";
import bcrypt from "bcryptjs";
import jwt from "jsonwebtoken";

connect();

export async function POST(request: NextRequest) {
  try {
    const reqBody = await request.json();
    const { token, password } = reqBody;

    if (!token) {
      return NextResponse.json({ message: "Invalid request" }, { status: 400 });
    }

    let decoded: any;
    try {
      decoded = jwt.verify(token, process.env.TOKEN_SECRET!);
    } catch (err) {
      return NextResponse.json({ message: "Invalid or expired token" }, { status: 400 });
    }

    const user = await User.findById(decoded.userId);
    if (!user) {
      return NextResponse.json({ message: "User not found" }, { status: 404 });
    }

    const isSamePassword = await bcrypt.compare(password, user.password);
    if (isSamePassword) {
      return NextResponse.json({ message: "New password cannot be same as old password" }, { status: 401 });
    }

    const hashedPassword = await bcrypt.hash(password, 10);
    user.password = hashedPassword;
    // Optional: invalidate token after use
    user.forgotPasswordToken = undefined;
    user.forgotPasswordExpiry = undefined;
    await user.save();

    return NextResponse.json({ message: "Password reset successfully" }, { status: 200 });
  } catch (error: any) {
    console.log(error);
    return NextResponse.json({ message: "Internal Server Error" }, { status: 500 });
  }
}
