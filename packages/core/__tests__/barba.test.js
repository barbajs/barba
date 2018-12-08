import barba from '../src';
import { version } from '../package.json';

it('has correct version', () => {
  expect(barba.version).toBe(version);
});

it('has wrapper', () => {
  expect(barba.wrapper).toBeNull();
});

it('has current', () => {
  expect(barba.current).toBeNull();
});

it('has next', () => {
  expect(barba.next).toBeNull();
});

it('has trigger', () => {
  expect(barba.trigger).toBeNull();
});

it('has store', () => {
  expect(barba.store).toBeNull();
});

it('has hooks', () => {
  expect(barba.hooks).toBeDefined();
});
