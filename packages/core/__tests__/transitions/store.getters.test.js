/* eslint-disable no-empty-function */
import { store } from '../../src/transitions';

it('has appear', () => {
  expect(store.hasAppear).toBeFalsy();
  store.init([{ appear() {} }]);
  expect(store.hasAppear).toBeTruthy();
});
