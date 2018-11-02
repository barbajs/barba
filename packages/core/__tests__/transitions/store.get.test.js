import { store } from '../../src/transitions';

store.init([], true);

it('has debug info', () => {
  console.info = jest.fn();
  store.get({
    current: true,
    next: true,
  });

  expect(console.info).toHaveBeenCalledTimes(1);
});
