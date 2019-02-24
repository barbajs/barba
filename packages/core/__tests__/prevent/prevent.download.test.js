import { attributeSchema } from '../../src/schemas';
import { prevent } from '../../src/utils';

prevent.init({ attributeSchema });

let check;
const el = document.createElement('a');

beforeEach(() => {
  check = jest.fn(data => prevent._tests.download(data));
  [...el.attributes].forEach(attr => el.removeAttribute(attr.name));
});

it('pass', () => {
  check({ el });

  expect(check).toHaveReturnedWith(false);
});

it('prevent with download attribute', () => {
  el.setAttribute('download', true);

  check({ el });

  expect(check).toHaveReturnedWith(true);
});
