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
  HooksTransition,
  HooksTransitionMap,
  IResponse,
  ITransitionData,
  ITransitionFilters,
  ITransitionOnce,
  ITransitionPage,
  Wrapper,
} from '../defs';
// Hooks
import { hooks } from '../hooks';
// Utils
import { dom, helpers, runAsync } from '../utils';
// Modules
import { BarbaError } from './Error';
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
  ): ITransitionOnce | ITransitionPage {
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
   * Check for registered once transition(s).
   */
  get hasOnce(): boolean {
    return this.store.once.length > 0;
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
   * ### Do "once" transition.
   *
   * Hooks: see [[HooksOnce]].
   */
  public async doOnce({
    data,
    transition,
  }: {
    data: ITransitionData;
    transition: ITransitionOnce;
  }) {
    const t = transition || {};
    this._running = true;

    try {
      await this._doAsyncHook('beforeOnce', data, t);
      await this.once(data, t);
      await this._doAsyncHook('afterOnce', data, t);
    } catch (error) {
      this._running = false;

      this.logger.debug('Transition error [before/after/once]');
      this.logger.error(error);
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
    page: Promise<IResponse | void>;
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
          await this.add(data, wrapper);
          // Before actions
          await this._doAsyncHook('beforeLeave', data, t);
          await this._doAsyncHook('beforeEnter', data, t);

          // Actions
          await Promise.all([this.leave(data, t), this.enter(data, t)]);

          // After actions
          await this._doAsyncHook('afterLeave', data, t);
          await this._doAsyncHook('afterEnter', data, t);
        } catch (error) {
          // this.logger.debug('Transition error [sync]');
          // this.logger.error(error);
          if (this._isTransitionError(error)) {
            throw new BarbaError(
              (error as Error),
              'Transition error [sync]'
            );
          }
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
          // this.logger.debug('Transition error [before/after/leave]');
          // this.logger.error(error);
          if (this._isTransitionError(error)) {
            throw new BarbaError(
              (error as Error),
              'Transition error [before/after/leave]'
            );
          }
        }

        try {
          // Enter
          /* istanbul ignore else */
          if (leaveResult !== false) {
            await this.add(data, wrapper);

            await this._doAsyncHook('beforeEnter', data, t);
            await this.enter(data, t, leaveResult);
            await this._doAsyncHook('afterEnter', data, t);
          }
        } catch (error) {
          // this.logger.debug('Transition error [before/after/enter]');
          // this.logger.error(error);
          if (this._isTransitionError(error)) {
            throw new BarbaError(
              (error as Error),
              'Transition error [before/after/enter]'
            );
          }
        }
      }

      // Remove current container
      await this.remove(data);

      await this._doAsyncHook('after', data, t);
    } catch (error: any) {
      this._running = false;

      // If "custom/specific" barba error.
      /* istanbul ignore else */
      if (error.name && error.name === 'BarbaError') {
        this.logger.debug(error.label);
        this.logger.error(error.error);

        throw error;
      }

      this.logger.debug('Transition error [page]');
      this.logger.error(error);

      throw error;
    }

    this._running = false;
  }

  /**
   * Once hook + async "once" transition.
   */
  public async once(data: ITransitionData, t: ITransitionOnce): Promise<void> {
    await hooks.do('once', data, t);

    return t.once ? runAsync(t.once, t)(data) : Promise.resolve();
  }

  /**
   * Leave hook + async "leave" transition.
   */
  public async leave(data: ITransitionData, t: ITransitionPage): Promise<any> {
    await hooks.do('leave', data, t);

    return t.leave ? runAsync(t.leave, t)(data) : Promise.resolve();
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

    return t.enter
      ? runAsync(t.enter, t)(data, leaveResult)
      : Promise.resolve();
  }

  /**
   * Add next container.
   */
  public async add(data: ITransitionData, wrapper: Wrapper): Promise<void> {
    dom.addContainer(data.next.container, wrapper);
    hooks.do('nextAdded', data);
  }

  /**
   * Remove current container.
   */
  public async remove(data: ITransitionData): Promise<void> {
    dom.removeContainer(data.current.container);
    hooks.do('currentRemoved', data);
  }

  private _isTransitionError(error: any) {
    if (error.message) {
      // Errors from request
      return !/Timeout error|Fetch error/.test(error.message);
    }

    if (error.status) {
      // Errors from request
      return false;
    }

    return true;
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

    return t[hook] ? runAsync(t[hook], t)(data) : Promise.resolve();
  }
}
