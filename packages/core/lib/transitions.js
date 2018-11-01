"use strict";

Object.defineProperty(exports, "__esModule", {
  value: true
});
exports.default = void 0;

var _utils = require("./utils");

function _slicedToArray(arr, i) { return _arrayWithHoles(arr) || _iterableToArrayLimit(arr, i) || _nonIterableRest(); }

function _nonIterableRest() { throw new TypeError("Invalid attempt to destructure non-iterable instance"); }

function _iterableToArrayLimit(arr, i) { var _arr = []; var _n = true; var _d = false; var _e = undefined; try { for (var _i = arr[Symbol.iterator](), _s; !(_n = (_s = _i.next()).done); _n = true) { _arr.push(_s.value); if (i && _arr.length === i) break; } } catch (err) { _d = true; _e = err; } finally { try { if (!_n && _i["return"] != null) _i["return"](); } finally { if (_d) throw _e; } } return _arr; }

function _arrayWithHoles(arr) { if (Array.isArray(arr)) return arr; }

// Can move to @barba/transitions? Kind of "collection" with default?
var defaultTransition = {
  enter: function enter() {},
  // eslint-disable-line no-empty-function
  leave: function leave() {}
};
var _default = {
  // Active transition
  active: undefined,
  // Rules and modes
  rules: [// Order matters…
  {
    name: 'custom',
    type: 'function'
  }, {
    name: 'namespace',
    type: 'strings'
  }],
  modes: ['simultaneous', 'in-out', 'out-in'],
  // All vs appear
  all: [defaultTransition],
  appear: [],
  // Global
  wait: false,
  // Needed to wait for catch or fetch (if "to transition" exists)
  init: function init(transitions, debug) {
    this.debug = debug;

    if (transitions) {
      // TODO: add check for valid transitions? criteria? (appear || enter && leave)
      this.all = this.all.concat(transitions);
    }

    this.update();
    return this;
  },
  update: function update() {
    var _this = this;

    // Reorder by priorities
    this.rules.slice().reverse().forEach(function (rule) {
      _this.all.sort((0, _utils.byPriorities)(rule.name));
    });
    this.appear = this.all.filter(function (t) {
      return t.appear && !t.from && !t.to;
    });
    this.wait = this.all.some(function (t) {
      return t.to;
    });
  },
  add: function add(type, data) {
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
  get: function get(data) {
    var _this2 = this;

    var init = arguments.length > 1 && arguments[1] !== undefined ? arguments[1] : false;
    var transitions = init ? this.appear : this.all;
    var current = data.current,
        next = data.next; // All matching transition infos

    var matching = new Map(); // Active = first of valid transitions sorted by directions (from/to, from || to, …)

    var _transitions$filter$s = transitions.filter(function (t) {
      var valid = true;
      var match = {}; // Check rules

      _this2.rules.forEach(function (rule) {
        if (valid) {
          valid = _this2.check(t, rule, current, match); // From/to

          if (t.from || t.to) {
            valid = _this2.check(t, rule, current, match, 'from');
            valid = _this2.check(t, rule, next, match, 'to');
          }
        }
      });

      matching.set(t, match);
      return valid;
    }).sort(_utils.byDirections);

    var _transitions$filter$s2 = _slicedToArray(_transitions$filter$s, 1);

    this.active = _transitions$filter$s2[0];

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
  check: function check(transition, rule, page, match, direction) {
    var isValid = true;
    var hasMatch = false;
    var t = transition;
    var name = rule.name,
        type = rule.type;
    var base = direction ? t[direction] : t; // = t || t.from || t.to

    var exist = direction ? base && base[name] : base[name]; // If transition rule exists

    if (exist) {
      switch (type) {
        case 'strings':
        default:
          {
            // Array support
            var names = Array.isArray(base[name]) ? base[name] : [base[name]]; // For matching, prop should be present on both sides and match

            if (page[name] && names.includes(page[name])) {
              hasMatch = true;
            } // If transition prop is different from current, not valid


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
  }
};
exports.default = _default;