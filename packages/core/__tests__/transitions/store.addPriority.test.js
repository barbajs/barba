import { store } from '../../src/modules';

const rules = [{ name: 'tens' }, { name: 'hundreds' }];

store._rules = rules;

it('add priority 0', () => {
  expect(store._addPriority({}).priority).toBe(0);
});

it('add priority 10', () => {
  expect(store._addPriority({ tens: true }).priority).toBe(10);
});

it('add priority 11', () => {
  expect(store._addPriority({ from: { tens: true } }).priority).toBe(11);
});

it('add priority 12', () => {
  expect(store._addPriority({ to: { tens: true } }).priority).toBe(12);
});

it('add priority 13', () => {
  expect(
    store._addPriority({ from: { tens: true }, to: { tens: true } }).priority
  ).toBe(13);
});

it('add priority 100', () => {
  expect(store._addPriority({ hundreds: true }).priority).toBe(100);
});

it('add priority 101', () => {
  expect(store._addPriority({ from: { hundreds: true } }).priority).toBe(101);
});

it('add priority 102', () => {
  expect(store._addPriority({ to: { hundreds: true } }).priority).toBe(102);
});

it('add priority 103', () => {
  expect(
    store._addPriority({ from: { hundreds: true }, to: { hundreds: true } })
      .priority
  ).toBe(103);
});

it('add priority 110', () => {
  expect(store._addPriority({ tens: true, hundreds: true }).priority).toBe(110);
});

it('add priority 112', () => {
  expect(
    store._addPriority({ from: { tens: true, hundreds: true } }).priority
  ).toBe(112);
});

it('add priority 114', () => {
  expect(
    store._addPriority({ to: { tens: true, hundreds: true } }).priority
  ).toBe(114);
});

it('add priority 116', () => {
  expect(
    store._addPriority({
      from: { tens: true, hundreds: true },
      to: { tens: true, hundreds: true },
    }).priority
  ).toBe(116);
});
