/**
 * HistoryManager helps to keep track of the navigation
 *
 * @namespace Barba.Pjax.HistoryManager
 */
var HistoryManager = {
  /**
   * Keep track of the states in historic order
   * @memberOf Barba.Pjax.HistoryManger
   * @type {Array}
   */
  states: [],

  /**
   * Add a new set of url and namespace
   * @param {String} url
   * @param {String} [namespae] namespace
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
   * [currentStatus description]
   * @return {Object} [description]
   */
  currentStatus: function() {
    return this.states[this.states.length - 1];
  },

  /**
   * Return the last url from states
   * @return {String} currentUrl
   */
  currentUrl: function() {
    return this.currentStatus.url;
  },

  /**
   * [currentNamespace description]
   * @return {String} currentNamespace
   */
  currentNamespace: function() {
    return this.currentStatus.namespace;
  },

  /**
   * [prevStatus description]
   * @return {Object} [description]
   */
  prevStatus: function() {
    var states = this.states;

    if (states.length < 2)
      return null;

    return states[states.length - 2];
  }
};

module.exports = HistoryManager;
