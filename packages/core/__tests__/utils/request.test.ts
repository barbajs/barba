import { request } from '../../src/utils';

(global as any).Headers = class {};
(global as any).window.clearTimeout = jest.fn();
const requestError = jest.fn();
const url = 'url';

afterEach(() => {
  delete (global as any).navigator.connection;
});

// it('throws bad connection error', async () => {
//   const error = new Error('Bad connection or reduced data usage mode');

//   global.navigator.connection = {
//     effectiveType: '2g',
//     saveData: false,
//   };

//   await expect(request(url, 2e3, requestError)).rejects.toEqual(error);
// });

// it('throws reduced data error', async () => {
//   const error = new Error('Bad connection or reduced data usage mode');

//   global.navigator.connection = {
//     effectiveType: '3g',
//     saveData: true,
//   };

//   await expect(request(url, 2e3, requestError)).rejects.toEqual(error);
// });

it('throws fetch error', async () => {
  const error = new Error('Fetch error');

  self.fetch = jest.fn().mockImplementation(() => {
    throw error;
  });

  await expect(request(url, 5e3, requestError)).rejects.toEqual(error);
  expect((global as any).window.clearTimeout).toHaveBeenCalledTimes(1);
  expect(requestError).toHaveBeenCalledWith(url, error);
});

it('throws result error with 404', async () => {
  const error = {
    status: 404,
    statusText: 'Not found',
  };

  window.fetch = jest.fn().mockImplementation(() => error);

  await expect(request(url, 2e3, requestError)).rejects.toEqual(error);
  expect((global as any).window.clearTimeout).toHaveBeenCalledTimes(1);
  expect(requestError).toHaveBeenCalledWith(url, error);
});

it('throws timeout error', async () => {
  const error = new Error('Timeout error');

  window.fetch = jest.fn().mockImplementation(
    () =>
      new Promise(resolve => {
        setTimeout(() => {
          resolve();
        }, 200);
      })
  );

  await expect(request(url, 1, requestError)).rejects.toEqual(error);
  expect(requestError).toHaveBeenCalledWith(url, error);
}, 1000);

it('fetch text content', async () => {
  window.fetch = jest.fn().mockImplementation(() => ({
    status: 200,
    text: () => Promise.resolve('content'),
  }));

  await expect(request(url, undefined, requestError)).resolves.toBe('content');
  expect((global as any).window.clearTimeout).toHaveBeenCalledTimes(1);
  expect(requestError).not.toHaveBeenCalled();
});
