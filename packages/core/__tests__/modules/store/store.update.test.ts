/* eslint-disable no-empty-function */
import { Store } from '../../../src/modules/Store';

let store: Store;
let nb: number;

beforeEach(() => {
  nb = 0;
});

it('update all', () => {
  store = new Store([{}]);
  expect(store.all).toHaveLength(nb + 1);
  expect(store.appear).toHaveLength(0);
});

it('update appear', () => {
  store = new Store([{ appear() {} }]);
  expect(store.all).toHaveLength(nb + 1);
  expect(store.appear).toHaveLength(nb + 1);
});

it('update page', () => {
  store = new Store([{ enter() {} }]);
  expect(store.all).toHaveLength(nb + 1);
  expect(store.appear).toHaveLength(0);
});

it('update appear and page', () => {
  store = new Store([{ appear() {}, enter() {} }]);
  expect(store.all).toHaveLength(nb + 1);
  expect(store.appear).toHaveLength(nb + 1);
});
