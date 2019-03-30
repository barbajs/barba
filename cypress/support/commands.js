// ***********************************************
// This example commands.js shows you how to
// create various custom commands and overwrite
// existing commands.
//
// For more comprehensive examples of custom
// commands please read more here:
// https://on.cypress.io/custom-commands
// ***********************************************
//
//
// -- This is a parent command --
// Cypress.Commands.add("login", (email, password) => { ... })
//
//
// -- This is a child command --
// Cypress.Commands.add("drag", { prevSubject: 'element'}, (subject, options) => { ... })
//
//
// -- This is a dual command --
// Cypress.Commands.add("dismiss", { prevSubject: 'optional'}, (subject, options) => { ... })
//
//
// -- This is will overwrite an existing command --
// Cypress.Commands.overwrite("visit", (originalFn, url, options) => { ... })

// Automatically prepend "root path" depending on package
// TODO: it breaks "run all"
Cypress.Commands.overwrite('visit', (originalFn, url, options) => {
  const r = /^packages\/([a-z]*)\/(__e2e__)\/.*\.spec.js$/;
  const root = Cypress.spec.relative.replace(r, '$1/__web__');

  originalFn(root + url, options);
});

Cypress.Commands.add('prepare', (url, title) => {
  // Go to home
  cy.visit(url);
  // Check elements
  cy.get('[data-test=title]')
    .as('h1') // Alias to @h1
    .should('contain', title);
  cy.get('[data-test=container]').as('current');
});

Cypress.Commands.add('end', (url, title) => {
  // 1. URL has changed
  cy.url().should('include', url);
  // 2. H1 has changed
  cy.get('@h1').should('contain', title);
  // 3. Page title has changed
  cy.title().should('contain', title);
  // 4. Current container has been removed
  cy.get('@current').should('not.exist');
});
