import { Logger } from '../../../src/modules/Logger';
import { Store } from '../../../src/modules/Store';
import { schemaPage } from '../../../src/schemas/page';

it('has debug info', () => {
  const store = new Store([]);
  Logger.setLevel('info');

  store.logger.info = jest.fn();
  store.resolve({
    current: schemaPage,
    next: schemaPage,
    trigger: 'barba',
  });

  expect(store.logger.info).toHaveBeenCalledTimes(1);
});
