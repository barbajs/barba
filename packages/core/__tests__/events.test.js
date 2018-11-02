import events from '../src/events';

const name = 'my-event';
const arg = 'arg';
/* eslint-disable no-empty-function */
const cb = () => {};
const cb2 = () => {};
/* eslint-enable no-empty-function */

afterEach(() => {
  events.events = {};
});

it('has events ', () => {
  expect(events.events).toEqual({});
});

it('add event', () => {
  events.on(name, cb);

  expect(events.events[name]).toHaveLength(1);
  expect(events.events[name][0]).toBe(cb);
});

it('add event with different callbacks', () => {
  events.on(name, cb);
  events.on(name, cb2);

  expect(events.events[name]).toHaveLength(2);
  expect(events.events[name][0]).toBe(cb);
  expect(events.events[name][1]).toBe(cb2);
});

it('remove nothing with inexisting event', () => {
  const off = jest.fn((e, f) => events.off(e, f));

  off('unknown', cb);

  expect(off).toHaveReturnedWith(undefined);
});

it('remove event', () => {
  events.on(name, cb);
  events.off(name, cb);

  expect(events.events[name]).toHaveLength(0);
});

it('trigger nothing with inexisting event', () => {
  const trigger = jest.fn((e, f) => events.trigger(e, f));

  trigger('unknown', cb);

  expect(trigger).toHaveReturnedWith(undefined);
});

it('trigger event', done => {
  // eslint-disable-next-line require-jsdoc
  function cb(...args) {
    expect(args).toEqual([arg]);
    done();
  }
  events.on(name, cb);
  events.trigger(name, arg);
});

it('handle event once', done => {
  // eslint-disable-next-line require-jsdoc
  function cb(...args) {
    expect(args).toEqual([arg]);
    done();
  }
  events.once(name, cb);

  expect(events.events[name]).toHaveLength(1);

  events.trigger(name, arg);

  expect(events.events[name]).toHaveLength(0);
});
