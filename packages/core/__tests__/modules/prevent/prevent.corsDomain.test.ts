import { IPreventCheckData, PreventCheck } from '../../../src/defs';
import { Prevent } from '../../../src/modules/Prevent';

const prevent = new Prevent(false);
let check: PreventCheck;
const el = document.createElement('a');

beforeEach(() => {
  check = jest.fn(data => prevent.tests.get('corsDomain')(data));
  [].slice.call(el.attributes).forEach(attr => el.removeAttribute(attr.name));
});

it('pass', () => {
  el.href = 'http://localhost';

  check({ el } as IPreventCheckData);

  expect(check).toHaveReturnedWith(false);
});

it('prevent with different protocol', () => {
  el.href = 'https://localhost';

  check({ el } as IPreventCheckData);

  expect(check).toHaveReturnedWith(true);
});

it('prevent with different hostname', () => {
  el.href = 'https://domain.com';

  check({ el } as IPreventCheckData);

  expect(check).toHaveReturnedWith(true);
});
