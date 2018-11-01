import { version } from '../package.json';

export const router = {
  version,
  routes: {},
  install(barba, opts = {}) {
    console.info('INSTALL', opts);
    this.barba = barba;
    this.routes = opts.routes || {};
    // Add property to "pageSchema" (current, next)
    barba.pageSchema.route = undefined;
    // Register hooks
    barba.hooks.go(this.onGo, this);
  },
  init() {
    console.info('INIT');
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
    console.info('GO');
    data.current.route = this.resolve(data.current.url);
    data.next.route = this.resolve(data.next.url);
  },
};

export default router;
