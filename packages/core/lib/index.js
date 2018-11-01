"use strict";

Object.defineProperty(exports, "__esModule", {
  value: true
});
exports.default = exports.barba = void 0;

var _package = require("../package.json");

var _schema = require("./schema");

var _cache = _interopRequireDefault(require("./cache"));

var _dom = _interopRequireDefault(require("./dom"));

var _hooks = _interopRequireDefault(require("./hooks"));

var _manager = _interopRequireDefault(require("./manager"));

var _prevent = _interopRequireDefault(require("./prevent"));

var _transitions = _interopRequireDefault(require("./transitions"));

var _utils = require("./utils");

function _interopRequireDefault(obj) { return obj && obj.__esModule ? obj : { default: obj }; }

function _objectSpread(target) { for (var i = 1; i < arguments.length; i++) { var source = arguments[i] != null ? arguments[i] : {}; var ownKeys = Object.keys(source); if (typeof Object.getOwnPropertySymbols === 'function') { ownKeys = ownKeys.concat(Object.getOwnPropertySymbols(source).filter(function (sym) { return Object.getOwnPropertyDescriptor(source, sym).enumerable; })); } ownKeys.forEach(function (key) { _defineProperty(target, key, source[key]); }); } return target; }

function _defineProperty(obj, key, value) { if (key in obj) { Object.defineProperty(obj, key, { value: value, enumerable: true, configurable: true, writable: true }); } else { obj[key] = value; } return obj; }

var barba = {
  version: _package.version,
  wrapper: null,
  current: null,
  next: null,
  trigger: null,
  transitions: null,
  hooks: _hooks.default.init(),
  pageSchema: _schema.pageSchema,
  _plugins: [],
  use: function use(plugin) {
    var installedPlugins = this._plugins; // Plugin installation

    if (installedPlugins.indexOf(plugin) > -1) {
      return this;
    }

    for (var _len = arguments.length, args = new Array(_len > 1 ? _len - 1 : 0), _key = 1; _key < _len; _key++) {
      args[_key - 1] = arguments[_key];
    }

    if (typeof plugin.install === 'function') {
      plugin.install.apply(plugin, [this].concat(args));
    } else if (typeof plugin === 'function') {
      plugin.apply(void 0, [this].concat(args));
    }

    installedPlugins.push(plugin);
    return this;
  },
  init: function init() {
    var options = arguments.length > 0 && arguments[0] !== undefined ? arguments[0] : {
      debug: false,
      cache: false,
      prefetch: false,
      transitions: [],
      views: [],
      attributeSchema: _schema.attributeSchema
    };
    this.options = options; // DEV
    // if (process.env.NODE_ENV === 'test') {
    //   this.options.debug = true;
    // }
    // Init dom with data-attributes schema

    _dom.default.init(this.options.attributeSchema); // Get wrapper


    this.wrapper = _dom.default.getWrapper();

    if (!this.wrapper) {
      throw new Error('No Barba wrapper found');
    } // A11y


    this.wrapper.setAttribute('aria-live', 'polite'); // Transitions / manager

    this.transitions = _transitions.default.init(this.options.transitions, this.options.debug); // Init current set

    this.current = _objectSpread({}, this.pageSchema);
    this.next = _objectSpread({}, this.pageSchema); // TODO: refactor, create function update || updateData

    this.current.namespace = _dom.default.getNamespace();
    this.current.url = (0, _utils.getUrl)();
    this.current.container = _dom.default.getContainer();
    this.current.html = _dom.default.getHtml();

    if (!this.current.container) {
      throw new Error('No Barba container found');
    } // Add to cache


    _cache.default.set(this.current.url, this.current.html); // Set/update history
    // Bindings


    this.onClick = this.onClick.bind(this);
    this.onURLChange = this.onURLChange.bind(this);
    this.bind(); // Init plugins

    this._plugins.forEach(function (plugin) {
      return plugin.init();
    });

    this.appear();
    this.go('/foo.html', null);
  },
  destroy: function destroy() {
    this.wrapper = null;
    this.current = null;
    this.next = null;
    this.trigger = null;
    this.transitions = null;
    this.hooks = _hooks.default.destroy();
    this.pageSchema = _schema.pageSchema;
    this._plugins = [];
    this.unbind();
  },
  bind: function bind() {
    document.addEventListener('click', this.onClick);
    window.addEventListener('popstate', this.onURLChange);
  },
  unbind: function unbind() {
    document.removeEventListener('click', this.onClick);
    window.removeEventListener('popstate', this.onURLChange);
  },
  onClick: function onClick(e) {
    var el = e.target;

    while (el && !(0, _utils.getHref)(el)) {
      el = el.parentNode;
    } // Check prevent


    if (_prevent.default.check(el, e, el.href)) {
      return;
    }

    e.stopPropagation();
    e.preventDefault();
    this.go((0, _utils.getHref)(el), el);
  },
  onURLChange: function onURLChange() {
    console.info('onURLChange');
  },
  appear: function appear() {
    // Check if appear transition?
    // then, make stuff
    var data = this.getData();

    _manager.default.doAppear(this.transitions.get(data, true), data);
  },
  go: function go(url, trigger) {
    this.trigger = trigger; // Get from cache ?
    // console.info('GOOOOOO!!!', this.transitions.hasTo);
    // If no cache AND hasTo transitions, wait for fetch
    // Else get transition

    var data = {
      current: this.current,
      next: {
        // DEV
        // namespace: dom.getNamespace(),
        url: url // #ROUTER: should access to this.next.url and set this.next.route
        // route: null,
        // DEV
        // container: dom.getContainer(),
        // html: dom.getHtml(),

      },
      trigger: trigger
    }; // #ROUTER hook or event between trigger/go AND transition…

    _hooks.default.do('go', data); // Get transition infos


    var t = this.transitions.get(data); // Do transition
    // console.info('T', t);

    _manager.default.doTransition(t, data);
  },
  getData: function getData() {
    return {
      current: this.current,
      next: this.next,
      trigger: this.trigger
    };
  }
};
exports.barba = barba;
var _default = barba;
exports.default = _default;