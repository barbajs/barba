import views from '../src/views';
import barba from '../src/barba';
import hooks from '../src/hooks';

afterEach(() => {
  views._byNamespace = {};
  hooks.destroy();
});

const beforeLeave = jest.fn();
const afterLeave = jest.fn();
const beforeEnter = jest.fn();
const afterEnter = jest.fn();

it('has defaults', () => {
  expect(views._byNamespace).toEqual({});
});

it('init views', () => {
  views.init(barba, [
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
  views.init(barba, []);
  expect(hooks._registered.beforeLeave).toHaveLength(1);
  expect(hooks._registered.afterLeave).toHaveLength(1);
  expect(hooks._registered.beforeEnter).toHaveLength(1);
  expect(hooks._registered.afterEnter).toHaveLength(1);
});

it('do existing hooks for existing namespace', () => {
  views.init(barba, [
    { namespace: 'success', beforeLeave, afterLeave, beforeEnter, afterEnter },
  ]);

  const success = {
    current: { namespace: 'success' },
    next: { namespace: 'success' },
  };

  hooks.do('beforeLeave', success);
  hooks.do('afterLeave', success);
  hooks.do('beforeEnter', success);
  hooks.do('afterEnter', success);

  expect(beforeLeave).toHaveBeenCalledWith(success);
  expect(afterLeave).toHaveBeenCalledWith(success);
  expect(beforeEnter).toHaveBeenCalledWith(success);
  expect(afterEnter).toHaveBeenCalledWith(success);
});

it('do nothing for missing hooks', () => {
  views.init(barba, [{ namespace: 'success' }]);

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
  views.init(barba, [
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
