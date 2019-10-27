/* eslint-disable cypress/no-unnecessary-waiting */
describe('Transition', () => {
  it('adds container at the right place', () => {
    cy.prepare('/container.html', 'container', 'container');
    cy.get('[data-test=sibling]').as('sibling');
    cy.get('[data-test=link]').click();
    cy.final('/page.html', 'page', 'page');
    cy.get('@wrapper')
      .children()
      .eq(1)
      .should('have.attr', 'data-test-container', 'next');
    cy.get('@wrapper')
      .children()
      .eq(2)
      .should('have.attr', 'data-test', 'sibling');
  });

  it('adds container at the right place [sync]', () => {
    cy.prepare('/container.html', 'container', 'container');
    cy.get('[data-test=sibling]').as('sibling');
    cy.get('[data-test="link.sync"]').click();
    cy.final('/page.html', 'page', 'page');
    cy.get('@wrapper')
      .children()
      .eq(1)
      .should('have.attr', 'data-test-container', 'next');
    cy.get('@wrapper')
      .children()
      .eq(2)
      .should('have.attr', 'data-test', 'sibling');
  });
});
