import { version } from '../package.json';

export const router = {
  version,
  routes: {},
  install(barba, options = {}) {
    this.barba = barba;
    this.routes = options.routes || {};
    // Add property to "pageSchema" (current, next)
    barba.pageSchema.route = undefined;
    // Register hooks
    barba.hooks.go(this.onGo, this);
  },
  init() {
    this.barba.transitions.add('rule', {
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
    return `matching route for [${url}]`;
  },
  // Hooks
  onGo(data) {
    data.current.route = this.resolve(data.current.url);
    data.next.route = this.resolve(data.next.url);
  },
};

export default router;
