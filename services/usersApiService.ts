import { usersRepository } from "mockDatabase/usersRepository";
import { Credentials, NewUser, SensitiveInfoUser, User } from "types";
import usersService from "services/usersService";

const sensitiveInfoUserToUser = (
  sensitiveInfoUser: SensitiveInfoUser
): User => {
  // Extract sensitive information
  const { githubToken, password, ...user } = sensitiveInfoUser;

  return user;
};

const findUserByEmail = (email: string): User | undefined => {
  const sensitiveInfoUser = usersRepository
    .getAll()
    .find((a) => a.email === email);

  if (!sensitiveInfoUser) return undefined;

  return sensitiveInfoUserToUser(sensitiveInfoUser);
};

const findUserByCredentials = (credentials: Credentials): User | undefined => {
  const sensitiveInfoUser = usersRepository
    .getAll()
    .find(
      (a) =>
        a.email === credentials.email && a.password === credentials.password
    );

  if (!sensitiveInfoUser) return undefined;

  return sensitiveInfoUserToUser(sensitiveInfoUser);
};

const getUserFromCookie = (cookie: string): User | undefined => {
  try {
    const user = JSON.parse(cookie);

    return usersService.isUser(user) ? user : undefined;
  } catch (e) {
    console.error(e);
    return undefined;
  }
};

const addUser = (newUser: NewUser): User => {
  const createdUser = usersRepository
    .getAll()
    .find((a) => a.email === newUser.email);

  if (createdUser) {
    const updatedUser: SensitiveInfoUser = { ...createdUser, ...newUser };
    console.log({ addUser: updatedUser });
    usersRepository.update(updatedUser);

    return sensitiveInfoUserToUser(updatedUser);
  }

  const sensitiveInfoUser = usersRepository.add(newUser);

  return sensitiveInfoUserToUser(sensitiveInfoUser);
};

const getGithubToken = (user: User): string | undefined => {
  const sensitiveInfoUser = usersRepository.getAll().find((a) => {
    return a.email === user.email;
  });

  if (!sensitiveInfoUser) return undefined;

  return sensitiveInfoUser.githubToken;
};

const setGithubToken = (
  user: User,
  githubToken: SensitiveInfoUser["githubToken"]
): boolean => {
  const sensitiveInfoUser = usersRepository
    .getAll()
    .find((a) => a.email === user.email);

  if (!sensitiveInfoUser) return false;

  usersRepository.update({ ...sensitiveInfoUser, githubToken });

  return true;
};

export default {
  sensitiveInfoUserToUser,
  findUserByEmail,
  findUserByCredentials,
  getUserFromCookie,
  addUser,
  setGithubToken,
  getGithubToken,
};
