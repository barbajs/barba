import { ITransitionData, ITransitionOnce } from '../../../src/defs';
import { Store } from '../../../src/modules/Store';

const tOnce: ITransitionOnce = { once: () => Promise.resolve() };
const tOnceNs: ITransitionOnce = {
  namespace: 'ns',
  once: () => Promise.resolve(),
};
const tOnceCustom: ITransitionOnce = {
  once: () => Promise.resolve(),
  custom({ current }) {
    return current.namespace === 'custom';
  },
};
const store = new Store([tOnce, tOnceNs, tOnceCustom]);

it('has no transition', async () => {
  const emptyStore = new Store();

  emptyStore.logger.info = jest.fn();
  emptyStore.resolve({} as unknown as ITransitionData, { once: true });

  expect(emptyStore.logger.info).toHaveBeenCalledWith(
    'No transition found [once]'
  );
});

it('get "once" transition', () => {
  const result = store.resolve(
    {
      current: { namespace: 'none' },
    } as unknown as ITransitionData,
    { once: true }
  );

  expect(result).toBe(tOnce);
});

it('get "once/ns" transition', () => {
  const result = store.resolve(
    {
      current: { namespace: 'ns' },
    } as unknown as ITransitionData,
    { once: true }
  );

  expect(result).toBe(tOnceNs);
});

it('get "once/custom" transition', () => {
  const result = store.resolve(
    {
      current: { namespace: 'custom' },
    } as unknown as ITransitionData,
    { once: true }
  );

  expect(result).toBe(tOnceCustom);
});
