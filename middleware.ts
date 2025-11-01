// middleware.ts
import { NextResponse } from "next/server";

export function middleware(request: Request) {
  const origin = request.headers.get("origin") || "";

  // Allow only specific frontend(s)
  const allowedOrigins = [
    "http://localhost:5173",
    "https://your-frontend-domain.vercel.app",
  ];

  const isAllowedOrigin = allowedOrigins.includes(origin);

  // Handle preflight (OPTIONS) requests
  if (request.method === "OPTIONS") {
    const response = new NextResponse(null, { status: 204 });
    if (isAllowedOrigin) {
      response.headers.set("Access-Control-Allow-Origin", origin);
    }
    response.headers.set("Access-Control-Allow-Credentials", "true");
    response.headers.set("Access-Control-Allow-Methods", "GET, POST, PUT, DELETE, OPTIONS");
    response.headers.set("Access-Control-Allow-Headers", "Content-Type, Authorization");
    return response;
  }

  // Normal requests
  const response = NextResponse.next();
  if (isAllowedOrigin) {
    response.headers.set("Access-Control-Allow-Origin", origin);
  }
  response.headers.set("Access-Control-Allow-Credentials", "true");
  response.headers.set("Access-Control-Allow-Methods", "GET, POST, PUT, DELETE, OPTIONS");
  response.headers.set("Access-Control-Allow-Headers", "Content-Type, Authorization");

  return response;
}

// Apply this only to API routes
export const config = {
  matcher: "/api/:path*",
};
