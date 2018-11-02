import { store } from '../../src/transitions';

it('has default transition', () => {
  store.init();
  expect(store.all).toHaveLength(1);
});

it('has no appear transition', () => {
  store.init();
  expect(store.appear).toHaveLength(0);
});

it('has no wait', () => {
  store.init();
  expect(store.wait).toBeFalsy();
});

it('has debug mode', () => {
  store.init(undefined, true);
  expect(store.debug).toBeTruthy();
});

it('adds transitions', () => {
  store.init([{}, {}]);
  expect(store.all).toHaveLength(3);
});

it('updates transitions', () => {
  store.update = jest.fn();

  store.init();
  expect(store.update).toHaveBeenCalledTimes(1);
});
