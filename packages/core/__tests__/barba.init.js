/* global it, expect, afterEach */
import barba from '../src';

const wrapper = document.createElement('div');
const container = document.createElement('div');
const namespace = 'ns';

wrapper.dataset.barba = 'wrapper';
container.dataset.barba = 'container';
container.dataset.barbaNamespace = namespace;

/**
 * Mock init
 * @returns {undefined}
 */
function init() {
  barba.init();
}

afterEach(() => {
  document.body.innerHTML = '';
});

it('needs barba wrapper', () => {
  expect(init).toThrow('No Barba wrapper found');
});

it('needs barba container', () => {
  document.body.appendChild(wrapper);

  expect(init).toThrow('No Barba container found');
});

it('has barba wrapper', () => {
  document.body.appendChild(wrapper);
  document.body.appendChild(container);

  barba.init();
  expect(barba.wrapper).toBeDefined();
});

it('has barba container', () => {
  document.body.appendChild(wrapper);
  document.body.appendChild(container);

  barba.init();
  expect(barba.current.container).toBeDefined();
});

it('has barba current', () => {
  document.body.appendChild(wrapper);
  document.body.appendChild(container);

  barba.init();
  expect(barba.current).toBeDefined();
  expect(barba.current.namespace).toBe(namespace);
  expect(barba.current.url).toBe('http://localhost/');
  expect(barba.current.route).toBeNull();
  expect(barba.current.container).toStrictEqual(container);
  expect(barba.current.html).toMatch(/^<head>.+<\/body>$/);
});
