import barba from '@barba/core';
import router from '../src';

const wrapper = document.createElement('div');
const container = document.createElement('div');

wrapper.dataset.barba = 'wrapper';
container.dataset.barba = 'container';

document.body.appendChild(wrapper);
document.body.appendChild(container);

const routes = [
  {
    name: 'foo',
    path: '/foo/:bar',
  },
];

it('has defaults', () => {
  expect(router._routeNames).toHaveLength(0);
  router.install(barba);
  expect(router._routeNames).toHaveLength(0);
});

it('has routes', () => {
  router.install(barba, {
    routes,
  });

  expect(router._routeNames).toEqual(['foo']);
  expect(router._routesByName.foo).toEqual({
    path: '/foo/:bar',
    regex: /^\/foo\/([^/]+?)(?:\/)?$/i,
  });
});

it('add rule', () => {
  barba.init();
  barba.store.add = jest.fn();

  router.init();

  expect(barba.store.add).toHaveBeenCalledTimes(1);
});

it('has duplicate routes', () => {
  console.warn = jest.fn();

  router.install(barba, {
    routes,
  });

  expect(console.warn).toHaveBeenCalledTimes(1);
});

it('resolves url', () => {
  const result = router._resolve('http://localhost/foo/someting');

  expect(result).toBe('foo');
});

it('resolves unknown url', () => {
  const result = router._resolve('http://localhost/bar/someting');

  expect(result).toBeNull();
});

it('resolves data urls', () => {
  const data = {
    current: { url: 'http://localhost/foo/current' },
    next: { url: 'http://localhost/foo/next' },
  };

  router._resolveRoutes(data);

  expect(data.current.route).toBe('foo');
  expect(data.next.route).toBe('foo');
});

it('resolves unknown data urls', () => {
  const data = {
    current: {},
    next: {},
  };

  router._resolveRoutes(data);

  expect(data.current.route).toBeUndefined();
  expect(data.next.route).toBeUndefined();
});
