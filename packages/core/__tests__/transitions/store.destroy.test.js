/* eslint-disable no-empty-function */
import { store } from '../../src/transitions';

it('has defaults', () => {
  store.init([{ appear() {} }, { enter() {} }, { to: {} }], true);
  store.destroy();

  expect(store._all).toHaveLength(0);
  expect(store._appear).toHaveLength(0);
  expect(store._page).toHaveLength(0);
  expect(store._debug).toBeFalsy();
  expect(store.wait).toBeFalsy();
});
