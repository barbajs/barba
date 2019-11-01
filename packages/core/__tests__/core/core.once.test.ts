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

it('do once', async () => {
  const t = { once() {} };
  const spyOnce = jest.spyOn(barba.transitions, 'doOnce');

  barba.transitions.store.add('transition', t);

  await barba.once(data);

  expect(spyOnce).toHaveBeenCalledTimes(1);
  spyOnce.mockRestore();
});

it('catches error', async () => {
  expect.assertions(2);
  const errorOnce = new Error('Once error');
  const errorTransition = new Error('Transition error [once]');
  const t = {
    once() {
      throw errorOnce;
    },
  };
  barba.transitions.store.add('transition', t);
  Logger.setLevel('error');

  barba.logger.error = jest.fn();
  barba.transitions.logger.error = jest.fn();

  await barba.once(data);

  expect(barba.transitions.logger.error).toHaveBeenCalledWith(errorOnce);
  expect(barba.logger.error).toHaveBeenCalledWith(errorTransition);
});
