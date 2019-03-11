import { Prevent } from '../../../src/modules/Prevent';
import { PreventCheck, PreventCheckData } from '../../../src/defs';

const prevent = new Prevent(false);
let check: PreventCheck;

beforeEach(() => {
  check = jest.fn(data => prevent.tests.get('sameUrl')(data));
});

it('pass', () => {
  check({ href: 'somewhere' } as PreventCheckData);

  expect(check).toHaveReturnedWith(false);
});

it('prevent with same url', () => {
  check({ href: window.location.href } as PreventCheckData);

  expect(check).toHaveReturnedWith(true);
});
