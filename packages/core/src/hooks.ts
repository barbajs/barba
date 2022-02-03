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
import { HookFunction, HookMethods, HooksAll } from './defs';
// Modules
import { Logger } from './modules/Logger';
// Utils
import { runAsync } from './utils';
// Types
interface IHookInfos {
  ctx: any;
  fn: HookFunction;
}

export class Hooks extends HookMethods {
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
    'beforeOnce',
    'once',
    'afterOnce',
    'before',
    'beforeLeave',
    'leave',
    'afterLeave',
    'beforeEnter',
    'enter',
    'afterEnter',
    'after',
  ];
  /**
   * Registered hooks.
   *
   * - Unique hook name
   * - Associated data set(s) (callback + context)
   */
  public registered: Map<HooksAll, Set<IHookInfos>> = new Map();

  constructor() {
    super();
    this.init();
  }

  public init() {
    this.registered.clear();
    this.all.forEach(hook => {
      if (!this[hook]) {
        this[hook] = (fn: HookFunction, ctx?: any) => {
          if (!this.registered.has(hook)) {
            this.registered.set(hook, new Set());
          }
          const set = this.registered.get(hook);

          set.add({
            ctx: ctx || {},
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
      // Let's start a chain of promises
      let chain = Promise.resolve();

      this.registered.get(name).forEach(hook => {
        // Chain async hooks promisified
        chain = chain.then(() => runAsync(hook.fn, hook.ctx)(...args));
      });

      return chain.catch(error => {
        this.logger.debug(`Hook error [${name}]`);
        this.logger.error(error);
      });
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
    this.registered.forEach((_value: any, key: string) => registered.push(key));
    this.logger.info(`Registered hooks: ${registered.join(',')}`);
  }
}

const hooks = new Hooks();

export { hooks };
