describe('page', () => {
  it('Page is visible', () => {
    // Go to home
    cy.visit('/named.html');
    // Check elements
    cy.get('[data-test=title]')
      .as('h1') // Alias to @h1
      .should('contain', 'named'); // Unnecessary?
    cy.get('[data-test=container]').as('current');

    // Click link
    cy.get('[data-test=link]').click();

    // Checks…
    // 1. URL has changed
    cy.url().should('include', '/page.html');
    // 2. H1 has changed
    cy.get('@h1')
      .should('contain', 'page')
      .should('not.contain', 'named'); // Negative assertion, unnecessary?
    // 3. Page title has changed
    cy.title().should('contain', 'test page');
    // 4. Current container has been removed
    cy.get('@current').should('not.exist');
  });
});
