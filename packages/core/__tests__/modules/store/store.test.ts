import { Store } from '../../../src/modules/Store';

let store: Store;

it('has defaults', () => {
  store = new Store([]);

  expect(store.all).toHaveLength(0);
  expect(store.appear).toHaveLength(0);
});

it('adds transitions', () => {
  store = new Store([{}]);
  expect(store.all).toHaveLength(1);
});
