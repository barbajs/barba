import barba from '../../src';
import { version } from '../../package.json';
import { pageSchema } from '../../src/schemas';
import { cache, hooks, store, transitions } from '../../src/modules';
import { helpers, Logger, prevent, request } from '../../src/utils';

barba.init({});

it('has defaults', () => {
  expect(barba.version).toBe(version);
  expect(barba.cache).toBe(cache);
  expect(barba.hooks).toBe(hooks);
  expect(barba.store).toBe(store);
  expect(barba.transitionsManager).toBe(transitions);
  expect(barba.pageSchema).toBe(pageSchema);
  expect(barba.helpers).toBe(helpers);
  expect(barba.Logger).toBe(Logger);
  expect(barba.prevent).toBe(prevent);
  expect(barba.request).toBe(request);
  expect(barba._plugins).toHaveLength(0);
});
