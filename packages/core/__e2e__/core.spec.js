describe('page', () => {
  it('Page is visible', () => {
    cy.prepare('/index.html', 'home');

    // Click link
    cy.get('[data-test=link]').click();

    // Checks…
    cy.end('/page.html', 'page');
  });
});
