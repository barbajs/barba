import { map } from './utils';

/**
 * Manage the hooks
 *
 * @namespace @barba/core/hooks
 * @type {object}
 */
export default {
  /**
   * List of available hooks
   *
   * @memberof @barba/core/hooks
   * @type {array}
   * @private
   */
  _available: [
    'go',
    'refresh',
    // Containers
    'currentAdded',
    'currentRemoved',
    'nextAdded',
    'nextRemoved',
    // Transitions
    'beforeAppear',
    'appear',
    'afterAppear',
    'appearCanceled',
    'before',
    'beforeLeave',
    'leave',
    'afterLeave',
    'leaveCanceled',
    'beforeEnter',
    'enter',
    'afterEnter',
    'enterCanceled',
    'after',
  ],

  /**
   * List of registered hooks by name
   *
   * @memberof @barba/core/hooks
   * @type {object}
   * @private
   */
  _registered: {},

  /**
   * Init available hooks
   *
   * A hook is a function that receive:
   * - function to execute
   * - optional context
   *
   * @memberof @barba/core/hooks
   * @returns {hooks} this instance
   */
  init() {
    this._available.forEach(hook => {
      if (this[hook]) {
        return;
      }

      this[hook] = (fn, ctx = null) => {
        this._registered[hook] = this._registered[hook] || [];
        this._registered[hook].push({
          fn,
          ctx,
        });
      };
    });

    return this;
  },

  /**
   * Clean registered hooks
   *
   * @memberof @barba/core/hooks
   * @returns {hooks} this instance
   */
  destroy() {
    this._registered = {};

    return this;
  },

  /**
   * Do hook
   *
   * @memberof @barba/core/hooks
   * @param {string} hook hook name
   * @param {...*} args arguments to be passed to the hook function
   * @returns {undefined}
   */
  do(hook, ...args) {
    if (hook in this._registered === false) {
      return;
    }

    this._registered[hook].forEach(hook => {
      hook.fn.apply(hook.ctx, args);
    });
  },

  /**
   * Help, print available and registered hooks
   *
   * @memberof @barba/core/hooks
   * @returns {undefined}
   */
  help() {
    console.info(`Available hooks: ${this._available}`);
    console.info(
      `Registered hooks: ${map(this._registered, (hooks, name) => name)}`
    );
  },
};
