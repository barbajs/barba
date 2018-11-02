import request from '../src/request';

global.Headers = class {};

// DEV
// it('pass', () => {
//   expect(true).toBeTruthy();
// });

// it('example', async () => {
//   async function check() {
//     throw new Error('fetch error');
//   }

//   await expect(check()).rejects.toEqual(new Error('fetch error'));
// });

it('throw fetch error', async () => {
  global.window.clearTimeout = jest.fn();
  global.fetch = jest.fn().mockImplementation(() => {
    throw new Error('Fetch error');
  });

  await expect(request()).rejects.toEqual(new Error('Fetch error'));
  expect(global.window.clearTimeout).toHaveBeenCalledTimes(1);
});

it('throw result error with "status"', async () => {
  global.window.clearTimeout = jest.fn();
  global.fetch = jest.fn().mockImplementation(() => ({
    status: 404,
  }));

  await expect(request()).rejects.toEqual(new Error(404));
  expect(global.window.clearTimeout).toHaveBeenCalledTimes(1);
});

it('throw result error with "statusText"', async () => {
  global.window.clearTimeout = jest.fn();
  window.fetch = jest.fn().mockImplementation(() => ({
    status: 404,
    statusText: 'Not found',
  }));

  await expect(request()).rejects.toEqual(new Error('Not found'));
  expect(global.window.clearTimeout).toHaveBeenCalledTimes(1);
});

it(
  'throw timeout error',
  async () => {
    global.window.clearTimeout = jest.fn();
    window.fetch = jest.fn().mockImplementation(
      () =>
        new Promise(resolve => {
          setTimeout(() => {
            resolve();
          }, 8000);
        })
    );

    await expect(request()).rejects.toEqual(new Error('Timeout error'));
  },
  10000
);

it('fetch text content', async () => {
  global.window.clearTimeout = jest.fn();
  window.fetch = jest.fn().mockImplementation(() => ({
    status: 200,
    text: () => Promise.resolve('content'),
  }));

  await expect(request()).resolves.toBe('content');
  expect(global.window.clearTimeout).toHaveBeenCalledTimes(1);
});
