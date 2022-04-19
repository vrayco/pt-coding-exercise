import { GetServerSidePropsResult } from "next";
import { jwtVerify } from "jose";
import {
  Credentials,
  GitHubRepository,
  NewUser,
  SensitiveInfoUser,
  User,
} from "types";
import dataApiService from "services/dataApiService";
import usersApiService from "services/usersApiService";
import usersService from "services/usersService";

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

/**
 * This method receives the body of the request and parse the parameters: email
 * and password.
 */
const toCredentials = (object: any): Credentials => {
  const credentials: Credentials = {
    email: parseEmail(object.email),
    password: parsePassword(object.password),
  };

  return credentials;
};

/**
 * This method receives the body of the request and parse the parameter code.
 */
const toCode = (object: any): { code: string } => {
  return { code: parseCode(object.code) };
};

/**
 * Builds a NewUser instance mapping the given GitHub data.
 */
const mapFromGithubDataToUser = (data: any, githubToken?: string): NewUser => {
  return {
    email: data.email,
    name: data.name,
    avatarUrl: data.avatar_url,
    githubUsername: data.login,
    githubToken,
  };
};

/**
 * Requests to GitHub the info about the user.
 */
const getUserFromGithub = async (
  code: string
): Promise<NewUser | undefined> => {
  try {
    // Exchange GitHub code for an access token.
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

    // Get GitHub user data (using the access token).
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

/**
 * Requests the revocation of the token to GitHub.
 */
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

/**
 * Extracts and returns the user data from a JWT token if the token is valid and
 * not expired. Returns undefined otherwise.
 */
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

/**
 * This method is used in SSR to verify the user session and to get the data
 * the app will use to hydrate the app state.
 * The object returned by this method will be injected as props in the page
 * component.
 */
const SSRVerifySessionAndHydrate = async (
  token: string
): Promise<GetServerSidePropsResult<{ [key: string]: any }>> => {
  const user = await getUserFromJWTToken(token);
  if (!user) {
    // This will force the user to signout as there is no valid session.
    return {
      redirect: {
        destination: "/signout",
        permanent: false,
      },
    };
  }

  // Request GitHub public repositories.
  const publicRepositories = await dataApiService.getPublicGithubRepositories();
  // Request GitHub own repositories if the user signed in with a GitHub
  // account.
  let ownRepositories: GitHubRepository[] = [];
  if (user.githubUsername) {
    const githubToken = usersApiService.getGithubToken(user);
    const { githubUsername } = user;
    ownRepositories = await dataApiService.getOwnGithubRepositories(
      githubUsername,
      githubToken
    );
  }

  return {
    props: {
      preloadedState: {
        auth: {
          user,
        },
        publicRepositories,
        ownRepositories,
      },
    },
  };
};

export default {
  toCredentials,
  toCode,
  getUserFromGithub,
  revokeGitHubToken,
  getUserFromJWTToken,
  SSRVerifySessionAndHydrate,
};
