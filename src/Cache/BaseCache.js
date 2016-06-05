/**
 * BaseCache it's a simple static cache
 *
 * @namespace Barba.BaseCache
 * @type {Object}
 */
var BaseCache = {
  /**
   * The array that keeps everything.
   *
   * @memberOf Barba.BaseCache
   * @type {Array}
   */
  data: {},

  /**
   * Helper to extend the object
   *
   * @memberOf Barba.BaseCache
   * @private
   * @param  {Object} newObject
   * @return {Object} newInheritObject
   */
  extend: function(obj) {
    return Utils.extend(this, obj);
  },

  /**
   * Set a key, value data, mainly Barba is going to save Ajax
   * promise object.
   *
   * @memberOf Barba.BaseCache
   * @param {String} key
   * @param {*} value
   */
  set: function(key, val) {
    this.data[key] = val;
  },

  /**
   * Retrieve the data by the key
   *
   * @memberOf Barba.BaseCache
   * @param  {String} key
   * @return {*}
   */
  get: function(key) {
    return this.data[key];
  },

  /**
   * Reset all the cache stored
   *
   * @memberOf Barba.BaseCache
   */
  reset: function() {
    this.data = {};
  }
};

module.exports = BaseCache;
