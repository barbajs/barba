import waitForExpect from 'wait-for-expect';
import xhrMock from 'xhr-mock';
import { init } from '../../__mocks__/barba';
import barba from '../../src';

init();

// Mocks
let spySet: jest.SpyInstance;

beforeEach(() => {
  spySet = jest.spyOn(barba.cache, 'set');
  xhrMock.setup();
  xhrMock.error(() => {}); // tslint:disable-line:no-empty
});
afterEach(() => {
  spySet.mockRestore();
  xhrMock.teardown();
});

it('prefetch url', () => {
  const url = 'http://localhost/foo.html';

  barba.prefetch(url);

  expect(spySet).toHaveBeenCalledWith(url, Promise.resolve(), 'prefetch', 'pending');
});

it('prefetch wrong url', async () => {
  const url = 'http://localhost/bad';

  barba.logger.error = jest.fn();
  xhrMock.get(url, (req, res) => res.status(500));
  xhrMock.error(() => {}); // tslint:disable-line:no-empty

  barba.prefetch(url);

  expect(spySet).toHaveBeenCalledTimes(1);
  await waitForExpect(() => {
    expect(barba.logger.error).toHaveBeenCalledTimes(1);
  });
});
