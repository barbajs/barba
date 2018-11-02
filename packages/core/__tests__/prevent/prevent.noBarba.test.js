/* eslint-disable object-property-newline */
import prevent from '../../src/prevent';
import { attributeSchema } from '../../src/schema';

prevent.init({ attributeSchema });

let check;
const el = document.createElement('a');

beforeEach(() => {
  check = jest.fn(data => prevent.tests.noBarba(data));
  [...el.attributes].forEach(attr => el.removeAttribute(attr.name));
});

it('pass', () => {
  check({ el });

  expect(check).toHaveReturnedWith(false);
});

it('prevent with data-barba="prevent"', () => {
  el.dataset.barba = 'prevent';

  check({ el });

  expect(check).toHaveReturnedWith(true);
});

it('prevent with class="no-barba"', () => {
  el.classList.add('no-barba');

  check({ el });

  expect(check).toHaveReturnedWith(true);
});
