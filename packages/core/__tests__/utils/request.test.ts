import xhrMock from 'xhr-mock';
import { init } from '../../__mocks__/barba';
import barba from '../../src';
import { IResponse, IUrlFull } from '../../src/defs';
import { request } from '../../src/utils';
import { parse } from '../../src/utils/url';

init();

(global as any).Headers = class {};
(global as any).window.clearTimeout = jest.fn();
const requestError = jest.fn();
const url = 'url';
const content = 'content';
const response = {
  html: content,
  url: {
    href: url,
    ...parse(url)
  } as IUrlFull,
} as IResponse;

beforeEach(() => {
  xhrMock.setup();
});
afterEach(() => {
  delete (global as any).navigator.connection;
  xhrMock.teardown();
});

it('set correct headers', async () => {
  expect.assertions(2);

  xhrMock.get(url, (req, res) => {
    expect(req.header('Accept')).toEqual(
      'text/html,application/xhtml+xml,application/xml'
    );
    expect(req.header('x-barba')).toEqual('yes');

    return res.status(200);
  });

  await request(url, 2e3, requestError, barba.cache, barba.headers);
});

it('set custom request headers', async () => {
  barba.headers.set('x-custom-header', 'custom-value');

  xhrMock.get(url, (req, res) => {
    expect(req.header('x-custom-header')).toEqual('custom-value');

    return res.status(200);
  });

  await request(url, 2e3, requestError, barba.cache, barba.headers);
});

it('throws fetch error', async () => {
  const error = new Error('Fetch error');

  xhrMock.get(url, () => Promise.reject(error));
  xhrMock.error(() => {}); // tslint:disable-line:no-empty

  await expect(request(url, 2e3, requestError, barba.cache, barba.headers)).rejects.toEqual(error);
  expect(requestError).toHaveBeenCalledWith(url, error);
  expect(barba.cache.getStatus(url)).toEqual('rejected');
});

it('throws result error with 404', async () => {
  const error = {
    status: 404,
    statusText: 'Not found',
  };

  xhrMock.get(url, (req, res) => res.status(404).reason('Not found'));

  await expect(request(url, 2e3, requestError, barba.cache, barba.headers)).rejects.toEqual(error);
  expect(requestError).toHaveBeenCalledWith(url, error);
  expect(barba.cache.getStatus(url)).toEqual('rejected');
});

it('throws timeout error', async () => {
  const error = new Error('Timeout error [100]');

  xhrMock.get(url, () => new Promise(() => {})); // tslint:disable-line:no-empty

  await expect(request(url, 100, requestError, barba.cache, barba.headers)).rejects.toEqual(error);
  expect(requestError).toHaveBeenCalledWith(url, error);
  expect(barba.cache.getStatus(url)).toEqual('rejected');
}, 1000);

it('fetch text content', async () => {
  xhrMock.get(url, (req, res) => res.status(200).body(content));

  await expect(request(url, undefined, requestError, barba.cache, barba.headers)).resolves.toStrictEqual(response);
  // expect((global as any).window.clearTimeout).toHaveBeenCalledTimes(1);
  expect(requestError).not.toHaveBeenCalled();
  expect(barba.cache.getStatus(url)).toEqual('fulfilled');
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
