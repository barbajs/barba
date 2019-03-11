/**
 * @barba/core/modules/store
 * <br><br>
 * ## Transitions store.
 *
 * - Resolve transition
 * - Manage rules
 *
 * @module core/modules/store
 * @preferred
 */

/***/

// Definitions
import {
  Rule,
  RuleName,
  Rules,
  TransitionPage,
  TransitionAppear,
  TransitionData,
} from '../defs';
// Modules
import { Logger } from './Logger';

export class Store {
  public logger: Logger = new Logger('@barba/core');
  /**
   * All registered transitions.
   */
  public all: TransitionPage[] = [];
  /**
   * "Appear only" registered transitions.
   */
  public appear: TransitionAppear[] = [];
  /**
   * Rules for transition resolution.
   *
   * Defaults:
   *
   * - namespace
   * - custom
   */
  private _rules: Rule[] = [
    {
      name: 'namespace',
      type: 'strings',
    },
    {
      name: 'custom',
      type: 'function',
    },
  ];

  /**
   * Init store.
   */
  constructor(transitions: TransitionPage[] = []) {
    if (transitions) {
      // TODO: add check for valid transitions? criteria? (appear || enter && leave)
      this.all = this.all.concat(transitions);
    }
    this._update();
  }

  /**
   * Add rule or transition.
   */
  add(type: 'rule' | 'transition', data: any): void {
    switch (type) {
      case 'rule':
        // TODO: check for valid rule
        this._rules.splice(data.position || 0, 0, data.value);
        break;
      case 'transition':
      default:
        // TODO: check for valid transition
        this.all.push(data);
        break;
    }

    this._update();
  }

  /**
   * Resolve transition.
   */
  resolve(
    data: TransitionData,
    appear: boolean = false
  ): TransitionAppear | TransitionPage {
    const transitions = appear ? this.appear : this.all;

    // All matching transition infos
    const matching = new Map();

    // Active = first of valid transitions
    // sorted by directions (from/to, from || to, …)
    const active = transitions.find(t => {
      let valid = true;
      const match = {};

      // Check rules
      this._rules.reverse().forEach(rule => {
        if (valid) {
          valid = this._check(t, rule, data, match);
          // From/to check, only for page transitions
          if (!appear) {
            if (t.from && t.to) {
              valid =
                this._check(t, rule, data, match, 'from') &&
                this._check(t, rule, data, match, 'to');
            }
            if (t.from && !t.to) {
              valid = this._check(t, rule, data, match, 'from');
            }
            if (!t.from && t.to) {
              valid = this._check(t, rule, data, match, 'to');
            }
          }
        }
      });

      matching.set(t, match);

      return valid;
    });

    this.logger.info(matching.get(active));

    return active;
  }

  /**
   * ### Update store.
   *
   * - Reorder transition by priorities
   * - Get wait indicator
   * - Get appear transitions
   */
  private _update(): void {
    // Reorder by priorities
    this.all = this.all
      .map(t => this._addPriority(t))
      .sort((a, b) => a.priority - b.priority)
      .reverse()
      .map(t => {
        delete t.priority;

        return t;
      });
    this.appear = this.all.filter(t => t.appear) as TransitionAppear[];
  }

  /**
   * ### Check if transition apply.
   *
   * Based on rule, page data and optional direction:
   *
   * 1. transition has no rule "property":
   *    - always returns true
   * 2. transition has rule "property":
   *     - "strings" should be present on both side (transition + page) and match
   *     - "function" should return true
   */
  private _check(
    transition: TransitionPage,
    rule: Rule,
    data: TransitionData,
    match: any,
    direction?: 'from' | 'to'
  ): boolean {
    let isValid = true;
    let hasMatch = false;
    const t = transition;
    const { name, type } = rule;
    const strRule = name as Rules['strings'];
    const fnName = name as Rules['function'];
    const base = direction ? t[direction] : t; // = t || t.from || t.to
    const page = direction === 'to' ? data.next : data.current; // = current || next
    const exist = direction ? base && base[name] : base[name];

    // If transition rule exists
    if (exist) {
      switch (type) {
        case 'strings':
        default: {
          // Array support
          const names: string[] = Array.isArray(base[strRule])
            ? (base[strRule] as string[])
            : [base[strRule] as string];

          // For matching, prop should be present on both sides and match
          if (page[strRule] && names.indexOf(page[strRule]) !== -1) {
            hasMatch = true;
          }
          // If transition prop is different from current, not valid
          if (names.indexOf(page[strRule]) === -1) {
            isValid = false;
          }
          break;
        }

        case 'function':
          if (base[fnName](data)) {
            hasMatch = true;
          } else {
            isValid = false;
          }
          break;
      }

      if (hasMatch) {
        if (direction) {
          match[direction] = match[direction] || {};
          match[direction][name] = t[direction][name];
        } else {
          match[name] = t[name];
        }
      }
    }

    return isValid;
  }

  /**
   * ### Calculate transition priority.
   *
   * Based on:
   *
   * - rule "position" (index) give tens, hundreds, thousands, …
   * - from/to properties give units (0, 1 or 2)
   */
  private _calculatePriority(
    t: TransitionPage,
    ruleName: RuleName,
    ruleIndex: number
  ): number {
    let priority = 0;

    if (
      t[ruleName] ||
      (t.from && t.from[ruleName]) ||
      (t.to && t.to[ruleName])
    ) {
      priority += Math.pow(10, ruleIndex);

      if (t.from && t.from[ruleName]) {
        priority += 1;
      }
      if (t.to && t.to[ruleName]) {
        priority += 2;
      }
    }

    return priority;
  }

  private _addPriority(t: TransitionPage): TransitionPage {
    t.priority = 0;
    let priority = 0;

    this._rules.forEach((rule, i) => {
      const { name } = rule;
      const index = i + 1;

      priority += this._calculatePriority(t, name, index);
    });

    t.priority = priority;

    return t;
  }
}
