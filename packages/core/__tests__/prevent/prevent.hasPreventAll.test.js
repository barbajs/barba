import prevent from '../../src/prevent';
import { attributeSchema } from '../../src/schema';

prevent.init({ attributeSchema });

let check;
const parent = document.createElement('div');
const el = document.createElement('a');

parent.appendChild(el);

beforeEach(() => {
  check = jest.fn(data => prevent._tests.hasPreventAll(data));
  [...el.attributes].forEach(attr => el.removeAttribute(attr.name));
});

it('pass', () => {
  check({ el });

  expect(check).toHaveReturnedWith(false);
});

it('prevent with data-barba-prevent="all"', () => {
  parent.dataset.barbaPrevent = 'all';

  check({ el });

  expect(check).toHaveReturnedWith(true);
});
