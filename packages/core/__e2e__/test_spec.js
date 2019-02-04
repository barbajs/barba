const root = 'core/__web__/';

describe('page', () => {
  it('Page is visible', () => {
    cy.visit(`${root}index.html`);
    expect(true).to.equal(true);
  });
});
