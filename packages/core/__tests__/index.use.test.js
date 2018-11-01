import barba from '../src';

const plugin = {
  install() {}, // eslint-disable-line no-empty-function
};
const plugin2 = {
  install() {}, // eslint-disable-line no-empty-function
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

it('install plugin', () => {
  plugin.install = jest.fn();
  barba.use(plugin);

  expect(plugin.install).toHaveBeenCalledTimes(1);
});
