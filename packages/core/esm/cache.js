export default {
  data: {},

  set(key, val) {
    this.data[key] = val;
  },

  get(key) {
    return this.data[key];
  },

  reset() {
    this.data = {};
  },
};
