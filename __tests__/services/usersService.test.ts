import { expect } from "@jest/globals";
import { Credentials, User } from "types";
import usersService from "services/usersService";
import jsonUsers from "cypress/fixtures/users.json";

const users = jsonUsers as User[];

describe("users service", () => {
  describe("findByCredentials method", () => {
    it("should return a NonSensitiveInfoUser instance when a valid credentials", () => {
      const credentials: Credentials = {
        email: users[0].email,
        password: users[0].password,
      };

      const nonSensitiveInfoUser = usersService.findByCredentials(credentials);

      expect(nonSensitiveInfoUser).toEqual({
        id: users[0].id,
        email: users[0].email,
        firstName: users[0].firstName,
        middleName: users[0].middleName,
        lastName: users[0].lastName,
      });
    });

    it("should return a undefined when no valid credentials", () => {
      const credentials: Credentials = {
        email: "novalidemail",
        password: "pass",
      };

      const nonSensitiveInfoUser = usersService.findByCredentials(credentials);

      expect(nonSensitiveInfoUser).toBeUndefined();
    });
  });
});
