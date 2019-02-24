import { attributeSchema } from '../../src/schemas';
import { prevent } from '../../src/utils';

prevent.init({ attributeSchema });

it('fails with no params', () => {
  const check = prevent.check();

  expect(check).toBeTruthy();
});

it('add test ', () => {
  const name = 'fake';
  const check = () => true;

  prevent.add(name, check);

  expect(prevent._tests[name]).toBe(check);
});
