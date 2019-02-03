/* eslint-disable no-empty-function */
import barba from '@barba/core';
import css from '../src';
import { version } from '../package.json';

// Dom
const wrapper = document.createElement('div');
const container = document.createElement('div');

wrapper.dataset.barba = 'wrapper';
container.dataset.barba = 'container';

document.body.appendChild(wrapper);
document.body.appendChild(container);

it('has defaults', () => {
  expect(css.version).toBe(version);
  expect(css._prefix).toBe('barba');
  expect(css._root).toBeUndefined();
});

it('has default root', () => {
  barba._plugins = [];
  barba.use(css);
  barba.init();
  expect(css._root).toBe(barba._wrapper);
});

it('has custom root', () => {
  barba._plugins = [];
  barba.use(css, {
    root: document.body,
  });
  barba.init();
  expect(css._root).toBe(document.body);
});
