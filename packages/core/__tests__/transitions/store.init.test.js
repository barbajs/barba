import { store } from '../../src/transitions';

it('has default transition', () => {
  store.init();
  expect(store._all).toHaveLength(0);
});

it('has no appear transition', () => {
  store.init();
  expect(store._appear).toHaveLength(0);
});

it('has no wait', () => {
  store.init();
  expect(store.wait).toBeFalsy();
});

it('has debug mode', () => {
  store.init(undefined, true);
  expect(store._debug).toBeTruthy();
});

it('adds transitions', () => {
  store.init([{}, {}]);
  expect(store._all).toHaveLength(2);
});

it('updates transitions', () => {
  store._update = jest.fn();

  store.init();
  expect(store._update).toHaveBeenCalledTimes(1);
});
