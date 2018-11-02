/* eslint-disable no-empty-function */
import { store } from '../../src/transitions';

it('update appear', () => {
  const nb = store.appear.length;

  store.add('transition', { appear() {} });
  expect(store.appear).toHaveLength(nb + 1);
});

it('update wait', () => {
  store.add('transition', { to: {} });
  expect(store.wait).toBeTruthy();
});
