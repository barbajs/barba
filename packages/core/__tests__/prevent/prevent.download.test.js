/* eslint-disable object-property-newline */
import prevent from '../../src/prevent';
import { attributeSchema } from '../../src/schema';

prevent.init({ attributeSchema });

let check;
const el = document.createElement('a');

beforeEach(() => {
  check = jest.fn(data => prevent.tests.download(data));
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
