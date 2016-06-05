describe('Cache', function() {
  var cache = Barba.Pjax.Cache;

  it('exists', function() {
    expect(cache).toBeTruthy();
    expect(Object.keys(cache.data).length).toBe(0);
  });

  it('.set', function() {
    cache.set('test', 'hello');
    expect(Object.keys(cache.data).length).toBe(1);
  });

  it('.get', function() {
    expect(cache.get('test')).toBe('hello');
    expect(cache.get('undefinedkey')).toBe(undefined);
  });

  it('.reset', function() {
    cache.reset();

    expect(Object.keys(cache.data).length).toBe(0);
  });
});
