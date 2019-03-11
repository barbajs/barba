import { Prevent } from '../../../src/modules/Prevent';
import { PreventCheck, PreventCheckData } from '../../../src/defs';

const prevent = new Prevent(false);
let check: PreventCheck;
const el = (document.createElement('a') as unknown) as HTMLLinkElement;

beforeEach(() => {
  check = jest.fn(data => prevent.tests.get('corsDomain')(data));
  [].slice.call(el.attributes).forEach(attr => el.removeAttribute(attr.name));
});

it('pass', () => {
  el.href = 'http://localhost';

  check({ el } as PreventCheckData);

  expect(check).toHaveReturnedWith(false);
});

it('prevent with different protocol', () => {
  el.href = 'https://localhost';

  check({ el } as PreventCheckData);

  expect(check).toHaveReturnedWith(true);
});

it('prevent with different hostname', () => {
  el.href = 'https://domain.com';

  check({ el } as PreventCheckData);

  expect(check).toHaveReturnedWith(true);
});
