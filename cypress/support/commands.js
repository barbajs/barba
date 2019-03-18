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
