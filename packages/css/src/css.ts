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

import { Core } from '@barba/core/src/core';
import { Logger } from '@barba/core/src/modules/Logger';

import { ICssCallbacks } from './defs/css';

import { version } from '../package.json';

class Css implements IBarbaPlugin<{}> {
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
    this.logger.print(this.version);
    this.barba = barba;
    this._appear = this._appear.bind(this);
    this._leave = this._leave.bind(this);
    this._enter = this._enter.bind(this);
  }

  /**
   * Plugin installation.
   */
  public init() {
    // Register hooks to get prefix
    this.barba.hooks.before(this._getPrefix, this);
    this.barba.hooks.beforeAppear(this._getPrefix, this);

    // Register hook for CSS classes
    this.barba.hooks.beforeAppear(this._beforeAppear, this);
    this.barba.hooks.afterAppear(this._afterAppear, this);
    this.barba.hooks.beforeLeave(this._beforeLeave, this);
    this.barba.hooks.afterLeave(this._afterLeave, this);
    this.barba.hooks.beforeEnter(this._beforeEnter, this);
    this.barba.hooks.afterEnter(this._afterEnter, this);

    // Override main transitions
    this.barba.transitions.appear = this._appear;
    this.barba.transitions.leave = this._leave;
    this.barba.transitions.enter = this._enter;

    // Add empty default transition (force prepend)
    /* istanbul ignore next */
    this.barba.transitions.store.all.unshift({
      name: 'barba',
      appear() {}, // tslint:disable-line:no-empty
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
    await this._nextTick();
    // Apply CSS transition
    this.add(container, `${kind}-active`); // CSS: add kind-active
    await this._nextTick();
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
        await this._nextTick();
        this.remove(container, kind); // CSS: remove kind
        // await this._nextTick();
        this.add(container, `${kind}-to`); // CSS: add kind-to
        await this._nextTick();
      });
    } else {
      this.remove(container, kind); // CSS: remove kind
      await this._nextTick();
      this.add(container, `${kind}-to`); // CSS: add kind-to
      await this._nextTick();
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
  private _getPrefix(data: ITransitionData, t: ITransitionPage): void {
    this.prefix = t.name || 'barba';
  }

  /**
   * Check if CSS transition is applied
   */
  private _checkTransition(container: HTMLElement) {
    // DEV: check for CSS animation property?
    return getComputedStyle(container).transitionDuration !== '0s';
  }

  /**
   * `beforeAppear` hook.
   */
  private _beforeAppear(data: ITransitionData): Promise<void> {
    return this.start(data.current.container, 'appear');
  }

  /**
   * `appear` hook.
   */
  private async _appear(
    data: ITransitionData,
    t: ITransitionPage
  ): Promise<any> {
    await this.barba.hooks.do('appear', data, t);

    return this.next(data.current.container, 'appear');
  }

  /**
   * `afterAppear` hook.
   */
  private _afterAppear(data: ITransitionData): Promise<void> {
    return this.end(data.current.container, 'appear');
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

  private _nextTick(): Promise<number> {
    return new Promise(resolve => {
      window.requestAnimationFrame(resolve);
    });
    // DEV: same result?
    // return new Promise(resolve => {
    //   setTimeout(resolve, 0);
    // });
  }
}

const css = new Css();

export default css;
