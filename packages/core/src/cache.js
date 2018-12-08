/**
 * Cache for storing URL / HTML
 *
 * @namespace @barba/core/cache
 * @type {object}
 */
export default {
  /**
   * Cache object
   *
   * @memberof @barba/core/cache
   * @type {object}
   * @private
   */
  _data: {},

  /**
   * Set value to cache
   *
   * @memberof @barba/core/cache
   * @param {string} key key
   * @param {*} val value
   * @returns {*} value
   */
  set(key, val) {
    this._data[key] = val;

    return val;
  },

  /**
   * Get value from cache
   *
   * @memberof @barba/core/cache
   * @param {string} key key
   * @returns {*} value
   */
  get(key) {
    return this._data[key];
  },

  /**
   * Check if value exists into cache
   *
   * @memberof @barba/core/cache
   * @param {string} key key
   * @returns {boolean} check result
   */
  has(key) {
    return key in this._data;
  },

  /**
   * Reset cache
   *
   * @memberof @barba/core/cache
   * @returns {undefined}
   */
  reset() {
    this._data = {};
  },
};
