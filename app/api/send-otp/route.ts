import { NextResponse } from 'next/server';
import { sendMail } from '@/helpers/sendmail';
import User from '@/models/users.models';
import { connect } from '@/db/dbConfig';

connect();

export async function POST(request: Request) {
  try {
    const { emailType, email } = await request.json();

    // Validate request
    if (!emailType || !email) {
      return NextResponse.json({ message: "Invalid request" }, { status: 400 });
    }

    // Find user
    const user = await User.findOne({ email });
    if (!user) {
      return NextResponse.json({ message: "User not found" }, { status: 404 });
    }

    const userId = user._id;

    // Send email
    await sendMail({ email, emailType, userId });

    return NextResponse.json({ message: "Email sent successfully" }, { status: 200 });
  } catch (error) {
    console.error("Error sending email:", error);
    return NextResponse.json({ message: "Internal Server Error" }, { status: 500 });
  }
}
