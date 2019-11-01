/* tslint:disable:no-empty */
import { Store } from '../../../src/modules/Store';

let store: Store;
let nb: number;

beforeEach(() => {
  nb = 0;
});

it('update all', () => {
  store = new Store([{}]);
  expect(store.all).toHaveLength(nb + 1);
  expect(store.once).toHaveLength(0);
});

it('update once', () => {
  store = new Store([{ once() {} }]);
  expect(store.all).toHaveLength(nb + 1);
  expect(store.once).toHaveLength(nb + 1);
});

it('update page', () => {
  store = new Store([{ enter() {} }]);
  expect(store.all).toHaveLength(nb + 1);
  expect(store.once).toHaveLength(0);
});

it('update once and page', () => {
  store = new Store([{ once() {}, enter() {} }]);
  expect(store.all).toHaveLength(nb + 1);
  expect(store.once).toHaveLength(nb + 1);
});
