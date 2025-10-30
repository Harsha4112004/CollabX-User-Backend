import {connect} from "@/db/dbConfig";
import User from "@/models/users.models.js";
import {NextResponse,NextRequest} from "next/server";
import bcrypt from "bcryptjs";

connect();

export async function POST(request: NextRequest) {
    try {
        const {username, email, password} = await request.json();
        if(!username){
            return NextResponse.json(
                {message: "Name is required"},
                {status: 400}
            );
        }
        if(!email){
            return NextResponse.json(
                {message: "Email is required"},
                {status: 400}
            );
        }
        if(!password){
            return NextResponse.json(
                {message: "Password is required"},
                {status: 400}
            );
        }
        

        const existingUsername = await User.findOne({username});
        if(existingUsername){
            return NextResponse.json(
                {message: "User already exists"},
                {status: 401}
            );
        }
        const existingEmail = await User.findOne({email});
        if(existingEmail){
            return NextResponse.json(
                {message: "Email already exists"},
                {status: 402}
            );
        }   

        const hashedPassword = await bcrypt.hash(password, 10);
        const newUser = new User({
            username,
            email,
            password: hashedPassword,
        });
        await newUser.save();
        return NextResponse.json(
            {message: "User created successfully"},
            {status: 201}
        );
    } catch (error) {
        console.log("Error in signup route:", error);
        return NextResponse.json(
            {message: "Internal Server Error"},
            {status: 500}
        );
    }
}