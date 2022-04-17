import { usersRepository } from "mockDatabase/usersRepository";

const users = usersRepository.getDummyUsers();

describe("navigation", () => {
  beforeEach(() => {
    // Sign in with valid credentials
    cy.visit("http://localhost:3000/");
    cy.get("input[name=email]").type(users[0].email);
    cy.get("input[name=password]").type(`${users[0].password}`);
    cy.get("button").contains("Sign in").click();
    cy.get("h1").should("contain", "Dashboard");
  });

  it("should keep the session when the user goes back in the browser", () => {
    cy.get("h1").should("contain", "Dashboard");
    cy.go("back");
    cy.get("h1").should("contain", "Dashboard");
  });

  it("shoud navigate to settings when clicking in the settings menu item", () => {
    cy.get("a").contains("Settings").click();
    cy.get("h1").should("contain", "Settings");
  });
});
