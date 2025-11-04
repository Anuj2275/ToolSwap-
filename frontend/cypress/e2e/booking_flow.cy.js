

describe('Full Booking Flow', () => {


  const uniqueId = Date.now();
  const ownerName = 'Test Owner';
  const ownerEmail = `owner_${uniqueId}@university.edu.in`;
  const ownerPassword = 'Password123!';

  const borrowerName = 'Test Borrower';
  const borrowerEmail = `borrower_${uniqueId}@university.edu.in`;
  const borrowerPassword = 'Password123!';

  const toolName = `E2E Tool ${uniqueId}`;
  const toolCategory = 'E2E Category';
  const toolDescription = 'A tool created by an E2E test.';


  const logout = () => {
    cy.get('header button[title="Logout"]').click();
    cy.url().should('include', '/login');
  };


  const login = (email, password) => {
    cy.visit('/login');
    cy.get('input[id="email"]').type(email);
    cy.get('input[id="password"]').type(password);
    cy.contains('button', 'Sign In').click();
    cy.url({ timeout: 10000 }).should('eq', 'http://localhost:5173/');
  };

  it('should allow an owner to list a tool, a borrower to request it, and the owner to approve it', () => {

    cy.viewport(1280, 720);


    cy.visit('/register');
    cy.get('input[id="name"]').type(ownerName);
    cy.get('input[id="email"]').type(ownerEmail);
    cy.get('input[id="password"]').type(ownerPassword);
    cy.contains('button', 'Sign Up').click();


    cy.url({ timeout: 10000 }).should('eq', 'http://localhost:5173/');
    cy.get(`header div[title="${ownerName}"]`, { timeout: 10000 }).should('be.visible');


    cy.get('header').contains('List Tool').click();
    cy.url().should('include', '/add-tool');


    cy.get('input[id="name"]').type(toolName);
    cy.get('input[id="category"]').type(toolCategory);
    cy.get('textarea[id="description"]').type(toolDescription);


     cy.get('input[type="file"]').selectFile('cypress/fixtures/test-image.jpg', { force: true });
     cy.get('img[alt="Tool preview"]').should('be.visible');



    cy.contains('button', 'List Tool').click();


    cy.url({ timeout: 10000 }).should('include', '/my-tools');
    cy.contains('h1', 'My Tools').should('be.visible');
    cy.contains(toolName).should('be.visible');


    logout();

    cy.visit('/register');
    cy.get('input[id="name"]').type(borrowerName);
    cy.get('input[id="email"]').type(borrowerEmail);
    cy.get('input[id="password"]').type(borrowerPassword);
    cy.contains('button', 'Sign Up').click();


    cy.url({ timeout: 10000 }).should('eq', 'http://localhost:5173/');
    cy.get(`header div[title="${borrowerName}"]`, { timeout: 10000 }).should('be.visible');


    cy.get('input[placeholder="Search tools by name..."]').type(toolName);
    cy.contains(toolName).click();

    cy.url().should('include', '/tool/');
    cy.contains('h1', toolName).should('be.visible');

    const tomorrow = new Date();
    tomorrow.setDate(tomorrow.getDate() + 1);
    const dayAfter = new Date();
    dayAfter.setDate(dayAfter.getDate() + 2);

    const startDate = tomorrow.toISOString().slice(0, 16);
    const endDate = dayAfter.toISOString().slice(0, 16);

    cy.get('input[id="startDate"]').type(startDate);
    cy.get('input[id="endDate"]').type(endDate);

    cy.contains('button', 'Send Request').click();
    cy.contains('Booking request sent successfully!').should('be.visible');


    logout();
    login(ownerEmail, ownerPassword);

    cy.get(`header div[title="${ownerName}"]`, { timeout: 10000 }).should('be.visible');

    cy.visit('/dashboard');
    cy.contains('h1', 'Dashboard').should('be.visible');

    cy.contains('li', toolName, { timeout: 10000 }).within(() => {
      cy.contains(borrowerName).should('be.visible');
      cy.contains('PENDING').should('be.visible');
      cy.contains('button', 'Approve').click();
    });


    cy.contains('li', toolName).within(() => {
      cy.contains('APPROVED').should('be.visible');
      cy.contains('button', 'Approve').should('not.exist');
      cy.contains('button', 'Decline').should('not.exist');
    });
  });
});
