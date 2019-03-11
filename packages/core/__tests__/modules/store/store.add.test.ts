/* tslint:disable:no-string-literal */
import { Store } from '../../../src/modules/Store';

let store: Store;

beforeEach(() => {
  store = new Store();
});

it('add rule', () => {
  const nb = store['_rules'].length;
  const r = {
    name: 'test',
    type: 'strings',
  };

  store.add('rule', {
    value: r,
  });
  expect(store['_rules']).toHaveLength(nb + 1);
  expect(store['_rules'][0]).toBe(r);
});

it('add rule with position', () => {
  const nb = store['_rules'].length;
  const r = {
    name: 'test',
    type: 'strings',
  };

  store.add('rule', {
    position: 1,
    value: r,
  });
  expect(store['_rules']).toHaveLength(nb + 1);
  expect(store['_rules'][1]).toBe(r);
});

it('add transition', () => {
  const nb = store.all.length;
  const t = {};

  store.add('transition', t);
  expect(store.all).toHaveLength(nb + 1);
  expect(store.all[0]).toBe(t);
});
