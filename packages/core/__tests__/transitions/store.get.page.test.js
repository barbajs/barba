import { store } from '../../src/transitions';

/* eslint-disable no-empty-function, object-property-newline */
const [t] = store.all; // Default transition
const tNs = { enter() {}, namespace: 'ns' };
const tNsFrom = { enter() {}, from: { namespace: 'nsFrom' } };
const tNsTo = { enter() {}, to: { namespace: 'nsTo' } };
const tNsFromTo = {
  enter() {},
  from: { namespace: 'nsFrom' },
  to: { namespace: 'nsTo' },
};
/* eslint-enable no-empty-function, object-property-newline */

store.init([t, tNs, tNsFrom, tNsTo, tNsFromTo]);

it('get "page" transition', () => {
  const result = store.get({
    current: true,
    next: true,
  });

  expect(result).toBe(t);
});

it('get "page/ns" transition', () => {
  const result = store.get({
    current: { namespace: 'ns' },
    next: {},
  });

  expect(result).toBe(tNs);
});

it('get "page/from" transition', () => {
  const result = store.get({
    current: { namespace: 'nsFrom' },
    next: {},
  });

  expect(result).toBe(tNsFrom);
});

it('get "page/to" transition', () => {
  const result = store.get({
    current: {},
    next: { namespace: 'nsTo' },
  });

  expect(result).toBe(tNsTo);
});

it('get "page/fromTo" transition', () => {
  const result = store.get({
    current: { namespace: 'nsFrom' },
    next: { namespace: 'nsTo' },
  });

  expect(result).toBe(tNsFromTo);
});
