import barba from '../src';
import hooks from '../src/hooks';
import store from '../src/transitions/store';
import { pageSchema } from '../src/schema';
import { version } from '../package.json';

it('has defaults', () => {
  expect(barba.version).toBe(version);
  expect(barba.store).toBe(store);
  expect(barba.hooks).toBe(hooks);
  expect(barba.pageSchema).toBe(pageSchema);
  expect(barba._plugins).toHaveLength(0);
});
