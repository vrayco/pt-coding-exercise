import { expect } from "@jest/globals";
import { Credentials, SensitiveInfoUser, User } from "types";
import usersService from "services/usersService";
import jsonUsers from "cypress/fixtures/users.json";

const users = jsonUsers as User[];

describe("users service", () => {
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

  describe("isUser method", () => {
    it("returns true when value is NonSensitiveInfoUser type", () => {
      const value: User = {
        id: 1,
        email: "a",
        name: "a",
      };

      expect(usersService.isUser(value)).toBeTruthy();
    });

    // The type guard in this should return false, as there is an exta property in value
    // TODO: Improve the type guard
    it("returns true when value is NonSensitiveInfoUser type but extended with some others properties", () => {
      const value: any = {
        id: 1,
        email: "a",
        name: "a",
        somethingElse: "a",
      };

      expect(usersService.isUser(value)).toBeTruthy();
    });

    it("returns false when value is no NonSensitiveInfoUser type", () => {
      const value: any = {
        id: 1,
        email: "a",
      };

      expect(usersService.isUser(value)).toBeFalsy();
    });
  });

  describe("isSensitiveInfoUser method", () => {
    it("returns true when value is SensitiveInfoUser type", () => {
      const value: SensitiveInfoUser = {
        id: 1,
        email: "a",
        name: "a",
        password: "a",
      };

      expect(usersService.isSensitiveInfoUser(value)).toBeTruthy();
    });

    // The type guard in this should return false, as there is an exta property in value
    // TODO: Improve the type guard
    it("returns true when value is SensitiveInfoUser type but extended with some others properties", () => {
      const value: any = {
        id: 1,
        email: "a",
        name: "a",
        password: "a",
        somethingElse: "a",
      };

      expect(usersService.isSensitiveInfoUser(value)).toBeTruthy();
    });

    it("returns false when value is no NonSensitiveInfoUser type", () => {
      const value: any = {
        id: 1,
        email: "a",
      };

      expect(usersService.isSensitiveInfoUser(value)).toBeFalsy();
    });
  });
});
