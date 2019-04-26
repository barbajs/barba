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

// Third-party
import runAsync from 'run-async';
// Definitions
import {
  HooksTransition,
  HooksTransitionMap,
  ITransitionAppear,
  ITransitionData,
  ITransitionFilters,
  ITransitionPage,
  Wrapper,
} from '../defs';
// Hooks
import { hooks } from '../hooks';
// Utils
import { helpers } from '../utils';
// Modules
import { Logger } from './Logger';
import { Store } from './Store';

export class Transitions {
  public logger: Logger = new Logger('@barba/core');
  public store: Store;
  private _running: boolean = false;

  constructor(transitions: ITransitionPage[] = []) {
    this.store = new Store(transitions);
  }

  /**
   * Get resolved transition
   *
   * - based on data
   */
  public get(
    data: ITransitionData,
    filters?: ITransitionFilters
  ): ITransitionAppear | ITransitionPage {
    return this.store.resolve(data, filters);
  }

  /**
   * Animation running status.
   */
  get isRunning(): boolean {
    return this._running;
  }
  set isRunning(status: boolean) {
    this._running = status;
  }

  /**
   * Check for registered appear transition(s).
   */
  get hasAppear(): boolean {
    return this.store.appear.length > 0;
  }

  /**
   * Check for registered self transition.
   */
  get hasSelf(): boolean {
    return this.store.all.some(t => t.name === 'self');
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
  public async doAppear({
    data,
    transition,
  }: {
    data: ITransitionData;
    transition: ITransitionAppear;
  }) {
    const t = transition || {};
    this._running = true;

    try {
      await this._doAsyncHook('beforeAppear', data, t);
      await this.appear(data, t);
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
  public async doPage({
    data,
    transition,
    page,
    wrapper,
  }: {
    data: ITransitionData;
    transition: ITransitionPage;
    page: Promise<string | void>;
    wrapper: Wrapper;
  }) {
    const t = transition || {};
    const sync = t.sync === true || false;

    this._running = true;

    try {
      // Check sync mode, wait for next content
      if (sync) {
        await helpers.update(page, data);
      }

      await this._doAsyncHook('before', data, t);

      if (sync) {
        try {
          this.add(data, wrapper);
          // Before actions
          await this._doAsyncHook('beforeLeave', data, t);
          await this._doAsyncHook('beforeEnter', data, t);

          // Actions
          await Promise.all([this.leave(data, t), this.enter(data, t)]);

          // After actions
          await this._doAsyncHook('afterLeave', data, t);
          await this._doAsyncHook('afterEnter', data, t);
          this.remove(data);
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
            this.leave(data, t),
            helpers.update(page, data),
          ]).then(values => values[0]);

          await this._doAsyncHook('afterLeave', data, t);

          // TODO: check here "valid" page result
          // before going further
        } catch (error) {
          await this._doAsyncHook('leaveCanceled', data, t);
          throw new Error('Transition error [page][leave]');
        }

        try {
          // Enter
          /* istanbul ignore else */
          if (leaveResult !== false) {
            this.add(data, wrapper);
            // TODO: remove current contaienr
            // switch option
            // this.remove(data);
            await this._doAsyncHook('beforeEnter', data, t);
            await this.enter(data, t, leaveResult);
            await this._doAsyncHook('afterEnter', data, t);
          }
        } catch (error) {
          await this._doAsyncHook('leaveCanceled', data, t);
          await this._doAsyncHook('enterCanceled', data, t);
          throw new Error('Transition error [page][enter]');
        }
      }

      this._doAsyncHook('after', data, t);

      // TODO: remove current contaienr
      // v1 behaviour
      this.remove(data);
    } catch (error) {
      // TODO: use cases for cancellation
      this.logger.error(error);

      // TODO: should I throw or should I log…
      throw new Error('Transition error');
    }

    this._running = false;
  }

  /**
   * Appear hook + async "appear" transition.
   */
  public async appear(
    data: ITransitionData,
    t: ITransitionAppear
  ): Promise<void> {
    await hooks.do('appear', data, t);

    return t.appear ? runAsync(t.appear)(data) : Promise.resolve();
  }

  /**
   * Leave hook + async "leave" transition.
   */
  public async leave(data: ITransitionData, t: ITransitionPage): Promise<any> {
    await hooks.do('leave', data, t);

    return t.leave ? runAsync(t.leave)(data) : Promise.resolve();
  }

  /**
   * Enter hook + async "enter" transition.
   */
  public async enter(
    data: ITransitionData,
    t: ITransitionPage,
    leaveResult?: any
  ): Promise<void> {
    await hooks.do('enter', data, t);

    return t.enter ? runAsync(t.enter)(data, leaveResult) : Promise.resolve();
  }

  /**
   * Add next container.
   */
  public add(data: ITransitionData, wrapper: Wrapper): void {
    wrapper.appendChild(data.next.container);
    hooks.do('nextAdded', data);
  }

  /**
   * Remove current container.
   */
  public remove(data: ITransitionData): void {
    if (data.current.container) {
      data.current.container.remove();
      hooks.do('currentRemoved', data);
    }
  }

  /**
   * Do hooks + async transition methods.
   */
  private async _doAsyncHook(
    hook: HooksTransition,
    data: ITransitionData,
    t: HooksTransitionMap
  ): Promise<void> {
    await hooks.do(hook, data, t);

    return t[hook] ? runAsync(t[hook])(data) : Promise.resolve();
  }

  /**
   * Do hooks + sync transition methods.
   */
  // DEV: all transition hooks can be asynchronous…
  // private _doSyncHook(
  //   hook: HooksTransition,
  //   data: ITransitionData,
  //   t: HooksTransitionMap
  // ): void {
  //   hooks.do(hook, data, t);
  //   t[hook] && t[hook](data);
  // }
}
