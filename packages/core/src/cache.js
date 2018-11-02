export default {
  data: {},

  /**
   * Set value to cache
   *
   * @param {string} key key
   * @param {*} val value
   * @returns {*} value
   */
  set(key, val) {
    this.data[key] = val;

    return val;
  },

  /**
   * Get value from cache
   *
   * @param {string} key key
   * @returns {*} value
   */
  get(key) {
    return this.data[key];
  },

  /**
   * Check if value exists into cache
   *
   * @param {string} key key
   * @returns {boolean} check result
   */
  has(key) {
    return key in this.data;
  },

  /**
   * Reset cache
   *
   * @returns {undefined}
   */
  reset() {
    this.data = {};
  },
};
