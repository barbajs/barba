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
  expect(css._promises).toEqual({});
});

it('registers hooks', () => {
  barba.use(css);
  barba.init();

  console.info('MANGLE', barba.hooks);

  expect(barba.hooks.registered.before).toHaveLength(1);
  expect(barba.hooks.registered.beforeAppear).toHaveLength(2);
  expect(barba.hooks.registered.afterAppear).toHaveLength(1);
  expect(barba.hooks.registered.beforeLeave).toHaveLength(1);
  expect(barba.hooks.registered.afterLeave).toHaveLength(1);
  expect(barba.hooks.registered.beforeEnter).toHaveLength(1);
  expect(barba.hooks.registered.afterEnter).toHaveLength(1);
});

it('overrides transitions', () => {
  expect(barba.manager.appear).toBe(css._appear);
  expect(barba.manager.leave).toBe(css._leave);
  expect(barba.manager.enter).toBe(css._enter);
});
