import { history } from '../../src/utils/history';

const first = {
  index: 0,
  ns: 'ns1',
  scroll: {
    x: 0,
    y: 0,
  },
  url: 'url1',
};
const second = {
  index: 1,
  ns: 'ns2',
  scroll: {
    x: 0,
    y: 0,
  },
  url: 'url2',
};
const tmp = {
  ...second,
  ns: 'tmp',
};
const triggerPush = document.createElement('a');
const triggerReplace = document.createElement('a');

triggerReplace.dataset.barbaHistory = 'replace';

const h = {
  b: (global as any).window.history.back = jest.fn(),
  ps: (global as any).window.history.pushState = jest.fn(),
  rs: (global as any).window.history.replaceState = jest.fn(),
};

afterEach(() => {
  history.clear();
});

it('has no history ', () => {
  expect(history.current).toBeUndefined();
});

it('init state and has current', () => {
  history.init(first.url, first.ns);

  expect(history.current).toEqual(first);
  expect(history.previous).toBeNull();
  expect(h.rs).toHaveBeenCalledTimes(1);
});

it('adds state and has previous', () => {
  history.init(first.url, first.ns);
  history.add(second.url, 'barba');

  expect(history.current).toEqual(tmp);
  expect(history.previous).toEqual(first);
});

it('pushes history', () => {
  history.add(first.url, triggerPush);
  history.add(second.url, triggerReplace);
  history.add(second.url, 'popstate');

  expect(h.ps).toHaveBeenCalledTimes(1);
});

it('replaces history', () => {
  history.add(first.url, triggerReplace);
  history.add(second.url, triggerPush);
  history.add(second.url, 'popstate');

  expect(h.rs).toHaveBeenCalledTimes(1);
});

it('removes state', () => {
  history.init(first.url, first.ns);
  history.add(second.url, 'barba');
  history.remove();

  expect(history.current).toEqual(first);
  expect(history.previous).toBeNull();
});

it('gets state', () => {
  history.init(first.url, first.ns);
  history.add(second.url, 'barba');
  const state1 = history.get(0);
  const state2 = history.get(1);

  expect(state1).toEqual(first);
  expect(state2).toEqual(tmp);
});

it('gets directions', () => {
  history.init(first.url, first.ns);
  history.add(second.url, 'barba');

  const back = history.getDirection(0);
  const forward = history.getDirection(2);

  expect(back).toEqual('back');
  expect(forward).toEqual('forward');
});

it('cancels', () => {
  history.remove = jest.fn();

  history.cancel();

  expect(history.remove).toHaveBeenCalledTimes(1);
  expect(h.b).toHaveBeenCalledTimes(1);
});

it('manage history with "unknown" state', async () => {
  history.add(second.url, 'barba');

  expect(h.rs).toHaveBeenCalledTimes(0);
  expect(h.ps).toHaveBeenCalledTimes(1);
});

it('manage history with previous state', async () => {
  history.add(second.url, 'popstate');

  expect(h.ps).toHaveBeenCalledTimes(0);
  expect(h.rs).toHaveBeenCalledTimes(0);
});

it('manage history with data-barba-history="replace"', async () => {
  const link = document.createElement('a');

  link.dataset.barbaHistory = 'replace';

  history.add(second.url, link);

  expect(h.ps).toHaveBeenCalledTimes(0);
  expect(h.rs).toHaveBeenCalledTimes(1);
});
