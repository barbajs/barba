/* eslint-disable no-mixed-operators, cypress/no-unnecessary-waiting */
const appearHooks = [
  'global:beforeEnter',
  // 'global:before',
  // 'before',
  'global:beforeAppear',
  'beforeAppear',
  'global:appear',
  'appear',
  'global:afterAppear',
  'afterAppear',
  // 'global:after',
  // 'after',
  'global:afterEnter',
];
const hooksDefault = [
  ...appearHooks,
  'global:before',
  'before',
  'global:beforeLeave',
  'beforeLeave',
  'global:leave',
  'leave',
  'global:afterLeave',
  'afterLeave',
  'global:beforeEnter',
  'beforeEnter',
  'global:enter',
  'enter',
  'global:afterEnter',
  'afterEnter',
  'global:after',
  'after',
];
const hooksSync = [
  ...appearHooks,
  'global:before',
  'before',
  'global:beforeLeave',
  'beforeLeave',
  'global:beforeEnter',
  'beforeEnter',
  'global:leave',
  'global:enter',
  'leave',
  'enter',
  'global:afterLeave',
  'afterLeave',
  'global:afterEnter',
  'afterEnter',
  'global:after',
  'after',
];

beforeEach(() => {
  cy.prepare('/index.html', 'home', 'home');
  cy.get('[data-test="hooks-list"]').as('hooks'); // Alias to @hooks
});
afterEach(() => {
  cy.final('/page.html', 'page', 'page');
});

describe('Hooks', () => {
  it('have default order', () => {
    cy.wait(1000); // Wait for appear complete
    // Click link
    cy.get('[data-test="link.hooks"]').click();

    // Checks…
    hooksDefault.forEach((name, i) => {
      cy.get('@hooks')
        .find(`:nth-child(${i + 1})`)
        .should('contain', name);
    });
  });
  it('have sync order', () => {
    cy.wait(1000); // Wait for appear complete
    // Click link
    cy.get('[data-test="link.hooks-sync"]').click();

    // Checks…
    hooksSync.forEach((name, i) => {
      cy.get('@hooks')
        .find(`:nth-child(${i + 1})`)
        .should('contain', name);
    });
  });
});
