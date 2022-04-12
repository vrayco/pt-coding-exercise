import { JWTVerifyResult } from "jose";
import { Credentials, NonSensitiveInfoUser, SiginApiResponse } from "types";
import usersService from "./usersService";

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

const signIn = async (
  credentials: Credentials
): Promise<NonSensitiveInfoUser> => {
  const response = await fetch("/api/auth/signin", {
    method: "POST",
    body: JSON.stringify(credentials),
  });

  const { data, errors }: SiginApiResponse = await response.json();

  if (response.ok && data) {
    return Promise.resolve(data);
  } else {
    const error = new Error(
      errors?.map((e) => e.message).join("\n") ?? "unknown"
    );
    return Promise.reject(error);
  }
};

const getNonSensitiveInfoUserFromToken = (
  data: JWTVerifyResult
): NonSensitiveInfoUser | undefined => {
  return usersService.isNonSenstiveUser(data.payload.user)
    ? data.payload.user
    : undefined;
};

export default { toCredentials, signIn, getNonSensitiveInfoUserFromToken };
