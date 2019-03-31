describe('Tranistion', () => {
  it('works', () => {
    cy.prepare('/index.html', 'home', 'home');
    // Click link
    cy.get('[data-test=link]').click();
    cy.final('/page.html', 'page', 'page');
  });
});
