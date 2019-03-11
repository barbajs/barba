import { HooksAll } from '../../src/defs';
import { hooks } from '../../src/hooks';

const [hookName] = hooks.all;

afterEach(() => {
  hooks.clear();
});

it('has defaults', () => {
  expect(hooks.all).toBeDefined();
  expect(hooks.registered.size).toBe(0);
  expect(hooks[hookName]).toBeDefined();
});

it('register hooks', () => {
  const ctx = {};
  const fn = jest.fn();
  const fn2 = jest.fn();

  hooks[hookName](fn, ctx);

  expect(hooks.registered.has(hookName)).toBeTruthy();
  expect(hooks.registered.get(hookName).size).toBe(1);

  hooks[hookName](fn2);

  expect(hooks.registered.get(hookName).size).toBe(2);

  const values = hooks.registered.get(hookName).values();
  const v1 = values.next().value;
  const v2 = values.next().value;

  expect(v1.fn).toBe(fn);
  expect(v1.ctx).toBe(ctx);
  expect(v2.fn).toBe(fn2);
  expect(v2.ctx).toBe(null);
});

it('do nothing when no hooks', () => {
  const doUnknown = jest.fn(() => hooks.do(('unknown' as unknown) as HooksAll));
  const doUnregistered = jest.fn(() => hooks.do(hooks.all[1]));

  doUnknown();
  doUnregistered();

  expect(doUnknown).toHaveReturnedWith(undefined);
  expect(doUnregistered).toHaveReturnedWith(undefined);
});

it('do registered hooks', () => {
  const fn = jest.fn();
  const fn2 = jest.fn();

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
  interface ICtx {
    prop: string;
    fn(): string;
  }
  const ctx: ICtx = {
    fn: jest.fn(function(this: ICtx) {
      return this.prop;
    }),
    prop: 'foo',
  };

  hooks.init();

  hooks[hookName](ctx.fn, ctx);
  hooks.do(hookName);

  expect(ctx.fn).toHaveReturnedWith(ctx.prop);
});

it('print help', () => {
  hooks.logger.info = jest.fn();

  hooks.init();
  hooks[hookName]();
  hooks.help();

  expect(hooks.logger.info).toHaveBeenCalledTimes(2);
});
