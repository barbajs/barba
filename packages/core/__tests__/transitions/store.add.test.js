/* eslint-disable no-empty-function */
import { store } from '../../src/transitions';

it('add rule update', () => {
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

it('add rule with position and update', () => {
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

it('add transition and update', () => {
  const nb = store._all.length;
  const t = {
    enter() {},
    leave() {},
  };

  store.add('transition', t);
  expect(store._all).toHaveLength(nb + 1);
  expect(store._all[0]).toBe(t);
});

it('update transitions', () => {
  store._update = jest.fn();

  store.add();
  expect(store._update).toHaveBeenCalledTimes(1);
});
