import type { NextApiRequest, NextApiResponse } from "next";
import { SignJWT } from "jose";
import Cookies from "cookies";
import { nanoid } from "nanoid";
import { USER_TOKEN_COOKIE } from "constants/auth"; // TODO: env vars
import { SiginApiResponse } from "types";
import authApiService from "services/authApiService";
import usersApiService from "services/usersApiService";

const JWT_SECRET_KEY = process.env.JWT_SECRET_KEY;

export default async (
  req: NextApiRequest,
  res: NextApiResponse<SiginApiResponse>
) => {
  if (req.method !== "POST") {
    res.status(400).end();
    return;
  }

  try {
    const { code } = authApiService.toCode(JSON.parse(req.body));
    const newUser = await authApiService.getUserFromGithub(code);

    if (!newUser || !newUser.email || !newUser.name) {
      res.status(400).end();
      return;
    }

    // Save/update user in database
    const user = usersApiService.pushUser(newUser);

    // Create JWT token
    const token = await new SignJWT({ user })
      .setProtectedHeader({ alg: "HS256" })
      .setJti(nanoid())
      .setIssuedAt()
      .setExpirationTime("1h")
      .sign(new TextEncoder().encode(JWT_SECRET_KEY));

    // Set JWT token in HTTP only cookie
    const cookies = new Cookies(req, res);
    cookies.set(USER_TOKEN_COOKIE, token, {
      httpOnly: true,
    });

    res.status(200).json({ data: user });
  } catch (e) {
    res.status(400).end();
  }
};
