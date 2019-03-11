/**
 * @barba/core/modules/hooks
 * <br><br>
 * ## Hooks manager.
 *
 * - Register and trigger hooks
 *
 * Hooks can be easily registered:
 *
 * ```js
 * hooks.leave(callback, context);
 * ```
 *
 * @module core/modules/hooks
 * @preferred
 */

/***/

// Definitions
import { HooksAll } from './defs';
// Modules
import { Logger } from './modules/Logger';
// Types
type HookData = {
  fn: Function;
  ctx: any;
};

export class Hooks {
  /**
   * Allow the use of `hooks[name](cb, ctx)`.
   */
  [key: string]: any;
  // [key in HooksAll]?: any;
  public logger: Logger = new Logger('@barba/core');
  /**
   * All available hooks.
   *
   * See [[HooksAll]]
   */
  // TODO: get hooks from defs (DRY)?
  public all: HooksAll[] = [
    'go',
    'reset',
    'currentAdded',
    'currentRemoved',
    'nextAdded',
    'nextRemoved',
    'beforeAppear',
    'appear',
    'afterAppear',
    'appearCanceled',
    'before',
    'beforeLeave',
    'leave',
    'afterLeave',
    'leaveCanceled',
    'beforeEnter',
    'enter',
    'afterEnter',
    'enterCanceled',
    'after',
  ];
  /**
   * Registered hooks.
   *
   * - Unique hook name
   * - Associated data set(s) (callback + context)
   */
  public registered: Map<HooksAll, Set<HookData>> = new Map();

  constructor() {
    this.init();
  }

  init() {
    this.registered.clear();
    this.all.forEach(hook => {
      if (!this[hook]) {
        this[hook] = (fn: Function, ctx: any = null) => {
          if (!this.registered.has(hook)) {
            this.registered.set(hook, new Set());
          }
          const set = this.registered.get(hook);

          set.add({
            fn,
            ctx,
          });
        };
      }
    });
  }

  /**
   * Do hook.
   *
   * Trigger registered hooks.
   */
  do(hook: HooksAll, ...args: any) {
    if (this.registered.has(hook)) {
      this.registered.get(hook).forEach(hook => {
        hook.fn.apply(hook.ctx, args);
      });
    }
  }

  clear(): void {
    this.all.forEach(hook => {
      delete this[hook];
    });

    this.init();
  }

  /**
   * Help, print available and registered hooks.
   */
  help() {
    this.logger.info(`[@barba/core] Available hooks: ${this.all}`);
    this.logger.info(
      `[@barba/core] Registered hooks: ${Object.keys(this.registered)}`
    );
  }
}

const hooks = new Hooks();

export { hooks };
