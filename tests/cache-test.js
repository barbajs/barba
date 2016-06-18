describe('Cache', function() {
  var cache = Barba.Pjax.Cache;

  it('should exists', function() {
    expect(cache).toBeTruthy();
    expect(Object.keys(cache.data).length).toBe(0);
  });

  it('should be able to cache information', function() {
    cache.set('test', 'hello');
    expect(Object.keys(cache.data).length).toBe(1);
  });

  it('should be able to get saved information', function() {
    expect(cache.get('test')).toBe('hello');
    expect(cache.get('undefinedkey')).toBe(undefined);
  });

  it('should be able to reset the cache', function() {
    cache.reset();

    expect(Object.keys(cache.data).length).toBe(0);
  });
});
