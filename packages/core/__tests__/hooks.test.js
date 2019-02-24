import { hooks } from '../src/modules';

const [hookName] = hooks.all;

it('has defaults', () => {
  expect(hooks.all).toBeDefined();
  expect(hooks.all).toBeDefined();
  expect(hooks[hookName]).toBeUndefined();
});

it('init hooks', () => {
  hooks.init();

  expect(hooks[hookName]).toBeDefined();
  expect(hooks.registered).not.toHaveProperty(hookName);
});

it('register hooks', () => {
  const ctx = {};
  const fn = jest.fn();
  const fn2 = jest.fn();

  hooks.init();

  hooks[hookName](fn, ctx);

  expect(hooks.registered).toHaveProperty(hookName);
  expect(hooks.registered[hookName]).toHaveLength(1);
  expect(hooks.registered[hookName][0].fn).toBe(fn);
  expect(hooks.registered[hookName][0].ctx).toBe(ctx);

  hooks[hookName](fn2);

  expect(hooks.registered[hookName][1].fn).toBe(fn2);
  expect(hooks.registered[hookName][1].ctx).toBeNull();
});

it('do nothing when no hooks', () => {
  const doUnknown = jest.fn(() => hooks.do('unknown'));
  const doUnregistered = jest.fn(() => hooks.do(hooks.all[1]));

  hooks.init();

  doUnknown();
  doUnregistered();

  expect(doUnknown).toHaveReturnedWith(undefined);
  expect(doUnregistered).toHaveReturnedWith(undefined);
});

it('do registered hooks', () => {
  const fn = jest.fn();
  const fn2 = jest.fn();

  hooks.init();

  hooks[hookName](fn);
  hooks[hookName](fn2);

  hooks.do(hookName);

  expect(fn).toHaveBeenCalledTimes(1);
  expect(fn2).toHaveBeenCalledTimes(1);
});

it('do with arguments', () => {
  const expected = 'arg';
  const fn = jest.fn((...args) => args);

  hooks.init();

  hooks[hookName](fn);
  hooks.do(hookName, expected);

  expect(fn).toHaveReturnedWith([expected]);
});

it('do with context', () => {
  const ctx = 'arg';
  const fn = jest.fn(function hook() {
    return this; // eslint-disable-line no-invalid-this
  });

  hooks.init();

  hooks[hookName](fn, ctx);
  hooks.do(hookName);

  expect(fn).toHaveReturnedWith(ctx);
});

it('print help', () => {
  hooks._logger.info = jest.fn();

  hooks.init();
  hooks[hookName]();
  hooks.help();

  expect(hooks._logger.info).toHaveBeenCalledTimes(2);
});
