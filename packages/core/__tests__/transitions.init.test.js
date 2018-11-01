import transitions from '../src/transitions';

it('has default transition', () => {
  transitions.init();
  expect(transitions.all).toHaveLength(1);
});

it('has no appear transition', () => {
  transitions.init();
  expect(transitions.appear).toHaveLength(0);
});

it('has no wait', () => {
  transitions.init();
  expect(transitions.wait).toBeFalsy();
});

it('has debug mode', () => {
  transitions.init(undefined, true);
  expect(transitions.debug).toBeTruthy();
});

it('adds transitions', () => {
  transitions.init([{}, {}]);
  expect(transitions.all).toHaveLength(3);
});

it('updates transitions', () => {
  transitions.update = jest.fn();

  transitions.init();
  expect(transitions.update).toHaveBeenCalledTimes(1);
});
