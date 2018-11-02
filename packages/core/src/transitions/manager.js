import runAsync from 'run-async';

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
   */
  doAppear(transition, data) {
    if (!transition) {
      return new Error('No transition found');
    }
    const t = transition;
    const before = t.beforeAppear ? t.beforeAppear : () => Promise.resolve();
    const after = t.afterAppear ? t.afterAppear : () => Promise.resolve();

    return (
      runAsync(before)(data)
        // Questions:
        // - define what should be passed to hooks…
        // - define events to trigger
        .then((...beforeData) => runAsync(t.appear)(data, ...beforeData))
        .then((...appearData) => runAsync(after)(...appearData))
        .then(() => true)
        // TODO: handle error
        // eslint-disable-next-line no-unused-vars, arrow-body-style
        .catch(err => {
          // DEV
          // console.info('ERR', err);

          return false;
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
   * @param {object} data.trigger transition trigger
   * @returns {undefined} TODO: exact return…
   */
  // eslint-disable-next-line no-unused-vars
  doPage(transition, data) {
    // Check data for next
    // Check mode transition
    // If no content/html or out-in mode, fetch
    // console.info(t, data);
  },
};
