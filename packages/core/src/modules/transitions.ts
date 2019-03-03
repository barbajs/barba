/**
 * @module core/modules/transitions
 */
import { Transitions } from '../defs/modules';
// ---
import runAsync from 'run-async';
import { hooks } from '.';
import { helpers, Logger } from '../utils';

const _logger: Logger = new Logger('@barba/core');

/**
 * ### Manage the transitions
 */
const transitions: Transitions = {
  /**
   * Animation running status
   *
   * @memberof @barba/core/transitions/manager
   * @type {boolean}
   */
  running: false,

  /**
   * Do "appear" transition
   */
  async doAppear({ data, transition }) {
    !transition && _logger.warn('No transition found');

    const t = transition || {};

    this.running = true;
    // Before
    this._doSyncHook('beforeAppear', data, t);

    await this.appear(data, t)
      .then(() => {
        // After
        this._doSyncHook('afterAppear', data, t);
      })
      .catch(error => {
        // Canceled
        this._doSyncHook('appearCanceled', data, t);
        _logger.error(error);
        throw new Error('Transition error');
      });

    this.running = false;
  },

  /**
   * Do "page" transition
   */
  async doPage({ data, transition, page, wrapper }) {
    !transition && _logger.warn('No transition found');

    const t = transition || {};
    const sync = t.sync === true || false;

    this.running = true;

    try {
      // Check sync mode, wait for next content
      if (sync) {
        await helpers.getPage(page, data.next);
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
        let leaveResult: any = false;

        // Leave
        this._doSyncHook('beforeLeave', data, t);

        leaveResult = await Promise.all([
          this.leave(data, t),
          helpers.getPage(page, data.next),
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

      _logger.error(error);
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
    hooks.do('appear', data, t);

    return t.appear ? runAsync(t.appear)(data) : Promise.resolve();
  },

  leave(data, t) {
    hooks.do('leave', data, t);

    return t.leave
      ? // ? runAsync(t.leave)(data).then(leaveResult => leaveResult)
        runAsync(t.leave)(data)
      : Promise.resolve();
  },

  enter(data, t, leaveResult) {
    hooks.do('enter', data, t);

    return t.enter ? runAsync(t.enter)(data, leaveResult) : Promise.resolve();
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

export { transitions };
