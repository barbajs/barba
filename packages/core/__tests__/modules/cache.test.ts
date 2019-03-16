import { Cache } from '../../src/modules/Cache';

const cache = new Cache(false);

const key = 'key';
const value = Promise.resolve();

it('sets, gets and has', () => {
  const expected = { [key]: value };

  cache.set(key, value);

  expect(cache.has(key)).toBeTruthy();
  expect(cache.get(key)).toBe(value);
});

it('deletes ', () => {
  cache.delete(key);

  expect(cache.has(key)).toBeFalsy();
});

it('checks url ', () => {
  cache.checkUrl = jest.fn();
  cache.set(key, value);

  expect(cache.checkUrl).toHaveBeenCalled();
});
