/* eslint-disable no-empty-function */
import { store } from '../../src/transitions';

it('add rule', () => {
  const nb = store._rules.length;
  const r = {
    name: 'test',
    type: 'strings',
  };

  store.add('rule', {
    value: r,
  });
  expect(store._rules).toHaveLength(nb + 1);
  expect(store._rules[0]).toBe(r);
});

it('add rule with position', () => {
  const nb = store._rules.length;
  const r = {
    name: 'test',
    type: 'strings',
  };

  store.add('rule', {
    position: 1,
    value: r,
  });
  expect(store._rules).toHaveLength(nb + 1);
  expect(store._rules[1]).toBe(r);
});

it('add transition', () => {
  const nb = store._all.length;
  const t = {};

  store.add('transition', t);
  expect(store._all).toHaveLength(nb + 1);
  expect(store._all[0]).toBe(t);
});
