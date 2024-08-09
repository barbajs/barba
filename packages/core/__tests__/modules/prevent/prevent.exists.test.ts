import { IPreventCheckData, PreventCheck } from '../../../src/defs';
import { Prevent } from '../../../src/modules/Prevent';

const prevent = new Prevent(false);
let check: PreventCheck;

beforeEach(() => {
  check = jest.fn(data => prevent.tests.get('exists')!(data));
});

it('pass (with element and href)', () => {
  check({ el: true, href: true } as unknown as IPreventCheckData);

  expect(check).toHaveReturnedWith(false);
});

it('prevent with no element and no href', () => {
  check({ el: false, href: false } as unknown as IPreventCheckData);

  expect(check).toHaveReturnedWith(true);
});

it('prevent with element but no href', () => {
  check({ el: true, href: false } as unknown as IPreventCheckData);

  expect(check).toHaveReturnedWith(true);
});

it('prevent with no element but href', () => {
  check({ el: false, href: true } as unknown as IPreventCheckData);

  expect(check).toHaveReturnedWith(true);
});
