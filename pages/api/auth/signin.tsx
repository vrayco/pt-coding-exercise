import type { NextApiRequest, NextApiResponse } from "next";
import { SignJWT } from "jose";
import Cookies from "cookies";
import { nanoid } from "nanoid";
import { USER_TOKEN_COOKIE, JWT_SECRET_KEY } from "constants/auth"; // TODO: env vars
import { Credentials, SiginApiResponse } from "types";
import authService from "services/authService";
import usersService from "services/usersService";

export const ERROR_MESSAGE_BAD_REQUEST = "BAD REQUEST";

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
    credentials = authService.toCredentials(JSON.parse(req.body));
  } catch (e) {
    res.status(400).end();
    return;
  }

  const user = usersService.findByCredentials(credentials);

  if (!user) {
    res.status(400).json({ errors: [{ message: "Wrong credentials" }] });
    return;
  }

  const token = await new SignJWT({ user })
    .setProtectedHeader({ alg: "HS256" })
    .setJti(nanoid())
    .setIssuedAt()
    .setExpirationTime("1h")
    .sign(new TextEncoder().encode(JWT_SECRET_KEY));

  const cookies = new Cookies(req, res);
  cookies.set(USER_TOKEN_COOKIE, token, {
    httpOnly: true,
  });

  res.status(200).json({
    data: {
      id: user.id,
      email: user.email,
      firstName: user.firstName,
      middleName: user.middleName,
      lastName: user.lastName,
    },
  });
};
