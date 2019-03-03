/**
 * @module typings/core
 */
export type RuleName = Rules['strings'] | Rules['function'];
export type RuleType = 'strings' | 'function';
export type Rule = {
  name: RuleName;
  type: RuleType;
};
export type Rules = {
  strings: 'namespace' | 'route';
  function: 'custom';
};
