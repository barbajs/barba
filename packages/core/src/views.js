/**
 * Manage the views
 *
 * @namespace @barba/core/views
 * @type {object}
 */
export default {
  /**
   * Views by namespace
   *
   * @memberof @barba/core/views
   * @type {object}
   * @private
   */
  _byNamespace: {},

  /**
   * Init views
   *
   * @memberof @barba/core/views
   * @param {barba} barba barba instance
   * @param {array} views array of views
   * @returns {views} this instance
   */
  init(barba, views) {
    /* istanbul ignore else */
    if (views) {
      // TODO: add check
      // for valid views? criteria? (namespace property, string ?)
      // or duplicate
      this._byNamespace = views.reduce((acc, view) => {
        acc[view.namespace] = view;
        delete acc[view.namespace].namespace;

        return acc;
      }, {});
    }

    barba.hooks.beforeLeave(this._onBeforeLeave, this);
    barba.hooks.afterLeave(this._onAfterLeave, this);
    barba.hooks.beforeEnter(this._onBeforeEnter, this);
    barba.hooks.afterEnter(this._onAfterEnter, this);

    return this;
  },

  /**
   * Before leave
   *
   * @param {object} data transition data
   * @returns {undefined}
   * @private
   */
  _onBeforeLeave(data) {
    const view = this._byNamespace[data.current.namespace];

    if (view) {
      view.beforeLeave && view.beforeLeave(data);
    }
  },

  /**
   * After leave
   *
   * @param {object} data transition data
   * @returns {undefined}
   * @private
   */
  _onAfterLeave(data) {
    const view = this._byNamespace[data.current.namespace];

    if (view) {
      view.afterLeave && view.afterLeave(data);
    }
  },

  /**
   * Before enter
   *
   * @param {object} data transition data
   * @returns {undefined}
   * @private
   */
  _onBeforeEnter(data) {
    const view = this._byNamespace[data.next.namespace];

    if (view) {
      view.beforeEnter && view.beforeEnter(data);
    }
  },

  /**
   * After enter
   *
   * @param {object} data transition data
   * @returns {undefined}
   * @private
   */
  _onAfterEnter(data) {
    const view = this._byNamespace[data.next.namespace];

    if (view) {
      view.afterEnter && view.afterEnter(data);
    }
  },
};
