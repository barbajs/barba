/* tslint:disable:no-empty */
import { init } from '../../__mocks__/barba';
import barba from '../../src';
import { IBarbaOptions, IBarbaPlugin } from '../../src/defs';

init();

const plugin = {
  name: 'p1',
  version: 'alpha',
  install() {},
  init() {},
};
const plugin2 = {
  name: 'p2',
  version: 'beta',
  install() {},
  init() {},
};

beforeEach(() => {
  barba.plugins = [];
});

it('store plugin', () => {
  barba.use(plugin);

  expect(barba.plugins).toHaveLength(1);
  expect(barba.plugins).toContain(plugin);
});

it('store same plugin once', () => {
  barba.use(plugin);
  barba.use(plugin);

  expect(barba.plugins).toHaveLength(1);
});

it('store different plugins', () => {
  barba.use(plugin);
  barba.use(plugin2);

  expect(barba.plugins).toHaveLength(2);
  expect(barba.plugins).toContain(plugin);
  expect(barba.plugins).toContain(plugin2);
});

it('install method plugin', () => {
  plugin.install = jest.fn();
  barba.use(plugin);

  expect(plugin.install).toHaveBeenCalledTimes(1);
});

it('init plugin', () => {
  plugin.init = jest.fn();
  barba.use(plugin);
  barba.init();

  expect(plugin.init).toHaveBeenCalledTimes(1);
});

it('warns invalid plugin', () => {
  barba.logger.warn = jest.fn();
  barba.use({} as IBarbaPlugin<IBarbaOptions>);

  expect(barba.logger.warn).toHaveBeenCalledTimes(1);
});
