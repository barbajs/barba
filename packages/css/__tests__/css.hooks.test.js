/* eslint-disable no-empty-function */
import barba from '@barba/core';
import css from '../src';

// Dom
const wrapper = document.createElement('div');
const current = document.createElement('div');
const next = current.cloneNode();

wrapper.dataset.barba = 'wrapper';
current.dataset.barba = 'container';

document.body.appendChild(wrapper);
document.body.appendChild(current);

const t = {
  appear() {},
  leave() {},
  enter() {},
};
const data = {
  current: { container: current },
  next: { container: next },
};

barba.use(css);
barba.init();

css._start = jest.fn();
css._next = jest.fn();
css._end = jest.fn();

it('do appear hooks', () => {
  barba.hooks.do('beforeAppear', data, t);
  barba.hooks.do('afterAppear', data, t);

  expect(css._start).toHaveBeenCalledWith(current, 'appear');
  expect(css._end).toHaveBeenCalledWith(current, 'appear');
});

it('do leave hooks', () => {
  barba.hooks.do('beforeLeave', data, t);
  barba.hooks.do('afterLeave', data, t);

  expect(css._start).toHaveBeenCalledWith(current, 'leave');
  expect(css._end).toHaveBeenCalledWith(current, 'leave');
});

it('do enter hooks', () => {
  barba.hooks.do('beforeEnter', data, t);
  barba.hooks.do('afterEnter', data, t);

  expect(css._start).toHaveBeenCalledWith(next, 'enter');
  expect(css._end).toHaveBeenCalledWith(next, 'enter');
});

it('override transitions', () => {
  barba.manager.appear(t, data);
  barba.manager.leave(t, data);
  barba.manager.enter(t, data);

  expect(css._next).toHaveBeenNthCalledWith(1, current, 'appear');
  expect(css._next).toHaveBeenNthCalledWith(2, current, 'leave');
  expect(css._next).toHaveBeenNthCalledWith(3, next, 'enter');
});
