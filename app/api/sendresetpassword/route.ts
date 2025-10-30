import { NextResponse,NextRequest } from "next/server";
import { sendMail } from "@/helpers/sendmail";
import { connect } from "@/db/dbConfig";
import User from "@/models/users.models";
connect();

export async function POST(request: NextRequest) {
    try {
        const reqBody = await request.json();
        const { emailType, email } = reqBody;
        if (!emailType || !email) {
            return NextResponse.json({ message: "Invalid request" }, { status: 400 });
        }
        const user = await User.findOne({ email });
        if (!user) {
            return NextResponse.json({ message: "User not found" }, { status: 404 });
        }
        const userId = user._id;
        await sendMail({ email, emailType, userId });
        return NextResponse.json({ message: "Email sent successfully" }, { status: 200 });

    }catch (error:any) {
        console.log(error);
        return NextResponse.json({ message: "Internal Server Error" }, { status: 500 });
    }
}