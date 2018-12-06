import { store } from '../../src/transitions';

let match = {};

beforeEach(() => {
  match = {};
});

/**
 * Check rules
 *
 * Based on rule type: strings | function
 * 1. transition has no rule "property":
 *    - always returns true
 * 2. transition has rule "property":
 *     - "strings" should be present on both side (transition + view) and match
 *     - "function" should return true
 */

/**
 * Run "strings" check test
 *
 * @param {object} transition transition
 * @param {object} rule rule
 * @param {object} data current + next + trigger
 * @param {string} direction from|to
 * @returns {undefined}
 */
function runStrings(transition, rule, data, direction) {
  const fail = store.check(
    transition,
    rule,
    { current: {}, next: {} },
    match,
    direction
  );

  expect(fail).toBeFalsy();
  expect(match).toMatchObject({});

  const ok = store.check(transition, rule, data, match, direction);

  expect(ok).toBeTruthy();
  expect(match).toMatchObject(transition);
}

/**
 * Run "function" check test
 *
 * @param {function} falsy falsy transition function
 * @param {function} truthy truthy transition function
 * @param {object} rule rule
 * @param {string} direction from|to
 * @returns {undefined}
 */
function runFunction(falsy, truthy, rule, direction) {
  const fail = store.check(falsy, rule, {}, match, direction);

  expect(fail).toBeFalsy();
  expect(match).toMatchObject({});

  const ok = store.check(truthy, rule, {}, match, direction);

  expect(ok).toBeTruthy();
  expect(match).toMatchObject(truthy);
}

// "strings" type

it('check inexisting "strings"', () => {
  const [rule] = store.rules.filter(rule => rule.name === 'namespace');
  const expected = store.check({}, rule, { namespace: 'ns' }, match);

  expect(expected).toBeTruthy();
  expect(match).toMatchObject({});
});

it('check single "strings"', () => {
  const transition = { namespace: 'ns' };
  const [rule] = store.rules.filter(rule => rule.name === 'namespace');
  const data = { current: { namespace: 'ns' } };

  runStrings(transition, rule, data);
});

it('check single "strings" with "from"', () => {
  const transition = { from: { namespace: 'ns' } };
  const [rule] = store.rules.filter(rule => rule.name === 'namespace');
  const data = { current: { namespace: 'ns' } };

  runStrings(transition, rule, data, 'from');
});

it('check single "strings" with "to"', () => {
  const transition = { to: { namespace: 'ns' } };
  const [rule] = store.rules.filter(rule => rule.name === 'namespace');
  const data = { next: { namespace: 'ns' } };

  runStrings(transition, rule, data, 'to');
});

it('check array "strings"', () => {
  const transition = { namespace: ['ns'] };
  const [rule] = store.rules.filter(rule => rule.name === 'namespace');
  const data = { current: { namespace: 'ns' } };

  runStrings(transition, rule, data);
});

it('check array "strings" with "from"', () => {
  const transition = { from: { namespace: ['ns'] } };
  const [rule] = store.rules.filter(rule => rule.name === 'namespace');
  const data = { current: { namespace: 'ns' } };

  runStrings(transition, rule, data, 'from');
});

it('check array "strings" with "to"', () => {
  const transition = { to: { namespace: ['ns'] } };
  const [rule] = store.rules.filter(rule => rule.name === 'namespace');
  const data = { next: { namespace: 'ns' } };

  runStrings(transition, rule, data, 'to');
});

// "function" type

it('check inexisting "function"', () => {
  const [rule] = store.rules.filter(rule => rule.name === 'custom');
  const expected = store.check({}, rule, {}, match);

  expect(expected).toBeTruthy();
  expect(match).toMatchObject({});
});

it('check "function"', () => {
  const falsy = { custom: () => false };
  const truthy = { custom: () => true };
  const [rule] = store.rules.filter(rule => rule.name === 'custom');

  runFunction(falsy, truthy, rule);
});

it('check "function" with "from"', () => {
  const falsy = { from: { custom: () => false } };
  const truthy = { from: { custom: () => true } };
  const [rule] = store.rules.filter(rule => rule.name === 'custom');

  runFunction(falsy, truthy, rule, 'from');
});

it('check "function" with "to"', () => {
  const falsy = { to: { custom: () => false } };
  const truthy = { to: { custom: () => true } };
  const [rule] = store.rules.filter(rule => rule.name === 'custom');

  runFunction(falsy, truthy, rule, 'to');
});
