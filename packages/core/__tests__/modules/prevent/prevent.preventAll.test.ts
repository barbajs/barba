import { IPreventCheckData, PreventCheck } from '../../../src/defs';
import { Prevent } from '../../../src/modules/Prevent';

const prevent = new Prevent(false);
let check: PreventCheck;
const el = document.createElement('a');
const parent = document.createElement('div');

parent.appendChild(el);

beforeEach(() => {
  check = jest.fn(data => prevent.tests.get('preventAll')(data));
  [].slice.call(el.attributes).forEach(attr => el.removeAttribute(attr.name));
});

it('pass', () => {
  check({ el } as IPreventCheckData);

  expect(check).toHaveReturnedWith(false);
});

it('prevent with data-barba-prevent="all"', () => {
  parent.dataset.barbaPrevent = 'all';

  check({ el } as IPreventCheckData);

  expect(check).toHaveReturnedWith(true);
});
