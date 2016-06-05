describe('Dispatcher', function() {
  var dispatcher = Barba.Dispatcher;
  var triggered = false;
  var fakeFunction = function() {
    triggered = true;
  };

  it('exists', function() {
    expect(dispatcher).toBeTruthy();
  });

  it('.on', function() {
    dispatcher.on('test', fakeFunction);
    var events = Object.keys(dispatcher.events);

    expect(events.length).toBe(1);
    expect(dispatcher.events.test.length).toBe(1);
  });

  it('.trigger', function() {
    dispatcher.trigger('test');
    dispatcher.trigger('undefinedkey');

    expect(triggered).toBeTruthy();
  });

  it('.off', function() {
    dispatcher.off('test', fakeFunction);
    dispatcher.off('undefinedkey', fakeFunction);

    var events = Object.keys(dispatcher.events);

    expect(events.length).toBe(1);
    expect(dispatcher.events.test.length).toBe(0);
  });
});
