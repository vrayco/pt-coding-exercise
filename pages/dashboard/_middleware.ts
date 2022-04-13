import { NextFetchEvent, NextRequest, NextResponse } from "next/server";
import { USER_TOKEN_COOKIE, USER_COOKIE } from "constants/auth";
import authApiService from "services/authApiService";

const JWT_SECRET_KEY = process.env.JWT_SECRET_KEY;

export async function middleware(req: NextRequest, ev: NextFetchEvent) {
  try {
    // TODO: What if token is expired, is it working?
    const token = req.cookies[USER_TOKEN_COOKIE];
    const user = await authApiService.getUserFromJWTToken(token);
    if (user) {
      return NextResponse.next().cookie(USER_COOKIE, JSON.stringify(user));
    }
  } catch (err) {
    return NextResponse.redirect(new URL("/", req.url));
  }
}
