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
 * @param {object} page page
 * @param {string} direction from|to
 * @returns {undefined}
 */
function runStrings(transition, rule, page, direction) {
  const fail = store.check(transition, rule, {}, match, direction);

  expect(fail).toBeFalsy();
  expect(match).toMatchObject({});

  const ok = store.check(transition, rule, page, match, direction);

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
  const page = { namespace: 'ns' };

  runStrings(transition, rule, page);
});

it('check single "strings" with "from"', () => {
  const transition = { from: { namespace: 'ns' } };
  const [rule] = store.rules.filter(rule => rule.name === 'namespace');
  const page = { namespace: 'ns' };

  runStrings(transition, rule, page, 'from');
});

it('check single "strings" with "to"', () => {
  const transition = { to: { namespace: 'ns' } };
  const [rule] = store.rules.filter(rule => rule.name === 'namespace');
  const page = { namespace: 'ns' };

  runStrings(transition, rule, page, 'to');
});

it('check array "strings"', () => {
  const transition = { namespace: ['ns'] };
  const [rule] = store.rules.filter(rule => rule.name === 'namespace');
  const page = { namespace: 'ns' };

  runStrings(transition, rule, page);
});

it('check array "strings" with "from"', () => {
  const transition = { from: { namespace: ['ns'] } };
  const [rule] = store.rules.filter(rule => rule.name === 'namespace');
  const page = { namespace: 'ns' };

  runStrings(transition, rule, page, 'from');
});

it('check array "strings" with "to"', () => {
  const transition = { to: { namespace: ['ns'] } };
  const [rule] = store.rules.filter(rule => rule.name === 'namespace');
  const page = { namespace: 'ns' };

  runStrings(transition, rule, page, 'to');
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
