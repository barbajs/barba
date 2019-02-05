import { store } from '../../src/transitions';

store.init([], true);

it('has debug info', () => {
  console.debug = jest.fn();
  store.get({
    current: true,
    next: true,
  });

  expect(console.debug).toHaveBeenCalledTimes(1);
});
