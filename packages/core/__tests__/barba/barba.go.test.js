/* eslint-disable no-empty-function */
import { init } from '../../__mocks__/barba';
import barba from '../../src';
import { schemaAttribute } from '../../src/schemas/attribute';
import { hooks } from '../../src/hooks';

// Needed for "request" module
(global as any).Headers = class {};

const namespace = 'test';
const checkDoc = new RegExp(
  `^<html>[\\s\\S]+body[\\s\\S]+${schemaAttribute.wrapper}[\\s\\S]+${
    schemaAttribute.container
  }[\\s\\S]+${namespace}[\\s\\S]+</html>$`
);
const t = { leave() {}, enter() {} };

init();

let spyCacheHas: jest.SpyInstance;
let spyCacheGet: jest.SpyInstance;
let spyCacheSet: jest.SpyInstance;
let spyPage: jest.SpyInstance;

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
  barba.destroy();
});

it('do go', async () => {
  // barba.transitions.doPage = jest.fn();
  barba.history.push = jest.fn();
  hooks.do = jest.fn();
  hooks.before = jest.fn();
  hooks.after = jest.fn();

  barba.transitions.store.add('transition', t);
  const dataLeave = { ...barba.data };

  await barba.go('http://localhost/foo');

  const dataAfter = barba.data;

  expect(spyCacheHas).toHaveBeenCalledTimes(1);
  expect(spyCacheSet).toHaveBeenCalledTimes(1);
  expect(barba.history.push).toHaveBeenCalledTimes(1);
  // expect(hooks.do).toHaveBeenNthCalledWith(1, 'go', dataLeave);
  // expect(hooks.do).toHaveBeenNthCalledWith(2, 'before', dataLeave, t);
  // expect(hooks.do).toHaveBeenNthCalledWith(3, 'after', dataAfter);
  // expect(barba.transitions.doPage).toHaveBeenCalledTimes(1);
});

// it('do go [popstate]', () => {
//   barba.transitions.doPage = jest.fn();
//   barba.history.add = jest.fn();

//   barba.transitions.store.add('transition', { leave() {}, enter() {} });
//   barba.go('http://localhost/foo', 'popstate');

//   expect(barba.history.add).toHaveBeenCalledTimes(1);
// });

// it('do go [has cache]', () => {
//   barba.transitions.doPage = jest.fn();
//   barba.history.add = jest.fn();

//   barba.transitions.store.add('transition', { leave() {}, enter() {} });
//   barba.go('http://localhost/');

//   expect(spyCacheHas).toHaveBeenCalledTimes(1);
//   expect(spyCacheGet).toHaveBeenCalledTimes(1);
//   expect(spyCacheSet).toHaveBeenCalledTimes(0);
// });

// it('do go [waiting]', async () => {
//   barba.transitions.doPage = jest.fn();
//   // Avoid updating data.next
//   // barba._resetData = jest.fn();

//   barba.transitions.store.add('transition', {
//     leave() {},
//     enter() {},
//     to: { namespace: 'ns' },
//   });
//   await barba.go('http://localhost');

//   expect(barba.data.next.html).toMatch(checkDoc);
// });

// it('do go [no use cache]', () => {
//   barba.cacheIgnore = true;

//   barba.transitions.doPage = jest.fn();
//   barba.history.add = jest.fn();

//   barba.transitions.store.add('transition', { leave() {}, enter() {} });
//   barba.go('http://localhost');

//   expect(spyCacheHas).toHaveBeenCalledTimes(0);
//   expect(spyCacheGet).toHaveBeenCalledTimes(0);
//   expect(spyCacheSet).toHaveBeenCalledTimes(0);
// });

// it('force when manager running', () => {
//   barba.force = jest.fn();
//   barba.transitions.doPage = jest.fn();
//   hooks.do = jest.fn();

//   barba.transitions.store.add('transition', { leave() {}, enter() {} });
//   barba.transitions.running = true;
//   barba.go('http://localhost/foo');

//   expect(barba.force).toHaveBeenCalledTimes(1);
//   expect(hooks.do).not.toHaveBeenCalled();
//   expect(transitions.doPage).not.toHaveBeenCalled();

//   barba.transitions.running = false;
// });

// it('catches error', async () => {
//   expect.assertions(3);
//   barba.logger.error = jest.fn();
//   barba.transitions.logger.error = jest.fn();
//   barba.history.cancel = jest.fn();
//   spyPage.mockRestore();
//   const errorLeave = new Error('Leave error');
//   const errorTransition = new Error('Transition error');

//   barba.transitions.store.add('transition', {
//     leave() {
//       throw errorLeave;
//     },
//   });

//   await barba.go('http://localhost');

//   expect(barba.transitions.logger.error).toHaveBeenCalledWith(
//     errorLeave
//   );
//   expect(barba.logger.error).toHaveBeenCalledWith(errorTransition);
//   expect(barba.history.cancel).toHaveBeenCalledTimes(1);
// });
