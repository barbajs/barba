import { map } from './utils';

export default {
  available: [
    'go',
    'beforeAppear',
    'appear',
    'afterAppear',
    'beforeEnter',
    'enter',
    'afterEnter',
    'beforeLeave',
    'leave',
    'afterLeave',
  ],
  registered: {},

  /**
   * Init available hooks
   *
   * A hook is a function that receive:
   * - function to execute
   * - optional context
   * @returns {hooks} this instance
   */
  init() {
    this.available.forEach(hook => {
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
   * @returns {hooks} this instance
   */
  destroy() {
    this.registered = {};

    return this;
  },

  /**
   * Do hook
   *
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
   * @returns {undefined}
   */
  help() {
    console.info(`Available hooks: ${this.available}`);
    console.info(
      `Registered hooks: ${map(this.registered, (hooks, name) => name)}`
    );
  },
};
