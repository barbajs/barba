/**
 * @barba/core/modules/views
 * <br><br>
 * ## Views manager.
 *
 * @module core/modules/views
 * @preferred
 */

/***/

// Definitions
import { HooksView, HookViewData, View } from '../defs';
// Hooks
import { hooks } from '../hooks';
// Types
type Hook = (data: HookViewData) => void;

export class Views {
  /**
   * Available hook names for views.
   */
  public names: HooksView[] = [
    'beforeAppear',
    'afterAppear',
    'beforeLeave',
    'afterLeave',
    'beforeEnter',
    'afterEnter',
  ];
  /**
   * Registered views by namespace.
   */
  public byNamespace: Map<string, View> = new Map();

  /**
   * Init views.
   */
  constructor(views: View[]) {
    if (views.length === 0) {
      return;
    }

    // TODO: add check
    // for valid views? criteria? (namespace property, string ?)
    // or duplicate
    views.forEach(view => {
      this.byNamespace.set(view.namespace, view);
    });

    this.names.forEach(name => {
      hooks[name](this._createHook(name), this);
    });
  }

  /**
   * Create the hook method.
   *
   * - get view based on namespace
   * - execute callback with transition data
   */
  private _createHook(name: HooksView): Hook {
    return data => {
      const view = this.byNamespace.get(data.current.namespace);

      if (view) {
        view[name] && view[name](data);
      }
    };
  }
}
