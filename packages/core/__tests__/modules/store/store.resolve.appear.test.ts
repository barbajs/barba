import { ITransitionAppear, ITransitionData } from '../../../src/defs';
import { Store } from '../../../src/modules/Store';

const tAppear: ITransitionAppear = { appear: () => Promise.resolve() };
const tAppearNs: ITransitionAppear = {
  appear: () => Promise.resolve(),
  namespace: 'ns',
};
const tAppearCustom: ITransitionAppear = {
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
    } as unknown) as ITransitionData,
    { appear: true }
  );

  expect(result).toBe(tAppear);
});

it('get "appear/ns" transition', () => {
  const result = store.resolve(
    ({
      current: { namespace: 'ns' },
    } as unknown) as ITransitionData,
    { appear: true }
  );

  expect(result).toBe(tAppearNs);
});

it('get "appear/custom" transition', () => {
  const result = store.resolve(
    ({
      current: { namespace: 'custom' },
    } as unknown) as ITransitionData,
    { appear: true }
  );

  expect(result).toBe(tAppearCustom);
});
