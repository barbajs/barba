import { Views } from '../../src/modules/Views';
import { hooks } from '../../src/hooks';

let views: Views;

// beforeEach(() => {
//   hooks.init();
// });

afterEach(() => {
  hooks.clear();
});

const beforeAppear = jest.fn();
const afterAppear = jest.fn();
const beforeLeave = jest.fn();
const afterLeave = jest.fn();
const beforeEnter = jest.fn();
const afterEnter = jest.fn();

it('has defaults', () => {
  views = new Views([]);

  expect(views.byNamespace.size).toBe(0);
});

it('init views', () => {
  views = new Views([
    { namespace: 'foo', name: 'overriden' },
    { namespace: 'foo', name: 'ok' },
    { namespace: 'bar', name: 'ok' },
  ]);
  expect(views.byNamespace.get('foo')).toEqual({
    namespace: 'foo',
    name: 'ok',
  });
  expect(views.byNamespace.get('bar')).toEqual({
    namespace: 'bar',
    name: 'ok',
  });
});

it('register hooks', () => {
  // No views, no hooks
  views = new Views([]);
  expect(hooks.registered.get('beforeAppear')).toBeUndefined();
  expect(hooks.registered.get('afterAppear')).toBeUndefined();
  expect(hooks.registered.get('beforeLeave')).toBeUndefined();
  expect(hooks.registered.get('afterLeave')).toBeUndefined();
  expect(hooks.registered.get('beforeEnter')).toBeUndefined();
  expect(hooks.registered.get('afterEnter')).toBeUndefined();

  views = new Views([{ namespace: 'baz' }]);
  expect(hooks.registered.get('beforeAppear').size).toBe(1);
  expect(hooks.registered.get('afterAppear').size).toBe(1);
  expect(hooks.registered.get('beforeLeave').size).toBe(1);
  expect(hooks.registered.get('afterLeave').size).toBe(1);
  expect(hooks.registered.get('beforeEnter').size).toBe(1);
  expect(hooks.registered.get('afterEnter').size).toBe(1);
});

it('do existing hooks for existing namespace', () => {
  views = new Views([
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
  views = new Views([{ namespace: 'success' }]);

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
  views = new Views([
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
