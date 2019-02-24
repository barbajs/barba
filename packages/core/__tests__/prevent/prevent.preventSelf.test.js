import { attributeSchema } from '../../src/schemas';
import { prevent } from '../../src/utils';

prevent.init({ attributeSchema });

let check;
const el = document.createElement('a');

beforeEach(() => {
  check = jest.fn(data => prevent._tests.preventSelf(data));
  [...el.attributes].forEach(attr => el.removeAttribute(attr.name));
});

it('pass', () => {
  check({ el });

  expect(check).toHaveReturnedWith(false);
});

it('prevent with data-barba-prevent', () => {
  el.dataset.barbaPrevent = '';

  check({ el });

  expect(check).toHaveReturnedWith(true);
});

it('prevent with data-barba-prevent="self"', () => {
  el.dataset.barbaPrevent = 'self';

  check({ el });

  expect(check).toHaveReturnedWith(true);
});
