import cache from '../src/cache';

const key = 'key';
const value = 'value';

it('has data ', () => {
  expect(cache.data).toBeDefined();
});

it('set key/value ', () => {
  const expected = { [key]: value };

  cache.set(key, value);

  expect(cache.data).toMatchObject(expected);
});

it('has key ', () => {
  const result = cache.has(key);

  expect(result).toBeTruthy();
});

it('get value ', () => {
  const result = cache.get(key);

  expect(result).toBe(value);
});

it('reset data ', () => {
  cache.reset();

  expect(cache.data).toEqual({});
});
