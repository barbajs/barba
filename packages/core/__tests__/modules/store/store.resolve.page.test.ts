import { Store } from '../../../src/modules/Store';
import { TransitionData } from '../../../src/defs';

/* eslint-disable no-empty-function */
const t = { enter() {} };
const tNs = { enter() {}, namespace: 'ns' };
const tNsFrom = { enter() {}, from: { namespace: 'nsFrom' } };
const tNsTo = { enter() {}, to: { namespace: 'nsTo' } };
const tNsFromTo = {
  enter() {},
  from: { namespace: 'nsFrom' },
  to: { namespace: 'nsTo' },
};
/* eslint-enable no-empty-function */

const store = new Store([t, tNs, tNsFrom, tNsTo, tNsFromTo]);

it('get "page" transition', () => {
  const result = store.resolve(({
    current: true,
    next: true,
  } as unknown) as TransitionData);

  expect(result).toBe(t);
});

it('get "page/ns" transition', () => {
  const result = store.resolve(({
    current: { namespace: 'ns' },
    next: {},
  } as unknown) as TransitionData);

  expect(result).toBe(tNs);
});

it('get "page/from" transition', () => {
  const result = store.resolve(({
    current: { namespace: 'nsFrom' },
    next: {},
  } as unknown) as TransitionData);

  expect(result).toBe(tNsFrom);
});

it('get "page/to" transition', () => {
  const result = store.resolve(({
    current: {},
    next: { namespace: 'nsTo' },
  } as unknown) as TransitionData);

  expect(result).toBe(tNsTo);
});

it('get "page/fromTo" transition', () => {
  const result = store.resolve(({
    current: { namespace: 'nsFrom' },
    next: { namespace: 'nsTo' },
  } as unknown) as TransitionData);

  expect(result).toBe(tNsFromTo);
});
