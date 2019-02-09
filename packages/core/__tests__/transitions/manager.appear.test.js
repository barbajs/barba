/* eslint-disable no-empty-function */
import { manager } from '../../src/transitions';
import hooks from '../../src/hooks';

// Mocks
const beforeAppear = jest.fn();
const appear = jest.fn();
const afterAppear = jest.fn();
const appearCanceled = jest.fn();

hooks.do = jest.fn();

const data = 'data';

it('needs transition', async () => {
  expect.assertions(1);
  manager._logger.warn = jest.fn();

  await manager.doAppear({
    transition: undefined,
    data,
  });
  expect(manager._logger.warn).toHaveBeenCalledWith('No transition found');
});

it('calls methods', async () => {
  expect.assertions(9);

  await manager.doAppear({
    transition: { beforeAppear, appear, afterAppear },
    data,
  });

  expect(beforeAppear).toHaveBeenCalledTimes(1);
  expect(beforeAppear).toHaveBeenCalledWith(data);

  expect(appear).toHaveBeenCalledTimes(1);
  expect(appear).toHaveBeenCalledWith(data);

  expect(afterAppear).toHaveBeenCalledTimes(1);
  expect(afterAppear).toHaveBeenCalledWith(data);

  await manager.doAppear({ transition: { appear } });

  expect(beforeAppear).toHaveBeenCalledTimes(1);
  expect(appear).toHaveBeenCalledTimes(2);
  expect(afterAppear).toHaveBeenCalledTimes(1);
});

it('calls hooks', async () => {
  expect.assertions(4);

  const t = { appear() {} };

  await manager.doAppear({ transition: t, data });

  expect(hooks.do).toHaveBeenCalledTimes(3);
  expect(hooks.do).toHaveBeenNthCalledWith(1, 'beforeAppear', data, t);
  expect(hooks.do).toHaveBeenNthCalledWith(2, 'appear', data, t);
  expect(hooks.do).toHaveBeenNthCalledWith(3, 'afterAppear', data, t);
});

it('catches error', async () => {
  expect.assertions(3);
  manager._logger.error = jest.fn();

  const appearError = () => {
    throw new Error('Test');
  };
  const t = { appear: appearError, appearCanceled };

  try {
    await manager.doAppear({
      transition: t,
      data,
    });
  } catch (e) {
    expect(e).toEqual(new Error('Transition error'));
    expect(hooks.do).toHaveBeenLastCalledWith('appearCanceled', data, t);
    expect(appearCanceled).toHaveBeenCalledTimes(1);
  }
});
