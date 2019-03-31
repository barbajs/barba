describe('Transition', () => {
  it('works', () => {
    cy.prepare('/index.html', 'home', 'home');
    // Click link
    cy.get('[data-test=link]').click();
    cy.final('/page.html', 'page', 'page');
    cy.get('@next')
      .should('not.have.class', 'barba-enter')
      .should('not.have.class', 'barba-enter-to')
      .should('not.have.class', 'barba-enter-active');
  });
});
