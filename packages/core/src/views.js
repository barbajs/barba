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
    if (views.length === 0) {
      return this;
    }

    // TODO: add check
    // for valid views? criteria? (namespace property, string ?)
    // or duplicate
    this._byNamespace = views.reduce((acc, view) => {
      acc[view.namespace] = view;
      delete acc[view.namespace].namespace;

      return acc;
    }, {});

    barba.hooks.beforeAppear(this._getHook('beforeAppear'), this);
    barba.hooks.afterAppear(this._getHook('afterAppear'), this);
    barba.hooks.beforeLeave(this._getHook('beforeLeave'), this);
    barba.hooks.afterLeave(this._getHook('afterLeave'), this);
    barba.hooks.beforeEnter(this._getHook('beforeEnter'), this);
    barba.hooks.afterEnter(this._getHook('afterEnter'), this);

    return this;
  },

  /**
   * Create the hook method
   * Get view based on namespace
   * Execute callback with transition data
   *
   * @param {string} name view method name
   * @returns {function} callback
   * @private
   */
  _getHook(name) {
    return data => {
      const view = this._byNamespace[data.current.namespace];

      if (view) {
        view[name] && view[name](data);
      }
    };
  },
};
