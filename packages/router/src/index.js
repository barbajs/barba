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
    // Wait for store initialization then add new rule for routes
    this.barba.store.add('rule', {
      position: 1,
      value: {
        name: 'route',
        type: 'strings',
      },
    });
    // DEV is resolved through "refresh" hook
    // this.barba.current.route = this.resolve(this.barba.current.url);
  },
  destroy() {
    this.routes = [];
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
    const { current, next } = data;

    current.route = current.url ? this.resolve(current.url) : undefined;
    next.route = next.url ? this.resolve(next.url) : undefined;
  },
};

export default router;
