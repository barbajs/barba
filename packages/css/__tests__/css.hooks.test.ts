/* tslint:disable:no-string-literal */
import barba from '@barba/core/src';
// Definitions
import { ISchemaPage, ITransitionData } from '@barba/core/src/defs';
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
  enter: () => Promise.resolve(),
  leave: () => Promise.resolve(),
  once: () => Promise.resolve(),
};
const data: ITransitionData = {
  current: ({ container: current } as unknown) as ISchemaPage,
  next: ({ container: next } as unknown) as ISchemaPage,
  trigger: 'barba',
};

barba.use(css);
barba.init();

css.start = jest.fn();
css.next = jest.fn();
css.end = jest.fn();

it('do once hooks', async () => {
  await barba.hooks.do('beforeOnce', data, t);
  await barba.hooks.do('afterOnce', data, t);

  expect(css.start).toHaveBeenCalledWith(current, 'once');
  expect(css.end).toHaveBeenCalledWith(current, 'once');
});

it('do leave hooks', async () => {
  await barba.hooks.do('beforeLeave', data, t);
  await barba.hooks.do('afterLeave', data, t);

  expect(css.start).toHaveBeenCalledWith(current, 'leave');
  expect(css.end).toHaveBeenCalledWith(current, 'leave');
});

it('do enter hooks on first load', async () => {
  await barba.hooks.do('beforeEnter', data, t);
  await barba.hooks.do('afterEnter', data, t);

  expect(css.start).not.toHaveBeenCalled();
  expect(css.end).not.toHaveBeenCalled();
});

it('do enter hooks', async () => {
  // Remove from history to simulate first page load.
  barba.history.remove();

  await barba.hooks.do('beforeEnter', data, t);
  await barba.hooks.do('afterEnter', data, t);

  expect(css.start).toHaveBeenCalledWith(next, 'enter');
  expect(css.end).toHaveBeenCalledWith(next, 'enter');
});

it('override transitions', async () => {
  await barba.transitions.once(data, t);
  await barba.transitions.leave(data, t);
  await barba.transitions.enter(data, t);

  expect(css.next).toHaveBeenNthCalledWith(1, current, 'once');
  expect(css.next).toHaveBeenNthCalledWith(2, current, 'leave');
  expect(css.next).toHaveBeenNthCalledWith(3, next, 'enter');
});
