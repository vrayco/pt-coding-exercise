import { NextFetchEvent, NextRequest, NextResponse } from "next/server";
import { USER_TOKEN_COOKIE, USER_COOKIE } from "constants/auth";
import authApiService from "services/authApiService";

export async function middleware(req: NextRequest, ev: NextFetchEvent) {
  const token = req.cookies[USER_TOKEN_COOKIE];
  const user = await authApiService.getUserFromJWTToken(token);
  if (!user) {
    return NextResponse.redirect(new URL("/signout", req.url));
  }
}
