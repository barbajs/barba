import { store } from '../../src/transitions';

beforeEach(() => {
  store.destroy();
});

it('has defaults', () => {
  store.init();
  expect(store._all).toHaveLength(0);
  expect(store._appear).toHaveLength(0);
  expect(store._page).toHaveLength(0);
  expect(store._debug).toBeFalsy();
  expect(store.wait).toBeFalsy();
});

it('sets debug mode', () => {
  store.init(undefined, true);
  expect(store._debug).toBeTruthy();
});

it('adds transitions', () => {
  store.init([{}]);
  expect(store._all).toHaveLength(1);
});

it('updates transitions', () => {
  store._update = jest.fn();

  store.init();
  expect(store._update).toHaveBeenCalledTimes(1);
});

it('returns store', () => {
  expect(store.init()).toBe(store);
});
