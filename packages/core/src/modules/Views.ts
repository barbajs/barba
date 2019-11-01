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
import { HooksView, IView, IViewData } from '../defs';
// Hooks
import { hooks } from '../hooks';
// Utils
import { runAsync } from '../utils';
// Types
type Hook = (data: IViewData) => Promise<void>;

export class Views {
  /**
   * Available hook names for views.
   */
  public names: HooksView[] = [
    'beforeLeave',
    'afterLeave',
    'beforeEnter',
    'afterEnter',
  ];
  /**
   * Registered views by namespace.
   */
  public byNamespace: Map<string, IView> = new Map();

  /**
   * Init views.
   */
  constructor(views: IView[]) {
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
      hooks[name](this._createHook(name));
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
      const { namespace } = name.match(/enter/i) ? data.next : data.current;
      const view = this.byNamespace.get(namespace);

      // TODO: manage self…
      // if (view && data.trigger !== 'self') {
      if (view && view[name]) {
        return runAsync(view[name], view)(data);
      }

      return Promise.resolve();
    };
  }
}
