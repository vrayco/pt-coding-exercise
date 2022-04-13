import { SensitiveInfoUser, User } from "types";

const validateEmail = (email: string): boolean => {
  const matches = String(email)
    .toLowerCase()
    .match(
      /^(([^<>()[\]\\.,;:\s@"]+(\.[^<>()[\]\\.,;:\s@"]+)*)|(".+"))@((\[[0-9]{1,3}\.[0-9]{1,3}\.[0-9]{1,3}\.[0-9]{1,3}\])|(([a-zA-Z\-0-9]+\.)+[a-zA-Z]{2,}))$/
    );

  return matches !== null;
};

const isUser = (value: any): value is User => {
  return (
    typeof value === "object" &&
    value !== null &&
    "id" in value &&
    "email" in value &&
    "name" in value
  );
};

const isSensitiveInfoUser = (value: any): value is SensitiveInfoUser => {
  return (
    typeof value === "object" &&
    value !== null &&
    "id" in value &&
    "email" in value &&
    "name" in value &&
    "password" in value
  );
};

export default {
  validateEmail,
  isUser,
  isSensitiveInfoUser,
};
