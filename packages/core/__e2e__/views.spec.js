/* eslint-disable no-mixed-operators, cypress/no-unnecessary-waiting */
const loadHooks = ['beforeEnter', 'afterEnter'];
const transitionHooks = [
  'beforeLeave',
  'afterLeave',
  'beforeEnter',
  'afterEnter',
];

beforeEach(() => {
  cy.prepare('/views.html', 'home', 'home');
  cy.get('[data-test="hooks-list"]').as('hooks'); // Alias to @hooks
});
afterEach(() => {
  cy.final('/page.html', 'page', 'page');
});

describe('Views hooks', () => {
  it('have default order', () => {
    cy.wait(1000); // Wait for once complete

    // Checks…
    loadHooks.forEach((name, i) => {
      cy.get('@hooks')
        .find(`:nth-child(${i + 1})`)
        .should('contain', name);
    });

    // Click link
    cy.get('[data-test="link.hooks"]').click();

    // Checks…
    transitionHooks.forEach((name, i) => {
      const j = i + loadHooks.length;

      cy.get('@hooks')
        .find(`:nth-child(${j + 1})`)
        .should('contain', name);
    });
  });
  // it('have sync order', () => {
  //   cy.wait(1000); // Wait for once complete
  //   // Click link
  //   cy.get('[data-test="link.hooks-sync"]').click();

  //   // Checks…
  //   hooksSync.forEach((name, i) => {
  //     cy.get('@hooks')
  //       .find(`:nth-child(${i + 1})`)
  //       .should('contain', name);
  //   });
  // });
});
