import { getDataFromToken } from "@/helpers/getDataFromToken";
import { NextRequest, NextResponse } from "next/server";
import User from "@/models/users.models";
import {connect} from "@/db/dbConfig"
connect();
export async function GET(request: NextRequest) {
    try {
        const id = await getDataFromToken(request);
        if (!id) {
            return NextResponse.json({ message: "Unauthorized" }, { status: 401 });
        }
        const user = await User.findById(id).select("-password -__v -isAdmin");
        return NextResponse.json(user);
    } catch (error) {
        return NextResponse.json({ message: "Internal server error" }, { status: 500 });
    }
}