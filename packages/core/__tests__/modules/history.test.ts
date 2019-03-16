import { History } from '../../src/modules/History';

const history = new History();

const first = {
  ns: 'ns1',
  url: 'url1',
};
const second = {
  ns: 'ns2',
  url: 'url2',
};

it('has no history ', () => {
  expect(history.current).toBeUndefined();
});

it('adds state and gets current', () => {
  history.add(first.url, first.ns);

  expect(history.current).toEqual(first);
  expect(history.previous).toBeNull();
});

it('adds state and gets previous', () => {
  history.add(second.url, second.ns);

  expect(history.current).toEqual(second);
  expect(history.previous).toEqual(first);
});

it('removes state', () => {
  history.remove();

  expect(history.current).toEqual(first);
  expect(history.previous).toBeNull();
});

it('pushes url', () => {
  history.add = jest.fn();
  (global as any).window.history.pushState = jest.fn();

  history.push(second.url, second.ns);

  expect(history.add).toHaveBeenCalledTimes(1);
  expect((global as any).window.history.pushState).toHaveBeenCalledTimes(1);
});

it('cancels', () => {
  history.remove = jest.fn();
  (global as any).window.history.back = jest.fn();

  history.cancel();

  expect(history.remove).toHaveBeenCalledTimes(1);
  expect((global as any).window.history.back).toHaveBeenCalledTimes(1);
});
