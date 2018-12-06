import prevent from '../../src/prevent';
import { attributeSchema } from '../../src/schema';

prevent.init({ attributeSchema });

let check;
const el = document.createElement('a');

beforeEach(() => {
  check = jest.fn(data => prevent.tests.blank(data));
  [...el.attributes].forEach(attr => el.removeAttribute(attr.name));
});

it('pass', () => {
  check({ el });

  expect(check).toHaveReturnedWith(false);
});

it('pass with different target attribute', () => {
  el.setAttribute('target', '_self');

  check({ el });

  expect(check).toHaveReturnedWith(false);
});

it('prevent with target "_blank"', () => {
  el.setAttribute('target', '_blank');

  check({ el });

  expect(check).toHaveReturnedWith(true);
});
