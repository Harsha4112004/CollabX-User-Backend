import {NextResponse} from "next/server";
export async function GET() {
    try {
        const response = NextResponse.json(
            {message: "Logout successful"},
            {status: 200}
        );
        response.cookies.set("token", "", {
          httpOnly: true,
          secure: true,     
          sameSite: "none", 
          path: "/",        
          expires: new Date(0),
        });

        return response;
    } catch (error) {
        console.log("Error in logout", error);
        return NextResponse.json(
            {message: "Internal Server Error"},
            {status: 500}
        );
    }
}
