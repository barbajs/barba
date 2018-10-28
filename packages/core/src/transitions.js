import { byPriorities, byDirections, checkCustom, checkProp } from './utils';

// Can move to @barba/transitions? Kind of "collection" with default?
const defaultTransition = {
  appear() {}, // eslint-disable-line no-empty-function
  enter() {}, // eslint-disable-line no-empty-function
  leave() {}, // eslint-disable-line no-empty-function
};

export default {
  // Active transition
  active: undefined,
  // Properties and modes
  props: ['route', 'namespace'], // Order matters…
  modes: ['simultaneous', 'in-out', 'out-in'],
  // All vs appear
  all: [],
  appear: [],
  // Global
  hasTo: false, // Needed to wait for catch or fetch (if "to transition" exists)
  init(transitions, debug) {
    this.debug = debug;
    this.all.push(defaultTransition);

    if (transitions) {
      this.all = this.all.concat(transitions);

      // Reorder by priorities (props reversed, then custom)
      this.props
        .slice()
        .reverse()
        .forEach(prop => {
          this.all.sort(byPriorities(prop));
        });

      this.all.sort(byPriorities('custom'));
    }

    this.appear = this.all.filter(t => t.appear && !t.from && !t.to);
    this.hasTo = this.all.some(t => t.to);

    return this;
  },
  get(data, init = false) {
    const transitions = init ? this.appear : this.all;
    const { current, next } = data;
    const matching = new Map();

    // Active = first of valid transitions sorted by directions (from/to, from || to, …)
    [this.active] = transitions
      .filter(t => {
        let valid = true;
        const match = {};

        // Check for valid custom or no custom
        // If invalid custom, returns false…
        checkCustom(t, data, match);
        // From/to
        if (t.from || t.to) {
          checkCustom(t, data, match, 'from');
          checkCustom(t, data, match, 'to');
        }

        // Filter on props
        this.props.forEach(prop => {
          valid = checkProp(t, prop, current, match);
          // From/to
          if (t.from || t.to) {
            valid = checkProp(t, prop, current, match, 'from');
            valid = checkProp(t, prop, next, match, 'to');
          }
        });

        matching.set(t, match);

        return valid;
      })
      .sort(byDirections);

    if (this.debug) {
      // Debug info to known criteria applied for matching transition
      // console.info(matching.get(this.active));
    }

    return this.active;
  },
};
