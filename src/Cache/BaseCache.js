var Utils = require('../Utils/Utils.js');

/**
 * BaseCache it's a simple static cache
 *
 * @namespace Barba.BaseCache
 * @type {Object}
 */
var BaseCache = {
  /**
   * The Object that keeps all the key value information
   *
   * @memberOf Barba.BaseCache
   * @type {Object}
   */
  data: {},

  /**
   * Helper to extend this object
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
   * Set a key and value data, mainly Barba is going to save promises
   *
   * @memberOf Barba.BaseCache
   * @param {String} key
   * @param {*} value
   */
  set: function(key, val) {
    this.data[key] = val;
  },

  /**
   * Retrieve the data using the key
   *
   * @memberOf Barba.BaseCache
   * @param  {String} key
   * @return {*}
   */
  get: function(key) {
    return this.data[key];
  },

  /**
   * Flush the cache
   *
   * @memberOf Barba.BaseCache
   */
  reset: function() {
    this.data = {};
  }
};

module.exports = BaseCache;
