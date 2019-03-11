import { init } from '../../__mocks__/barba';
import barba from '../../src';
import { Logger } from '../../src/modules/Logger';

init();

it('has default level log', () => {
  expect(Logger.getLevel()).toBe(0);
});

it('has debug level log', () => {
  barba.init({ debug: true });
  expect(Logger.getLevel()).toBe(4);
});

it('has custom level log', () => {
  barba.init({ logLevel: 'error' });
  expect(Logger.getLevel()).toBe(1);
});
