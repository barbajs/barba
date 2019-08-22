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

afterEach(() => {
  history.clear();
});

it('has no history ', () => {
  expect(history.current).toBeUndefined();
});

it('init state and has current', () => {
  (global as any).window.history.replaceState = jest.fn();
  history.init(first.url, first.ns);

  expect(history.current).toEqual(first);
  expect(history.previous).toBeNull();
  expect((global as any).window.history.replaceState).toHaveBeenCalledTimes(1);
});

it('adds state and has previous', () => {
  history.init(first.url, first.ns);
  history.add(second.url, second.ns);

  expect(history.current).toEqual(second);
  expect(history.previous).toEqual(first);
});

it('pushes history', () => {
  (global as any).window.history.pushState = jest.fn();
  history.add(first.url, first.ns);
  history.add(second.url, second.ns, null, false);

  expect((global as any).window.history.pushState).toHaveBeenCalledTimes(1);
});

it('removes state', () => {
  history.init(first.url, first.ns);
  history.add(second.url, second.ns);
  history.remove();

  expect(history.current).toEqual(first);
  expect(history.previous).toBeNull();
});

it('gets state', () => {
  history.init(first.url, first.ns);
  history.add(second.url, second.ns);
  const state1 = history.get(0);
  const state2 = history.get(1);

  expect(state1).toEqual(first);
  expect(state2).toEqual(second);
});

it('gets directions', () => {
  history.init(first.url, first.ns);
  history.add(second.url, second.ns);

  const back = history.getDirection(0);
  const forward = history.getDirection(2);

  expect(back).toEqual('back');
  expect(forward).toEqual('forward');
});

it('cancels', () => {
  history.remove = jest.fn();
  (global as any).window.history.back = jest.fn();

  history.cancel();

  expect(history.remove).toHaveBeenCalledTimes(1);
  expect((global as any).window.history.back).toHaveBeenCalledTimes(1);
});
