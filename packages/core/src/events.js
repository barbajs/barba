/**
 * Manage events
 *
 * @namespace @barba/core/events
 * @type {object}
 */
export default {
  /**
   * Events by name
   *
   * @memberof @barba/core/events
   * @type {object}
   * @private
   */
  _events: {},

  /**
   * Add event
   *
   * @param {string} e event name
   * @param {function} f callback
   * @returns {undefined}
   * @memberof @barba/core/events
   */
  on(e, f) {
    this._events[e] = this._events[e] || [];
    this._events[e].push(f);
  },

  /**
   * Add event for once
   *
   * @param {string} e event name
   * @param {function} f callback
   * @returns {undefined}
   * @memberof @barba/core/events
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
   * @memberof @barba/core/events
   */
  off(e, f) {
    if (e in this._events === false) {
      return;
    }

    this._events[e].splice(this._events[e].indexOf(f), 1);
  },

  /**
   * Trigger event
   *
   * @param {string} e event name
   * @param {...*} args callback arguments
   * @returns {undefined}
   * @memberof @barba/core/events
   */
  trigger(e, ...args) {
    if (e in this._events === false) {
      return;
    }

    this._events[e].forEach(event => {
      event.apply(this, args);
    });
  },
};
