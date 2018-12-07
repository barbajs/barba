import pathToRegexp from 'path-to-regexp';
import { version } from '../package.json';
import { cleanUrl, parsePath } from './utils';

export const router = {
  version,
  origin: window.location.origin,
  routes: [],
  routesByName: {},
  install(barba, { routes = [] } = {}) {
    this.barba = barba;
    // DEV
    // this.routes = options.routes || [];

    routes.forEach(route => {
      const { name, path } = route;
      const regex = pathToRegexp(path, []);

      this.routes.push(name);

      if (this.routesByName[name]) {
        console.warn(`Duplicated route name [${name}]`);
      } else {
        this.routesByName[name] = {
          path,
          regex,
        };
      }
    });

    // Add property to "pageSchema" (current, next)
    barba.pageSchema.route = undefined;
    // Register hooks
    barba.hooks.go(this.resolveRoutes, this);
    barba.hooks.refresh(this.resolveRoutes, this);
  },
  init() {
    this.barba.store.add('rule', {
      position: 1,
      value: {
        name: 'route',
        type: 'strings',
      },
    });
    this.barba.current.route = this.resolve(this.barba.current.url);
  },
  destroy() {
    this.routes = {};
  },
  resolve(url) {
    const fullPath = cleanUrl(url, this.origin);
    const { path } = parsePath(fullPath);

    for (let i = 0, l = this.routes.length; i < l; i++) {
      const name = this.routes[i];
      const { regex } = this.routesByName[name];

      if (path.match(regex)) {
        return name;
      }
    }

    return null;
  },
  // Hooks
  resolveRoutes(data) {
    data.current.route = data.current.url
      ? this.resolve(data.current.url)
      : undefined;
    data.next.route = data.next.url ? this.resolve(data.next.url) : undefined;
  },
};

export default router;
