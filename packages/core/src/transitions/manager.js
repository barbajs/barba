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
      throw new Error('No transition found');
    }

    const t = transition;

    this.running = true;

    // CSS: add appear
    // CSS: add appear-active
    hooks.do('beforeAppear', data, t);
    // CSS: remove appear
    // CSS: add appear-to

    t.beforeAppear && t.beforeAppear(data);
    hooks.do('appear', data, t);

    await this.appear(t, data)
      .then(() => {
        // CSS: remove appear-active
        // CSS: remove appear-to
        hooks.do('afterAppear', data, t);
        t.afterAppear && t.afterAppear(data);
      })
      .catch(error => {
        hooks.do('appearCanceled', data, t);
        t.appearCanceled && t.appearCanceled(data);
        // TODO: remove console
        console.error(error);
        throw new Error('Transition error');
      });

    this.running = false;
  },

  appear(t, data) {
    return runAsync(t.appear)(data);
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
      throw new Error('No transition found');
    }

    const t = transition;
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

      // TODO: Question? Create empty promises for missing optional hooks
      // const before = t.before ? t.before : () => Promise.resolve();
      // const beforeLeave = t.beforeLeave ? t.beforeLeave : () => Promise.resolve();
      // const afterLeave = t.afterLeave ? t.afterLeave : () => Promise.resolve();
      // const beforeEnter = t.beforeEnter ? t.beforeEnter : () => Promise.resolve();
      // const afterEnter = t.afterEnter ? t.afterEnter : () => Promise.resolve();
      // const after = t.after ? t.after : () => Promise.resolve();

      this.before(t, data);

      if (sync) {
        // Before actions
        this.beforeLeave(t, data);
        await this.beforeEnter(t, data, page);

        this.addNext(data, wrapper);

        // Actions
        await Promise.all([this.leave(t, data), this.doEnter(t, data)]);

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
          await this.doEnter(t, data, leaveResult);
          this.afterEnter(t, data, leaveResult);
        }
      }

      this.after(t, data);
    } catch (error) {
      // TODO: use cases for cancellation
      // this.leaveCanceled(t, data);
      // this.enterCanceled(t, data);

      // TODO: remove console
      console.error(error);
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
      console.error(error);
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
    // CSS: add leave
    // CSS: add leave-active
    t.beforeLeave && t.beforeLeave(data);
  },

  leave(t, data) {
    // CSS: remove leave
    // CSS: add leave-to
    hooks.do('leave', data, t);

    return runAsync(t.leave)(data).then(leaveResult => leaveResult);
  },

  afterLeave(t, data) {
    hooks.do('afterLeave', data, t);
    // CSS: remove leave-to
    // CSS: remove leave-active
    t.afterLeave && t.afterLeave(data);
  },

  // DEV
  // leaveCanceled(t, data) {
  //   hooks.do('leaveCanceled', data, t);
  //   // CSS: remove leave
  //   // CSS: remove leave-to
  //   // CSS: remove leave-active
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
    // CSS: add enter
    // CSS: add enter-active
    t.beforeEnter && t.beforeEnter(data);
  },

  doEnter(t, data, leaveResult) {
    // CSS: remove enter
    // CSS: add enter-to
    hooks.do('enter', data, t);

    return runAsync(t.enter)(data, leaveResult);
  },

  afterEnter(t, data) {
    hooks.do('afterEnter', data, t);
    // CSS: remove enter-to
    // CSS: remove enter-active
    t.afterEnter && t.afterEnter(data);
  },

  // DEV
  // enterCanceled(t, data) {
  //   hooks.do('enterCanceled', data, t);
  //   // CSS: remove enter
  //   // CSS: remove enter-to
  //   // CSS: remove enter-active
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
