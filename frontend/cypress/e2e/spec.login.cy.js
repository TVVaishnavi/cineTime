describe('Login Page Tests', () => {
  beforeEach(() => {
    cy.visit('http://localhost:3000/login');
    cy.wait(1000); 
  });

  it('should load the login page', () => {
    cy.contains('Login').should('be.visible'); 
    cy.get('input[placeholder="Enter userEmail"]').should('exist'); 
    cy.get('input[placeholder="Enter New password"]').should('exist'); 
    cy.get('button.submit').should('exist').and('be.visible'); 
    cy.contains('Create account').should('exist').and('be.visible');

    // Add Percy snapshot here
    cy.percySnapshot('Login Page');
  });

  it('should show an alert when email or password is missing', () => {
    cy.window().then((win) => cy.stub(win, 'alert').as('alertStub')); 

    cy.get('button.submit').click(); 

    cy.get('@alertStub').should('have.been.calledWith', 'please enter both email and password'); 

    // Add Percy snapshot here
    cy.percySnapshot('Alert Missing Credentials');
  });

  it('should allow typing into email and password fields', () => {
    cy.get('input[placeholder="Enter userEmail"]').type('test@example.com');
    cy.get('input[placeholder="Enter New password"]').type('password123');

    cy.get('input[placeholder="Enter userEmail"]').should('have.value', 'test@example.com');
    cy.get('input[placeholder="Enter New password"]').should('have.value', 'password123');

    // Add Percy snapshot here
    cy.percySnapshot('Typing in Credentials');
  });

  it('should login successfully without triggering an alert', () => {
    cy.intercept('POST', '**/user/login', {
      statusCode: 200,
      body: { success: true, data: { token: '12345' } },
    }).as('loginSuccess');
  
    cy.get('input[placeholder="Enter userEmail"]').type('validuser@example.com');
    cy.get('input[placeholder="Enter New password"]').type('ValidPassword123');
    cy.get('button.submit').click();
  
    cy.wait('@loginSuccess').its('response.body').should('deep.include', { success: true });
  
    cy.window().then((win) => {
      cy.stub(win, 'alert').as('alertStub');
    });
  
    cy.get('@alertStub').should('not.have.been.called');
  
    cy.url().should('include', '/login');

    // Add Percy snapshot here
    cy.percySnapshot('Login Success');
  });

  it('should navigate to signup page when clicking "Create account"', () => {
    cy.contains('Create account').click();
    cy.url().should('include', '/signup'); 

    // Add Percy snapshot here
    cy.percySnapshot('Signup Page Navigation');
  });
});
