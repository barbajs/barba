/* eslint-disable no-empty-function */
import barba from '../../src';
import { init } from 'barba';

init();

const plugin = {
  install() {},
};
const plugin2 = {
  install() {},
};

beforeEach(() => {
  barba._plugins = [];
});

it('store plugin', () => {
  barba.use(plugin);

  expect(barba._plugins).toHaveLength(1);
  expect(barba._plugins).toContain(plugin);
});

it('store same plugin once', () => {
  barba.use(plugin);
  barba.use(plugin);

  expect(barba._plugins).toHaveLength(1);
});

it('store different plugins', () => {
  barba.use(plugin);
  barba.use(plugin2);

  expect(barba._plugins).toHaveLength(2);
  expect(barba._plugins).toContain(plugin);
  expect(barba._plugins).toContain(plugin2);
});

it('install method plugin', () => {
  plugin.install = jest.fn();
  barba.use(plugin);

  expect(plugin.install).toHaveBeenCalledTimes(1);
});

it('install function plugin', () => {
  const p = jest.fn();

  barba.use(p);

  expect(p).toHaveBeenCalledTimes(1);
});

it('install function plugin', () => {
  const p = {};
  const result = barba.use(p);

  expect(result).toBeFalsy();
});

it('init plugin', () => {
  plugin.init = jest.fn();
  barba.use(plugin);
  barba.init();

  expect(plugin.init).toHaveBeenCalledTimes(1);
});
