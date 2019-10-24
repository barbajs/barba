import { init } from '../../__mocks__/barba';
import barba from '../../src';

const { link, span, click } = init();

// Mocks
barba.page = jest.fn();

afterEach(() => {
  (global as any).jsdom.reconfigure({ url: 'http://localhost/' });
});

it('handle link click', () => {
  link.href = 'foo';
  span.dispatchEvent(click);

  expect(barba.page).toHaveBeenCalledTimes(1);
});

it('handle link click with same url', () => {
  link.href = 'http://localhost/';
  span.dispatchEvent(click);

  expect(barba.page).toHaveBeenCalledTimes(0);
});

it('handle link click with prevent', () => {
  link.href = 'foo';
  link.dataset.barbaPrevent = '';
  span.dispatchEvent(click);

  expect(barba.page).toHaveBeenCalledTimes(0);
});

it('handle link click with transition running', () => {
  barba.go = jest.fn();
  barba.transitions.isRunning = true;
  link.href = 'foo';
  delete link.dataset.barbaPrevent;
  barba.preventRunning = false;
  span.dispatchEvent(click);
  barba.preventRunning = true;
  span.dispatchEvent(click);

  expect(barba.go).toHaveBeenCalledTimes(1);
});
