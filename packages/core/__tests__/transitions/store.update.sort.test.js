/* eslint-disable no-empty-function */
import shuffle from 'lodash/shuffle';
import { store } from '../../src/transitions';
import transitions from 'transitions';

const expected = transitions.map(t => t.name).reverse();
const times = x => f => {
  if (x > 0) {
    f();
    times(x - 1)(f);
  }
};

const r = {
  name: 'route',
  type: 'strings',
};

store.add('rule', {
  position: 1,
  value: r,
});

beforeEach(() => {
  store.destroy();
});

times(50)(() => {
  it('sort all', () => {
    store.init(shuffle(transitions));

    expect(store._all).toHaveLength(transitions.length);
    expect(store._all.map(t => t.name)).toEqual(expected);
  });
});
