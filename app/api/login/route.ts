import {connect} from "@/db/dbConfig";
import User from "@/models/users.models.js";
import {NextResponse,NextRequest} from "next/server";
import bcrypt from "bcryptjs";
import jwt from "jsonwebtoken";

connect();

export async function POST(request: NextRequest) {
    try {
        const {username,password} = await request.json();
        if(!username){
            return NextResponse.json(
                {message: "Name is required"},
                {status: 400}
            );
        }
        if(!password){
            return NextResponse.json(
                {message: "Password is required"},
                {status: 400}
            );
        }
        const user = await User.findOne({username});
        if(!user){
            return NextResponse.json(
                {message: "User does not exist"},
                {status: 401}
            );
        }
        const isPasswordCorrect = await bcrypt.compare(password, user.password);
        if(!isPasswordCorrect){
            return NextResponse.json(
                {message: "Invalid credentials"},
                {status: 402}
            );
        }
        const tokendata = {
            id: user._id,
            username: user.username,
            email: user.email,
            isVerified: user.isVerified
        }
        const token = jwt.sign(tokendata, process.env.TOKEN_SECRET!, {expiresIn: '1d'});
        const response = NextResponse.json(
            {message: "Login successful"},
            {status: 200}
        );
        response.cookies.set("token", token, {httpOnly: true,});
        return response;

    }catch (error) {
        console.log("Error in login", error);
        return NextResponse.json(
            {message: "Internal Server Error"},
            {status: 500}
        );
    }
}