/* eslint-disable no-empty-function */
import { store } from '../../src/modules';

it('resets defaults', () => {
  store.init([{ appear() {} }, { enter() {} }, { to: {} }], true);
  store.destroy();

  expect(store._all).toHaveLength(0);
  expect(store._appear).toHaveLength(0);
  expect(store.wait).toBeFalsy();
});
