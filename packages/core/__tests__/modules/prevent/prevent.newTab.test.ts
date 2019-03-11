import { IPreventCheckData, PreventCheck } from '../../../src/defs';
import { Prevent } from '../../../src/modules/Prevent';

const prevent = new Prevent(false);
let check: PreventCheck;

beforeEach(() => {
  check = jest.fn(data => prevent.tests.get('newTab')(data));
});

it('pass', () => {
  check({
    event: ({
      altKey: false,
      ctrlKey: false,
      metaKey: false,
      shiftKey: false,
      which: 0,
    } as unknown) as Event,
  } as IPreventCheckData);

  expect(check).toHaveReturnedWith(false);
});

it('prevent with "which"', () => {
  check({ event: ({ which: 2 } as unknown) as Event } as IPreventCheckData);

  expect(check).toHaveReturnedWith(true);
});

it('prevent with "metaKey"', () => {
  check({
    event: ({ metaKey: true } as unknown) as Event,
  } as IPreventCheckData);

  expect(check).toHaveReturnedWith(true);
});

it('prevent with "ctrlKey"', () => {
  check({
    event: ({ ctrlKey: true } as unknown) as Event,
  } as IPreventCheckData);

  expect(check).toHaveReturnedWith(true);
});

it('prevent with "shiftKey"', () => {
  check({
    event: ({ shiftKey: true } as unknown) as Event,
  } as IPreventCheckData);

  expect(check).toHaveReturnedWith(true);
});

it('prevent with "altKey"', () => {
  check({ event: ({ altKey: true } as unknown) as Event } as IPreventCheckData);

  expect(check).toHaveReturnedWith(true);
});
