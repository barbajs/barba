describe('Utils', function() {
  var utils = Barba.Utils;

  it('should exists', function() {
    expect(utils).toBeTruthy();
  });

  it('should get the current url', function() {
    expect(utils.getCurrentUrl()).toBe('http://localhost:9876/context.html');
  });

  it('should be able to clean a link', function() {
    expect(utils.cleanLink('http://test.com')).toBe('http://test.com');
    expect(utils.cleanLink('https://test.com/test/')).toBe('https://test.com/test/');
    expect(utils.cleanLink('https://test.com/test.php?example')).toBe('https://test.com/test.php?example');
    expect(utils.cleanLink('https://test.com/test.php#hash')).toBe('https://test.com/test.php');
    expect(utils.cleanLink('https://test.com/test#verylonghashtest/test')).toBe('https://test.com/test');
    expect(utils.cleanLink('https://test.com/#hash')).toBe('https://test.com/');
  });

  it('should have an xhrTimeout', function() {
    expect(utils.xhrTimeout).toBe(5000);
    utils.xhrTimeout = 2000;
    expect(utils.xhrTimeout).toBe(2000);
  });

  it('should be able to extend an object', function() {
    var testObj = {
      name: 'Luigi',
      surname: 'De Rosa',
      age: 23,
      func: function() {}
    };

    var newObj = utils.extend(testObj, {
      age: 24,
      newKey: 'test'
    });

    expect(newObj.name).toBe('Luigi');
    expect(newObj.age).toBe(24);
    expect(newObj.newKey).toBe('test');
  });

  it('should have Deferred object', function() {
    var deferred = utils.deferred();

    expect(deferred.promise).toBeTruthy();
    expect(deferred.resolve).toBeTruthy();
    expect(deferred.reject).toBeTruthy();
  });

  it('should be able to retrieve current port', function() {
    expect(utils.getPort()).toBe(9876);
    expect(utils.getPort('80')).toBe(80);
    expect(utils.getPort('443')).toBe(443);
  });
});
