import { Credentials, User } from "types";
import { parseAndBuildResponse } from "services/apiService";

const signInCredentials = async (credentials: Credentials): Promise<User> => {
  const response = await fetch("/api/auth/signin", {
    method: "POST",
    body: JSON.stringify(credentials),
  });

  return await parseAndBuildResponse<User>(response);
};

const signInGithub = async (code: string): Promise<User> => {
  const response = await fetch("/api/auth/signin/github", {
    method: "POST",
    body: JSON.stringify({
      code,
    }),
  });

  return await parseAndBuildResponse<User>(response);
};

const signOut = async (): Promise<Boolean> => {
  const response = await fetch("/api/auth/signout", { method: "POST" });

  return response.ok;
};

export default {
  signInCredentials,
  signInGithub,
  signOut,
};
