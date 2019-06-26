import { IPreventCheckData, PreventCheck } from '../../../src/defs';
import { Prevent } from '../../../src/modules/Prevent';

const prevent = new Prevent(false);
let check: PreventCheck;
const el = document.createElement('a');

beforeEach(() => {
  check = jest.fn(data => prevent.tests.get('download')(data));
  [].slice.call(el.attributes).forEach(attr => el.removeAttribute(attr.name));
});

it('pass', () => {
  check({ el } as IPreventCheckData);

  expect(check).toHaveReturnedWith(false);
});

it('prevent with download attribute', () => {
  el.setAttribute('download', 'true');

  check({ el } as IPreventCheckData);

  expect(check).toHaveReturnedWith(true);
});
