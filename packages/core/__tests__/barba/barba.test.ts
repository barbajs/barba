import barba from '../../src';
import { version } from '../../package.json';
import { schemaPage } from '../../src/schemas/page';
import { hooks } from '../../src/hooks';
import { Logger } from '../../src/modules/Logger';
import { dom, helpers, request, url } from '../../src/utils';

it('has defaults', () => {
  expect(barba.version).toBe(version);
  expect(barba.schemaPage).toBe(schemaPage);
  expect(barba.hooks).toBe(hooks);
  expect(barba.Logger).toBe(Logger);
  expect(barba.logger).toBeInstanceOf(Logger);
  expect(barba.dom).toBe(dom);
  expect(barba.helpers).toBe(helpers);
  expect(barba.request).toBe(request);
  expect(barba.url).toBe(url);
  expect(barba.plugins).toHaveLength(0);
});
