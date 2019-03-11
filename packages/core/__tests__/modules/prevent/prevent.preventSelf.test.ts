import { Prevent } from '../../../src/modules/Prevent';
import { PreventCheck, PreventCheckData } from '../../../src/defs';

const prevent = new Prevent(false);
let check: PreventCheck;
const el = (document.createElement('a') as unknown) as HTMLLinkElement;

beforeEach(() => {
  check = jest.fn(data => prevent.tests.get('preventSelf')(data));
  [].slice.call(el.attributes).forEach(attr => el.removeAttribute(attr.name));
});

it('pass', () => {
  check({ el } as PreventCheckData);

  expect(check).toHaveReturnedWith(false);
});

it('prevent with data-barba-prevent', () => {
  el.dataset.barbaPrevent = '';

  check({ el } as PreventCheckData);

  expect(check).toHaveReturnedWith(true);
});

it('prevent with data-barba-prevent="self"', () => {
  el.dataset.barbaPrevent = 'self';

  check({ el } as PreventCheckData);

  expect(check).toHaveReturnedWith(true);
});
