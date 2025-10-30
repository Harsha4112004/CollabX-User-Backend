import { NextRequest,NextResponse } from "next/server";
import jwt from "jsonwebtoken";

export function getDataFromToken(req: NextRequest) {
    try {
        const token = req.cookies.get("token")?.value || "";
        if (!token) {
            return null;
        }
        const decoded = jwt.verify(token, process.env.TOKEN_SECRET!);
        if (typeof decoded === "object" && decoded !== null && "id" in decoded) {
            return (decoded as jwt.JwtPayload).id;
        }
        return null;

}catch (error) {
        console.log("Error in getDataFromToken", error);
        return null;
    }
}