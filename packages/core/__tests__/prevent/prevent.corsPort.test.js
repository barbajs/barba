import { attributeSchema } from '../../src/schemas';
import { prevent } from '../../src/utils';

prevent.init({ attributeSchema });

let check;
const el = document.createElement('a');

beforeEach(() => {
  check = jest.fn(data => prevent._tests.corsPort(data));
  [...el.attributes].forEach(attr => el.removeAttribute(attr.name));
});

it('pass', () => {
  el.href = 'http://localhost';

  check({ el });

  expect(check).toHaveReturnedWith(false);
});

it('prevent with different port', () => {
  el.href = 'https://localhost:8888';

  check({ el });

  expect(check).toHaveReturnedWith(true);
});
