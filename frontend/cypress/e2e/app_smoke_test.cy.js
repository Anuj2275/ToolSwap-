describe("Application Smoke Tests", () => {
  it("successfully loads the Home page", () => {
    cy.visit("/"); 

    cy.contains("h1", "Discover Tools").should("be.visible");

    cy.get('input[placeholder="Search tools by name..."]').should("be.visible");
  });

  it("navigates to the Login page and sees the form", () => {
    cy.visit("/login");

    cy.contains("h2", "Welcome Back").should("be.visible");
    cy.get('input[id="email"]').should("be.visible");
    cy.get('input[id="password"]').should("be.visible");
    cy.contains("button", "Sign In").should("be.visible");
  });

  it("navigates to the Register page and sees the form", () => {
    cy.visit("/register");

    cy.contains("h2", "Create Account").should("be.visible");
    cy.get('input[id="name"]').should("be.visible");
    cy.get('input[id="email"]').should("be.visible");
    cy.get('input[id="password"]').should("be.visible");
    cy.contains("button", "Sign Up").should("be.visible");
  });

  it("redirects unauthenticated user from Dashboard to Login", () => {
    cy.visit("/dashboard");

    cy.url().should("include", "/login");
    cy.contains("h2", "Welcome Back").should("be.visible");
  });
});
