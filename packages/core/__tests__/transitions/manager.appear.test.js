/* eslint-disable no-empty-function */
import { hooks, transitions } from '../../src/modules';

// Mocks
const beforeAppear = jest.fn();
const appear = jest.fn();
const afterAppear = jest.fn();
const appearCanceled = jest.fn();

hooks.do = jest.fn();

const data = 'data';

it('needs transition', async () => {
  expect.assertions(1);
  transitions._logger.warn = jest.fn();

  await transitions.doAppear({
    transition: undefined,
    data,
  });
  expect(transitions._logger.warn).toHaveBeenCalledWith('No transition found');
});

it('calls methods', async () => {
  expect.assertions(9);

  await transitions.doAppear({
    transition: { beforeAppear, appear, afterAppear },
    data,
  });

  expect(beforeAppear).toHaveBeenCalledTimes(1);
  expect(beforeAppear).toHaveBeenCalledWith(data);

  expect(appear).toHaveBeenCalledTimes(1);
  expect(appear).toHaveBeenCalledWith(data);

  expect(afterAppear).toHaveBeenCalledTimes(1);
  expect(afterAppear).toHaveBeenCalledWith(data);

  await transitions.doAppear({ transition: { appear } });

  expect(beforeAppear).toHaveBeenCalledTimes(1);
  expect(appear).toHaveBeenCalledTimes(2);
  expect(afterAppear).toHaveBeenCalledTimes(1);
});

it('calls hooks', async () => {
  expect.assertions(4);

  const t = { appear() {} };

  await transitions.doAppear({ transition: t, data });

  expect(hooks.do).toHaveBeenCalledTimes(3);
  expect(hooks.do).toHaveBeenNthCalledWith(1, 'beforeAppear', data, t);
  expect(hooks.do).toHaveBeenNthCalledWith(2, 'appear', data, t);
  expect(hooks.do).toHaveBeenNthCalledWith(3, 'afterAppear', data, t);
});

it('catches error', async () => {
  expect.assertions(3);
  transitions._logger.error = jest.fn();

  const appearError = () => {
    throw new Error('Test');
  };
  const t = { appear: appearError, appearCanceled };

  try {
    await transitions.doAppear({
      transition: t,
      data,
    });
  } catch (e) {
    expect(e).toEqual(new Error('Transition error'));
    expect(hooks.do).toHaveBeenLastCalledWith('appearCanceled', data, t);
    expect(appearCanceled).toHaveBeenCalledTimes(1);
  }
});
