describe('page', () => {
  it('Page is visible', () => {
    cy.visit('/index.html');
    cy.contains('home');
    cy.get('a').click();

    cy.url().should('include', '/page.html');
    cy.get('h1').should('contain', 'page');
    cy.title().should('contain', 'test page');
  });
});
