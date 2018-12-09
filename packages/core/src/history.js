/**
 * Manage the navigation
 *
 * @namespace @barba/core/history
 * @type {object}
 */
export default {
  /**
   * Keep track of the status in historic order
   *
   * @memberof @barba/core/history
   * @type {array}
   * @private
   */
  _history: [],

  /**
   * Add a new set of url and namespace
   *
   * @memberof @barba/core/history
   * @param {string} url page url
   * @param {string} namespace [data-barba-namespace]
   * @returns {undefined}
   */
  add(url, namespace = undefined) {
    this._history.push({ url, namespace });
  },

  /**
   * Remove last set of url and namespace
   *
   * @memberof @barba/core/history
   * @returns {undefined}
   */
  remove() {
    this._history.pop();
  },

  /**
   * Add to history and go to URL
   *
   * @memberof @barba/core/history
   * @param {string} url page url
   * @param {string} namespace [data-barba-namespace]
   * @returns {undefined}
   */
  go(url, namespace = undefined) {
    this.add(url, namespace);

    /* istanbul ignore else  */
    if (window.history) {
      window.history.pushState(null, '', url);
    }
  },

  /**
   * Remove from history and go back
   *
   * @memberof @barba/core/history
   * @param {string} url page url
   * @param {string} namespace [data-barba-namespace]
   * @returns {undefined}
   */
  cancel() {
    this.remove();

    /* istanbul ignore else  */
    if (window.history) {
      window.history.back();
    }
  },

  /**
   * Return information about the current status
   *
   * @memberof @barba/core/history
   * @return {Object} current status
   */
  current() {
    const history = this._history;

    return history[history.length - 1];
  },

  /**
   * Return information about the previous status
   *
   * @memberof @barba/core/history
   * @return {Object} previous status
   */
  previous() {
    const history = this._history;

    if (history.length < 2) {
      return null;
    }

    return history[history.length - 2];
  },
};
