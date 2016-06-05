/**
 * HistoryManager helps to keep track of the navigation
 *
 * @namespace Barba.Pjax.HistoryManager
 * @type {Object}
 */
var HistoryManager = {
  /**
   * Keep track of the states in historic order
   *
   * @memberOf Barba.Pjax.HistoryManager
   * @readOnly
   * @type {Array}
   */
  states: [],

  /**
   * Add a new set of url and namespace
   *
   * @memberOf Barba.Pjax.HistoryManager
   * @param {String} url
   * @param {String} namespace
   * @private
   */
  add: function(url, namespace) {
    if (!namespace)
      namespace = undefined;

    this.states.push({
      url: url,
      namespace: namespace
    });
  },

  /**
   * Return information about the current status
   *
   * @memberOf Barba.Pjax.HistoryManager
   * @return {Object}
   */
  currentStatus: function() {
    return this.states[this.states.length - 1];
  },

  /**
   * Return information about the previous status
   *
   * @memberOf Barba.Pjax.HistoryManager
   * @return {Object}
   */
  prevStatus: function() {
    var states = this.states;

    if (states.length < 2)
      return null;

    return states[states.length - 2];
  }
};

module.exports = HistoryManager;
