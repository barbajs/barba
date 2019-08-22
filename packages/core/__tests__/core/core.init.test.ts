/* tslint:disable:no-string-literal */
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
  const start = () => {
    barba.init({ prevent: ('bad' as unknown) as PreventCheck });
  };

  expect(start).toThrow('Prevent should be a function');
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
    hash: undefined,
    href: '/',
    path: '/',
    query: {},
  });
  expect(barba.data.current.container).toBe(container);
  expect(barba.data.current.html).toMatch(/^<html>.+<\/html>$/);
});

it('init history', () => {
  barba.init();
  expect(barba.history.current).toEqual({
    index: 0,
    ns: 'ns',
    scroll: {
      x: 0,
      y: 0,
    },
    url: '/',
  });
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

it('has other options', () => {
  wrapper.dataset.highway = 'main';
  container.dataset.highway = 'container';

  barba.init({
    requestError() {
      return false;
    },
    schema: { prefix: 'data-highway', wrapper: 'main' },
    timeout: 0,
    transitions: [],
    views: [],
  });

  const requestError = () =>
    barba['_requestCustomError'](
      'barba',
      'click',
      'foo.html',
      new Error('test')
    );

  expect(barba.timeout).toBe(0);
  expect(requestError()).toBeFalsy();
  expect(barba.wrapper).toBe(wrapper);
});
