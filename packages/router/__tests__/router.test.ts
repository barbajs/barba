import barba from '@barba/core/src';
// Definitions
import { ITransitionData } from '@barba/core/src/defs';
import { version } from '../package.json';
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
  expect(router.name).toBe('@barba/router');
  expect(router.version).toBe(version);
  expect(router.routeNames).toHaveLength(0);
  router.install(barba);
  expect(router.routeNames).toHaveLength(0);
});

it('has routes', () => {
  router.install(barba, {
    routes,
  });

  expect([...router.routeNames]).toEqual(['home', 'foo']);
  expect(router.routesByName.foo).toEqual({
    keys: [
      {
        modifier: '',
        name: 'bar',
        pattern: '[^\\/#\\?]+?',
        prefix: '/',
        suffix: '',
      },
    ],
    path: '/foo/:bar',
    regex: /^\/foo(?:\/([^\/#\?]+?))[\/#\?]?$/i,
  });
});

it('add rule', () => {
  barba.init();
  barba.transitions.store.add = jest.fn();

  router.init();

  expect(barba.transitions.store.add).toHaveBeenCalledTimes(1);
});

it('has duplicate routes', () => {
  console.warn = jest.fn();

  router.install(barba, {
    routes,
  });

  expect(console.warn).toHaveBeenCalledTimes(2);
});

it('resolves url', () => {
  const result = router.resolveUrl('http://localhost/foo/something');

  expect(result?.name).toBe('foo');
  expect(result?.params.bar).toBe('something');
});

it('resolves unknown url', () => {
  const result = router.resolveUrl('http://localhost/bar/something');

  expect(result).toBeNull();
});

it('resolves data urls (home)', () => {
  const data = {
    current: { url: { href: 'http://localhost/' } },
    next: { url: { href: 'http://localhost/' } },
  } as ITransitionData;

  router.resolveRoutes(data);

  expect(data.current.route?.name).toBe('home');
  expect(data.next.route?.name).toBe('home');
});

it('resolves data urls (foo)', () => {
  const data = {
    current: { url: { href: 'http://localhost/foo/current' } },
    next: { url: { href: 'http://localhost/foo/next' } },
  } as ITransitionData;

  router.resolveRoutes(data);

  expect(data.current.route?.name).toBe('foo');
  expect(data.next.route?.name).toBe('foo');
});

it('resolves unknown data urls', () => {
  const data = {
    current: { url: {} },
    next: { url: {} },
  } as ITransitionData;

  router.resolveRoutes(data);

  expect(data.current.route).toBeUndefined();
  expect(data.next.route).toBeUndefined();
});
