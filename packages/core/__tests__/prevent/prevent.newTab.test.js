import { attributeSchema } from '../../src/schemas';
import { prevent } from '../../src/utils';

prevent.init({ attributeSchema });

let check;

beforeEach(() => {
  check = jest.fn(data => prevent._tests.newTab(data));
});

it('pass', () => {
  check({
    event: {
      which: 0,
      metaKey: false,
      ctrlKey: false,
      shiftKey: false,
      altKey: false,
    },
  });

  expect(check).toHaveReturnedWith(false);
});

it('prevent with "which"', () => {
  check({ event: { which: 2 } });

  expect(check).toHaveReturnedWith(true);
});

it('prevent with "metaKey"', () => {
  check({ event: { metaKey: true } });

  expect(check).toHaveReturnedWith(true);
});

it('prevent with "ctrlKey"', () => {
  check({ event: { ctrlKey: true } });

  expect(check).toHaveReturnedWith(true);
});

it('prevent with "shiftKey"', () => {
  check({ event: { shiftKey: true } });

  expect(check).toHaveReturnedWith(true);
});

it('prevent with "altKey"', () => {
  check({ event: { altKey: true } });

  expect(check).toHaveReturnedWith(true);
});
