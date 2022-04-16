import { NextFetchEvent, NextRequest, NextResponse } from "next/server";
import { USER_TOKEN_COOKIE } from "constants/auth";
import authApiService from "services/authApiService";

export async function middleware(req: NextRequest, ev: NextFetchEvent) {
  // Get the user from the cookie and verify the token.
  const token = req.cookies[USER_TOKEN_COOKIE];
  const user = await authApiService.getUserFromJWTToken(token);
  if (!user) {
    // Redirect the user to /signout to close the user's session.
    return NextResponse.redirect(new URL("/signout", req.url));
  }
}
