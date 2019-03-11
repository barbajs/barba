import { init } from '../../__mocks__/barba';
import barba from '../../src';
import { Cache } from '../../src/modules/Cache';

const { link, span, mouseover } = init();

// Mocks
let spyHas: jest.SpyInstance;
let spySet: jest.SpyInstance;

beforeEach(() => {
  spyHas = jest.spyOn(barba.cache, 'has');
  spySet = jest.spyOn(barba.cache, 'set');
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

it('handle link enter with prevent url', () => {
  barba.init({ prefetchIgnore: true });

  link.href = 'foo';
  span.dispatchEvent(mouseover);

  expect(spyHas).toHaveBeenCalledTimes(0);
  expect(spySet).toHaveBeenCalledTimes(0);
});

it('handle link enter with prevent link', () => {
  link.href = 'foo';
  link.dataset.barbaPrevent = '';
  span.dispatchEvent(mouseover);

  expect(spyHas).toHaveBeenCalledTimes(0);
  expect(spySet).toHaveBeenCalledTimes(0);
});
