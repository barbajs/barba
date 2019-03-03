/**
 * @module core/modules/store
 */
import { Store } from '../defs/modules';
import { Rule, Rules, TransitionBase, TransitionAppear } from '../defs/shared';
// ---
import { Logger } from '../utils';

const _logger: Logger = new Logger('@barba/core');
const _rules: Rule[] = [
  {
    name: 'namespace',
    type: 'strings',
  },
  {
    name: 'custom',
    type: 'function',
  },
];
let _all: TransitionBase[] = [];
let _appear: TransitionAppear[] = [];

/**
 * Store and sort transitions
 */
const store: Store = {
  wait: false,

  /**
   * Check if appear transitions
   */
  get hasAppear() {
    return _appear.length > 0;
  },

  /**
   * Init store
   */
  init(transitions = []) {
    if (transitions) {
      // TODO: add check for valid transitions? criteria? (appear || enter && leave)
      _all = _all.concat(transitions);
    }
    this._update();
  },

  /**
   * Add rule or transition
   */
  add(type, data) {
    switch (type) {
      case 'rule':
        // TODO: check for valid rule
        _rules.splice(data.position || 0, 0, data.value);
        break;
      case 'transition':
      default:
        // TODO: check for valid transition
        _all.push(data);
        break;
    }

    this._update();
  },

  /**
   * Get active/matching transition
   */
  get(data, appear = false) {
    const transitions = appear ? _appear : _all;

    // All matching transition infos
    const matching = new Map();

    // Active = first of valid transitions
    // sorted by directions (from/to, from || to, …)
    const active = transitions.find(t => {
      let valid = true;
      const match = {};

      // Check rules
      _rules.reverse().forEach(rule => {
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

    _logger.info(matching.get(active));

    return active;
  },

  /**
   * Update store
   *
   * Reorder transition by priorities
   * Get wait transitions
   * Get appear transitions
   */
  _update() {
    // Reorder by priorities
    _all = _all
      .map(t => this._addPriority(t))
      .sort((a, b) => a.priority - b.priority)
      .reverse()
      .map(t => {
        delete t.priority;

        return t;
      });
    _appear = _all.filter(t => t.appear) as TransitionAppear[];
    // If some "to" property, except if based on "route"
    // TODO: how to manage "t.to.route" from @barba/router ???
    this.wait = _all.some(t => t.to && !t.to.route);
  },

  /**
   * Check if transition apply,
   * based on rule, page data and optional direction
   *
   * 1. transition has no rule "property":
   *    - always returns true
   * 2. transition has rule "property":
   *     - "strings" should be present on both side (transition + page) and match
   *     - "function" should return true
   */
  _check(transition, rule, data, match, direction) {
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
  },

  /**
   * Calculate transition priority based on:
   * - rule "position" (index) give tens, hundreds, thousands, …
   * - from/to properties give units (0, 1 or 2)
   */
  _calculatePriority(t, ruleName, ruleIndex) {
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
  },

  _addPriority(t) {
    t.priority = 0;
    let priority = 0;

    _rules.forEach((rule, i) => {
      const { name } = rule;
      const index = i + 1;

      priority += this._calculatePriority(t, name, index);
    });

    t.priority = priority;

    return t;
  },
};

export { store };
