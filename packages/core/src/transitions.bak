import { byPriorities, byDirections } from './utils';

// Can move to @barba/transitions? Kind of "collection" with default?
const defaultTransition = {
  enter() {}, // eslint-disable-line no-empty-function
  leave() {}, // eslint-disable-line no-empty-function
};

export default {
  // Active transition
  active: undefined,
  // Rules and modes
  rules: [
    // Order matters…
    {
      name: 'custom',
      type: 'function',
    },
    {
      name: 'namespace',
      type: 'strings',
    },
  ],
  modes: ['simultaneous', 'in-out', 'out-in'],
  // All vs appear
  all: [defaultTransition],
  appear: [],
  // Global
  wait: false, // Needed to wait for catch or fetch (if "to transition" exists)
  init(transitions, debug) {
    this.debug = debug;

    if (transitions) {
      // TODO: add check for valid transitions? criteria? (appear || enter && leave)
      this.all = this.all.concat(transitions);
    }

    this.update();

    return this;
  },
  update() {
    // Reorder by priorities
    this.rules
      .slice()
      .reverse()
      .forEach(rule => {
        this.all.sort(byPriorities(rule.name));
      });
    this.appear = this.all.filter(t => t.appear && !t.from && !t.to);
    this.wait = this.all.some(t => t.to);
  },
  add(type, data) {
    switch (type) {
      case 'rule':
        // TODO: check for valid rule
        this.rules.splice(data.position || 0, 0, data.value);
        break;
      case 'transition':
        // TODO: check for valid transition
        this.all.push(data);
        break;
      default:
    }

    this.update();
  },
  get(data, init = false) {
    const transitions = init ? this.appear : this.all;
    const { current, next } = data;
    // All matching transition infos
    const matching = new Map();

    // Active = first of valid transitions sorted by directions (from/to, from || to, …)
    [this.active] = transitions
      .filter(t => {
        let valid = true;
        const match = {};

        // Check rules
        this.rules.forEach(rule => {
          if (valid) {
            valid = this.check(t, rule, current, match);
            // From/to
            if (t.from || t.to) {
              valid = this.check(t, rule, current, match, 'from');
              valid = this.check(t, rule, next, match, 'to');
            }
          }
        });

        matching.set(t, match);

        return valid;
      })
      .sort(byDirections);

    if (this.debug) {
      // Debug info to known criteria applied for matching transition
      // TODO: error/warn/info handler
      console.info(matching.get(this.active));
    }

    return this.active;
  },

  /**
   * Check if transition apply,
   * based on rule, page data and optional direction
   *
   * 1. transition has no rule "property":
   *    - always returns true
   * 2. transition has rule "property":
   *     - "strings" should be present on both side (transition + view) and match
   *     - "function" should return true
   *
   * @param {object} transition transition
   * @param {object} rule rule
   * @param {object} page current | next
   * @param {object} match debug object
   * @param {string} direction from | to
   * @returns {boolean} valid check or not
   */
  check(transition, rule, page, match, direction) {
    let isValid = true;
    let hasMatch = false;
    const t = transition;
    const { name, type } = rule;
    const base = direction ? t[direction] : t; // = t || t.from || t.to
    const exist = direction ? base && base[name] : base[name];

    // If transition rule exists
    if (exist) {
      switch (type) {
        case 'strings':
        default: {
          // Array support
          const names = Array.isArray(base[name]) ? base[name] : [base[name]];

          // For matching, prop should be present on both sides and match
          if (page[name] && names.includes(page[name])) {
            hasMatch = true;
          }
          // If transition prop is different from current, not valid
          if (!names.includes(page[name])) {
            isValid = false;
          }
          break;
        }

        case 'function':
          if (base[name](page)) {
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
};
