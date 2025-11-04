describe("Authentication Flow", () => {
  const uniqueId = Date.now();
  const userName = "testingRandomUser";
  const userEmail = `e2e_user_${uniqueId}@university.edu.in`;
  const userPassword = "Password123!";

  beforeEach(() => {
    cy.viewport(1280, 720);
  });

  it("should allow a new user to register, log out, and log back in", () => {
    cy.visit("/register");
    cy.contains("h2", "Create Account").should("be.visible");

    cy.get('input[id="name"]').type(userName);
    cy.get('input[id="email"]').type(userEmail);
    cy.get('input[id="password"]').type(userPassword);

    cy.contains("button", "Sign Up").click();

    cy.url({ timeout: 10000 }).should("eq", "http://localhost:5173/");

    cy.get('header div[title="' + userName + '"]', { timeout: 10000 }).should(
      "be.visible"
    );

    cy.window()
      .its("localStorage")
      .invoke("getItem", "authToken")
      .should("exist");

    cy.get('header button[title="Logout"]').click();

    cy.url().should("include", "/login");

    cy.get("header").contains("Login").should("be.visible");
    cy.get("header").contains("Sign Up").should("be.visible");

    cy.get('input[id="email"]').type(userEmail);
    cy.get('input[id="password"]').type(userPassword);
    cy.contains("button", "Sign In").click();

    cy.url({ timeout: 10000 }).should("eq", "http://localhost:5173/");

    cy.get('header div[title="' + userName + '"]', { timeout: 10000 }).should(
      "be.visible"
    );

    cy.window()
      .its("localStorage")
      .invoke("getItem", "authToken")
      .should("exist");
  });
});
