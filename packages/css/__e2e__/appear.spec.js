describe('Appear transition', () => {
  it('works', () => {
    cy.prepare('/appear.html', 'appear', 'appear');
    // Click link
    // cy.get('[data-test=link]').click();
    // cy.final('/page.html', 'page', 'page');
    cy.get('@current')
      .should('not.have.class', 'named-enter')
      .should('not.have.class', 'named-enter-to')
      .should('not.have.class', 'named-enter-active');
  });
});
