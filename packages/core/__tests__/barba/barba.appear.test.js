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

it('catches error', async () => {
  expect.assertions(2);
  barba.logger.error = jest.fn();
  barba.manager._logger.error = jest.fn();
  const errorAppear = new Error('Appear error');
  const errorTransition = new Error('Transition error');

  store.add('transition', {
    appear() {
      throw errorAppear;
    },
  });

  await barba.appear();

  expect(barba.manager._logger.error).toHaveBeenCalledWith(errorAppear);
  expect(barba.logger.error).toHaveBeenCalledWith(errorTransition);
});
