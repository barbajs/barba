import { store } from '../../src/modules';

it('has defaults', () => {
  store.init();
  expect(store._all).toHaveLength(0);
  expect(store._appear).toHaveLength(0);
  expect(store.wait).toBeFalsy();
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
