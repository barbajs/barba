describe('Barba exists', function() {
  it('Promise exists', function() {
    expect(window.Promise).toBeTruthy();
  });

  it('Barba version is a string', function() {
    expect(Barba.version).toEqual(jasmine.any(String));
  });
});
