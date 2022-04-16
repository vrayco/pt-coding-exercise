import type { NextApiRequest, NextApiResponse } from "next";
import { GithubRepositoriesApiResponse } from "types";
import authApiService from "services/authApiService";
import { USER_TOKEN_COOKIE } from "constants/auth";
import dataApiService from "services/dataApiService";

export default async (
  req: NextApiRequest,
  res: NextApiResponse<GithubRepositoriesApiResponse>
) => {
  if (req.method !== "GET") {
    res.status(400).end();
    return;
  }

  // Get the user from the cookie and verify the token.
  const token = req.cookies[USER_TOKEN_COOKIE];
  const user = await authApiService.getUserFromJWTToken(token);
  if (!user) {
    res.status(401).end();
    return;
  }

  const data = await dataApiService.getPublicGithubRepositories();

  res.status(200).json({ data });
};
