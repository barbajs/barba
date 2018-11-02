export default {
  events: {},

  /**
   * Add event
   *
   * @param {string} e event name
   * @param {function} f callback
   * @returns {undefined}
   */
  on(e, f) {
    this.events[e] = this.events[e] || [];
    this.events[e].push(f);
  },

  /**
   * Add event for once
   *
   * @param {string} e event name
   * @param {function} f callback
   * @returns {undefined}
   */
  once(e, f) {
    const newf = (...args) => {
      this.off(e, newf);
      f.apply(this, args);
    };

    this.on(e, newf);
  },

  /**
   * Remove event
   *
   * @param {string} e event name
   * @param {function} f callback
   * @returns {undefined}
   */
  off(e, f) {
    if (e in this.events === false) {
      return;
    }

    this.events[e].splice(this.events[e].indexOf(f), 1);
  },

  /**
   * Trigger event
   *
   * @param {string} e event name
   * @param {...*} args callback arguments
   * @returns {undefined}
   */
  trigger(e, ...args) {
    if (e in this.events === false) {
      return;
    }

    this.events[e].forEach(event => {
      event.apply(this, args);
    });
  },
};
