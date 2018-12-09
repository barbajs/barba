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

  try {
    await manager.doAppear({});
  } catch (e) {
    expect(e).toEqual(new Error('No transition found'));
  }
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

  await manager.doAppear({ transition: { appear() {} }, data });

  expect(hooks.do).toHaveBeenCalledTimes(3);
  expect(hooks.do).toHaveBeenNthCalledWith(1, 'beforeAppear', data);
  expect(hooks.do).toHaveBeenNthCalledWith(2, 'appear', data);
  expect(hooks.do).toHaveBeenNthCalledWith(3, 'afterAppear', data);
});

it('catches error', async () => {
  expect.assertions(3);

  const appearError = () => {
    throw new Error('test');
  };

  try {
    await manager.doAppear({
      transition: { appear: appearError, appearCanceled },
      data,
    });
  } catch (e) {
    expect(e).toEqual(new Error('Transition error'));
    expect(hooks.do).toHaveBeenLastCalledWith('appearCanceled', data);
    expect(appearCanceled).toHaveBeenCalledTimes(1);
  }
});
