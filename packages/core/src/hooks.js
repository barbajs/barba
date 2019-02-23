import { map } from './utils';
import Logger from './Logger';

/**
 * Manage the hooks
 *
 * @namespace @barba/core/hooks
 * @type {object}
 */
export default {
  /**
   * Logger
   *
   * @memberof @barba/core
   * @type {Logger}
   * @private
   */
  _logger: new Logger('@barba/core'),

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
   */
  registered: {},

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
        this.registered[hook] = this.registered[hook] || [];
        this.registered[hook].push({
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
    this.registered = {};

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
    if (hook in this.registered === false) {
      return;
    }

    this.registered[hook].forEach(hook => {
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
    this._logger.info(`[@barba/core] Available hooks: ${this._available}`);
    this._logger.info(
      `[@barba/core] Registered hooks: ${map(
        this.registered,
        (hooks, name) => name
      )}`
    );
  },
};
