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
      .catch(err => {
        hooks.do('appearCanceled', data);
        t.appearCanceled && t.appearCanceled(data);
        console.error(err);
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

    hooks.do('before', data);
    t.before && t.before(data);

    if (sync) {
      await Promise.all([
        this.doLeave(t, data),
        this.doEnter(t, data, page, wrapper),
      ]);
    } else {
      let leaveResult = false;

      // Leave
      leaveResult = await this.doLeave(t, data);

      // Enter
      /* istanbul ignore else */
      if (leaveResult !== false) {
        await this.doEnter(t, data, page, wrapper, leaveResult);
      }

      // DEV: already removed?
      // data.current.container.remove();
      // hooks.do('currentRemoved', data);
    }

    hooks.do('after', data);
    t.after && t.after(data);

    this.running = false;
  },

  async doLeave(t, data) {
    try {
      hooks.do('beforeLeave', data);
      // CSS: add leave-active
      t.beforeLeave && t.beforeLeave(data);
      hooks.do('leave', data);

      return await runAsync(t.leave)(data).then(leaveData => {
        hooks.do('afterLeave', data);
        // CSS: remove leave-to
        // CSS: remove leave-active
        t.afterLeave && t.afterLeave(data);

        data.current.container.remove();
        hooks.do('currentRemoved', data);

        return leaveData;
      });
    } catch (error) {
      hooks.do('leaveCanceled', data);
      // CSS: remove leave
      // CSS: remove leave-to
      // CSS: remove leave-active
      t.leaveCanceled && t.leaveCanceled(data);

      console.error(error);
      throw new Error('Transition error');
    }
  },

  async doEnter(t, data, page, wrapper, leaveResult) {
    try {
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

      wrapper.appendChild(data.next.container);
      hooks.do('nextAdded', data);
      // CSS: remove enter
      hooks.do('enter', data);
      // CSS: add enter-to

      return await runAsync(t.enter)(data, leaveResult).then(() => {
        hooks.do('afterEnter', data);
        // CSS: remove enter-to
        // CSS: remove enter-active
        t.afterEnter && t.afterEnter(data);
      });
    } catch (error) {
      hooks.do('enterCanceled', data);
      // CSS: remove enter
      // CSS: remove enter-to
      // CSS: remove enter-active
      t.enterCanceled && t.enterCanceled(data);

      console.error(error);
      throw new Error('Transition error');
    }
  },
};
