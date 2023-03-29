import { history } from '../../src/utils/history';

const first = {
  ns: 'ns1',
  scroll: {
    x: 0,
    y: 0,
  },
  url: 'url1',
};
const second = {
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

const e = {
  state: {
    index: 1,
  },
} as PopStateEvent;

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
  history.change(second.url, 'barba');

  expect(history.current).toEqual(tmp);
  expect(history.previous).toEqual(first);
});

it('pushes history', () => {
  history.change(first.url, triggerPush);
  history.change(second.url, triggerReplace);
  history.change(second.url, 'popstate', e);

  expect(h.ps).toHaveBeenCalledTimes(1);
});

it('replaces history', () => {
  history.change(first.url, triggerReplace);
  history.change(second.url, triggerPush);
  history.change(second.url, 'popstate', e);

  expect(h.rs).toHaveBeenCalledTimes(1);
});

it('removes state', () => {
  history.init(first.url, first.ns);
  history.change(second.url, 'barba');
  history.remove();

  expect(history.current).toEqual(first);
  expect(history.previous).toBeNull();

  history.change(second.url, 'barba');
  history.remove(1);

  expect(history.current).toEqual(first);
  expect(history.previous).toBeNull();
});

it('gets state(s)', () => {
  history.init(first.url, first.ns);
  history.change(second.url, 'barba');
  const state1 = history.get(0);
  const state2 = history.get(1);
  const state = history.current;

  expect(state1).toEqual(first);
  expect(state2).toEqual(tmp);
  expect(state).toEqual(tmp);
});

it('gets directions', () => {
  history.init(first.url, first.ns);
  history.change(second.url, 'barba');

  const back = history.change(first.url, 'popstate', {
    state: { index: 0 },
  } as PopStateEvent);
  expect(back).toEqual('back');

  const forward = history.change(second.url, 'popstate', {
    state: { index: 1 },
  } as PopStateEvent);
  expect(forward).toEqual('forward');

  const prev = history.change(second.url, 'popstate', {
    state: { index: 6 },
  } as PopStateEvent);
  expect(prev).toEqual('back');

  const next = history.change(second.url, 'popstate', {
    state: { index: 0 },
  } as PopStateEvent);
  expect(next).toEqual('forward');
});

it('manage history with "unknown" state', async () => {
  history.change(second.url, 'barba');

  expect(h.rs).toHaveBeenCalledTimes(0);
  expect(h.ps).toHaveBeenCalledTimes(1);
});

it('manage history with previous state', async () => {
  history.change(second.url, 'popstate', e);

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
