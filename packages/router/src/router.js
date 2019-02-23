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
   * List of route names
   *
   * @memberof @barba/router
   * @type {Array}
   * @private
   */
  _routeNames: [],

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
      const keys = [];
      const regex = pathToRegexp(path, keys);

      if (this._routeNames.indexOf(name) > -1) {
        console.warn(`[@barba/router] Duplicated route name (${name})`);
      } else {
        this._routeNames.push(name);
        this._routesByName[name] = {
          path,
          regex,
          keys,
        };
      }
    });

    // Add property to "pageSchema" (current, next)
    barba.pageSchema.route = undefined;
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
    // Register hooks
    this.barba.hooks.go(this._resolveRoutes, this);
    this.barba.hooks.refresh(this._resolveRoutes, this);
  },

  /**
   * Plugin reset
   *
   * @memberof @barba/router
   * @returns {undefined}
   */
  // DEV
  // destroy() {
  //   this._routeNames = [];
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
    const { path, query, hash } = parsePath(fullPath);
    const output = {
      hash,
      path,
      query,
      url,
      params: {},
    };

    for (let i = 0, l = this._routeNames.length; i < l; i++) {
      const name = this._routeNames[i];
      const { regex, keys } = this._routesByName[name];
      const res = regex.exec(path);

      if (res !== null) {
        output.name = name;

        keys.forEach((key, i) => {
          output.params[key.name] = res[i + 1];
        });

        return output;
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
