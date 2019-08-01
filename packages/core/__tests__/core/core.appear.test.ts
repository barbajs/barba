/* tslint:disable:no-empty */
import { init } from '../../__mocks__/barba';
import barba from '../../src';
import { ITransitionData } from '../../src/defs';
import { Logger } from '../../src/modules/Logger';

init();

const data: ITransitionData = {
  ...barba.data,
  trigger: 'barba',
};

afterEach(() => {
  barba.destroy();
});

it('do appear', async () => {
  const t = { appear() {} };
  const spyAppear = jest.spyOn(barba.transitions, 'doAppear');

  barba.transitions.store.add('transition', t);

  await barba.appear(data);

  expect(spyAppear).toHaveBeenCalledTimes(1);
  spyAppear.mockRestore();
});

it('catches error', async () => {
  expect.assertions(2);
  const errorAppear = new Error('Appear error');
  const errorTransition = new Error('Transition error [appear]');
  const t = {
    appear() {
      throw errorAppear;
    },
  };
  barba.transitions.store.add('transition', t);
  Logger.setLevel('error');

  barba.logger.error = jest.fn();
  barba.transitions.logger.error = jest.fn();

  await barba.appear(data);

  expect(barba.transitions.logger.error).toHaveBeenCalledWith(errorAppear);
  expect(barba.logger.error).toHaveBeenCalledWith(errorTransition);
});
