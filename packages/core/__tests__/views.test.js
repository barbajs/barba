import { hooks, views } from '../src/modules';

beforeEach(() => {
  hooks.init();
});

afterEach(() => {
  views._byNamespace = {};
});

const beforeAppear = jest.fn();
const afterAppear = jest.fn();
const beforeLeave = jest.fn();
const afterLeave = jest.fn();
const beforeEnter = jest.fn();
const afterEnter = jest.fn();

it('has defaults', () => {
  expect(views._byNamespace).toEqual({});
});

it('init views', () => {
  views.init([
    { namespace: 'foo', value: 'overriden' },
    { namespace: 'foo', value: 'ok' },
    { namespace: 'bar', value: 'ok' },
  ]);
  expect(views._byNamespace.foo).toEqual({
    value: 'ok',
  });
  expect(views._byNamespace.bar).toEqual({
    value: 'ok',
  });
});

it('register hooks', () => {
  // No views, no hooks
  views.init([]);
  expect(hooks.registered.beforeAppear).toBeUndefined();
  expect(hooks.registered.afterAppear).toBeUndefined();
  expect(hooks.registered.beforeLeave).toBeUndefined();
  expect(hooks.registered.afterLeave).toBeUndefined();
  expect(hooks.registered.beforeEnter).toBeUndefined();
  expect(hooks.registered.afterEnter).toBeUndefined();
  views.init([{ namespace: 'baz' }]);
  expect(hooks.registered.beforeAppear).toHaveLength(1);
  expect(hooks.registered.afterAppear).toHaveLength(1);
  expect(hooks.registered.beforeLeave).toHaveLength(1);
  expect(hooks.registered.afterLeave).toHaveLength(1);
  expect(hooks.registered.beforeEnter).toHaveLength(1);
  expect(hooks.registered.afterEnter).toHaveLength(1);
});

it('do existing hooks for existing namespace', () => {
  views.init([
    {
      namespace: 'success',
      beforeAppear,
      afterAppear,
      beforeLeave,
      afterLeave,
      beforeEnter,
      afterEnter,
    },
  ]);

  const success = {
    current: { namespace: 'success' },
    next: { namespace: 'success' },
  };

  hooks.do('beforeAppear', success);
  hooks.do('afterAppear', success);
  hooks.do('beforeLeave', success);
  hooks.do('afterLeave', success);
  hooks.do('beforeEnter', success);
  hooks.do('afterEnter', success);

  expect(beforeAppear).toHaveBeenCalledWith(success);
  expect(afterAppear).toHaveBeenCalledWith(success);
  expect(beforeLeave).toHaveBeenCalledWith(success);
  expect(afterLeave).toHaveBeenCalledWith(success);
  expect(beforeEnter).toHaveBeenCalledWith(success);
  expect(afterEnter).toHaveBeenCalledWith(success);
});

it('do nothing for missing hooks', () => {
  views.init([{ namespace: 'success' }]);

  const success = {
    current: { namespace: 'success' },
    next: { namespace: 'success' },
  };

  hooks.do('beforeAppear', success);
  hooks.do('afterAppear', success);
  hooks.do('beforeLeave', success);
  hooks.do('afterLeave', success);
  hooks.do('beforeEnter', success);
  hooks.do('afterEnter', success);

  expect(beforeAppear).not.toHaveBeenCalled();
  expect(afterAppear).not.toHaveBeenCalled();
  expect(beforeLeave).not.toHaveBeenCalled();
  expect(afterLeave).not.toHaveBeenCalled();
  expect(beforeEnter).not.toHaveBeenCalled();
  expect(afterEnter).not.toHaveBeenCalled();
});

it('do nothing for missing namespace', () => {
  views.init([
    { namespace: 'success', beforeLeave, afterLeave, beforeEnter, afterEnter },
  ]);
  const fail = { current: { namespace: 'fail' }, next: { namespace: 'fail' } };

  hooks.do('beforeAppear', fail);
  hooks.do('afterAppear', fail);
  hooks.do('beforeLeave', fail);
  hooks.do('afterLeave', fail);
  hooks.do('beforeEnter', fail);
  hooks.do('afterEnter', fail);

  expect(beforeAppear).not.toHaveBeenCalled();
  expect(afterAppear).not.toHaveBeenCalled();
  expect(beforeLeave).not.toHaveBeenCalled();
  expect(afterLeave).not.toHaveBeenCalled();
  expect(beforeEnter).not.toHaveBeenCalled();
  expect(afterEnter).not.toHaveBeenCalled();
});
