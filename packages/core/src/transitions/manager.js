import runAsync from 'run-async';
import dom from '../dom';

// TODO: define events to trigger
// TODO: define hook params (all vs specific -current or next-)

export default {
  /**
   * Do "appear" transition
   *
   * @param {object} transition transition to play
   * @param {object} data transition data
   * @param {object} data.current current page
   * @param {object} data.next next page
   * @param {object} data.trigger transition trigger
   * @returns {undefined} TODO: exact return…
   * @memberof manager
   */
  doAppear({ transition, data }) {
    if (!transition) {
      throw new Error('No transition found');
    }
    const t = transition;
    // TODO: sync or async?
    const beforeAppear = t.beforeAppear
      ? t.beforeAppear
      : () => Promise.resolve();
    const afterAppear = t.afterAppear ? t.afterAppear : () => Promise.resolve();

    return (
      // BeforeAppear
      runAsync(beforeAppear)(data)
        // Appear
        .then((...extra) => runAsync(t.appear)(data, ...extra))
        // AfterAppear
        .then((...extra) => runAsync(afterAppear)(...extra))
        // Finalize
        .then(() => true)
        .catch(err => {
          throw err;
        })
    );
  },

  /**
   * Do "page" transition
   *
   * @param {object} transition transition to play
   * @param {object} data transition data
   * @param {object} data.current current page
   * @param {object} data.next next page
   * @param {*} data.trigger transition trigger (HTMLElement or programatic) TODO: type?
   * @param {promise} page next page
   * @param {HTMLElement} wrapper barba wrapper
   * @param {boolean} back if we navigate to previous page
   * @returns {undefined} TODO: exact return…
   * @memberof manager
   */
  async doPage({ transition, data, page, wrapper }) {
    if (!transition) {
      throw new Error('No transition found');
    }

    const t = transition;
    const sync = t.sync === true || false;

    // Check mode transition, wait for next content
    // if (mode === 'sync' || mode === 'in-out') {
    if (sync) {
      await page.then(html => {
        const nextDocument = dom.toDocument(html);

        data.next.namespace = dom.getNamespace(nextDocument);
        data.next.container = dom.getContainer(nextDocument);
        data.next.html = dom.getHtml(nextDocument);
      });
    }

    // Create empty promises for missing optional hooks
    // const beforeEnter = t.beforeEnter ? t.beforeEnter : () => Promise.resolve();
    // const afterEnter = t.afterEnter ? t.afterEnter : () => Promise.resolve();
    // const beforeLeave = t.beforeLeave ? t.beforeLeave : () => Promise.resolve();
    // const afterLeave = t.afterLeave ? t.afterLeave : () => Promise.resolve();

    t.before && t.before(data);
    t.beforeLeave && t.beforeLeave(data);
    sync && t.beforeEnter && t.beforeEnter(data);

    if (sync) {
      wrapper.appendChild(data.next.container);
      await Promise.all([runAsync(t.leave)(data), runAsync(t.enter)(data)])
        .then(() => {
          t.afterLeave && t.afterLeave(data);
          t.afterEnter && t.afterEnter(data);
          t.after && t.after(data);
          data.current.container.remove();
        })
        .catch(err => {
          t.leaveCancelled && t.leaveCancelled(data);
          t.enterCancelled && t.enterCancelled(data);
          console.error(err);
          throw new Error('Transition error');
        });
    } else {
      await runAsync(t.leave)(data)
        .then(() => {
          t.afterLeave && t.afterLeave(data);
          data.current.container.remove();
        })
        .catch(err => {
          t.leaveCancelled && t.leaveCancelled(data);
          console.error(err);
          throw new Error('Transition error');
        })
        .then(async () => {
          // If no next data, wait
          if (!data.next.html) {
            await page.then(html => {
              const nextDocument = dom.toDocument(html);

              data.next.namespace = dom.getNamespace(nextDocument);
              data.next.container = dom.getContainer(nextDocument);
              data.next.html = dom.getHtml(nextDocument);
            });
          }
          wrapper.appendChild(data.next.container);

          return runAsync(t.enter)(data);
        })
        .then(() => {
          t.afterEnter && t.afterEnter(data);
          t.after && t.after(data);
          data.current.container.remove();
        })
        .catch(err => {
          t.enterCancelled && t.enterCancelled(data);
          console.error(err);
          throw new Error('Transition error');
        });
    }

    // // BeforeEnter
    // runAsync(beforeEnter)(data)
    //   // Enter
    //   .then((...extra) => {
    //     // CSS: add enter
    //     // CSS: add enter-active

    //     // if (mode === 'sync' || mode === 'in-out') {
    //     if (sync) {
    //       console.info('append');
    //       wrapper.appendChild(data.next.container);
    //     }

    //     // CSS: remove enter
    //     // CSS: add enter-to

    //     return runAsync(t.enter)(data, ...extra);
    //   })
    //   // AfterEnter
    //   .then((...extra) => {
    //     // CSS: remove enter-active
    //     // CSS: remove enter-to
    //     return extra;
    //   })
    //   // BeforeLeave
    //   .then((...extra) => {
    //     return extra;
    //   })
    //   // Leave
    //   .then(async (...extra) => {
    //     // If no next data, wait
    //     if (!data.next.html) {
    //       await page.then(html => {
    //         const nextDocument = dom.toDocument(html);

    //         data.next.namespace = dom.getNamespace(nextDocument);
    //         data.next.container = dom.getContainer(nextDocument);
    //         data.next.html = dom.getHtml(nextDocument);
    //       });
    //     }

    //     // CSS: add leave
    //     // CSS: add leave-active

    //     if (!sync) {
    //       wrapper.appendChild(data.next.container);
    //     }

    //     // CSS: remove leave
    //     // CSS: add leave-to

    //     return runAsync(t.leave)(data, ...extra);
    //   })
    //   // AfterLeave
    //   .then((...extra) => {
    //     // CSS: remove leave-active
    //     // CSS: remove leave-to

    //     return runAsync(afterLeave)(...extra);
    //   })
    //   // Finalize
    //   .then(() => {
    //     data.current.container.remove();

    //     resolve(true);
    //   })
    //   // TODO: handle error
    //   // eslint-disable-next-line no-unused-vars, arrow-body-style
    //   .catch(err => {
    //     // DEV
    //     console.error('ERR', err);

    //     reject(err);
    //   });
    // });

    // return new Promise(resolve => {
    //   setTimeout(() => {
    //     resolve();
    //   }, 2000);
    // });
  },
};
