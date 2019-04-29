import {
  ISchemaPage,
  ITransitionAppear,
  ITransitionData,
} from '../../../src/defs';
import { hooks } from '../../../src/hooks';
import { Logger } from '../../../src/modules/Logger';
import { Transitions } from '../../../src/modules/Transitions';

// Silence is gold… :)
Logger.setLevel('off');
const transitions = new Transitions([]);

// Mocks
const beforeAppear = jest.fn();
const appear = jest.fn();
const afterAppear = jest.fn();
const appearCanceled = jest.fn();

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

it('does not need appear', async () => {
  expect.assertions(1);

  await transitions.doAppear({
    data,
    transition: undefined as ITransitionAppear,
  });
  expect(hooks.do).toHaveBeenNthCalledWith(2, 'appear', data, {});
});

it('calls methods', async () => {
  expect.assertions(9);

  await transitions.doAppear({
    data,
    transition: { beforeAppear, appear, afterAppear },
  });

  expect(beforeAppear).toHaveBeenCalledTimes(1);
  expect(beforeAppear).toHaveBeenCalledWith(data);

  expect(appear).toHaveBeenCalledTimes(1);
  expect(appear).toHaveBeenCalledWith(data);

  expect(afterAppear).toHaveBeenCalledTimes(1);
  expect(afterAppear).toHaveBeenCalledWith(data);

  await transitions.doAppear({ data, transition: { appear } });

  expect(beforeAppear).toHaveBeenCalledTimes(1);
  expect(appear).toHaveBeenCalledTimes(2);
  expect(afterAppear).toHaveBeenCalledTimes(1);
});

it('calls hooks', async () => {
  expect.assertions(4);

  const t = { appear: () => Promise.resolve() };

  await transitions.doAppear({ data, transition: t });

  expect(hooks.do).toHaveBeenCalledTimes(3);
  expect(hooks.do).toHaveBeenNthCalledWith(1, 'beforeAppear', data, t);
  expect(hooks.do).toHaveBeenNthCalledWith(2, 'appear', data, t);
  expect(hooks.do).toHaveBeenNthCalledWith(3, 'afterAppear', data, t);
});

it('catches error', async () => {
  expect.assertions(2);
  transitions.logger.error = jest.fn();

  const appearError = () => {
    throw new Error('Test');
  };
  const t = { appear: appearError, appearCanceled };

  try {
    await transitions.doAppear({
      data,
      transition: t,
    });
  } catch (e) {
    expect(e).toEqual(new Error('Transition error [appear]'));
    expect(transitions.isRunning).toBeFalsy();
  }
});
