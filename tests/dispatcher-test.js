describe('Dispatcher', function() {
  var dispatcher = Barba.Dispatcher;
  var triggered = false;
  var fakeFunction = function() {
    triggered = true;
  };

  it('should exist', function() {
    expect(dispatcher).toBeTruthy();
  });

  it('should be able to bind events', function() {
    dispatcher.on('test', fakeFunction);
    var events = Object.keys(dispatcher.events);

    expect(events.length).toBe(1);
    expect(dispatcher.events.test.length).toBe(1);
  });

  it('should be able to trigger events', function() {
    dispatcher.trigger('test');
    dispatcher.trigger('undefinedkey');

    expect(triggered).toBeTruthy();
  });

  it('should be able to remove events', function() {
    dispatcher.off('test', fakeFunction);
    dispatcher.off('undefinedkey', fakeFunction);

    var events = Object.keys(dispatcher.events);

    expect(events.length).toBe(1);
    expect(dispatcher.events.test.length).toBe(0);
  });
});
