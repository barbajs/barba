/* eslint-disable no-empty-function */
import barba from '../../src';
import { manager, store } from '../../src/transitions';
import { init } from 'barba';

init();

afterEach(() => {
  store.destroy();
});

it('do appear', () => {
  const spyAppear = jest.spyOn(manager, 'doAppear');

  store.add('transition', { appear() {} });
  barba.appear();

  expect(spyAppear).toHaveBeenCalledTimes(1);
  spyAppear.mockRestore();
});

it('catch error', async () => {
  console.error = jest.fn();

  store.add('transition', {
    appear() {
      throw new Error('test');
    },
  });

  let message;

  try {
    await barba.appear();
  } catch (error) {
    ({ message } = error);
  }

  expect(console.error).toHaveBeenCalledTimes(1);
  expect(message).toBe('Error: Transition error');
});
