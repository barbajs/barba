describe('page', () => {
  it('Page is visible', () => {
    cy.visit('/');
    expect(true).to.equal(true);
  });
});
