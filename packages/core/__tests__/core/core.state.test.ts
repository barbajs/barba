/* tslint:disable:no-empty no-string-literal */
import { init } from '../../__mocks__/barba';
import barba from '../../src';

init();

// Mocks
barba.page = jest.fn();

it('manage history with "unknown" state', async () => {
  barba.history.add = jest.fn();

  await barba.go('http://localhost/foo', 'popstate', {
    state: null,
    stopPropagation() {},
    preventDefault() {},
  } as PopStateEvent);

  expect(barba.history.add).toHaveBeenCalledWith(
    'http://localhost/foo',
    'tmp',
    null,
    false
  );
});

it('manage history with previous state', async () => {
  barba.history.add = jest.fn();

  await barba.go('http://localhost/bar', 'popstate', {
    state: {
      index: 0,
      ns: 'bar',
    },
    stopPropagation() {},
    preventDefault() {},
  } as PopStateEvent);

  expect(barba.history.add).toHaveBeenCalledWith(
    'http://localhost/bar',
    'bar',
    0,
    false
  );
});
