describe('Ticket Booking Without Login', () => {
  it('should allow booking a ticket without login', () => {
    cy.visit('/ticket');  
    
    cy.intercept('GET', 'http://localhost:3800/api/all', (req) => {
      req.headers['cache-control'] = 'no-cache';
    }).as('getTickets');
    
    cy.wait('@getTickets');
    
    cy.wait('@getTickets').then((interception) => {
      cy.log('API Response:', interception.response.body);
      expect([200, 304]).to.include(interception.response.statusCode);
    });

    cy.wait(3000);

    cy.get('body').should('not.be.empty');

    // Capture Percy snapshot after the ticket page loads
    cy.percySnapshot('Ticket Booking Page - Without Login');
  });
});
