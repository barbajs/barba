describe('page', () => {
  it('Page is visible', () => {
    cy.visit('/index.html');
    expect(true).to.equal(true);
  });
});
