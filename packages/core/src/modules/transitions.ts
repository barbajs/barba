/**
 * @barba/core/modules/transitions
 * <br><br>
 * ## Transitions manager.
 *
 * - Handle hooks and transition lifecycle
 *
 * @module core/modules/transitions
 * @preferred
 */

/***/

// Definitions
import {
  TransitionData,
  TransitionPage,
  TransitionAppear,
  HooksTransition,
  HooksTransitionMap,
  Wrapper,
} from '../defs';
// Third-party
import runAsync from 'run-async';
// Hooks
import { hooks } from '../hooks';
// Modules
import { Logger } from './Logger';
import { Store } from './store';
// Utils
import { helpers } from '../utils';

export class Transitions {
  public logger: Logger = new Logger('@barba/core');
  public store: Store;

  constructor(transitions: TransitionPage[] = []) {
    this.store = new Store(transitions);
  }

  private _running: boolean = false;

  /**
   * Get resolved transition
   */
  get(
    data: TransitionData,
    appear: boolean = false
  ): TransitionAppear | TransitionPage {
    return this.store.resolve(data, appear);
  }

  /**
   * Animation running status.
   */
  get isRunning(): boolean {
    return this._running;
  }

  /**
   * Check for registered appear transition(s).
   */
  get hasAppear(): boolean {
    return this.store.appear.length > 0;
  }

  /**
   * ### Wait indicator.
   *
   * Tells Barba to get next page data<br>
   * before starting the resolution<br>
   * because some registered transitions need<br>
   * next page data to be resolved (eg: `sync: true`, `to: { namespace }`, …)
   */
  get shouldWait(): boolean {
    return this.store.all.some(t => (t.to && !t.to.route) || t.sync);
  }

  /**
   * ### Do "appear" transition.
   *
   * Hooks: see [[HooksAppear]].
   */
  async doAppear({
    data,
    transition,
  }: {
    data: TransitionData;
    transition: TransitionAppear;
  }) {
    if (!transition) {
      this.logger.warn('No transition found');

      return;
    }

    this._running = true;
    const t = transition;

    try {
      await this._doAsyncHook('beforeAppear', data, t);
      await this._appear(data, t);
      await this._doAsyncHook('afterAppear', data, t);
    } catch (error) {
      this.logger.error(error);
      await this._doAsyncHook('appearCanceled', data, t);
      // TODO: should I throw or should I log…
      throw new Error('Transition error [appear]');
    }

    this._running = false;
  }

  /**
   * ### Do "page" transition.
   *
   * Hooks: see [[HooksPage]].
   *
   * `sync: false` (default) order:
   *
   * 1. before
   * 2. beforeLeave
   * 3. leave
   * 4. afterLeave
   * 5. beforeEnter
   * 6. enter
   * 7. afterEnter
   * 8. after
   *
   * `sync: true` order:
   *
   * 1. before
   * 2. beforeLeave
   * 3. beforeEnter
   * 4. leave & enter
   * 5. afterLeave
   * 6. afterEnter
   * 7. after
   */
  async doPage({
    data,
    transition,
    page,
    wrapper,
  }: {
    data: TransitionData;
    transition: TransitionPage;
    page: Promise<string | void>;
    wrapper: Wrapper;
  }) {
    !transition && this.logger.warn('No transition found');

    const t = transition || {};
    const sync = t.sync === true || false;

    this._running = true;

    try {
      // Check sync mode, wait for next content
      if (sync) {
        await helpers.updateNext(page, data.next);
      }

      await this._doAsyncHook('before', data, t);

      if (sync) {
        try {
          // Before actions
          await this._doAsyncHook('beforeLeave', data, t);
          await this._doAsyncHook('beforeEnter', data, t);

          this._addNext(data, wrapper);

          // Actions
          await Promise.all([this._leave(data, t), this._enter(data, t)]);

          // After actions
          await this._doAsyncHook('afterLeave', data, t);
          this._removeCurrent(data);
          await this._doAsyncHook('afterEnter', data, t);
        } catch (error) {
          await this._doAsyncHook('leaveCanceled', data, t);
          await this._doAsyncHook('enterCanceled', data, t);
          throw new Error('Transition error [page][sync]');
        }
      } else {
        let leaveResult: any = false;

        try {
          // Leave
          await this._doAsyncHook('beforeLeave', data, t);

          leaveResult = await Promise.all([
            this._leave(data, t),
            helpers.updateNext(page, data.next),
          ]).then(values => values[0]);
          // .catch(error => {
          //   throw error;
          // });

          await this._doAsyncHook('afterLeave', data, t);

          // TODO: check here "valid" page result
          // before going further
          this._removeCurrent(data);
        } catch (error) {
          await this._doAsyncHook('leaveCanceled', data, t);
          throw new Error('Transition error [page][leave]');
        }

        try {
          // Enter
          /* istanbul ignore else */
          if (leaveResult !== false) {
            await this._doAsyncHook('beforeEnter', data, t);
            this._addNext(data, wrapper);
            await this._enter(data, t, leaveResult);
            await this._doAsyncHook('afterEnter', data, t);
          }
        } catch (error) {
          await this._doAsyncHook('leaveCanceled', data, t);
          await this._doAsyncHook('enterCanceled', data, t);
          throw new Error('Transition error [page][enter]');
        }
      }

      this._doAsyncHook('after', data, t);
    } catch (error) {
      // TODO: use cases for cancellation
      this.logger.error(error);
      await this._doAsyncHook('leaveCanceled', data, t);
      await this._doAsyncHook('enterCanceled', data, t);

      // TODO: should I throw or should I log…
      // throw error;
    }

    this._running = false;
  }

  /**
   * Appear hook + async "appear" transition.
   */
  private _appear(data: TransitionData, t: TransitionAppear): Promise<void> {
    hooks.do('appear', data, t);

    return t.appear ? runAsync(t.appear)(data) : Promise.resolve();
  }

  /**
   * Leave hook + async "leave" transition.
   */
  private _leave(data: TransitionData, t: TransitionPage): Promise<any> {
    hooks.do('leave', data, t);

    return t.leave ? runAsync(t.leave)(data) : Promise.resolve();
  }

  /**
   * Enter hook + async "enter" transition.
   */
  private _enter(
    data: TransitionData,
    t: TransitionPage,
    leaveResult?: any
  ): Promise<void> {
    hooks.do('enter', data, t);

    return t.enter ? runAsync(t.enter)(data, leaveResult) : Promise.resolve();
  }

  /**
   * Do hooks + async transition methods.
   */
  private _doAsyncHook(
    hook: HooksTransition,
    data: TransitionData,
    t: HooksTransitionMap
  ): Promise<void> {
    hooks.do(hook, data, t);

    return t[hook] ? runAsync(t[hook])(data) : Promise.resolve();
  }

  /**
   * Do hooks + sync transition methods.
   */
  // DEV: all transition hooks can be asynchronous…
  // private _doSyncHook(
  //   hook: HooksTransition,
  //   data: TransitionData,
  //   t: HooksTransitionMap
  // ): void {
  //   hooks.do(hook, data, t);
  //   t[hook] && t[hook](data);
  // }

  /**
   * Add next container.
   */
  private _addNext(data: TransitionData, wrapper: Wrapper): void {
    wrapper.appendChild(data.next.container);
    hooks.do('nextAdded', data);
  }

  /**
   * Remove current container.
   */
  private _removeCurrent(data: TransitionData): void {
    data.current.container.remove();
    hooks.do('currentRemoved', data);
  }
}
