import { NextFetchEvent, NextRequest, NextResponse } from "next/server";
import { jwtVerify, generateSecret } from "jose";
import { USER_TOKEN, JWT_SECRET_KEY } from "constants/auth";

export async function middleware(req: NextRequest, ev: NextFetchEvent) {
  try {
    const token = req.cookies[USER_TOKEN];
    const secret = await generateSecret("HS256");
    const data = await jwtVerify(
      token,
      new TextEncoder().encode(JWT_SECRET_KEY)
    );
    // Set values in redux store
    // TODO:
  } catch (err) {
    return NextResponse.redirect(new URL("/", req.url));
  }
}
