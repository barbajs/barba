/* eslint-disable no-empty-function */
import barba from '../../src';
import { store, transitions } from '../../src/modules';
import { init } from 'barba';

init();

beforeEach(() => {
  store.init();
});

it('do appear', () => {
  const spyAppear = jest.spyOn(transitions, 'doAppear');

  store.add('transition', { appear() {} });
  barba.appear();

  expect(spyAppear).toHaveBeenCalledTimes(1);
  spyAppear.mockRestore();
});

it('catches error', async () => {
  expect.assertions(2);
  barba.logger.error = jest.fn();
  barba.transitionsManager._logger.error = jest.fn();
  const errorAppear = new Error('Appear error');
  const errorTransition = new Error('Transition error');

  store.add('transition', {
    appear() {
      throw errorAppear;
    },
  });

  await barba.appear();

  expect(barba.transitionsManager._logger.error).toHaveBeenCalledWith(
    errorAppear
  );
  expect(barba.logger.error).toHaveBeenCalledWith(errorTransition);
});
