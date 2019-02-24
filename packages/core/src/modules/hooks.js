import { Logger } from '../utils';

/**
 * Manage the hooks
 *
 * @namespace @barba/core/hooks
 * @type {object}
 */
export const hooks = {
  /**
   * Logger
   *
   * @memberof @barba/core
   * @type {Logger}
   * @private
   */
  _logger: new Logger('@barba/core'),

  /**
   * List of all hooks
   *
   * @memberof @barba/core/hooks
   * @type {array}
   */
  all: [
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
   * Init all hooks
   *
   * A hook is a function that receive:
   * - function to execute
   * - optional context
   *
   * @memberof @barba/core/hooks
   * @returns {hooks} this instance
   */
  init() {
    this.registered = {};
    this.all.forEach(hook => {
      if (!this[hook]) {
        this[hook] = (fn, ctx = null) => {
          this.registered[hook] = this.registered[hook] || [];
          this.registered[hook].push({
            fn,
            ctx,
          });
        };
      }
    });

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
    if (hook in this.registered) {
      this.registered[hook].forEach(hook => {
        hook.fn.apply(hook.ctx, args);
      });
    }
  },

  /**
   * Help, print available and registered hooks
   *
   * @memberof @barba/core/hooks
   * @returns {undefined}
   */
  help() {
    this._logger.info(`[@barba/core] Available hooks: ${this.all}`);
    this._logger.info(
      `[@barba/core] Registered hooks: ${Object.keys(this.registered)}`
    );
  },
};
