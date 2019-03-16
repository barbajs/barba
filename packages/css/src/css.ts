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
  public name = '@barba/prefetch';
  public version = version;
  public barba: Core;
  public logger: Logger;

  public prefix: string = 'barba';
  public callbacks: ICssCallbacks = {};

  /**
   * Plugin installation.
   */
  public install(barba: Core) {
    this.barba = barba;
    this.logger = new barba.Logger(this.name);
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
    /* tslint:disable:no-string-literal */
    this.barba.transitions['_appear'] = this._appear;
    this.barba.transitions['_leave'] = this._leave;
    this.barba.transitions['_enter'] = this._enter;
    /* tslint:enable:no-string-literal */
  }

  /**
   * Initial state.
   */
  public start(container: HTMLElement, kind: string): void {
    this.add(container, `${kind}-active`); // CSS: add kind-active
    this.add(container, kind); // CSS: add kind
  }

  /**
   * Next frame state.
   */
  public async next(container: HTMLElement, kind: string): Promise<any> {
    await this.nextTick();

    return new Promise(async resolve => {
      this.callbacks[kind] = resolve;

      container.addEventListener('transitionend', resolve, false);

      await this.nextTick();

      this.remove(container, kind); // CSS: remove kind
      this.add(container, `${kind}-to`); // CSS: add kind-to
    });
  }

  /**
   * Final state.
   */
  public end(container: HTMLElement, kind: string): void {
    this.remove(container, `${kind}-to`); // CSS: remove kind-to
    this.remove(container, `${kind}-active`); // CSS: remove kind-active
    container.removeEventListener('transitionend', this.callbacks[kind]);
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
   * `beforeAppear` hook.
   */
  private _beforeAppear(data: ITransitionData): void {
    this.start(data.current.container, 'appear');
  }

  /**
   * `appear` hook.
   */
  private _appear(data: ITransitionData): Promise<any> {
    return this.next(data.current.container, 'appear');
  }

  /**
   * `afterAppear` hook.
   */
  private _afterAppear(data: ITransitionData): void {
    this.end(data.current.container, 'appear');
  }

  /**
   * `beforeLeave` hook.
   */
  private _beforeLeave(data: ITransitionData): void {
    this.start(data.current.container, 'leave');
  }

  /**
   * `leave` hook.
   */
  private _leave(data: ITransitionData): Promise<any> {
    return this.next(data.current.container, 'leave');
  }

  /**
   * `afterLeave` hook.
   */
  private _afterLeave(data: ITransitionData): void {
    this.end(data.current.container, 'leave');
  }

  /**
   * `beforeEnter` hook.
   */
  private _beforeEnter(data: ITransitionData): void {
    this.start(data.next.container, 'enter');
  }

  /**
   * `enter` hook.
   */
  private _enter(data: ITransitionData): Promise<any> {
    return this.next(data.next.container, 'enter');
  }

  /**
   * `afterEnter` hook.
   */
  private _afterEnter(data: ITransitionData): void {
    this.end(data.next.container, 'enter');
  }

  private nextTick(): Promise<number> {
    return new Promise(resolve => {
      window.requestAnimationFrame(resolve);
    });
  }
}

const css = new Css();

export default css;
