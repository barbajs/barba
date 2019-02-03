import { version } from '../package.json';

/**
 * Barba css
 *
 * @namespace @barba/css
 * @type {object}
 */
export const css = {
  /**
   * Version
   *
   * @memberof @barba/css
   * @type {string}
   */
  version,

  /**
   * Transition prefix
   *
   * @memberof @barba/css
   * @type {string}
   * @private
   */
  _prefix: 'barba',

  /**
   * Plugin installation
   *
   * @memberof @barba/css
   * @param {barba} barba barba instance
   * @returns {undefined}
   */
  install(barba, { root = undefined } = {}) {
    this.barba = barba;
    // TODO: rename _wrapper to wrapper
    // TODO: check valid root (HTMLElement, outside container)
    this._root = root;
  },

  /**
   * Plugin initialisation
   *
   * @memberof @barba/css
   * @returns {undefined}
   */
  init() {
    if (!this._root) {
      this._root = this.barba.wrapper;
    }

    // Register hooks
    this.barba.hooks.before(this._getPrefix, this);
    this.barba.hooks.beforeAppear(this._getPrefix, this);

    this.barba.hooks.beforeAppear(this._beforeAppear, this);
    this.barba.hooks.afterAppear(this._afterAppear, this);

    this.barba.hooks.beforeLeave(this._beforeLeave, this);
    this.barba.hooks.leave(this._leave, this);
    this.barba.hooks.afterLeave(this._afterLeave, this);
    this.barba.hooks.beforeEnter(this._beforeEnter, this);
    this.barba.hooks.enter(this._enter, this);
    this.barba.hooks.afterEnter(this._afterEnter, this);
  },

  /**
   * Plugin reset
   *
   * @memberof @barba/css
   * @returns {undefined}
   */
  // DEV
  // destroy() {
  //   this._routeNames = [];
  //   this._routesByName = {};
  // },

  _getPrefix(data, t) {
    this._prefix = t.name || 'barba';
  },

  _beforeAppear() {
    this._root.classList.add(`${this._prefix}-appear`);
    this._root.classList.add(`${this._prefix}-appear-active`);
    // Wait for 1 frame / repaint
    window.requestAnimationFrame(() => {
      this._root.classList.remove(`${this._prefix}-appear`);
      this._root.classList.add(`${this._prefix}-appear-to`);
    });
  },

  _afterAppear() {
    this._root.classList.remove(`${this._prefix}-appear-active`);
    this._root.classList.remove(`${this._prefix}-appear-to`);
  },

  _beforeLeave() {
    this._root.classList.add(`${this._prefix}-leave`);
    this._root.classList.add(`${this._prefix}-leave-active`);
  },

  _leave() {
    // Wait for 1 frame / repaint
    window.requestAnimationFrame(() => {
      this._root.classList.remove(`${this._prefix}-leave`);
      this._root.classList.add(`${this._prefix}-leave-to`);
    });
  },

  _afterLeave() {
    this._root.classList.remove(`${this._prefix}-leave-to`);
    this._root.classList.remove(`${this._prefix}-leave-active`);
  },

  _beforeEnter() {
    this._root.classList.add(`${this._prefix}-enter`);
    this._root.classList.add(`${this._prefix}-enter-active`);
  },

  _enter() {
    // Wait for 1 frame / repaint
    window.requestAnimationFrame(() => {
      this._root.classList.remove(`${this._prefix}-enter`);
      this._root.classList.add(`${this._prefix}-enter-to`);
    });
  },

  _afterEnter() {
    this._root.classList.remove(`${this._prefix}-enter-to`);
    this._root.classList.remove(`${this._prefix}-enter-active`);
  },
};

export default css;
