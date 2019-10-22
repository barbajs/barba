/* eslint-disable cypress/no-unnecessary-waiting */
describe('Transition', () => {
  it('works', () => {
    cy.prepare('/index.html', 'home', 'home');
    cy.wait(1000); // Wait for appear complete
    // Click link
    cy.get('[data-test=link]').click();
    cy.final('/page.html', 'page', 'page');
  });
});
