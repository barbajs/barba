import { Cache } from '../../src/modules/Cache';

const cache = new Cache(false);

const key = 'key';
const request = Promise.resolve();
const action = 'enter';
const data = {
  action,
  request,
};

it('sets, gets and has', () => {
  cache.set(key, request, action);

  expect(cache.has(key)).toBeTruthy();
  expect(cache.get(key)).toEqual(data);
});

it('gets action and request', () => {
  expect(cache.getAction(key)).toBe(action);
  expect(cache.getRequest(key)).toBe(request);
});

it('update ', () => {
  cache.update(key, { action: 'click' });

  expect(cache.getAction(key)).toBe('click');
});

it('deletes ', () => {
  cache.delete(key);

  expect(cache.has(key)).toBeFalsy();
});

it('checks url ', () => {
  cache.checkHref = jest.fn();
  cache.has(key);

  expect(cache.checkHref).toHaveBeenCalled();
});

it('uses cacheIgnore ', () => {
  cache.checkHref = jest.fn().mockImplementation(() => true);
  const res = cache.has(key);

  expect(res).toBeFalsy();
});
