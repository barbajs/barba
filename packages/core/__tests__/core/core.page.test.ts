/* tslint:disable:no-empty no-string-literal */
import xhrMock from 'xhr-mock';
import { init } from '../../__mocks__/barba';
import barba from '../../src';
import { hooks } from '../../src/hooks';
import { schemaAttribute } from '../../src/schemas/attribute';

// Needed for "request" module
(global as any).Headers = class {};

const namespace = 'next';
const checkDoc = new RegExp(
  `^<html>[\\s\\S]+body[\\s\\S]+${schemaAttribute.wrapper}[\\s\\S]+${
    schemaAttribute.container
  }[\\s\\S]+${namespace}[\\s\\S]+</html>$`
);
const t = { leave() {}, enter() {} };
const sameUrl = 'http://localhost/';
const nextUrl = 'http://localhost/foo';

init();

let spyCacheHas: jest.SpyInstance;
let spyCacheGet: jest.SpyInstance;
let spyCacheSet: jest.SpyInstance;
let spyPage: jest.SpyInstance;

beforeEach(() => {
  barba.init();
  xhrMock.setup();
  xhrMock.get(sameUrl, (req, res) =>
    res.status(200).body(`<html>
    <head>
      <title>Current page</title>
    </head>
    <body>
      <div data-barba="wrapper">
        <div data-barba="container" data-barba-namespace="current"></div>
      </div>
    </body>
  </html>`)
  );
  xhrMock.get(nextUrl, (req, res) =>
    res.status(200).body(`<html>
    <head>
      <title>New page</title>
    </head>
    <body>
      <div data-barba="wrapper">
        <div data-barba="container" data-barba-namespace="${namespace}"></div>
      </div>
    </body>
  </html>`)
  );

  spyCacheHas = jest.spyOn(barba.cache, 'has');
  spyCacheGet = jest.spyOn(barba.cache, 'get');
  spyCacheSet = jest.spyOn(barba.cache, 'set');
  spyPage = jest.spyOn(barba.transitions, 'doPage');
});
afterEach(() => {
  spyCacheHas.mockRestore();
  spyCacheGet.mockRestore();
  spyCacheSet.mockRestore();
  spyPage.mockRestore();
  xhrMock.teardown();
  barba.destroy();
});

it('do page', async () => {
  barba.history.push = jest.fn();
  hooks.do = jest.fn();

  barba.transitions.store.add('transition', t);
  const data = {
    ...barba.data,
    trigger: 'barba',
  };

  await barba.page(nextUrl, 'barba', false);

  expect(spyCacheHas).toHaveBeenCalledTimes(1);
  expect(spyCacheSet).toHaveBeenCalledTimes(1);
  expect(barba.history.push).toHaveBeenCalledTimes(1);
  expect(hooks.do).toHaveBeenNthCalledWith(1, 'page', data);
  expect(hooks.do).toHaveBeenNthCalledWith(2, 'before', data, t);
  expect(hooks.do).toHaveBeenNthCalledWith(3, 'beforeLeave', data, t);
  expect(hooks.do).toHaveBeenNthCalledWith(7, 'beforeEnter', data, t);
  expect(barba.transitions.doPage).toHaveBeenCalledTimes(1);
  expect(document.title).toBe('New page');
});

it('do page [popstate]', async () => {
  barba.transitions.doPage = jest.fn();
  barba.history.add = jest.fn();

  barba.transitions.store.add('transition', { leave() {}, enter() {} });
  await barba.page(nextUrl, 'popstate', false);

  expect(barba.history.add).toHaveBeenCalledTimes(1);
});

it('do page [has cache]', async () => {
  barba.history.add = jest.fn();

  // NOTE: as we use "same URL" (localhost), we need a "self" transition
  // to avoid prevent "sameURL"
  barba.transitions.store.add('transition', { name: 'self' });
  barba.transitions.store.add('transition', { leave() {}, enter() {} });
  await barba.page(sameUrl, 'barba', false);

  expect(spyCacheHas).toHaveBeenCalledTimes(1);
  expect(spyCacheGet).toHaveBeenCalledTimes(1);
  expect(spyCacheSet).toHaveBeenCalledTimes(0);
});

it('do page [waiting]', async () => {
  // Avoid updating data.next
  barba['_resetData'] = jest.fn();

  barba.transitions.store.add('transition', {
    leave() {},
    enter() {},
    to: { namespace: 'ns' },
  });
  await barba.page(nextUrl, 'barba', false);

  expect(barba.data.next.html).toMatch(checkDoc);
});

it('force when manager running', async () => {
  barba.force = jest.fn();
  hooks.do = jest.fn();

  barba.transitions.store.add('transition', { leave() {}, enter() {} });
  barba.transitions['_running'] = true;
  await barba.page(nextUrl, 'barba', false);

  expect(barba.force).toHaveBeenCalledTimes(1);
  expect(hooks.do).not.toHaveBeenCalled();
  expect(barba.transitions.doPage).not.toHaveBeenCalled();

  barba.transitions['_running'] = false;
});

it('catches error', async () => {
  expect.assertions(3);
  barba.logger.error = jest.fn();
  barba.transitions.logger.error = jest.fn();
  barba.history.cancel = jest.fn();
  spyPage.mockRestore();
  const errorLeave = new Error('Transition error [page][leave]');
  const errorTransition = new Error('Transition error');

  barba.transitions.store.add('transition', {
    leave() {
      throw errorLeave;
    },
  });

  await barba.page(nextUrl, 'barba', false);

  expect(barba.transitions.logger.error).toHaveBeenCalledWith(errorLeave);
  expect(barba.logger.error).toHaveBeenCalledWith(errorTransition);
  expect(barba.history.cancel).toHaveBeenCalledTimes(1);
});
