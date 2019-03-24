/* tslint:disable:no-empty */
import { ITransitionData } from '../../../src/defs';
import { Store } from '../../../src/modules/Store';

const t = { enter() {} };
const tNs = { enter() {}, namespace: 'ns' };
const tNsFrom = { enter() {}, from: { namespace: 'nsFrom' } };
const tNsTo = { enter() {}, to: { namespace: 'nsTo' } };
const tNsFromTo = {
  enter() {},
  from: { namespace: 'nsFrom' },
  to: { namespace: 'nsTo' },
};
const tSelf = { name: 'self' };

const store = new Store([t, tNs, tNsFrom, tNsTo, tNsFromTo, tSelf]);

it('get "page" transition', () => {
  const result = store.resolve(({
    current: true,
    next: true,
  } as unknown) as ITransitionData);

  expect(result).toBe(t);
});

it('get "page/ns" transition', () => {
  const result = store.resolve(({
    current: { namespace: 'ns' },
    next: {},
  } as unknown) as ITransitionData);

  expect(result).toBe(tNs);
});

it('get "page/from" transition', () => {
  const result = store.resolve(({
    current: { namespace: 'nsFrom' },
    next: {},
  } as unknown) as ITransitionData);

  expect(result).toBe(tNsFrom);
});

it('get "page/to" transition', () => {
  const result = store.resolve(({
    current: {},
    next: { namespace: 'nsTo' },
  } as unknown) as ITransitionData);

  expect(result).toBe(tNsTo);
});

it('get "page/fromTo" transition', () => {
  const result = store.resolve(({
    current: { namespace: 'nsFrom' },
    next: { namespace: 'nsTo' },
  } as unknown) as ITransitionData);

  expect(result).toBe(tNsFromTo);
});

it('get "self" transition', () => {
  const result = store.resolve(
    ({
      current: { namespace: 'nsFrom' },
      next: { namespace: 'nsTo' },
    } as unknown) as ITransitionData,
    { self: true }
  );

  expect(result).toBe(tSelf);
});
