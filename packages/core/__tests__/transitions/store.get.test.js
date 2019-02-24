import { store } from '../../src/modules';

store.init([], true);

it('has debug info', () => {
  store._logger.info = jest.fn();
  store.get({
    current: true,
    next: true,
  });

  expect(store._logger.info).toHaveBeenCalledTimes(1);
});
