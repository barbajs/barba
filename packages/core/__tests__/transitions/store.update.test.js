/* eslint-disable no-empty-function */
import { store } from '../../src/transitions';

it('update appear', () => {
  const nb = store._appear.length;

  store.add('transition', { appear() {} });
  expect(store._appear).toHaveLength(nb + 1);
});

it('update wait', () => {
  expect(store.wait).toBeFalsy();
  store.add('transition', { to: {} });
  expect(store.wait).toBeTruthy();
});
