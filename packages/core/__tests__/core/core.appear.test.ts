/* tslint:disable:no-empty */
import { init } from '../../__mocks__/barba';
import barba from '../../src';

init();

afterEach(() => {
  barba.destroy();
});

it('do appear', () => {
  barba.init({
    transitions: [{ appear() {} }],
  });
  const spyAppear = jest.spyOn(barba.transitions, 'doAppear');

  barba.appear();

  expect(spyAppear).toHaveBeenCalledTimes(1);
  spyAppear.mockRestore();
});

it('catches error', async () => {
  expect.assertions(2);
  const errorAppear = new Error('Appear error');
  const errorTransition = new Error('Transition error [appear]');

  barba.init({
    logLevel: 'error',
    transitions: [
      {
        appear() {
          throw errorAppear;
        },
      },
    ],
  });
  barba.logger.error = jest.fn();
  barba.transitions.logger.error = jest.fn();

  await barba.appear();

  expect(barba.transitions.logger.error).toHaveBeenCalledWith(errorAppear);
  expect(barba.logger.error).toHaveBeenCalledWith(errorTransition);
});
