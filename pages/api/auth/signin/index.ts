import type { NextApiRequest, NextApiResponse } from "next";
import { Credentials, SiginApiResponse } from "types";
import authApiService from "services/authApiService";
import usersApiService from "services/usersApiService";
import { SignJWT } from "jose";
import { nanoid } from "nanoid";
import { USER_TOKEN_COOKIE } from "constants/auth";
import Cookies from "cookies";

const JWT_SECRET_KEY = process.env.JWT_SECRET_KEY;

export default async (
  req: NextApiRequest,
  res: NextApiResponse<SiginApiResponse>
) => {
  if (req.method !== "POST") {
    res.status(400).end();
    return;
  }

  let credentials: Credentials;
  try {
    credentials = authApiService.toCredentials(JSON.parse(req.body));
  } catch (e) {
    res.status(400).end();
    return;
  }

  const user = usersApiService.findUserByCredentials(credentials);
  if (!user) {
    res.status(400).json({ errors: [{ message: "Wrong credentials" }] });
    return;
  }

  // Create JWT token.
  const token = await new SignJWT({ user })
    .setProtectedHeader({ alg: "HS256" })
    .setJti(nanoid())
    .setIssuedAt()
    .setExpirationTime("1h")
    .sign(new TextEncoder().encode(JWT_SECRET_KEY));

  // Set JWT token in HTTP only cookie.
  const cookies = new Cookies(req, res);
  cookies.set(USER_TOKEN_COOKIE, token, {
    httpOnly: true,
  });

  res.status(200).json({ data: user });
};
