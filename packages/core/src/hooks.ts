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

// Third-party
import runAsync from 'run-async';
// Definitions
import { HooksAll } from './defs';
// Modules
import { Logger } from './modules/Logger';
// Types
interface IHookData {
  ctx: any;
  fn: () => Promise<void>;
}

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
    'ready',
    'page',
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
  public registered: Map<HooksAll, Set<IHookData>> = new Map();

  constructor() {
    this.init();
  }

  public init() {
    this.registered.clear();
    this.all.forEach(hook => {
      if (!this[hook]) {
        this[hook] = (fn: () => Promise<void>, ctx: any = null) => {
          if (!this.registered.has(hook)) {
            this.registered.set(hook, new Set());
          }
          const set = this.registered.get(hook);

          set.add({
            ctx,
            fn,
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
  public do(name: HooksAll, ...args: any): Promise<any> {
    if (this.registered.has(name)) {
      // Let's a promises chain
      let chain = Promise.resolve();

      this.registered.get(name).forEach(hook => {
        // If needed, bind the right context
        const fn = hook.ctx ? hook.fn.bind(hook.ctx) : hook.fn;
        // Chain async hooks promisified
        chain = chain.then(() => runAsync(fn)(...args));
      });

      return chain;
    }

    return Promise.resolve();
  }

  public clear(): void {
    this.all.forEach(hook => {
      delete this[hook];
    });

    this.init();
  }

  /**
   * Help, print available and registered hooks.
   */
  public help(): void {
    this.logger.info(`Available hooks: ${this.all.join(',')}`);
    const registered: string[] = [];
    this.registered.forEach((value, key) => registered.push(key));
    this.logger.info(`Registered hooks: ${registered.join(',')}`);
  }
}

const hooks = new Hooks();

export { hooks };
