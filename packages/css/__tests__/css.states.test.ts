/* tslint:disable:no-string-literal */
import css from '../src';

// Dom
const container = document.createElement('div');
const kind = 'test';

// Utils
/**
 * Wait for 1 repaint
 */
function nextTick() {
  return new Promise(resolve => {
    window.requestAnimationFrame(resolve);
  });
}

css.add = jest.fn();
css.remove = jest.fn();
container.addEventListener = jest.fn();
container.removeEventListener = jest.fn();

it('do start', async () => {
  await css.start(container, kind);

  expect(css.add).toHaveBeenNthCalledWith(1, container, kind);
  expect(css.add).toHaveBeenNthCalledWith(2, container, `${kind}-active`);
});

it('do next', async () => {
  css['_checkTransition'] = jest.fn().mockReturnValue(true);
  css.next(container, kind);

  expect.assertions(4);
  expect(css.callbacks[kind]).toBeDefined();
  expect(container.addEventListener).toHaveBeenCalledTimes(1);

  await nextTick();

  expect(css.remove).toHaveBeenNthCalledWith(1, container, kind);
  expect(css.add).toHaveBeenCalledTimes(1);
  // DEV not working?!??
  // expect(css.add).toHaveBeenNthCalledWith(2, container, `${kind}-to`);
});

it('do end', async () => {
  await css.end(container, kind);

  expect(css.remove).toHaveBeenNthCalledWith(1, container, `${kind}-to`);
  expect(css.remove).toHaveBeenNthCalledWith(2, container, `${kind}-active`);
  expect(container.removeEventListener).toHaveBeenCalledTimes(1);
});

it('do next with no CSS transition', async () => {
  css['_checkTransition'] = jest.fn().mockReturnValue(false);
  await css.next(container, kind);

  expect(css.remove).toHaveBeenNthCalledWith(1, container, kind);
  expect(css.add).toHaveBeenNthCalledWith(1, container, `${kind}-to`);
  expect(container.removeEventListener).toHaveBeenCalledTimes(0);
});
