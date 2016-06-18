describe('Pjax', function() {
  var pjax = Barba.Pjax;

  it('should exists', function() {
    expect(pjax.Dom).toBeTruthy();
    expect(pjax.History).toBeTruthy();
    expect(pjax.Cache).toBeTruthy();
    expect(pjax.cacheEnabled).toBe(true);
    expect(pjax.transitionProgress).toBe(false);
  });
});
