import { history } from '../src/modules';

const first = {
  url: 'url1',
  namespace: 'namespace1',
};
const second = {
  url: 'url2',
};

it('has history ', () => {
  expect(history._history).toBeDefined();
});

it('adds status', () => {
  history.add(first.url, first.namespace);

  expect(history._history).toHaveLength(1);
});

it('has current status', () => {
  expect(history.current()).toEqual(first);
  expect(history.previous()).toBeNull();
});

it('has previous status', () => {
  history.add(second.url, second.namespace);

  expect(history.current()).toEqual(second);
  expect(history.previous()).toEqual(first);
});

it('removes status', () => {
  history.remove();

  expect(history.current()).toEqual(first);
  expect(history.previous()).toBeNull();
});

it('goes to url', () => {
  history.add = jest.fn();
  global.window.history.pushState = jest.fn();

  history.go(second.url, second.namespace);

  expect(history.add).toHaveBeenCalledTimes(1);
  expect(global.window.history.pushState).toHaveBeenCalledTimes(1);
});

it('cancels', () => {
  history.remove = jest.fn();
  global.window.history.back = jest.fn();

  history.cancel();

  expect(history.remove).toHaveBeenCalledTimes(1);
  expect(global.window.history.back).toHaveBeenCalledTimes(1);
});
