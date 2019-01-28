import cache from '../../src/cache';
import { init } from 'barba';

const { link, span, mouseover } = init();

// Mocks
let spyHas;
let spySet;

beforeEach(() => {
  spyHas = jest.spyOn(cache, 'has');
  spySet = jest.spyOn(cache, 'set');
});
afterEach(() => {
  spyHas.mockRestore();
  spySet.mockRestore();
});

it('handle link enter', () => {
  link.href = 'foo';
  span.dispatchEvent(mouseover);

  expect(spyHas).toHaveBeenCalledTimes(1);
  expect(spySet).toHaveBeenCalledTimes(1);
});

it('handle link enter with same url', () => {
  link.href = 'http://localhost/';
  span.dispatchEvent(mouseover);

  expect(spyHas).toHaveBeenCalledTimes(1);
  expect(spySet).toHaveBeenCalledTimes(0);
});

it('handle link enter with prevent', () => {
  link.href = 'foo';
  link.dataset.barbaPrevent = '';
  span.dispatchEvent(mouseover);

  expect(spyHas).toHaveBeenCalledTimes(0);
  expect(spySet).toHaveBeenCalledTimes(0);
});
