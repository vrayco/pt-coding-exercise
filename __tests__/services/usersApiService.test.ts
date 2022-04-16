import { expect } from "@jest/globals";
import { Credentials, SensitiveInfoUser, User } from "types";
import usersApiService from "services/usersApiService";
import { usersRepository } from "mockDatabase/usersRepository";

const users = usersRepository.getDummyUsers();

describe("users service", () => {
  describe("findByCredentials method", () => {
    it.skip("should return a NonSensitiveInfoUser instance when a valid credentials", () => {
      const credentials: Credentials = {
        email: users[0].email,
        password: users[0].password,
      };

      const user = usersApiService.findUserByCredentials(credentials);

      console.log(user);

      expect(user).toEqual({
        id: users[0].id,
        email: users[0].email,
        name: users[0].name,
        pasword: users[0].password,
      });
    });

    it("should return a undefined when no valid credentials", () => {
      const credentials: Credentials = {
        email: "novalidemail",
        password: "pass",
      };

      const user = usersApiService.findUserByCredentials(credentials);

      expect(user).toBeUndefined();
    });
  });
});
