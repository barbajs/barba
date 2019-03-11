/* eslint-disable no-empty-function */
import { Store } from '../../../src/modules/Store';
import { TransitionData, TransitionAppear } from '../../../src/defs';

const tAppear: TransitionAppear = { appear: () => Promise.resolve() };
const tAppearNs: TransitionAppear = {
  appear: () => Promise.resolve(),
  namespace: 'ns',
};
const tAppearCustom: TransitionAppear = {
  appear: () => Promise.resolve(),
  custom({ current }) {
    return current.namespace === 'custom';
  },
};

const store = new Store([tAppear, tAppearNs, tAppearCustom]);

it('get "appear" transition', () => {
  const result = store.resolve(
    ({
      current: { namespace: 'none' },
    } as unknown) as TransitionData,
    true
  );

  expect(result).toBe(tAppear);
});

it('get "appear/ns" transition', () => {
  const result = store.resolve(
    ({
      current: { namespace: 'ns' },
    } as unknown) as TransitionData,
    true
  );

  expect(result).toBe(tAppearNs);
});

it('get "appear/custom" transition', () => {
  const result = store.resolve(
    ({
      current: { namespace: 'custom' },
    } as unknown) as TransitionData,
    true
  );

  expect(result).toBe(tAppearCustom);
});
