/* global it, expect */
import barba from '../src';

const wrapper = document.createElement('div');
const container = document.createElement('div');

wrapper.dataset.barba = 'wrapper';
container.dataset.barba = 'container';

document.body.appendChild(wrapper);
document.body.appendChild(container);

barba.init();

it('has correct version', () => {
  expect(barba.version).toBe('1.0.0');
});

it('has one default transitions', () => {
  expect(barba.transitions.all).toHaveLength(1);
});
