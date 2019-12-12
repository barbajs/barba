/* eslint-disable cypress/no-unnecessary-waiting */
const logs = [
  'leave-from',
  'enter-from',
  'leave-default',
  'enter-default',
  'leave-to',
  'enter-to',
];

describe('Route transition', () => {
  it('works', () => {
    cy.prepare('/index.html', 'home', 'home');
    cy.get('[data-test="logs-list"]').as('logs'); // Alias to @hooks
    cy.wait(1000); // Wait for once complete

    // Click link
    cy.get('[data-test=link]').click();
    // Check route "from"
    logs.forEach((name, i) => {
      if (i < 2) {
        cy.get('@logs')
          .find(`:nth-child(${i + 1})`)
          .should('contain', name);
      }
    });

    // Go to default
    cy.get('[data-test=link2]').click();
    // Check no route
    logs.forEach((name, i) => {
      if (i < 4) {
        cy.get('@logs')
          .find(`:nth-child(${i + 1})`)
          .should('contain', name);
      }
    });

    // Back to home
    cy.get('[data-test=link]').click();
    // Check route "to"
    logs.forEach((name, i) => {
      cy.get('@logs')
        .find(`:nth-child(${i + 1})`)
        .should('contain', name);
    });

    // Go to page again, for final check
    cy.get('[data-test=link]').click();
    cy.final('/page.html', 'page', 'page');
  });
});
