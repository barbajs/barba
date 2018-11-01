const core = require('@barba/core');

console.info('CORE', core);
// Router
// Auto install (when using CDN or browser, to be checked)
if (typeof window !== 'undefined' && window.barba) {
  window.barba.use(router);
}

const router = {
  install(barba, { routes }) {
    this.app = barba;
    this.routes = routes;
  },
  beforeInit() {
    this.app.transitions.props.push('route');
    this.app.dataSchema.route = undefined;
  },
  afterInit() {
    this.app.current.route = this.resolve(this.app.current.url);
    this.app.registerHook('go', this.onGo);
  },
  onGo(data) {
    data.current.route = this.resolve(data.current.url);
    data.next.route = this.resolve(data.next.url);
  },
};

// Views
const views = {
  install(barba, { views }) {
    this.app = barba;
    this.views = views;
  },
  afterInit() {
    this.app.registerHook('enter', this.onEnter);
    this.app.registerHook('leave', this.onLeave);
  },
  onEnter(data) {
    const currentView = this.views[data.current.namespace];

    currentView.enter(data);
  },
  onLeave(data) {
    const nextView = this.views[data.next.namespace];

    nextView.enter(data);
  },
};
