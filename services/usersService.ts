import { Credentials, NonSensitiveInfoUser, User } from "types";
import jsonUsers from "cypress/fixtures/users.json";

const users = jsonUsers as User[];

const findByCredentials = (
  credentials: Credentials
): NonSensitiveInfoUser | undefined => {
  const user = users.find(
    (a) => a.email === credentials.email && a.password === credentials.password
  );

  if (!user) return undefined;

  // Extract the password from user
  const { password, ...nonSensitiveInfoUser } = user;

  return nonSensitiveInfoUser;
};

const validateEmail = (email: string): boolean => {
  const matches = String(email)
    .toLowerCase()
    .match(
      /^(([^<>()[\]\\.,;:\s@"]+(\.[^<>()[\]\\.,;:\s@"]+)*)|(".+"))@((\[[0-9]{1,3}\.[0-9]{1,3}\.[0-9]{1,3}\.[0-9]{1,3}\])|(([a-zA-Z\-0-9]+\.)+[a-zA-Z]{2,}))$/
    );

  return matches !== null;
};

const isNonSenstiveUser = (value: any): value is NonSensitiveInfoUser => {
  return (
    typeof value === "object" &&
    value !== null &&
    "id" in value &&
    "firstName" in value &&
    "middleName" in value &&
    "lastName" in value
  );
};

const getNonSensitiveInfoUserFromCookie = (
  cookie: string
): NonSensitiveInfoUser | undefined => {
  try {
    const nonSensitiveInfoUser = JSON.parse(cookie);

    return isNonSenstiveUser(nonSensitiveInfoUser)
      ? nonSensitiveInfoUser
      : undefined;
  } catch (e) {
    console.error(e);
  }
};

export default {
  findByCredentials,
  validateEmail,
  isNonSenstiveUser,
  getNonSensitiveInfoUserFromCookie,
};
