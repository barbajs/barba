/* tslint:disable:no-empty */
import barba from '@barba/core/src';
import css from '../src';
import { Css } from '../src/css';

// Dom
const wrapper = document.createElement('div');
const container = document.createElement('div');

wrapper.dataset.barba = 'wrapper';
container.dataset.barba = 'container';

document.body.appendChild(wrapper);
document.body.appendChild(container);

// Transitions
const name = 'my-name';
const unnamed = {
  appear() {},
  leave() {},
  enter() {},
};
const named = {
  ...unnamed,
  name,
};
const data = { current: { container } };

barba.use(css);
barba.init({
  transitions: [named, unnamed],
});

it('prefixes with transition name', async () => {
  await barba.hooks.do('before', data, named);
  expect(css.prefix).toBe(name);
  css.prefix = null;
  await barba.hooks.do('beforeAppear', data, named);
  expect(css.prefix).toBe(name);
});

it('prefixes with default ', async () => {
  await barba.hooks.do('before', data, unnamed);
  expect(css.prefix).toBe('barba');
  css.prefix = null;
  await barba.hooks.do('beforeAppear', data, unnamed);
  expect(css.prefix).toBe('barba');
});

// DEV
// it('adds and removes default CSS classes', async () => {
//   barba.hooks.do('beforeAppear', {}, unnamed);
//   await checkHooks();
// });

// it('adds and removes named CSS classes', async () => {
//   barba.hooks.do('beforeAppear', {}, named);
//   await checkHooks(name);
// });
