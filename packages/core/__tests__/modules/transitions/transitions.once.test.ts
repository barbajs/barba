import {
  ISchemaPage,
  ITransitionData,
  ITransitionOnce,
} from '../../../src/defs';
import { hooks } from '../../../src/hooks';
import { Logger } from '../../../src/modules/Logger';
import { Transitions } from '../../../src/modules/Transitions';

// Silence is gold… :)
Logger.setLevel('off');
const transitions = new Transitions([]);

// Mocks
const beforeOnce = jest.fn();
const once = jest.fn();
const afterOnce = jest.fn();

hooks.do = jest.fn();

// Data
let data: ITransitionData;

beforeEach(() => {
  data = {
    current: {} as ISchemaPage,
    next: {} as ISchemaPage,
    trigger: 'barba',
  };
});

it('does not need once', async () => {
  expect.assertions(1);

  await transitions.doOnce({
    data,
    transition: undefined as unknown as ITransitionOnce,
  });
  expect(hooks.do).toHaveBeenNthCalledWith(2, 'once', data, {});
});

it('calls methods', async () => {
  expect.assertions(9);

  await transitions.doOnce({
    data,
    transition: { beforeOnce, once, afterOnce },
  });

  expect(beforeOnce).toHaveBeenCalledTimes(1);
  expect(beforeOnce).toHaveBeenCalledWith(data);

  expect(once).toHaveBeenCalledTimes(1);
  expect(once).toHaveBeenCalledWith(data);

  expect(afterOnce).toHaveBeenCalledTimes(1);
  expect(afterOnce).toHaveBeenCalledWith(data);

  await transitions.doOnce({ data, transition: { once } });

  expect(beforeOnce).toHaveBeenCalledTimes(1);
  expect(once).toHaveBeenCalledTimes(2);
  expect(afterOnce).toHaveBeenCalledTimes(1);
});

it('calls hooks', async () => {
  expect.assertions(4);

  const t = { once: () => Promise.resolve() };

  await transitions.doOnce({ data, transition: t });

  expect(hooks.do).toHaveBeenCalledTimes(3);
  expect(hooks.do).toHaveBeenNthCalledWith(1, 'beforeOnce', data, t);
  expect(hooks.do).toHaveBeenNthCalledWith(2, 'once', data, t);
  expect(hooks.do).toHaveBeenNthCalledWith(3, 'afterOnce', data, t);
});

it('catches error', async () => {
  expect.assertions(2);
  transitions.logger.debug = jest.fn();
  transitions.logger.error = jest.fn();

  const err = new Error('Test');
  const onceError = () => {
    throw err;
  };
  const t = { once: onceError };

  await transitions.doOnce({
    data,
    transition: t,
  });

  expect(transitions.logger.debug).toHaveBeenCalledWith(
    'Transition error [before/after/once]'
  );
  expect(transitions.logger.error).toHaveBeenCalledWith(err);
});
