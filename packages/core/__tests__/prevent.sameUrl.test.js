/* eslint-disable object-property-newline */
import prevent from '../src/prevent';
import { attributeSchema } from '../src/schema';

prevent.init({ attributeSchema });

let check;

beforeEach(() => {
  check = jest.fn(data => prevent.tests.sameUrl(data));
});

it('pass', () => {
  check({ href: 'somewhere' });

  expect(check).toHaveReturnedWith(false);
});

it('prevent with same url', () => {
  check({ href: window.location.href });

  expect(check).toHaveReturnedWith(true);
});
