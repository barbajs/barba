const hooksDefault = [
  'before',
  'beforeLeave',
  'leave',
  'afterLeave',
  'beforeEnter',
  'enter',
  'afterEnter',
  'after',
];
const hooksSync = [
  'before',
  'beforeLeave',
  'beforeEnter',
  'leave',
  'enter',
  'afterLeave',
  'afterEnter',
  'after',
];

beforeEach(() => {
  cy.prepare('/index.html', 'home', 'home');
  cy.get('[data-test="hooks-list"]')
    .as('hooks') // Alias to @hooks
    .find('li')
    .should('have.length', 0);
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
