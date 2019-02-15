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
    name: 'home',
    path: '(/|/index.html)',
  },
  {
    name: 'foo',
    path: '/foo/:bar',
  },
];

it('has defaults', () => {
  expect(router._routeNames.size).toBe(0);
  router.install(barba);
  expect(router._routeNames.size).toBe(0);
});

it('has routes', () => {
  router.install(barba, {
    routes,
  });

  expect([...router._routeNames]).toEqual(['home', 'foo']);
  expect(router._routesByName.foo).toEqual({
    path: '/foo/:bar',
    regex: /^\/foo\/([^/]+?)(?:\/)?$/i,
    keys: [
      {
        delimiter: '/',
        name: 'bar',
        optional: false,
        partial: false,
        pattern: '[^\\/]+?',
        prefix: '/',
        repeat: false,
      },
    ],
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

  expect(console.warn).toHaveBeenCalledTimes(2);
});

it('resolves url', () => {
  const result = router._resolve('http://localhost/foo/something');

  expect(result.name).toBe('foo');
  expect(result.params.bar).toBe('something');
});

it('resolves unknown url', () => {
  const result = router._resolve('http://localhost/bar/something');

  expect(result).toBeNull();
});

it('resolves data urls (home)', () => {
  const data = {
    current: { url: 'http://localhost/' },
    next: { url: 'http://localhost/' },
  };

  router._resolveRoutes(data);

  expect(data.current.route.name).toBe('home');
  expect(data.next.route.name).toBe('home');
});

it('resolves data urls (foo)', () => {
  const data = {
    current: { url: 'http://localhost/foo/current' },
    next: { url: 'http://localhost/foo/next' },
  };

  router._resolveRoutes(data);

  expect(data.current.route.name).toBe('foo');
  expect(data.next.route.name).toBe('foo');
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
