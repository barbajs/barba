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

    hooks.do('beforeAppear', data);
    t.beforeAppear && t.beforeAppear(data);
    hooks.do('appear', data);

    await runAsync(t.appear)(data)
      .then(() => {
        hooks.do('afterAppear', data);
        t.afterAppear && t.afterAppear(data);
      })
      .catch(error => {
        hooks.do('appearCanceled', data);
        t.appearCanceled && t.appearCanceled(data);
        // TODO: remove console
        console.error(error);
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

      this.doBefore(t, data);

      if (sync) {
        // Before actions
        this.doBeforeLeave(t, data);
        await this.doBeforeEnter(t, data, page);

        this.addNext(data, wrapper);

        // Actions
        await Promise.all([this.doLeave(t, data), this.doEnter(t, data)]);

        // After actions
        this.doAfterLeave(t, data);
        this.removeCurrent(data);
        this.doAfterEnter(t, data);
      } else {
        let leaveResult = false;

        // Leave
        this.doBeforeLeave(t, data);
        leaveResult = await this.doLeave(t, data);
        this.doAfterLeave(t, data);
        this.removeCurrent(data);

        // Enter
        /* istanbul ignore else */
        if (leaveResult !== false) {
          await this.doBeforeEnter(t, data, page);
          this.addNext(data, wrapper);
          await this.doEnter(t, data, leaveResult);
          this.doAfterEnter(t, data, leaveResult);
        }
      }

      this.doAfter(t, data);
    } catch (error) {
      // TODO: use cases for cancellation
      // this.doLeaveCanceled(t, data);
      // this.doEnterCanceled(t, data);

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
  async doAction(name, t, data, extra) {
    /* istanbul ignore next */
    try {
      return await this[name](t, data, extra);
    } catch (error) {
      // TODO: use cases for cancellation
      // if (/leave/i.test(name)) {
      //   this.doLeaveCanceled(t, data);
      // }
      // if (/enter/i.test(name)) {
      //   this.doEnterCanceled(t, data);
      // }

      // TODO: remove console
      console.error(error);
      throw new Error('Transition error');
    }
  },

  // Global methods
  doBefore(t, data) {
    hooks.do('before', data);
    t.before && t.before(data);
  },

  doAfter(t, data) {
    hooks.do('after', data);
    t.after && t.after(data);
  },

  // Leave methods
  doBeforeLeave(t, data) {
    hooks.do('beforeLeave', data);
    // CSS: add leave
    // CSS: add leave-active
    t.beforeLeave && t.beforeLeave(data);
  },

  doLeave(t, data) {
    hooks.do('leave', data);

    return runAsync(t.leave)(data).then(leaveResult => leaveResult);
  },

  doAfterLeave(t, data) {
    hooks.do('afterLeave', data);
    // CSS: remove leave-to
    // CSS: remove leave-active
    t.afterLeave && t.afterLeave(data);
  },

  // DEV
  // doLeaveCanceled(t, data) {
  //   hooks.do('leaveCanceled', data);
  //   // CSS: remove leave
  //   // CSS: remove leave-to
  //   // CSS: remove leave-active
  //   t.leaveCanceled && t.leaveCanceled(data);
  // },

  // Enter methods
  async doBeforeEnter(t, data, page) {
    if (!data.next.html) {
      await page.then(html => {
        const nextDocument = dom.toDocument(html);

        data.next.namespace = dom.getNamespace(nextDocument);
        data.next.container = dom.getContainer(nextDocument);
        data.next.html = dom.getHtml(nextDocument);
      });
    }

    hooks.do('beforeEnter', data);
    // CSS: add enter
    // CSS: add enter-active
    t.beforeEnter && t.beforeEnter(data);
  },

  doEnter(t, data, leaveResult) {
    // CSS: remove enter
    hooks.do('enter', data);
    // CSS: add enter-to

    return runAsync(t.enter)(data, leaveResult);
  },

  doAfterEnter(t, data) {
    hooks.do('afterEnter', data);
    // CSS: remove enter-to
    // CSS: remove enter-active
    t.afterEnter && t.afterEnter(data);
  },

  // DEV
  // doEnterCanceled(t, data) {
  //   hooks.do('enterCanceled', data);
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
