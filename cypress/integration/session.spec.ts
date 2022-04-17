import { usersRepository } from "mockDatabase/usersRepository";

const users = usersRepository.getDummyUsers();

describe("Sign In", () => {
  it("should navigate to the sign in page", () => {
    // Start from the index page.
    cy.visit("http://localhost:3000/");

    // The signin page should contain an h1 with "Sign in".
    cy.get("h1").contains("Sign in");
  });

  it("should navigate to Dashboard if signing in with correct credentials", () => {
    // Start from the index page.
    cy.visit("http://localhost:3000/");

    // Type email and passward and click in submit button.
    cy.get("input[name=email]").type(users[0].email);
    cy.get("input[name=password]").type(`${users[0].password}`);
    cy.get("button").contains("Sign in").click();

    // It should be redirected to /dashboard.
    cy.url().should("include", "/dashboard");

    // The auth cookie should be present.
    cy.getCookie("user-token").should("exist");

    // UI should reflect this user being signed in.
    cy.get("h1").should("contain", "Dashboard");
  });

  it("should show an error when signing in with wrong credentials", () => {
    // Start from the index page.
    cy.visit("http://localhost:3000/");

    // Type email and passward and click in submit button.
    cy.get("input[name=email]").type(users[0].email);
    cy.get("input[name=password]").type(`incorrect password`);
    cy.get("button").contains("Sign in").click();

    // It should not be redirected to /dashboard.
    cy.url().should("include", "/");

    // The auth cookie should not be present.
    cy.getCookie("user-token").should("not.exist");

    // A message error should be shown.
    cy.get("p").should("contain", "Wrong credentials");
  });

  it("should show an error when email is not a valid email", () => {
    // Start from the index page.
    cy.visit("http://localhost:3000/");

    // Type an email with a wrong format.
    cy.get("input[name=email]").type("This is not an email");

    // An error message should be shown.
    cy.get("p").should("contain", "Email not valid");
  });
});

describe("Sign out", () => {
  it("should navigate to / after logout", () => {
    // Start from the index page.
    cy.visit("http://localhost:3000/");

    // Type email and passward and click in submit button.
    cy.get("input[name=email]").type(users[0].email);
    cy.get("input[name=password]").type(`${users[0].password}`);
    cy.get("button").contains("Sign in").click();

    // Click on sign out button.
    cy.get("a").contains("Sign out").click();

    // It should be redireted to /.
    cy.get("button").contains("Sign in").should("exist");
  });
});

describe("Cookie", () => {
  it("should navigate to / if the cookie does not contain a valid JWT token", () => {
    // Start from the index page
    cy.visit("http://localhost:3000/");

    cy.get("input[name=email]").type(users[0].email);
    cy.get("input[name=password]").type(`${users[0].password}`);
    cy.get("button").contains("Sign in").click();

    // The auth cookie should be present.
    cy.getCookie("user-token").should("exist");

    // Invalidate the cookie.
    cy.setCookie("user-token", "invalid JWT token");

    cy.reload();

    // It should be redireted to /.
    cy.get("button").contains("Sign in").should("exist");
  });
});
