describe('Pjax', function() {
  var pjax = Barba.Pjax;

  it('should exists', function() {
    expect(pjax.Dom).toBeTruthy();
    expect(pjax.History).toBeTruthy();
    expect(pjax.Cache).toBeTruthy();
    expect(pjax.cacheEnabled).toBe(true);
    expect(pjax.transitionProgress).toBe(false);
  });

  it('parses .href', function() {
    var el1 = document.createElement('a');
        el1.href = 'http://google.com';

    var el2 = document.createElement('a');
        el2.href = 'https://mywebsite.com';

    var el3 = document.createElement('a');
        el3.href = '/internalpage';

    var el4 = document.createElement('a');
        el4.href = '#anchor';

    var el5 = document.createElement('a');
        el5.setAttribute('xlink:href', 'http://website.com');

    expect(pjax.getHref(el1)).toContain('http://google.com');
    expect(pjax.getHref(el2)).toContain('https://mywebsite.com');
    expect(pjax.getHref(el3)).toContain('/internalpage');
    expect(pjax.getHref(el4)).toContain('#anchor');
    expect(pjax.getHref(el5)).toContain('http://website.com');
  });
});
