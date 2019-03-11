import { Store } from '../../../src/modules/Store';
import { schemaPage } from '../../../src/schemas/page';
import { TransitionPage, TransitionData, Rule } from '../../../src/defs';

let match = {};
const store = new Store();
const mockData: TransitionData = {
  current: schemaPage,
  next: schemaPage,
  trigger: 'barba',
};

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
 */
function runStrings(
  transition: TransitionPage,
  rule: Rule,
  data: TransitionData,
  direction?: 'from' | 'to'
) {
  const fail = store['_check'](transition, rule, mockData, match, direction);

  expect(fail).toBeFalsy();
  expect(match).toMatchObject({});

  const ok = store['_check'](transition, rule, data, match, direction);

  expect(ok).toBeTruthy();
  expect(match).toMatchObject(transition);
}

/**
 * Run "function" check test
 */
function runFunction(
  falsy: TransitionPage,
  truthy: TransitionPage,
  rule: Rule,
  direction?: 'from' | 'to'
) {
  const fail = store['_check'](falsy, rule, mockData, match, direction);

  expect(fail).toBeFalsy();
  expect(match).toMatchObject({});

  const ok = store['_check'](truthy, rule, mockData, match, direction);

  expect(ok).toBeTruthy();
  expect(match).toMatchObject(truthy);
}

// "strings" type

it('check inexisting "strings"', () => {
  const [rule] = store['_rules'].filter(rule => rule.name === 'namespace');
  const expected = store['_check'](
    {},
    rule,
    ({ namespace: 'ns' } as unknown) as TransitionData,
    match
  );

  expect(expected).toBeTruthy();
  expect(match).toMatchObject({});
});

it('check single "strings"', () => {
  const transition = { namespace: 'ns' };
  const [rule] = store['_rules'].filter(rule => rule.name === 'namespace');
  const data = { current: { namespace: 'ns' } };

  runStrings(transition, rule, (data as unknown) as TransitionData);
});

it('check single "strings" with "from"', () => {
  const transition = { from: { namespace: 'ns' } };
  const [rule] = store['_rules'].filter(rule => rule.name === 'namespace');
  const data = { current: { namespace: 'ns' } };

  runStrings(transition, rule, (data as unknown) as TransitionData, 'from');
});

it('check single "strings" with "to"', () => {
  const transition = { to: { namespace: 'ns' } };
  const [rule] = store['_rules'].filter(rule => rule.name === 'namespace');
  const data = { next: { namespace: 'ns' } };

  runStrings(transition, rule, (data as unknown) as TransitionData, 'to');
});

it('check array "strings"', () => {
  const transition = { namespace: ['ns'] };
  const [rule] = store['_rules'].filter(rule => rule.name === 'namespace');
  const data = { current: { namespace: 'ns' } };

  runStrings(transition, rule, (data as unknown) as TransitionData);
});

it('check array "strings" with "from"', () => {
  const transition = { from: { namespace: ['ns'] } };
  const [rule] = store['_rules'].filter(rule => rule.name === 'namespace');
  const data = { current: { namespace: 'ns' } };

  runStrings(transition, rule, (data as unknown) as TransitionData, 'from');
});

it('check array "strings" with "to"', () => {
  const transition = { to: { namespace: ['ns'] } };
  const [rule] = store['_rules'].filter(rule => rule.name === 'namespace');
  const data = { next: { namespace: 'ns' } };

  runStrings(transition, rule, (data as unknown) as TransitionData, 'to');
});

// "function" type

it('check inexisting "function"', () => {
  const [rule] = store['_rules'].filter(rule => rule.name === 'custom');
  const expected = store['_check'](
    {},
    rule,
    ({} as unknown) as TransitionData,
    match
  );

  expect(expected).toBeTruthy();
  expect(match).toMatchObject({});
});

it('check "function"', () => {
  const falsy = { custom: () => false };
  const truthy = { custom: () => true };
  const [rule] = store['_rules'].filter(rule => rule.name === 'custom');

  runFunction(falsy, truthy, rule);
});

it('check "function" with "from"', () => {
  const falsy = { from: { custom: () => false } };
  const truthy = { from: { custom: () => true } };
  const [rule] = store['_rules'].filter(rule => rule.name === 'custom');

  runFunction(falsy, truthy, rule, 'from');
});

it('check "function" with "to"', () => {
  const falsy = { to: { custom: () => false } };
  const truthy = { to: { custom: () => true } };
  const [rule] = store['_rules'].filter(rule => rule.name === 'custom');

  runFunction(falsy, truthy, rule, 'to');
});
