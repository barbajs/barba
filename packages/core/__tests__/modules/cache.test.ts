import { Cache } from '../../src/modules/Cache';

const cache = new Cache(false);

const key = 'key';
const request = Promise.resolve();
const action = 'enter';
const status = 'pending';
const data = {
  action,
  request,
  status,
};

it('sets, gets and has', () => {
  cache.set(key, request, action, status);

  expect(cache.has(key)).toBeTruthy();
  expect(cache.get(key)).toEqual(data);
});

it('gets action, request and status', () => {
  expect(cache.getAction(key)).toBe(action);
  expect(cache.getRequest(key)).toBe(request);
  expect(cache.getStatus(key)).toBe(status);
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
