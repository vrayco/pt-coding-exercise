import { ApiResponse, Credentials, User } from "types";

// TODO: Maybe move to a common place and give a better name
const parseAndBuildResponse = async <T>(response: Response): Promise<T> => {
  const { data, errors }: ApiResponse<T> = await response.json();

  if (response.ok && data) {
    return Promise.resolve(data);
  } else {
    const error = new Error(
      errors?.map((e) => e.message).join("\n") ?? "unknown"
    );
    return Promise.reject(error);
  }
};

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
