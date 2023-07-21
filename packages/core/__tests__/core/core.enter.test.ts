import waitForExpect from 'wait-for-expect';
import xhrMock from 'xhr-mock';
import { init } from '../../__mocks__/barba';
import barba from '../../src';
import { parse } from '../../src/utils/url';
import { IUrlFull } from '../../src/defs';

const { link, span, mouseover } = init();

const sameUrl = 'http://localhost/';
const sameHtml = `<html>
<head>
  <title>Current page</title>
</head>
<body>
  <div data-barba="wrapper">
    <div data-barba="container" data-barba-namespace="current"></div>
  </div>
</body>
</html>`;

// Mocks
let spyHas: jest.SpyInstance;
let spySet: jest.SpyInstance;

beforeEach(() => {
  spyHas = jest.spyOn(barba.cache, 'has');
  spySet = jest.spyOn(barba.cache, 'set');
  xhrMock.setup();
  xhrMock.error(() => {}); // tslint:disable-line:no-empty
});
afterEach(() => {
  link.removeAttribute('data-barba-prevent');
  spyHas.mockRestore();
  spySet.mockRestore();
  xhrMock.teardown();
});

it('handle link enter', () => {
  link.href = 'foo';
  span.dispatchEvent(mouseover);

  expect(spyHas).toHaveBeenCalledTimes(1);
  expect(spySet).toHaveBeenCalledTimes(1);
});

it('handle link enter with same url', () => {
  barba.cache.set(sameUrl, Promise.resolve({
    url: {
      href: sameUrl,
      ...parse(sameUrl)
    } as IUrlFull,
    html: sameHtml
  }), 'init', 'pending');
  spySet.mockRestore();
  link.href = sameUrl;
  span.dispatchEvent(mouseover);

  expect(spyHas).toHaveBeenCalledTimes(1);
  expect(spySet).toHaveBeenCalledTimes(0);
});

it('handle bad request', async () => {
  barba.logger.error = jest.fn();
  xhrMock.get('http://localhost/bad', (req, res) => res.status(500));
  xhrMock.error(() => {}); // tslint:disable-line:no-empty
  link.href = 'bad';
  span.dispatchEvent(mouseover);

  expect(spyHas).toHaveBeenCalledTimes(1);
  expect(spySet).toHaveBeenCalledTimes(1);
  await waitForExpect(() => {
    expect(barba.logger.error).toHaveBeenCalledTimes(1);
  });
});

it('handle link enter with prevent link', () => {
  link.href = 'foo';
  link.dataset.barbaPrevent = '';
  span.dispatchEvent(mouseover);

  expect(spyHas).toHaveBeenCalledTimes(0);
  expect(spySet).toHaveBeenCalledTimes(0);
});

it('handle link enter with prevent url', () => {
  barba.destroy();
  barba.init({ prefetchIgnore: '/foo' });
  spyHas = jest.spyOn(barba.cache, 'has');
  spySet = jest.spyOn(barba.cache, 'set');

  link.href = '/foo';
  span.dispatchEvent(mouseover);

  expect(spyHas).toHaveBeenCalledTimes(0);
  expect(spySet).toHaveBeenCalledTimes(0);
});
