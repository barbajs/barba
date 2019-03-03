/**
 * @module core/modules/hooks
 */
import { Hooks } from '../defs/modules';
import { HooksAll } from '../defs/shared';
// ---
import { Logger } from '../utils';

type HookData = {
  fn: Function;
  ctx: any;
};

const _logger: Logger = new Logger('@barba/core');
const _all: HooksAll[] = [
  'go',
  'refresh',
  // Containers
  'currentAdded',
  'currentRemoved',
  'nextAdded',
  'nextRemoved',
  // Transitions
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
const _registered: Map<HooksAll, Set<HookData>> = new Map();

/**
 * Manage the hooks
 */
const hooks: Hooks = {
  /**
   * Init all hooks
   *
   * A hook is a function that receive:
   * - function to execute
   * - optional context
   */
  init() {
    _registered.clear();
    _all.forEach(hook => {
      if (!this[hook]) {
        this[hook] = (fn: Function, ctx: any = null) => {
          const set = _registered.get(hook) || new Set();

          set.add({
            fn,
            ctx,
          });
        };
      }
    });

    return this;
  },

  /**
   * Do hook
   */
  do(hook, ...args) {
    if (hook in _registered) {
      _registered.get(hook).forEach(hook => {
        hook.fn.apply(hook.ctx, args);
      });
    }
  },

  /**
   * Help, print available and registered hooks
   */
  help() {
    _logger.info(`[@barba/core] Available hooks: ${_all}`);
    _logger.info(`[@barba/core] Registered hooks: ${Object.keys(_registered)}`);
  },
};

export { hooks };
