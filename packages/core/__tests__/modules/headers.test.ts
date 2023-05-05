import { Headers } from '../../src/modules/Headers';

const headers = new Headers();

const name = 'header-name';
const value = 'header-value';

it('sets, gets and has', () => {
  headers.set(name, value);

  expect(headers.has(name)).toBeTruthy();
  expect(headers.get(name)).toEqual(value);
});

it('deletes a custom header', () => {
  headers.delete(name);

  expect(headers.has(name)).toBeFalsy();
});

it('gets all headers and clear them', () => {
  headers.set(name, value);
  headers.clear();

  expect(headers.all().size).toEqual(0);
});
