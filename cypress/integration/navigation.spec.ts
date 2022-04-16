import { usersRepository } from "mockDatabase/usersRepository";

const users = usersRepository.getDummyUsers();

describe("hydration", () => {
  beforeEach(() => {
    cy.visit("http://localhost:3000/");
    cy.get("input[name=email]").type(users[0].email);
    cy.get("input[name=password]").type(`${users[0].password}`);
    cy.get("button").contains("Sign in").click();
    cy.get("h1").should("contain", "Dashboard");
  });

  it("should keep the session after refreshing the page", () => {
    cy.get("h1").should("contain", "Dashboard");
    cy.go("back");
    cy.get("h1").should("contain", "Dashboard");
  });

  it("should keep the session after refreshing the page", () => {
    cy.get("h1").should("contain", "Dashboard");
    cy.go("back");
    cy.get("h1").should("contain", "Dashboard");
  });
});
