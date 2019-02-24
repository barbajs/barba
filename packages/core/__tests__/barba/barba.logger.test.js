import barba from '../../src';
import { Logger } from '../../src/utils';
import { init } from 'barba';

init();

it('has default level log', () => {
  expect(Logger.level).toBe(0);
});

it('has debug level log', () => {
  barba.init({ debug: true });
  expect(Logger.level).toBe(4);
});

it('has custom level log', () => {
  barba.init({ log: 'error' });
  expect(Logger.level).toBe(1);
});
