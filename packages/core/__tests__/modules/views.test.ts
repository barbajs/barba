import { hooks } from '../../src/hooks';
import { Views } from '../../src/modules/Views';

let views: Views;

// beforeEach(() => {
//   hooks.init();
// });

afterEach(() => {
  hooks.clear();
});

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
    name: 'ok',
    namespace: 'foo',
  });
  expect(views.byNamespace.get('bar')).toEqual({
    name: 'ok',
    namespace: 'bar',
  });
});

it('register hooks', () => {
  // No views, no hooks
  views = new Views([]);
  expect(hooks.registered.get('beforeLeave')).toBeUndefined();
  expect(hooks.registered.get('afterLeave')).toBeUndefined();
  expect(hooks.registered.get('beforeEnter')).toBeUndefined();
  expect(hooks.registered.get('afterEnter')).toBeUndefined();

  views = new Views([{ namespace: 'baz' }]);
  expect(hooks.registered.get('beforeLeave').size).toBe(1);
  expect(hooks.registered.get('afterLeave').size).toBe(1);
  expect(hooks.registered.get('beforeEnter').size).toBe(1);
  expect(hooks.registered.get('afterEnter').size).toBe(1);
});

/* tslint:disable:object-literal-sort-keys */
it('do existing hooks for existing namespace', async () => {
  views = new Views([
    {
      namespace: 'success',
      beforeLeave,
      afterLeave,
      beforeEnter,
      afterEnter,
    },
  ]);
  /* tslint:enable:object-literal-sort-keys */

  const success = {
    current: { namespace: 'success' },
    next: { namespace: 'success' },
  };

  await hooks.do('beforeLeave', success);
  await hooks.do('afterLeave', success);
  await hooks.do('beforeEnter', success);
  await hooks.do('afterEnter', success);

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

  hooks.do('beforeLeave', success);
  hooks.do('afterLeave', success);
  hooks.do('beforeEnter', success);
  hooks.do('afterEnter', success);

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

  hooks.do('beforeLeave', fail);
  hooks.do('afterLeave', fail);
  hooks.do('beforeEnter', fail);
  hooks.do('afterEnter', fail);

  expect(beforeLeave).not.toHaveBeenCalled();
  expect(afterLeave).not.toHaveBeenCalled();
  expect(beforeEnter).not.toHaveBeenCalled();
  expect(afterEnter).not.toHaveBeenCalled();
});
