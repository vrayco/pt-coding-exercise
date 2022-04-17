import { usersRepository } from "mockDatabase/usersRepository";
import { Credentials, NewUser, SensitiveInfoUser, User } from "types";

/**
 * Returns the User from the given SensitiveInfoUser.
 */
const sensitiveInfoUserToUser = (
  sensitiveInfoUser: SensitiveInfoUser
): User => {
  // Extract sensitive information.
  const { githubToken, password, ...user } = sensitiveInfoUser;

  return user;
};

const findUserByEmail = (email: string): User | undefined => {
  const sensitiveInfoUser = usersRepository
    .getAll()
    .find((user) => user.email === email);

  if (!sensitiveInfoUser) return undefined;

  return sensitiveInfoUserToUser(sensitiveInfoUser);
};

const findUserByCredentials = (credentials: Credentials): User | undefined => {
  const sensitiveInfoUser = usersRepository
    .getAll()
    .find(
      (user) =>
        user.email === credentials.email &&
        user.password === credentials.password
    );

  if (!sensitiveInfoUser) return undefined;

  return sensitiveInfoUserToUser(sensitiveInfoUser);
};

/**
 * Saves user in database or updates the GitHub token if the user exits in
 * the database already.
 */
const pushUser = (newUser: NewUser): User => {
  const createdUser = usersRepository
    .getAll()
    .find((user) => user.email === newUser.email);

  if (createdUser) {
    const updatedUser: SensitiveInfoUser = { ...createdUser, ...newUser };
    usersRepository.update(updatedUser);

    return sensitiveInfoUserToUser(updatedUser);
  }

  const sensitiveInfoUser = usersRepository.add(newUser);

  return sensitiveInfoUserToUser(sensitiveInfoUser);
};

/**
 * Returns the GitHub token for the given user if the user has one.
 * Returns undefined otherwise.
 */
const getGithubToken = (user: User): string | undefined => {
  const sensitiveInfoUser = usersRepository
    .getAll()
    .find((item) => item.email === user.email);

  if (!sensitiveInfoUser) return undefined;

  return sensitiveInfoUser.githubToken;
};

/**
 * Updates the user in the database setting the given new GitHub token.
 */
const setGithubToken = (
  user: User,
  githubToken: SensitiveInfoUser["githubToken"]
): boolean => {
  const sensitiveInfoUser = usersRepository
    .getAll()
    .find((item) => item.email === user.email);

  if (!sensitiveInfoUser) return false;

  usersRepository.update({ ...sensitiveInfoUser, githubToken });

  return true;
};

export default {
  sensitiveInfoUserToUser,
  findUserByEmail,
  findUserByCredentials,
  pushUser,
  setGithubToken,
  getGithubToken,
};
