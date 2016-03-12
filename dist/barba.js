(function webpackUniversalModuleDefinition(root, factory) {
	if(typeof exports === 'object' && typeof module === 'object')
		module.exports = factory();
	else if(typeof define === 'function' && define.amd)
		define("Barba", [], factory);
	else if(typeof exports === 'object')
		exports["Barba"] = factory();
	else
		root["Barba"] = factory();
})(this, function() {
return /******/ (function(modules) { // webpackBootstrap
/******/ 	// The module cache
/******/ 	var installedModules = {};
/******/
/******/ 	// The require function
/******/ 	function __webpack_require__(moduleId) {
/******/
/******/ 		// Check if module is in cache
/******/ 		if(installedModules[moduleId])
/******/ 			return installedModules[moduleId].exports;
/******/
/******/ 		// Create a new module (and put it into the cache)
/******/ 		var module = installedModules[moduleId] = {
/******/ 			exports: {},
/******/ 			id: moduleId,
/******/ 			loaded: false
/******/ 		};
/******/
/******/ 		// Execute the module function
/******/ 		modules[moduleId].call(module.exports, module, module.exports, __webpack_require__);
/******/
/******/ 		// Flag the module as loaded
/******/ 		module.loaded = true;
/******/
/******/ 		// Return the exports of the module
/******/ 		return module.exports;
/******/ 	}
/******/
/******/
/******/ 	// expose the modules object (__webpack_modules__)
/******/ 	__webpack_require__.m = modules;
/******/
/******/ 	// expose the module cache
/******/ 	__webpack_require__.c = installedModules;
/******/
/******/ 	// __webpack_public_path__
/******/ 	__webpack_require__.p = "http://localhost:8080/dist";
/******/
/******/ 	// Load entry module and return exports
/******/ 	return __webpack_require__(0);
/******/ })
/************************************************************************/
/******/ ([
/* 0 */
/***/ function(module, exports, __webpack_require__) {

	//Promise polyfill https://github.com/taylorhakes/promise-polyfill
	
	if (typeof Promise !== 'function') {
	 window.Promise = __webpack_require__(1);
	}
	
	var Barba = {
	  version: '0.0.5',
	  Dispatcher: __webpack_require__(4),
	  HistoryManager: __webpack_require__(5),
	  BaseTransition: __webpack_require__(6),
	  BaseView: __webpack_require__(8),
	  Pjax: __webpack_require__(9),
	  Prefetch: __webpack_require__(13),
	  Utils: __webpack_require__(7)
	};
	
	module.exports = Barba;


/***/ },
/* 1 */
/***/ function(module, exports, __webpack_require__) {

	/* WEBPACK VAR INJECTION */(function(setImmediate) {(function(root) {
	
		// Use polyfill for setImmediate for performance gains
		var asap = (typeof setImmediate === 'function' && setImmediate) ||
			function(fn) { setTimeout(fn, 1); };
	
		// Polyfill for Function.prototype.bind
		function bind(fn, thisArg) {
			return function() {
				fn.apply(thisArg, arguments);
			}
		}
	
		var isArray = Array.isArray || function(value) { return Object.prototype.toString.call(value) === "[object Array]" };
	
		function Promise(fn) {
			if (typeof this !== 'object') throw new TypeError('Promises must be constructed via new');
			if (typeof fn !== 'function') throw new TypeError('not a function');
			this._state = null;
			this._value = null;
			this._deferreds = []
	
			doResolve(fn, bind(resolve, this), bind(reject, this))
		}
	
		function handle(deferred) {
			var me = this;
			if (this._state === null) {
				this._deferreds.push(deferred);
				return
			}
			asap(function() {
				var cb = me._state ? deferred.onFulfilled : deferred.onRejected
				if (cb === null) {
					(me._state ? deferred.resolve : deferred.reject)(me._value);
					return;
				}
				var ret;
				try {
					ret = cb(me._value);
				}
				catch (e) {
					deferred.reject(e);
					return;
				}
				deferred.resolve(ret);
			})
		}
	
		function resolve(newValue) {
			try { //Promise Resolution Procedure: https://github.com/promises-aplus/promises-spec#the-promise-resolution-procedure
				if (newValue === this) throw new TypeError('A promise cannot be resolved with itself.');
				if (newValue && (typeof newValue === 'object' || typeof newValue === 'function')) {
					var then = newValue.then;
					if (typeof then === 'function') {
						doResolve(bind(then, newValue), bind(resolve, this), bind(reject, this));
						return;
					}
				}
				this._state = true;
				this._value = newValue;
				finale.call(this);
			} catch (e) { reject.call(this, e); }
		}
	
		function reject(newValue) {
			this._state = false;
			this._value = newValue;
			finale.call(this);
		}
	
		function finale() {
			for (var i = 0, len = this._deferreds.length; i < len; i++) {
				handle.call(this, this._deferreds[i]);
			}
			this._deferreds = null;
		}
	
		function Handler(onFulfilled, onRejected, resolve, reject){
			this.onFulfilled = typeof onFulfilled === 'function' ? onFulfilled : null;
			this.onRejected = typeof onRejected === 'function' ? onRejected : null;
			this.resolve = resolve;
			this.reject = reject;
		}
	
		/**
		 * Take a potentially misbehaving resolver function and make sure
		 * onFulfilled and onRejected are only called once.
		 *
		 * Makes no guarantees about asynchrony.
		 */
		function doResolve(fn, onFulfilled, onRejected) {
			var done = false;
			try {
				fn(function (value) {
					if (done) return;
					done = true;
					onFulfilled(value);
				}, function (reason) {
					if (done) return;
					done = true;
					onRejected(reason);
				})
			} catch (ex) {
				if (done) return;
				done = true;
				onRejected(ex);
			}
		}
	
		Promise.prototype['catch'] = function (onRejected) {
			return this.then(null, onRejected);
		};
	
		Promise.prototype.then = function(onFulfilled, onRejected) {
			var me = this;
			return new Promise(function(resolve, reject) {
				handle.call(me, new Handler(onFulfilled, onRejected, resolve, reject));
			})
		};
	
		Promise.all = function () {
			var args = Array.prototype.slice.call(arguments.length === 1 && isArray(arguments[0]) ? arguments[0] : arguments);
	
			return new Promise(function (resolve, reject) {
				if (args.length === 0) return resolve([]);
				var remaining = args.length;
				function res(i, val) {
					try {
						if (val && (typeof val === 'object' || typeof val === 'function')) {
							var then = val.then;
							if (typeof then === 'function') {
								then.call(val, function (val) { res(i, val) }, reject);
								return;
							}
						}
						args[i] = val;
						if (--remaining === 0) {
							resolve(args);
						}
					} catch (ex) {
						reject(ex);
					}
				}
				for (var i = 0; i < args.length; i++) {
					res(i, args[i]);
				}
			});
		};
	
		Promise.resolve = function (value) {
			if (value && typeof value === 'object' && value.constructor === Promise) {
				return value;
			}
	
			return new Promise(function (resolve) {
				resolve(value);
			});
		};
	
		Promise.reject = function (value) {
			return new Promise(function (resolve, reject) {
				reject(value);
			});
		};
	
		Promise.race = function (values) {
			return new Promise(function (resolve, reject) {
				for(var i = 0, len = values.length; i < len; i++) {
					values[i].then(resolve, reject);
				}
			});
		};
	
		/**
		 * Set the immediate function to execute callbacks
		 * @param fn {function} Function to execute
		 * @private
		 */
		Promise._setImmediateFn = function _setImmediateFn(fn) {
			asap = fn;
		};
	
		if (typeof module !== 'undefined' && module.exports) {
			module.exports = Promise;
		} else if (!root.Promise) {
			root.Promise = Promise;
		}
	
	})(this);
	/* WEBPACK VAR INJECTION */}.call(exports, __webpack_require__(2).setImmediate))

/***/ },
/* 2 */
/***/ function(module, exports, __webpack_require__) {

	/* WEBPACK VAR INJECTION */(function(setImmediate, clearImmediate) {var nextTick = __webpack_require__(3).nextTick;
	var apply = Function.prototype.apply;
	var slice = Array.prototype.slice;
	var immediateIds = {};
	var nextImmediateId = 0;
	
	// DOM APIs, for completeness
	
	exports.setTimeout = function() {
	  return new Timeout(apply.call(setTimeout, window, arguments), clearTimeout);
	};
	exports.setInterval = function() {
	  return new Timeout(apply.call(setInterval, window, arguments), clearInterval);
	};
	exports.clearTimeout =
	exports.clearInterval = function(timeout) { timeout.close(); };
	
	function Timeout(id, clearFn) {
	  this._id = id;
	  this._clearFn = clearFn;
	}
	Timeout.prototype.unref = Timeout.prototype.ref = function() {};
	Timeout.prototype.close = function() {
	  this._clearFn.call(window, this._id);
	};
	
	// Does not start the time, just sets up the members needed.
	exports.enroll = function(item, msecs) {
	  clearTimeout(item._idleTimeoutId);
	  item._idleTimeout = msecs;
	};
	
	exports.unenroll = function(item) {
	  clearTimeout(item._idleTimeoutId);
	  item._idleTimeout = -1;
	};
	
	exports._unrefActive = exports.active = function(item) {
	  clearTimeout(item._idleTimeoutId);
	
	  var msecs = item._idleTimeout;
	  if (msecs >= 0) {
	    item._idleTimeoutId = setTimeout(function onTimeout() {
	      if (item._onTimeout)
	        item._onTimeout();
	    }, msecs);
	  }
	};
	
	// That's not how node.js implements it but the exposed api is the same.
	exports.setImmediate = typeof setImmediate === "function" ? setImmediate : function(fn) {
	  var id = nextImmediateId++;
	  var args = arguments.length < 2 ? false : slice.call(arguments, 1);
	
	  immediateIds[id] = true;
	
	  nextTick(function onNextTick() {
	    if (immediateIds[id]) {
	      // fn.call() is faster so we optimize for the common use-case
	      // @see http://jsperf.com/call-apply-segu
	      if (args) {
	        fn.apply(null, args);
	      } else {
	        fn.call(null);
	      }
	      // Prevent ids from leaking
	      exports.clearImmediate(id);
	    }
	  });
	
	  return id;
	};
	
	exports.clearImmediate = typeof clearImmediate === "function" ? clearImmediate : function(id) {
	  delete immediateIds[id];
	};
	/* WEBPACK VAR INJECTION */}.call(exports, __webpack_require__(2).setImmediate, __webpack_require__(2).clearImmediate))

/***/ },
/* 3 */
/***/ function(module, exports) {

	// shim for using process in browser
	
	var process = module.exports = {};
	var queue = [];
	var draining = false;
	var currentQueue;
	var queueIndex = -1;
	
	function cleanUpNextTick() {
	    draining = false;
	    if (currentQueue.length) {
	        queue = currentQueue.concat(queue);
	    } else {
	        queueIndex = -1;
	    }
	    if (queue.length) {
	        drainQueue();
	    }
	}
	
	function drainQueue() {
	    if (draining) {
	        return;
	    }
	    var timeout = setTimeout(cleanUpNextTick);
	    draining = true;
	
	    var len = queue.length;
	    while(len) {
	        currentQueue = queue;
	        queue = [];
	        while (++queueIndex < len) {
	            if (currentQueue) {
	                currentQueue[queueIndex].run();
	            }
	        }
	        queueIndex = -1;
	        len = queue.length;
	    }
	    currentQueue = null;
	    draining = false;
	    clearTimeout(timeout);
	}
	
	process.nextTick = function (fun) {
	    var args = new Array(arguments.length - 1);
	    if (arguments.length > 1) {
	        for (var i = 1; i < arguments.length; i++) {
	            args[i - 1] = arguments[i];
	        }
	    }
	    queue.push(new Item(fun, args));
	    if (queue.length === 1 && !draining) {
	        setTimeout(drainQueue, 0);
	    }
	};
	
	// v8 likes predictible objects
	function Item(fun, array) {
	    this.fun = fun;
	    this.array = array;
	}
	Item.prototype.run = function () {
	    this.fun.apply(null, this.array);
	};
	process.title = 'browser';
	process.browser = true;
	process.env = {};
	process.argv = [];
	process.version = ''; // empty string to avoid regexp issues
	process.versions = {};
	
	function noop() {}
	
	process.on = noop;
	process.addListener = noop;
	process.once = noop;
	process.off = noop;
	process.removeListener = noop;
	process.removeAllListeners = noop;
	process.emit = noop;
	
	process.binding = function (name) {
	    throw new Error('process.binding is not supported');
	};
	
	process.cwd = function () { return '/' };
	process.chdir = function (dir) {
	    throw new Error('process.chdir is not supported');
	};
	process.umask = function() { return 0; };


/***/ },
/* 4 */
/***/ function(module, exports) {

	/**
	 * Little Dispatcher inspired by MicroEvent.js
	 * @namespace Barba.Dispatcher
	 */
	var Dispatcher = {
	  /**
	   * Event array
	   * @memberOf Barba.Dispatcher
	   * @type {Object}
	   */
	  events: {},
	
	  /**
	   * Bind a callback to an event
	   * @memberOf Barba.Dispatcher
	   * @param  {String} eventName
	   * @param  {Function} function
	   */
	  on: function(e, f) {
	    this.events[e] = this.events[e] || [];
	    this.events[e].push(f);
	  },
	
	  /**
	   * Unbind
	   * @memberOf Barba.Dispatcher
	   * @param  {String} eventName
	   * @param  {Function} function
	   */
	  off: function(e, f) {
	    if(e in this.events === false)
	      return;
	
	    this.events[e].splice(this.events[e].indexOf(f), 1);
	  },
	
	  /**
	   * Fire the event running all the event associated
	   * @memberOf Barba.Dispatcher
	   * @param  {String} eventName
	   */
	  trigger: function(e) {//e, ...args
	    if (e in this.events === false)
	      return;
	
	    for(var i = 0; i < this.events[e].length; i++){
	      this.events[e][i].apply(this, Array.prototype.slice.call(arguments, 1));
	    }
	  }
	};
	
	module.exports = Dispatcher;


/***/ },
/* 5 */
/***/ function(module, exports) {

	/**
	 * HistoryManager helps to keep track of the navigation
	 *
	 * @namespace Barba.Pjax.HistoryManager
	 */
	var HistoryManager = {
	  /**
	   * Keep track of the states in historic order
	   * @memberOf Barba.Pjax.HistoryManger
	   * @type {Array}
	   */
	  states: [],
	
	  /**
	   * Add a new set of url and namespace
	   * @param {String} url
	   * @param {String} [namespae] namespace
	   */
	  add: function(url, namespace) {
	    if (!namespace)
	      namespace = undefined;
	
	    this.states.push({
	      url: url,
	      namespace: namespace
	    });
	  },
	
	  /**
	   * [currentStatus description]
	   * @return {Object} [description]
	   */
	  currentStatus: function() {
	    return this.states[this.states.length - 1];
	  },
	
	  /**
	   * [prevStatus description]
	   * @return {Object} [description]
	   */
	  prevStatus: function() {
	    var states = this.states;
	
	    if (states.length < 2)
	      return null;
	
	    return states[states.length - 2];
	  }
	};
	
	module.exports = HistoryManager;


/***/ },
/* 6 */
/***/ function(module, exports, __webpack_require__) {

	var Utils = __webpack_require__(7);
	
	/**
	 * [BaseTransition description]
	 * @namespace Barba.BaseTransition
	 * @type {Object}
	 */
	var BaseTransition = {
	  /**
	   * @memberOf Barba.BaseTransition
	   * @type {HTMLElement}
	   */
	  oldContainer: undefined,
	
	  /**
	   * @memberOf Barba.BaseTransition
	   * @type {HTMLElement}
	   */
	  newContainer: undefined,
	
	  /**
	   * @memberOf Barba.BaseTransition
	   * @type {Promise}
	   */
	  newContainerLoading: undefined,
	
	  /**
	   * Helper that
	   * @memberOf Barba.BaseTransition
	   * @param  {Object} newObject
	   * @return {Object} newInheritObject
	   */
	  extend: function(obj){
	    return Utils.extend(this, obj);
	  },
	
	  /**
	   * This function is called from Pjax module to initialize
	   * the transition.
	   * @memberOf Barba.BaseTransition
	   * @private
	   * @param  {HTMLElement} oldContainer
	   * @param  {Promise} newContainer
	   * @return {Promise}
	   */
	  init: function(oldContainer, newContainer) {
	    var _this = this;
	
	    this.oldContainer = oldContainer;
	    this._newContainerPromise = newContainer;
	
	    this.deferred = Utils.deferred();
	    this.newContainerReady = Utils.deferred();
	    this.newContainerLoading = this.newContainerReady.promise;
	
	    this.start();
	
	    this._newContainerPromise.then(function(newContainer) {
	      _this.newContainer = newContainer;
	      _this.newContainerReady.resolve();
	    });
	
	    return this.deferred.promise;
	  },
	
	  /**
	   * This function needs to be called as soon the Transition is done
	   * @memberOf Barba.BaseTransition
	   */
	  done: function() {
	    this.oldContainer.parentNode.removeChild(this.oldContainer);
	    this.deferred.resolve();
	  },
	
	  /**
	   * Function to be implemented
	   * @abstract
	   */
	  start: function() {},
	};
	
	module.exports = BaseTransition;


/***/ },
/* 7 */
/***/ function(module, exports) {

	/**
	 * Just an object with some helpful functions
	 * @type {Object}
	 * @namespace Barba.Utils
	 */
	var Utils = {
	  /**
	   * Return current url
	   * @memberOf Barba.Utils
	   * @return {String} currentUrl
	   */
	  getCurrentUrl: function() {
	    return window.location.protocol + '//' +
	           window.location.host +
	           window.location.pathname +
	           window.location.search;
	  },
	
	  /**
	   * Return a version of the url without the hash
	   * @memberOf Barba.Utils
	   * @param  {String} url
	   * @return {String} newCleanUrl
	   */
	  cleanLink: function(url) {
	    return url.replace(/#.*/, '');
	  },
	
	  /**
	   * Start an XMLHttpRequest() and return a Promise
	   * @memberOf Barba.Utils
	   * @param  {String} url
	   * @return {Promise}
	   */
	  xhr: function(url) {
	    var deferred = this.deferred();
	    var req = new XMLHttpRequest();
	
	    req.onreadystatechange = function() {
	      if (req.readyState === 4) {
	        if (req.status === 200) {
	          return deferred.resolve(req.responseText);
	        } else {
	          return deferred.reject();
	        }
	      }
	    };
	
	    req.open('GET', url);
	    req.send();
	
	    return deferred.promise;
	  },
	
	  /**
	   * Get obj and props and return a new object with the property merged
	   * @memberOf Barba.Utils
	   * @param  {object} obj
	   * @param  {object} props
	   * @return {object}
	   */
	  extend: function(obj, props) {
	    var newObj = Object.create(obj);
	
	    for(var prop in props) {
	      if(props.hasOwnProperty(prop)) {
	        newObj[prop] = props[prop];
	      }
	    }
	
	    return newObj;
	  },
	
	  /**
	   * Return a new "Deferred" object
	   * https://developer.mozilla.org/en-US/docs/Mozilla/JavaScript_code_modules/Promise.jsm/Deferred
	   * @return {Deferred}
	   */
	  deferred: function() {
	    return new function() {
	      this.resolve = null;
	      this.reject = null;
	
	      this.promise = new Promise(function(resolve, reject) {
	        this.resolve = resolve;
	        this.reject = reject;
	      }.bind(this));
	    };
	  }
	};
	
	module.exports = Utils;


/***/ },
/* 8 */
/***/ function(module, exports, __webpack_require__) {

	var Dispatcher = __webpack_require__(4);
	var Utils = __webpack_require__(7);
	
	var BaseView  = {
	  namespace: null,
	
	  extend: function(obj){
	    return Utils.extend(this, obj);
	  },
	
	  init: function() {
	    var _this = this;
	
	    Dispatcher.on('initStateChange',
	      function(newStatus, oldStatus) {
	        if (oldStatus && oldStatus.namespace === _this.namespace)
	          _this.onLeave();
	      }
	    );
	
	    Dispatcher.on('newPageReady',
	      function(newStatus, oldStatus) {
	        //The new page has been loaded and is ready on the DOM.
	        if (newStatus.namespace === _this.namespace)
	          _this.onEnter();
	      }
	    );
	
	    Dispatcher.on('transitionCompleted',
	      function(newStatus, oldStatus) {
	        if (newStatus.namespace === _this.namespace)
	          _this.onEnterCompleted();
	
	        if (oldStatus && oldStatus.namespace === _this.namespace)
	          _this.onLeaveCompleted();
	      }
	    );
	  },
	
	  /*
	    Fired when the DOM is in the page
	  */
	
	 /**
	  * [onEnter description]
	  *
	  * @abstract
	  */
	  onEnter: function() {},
	
	  /*
	    Fired when the page transition is done
	  */
	  onEnterCompleted: function() {},
	
	  /*
	    Fired when the exit transition starts
	  */
	  onLeave: function() {},
	
	  /*
	    Fired when the exit transition is done
	  */
	  onLeaveCompleted: function() {}
	}
	
	module.exports = BaseView;


/***/ },
/* 9 */
/***/ function(module, exports, __webpack_require__) {

	var Utils = __webpack_require__(7);
	var Dispatcher = __webpack_require__(4);
	var HideShowTransition = __webpack_require__(10);
	var BaseCache = __webpack_require__(11);
	
	var HistoryManager = __webpack_require__(5);
	var Dom = __webpack_require__(12);
	
	/**
	 * Pjax is a static object with main function
	 *
	 * @namespace Barba.Pjax
	 * @borrows Dom as Dom
	 * @type {Object}
	 */
	var Pjax = {
	  Dom: Dom,
	  History: HistoryManager,
	  Cache: BaseCache,
	
	  /**
	   * Indicate wether or not use the cache
	   * @memberOf Barba.Pjax
	   * @type {Boolean}
	   */
	  cacheEnabled: true,
	
	  /**
	   * Indicate if there is an animation in progress
	   * @memberOf Barba.Pjax
	   * @readOnly
	   * @type {Boolean}
	   */
	  transitionProgress: false,
	
	  /**
	   * Function to be called to start Pjax
	   * @memberOf Barba.Pjax
	   */
	  start: function() {
	    this.init();
	  },
	
	  /**
	   * [init description]
	   * @private
	   */
	  init: function() {
	    this.History.add(
	      this.getCurrentUrl(),
	      this.Dom.getNamespace(this.Dom.getContainer())
	    );
	
	    //Fire for the current view.
	    Dispatcher.trigger('initStateChange', this.History.currentStatus());
	    Dispatcher.trigger('newPageReady', this.History.currentStatus());
	    Dispatcher.trigger('transitionCompleted', this.History.currentStatus());
	
	    this.bindEvents();
	  },
	
	  /**
	   * Attach the eventlisteners
	   * @memberOf Barba.Pjax
	   * @private
	   */
	  bindEvents: function() {
	    document.addEventListener('click',
	      this.onLinkClick.bind(this)
	    );
	
	    window.addEventListener('popstate',
	      this.onStateChange.bind(this)
	    );
	  },
	
	  /**
	   * Return the currentURL
	   * @memberOf Barba.Pjax
	   * @return {String} currentUrl
	   */
	  getCurrentUrl: function() {
	    return Utils.cleanLink(
	      Utils.getCurrentUrl()
	    );
	  },
	
	  /**
	   * Change the URL with pushstate and trigger the state change
	   * @memberOf Barba.Pjax
	   * @param  {String} newUrl
	   */
	  goTo: function(url) {
	    window.history.pushState(null, null, url);
	    this.onStateChange();
	  },
	
	  /**
	   * Force the browser to go to a certain url
	   * @memberOf Barba.Pjax
	   * @param  {String} url
	   * @private
	   */
	  forceGoTo: function(url) {
	    window.location = url;
	  },
	
	  /**
	   * Load an url, will start an xhr request or load from the cache
	   *
	   * @memberOf Barba.Pjax
	   * @private
	   * @param  {String} url
	   * @return {Promise}
	   */
	  load: function(url) {
	    var deferred = Utils.deferred();
	    var _this = this;
	    var xhr;
	
	    xhr = this.Cache.get(url);
	
	    if (!xhr) {
	      xhr = Utils.xhr(url);
	      this.Cache.set(url, xhr);
	    }
	
	    xhr.then(
	      function(data) {
	        var container = _this.Dom.parseResponse(data);
	        var namespace = _this.Dom.getNamespace(container);
	
	        _this.Dom.putContainer(container);
	
	        if (!_this.cacheEnabled)
	          _this.Cache.reset();
	
	        deferred.resolve(container);
	      },
	      function() {
	        //Something went wrong (timeout, 404, 505...)
	        _this.forceGoTo(url);
	
	        deferred.reject();
	      }
	    );
	
	    return deferred.promise;
	  },
	
	  /**
	   * Callback called from click event
	   * @private
	   * @param  {MouseEvent} evt
	   */
	  onLinkClick: function(evt) {
	    var el = evt.target;
	
	    //Go up in the nodelist until we
	    //find something with .href
	    while (el && !el.href) {
	      el = el.parentNode;
	    }
	
	    if (this.preventCheck(evt, el)) {
	      evt.stopPropagation();
	      evt.preventDefault();
	
	      Dispatcher.trigger('linkClicked', el);
	      this.goTo(el.href);
	    }
	  },
	
	  /**
	   * Determine if the link should be followed
	   * @memberOf Barba.Pjax
	   * @param  {MouseEvent} evt [description]
	   * @param {HTMLElement} element
	   * @return {Boolean}     [description]
	   */
	  preventCheck: function(evt, element) {
	    //User
	    if (!element || !element.href)
	      return false;
	
	    //Middle click, cmd click, and ctrl click
	    if (evt.which > 1 || evt.metaKey || evt.ctrlKey || evt.shiftKey || evt.altKey)
	      return false;
	
	    //Ignore target with _blank target
	    if (element.target && element.target === '_blank')
	      return false;
	
	    //Check if it's the same domain
	    if (window.location.protocol !== element.protocol || window.location.hostname !== element.hostname)
	      return false;
	
	    //Ignore case when a hash is being tacked on the current URL
	    if (element.href.indexOf('#') > -1)
	      return false;
	
	    //In case you're trying to load the same page
	    if (Utils.cleanLink(element.href) == Utils.cleanLink(location.href))
	      return false;
	
	    if (element.classList.contains('no-barba'))
	      return false;
	
	    return true;
	  },
	
	  /**
	   * Return a transition object
	   * @memberOf Barba.Pjax
	   * @return {Barba.Transition} Transition object
	   */
	  getTransition: function() {
	    //User customizable
	    return HideShowTransition;
	  },
	
	  /**
	   * Method called after a 'popstate' or from .goTo()
	   * @memberOf Barba.Pjax
	   * @private
	   */
	  onStateChange: function() {
	    var _this = this;
	    var newUrl = this.getCurrentUrl();
	
	    if (this.transitionProgress)
	      this.forceGoTo(newUrl);
	
	    if (this.History.currentStatus().url === newUrl)
	      return false;
	
	    this.History.add(newUrl);
	
	    var newContainer = this.load(newUrl);
	    var transition = Object.create(this.getTransition());
	
	    this.transitionProgress = true;
	
	    Dispatcher.trigger('initStateChange',
	      this.History.currentStatus(),
	      this.History.prevStatus()
	    );
	
	    var transitionInstance = transition.init(
	      this.Dom.getContainer(),
	      newContainer
	    );
	
	    newContainer.then(
	      this.onNewContainerLoaded.bind(this)
	    );
	
	    transitionInstance.then(
	      this.onTransitionEnd.bind(this)
	    );
	  },
	
	  /**
	   * Function called as soon the new container is ready
	   * @memberOf Barba.Pjax
	   * @private
	   * @param  {HTMLElement} container
	   */
	  onNewContainerLoaded: function(container) {
	    var currentStatus = this.History.currentStatus();
	    currentStatus.namespace = this.Dom.getNamespace(container);
	
	    Dispatcher.trigger('newPageReady',
	      this.History.currentStatus(),
	      this.History.prevStatus()
	    );
	  },
	
	  /**
	   * Function called as soon the transition is finished
	   * @memberOf Barba.Pjax
	   * @private
	   */
	  onTransitionEnd: function() {
	    this.transitionProgress = false;
	
	    Dispatcher.trigger('transitionCompleted',
	      this.History.currentStatus(),
	      this.History.prevStatus()
	    );
	  }
	};
	
	module.exports = Pjax;


/***/ },
/* 10 */
/***/ function(module, exports, __webpack_require__) {

	var Utils = __webpack_require__(7);
	var BaseTransition = __webpack_require__(6);
	
	/**
	 * Basic Transition object, wait for the new Container to be ready
	 * and, after that, hide the oldContainer
	 * @namespace Barba.HideShowTransition
	 * @augments Barba.BaseTransition
	 */
	var HideShowTransition = BaseTransition.extend({
	  start: function() {
	    this.newContainerLoading.then(this.hideShow.bind(this));
	  },
	
	  hideShow: function() {
	    this.oldContainer.style.visibility = 'hidden';
	    this.newContainer.style.visibility = 'visible';
	    document.body.scrollTop = 0;
	
	    this.done();
	  }
	});
	
	module.exports = HideShowTransition;


/***/ },
/* 11 */
/***/ function(module, exports) {

	/**
	 * BaseCache it's a simple static cache
	 * @namespace Barba.BaseCache
	 */
	var BaseCache = {
	  /**
	   * The array that keeps everything.
	   * @memberOf Barba.BaseCache
	   * @type {Array}
	   */
	  data: [],
	
	  /**
	   * Helper that
	   * @memberOf Barba.BaseCache
	   * @param  {Object} newObject
	   * @return {Object} newInheritObject
	   */
	  extend: function(obj) {
	    return Utils.extend(this, obj);
	  },
	
	  /**
	   * Set a key, value data, mainly Barba is going to save Ajax
	   * promise object.
	   * @memberOf Barba.BaseCache
	   * @param {String} key
	   * @param {*} value
	   */
	  set: function(key, val) {
	    this.data[key] = val;
	  },
	
	  /**
	   * Retrieve the data by the key
	   * @memberOf Barba.BaseCache
	   * @param  {String} key
	   * @return {*}
	   */
	  get: function(key) {
	    return this.data[key];
	  },
	
	  /**
	   * Reset all the cache stored
	   * @memberOf Barba.BaseCache
	   */
	  reset: function() {
	    this.data = [];
	  }
	};
	
	module.exports = BaseCache;


/***/ },
/* 12 */
/***/ function(module, exports) {

	/**
	 * Dom object
	 * @namespace Barba.Pjax.Dom
	 * @type {Object}
	 */
	var Dom = {
	  /**
	   * Parse the responseText obtained from the xhr call
	   * @memberOf Barba.Pjax.Dom
	   * @private
	   * @param  {String} responseText
	   * @return {HTMLElement}
	   */
	  parseResponse: function(responseText) {
	    var wrapper = document.createElement('div');
	    wrapper.innerHTML = responseText;
	
	    var titleEl = wrapper.querySelector('title');
	
	    if (titleEl)
	      document.title = titleEl.textContent;
	
	    return this.getContainer(wrapper);
	  },
	
	  /**
	   * get the container on the current DOM,
	   * or from an HTMLElement passed via argument
	   * @memberOf Barba.Pjax.Dom
	   * @private
	   * @param  {HTMLElement} [element]
	   * @return {HTMLElement}
	   */
	  getContainer: function(element) {
	    if (!element)
	      element = document.body;
	
	    if (!element)
	      throw new Error('Barba.js: DOM not ready!');
	
	    var container = this.parseContainer(element);
	
	    if (container && container.jquery)
	      container = container[0];
	
	    if (!container)
	      throw new Error('Barba.js: no container found');
	
	    return container;
	  },
	
	  /**
	   * Get the namespace of the container
	   * @memberOf Barba.Pjax.Dom
	   * @param  {HTMLElement}
	   * @return {String}
	   */
	  getNamespace: function(element) {
	    //User customizable
	    return element && element.dataset ? element.dataset.namespace : null;
	  },
	
	  /**
	   * Put the container on the page
	   * @memberOf Barba.Pjax.Dom
	   * @param  {HTMLElement} element
	   */
	  putContainer: function(element) {
	    //User customizable
	    element.style.visibility = 'hidden';
	    document.getElementById('barba-wrapper').appendChild(element);
	  },
	
	  /**
	   * Get container selector
	   * @memberOf Barba.Pjax.Dom
	   * @param  {HTMLElement} element
	   * @return {HTMLElement} element
	   */
	  parseContainer: function(element) {
	    //User customizable
	    return element.querySelector('.barba-container');
	  }
	};
	
	module.exports = Dom;


/***/ },
/* 13 */
/***/ function(module, exports, __webpack_require__) {

	var Utils = __webpack_require__(7);
	var Pjax = __webpack_require__(9);
	
	/**
	 * Prefetch
	 * @namespace Barba.Prefetch
	 */
	var Prefetch = {
	  init: function() {
	    document.body.addEventListener('mouseover', this.onLinkEnter.bind(this));
	    document.body.addEventListener('touchstart', this.onLinkEnter.bind(this));
	  },
	
	  onLinkEnter: function(evt) {
	    var el = evt.target;
	
	    while (el && !el.href) {
	      el = el.parentNode;
	    }
	
	    if (!el) {
	      return;
	    }
	
	    var url = el.href;
	
	    //Check if the link is elegible for Pjax
	    if (Pjax.preventCheck(evt, el) && !Pjax.Cache.get(url)) {
	      var xhr = Utils.xhr(url);
	      Pjax.Cache.set(url, xhr);
	    }
	  }
	};
	
	module.exports = Prefetch;


/***/ }
/******/ ])
});
;
//# sourceMappingURL=barba.js.map