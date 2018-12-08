import { addPriority } from '../../src/transitions/utils';

const rules = [{ name: 'tens' }, { name: 'hundreds' }];

it('add priority 0', () => {
  expect(addPriority(rules)({}).priority).toBe(0);
});

it('add priority 10', () => {
  expect(addPriority(rules)({ tens: true }).priority).toBe(10);
});

it('add priority 11', () => {
  expect(addPriority(rules)({ from: { tens: true } }).priority).toBe(11);
});

it('add priority 12', () => {
  expect(addPriority(rules)({ to: { tens: true } }).priority).toBe(12);
});

it('add priority 13', () => {
  expect(
    addPriority(rules)({ from: { tens: true }, to: { tens: true } }).priority
  ).toBe(13);
});

it('add priority 100', () => {
  expect(addPriority(rules)({ hundreds: true }).priority).toBe(100);
});

it('add priority 101', () => {
  expect(addPriority(rules)({ from: { hundreds: true } }).priority).toBe(101);
});

it('add priority 102', () => {
  expect(addPriority(rules)({ to: { hundreds: true } }).priority).toBe(102);
});

it('add priority 103', () => {
  expect(
    addPriority(rules)({ from: { hundreds: true }, to: { hundreds: true } })
      .priority
  ).toBe(103);
});

it('add priority 110', () => {
  expect(addPriority(rules)({ tens: true, hundreds: true }).priority).toBe(110);
});

it('add priority 112', () => {
  expect(
    addPriority(rules)({ from: { tens: true, hundreds: true } }).priority
  ).toBe(112);
});

it('add priority 114', () => {
  expect(
    addPriority(rules)({ to: { tens: true, hundreds: true } }).priority
  ).toBe(114);
});

it('add priority 116', () => {
  expect(
    addPriority(rules)({
      from: { tens: true, hundreds: true },
      to: { tens: true, hundreds: true },
    }).priority
  ).toBe(116);
});
