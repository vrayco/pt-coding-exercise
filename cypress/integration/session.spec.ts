import { usersRepository } from "mockDatabase/usersRepository";

const users = usersRepository.getDummyUsers();

describe("Sig In", () => {
  it("should navigate to the sign in page", () => {
    // Start from the index page
    cy.visit("http://localhost:3000/");

    // The signin page should contain an h1 with "Sign in"
    cy.get("h1").contains("Sign in");
  });

  it("should navigate to Dashboard if signin with correct credentials", () => {
    // Start from the index page
    cy.visit("http://localhost:3000/");

    // The signin page should contain an h1 with "Sign in"
    cy.get("h1").contains("Sign in");

    cy.get("input[name=email]").type(users[0].email);

    cy.get("input[name=password]").type(`${users[0].password}`);

    cy.get("button").contains("Sign in").click();

    // we should be redirected to /dashboard
    cy.url().should("include", "/dashboard");

    // our auth cookie should be present
    cy.getCookie("user-token").should("exist");

    // UI should reflect this user being logged in
    cy.get("h1").should("contain", "Dashboard");
  });

  it("should show an error when signin with wrong credentials", () => {
    // Start from the index page
    cy.visit("http://localhost:3000/");

    // The signin page should contain an h1 with "Sign in"
    cy.get("h1").contains("Sign in");

    cy.get("input[name=email]").type(users[0].email);

    cy.get("input[name=password]").type(`incorrect password`);

    cy.get("button").contains("Sign in").click();

    cy.url().should("include", "/");

    // our auth cookie should be present
    cy.getCookie("user-token").should("not.exist");

    // TODO
    cy.get("p").should("contain", "Wrong credentials");
  });

  it("should show an error when email is not a valid email", () => {
    cy.visit("http://localhost:3000/");

    // The signin page should contain an h1 with "Sign in"
    cy.get("h1").contains("Sign in");

    cy.get("input[name=email]").type("This is not an email");

    cy.get("p").should("contain", "Email not valid");
  });
});

describe("Sign out", () => {
  it("should navigate to / after logout", () => {
    // Start from the index page
    cy.visit("http://localhost:3000/");

    // The signin page should contain an h1 with "Sign in"
    cy.get("h1").contains("Sign in");

    cy.get("input[name=email]").type(users[0].email);

    cy.get("input[name=password]").type(`${users[0].password}`);

    cy.get("button").contains("Sign in").click();

    cy.get("button").contains("Sign in").should("not.exist");

    cy.get("a").contains("Sign out").click();

    cy.get("button").contains("Sign in").should("exist");
  });
});

describe("Cookie", () => {
  it("should navigate to / if the cookie does not contain a valid JWT token", () => {
    // Start from the index page
    cy.visit("http://localhost:3000/");

    // The signin page should contain an h1 with "Sign in"
    cy.get("h1").contains("Sign in");

    cy.get("input[name=email]").type(users[0].email);

    cy.get("input[name=password]").type(`${users[0].password}`);

    cy.get("button").contains("Sign in").click();

    cy.get("button").contains("Sign in").should("not.exist");

    cy.setCookie("user-token", "invalid JWT token");

    cy.reload();

    cy.get("button").contains("Sign in").should("exist");
  });
});
