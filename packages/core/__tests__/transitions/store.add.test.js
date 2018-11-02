/* eslint-disable no-empty-function */
import { store } from '../../src/transitions';

it('add rule update', () => {
  const nb = store.rules.length;
  const r = {
    name: 'test',
    type: 'strings',
  };

  store.add('rule', {
    value: r,
  });
  expect(store.rules).toHaveLength(nb + 1);
  expect(store.rules[0]).toBe(r);
});

it('add rule with position and update', () => {
  const nb = store.rules.length;
  const r = {
    name: 'test',
    type: 'strings',
  };

  store.add('rule', {
    position: 1,
    value: r,
  });
  expect(store.rules).toHaveLength(nb + 1);
  expect(store.rules[1]).toBe(r);
});

it('add transition and update', () => {
  const nb = store.all.length;
  const t = {
    enter() {},
    leave() {},
  };

  store.add('transition', t);
  expect(store.all).toHaveLength(nb + 1);
  expect(store.all[1]).toBe(t);
});

it('update transitions', () => {
  store.update = jest.fn();

  store.add();
  expect(store.update).toHaveBeenCalledTimes(1);
});
