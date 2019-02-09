/* eslint-disable no-empty-function, class-methods-use-this */
import barba from '@barba/core';
import prefetch from '../src';
import { version } from '../package.json';

const wrapper = document.createElement('div');
const container = document.createElement('div');

wrapper.dataset.barba = 'wrapper';
container.dataset.barba = 'container';

document.body.appendChild(wrapper);
document.body.appendChild(container);

global.IntersectionObserver = class {
  observe() {}
  unobserve() {}
};
global.window.requestIdleCallback = jest.fn();

it('has defaults', () => {
  expect(prefetch.version).toBe(version);
});

it('init', () => {
  prefetch._observe = jest.fn();
  barba.use(prefetch);
  barba.init();

  expect(prefetch._root).toBe(document.body);
  expect(prefetch._timeout).toBe(2e3);
  expect(prefetch._observe).toHaveBeenCalledWith(2e3);
});

it('registers hooks', () => {
  expect(barba.hooks._registered.after).toHaveLength(1);
});

it('warns with cache/prefetch disabled', () => {
  prefetch._logger.warn = jest.fn();
  barba.use(prefetch);
  barba.init({
    useCache: false,
    usePrefetch: true,
  });

  expect(prefetch._logger.warn).toHaveBeenCalled();

  barba.init({
    useCache: true,
    usePrefetch: false,
  });

  expect(prefetch._logger.warn).toHaveBeenCalled();
});
