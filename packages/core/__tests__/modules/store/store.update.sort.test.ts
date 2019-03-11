/* eslint-disable no-empty-function */
import transitions from '../../../__mocks__/transitions';
import shuffle from 'lodash/shuffle';
import { Store } from '../../../src/modules/Store';

let store: Store;

const expected = transitions.map(t => t.name).reverse();
const times = (x: number) => (f: Function) => {
  if (x > 0) {
    f();
    times(x - 1)(f);
  }
};

const r = {
  name: 'route',
  type: 'strings',
};

times(50)(() => {
  it('sort all', () => {
    store = new Store(shuffle(transitions));
    store.add('rule', {
      position: 1,
      value: r,
    });

    expect(store.all).toHaveLength(transitions.length);
    expect(store.all.map(t => t.name)).toEqual(expected);
  });
});
