import prevent from '../../src/prevent';
import { attributeSchema } from '../../src/schema';

prevent.init({ attributeSchema });

let check;
const el = document.createElement('a');

beforeEach(() => {
  check = jest.fn(data => prevent._tests.hasPrevent(data));
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
