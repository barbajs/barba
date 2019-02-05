import runAsync from 'run-async';
import dom from '../dom';
import hooks from '../hooks';

// TODO: define events to trigger
// TODO: define hook params (all vs specific -current or next-)
// TODO: error handling
// TODO: "resolve" with data? pass through all the "pipeline"? (at least between leave/enter?)
// TODO: returns ?

/**
 * Manage the transitions
 *
 * @namespace @barba/core/transitions/manager
 * @type {object}
 */
export default {
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
  async doAppear({ transition, data }) {
    if (!transition) {
      console.warn('[@barba/core] No transition found');
    }

    const t = transition || {};

    this.running = true;

    hooks.do('beforeAppear', data, t);
    t.beforeAppear && t.beforeAppear(data);

    hooks.do('appear', data, t);
    await this.appear(t, data)
      .then(() => {
        hooks.do('afterAppear', data, t);
        t.afterAppear && t.afterAppear(data);
      })
      .catch(error => {
        hooks.do('appearCanceled', data, t);
        t.appearCanceled && t.appearCanceled(data);
        // TODO: remove console
        console.error('[@barba/core]', error);
        throw new Error('Transition error');
      });

    this.running = false;
  },

  appear(t, data) {
    if (t.appear) {
      return runAsync(t.appear)(data);
    }

    return Promise.resolve();
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
      console.warn('[@barba/core] No transition found');
    }

    const t = transition || {};
    const sync = t.sync === true || false;

    this.running = true;

    try {
      // Check sync mode, wait for next content
      if (sync) {
        await page.then(html => {
          const nextDocument = dom.toDocument(html);

          data.next.namespace = dom.getNamespace(nextDocument);
          data.next.container = dom.getContainer(nextDocument);
          data.next.html = dom.getHtml(nextDocument);
        });
      }

      this.before(t, data);

      if (sync) {
        // Before actions
        this.beforeLeave(t, data);
        await this.beforeEnter(t, data, page);

        this.addNext(data, wrapper);

        // Actions
        await Promise.all([this.leave(t, data), this.enter(t, data)]);

        // After actions
        this.afterLeave(t, data);
        this.removeCurrent(data);
        this.afterEnter(t, data);
      } else {
        let leaveResult = false;

        // Leave
        this.beforeLeave(t, data);
        leaveResult = await this.leave(t, data);
        this.afterLeave(t, data);
        this.removeCurrent(data);

        // Enter
        /* istanbul ignore else */
        if (leaveResult !== false) {
          await this.beforeEnter(t, data, page);
          this.addNext(data, wrapper);
          await this.enter(t, data, leaveResult);
          this.afterEnter(t, data, leaveResult);
        }
      }

      this.after(t, data);
    } catch (error) {
      // TODO: use cases for cancellation
      // this.leaveCanceled(t, data);
      // this.enterCanceled(t, data);

      // TODO: remove console
      console.error('[@barba/core]', error);
      throw new Error('Transition error');
    }

    this.running = false;
  },

  // QUESTION: granular error catching?
  // Execute animation steps
  // Allows to catch errors for specific step
  // with the right cancel method
  async action(name, t, data, extra) {
    /* istanbul ignore next */
    try {
      return await this[name](t, data, extra);
    } catch (error) {
      // TODO: use cases for cancellation
      // if (/leave/i.test(name)) {
      //   this.leaveCanceled(t, data);
      // }
      // if (/enter/i.test(name)) {
      //   this.enterCanceled(t, data);
      // }

      // TODO: remove console
      console.error('[@barba/core]', error);
      throw new Error('Transition error');
    }
  },

  // Global methods
  before(t, data) {
    hooks.do('before', data, t);
    t.before && t.before(data);
  },

  after(t, data) {
    hooks.do('after', data, t);
    t.after && t.after(data);
  },

  // Leave methods
  beforeLeave(t, data) {
    hooks.do('beforeLeave', data, t);
    t.beforeLeave && t.beforeLeave(data);
  },

  leave(t, data) {
    hooks.do('leave', data, t);

    if (t.leave) {
      return runAsync(t.leave)(data).then(leaveResult => leaveResult);
    }

    return Promise.resolve();
  },

  afterLeave(t, data) {
    hooks.do('afterLeave', data, t);
    t.afterLeave && t.afterLeave(data);
  },

  // DEV
  // leaveCanceled(t, data) {
  //   hooks.do('leaveCanceled', data, t);
  //   t.leaveCanceled && t.leaveCanceled(data);
  // },

  // Enter methods
  async beforeEnter(t, data, page) {
    if (!data.next.html) {
      await page.then(html => {
        const nextDocument = dom.toDocument(html);

        data.next.namespace = dom.getNamespace(nextDocument);
        data.next.container = dom.getContainer(nextDocument);
        data.next.html = dom.getHtml(nextDocument);
      });
    }

    hooks.do('beforeEnter', data, t);
    t.beforeEnter && t.beforeEnter(data);
  },

  enter(t, data, leaveResult) {
    hooks.do('enter', data, t);

    if (t.enter) {
      return runAsync(t.enter)(data, leaveResult);
    }

    return Promise.resolve();
  },

  afterEnter(t, data) {
    hooks.do('afterEnter', data, t);
    t.afterEnter && t.afterEnter(data);
  },

  // DEV
  // enterCanceled(t, data) {
  //   hooks.do('enterCanceled', data, t);
  //   t.enterCanceled && t.enterCanceled(data);
  // },

  // Add / remove containers
  addNext(data, wrapper) {
    wrapper.appendChild(data.next.container);
    hooks.do('nextAdded', data);
  },

  removeCurrent(data) {
    data.current.container.remove();
    hooks.do('currentRemoved', data);
  },
};
