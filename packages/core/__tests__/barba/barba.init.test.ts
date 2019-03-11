import barba from '../../src';
import { PreventCheck } from '../../src/defs';

const wrapper = document.createElement('div');
const container = document.createElement('div');
const namespace = 'ns';

wrapper.dataset.barba = 'wrapper';
container.dataset.barba = 'container';
container.dataset.barbaNamespace = namespace;

/**
 * Mock init
 */
function init() {
  barba.init();
}

beforeEach(() => {
  document.body.appendChild(wrapper);
  wrapper.appendChild(container);
});

afterEach(() => {
  document.body.innerHTML = '';
});

it('needs barba wrapper', () => {
  wrapper.remove();
  expect(init).toThrow('No Barba wrapper found');
});

it('needs barba container', () => {
  container.remove();
  expect(init).toThrow('No Barba container found');
});

it('needs valid prevent custom', () => {
  const init = function init() {
    barba.init({ prevent: ('bad' as unknown) as PreventCheck });
  };

  expect(init).toThrow('Prevent should be a function');
  barba.prevent.add = jest.fn();
  expect(barba.prevent.add).not.toHaveBeenCalled();
});

it('adds prevent custom', () => {
  barba.init({ prevent: () => true });
  expect(barba.prevent.tests.has('preventCustom')).toBeTruthy();
});

it('has DOM elements', () => {
  barba.init();
  expect(barba.wrapper).toBe(wrapper);
  expect(barba.data.current.container).toBe(container);
});

it('has current page content', () => {
  barba.init();
  expect(barba.data.current).toBeDefined();
  expect(barba.data.current.namespace).toBe(namespace);
  expect(barba.data.current.url).toEqual({
    href: 'http://localhost/',
    path: '/',
    hash: undefined,
    query: {},
  });
  expect(barba.data.current.container).toBe(container);
  expect(barba.data.current.html).toMatch(/^<html>.+<\/html>$/);
});

it('updates cache and history', () => {
  barba.init();
  expect(barba.history.current).toEqual({
    ns: 'ns',
    url: 'http://localhost/',
  });
  expect(barba.cache.has('http://localhost/')).toBeTruthy();
});

it('calls appear', () => {
  barba.appear = jest.fn();
  barba.init();
  expect(barba.appear).toHaveBeenCalledTimes(1);
});

it('gets wrapper', () => {
  barba.init();
  expect(barba.wrapper).toBe(wrapper);
});
