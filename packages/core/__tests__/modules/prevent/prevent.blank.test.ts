import { Prevent } from '../../../src/modules/Prevent';
import { PreventCheck, PreventCheckData } from '../../../src/defs';

const prevent = new Prevent(false);
let check: PreventCheck;
const el = (document.createElement('a') as unknown) as HTMLLinkElement;

beforeEach(() => {
  check = jest.fn(data => prevent.tests.get('blank')(data));
  [].slice.call(el.attributes).forEach(attr => el.removeAttribute(attr.name));
});

it('pass', () => {
  check({ el } as PreventCheckData);

  expect(check).toHaveReturnedWith(false);
});

it('pass with different target attribute', () => {
  el.setAttribute('target', '_self');

  check({ el } as PreventCheckData);

  expect(check).toHaveReturnedWith(false);
});

it('prevent with target "_blank"', () => {
  el.setAttribute('target', '_blank');

  check({ el } as PreventCheckData);

  expect(check).toHaveReturnedWith(true);
});
