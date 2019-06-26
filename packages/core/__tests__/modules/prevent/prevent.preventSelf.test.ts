import { IPreventCheckData, PreventCheck } from '../../../src/defs';
import { Prevent } from '../../../src/modules/Prevent';

const prevent = new Prevent(false);
let check: PreventCheck;
const el = document.createElement('a');

beforeEach(() => {
  check = jest.fn(data => prevent.tests.get('preventSelf')(data));
  [].slice.call(el.attributes).forEach(attr => el.removeAttribute(attr.name));
});

it('pass', () => {
  check({ el } as IPreventCheckData);

  expect(check).toHaveReturnedWith(false);
});

it('prevent with data-barba-prevent', () => {
  el.dataset.barbaPrevent = '';

  check({ el } as IPreventCheckData);

  expect(check).toHaveReturnedWith(true);
});

it('prevent with data-barba-prevent="self"', () => {
  el.dataset.barbaPrevent = 'self';

  check({ el } as IPreventCheckData);

  expect(check).toHaveReturnedWith(true);
});
