import barba from '../../src';
import { cache, history } from '../../src/modules';
import { prevent } from '../../src/utils';

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
cache.set = jest.fn();
history.add = jest.fn();
barba.appear = jest.fn();

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

it('needs valid prevent custom', () => {
  const init = function init() {
    barba.init({ prevent: 'bad' });
  };

  expect(init).toThrow('Prevent should be a function');
  expect(prevent._tests).not.toHaveProperty('preventCustom');
});

it('adds prevent custom', () => {
  document.body.appendChild(wrapper);
  wrapper.appendChild(container);
  barba.init({ prevent() {} }); // eslint-disable-line no-empty-function

  expect(prevent._tests).toHaveProperty('preventCustom');
});

it('has DOM elements', () => {
  document.body.appendChild(wrapper);
  wrapper.appendChild(container);

  barba.init();
  expect(barba._wrapper).toBe(wrapper);
  expect(barba._current.container).toBe(container);
});

it('has current page content', () => {
  document.body.appendChild(wrapper);
  wrapper.appendChild(container);

  barba.init();
  expect(barba._current).toBeDefined();
  expect(barba._current.namespace).toBe(namespace);
  expect(barba._current.url).toEqual({
    href: 'http://localhost/',
    path: '/',
    hash: undefined,
    query: {},
  });
  expect(barba._current.container).toBe(container);
  expect(barba._current.html).toMatch(/^<html>.+<\/html>$/);
});

it('updates cache and history', () => {
  document.body.appendChild(wrapper);
  wrapper.appendChild(container);

  barba.init();
  expect(cache.set).toHaveBeenCalledTimes(1);
  expect(history.add).toHaveBeenCalledTimes(1);
});

it('calls appear', () => {
  document.body.appendChild(wrapper);
  wrapper.appendChild(container);

  barba.init();
  expect(barba.appear).toHaveBeenCalledTimes(1);
});

it('gets wrapper', () => {
  document.body.appendChild(wrapper);
  wrapper.appendChild(container);

  barba.init();
  expect(barba.wrapper).toBe(wrapper);
});
