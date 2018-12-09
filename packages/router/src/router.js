import pathToRegexp from 'path-to-regexp';
import { version } from '../package.json';
import { cleanUrl, parsePath } from './utils';

/**
 * Barba router
 *
 * @namespace @barba/router
 * @type {object}
 */
export const router = {
  /**
   * Version
   *
   * @memberof @barba/router
   * @type {string}
   */
  version,

  /**
   * Origin for cleaning URLs
   *
   * @memberof @barba/router
   * @type {string}
   * @private
   */
  _origin: window.location.origin,

  /**
   * List of routes
   *
   * @memberof @barba/router
   * @type {array}
   * @private
   */
  _routes: [],

  /**
   * List of routes by name
   *
   * @memberof @barba/router
   * @type {object}
   * @private
   */
  _routesByName: {},

  /**
   * Plugin installation
   *
   * @memberof @barba/router
   * @param {barba} barba barba instance
   * @param {array} [routes = []] routes
   * @returns {undefined}
   */
  install(barba, { routes = [] } = {}) {
    this.barba = barba;

    routes.forEach(route => {
      const { name, path } = route;
      const regex = pathToRegexp(path, []);

      this._routes.push(name);

      if (this._routesByName[name]) {
        console.warn(`Duplicated route name [${name}]`);
      } else {
        this._routesByName[name] = {
          path,
          regex,
        };
      }
    });

    // Add property to "pageSchema" (current, next)
    barba.pageSchema.route = undefined;
    // Register hooks
    barba.hooks.go(this._resolveRoutes, this);
    barba.hooks.refresh(this._resolveRoutes, this);
  },

  /**
   * Plugin initialisation
   *
   * @memberof @barba/router
   * @returns {undefined}
   */
  init() {
    // Wait for store initialization then add new rule for routes
    this.barba.store.add('rule', {
      position: 1,
      value: {
        name: 'route',
        type: 'strings',
      },
    });
  },

  /**
   * Plugin reset
   *
   * @memberof @barba/router
   * @returns {undefined}
   */
  // DEV
  // destroy() {
  //   this._routes = [];
  //   this._routesByName = {};
  // },

  /**
   * Resolve URL to route name
   *
   * @memberof @barba/router
   * @param {string} url URL to resolve
   * @returns {string|null} route name
   * @private
   */
  _resolve(url) {
    const fullPath = cleanUrl(url, this._origin);
    const { path } = parsePath(fullPath);

    for (let i = 0, l = this._routes.length; i < l; i++) {
      const name = this._routes[i];
      const { regex } = this._routesByName[name];

      if (path.match(regex)) {
        return name;
      }
    }

    return null;
  },

  /**
   * Hooks: do, refresh
   *
   * @memberof @barba/router
   * @param {object} data transition data
   * @param {object} data.current current page
   * @param {object} data.next next page
   * @returns {undefined}
   * @private
   */
  _resolveRoutes(data) {
    const { current, next } = data;

    current.route = current.url ? this._resolve(current.url) : undefined;
    next.route = next.url ? this._resolve(next.url) : undefined;
  },
};

export default router;
