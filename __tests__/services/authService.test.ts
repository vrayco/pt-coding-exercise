import { expect } from "@jest/globals";
import { Credentials, User } from "types";
import jsonUsers from "cypress/fixtures/users.json";
import authService from "services/authService";

const users = jsonUsers as User[];

describe("auth service", () => {
  describe("toCredentials method", () => {
    it("should return a credentials instance when a valid object", () => {
      const data: any = {
        email: "test@playtomic.com",
        password: "pass",
      };

      const credentials: Credentials = authService.toCredentials(data);

      expect(credentials).toEqual(data);
    });

    describe("should thrown an exception when a not valid object", () => {
      it("without properties", () => {
        const data: any = {};

        expect(() => authService.toCredentials(data)).toThrowError(
          new Error("Incorrent or missing email")
        );
      });

      it("without email property", () => {
        const data: any = {
          password: "pass",
        };

        expect(() => authService.toCredentials(data)).toThrowError(
          new Error("Incorrent or missing email")
        );
      });

      it("without password property", () => {
        const data: any = {
          email: "test@playtomic.com",
        };

        expect(() => authService.toCredentials(data)).toThrowError(
          new Error("Incorrent or missing password")
        );
      });

      it("email property with a wrong type", () => {
        const data: any = {
          email: 111,
          password: "pass",
        };

        expect(() => authService.toCredentials(data)).toThrowError(
          new Error("Incorrent or missing email")
        );
      });

      it("password property with a wrong type", () => {
        const data: any = {
          email: "test@playtomic.com",
          password: 111,
        };

        expect(() => authService.toCredentials(data)).toThrowError(
          new Error("Incorrent or missing password")
        );
      });
    });
  });
});
