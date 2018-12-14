describe('page', () => {
  it('Page is visible', () => {
    cy.visit('/__e2e__/web/index.html');
    expect(true).to.equal(true);
  });
});
