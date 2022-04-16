import type { NextApiRequest, NextApiResponse } from "next";
import { SiginApiResponse } from "types";
import authApiService from "services/authApiService";
import { USER_TOKEN_COOKIE } from "constants/auth";
import Cookies from "cookies";
import usersApiService from "services/usersApiService";

export const ERROR_MESSAGE_BAD_REQUEST = "BAD REQUEST";

export default async (
  req: NextApiRequest,
  res: NextApiResponse<SiginApiResponse>
) => {
  if (req.method !== "POST") {
    res.status(400).end();
    return;
  }

  // Get the user from the cookie and verify the token.
  const token = req.cookies[USER_TOKEN_COOKIE];
  const user = await authApiService.getUserFromJWTToken(token);

  if (user) {
    const githubToken = usersApiService.getGithubToken(user);
    if (githubToken) {
      // Remove Github access token from database.
      usersApiService.setGithubToken(user, undefined);
      // Revoke Github access token.
      await authApiService.revokeGitHubToken(githubToken);
    }
  }

  // Expire the HTTP only cookie.
  const cookies = new Cookies(req, res);
  cookies.set(USER_TOKEN_COOKIE);

  res.status(200).end();
};
