describe('page', () => {
  it('Page is visible', () => {
    cy.visit('http://localhost:8111/e2e/web');
    expect(true).to.equal(true);
  });
});
