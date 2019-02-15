import runAsync from 'run-async';
import hooks from '../hooks';
import Logger from '../Logger';
import * as utils from '../utils';

/**
 * Manage the transitions
 *
 * @namespace @barba/core/transitions/manager
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
   * Animation running status
   *
   * @memberof @barba/core/transitions/manager
   * @type {boolean}
   */
  running: false,

  /**
   * Do "appear" transition
   *
   * @memberof @barba/core/transitions/manager
   * @param {object} { transition, data }
   * @param {object} transition transition to use
   * @param {object} data transition data
   * @param {object} data.current current page
   * @param {object} data.next next page
   * @param {object} data.trigger transition trigger
   * @returns {promise} transition end
   */
  async doAppear({ data, transition }) {
    if (!transition) {
      this._logger.warn('No transition found');
    }

    const t = transition || {};

    this.running = true;
    // Before
    this._doSyncHook('beforeAppear', data, t);
    // Appear
    hooks.do('appear', data, t);
    await this.appear(data, t)
      .then(() => {
        // After
        this._doSyncHook('afterAppear', data, t);
      })
      .catch(error => {
        // Canceled
        this._doSyncHook('appearCanceled', data, t);
        this._logger.error(error);
        throw new Error('Transition error');
      });

    this.running = false;
  },

  /**
   * Do "page" transition
   *
   * @memberof @barba/core/transitions/manager
   * @param {object} { transition, data, page, wrapper }
   * @param {object} transition transition to use
   * @param {object} data transition data
   * @param {object} data.current current page
   * @param {object} data.next next page
   * @param {HTMLElement|string} data.trigger transition trigger (HTMLElement, popstate, barba)
   * @param {promise} page next page
   * @param {HTMLElement} wrapper barba wrapper
   * @param {boolean} back if we navigate to previous page
   * @returns {promise} transition end
   */
  async doPage({ transition, data, page, wrapper }) {
    if (!transition) {
      this._logger.warn('No transition found');
    }

    const t = transition || {};
    const sync = t.sync === true || false;

    this.running = true;

    try {
      // Check sync mode, wait for next content
      if (sync) {
        await utils.getPage(page, data.next);
      }

      this._doSyncHook('before', data, t);

      if (sync) {
        // Before actions
        this._doSyncHook('beforeLeave', data, t);
        this._doSyncHook('beforeEnter', data, t);

        this._addNext(data, wrapper);

        // Actions
        await Promise.all([this.leave(data, t), this.enter(data, t)]);

        // After actions
        this._doSyncHook('afterLeave', data, t);
        this._removeCurrent(data);
        this._doSyncHook('afterEnter', data, t);
      } else {
        let leaveResult = false;

        // Leave
        this._doSyncHook('beforeLeave', data, t);

        leaveResult = await Promise.all([
          this.leave(data, t),
          utils.getPage(page, data.next),
        ])
          .then(values => values[0])
          .catch(error => {
            throw error;
          });

        this._doSyncHook('afterLeave', data, t);

        // TODO: check here "valid" page result
        // before going further
        this._removeCurrent(data);

        // Enter
        /* istanbul ignore else */
        if (leaveResult !== false) {
          this._doSyncHook('beforeEnter', data, t);
          this._addNext(data, wrapper);
          await this.enter(data, t, leaveResult);
          this._doSyncHook('afterEnter', data, t);
        }
      }

      this._doSyncHook('after', data, t);
    } catch (error) {
      // TODO: use cases for cancellation
      this._doSyncHook('leaveCanceled', data, t);

      this._logger.error(error);
      throw new Error('Transition error');
    }

    this.running = false;
  },

  // QUESTION: granular error catching?
  // Execute animation steps
  // Allows to catch errors for specific step
  // with the right cancel method
  // async action(name, data, t, extra) {
  //   /* istanbul ignore next */
  //   try {
  //     return await this[name](data, t, extra);
  //   } catch (error) {
  //     // TODO: use cases for cancellation
  //     // if (/leave/i.test(name)) {
  //     //   this.leaveCanceled(data, t);
  //     // }
  //     // if (/enter/i.test(name)) {
  //     //   this.enterCanceled(data, t);
  //     // }

  //     // TODO: remove console
  //     console.error('[@barba/core]', error);
  //     throw new Error('Transition error');
  //   }
  // },

  appear(data, t) {
    if (t.appear) {
      return runAsync(t.appear)(data);
    }

    return Promise.resolve();
  },

  leave(data, t) {
    hooks.do('leave', data, t);

    if (t.leave) {
      return runAsync(t.leave)(data).then(leaveResult => leaveResult);
    }

    return Promise.resolve();
  },

  enter(data, t, leaveResult) {
    hooks.do('enter', data, t);

    if (t.enter) {
      return runAsync(t.enter)(data, leaveResult);
    }

    return Promise.resolve();
  },

  _doSyncHook(hook, data, t) {
    hooks.do(hook, data, t);
    t[hook] && t[hook](data);
  },

  // Add / remove containers
  _addNext(data, wrapper) {
    wrapper.appendChild(data.next.container);
    hooks.do('nextAdded', data);
  },

  _removeCurrent(data) {
    data.current.container.remove();
    hooks.do('currentRemoved', data);
  },
};
