/**
 * @module typings/core
 */
import { Rule, RuleName, TransitionData, TransitionBase } from '../shared';

export interface Store {
  wait: boolean;
  hasAppear: boolean;
  init(transitions: TransitionBase[]): void;
  add(type: 'rule' | 'transition', data: any): void;
  get(data: TransitionData, appear?: boolean): TransitionBase;
  _update(): void;
  _check(
    transition: TransitionBase,
    rule: Rule,
    data: TransitionData,
    match: any,
    direction?: 'from' | 'to'
  ): boolean;
  _calculatePriority(
    t: TransitionBase,
    ruleName: RuleName,
    ruleIndex: number
  ): number;
  _addPriority(t: TransitionBase): TransitionBase;
}
