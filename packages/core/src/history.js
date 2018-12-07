/**
 * Manage the navigation
 *
 * @namespace @barba/core/history
 * @type {Object}
 */
export default {
  /**
   * Keep track of the status in historic order
   *
   * @memberOf @barba/core/history
   * @readOnly
   * @type {Array}
   */
  _history: [],

  /**
   * Add a new set of url and namespace
   *
   * @memberOf @barba/core/history
   * @param {string} url page url
   * @param {string} namespace [data-barba-namespace]
   * @returns {undefined}
   * @private
   */
  add(url, namespace = undefined) {
    this._history.push({ url, namespace });
  },

  remove() {
    this._history.pop();
  },

  go(url, namespace = undefined) {
    this.add(url, namespace);

    if (window.history) {
      window.history.pushState(null, '', url);
    }
  },

  cancel() {
    this.remove();

    if (window.history) {
      window.history.back();
    }
  },

  /**
   * Return information about the current status
   *
   * @memberOf @barba/core/history
   * @return {Object} current status
   */
  current() {
    const history = this._history;

    return history[history.length - 1];
  },

  /**
   * Return information about the previous status
   *
   * @memberOf @barba/core/history
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
