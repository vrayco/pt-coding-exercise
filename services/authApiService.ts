import { jwtVerify } from "jose";
import { Credentials, NewUser, SensitiveInfoUser, User } from "types";
import usersService from "./usersService";

const JWT_SECRET_KEY = process.env.JWT_SECRET_KEY;
const GITHUB_CLIENT_ID = process.env.NEXT_PUBLIC_CLIENT_ID_GITHUB;
const GITHUB_CLIENT_SECRET = process.env.CLIENT_SECRET_GITHUB;

const parseEmail = (emailFromRequest: any): string => {
  if (!isString(emailFromRequest)) {
    throw new Error("Incorrent or missing email");
  }

  return emailFromRequest;
};

const parsePassword = (passwordFromRequest: any): string => {
  if (!isString(passwordFromRequest)) {
    throw new Error("Incorrent or missing password");
  }

  return passwordFromRequest;
};

const parseCode = (codeFromRequest: any): string => {
  if (!isString(codeFromRequest)) {
    throw new Error("Incorrent or missing code");
  }

  return codeFromRequest;
};

const isString = (string: string): boolean => {
  return typeof string === "string";
};

const toCredentials = (object: any): Credentials => {
  const credentials: Credentials = {
    email: parseEmail(object.email),
    password: parsePassword(object.password),
  };

  return credentials;
};

const toCode = (object: any): string => {
  return parseCode(object.code);
};

const mapFromGithubDataToUser = (data: any, githubToken?: string): NewUser => {
  return {
    email: data.email,
    name: data.name,
    avatar_url: data.avatar_url,
    githubToken,
  };
};

const getUserFromGithub = async (
  code: string
): Promise<NewUser | undefined> => {
  try {
    // Exchange GitHub code for an access token
    const accessTokenResponse = await fetch(
      "https://github.com/login/oauth/access_token",
      {
        method: "POST",
        headers: {
          "Content-Type": "application/json",
          Accept: "application/json",
        },
        body: JSON.stringify({
          client_id: GITHUB_CLIENT_ID,
          client_secret: GITHUB_CLIENT_SECRET,
          code,
        }),
        redirect: "follow",
      }
    );

    const token: { access_token: string } = await accessTokenResponse.json();

    // Get GitHub user data (using the access token)
    const userResponse = await fetch("https://api.github.com/user", {
      method: "GET",
      headers: {
        Authorization: `token ${token.access_token}`,
        Accept: "application/json",
      },
    });

    const data = await userResponse.json();

    return mapFromGithubDataToUser(data, token.access_token);
  } catch (e) {
    console.error(e);
    return undefined;
  }
};

const revokeGitHubToken = async (
  githubToken: SensitiveInfoUser["githubToken"]
): Promise<Boolean> => {
  try {
    const auth =
      "Basic " +
      Buffer.from(GITHUB_CLIENT_ID + ":" + GITHUB_CLIENT_SECRET).toString(
        "base64"
      );
    const response = await fetch(
      `https://api.github.com/applications/${GITHUB_CLIENT_ID}/grant`,
      {
        method: "DELETE",
        headers: {
          Accept: "application/vnd.github.v3+json",
          "Content-Type": "application/json",
          Authorization: auth,
        },
        body: JSON.stringify({
          access_token: githubToken,
        }),
      }
    );

    return response.ok;
  } catch (e) {
    console.error(e);
    return false;
  }
};

// TODO comment. If token no valid it fails
const getUserFromJWTToken = async (
  token: string
): Promise<User | undefined> => {
  try {
    const data = await jwtVerify(
      token,
      new TextEncoder().encode(JWT_SECRET_KEY)
    );

    return usersService.isUser(data.payload.user)
      ? data.payload.user
      : undefined;
  } catch (e) {
    console.log(e);
  }
};

export default {
  toCredentials,
  toCode,
  getUserFromGithub,
  revokeGitHubToken,
  getUserFromJWTToken,
};
