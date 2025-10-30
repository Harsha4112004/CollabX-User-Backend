import { NextResponse } from 'next/server';
import { sendMail } from '@/helpers/sendmail';

export async function POST(request: Request) {
    try {
        const reqBody = await request.json();
        const { emailType, userId, email } = reqBody;

        if (!emailType || !userId || !email) {
            return NextResponse.json({ message: "Invalid request" }, { status: 400 });
        }
        await sendMail({ email, emailType, userId });
        return NextResponse.json({ message: "Email sent successfully" }, { status: 200 });
    } catch (error) {
        console.log(error);
        return NextResponse.json({ message: "Internal Server Error" }, { status: 500 });
    }
}
