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

Cypress.Commands.add('prepare', (url, title, namespace) => {
  // 1. Go to home
  cy.visit(url);
  // 2. Should have wrapper and container
  cy.get('[data-barba=wrapper]')
    .as('wrapper')
    .should('exist');
  cy.get('[data-barba=container]').should('exist');
  // 3. Titles have correct content
  cy.title().should('contain', title);
  cy.get('[data-test=title]')
    .as('h1') // Alias to @h1
    .should('contain', title);
  // 4. Aliases current container
  cy.get('[data-test-container=current]').as('current');
  // 4. Check namespace if provided
  if (namespace) {
    cy.get('@current').should('have.attr', 'data-barba-namespace', namespace);
  }
});

Cypress.Commands.add('final', (url, title, namespace) => {
  // 0. Wrapper is the same
  cy.get('@wrapper').should('have.attr', 'data-test-wrapper', 'current');
  // 1. URL has changed
  cy.url().should('include', url);
  // 2. H1 has changed
  cy.get('@h1').should('contain', title);
  // 3. Page title has changed
  cy.title().should('contain', title);
  // 4. Current container has been removed
  cy.get('@current').should('not.exist');
  // 5. Next container exists
  cy.get('[data-test-container=next]')
    .as('next')
    .should('exist');
  // 6. Check namespace if provided
  if (namespace) {
    cy.get('@next').should('have.attr', 'data-barba-namespace', namespace);
  }
});
