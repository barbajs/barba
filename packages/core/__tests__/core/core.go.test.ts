/* tslint:disable:no-empty no-string-literal */
import { init } from '../../__mocks__/barba';
import barba from '../../src';
import { hooks } from '../../src/hooks';
import { schemaAttribute } from '../../src/schemas/attribute';

// Needed for "request" module
(global as any).Headers = class {};

const namespace = 'next';
const nextUrl = 'http://localhost/foo';

init();

beforeEach(() => {
  barba.init();
  self.fetch = jest.fn().mockImplementation(() => ({
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
});
afterEach(() => {
  barba.destroy();
  (global as any).jsdom.reconfigure({ url: 'http://localhost/' });
});

it('do go', async () => {
  barba.page = jest.fn();

  await barba.go('http://localhost/foo');

  expect(barba.page).toHaveBeenCalledWith(
    'http://localhost/foo',
    'barba',
    false
  );
});

it('force when manager running', async () => {
  barba.force = jest.fn();
  barba.page = jest.fn();
  hooks.do = jest.fn();

  barba.transitions.store.add('transition', { leave() {}, enter() {} });
  barba.transitions['_running'] = true;
  await barba.go(nextUrl, 'barba');

  expect(barba.force).toHaveBeenCalledTimes(1);
  expect(hooks.do).not.toHaveBeenCalled();
  expect(barba.page).not.toHaveBeenCalled();

  barba.transitions['_running'] = false;
});

it('prevent same url with no self transition', async () => {
  barba.page = jest.fn();

  await barba.go('http://localhost/');

  expect(barba.page).not.toHaveBeenCalled();
});

it('use self transition on same url [barba]', async () => {
  barba.page = jest.fn();
  barba.transitions.store.add('transition', { name: 'self' });

  await barba.go('http://localhost/');

  expect(barba.page).toHaveBeenCalledWith('http://localhost/', 'barba', true);
});

it('use self transition on same url [popstate]', async () => {
  barba.page = jest.fn();
  barba.transitions.store.add('transition', { name: 'self' });

  await barba.go('http://localhost/', 'popstate', {
    state: {},
    stopPropagation() {},
    preventDefault() {},
  } as PopStateEvent);

  expect(barba.page).toHaveBeenCalledWith(
    'http://localhost/',
    'popstate',
    true
  );
});
