import { Cache } from '../../src/modules/Cache';

const cache = new Cache(false);

const key = 'key';
const request = Promise.resolve();
const action = 'enter';
const status = 'pending';
const target = key;
const data = {
  action,
  request,
  status,
  target,
};

it('sets, gets and has', () => {
  cache.set(key, request, action, status, target);

  expect(cache.has(key)).toBeTruthy();
  expect(cache.get(key)).toEqual(data);
});

it('set empty target', () => {
  cache.set(key, request, action, status);

  expect(cache.getTarget(key)).toBe(key);
});

it('gets action, request, status and target', () => {
  expect(cache.getAction(key)).toBe(action);
  expect(cache.getRequest(key)).toBe(request);
  expect(cache.getStatus(key)).toBe(status);
  expect(cache.getTarget(key)).toBe(target);
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
