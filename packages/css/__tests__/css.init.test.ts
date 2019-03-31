/* tslint:disable:no-string-literal */
import barba from '@barba/core/src';
import { version } from '../package.json';
import css from '../src';

// Dom
const wrapper = document.createElement('div');
const container = document.createElement('div');

wrapper.dataset.barba = 'wrapper';
container.dataset.barba = 'container';

document.body.appendChild(wrapper);
document.body.appendChild(container);

it('has defaults', () => {
  expect(css.version).toBe(version);
  expect(css.prefix).toBe('barba');
  expect(css.callbacks).toEqual({});
});

it('registers hooks', () => {
  barba.use(css);
  barba.init();

  expect(barba.hooks.registered.get('before').size).toBe(1);
  expect(barba.hooks.registered.get('beforeAppear').size).toBe(2);
  expect(barba.hooks.registered.get('afterAppear').size).toBe(1);
  expect(barba.hooks.registered.get('beforeLeave').size).toBe(1);
  expect(barba.hooks.registered.get('afterLeave').size).toBe(1);
  expect(barba.hooks.registered.get('beforeEnter').size).toBe(1);
  expect(barba.hooks.registered.get('afterEnter').size).toBe(1);
});

it('overrides transitions', () => {
  expect(barba.transitions['appear']).toBe(css['_appear']);
  expect(barba.transitions['leave']).toBe(css['_leave']);
  expect(barba.transitions['enter']).toBe(css['_enter']);
});
