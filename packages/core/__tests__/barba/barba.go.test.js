/* eslint-disable no-empty-function */
import barba from '../../src';
import cache from '../../src/cache';
import dom from '../../src/dom';
import history from '../../src/history';
import hooks from '../../src/hooks';
import { attributeSchema } from '../../src/schema';
import { manager, store } from '../../src/transitions';
import { init } from 'barba';

// Needed for "request" module
global.Headers = class {};

// Init
dom.init({ attributeSchema });

const namespace = 'test';
const checkDoc = new RegExp(
  `^<html>[\\s\\S]+body[\\s\\S]+${dom.attr.wrapper}[\\s\\S]+${
    dom.attr.container
  }[\\s\\S]+${namespace}[\\s\\S]+</html>$`
);

init();

let spyCacheHas;
let spyCacheGet;
let spyCacheSet;
let spyPage;

beforeEach(() => {
  global.fetch = jest.fn().mockImplementation(() => ({
    status: 200,
    text: () =>
      Promise.resolve(`<html>
    <body>
      <div data-barba="wrapper">
        <div data-barba="container" data-barba-namespace="${namespace}"></div>
      </div>
    </body>
  </html>`),
  }));
  spyCacheHas = jest.spyOn(cache, 'has');
  spyCacheGet = jest.spyOn(cache, 'get');
  spyCacheSet = jest.spyOn(cache, 'set');
  spyPage = jest.spyOn(manager, 'doPage');
});
afterEach(() => {
  store.destroy();
  spyCacheHas.mockRestore();
  spyCacheGet.mockRestore();
  spyCacheSet.mockRestore();
  spyPage.mockRestore();
});

it('do go', () => {
  manager.doPage = jest.fn();
  history.go = jest.fn();
  hooks.do = jest.fn();

  store.add('transition', { leave() {}, enter() {} });
  barba.go('http://localhost/foo');

  const data = barba._getData();

  expect(spyCacheHas).toHaveBeenCalledTimes(1);
  expect(spyCacheGet).toHaveBeenCalledTimes(0);
  expect(spyCacheSet).toHaveBeenCalledTimes(1);
  expect(history.go).toHaveBeenCalledTimes(1);
  expect(hooks.do).toHaveBeenLastCalledWith('go', data);
  expect(manager.doPage).toHaveBeenCalledTimes(1);
});

it('do go [popstate]', () => {
  manager.doPage = jest.fn();
  history.add = jest.fn();

  store.add('transition', { leave() {}, enter() {} });
  barba.go('http://localhost/foo', 'popstate');

  expect(history.add).toHaveBeenCalledTimes(1);
});

it('do go [has cache]', () => {
  manager.doPage = jest.fn();
  history.add = jest.fn();

  store.add('transition', { leave() {}, enter() {} });
  barba.go('http://localhost/');

  expect(spyCacheHas).toHaveBeenCalledTimes(1);
  expect(spyCacheGet).toHaveBeenCalledTimes(1);
  expect(spyCacheSet).toHaveBeenCalledTimes(0);
});

it('do go [waiting]', async () => {
  manager.doPage = jest.fn();
  // Avoid updating data.next
  barba._refreshPages = jest.fn();

  store.add('transition', { leave() {}, enter() {}, to: { namespace: 'ns' } });
  await barba.go('http://localhost');

  expect(barba._next.html).toMatch(checkDoc);
});

it('do go [no use cache]', () => {
  barba._useCache = false;

  manager.doPage = jest.fn();
  history.add = jest.fn();

  store.add('transition', { leave() {}, enter() {} });
  barba.go('http://localhost');

  expect(spyCacheHas).toHaveBeenCalledTimes(0);
  expect(spyCacheGet).toHaveBeenCalledTimes(0);
  expect(spyCacheSet).toHaveBeenCalledTimes(0);
});

it('force when manager running', () => {
  barba.force = jest.fn();
  manager.doPage = jest.fn();
  hooks.do = jest.fn();

  store.add('transition', { leave() {}, enter() {} });
  manager.running = true;
  barba.go('http://localhost/foo');

  expect(barba.force).toHaveBeenCalledTimes(1);
  expect(hooks.do).not.toHaveBeenCalled();
  expect(manager.doPage).not.toHaveBeenCalled();

  manager.running = false;
});

it('catch error', async () => {
  console.error = jest.fn();
  history.cancel = jest.fn();
  spyPage.mockRestore();

  store.add('transition', {
    leave() {
      throw new Error('test');
    },
  });

  let message;

  try {
    await barba.go('http://localhost');
  } catch (error) {
    ({ message } = error);
  }

  expect(console.error).toHaveBeenCalledTimes(1);
  expect(history.cancel).toHaveBeenCalledTimes(1);
  expect(message).toBe('Error: Transition error');
});
