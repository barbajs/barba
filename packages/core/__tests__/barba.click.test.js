/* global it, expect */
import barba from '../src';

const wrapper = document.createElement('div');
const container = document.createElement('div');
const link = document.createElement('a');

wrapper.dataset.barba = 'wrapper';
container.dataset.barba = 'container';
container.dataset.barbaNamespace = 'home';
link.href = '/test.html';
link.textContent = 'custom';

document.body.appendChild(wrapper);
document.body.appendChild(container);
container.appendChild(link);

const transitions = [
  {
    custom({ trigger }) {
      return trigger.textContent === 'custom';
    },
    enter() {}, // eslint-disable-line no-empty-function
    leave() {}, // eslint-disable-line no-empty-function
  },
];

barba.init({ transitions });

it.only('test link', () => {
  const click = new MouseEvent('click', {
    view: window,
    bubbles: true,
    cancelable: true,
  });

  link.dispatchEvent(click);

  expect(barba.version).toBe('1.0.0');
});
