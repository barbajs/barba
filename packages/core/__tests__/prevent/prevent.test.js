import prevent from '../../src/prevent';
import { attributeSchema } from '../../src/schema';

prevent.init({ attributeSchema });

it('fails with no params', () => {
  const check = prevent.check();

  expect(check).toBeTruthy();
});

it('add test ', () => {
  const name = 'fake';
  const check = () => true;

  prevent.add(name, check);

  expect(prevent.tests[name]).toBe(check);
});
