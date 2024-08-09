/* tslint:disable:no-string-literal */
import {
  IRule,
  ISchemaPage,
  ITransitionData,
  ITransitionPage,
} from '../../../src/defs';
import { Store } from '../../../src/modules/Store';
import { schemaPage } from '../../../src/schemas/page';

let match = {};
const store = new Store();

store.add('rule', {
  position: 1,
  value: {
    name: 'route',
    type: 'object',
  },
});

schemaPage.route = { name: '', params: {} };
const mockData: ITransitionData = {
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
 * Based on rule type: strings | object | function
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
  transition: ITransitionPage,
  rule: IRule,
  data: ITransitionData,
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
 * Run "object" check test
 */
function runObject(
  transition: ITransitionPage,
  rule: IRule,
  data: ITransitionData,
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
  falsy: ITransitionPage,
  truthy: ITransitionPage,
  rule: IRule,
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

it('check valid for inexisting rule "strings"', () => {
  const [rule] = store['_rules'].filter(r => r.name === 'namespace');
  const expected = store['_check'](
    {},
    rule,
    { namespace: 'ns' } as unknown as ITransitionData,
    match
  );

  expect(expected).toBeTruthy();
  expect(match).toMatchObject({});
});

it('check single "strings"', () => {
  const transition = { namespace: 'ns' };
  const [rule] = store['_rules'].filter(r => r.name === 'namespace');
  const data = { current: { namespace: 'ns' } };

  runStrings(transition, rule, data as unknown as ITransitionData);
});

it('check single "strings" with "from"', () => {
  const transition = { from: { namespace: 'ns' } };
  const [rule] = store['_rules'].filter(r => r.name === 'namespace');
  const data = { current: { namespace: 'ns' } };

  runStrings(transition, rule, data as unknown as ITransitionData, 'from');
});

it('check single "strings" with "to"', () => {
  const transition = { to: { namespace: 'ns' } };
  const [rule] = store['_rules'].filter(r => r.name === 'namespace');
  const data = { next: { namespace: 'ns' } };

  runStrings(transition, rule, data as unknown as ITransitionData, 'to');
});

it('check array "strings"', () => {
  const transition = { namespace: ['ns'] };
  const [rule] = store['_rules'].filter(r => r.name === 'namespace');
  const data = { current: { namespace: 'ns' } };

  runStrings(transition, rule, data as unknown as ITransitionData);
});

it('check array "strings" with "from"', () => {
  const transition = { from: { namespace: ['ns'] } };
  const [rule] = store['_rules'].filter(r => r.name === 'namespace');
  const data = { current: { namespace: 'ns' } };

  runStrings(transition, rule, data as unknown as ITransitionData, 'from');
});

it('check array "strings" with "to"', () => {
  const transition = { to: { namespace: ['ns'] } };
  const [rule] = store['_rules'].filter(r => r.name === 'namespace');
  const data = { next: { namespace: 'ns' } };

  runStrings(transition, rule, data as unknown as ITransitionData, 'to');
});

// "object" type
it('check valid for inexisting rule "object"', () => {
  const [rule] = store['_rules'].filter(r => r.name === 'route');
  const expected = store['_check'](
    {},
    rule,
    { route: 'r' } as unknown as ITransitionData,
    match
  );

  expect(expected).toBeTruthy();
  expect(match).toMatchObject({});
});

it('check invalid for non matching rule "object"', () => {
  const transition = { route: 'r' };
  const [rule] = store['_rules'].filter(r => r.name === 'route');
  const data = { current: { route: null } as ISchemaPage };
  const expected = store['_check'](
    transition,
    rule,
    data as unknown as ITransitionData,
    match
  );

  expect(expected).toBeFalsy();
  expect(match).toMatchObject({});
});

it('check single "object"', () => {
  const transition = { route: 'r' };
  const [rule] = store['_rules'].filter(r => r.name === 'route');
  const data = { current: { route: { name: 'r' } } };

  runObject(transition, rule, data as unknown as ITransitionData);
});

it('check single "object" with "from"', () => {
  const transition = { from: { route: 'r' } };
  const [rule] = store['_rules'].filter(r => r.name === 'route');
  const data = { current: { route: { name: 'r' } } };

  runObject(transition, rule, data as unknown as ITransitionData, 'from');
});

it('check single "object" with "to"', () => {
  const transition = { to: { route: 'r' } };
  const [rule] = store['_rules'].filter(r => r.name === 'route');
  const data = { next: { route: { name: 'r' } } };

  runObject(transition, rule, data as unknown as ITransitionData, 'to');
});

it('check array "object"', () => {
  const transition = { route: ['r'] };
  const [rule] = store['_rules'].filter(r => r.name === 'route');
  const data = { current: { route: { name: 'r' } } };

  runObject(transition, rule, data as unknown as ITransitionData);
});

it('check array "object" with "from"', () => {
  const transition = { from: { route: ['r'] } };
  const [rule] = store['_rules'].filter(r => r.name === 'route');
  const data = { current: { route: { name: 'r' } } };

  runObject(transition, rule, data as unknown as ITransitionData, 'from');
});

it('check array "object" with "to"', () => {
  const transition = { to: { route: ['r'] } };
  const [rule] = store['_rules'].filter(r => r.name === 'route');
  const data = { next: { route: { name: 'r' } } };

  runObject(transition, rule, data as unknown as ITransitionData, 'to');
});

// "function" type

it('check valid for inexisting rule "function"', () => {
  const [rule] = store['_rules'].filter(r => r.name === 'custom');
  const expected = store['_check'](
    {},
    rule,
    {} as unknown as ITransitionData,
    match
  );

  expect(expected).toBeTruthy();
  expect(match).toMatchObject({});
});

it('check "function"', () => {
  const falsy = { custom: () => false };
  const truthy = { custom: () => true };
  const [rule] = store['_rules'].filter(r => r.name === 'custom');

  runFunction(falsy, truthy, rule);
});

it('check "function" with "from"', () => {
  const falsy = { from: { custom: () => false } };
  const truthy = { from: { custom: () => true } };
  const [rule] = store['_rules'].filter(r => r.name === 'custom');

  runFunction(falsy, truthy, rule, 'from');
});

it('check "function" with "to"', () => {
  const falsy = { to: { custom: () => false } };
  const truthy = { to: { custom: () => true } };
  const [rule] = store['_rules'].filter(r => r.name === 'custom');

  runFunction(falsy, truthy, rule, 'to');
});
