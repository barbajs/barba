export default {
  data: {},

  set(key, val) {
    this.data[key] = val;
  },

  get(key) {
    return this.data[key];
  },

  has(key) {
    return key in this.data;
  },

  reset() {
    this.data = {};
  },
};
