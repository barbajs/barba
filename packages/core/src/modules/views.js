import { hooks } from '../modules';

/**
 * Manage the views
 *
 * @module core/modules/views
 */
/**
 * @typedef module:core/modules/views.view
 * @type {object}
 * @property {Function} [beforeEnter] - The beforeEnter hook
 */
/**
 * Manage the views
 *
 * @namespace @barba/core/views
 * @type {object}
 */
export const views = {
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
   * @param {array} views array of views
   * @returns {undefined}
   */
  init(views) {
    if (views.length === 0) {
      return;
    }

    // TODO: add check
    // for valid views? criteria? (namespace property, string ?)
    // or duplicate
    this._byNamespace = views.reduce((acc, view) => {
      acc[view.namespace] = view;
      delete acc[view.namespace].namespace;

      return acc;
    }, {});

    hooks.beforeAppear(this._getHook('beforeAppear'), this);
    hooks.afterAppear(this._getHook('afterAppear'), this);
    hooks.beforeLeave(this._getHook('beforeLeave'), this);
    hooks.afterLeave(this._getHook('afterLeave'), this);
    hooks.beforeEnter(this._getHook('beforeEnter'), this);
    hooks.afterEnter(this._getHook('afterEnter'), this);
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
