import { attributeSchema } from '../../src/schemas';
import { prevent } from '../../src/utils';

prevent.init({ attributeSchema });

let check;

beforeEach(() => {
  check = jest.fn(data => prevent._tests.exists(data));
});

it('pass (with element and href)', () => {
  check({ el: true, href: true });

  expect(check).toHaveReturnedWith(false);
});

it('prevent with no element and no href', () => {
  check({ el: false, href: false });

  expect(check).toHaveReturnedWith(true);
});

it('prevent with element but no href', () => {
  check({ el: true, href: false });

  expect(check).toHaveReturnedWith(true);
});

it('prevent with no element but href', () => {
  check({ el: false, href: true });

  expect(check).toHaveReturnedWith(true);
});
