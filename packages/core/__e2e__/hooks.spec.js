/* eslint-disable no-mixed-operators */
const hooksDefault = [
  'global:beforeAppear',
  'beforeAppear',
  'global:appear',
  'appear',
  'global:afterAppear',
  'afterAppear',
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
  'global:beforeAppear',
  'beforeAppear',
  'global:appear',
  'appear',
  'global:afterAppear',
  'afterAppear',
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
