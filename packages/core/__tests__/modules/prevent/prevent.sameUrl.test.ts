import { IPreventCheckData, PreventCheck } from '../../../src/defs';
import { Prevent } from '../../../src/modules/Prevent';

const prevent = new Prevent(false);
let check: PreventCheck;

beforeEach(() => {
  check = jest.fn(data => prevent.tests.get('sameUrl')(data));
});

it('pass', () => {
  check({ href: 'somewhere' } as IPreventCheckData);

  expect(check).toHaveReturnedWith(false);
});

it('prevent with same url', () => {
  check({ href: window.location.href } as IPreventCheckData);

  expect(check).toHaveReturnedWith(true);
});
