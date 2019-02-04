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
  expect(prefetch._root).toBe(document.body);
  expect(prefetch._timeout).toBe(2e3);
});

it('registers hooks', () => {
  barba.use(prefetch);
  barba.init();

  expect(barba.hooks._registered.after).toHaveLength(1);
});
