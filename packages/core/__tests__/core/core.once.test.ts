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
