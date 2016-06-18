describe('Barba exists', function() {
  it('should have Promise', function() {
    expect(window.Promise).toBeTruthy();
  });

  it('should have a version string', function() {
    expect(Barba.version).toEqual(jasmine.any(String));
  });
});
