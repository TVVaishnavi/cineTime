describe('Search Component - Movie Search', () => {
  beforeEach(() => {
    cy.intercept('POST', '**/api/movies', (req) => {
      req.reply({
        statusCode: 200,
        body: { theatres: [{ name: 'PVR Cinemas' }] },
      });
    }).as('movieSearch');

    cy.visit('http://localhost:3000/search');
    cy.percySnapshot('Search Page - Initial Load'); // Snapshot of the initial UI
  });

  it('should search for a movie when a movie name is entered', () => {
    cy.get('input').type('Inception');
    cy.get('button').contains('Search').click();

    cy.wait('@movieSearch')
      .its('request.body')
      .should('deep.equal', { title: 'Inception' });

    cy.percySnapshot('Search Page - Movie Searched'); // Capture UI after search
  });

  it('should show an alert if no movie name is entered', () => {
    cy.window().then((win) => cy.spy(win, 'alert').as('alertSpy'));

    cy.get('button').contains('Search').click();

    cy.get('@alertSpy').should('have.been.calledWith', 'Enter a movie name to search!');

    cy.percySnapshot('Search Page - No Input Alert'); // Capture UI state when alert is triggered
  });
});
