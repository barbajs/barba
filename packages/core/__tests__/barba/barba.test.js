import barba from '../../src';
import Logger from '../../src/Logger';
import manager from '../../src/transitions/manager';
import store from '../../src/transitions/store';
import cache from '../../src/cache';
import hooks from '../../src/hooks';
import prevent from '../../src/prevent';
import request from '../../src/request';
import * as utils from '../../src/utils';
import { pageSchema } from '../../src/schema';
import { version } from '../../package.json';

it('has defaults', () => {
  expect(barba.version).toBe(version);
  expect(barba.logger).toBeInstanceOf(Logger);
  expect(barba.manager).toBe(manager);
  expect(barba.store).toBe(store);
  expect(barba.cache).toBe(cache);
  expect(barba.hooks).toBe(hooks);
  expect(barba.prevent).toBe(prevent);
  expect(barba.request).toBe(request);
  expect(barba.utils).toBe(utils);
  expect(barba.pageSchema).toBe(pageSchema);
  expect(barba._plugins).toHaveLength(0);
});
