/* eslint-disable no-empty-function */
import { store } from '../../src/modules';

const tAppear = { appear() {} };
const tAppearNs = { appear() {}, namespace: true };
const tAppearCustom = {
  appear() {},
  custom({ current }) {
    return current.custom === true;
  },
};

store.init([tAppear, tAppearNs, tAppearCustom]);

it('get "appear" transition', () => {
  const result = store.get(
    {
      current: { namespace: false, custom: false },
    },
    true
  );

  expect(result).toBe(tAppear);
});

it('get "appear/ns" transition', () => {
  const result = store.get(
    {
      current: { namespace: true, custom: false },
    },
    true
  );

  expect(result).toBe(tAppearNs);
});

it('get "appear/custom" transition', () => {
  const result = store.get(
    {
      current: { namespace: false, custom: true },
    },
    true
  );

  expect(result).toBe(tAppearCustom);
});
