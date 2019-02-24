import { attributeSchema } from '../../src/schemas';
import { prevent } from '../../src/utils';

prevent.init({ attributeSchema });

let check;

beforeEach(() => {
  check = jest.fn(data => prevent.sameUrl(data));
});

it('pass', () => {
  check('somewhere');

  expect(check).toHaveReturnedWith(false);
});

it('prevent with same url', () => {
  check(window.location.href);

  expect(check).toHaveReturnedWith(true);
});
