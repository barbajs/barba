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

  _promises: {},

  /**
   * Plugin installation
   *
   * @memberof @barba/css
   * @param {barba} barba barba instance
   * @returns {undefined}
   */
  install(barba) {
    this.barba = barba;
    this._appear = this._appear.bind(this);
    this._leave = this._leave.bind(this);
    this._enter = this._enter.bind(this);
  },

  /**
   * Plugin initialisation
   *
   * @memberof @barba/css
   * @returns {undefined}
   */
  init() {
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
    this.barba.manager.appear = this._appear;
    this.barba.manager.leave = this._leave;
    this.barba.manager.enter = this._enter;
  },

  /**
   * Plugin reset
   *
   * @memberof @barba/css
   * @returns {undefined}
   */
  // DEV
  // destroy() {},

  _getPrefix(data, t) {
    this._prefix = t.name || 'barba';
  },

  // States
  _start(container, kind) {
    this._add(container, `${kind}-active`); // CSS: add kind-active
    this._add(container, kind); // CSS: add kind
  },

  async _next(container, kind) {
    await this._nextTick();

    return new Promise(async resolve => {
      this._promises[kind] = resolve;

      container.addEventListener('transitionend', resolve, false);

      await this._nextTick();

      this._remove(container, kind); // CSS: remove kind
      this._add(container, `${kind}-to`); // CSS: add kind-to
    });
  },

  _end(container, kind) {
    this._remove(container, `${kind}-to`); // CSS: remove kind-to
    this._remove(container, `${kind}-active`); // CSS: remove kind-active
    container.removeEventListener('transitionend', this._promises[kind]);
  },

  // Add/remove CSS classes
  _add(el, step) {
    el.classList.add(`${this._prefix}-${step}`);
  },

  _remove(el, step) {
    el.classList.remove(`${this._prefix}-${step}`);
  },

  // Appear
  _beforeAppear(data) {
    this._start(data.current.container, 'appear');
  },

  _appear(t, data) {
    return this._next(data.current.container, 'appear');
  },

  _afterAppear(data) {
    this._end(data.current.container, 'appear');
  },

  // Leave
  _beforeLeave(data) {
    this._start(data.current.container, 'leave');
  },

  _leave(t, data) {
    return this._next(data.current.container, 'leave');
  },

  _afterLeave(data) {
    this._end(data.current.container, 'leave');
  },

  // Enter
  _beforeEnter(data) {
    this._start(data.next.container, 'enter');
  },

  _enter(t, data) {
    return this._next(data.next.container, 'enter');
  },

  _afterEnter(data) {
    this._end(data.next.container, 'enter');
  },

  _nextTick() {
    return new Promise(resolve => {
      window.requestAnimationFrame(resolve);
    });
  },
};

export default css;
