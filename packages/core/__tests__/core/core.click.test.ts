import { init } from '../../__mocks__/barba';
import barba from '../../src';

const { link, span, click } = init();

// Mocks
barba.go = jest.fn();

it('handle link enter', () => {
  link.href = 'foo';
  span.dispatchEvent(click);

  expect(barba.go).toHaveBeenCalledTimes(1);
});

it('handle link enter with same url', () => {
  link.href = 'http://localhost/';
  span.dispatchEvent(click);

  expect(barba.go).toHaveBeenCalledTimes(0);
});

it('handle link enter with prevent', () => {
  link.href = 'foo';
  link.dataset.barbaPrevent = '';
  span.dispatchEvent(click);

  expect(barba.go).toHaveBeenCalledTimes(0);
});
