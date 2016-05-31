describe('Barba exists', function() {
  it('Promise exists', function() {
    expect(window.Promise).toBeTruthy();
  });

  it('Barba version is a string', function() {
    expect(Barba.version).toEqual(jasmine.any(String));
  });
});

describe('Dispatcher', function() {
  var triggered = false;
  var fakeFunction = function() {
    triggered = true;
  };

  it('Dispatcher exists', function() {
    expect(Barba.Dispatcher).toBeTruthy();
  });

  it('Dispatcher .on', function() {
    Barba.Dispatcher.on('test', fakeFunction);
    var events = Object.keys(Barba.Dispatcher.events);

    expect(events.length).toBe(1);
  });

  it('Dispatcher .trigger', function() {
    Barba.Dispatcher.trigger('test');

    expect(triggered).toBeTruthy();
  });

  /*it('Dispatcher .off', function() {
    Barba.Dispatcher.off('test', fakeFunction);
    var events = Object.keys(Barba.Dispatcher.events);

    expect(events.length).toBe(0);
  });*/
});
