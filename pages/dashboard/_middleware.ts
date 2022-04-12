import { NextFetchEvent, NextRequest, NextResponse } from "next/server";
import { jwtVerify, generateSecret } from "jose";
import {
  USER_TOKEN_COOKIE,
  NON_SENSITIVE_INFO_USER_COOKIE,
  JWT_SECRET_KEY,
} from "constants/auth";
import authService from "services/authService";

export async function middleware(req: NextRequest, ev: NextFetchEvent) {
  try {
    const token = req.cookies[USER_TOKEN_COOKIE];
    const secret = await generateSecret("HS256");
    const data = await jwtVerify(
      token,
      new TextEncoder().encode(JWT_SECRET_KEY)
    );

    const nonSensitiveInfoUser =
      authService.getNonSensitiveInfoUserFromToken(data);
    if (nonSensitiveInfoUser) {
      return NextResponse.next().cookie(
        NON_SENSITIVE_INFO_USER_COOKIE,
        JSON.stringify(nonSensitiveInfoUser)
      );
    }
  } catch (err) {
    return NextResponse.redirect(new URL("/", req.url));
  }
}
