/* eslint-disable no-empty-function */
import barba from '@barba/core';
import css from '../src';

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

barba.use(css);
barba.init({
  transitions: [named, unnamed],
});

/**
 * Check CSS classes
 *
 * @param {string} [name='barba'] default or named transition
 * @returns {Promise} end of hooks chain
 */
async function checkHooks(name = 'barba') {
  expect(wrapper.classList.contains(`${name}-appear`)).toBeTruthy();
  expect(wrapper.classList.contains(`${name}-appear-active`)).toBeTruthy();
  await new Promise(resolve => {
    window.requestAnimationFrame(() => {
      expect(wrapper.classList.contains(`${name}-appear-to`)).toBeTruthy();
      expect(wrapper.classList.contains(`${name}-appear`)).toBeFalsy();
      resolve();
    });
  });
  barba.hooks.do('afterAppear');
  expect(wrapper.classList.contains(`${name}-appear-active`)).toBeFalsy();
  expect(wrapper.classList.contains(`${name}-appear-to`)).toBeFalsy();
  // Leave
  barba.hooks.do('beforeLeave');
  expect(wrapper.classList.contains(`${name}-leave`)).toBeTruthy();
  expect(wrapper.classList.contains(`${name}-leave-active`)).toBeTruthy();
  barba.hooks.do('leave');
  await new Promise(resolve => {
    window.requestAnimationFrame(() => {
      expect(wrapper.classList.contains(`${name}-leave-to`)).toBeTruthy();
      expect(wrapper.classList.contains(`${name}-leave`)).toBeFalsy();
      resolve();
    });
  });
  barba.hooks.do('afterLeave');
  expect(wrapper.classList.contains(`${name}-leave-to`)).toBeFalsy();
  expect(wrapper.classList.contains(`${name}-leave-active`)).toBeFalsy();
  // Enter
  barba.hooks.do('beforeEnter');
  expect(wrapper.classList.contains(`${name}-enter`)).toBeTruthy();
  expect(wrapper.classList.contains(`${name}-enter-active`)).toBeTruthy();
  barba.hooks.do('enter');
  await new Promise(resolve => {
    window.requestAnimationFrame(() => {
      expect(wrapper.classList.contains(`${name}-enter-to`)).toBeTruthy();
      expect(wrapper.classList.contains(`${name}-enter`)).toBeFalsy();
      resolve();
    });
  });
  barba.hooks.do('afterEnter');
  expect(wrapper.classList.contains(`${name}-enter-to`)).toBeFalsy();
  expect(wrapper.classList.contains(`${name}-enter-active`)).toBeFalsy();
}

it('prefixes with transition name', () => {
  barba.hooks.do('before', {}, named);
  expect(css._prefix).toBe(name);
  css._prefix = null;
  barba.hooks.do('beforeAppear', {}, named);
  expect(css._prefix).toBe(name);
});

it('prefixes with default ', () => {
  barba.hooks.do('before', {}, unnamed);
  expect(css._prefix).toBe('barba');
  css._prefix = null;
  barba.hooks.do('beforeAppear', {}, unnamed);
  expect(css._prefix).toBe('barba');
});

it('adds and removes default CSS classes', async () => {
  barba.hooks.do('beforeAppear', {}, unnamed);
  await checkHooks();
});

it('adds and removes named CSS classes', async () => {
  barba.hooks.do('beforeAppear', {}, named);
  await checkHooks(name);
});
