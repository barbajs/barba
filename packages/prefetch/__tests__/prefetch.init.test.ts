/* tslint:disable:no-empty */
import barba from '@barba/core/src';
import { version } from '../package.json';
import prefetch from '../src';

const wrapper = document.createElement('div');
const container = document.createElement('div');

wrapper.dataset.barba = 'wrapper';
container.dataset.barba = 'container';

document.body.appendChild(wrapper);
document.body.appendChild(container);

// https://stackoverflow.com/questions/40743131/how-to-prevent-property-does-not-exist-on-type-global-with-jsdom-and-t
(global as any).IntersectionObserver = class {
  public observe() {}
  public unobserve() {}
};
(global as any).window.requestIdleCallback = jest.fn();

it('has defaults', () => {
  expect(prefetch.name).toBe('@barba/prefetch');
  expect(prefetch.version).toBe(version);
});

it('init with defaults', () => {
  prefetch.observe = jest.fn();
  barba.use(prefetch);
  barba.init();

  expect(prefetch.root).toBe(document.body);
  expect(prefetch.timeout).toBe(2e3);
  expect(prefetch.observe).toHaveBeenCalled();
});

it('init with options', () => {
  prefetch.observe = jest.fn();
  barba.destroy();
  barba.use(prefetch, {
    root: wrapper,
    timeout: 0,
  });
  barba.init();

  expect(prefetch.root).toBe(wrapper);
  expect(prefetch.timeout).toBe(0);
});

it('registers hooks', () => {
  expect(barba.hooks.registered.has('after')).toBeTruthy();
});

it('warns with cache/prefetch disabled', () => {
  global.console.warn = jest.fn();
  barba.use(prefetch);
  barba.init({
    cacheIgnore: false,
    debug: true,
    prefetchIgnore: true,
  });

  expect(global.console.warn).toHaveBeenCalledWith(
    '[@barba/prefetch] ',
    'barba.prefetchIgnore is enabled'
  );

  barba.init({
    cacheIgnore: true,
    debug: true,
    prefetchIgnore: false,
  });

  expect(global.console.warn).toHaveBeenCalledWith(
    '[@barba/prefetch] ',
    'barba.cacheIgnore is enabled'
  );
});
