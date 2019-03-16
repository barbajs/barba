import { Prevent } from '../../../src/modules/Prevent';

const prevent = new Prevent(false);

it('adds test ', () => {
  const name = 'fake';
  const check = () => true;

  prevent.add(name, check);

  expect(prevent.tests.get(name)).toBe(check);
});
