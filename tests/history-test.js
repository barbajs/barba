describe('HistoryManager', function() {
  var historyManager = Barba.HistoryManager;

  it('should exists', function() {
    expect(historyManager).toBeTruthy();
    expect(historyManager.history.length).toBe(0);
  });

  it('should be able to add history states', function() {
    historyManager.add('url1', 'namespace1');

    expect(historyManager.history.length).toBe(1);
  });

  it('should be able to retrieve the current status', function() {
    var obj = historyManager.currentStatus();

    expect(obj.url).toBe('url1');
    expect(obj.namespace).toBe('namespace1');
  });

  it('should be able to retrieve the previous status', function() {
    expect(historyManager.prevStatus()).toBeFalsy();

    historyManager.add('url2');

    var current = historyManager.currentStatus();
    var prev = historyManager.prevStatus();

    expect(historyManager.history.length).toBe(2);
    expect(current.url).toBe('url2');
    expect(current.namespace).toBeFalsy();
    expect(prev.url).toBe('url1');
    expect(prev.namespace).toBe('namespace1');
  });
});
