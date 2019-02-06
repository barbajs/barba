/* eslint-disable no-empty-function */
import { store } from '../../src/transitions';

let nb;

beforeEach(() => {
  store.destroy();
  nb = 0;
});

it('update all', () => {
  store.add('transition', {});
  expect(store._all).toHaveLength(nb + 1);
  expect(store._appear).toHaveLength(0);
  expect(store._page).toHaveLength(nb + 1);
});

it('update appear', () => {
  store.add('transition', { appear() {} });
  expect(store._all).toHaveLength(nb + 1);
  expect(store._appear).toHaveLength(nb + 1);
  expect(store._page).toHaveLength(nb + 1);
});

it('update page', () => {
  store.add('transition', { enter() {} });
  expect(store._all).toHaveLength(nb + 1);
  expect(store._appear).toHaveLength(0);
  expect(store._page).toHaveLength(nb + 1);
});

it('update appear and page', () => {
  store.add('transition', { appear() {}, enter() {} });
  expect(store._all).toHaveLength(nb + 1);
  expect(store._appear).toHaveLength(nb + 1);
  expect(store._page).toHaveLength(nb + 1);
});

it('update wait', () => {
  store.add('transition', { to: {} });
  expect(store.wait).toBeTruthy();
});
