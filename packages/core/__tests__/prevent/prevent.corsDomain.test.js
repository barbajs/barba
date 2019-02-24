import { attributeSchema } from '../../src/schemas';
import { prevent } from '../../src/utils';

prevent.init({ attributeSchema });

let check;
const el = document.createElement('a');

beforeEach(() => {
  check = jest.fn(data => prevent._tests.corsDomain(data));
  [...el.attributes].forEach(attr => el.removeAttribute(attr.name));
});

it('pass', () => {
  el.href = 'http://localhost';

  check({ el });

  expect(check).toHaveReturnedWith(false);
});

it('prevent with different protocol', () => {
  el.href = 'https://localhost';

  check({ el });

  expect(check).toHaveReturnedWith(true);
});

it('prevent with different hostname', () => {
  el.href = 'https://domain.com';

  check({ el });

  expect(check).toHaveReturnedWith(true);
});
