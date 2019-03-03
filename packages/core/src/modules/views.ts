/**
 * @module core/modules/views
 */
import { Views } from '../defs/modules';
import { HooksView, HookViewData, View } from '../defs/shared';
// ---
import { hooks } from '.';

const _names: HooksView[] = [
  'beforeAppear',
  'afterAppear',
  'beforeLeave',
  'afterLeave',
  'beforeEnter',
  'afterEnter',
];
const _byNamespace: Map<string, View> = new Map();

/**
 * Manage the views
 *
 * @module core/modules/views
 */
const views: Views = {
  /**
   * Init views
   */
  init(views) {
    if (views.length === 0) {
      return;
    }

    // TODO: add check
    // for valid views? criteria? (namespace property, string ?)
    // or duplicate
    views.forEach(view => {
      _byNamespace.set(view.namespace, view);
    });

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
   */
  _getHook(name) {
    return data => {
      const view = _byNamespace.get(data.current.namespace);

      if (view) {
        view[name] && view[name](data);
      }
    };
  },
};

export { views };
