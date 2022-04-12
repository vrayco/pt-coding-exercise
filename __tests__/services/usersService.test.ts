import { expect } from "@jest/globals";
import { Credentials, NonSensitiveInfoUser, User } from "types";
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

  describe("validateEmail method", () => {
    it("should return true when valid email", () => {
      expect(usersService.validateEmail("a@a.aa")).toBeTruthy();
    });

    it("should return false when valid email", () => {
      expect(usersService.validateEmail("no valid email")).toBeFalsy();
      expect(usersService.validateEmail("a@a")).toBeFalsy();
      expect(usersService.validateEmail("a@a.a")).toBeFalsy();
    });
  });

  describe("isNonSenstiveUser method", () => {
    it("returns true when value is NonSensitiveInfoUser type", () => {
      const value: NonSensitiveInfoUser = {
        id: 1,
        email: "a",
        firstName: "a",
        middleName: "a",
        lastName: "a",
      };

      expect(usersService.isNonSenstiveUser(value)).toBeTruthy();
    });

    // The type guard in this should return false, as there is an exta property in value
    // TODO: Improve the type guard
    it("returns true when value is NonSensitiveInfoUser type but extended with some others properties", () => {
      const value: any = {
        id: 1,
        email: "a",
        firstName: "a",
        middleName: "a",
        lastName: "a",
        somethingElse: "a",
      };

      expect(usersService.isNonSenstiveUser(value)).toBeTruthy();
    });

    it("returns true when value is no NonSensitiveInfoUser type", () => {
      const value: any = {
        id: 1,
        email: "a",
        firstName: "a",
        middleName: "a",
      };

      expect(usersService.isNonSenstiveUser(value)).toBeFalsy();
    });
  });

  describe("getNonSensitiveInfoUserFromCookie method", () => {
    it("retuns value when the JSON contains a NonSensitiveInfoUser type", () => {
      const value: NonSensitiveInfoUser = {
        id: 1,
        email: "a",
        firstName: "a",
        middleName: "a",
        lastName: "a",
      };
      const result = usersService.getNonSensitiveInfoUserFromCookie(
        JSON.stringify(value)
      );

      expect(result).toEqual(value);
    });

    it("returns undefined when the JSON does not contain NonSensitiveInfoUser type", () => {
      const result = usersService.getNonSensitiveInfoUserFromCookie("{}");
      expect(result).toBeUndefined();
    });

    it("logs an error when cookie param is no JSON", () => {
      console.error = jest.fn();
      usersService.getNonSensitiveInfoUserFromCookie("NO JSON");
      expect(console.error).toHaveBeenCalled();
    });
  });
});
