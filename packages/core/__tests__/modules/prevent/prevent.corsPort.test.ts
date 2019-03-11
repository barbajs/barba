import { IPreventCheckData, PreventCheck } from '../../../src/defs';
import { Prevent } from '../../../src/modules/Prevent';

const prevent = new Prevent(false);
let check: PreventCheck;
const el = (document.createElement('a') as unknown) as HTMLLinkElement;

beforeEach(() => {
  check = jest.fn(data => prevent.tests.get('corsPort')(data));
  [].slice.call(el.attributes).forEach(attr => el.removeAttribute(attr.name));
});

it('pass', () => {
  el.href = 'http://localhost';

  check({ el } as IPreventCheckData);

  expect(check).toHaveReturnedWith(false);
});

it('prevent with different port', () => {
  el.href = 'https://localhost:8888';

  check({ el } as IPreventCheckData);

  expect(check).toHaveReturnedWith(true);
});
