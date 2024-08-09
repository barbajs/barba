/**
 * @barba/css
 * <br><br>
 * ## Barba CSS.
 *
 * - Add CSS classes
 * - Manage CSS transitions
 *
 * @module css
 * @preferred
 */

/***/

// Definitions
import {
  IBarbaPlugin,
  ITransitionData,
  ITransitionPage,
} from '@barba/core/src/defs';
import { ICssOptions } from './defs';

import { Core } from '@barba/core/src/core';
import { Logger } from '@barba/core/src/modules/Logger';

import { ICssCallbacks } from './defs';

import { version } from '../package.json';

export class Css implements IBarbaPlugin<ICssOptions> {
  public name = '@barba/css';
  public version = version;
  public barba: Core;
  public logger: Logger;

  public prefix: string = 'barba';
  public callbacks: ICssCallbacks = {};
  public cb: any;

  // Check if transition property applied
  private _hasTransition: boolean = false;

  /**
   * Plugin installation.
   */
  public install(barba: Core) {
    this.logger = new barba.Logger(this.name);
    this.logger.info(this.version);
    this.barba = barba;
    this._once = this._once.bind(this);
    this._leave = this._leave.bind(this);
    this._enter = this._enter.bind(this);
  }

  /**
   * Plugin installation.
   */
  public init() {
    // Register hooks to get prefix
    this.barba.hooks.before(this._getPrefix, this);
    this.barba.hooks.beforeOnce(this._getPrefix, this);

    // Register hook for CSS classes
    this.barba.hooks.beforeOnce(this._beforeOnce, this);
    this.barba.hooks.afterOnce(this._afterOnce, this);
    this.barba.hooks.beforeLeave(this._beforeLeave, this);
    this.barba.hooks.afterLeave(this._afterLeave, this);
    this.barba.hooks.beforeEnter(this._beforeEnter, this);
    this.barba.hooks.afterEnter(this._afterEnter, this);

    // Override main transitions
    this.barba.transitions.once = this._once;
    this.barba.transitions.leave = this._leave;
    this.barba.transitions.enter = this._enter;

    // Add empty default transition (force prepend)
    /* istanbul ignore next */
    this.barba.transitions.store.all.unshift({
      name: 'barba',
      once() {}, // tslint:disable-line:no-empty
      leave() {}, // tslint:disable-line:no-empty
      enter() {}, // tslint:disable-line:no-empty
    });
    this.barba.transitions.store.update();
  }

  /**
   * Initial state.
   */
  public async start(container: HTMLElement, kind: string): Promise<void> {
    // Set initial CSS values
    this.add(container, kind); // CSS: add kind
    await this.barba.helpers.nextTick();
    // Apply CSS transition
    this.add(container, `${kind}-active`); // CSS: add kind-active
    await this.barba.helpers.nextTick();
  }

  /**
   * Next frame state.
   */
  public async next(container: HTMLElement, kind: string): Promise<any> {
    this._hasTransition = this._checkTransition(container);

    if (this._hasTransition) {
      // We need to listen the end of the animation
      return new Promise(async resolve => {
        this.cb = resolve;
        this.callbacks[kind] = resolve;

        container.addEventListener('transitionend', resolve, false);
        this.remove(container, kind); // CSS: remove kind
        await this.barba.helpers.nextTick();
        this.add(container, `${kind}-to`); // CSS: add kind-to
        await this.barba.helpers.nextTick();
      });
    } else {
      this.remove(container, kind); // CSS: remove kind
      await this.barba.helpers.nextTick();
      this.add(container, `${kind}-to`); // CSS: add kind-to
      await this.barba.helpers.nextTick();
    }
  }

  /**
   * Final state.
   */
  public async end(container: HTMLElement, kind: string): Promise<void> {
    this.remove(container, `${kind}-to`); // CSS: remove kind-to
    this.remove(container, `${kind}-active`); // CSS: remove kind-active
    container.removeEventListener('transitionend', this.callbacks[kind]);
    this._hasTransition = false;
  }

  /**
   * Add CSS classes.
   */
  public add(el: HTMLElement, step: string): void {
    el.classList.add(`${this.prefix}-${step}`);
  }

  /**
   * Remove CSS classes.
   */
  public remove(el: HTMLElement, step: string): void {
    el.classList.remove(`${this.prefix}-${step}`);
  }

  /**
   * Get CSS prefix from transition `name` property.
   */
  private _getPrefix(_data: ITransitionData, t?: ITransitionPage): void {
    this.prefix = t?.name || 'barba';
  }

  /**
   * Check if CSS transition is applied
   */
  private _checkTransition(container: HTMLElement) {
    // DEV: check for CSS animation property?
    return getComputedStyle(container).transitionDuration !== '0s';
  }

  /**
   * `beforeOnce` hook.
   */
  private _beforeOnce(data: ITransitionData): Promise<void> {
    return this.start(data.next.container, 'once');
  }

  /**
   * `once` hook.
   */
  private async _once(data: ITransitionData, t: ITransitionPage): Promise<any> {
    await this.barba.hooks.do('once', data, t);

    return this.next(data.next.container, 'once');
  }

  /**
   * `afterOnce` hook.
   */
  private _afterOnce(data: ITransitionData): Promise<void> {
    return this.end(data.next.container, 'once');
  }

  /**
   * `beforeLeave` hook.
   */
  private _beforeLeave(data: ITransitionData): Promise<void> {
    return this.start(data.current.container, 'leave');
  }

  /**
   * `leave` hook.
   */
  private async _leave(
    data: ITransitionData,
    t: ITransitionPage
  ): Promise<void> {
    await this.barba.hooks.do('leave', data, t);

    return this.next(data.current.container, 'leave');
  }

  /**
   * `afterLeave` hook.
   */
  private _afterLeave(data: ITransitionData): Promise<void> {
    this.end(data.current.container, 'leave');
    // For CSS transitions, we need to remove current container
    // directly after the leave transition
    this.barba.transitions.remove(data);

    return Promise.resolve();
  }

  /**
   * `beforeEnter` hook.
   */
  private _beforeEnter(data: ITransitionData): Promise<void> {
    return this.start(data.next.container, 'enter');
  }

  /**
   * `enter` hook.
   */
  private async _enter(
    data: ITransitionData,
    t: ITransitionPage
  ): Promise<void> {
    await this.barba.hooks.do('enter', data, t);

    return this.next(data.next.container, 'enter');
  }

  /**
   * `afterEnter` hook.
   */
  private _afterEnter(data: ITransitionData): Promise<void> {
    return this.end(data.next.container, 'enter');
  }
}

const css = new Css();

export default css;
