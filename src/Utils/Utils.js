/**
 * Just an object with some helpful functions
 *
 * @type {Object}
 * @namespace Barba.Utils
 */
var Utils = {
  /**
   * Return the current url
   *
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
   * Given an url, return it without the hash
   *
   * @memberOf Barba.Utils
   * @private
   * @param  {String} url
   * @return {String} newCleanUrl
   */
  cleanLink: function(url) {
    return url.replace(/#.*/, '');
  },

  /**
   * Time in millisecond after the xhr request goes in timeout
   *
   * @memberOf Barba.Utils
   * @type {Number}
   * @default
   */
  xhrTimeout: 5000,

  /**
   * Start an XMLHttpRequest() and return a Promise
   *
   * @memberOf Barba.Utils
   * @param  {String} url
   * @return {Promise}
   */

  req.onreadystatechange = function () {
  if (req.readyState === 4) {
    console.log(req.status);
    if (req.status === 200) {
      return deferred.resolve(req.responseText);
    } else if (req.status === 404) {
      // If the page could not be found,
      // then load the default error page. This fixes issue #148
      // where the history gets corrupted when a 404 is returned.
      var errorReq = new XMLHttpRequest();
      var errorUrl = window.host + "404/";
      errorReq.onreadystatechange = function () {
        if (errorReq.readyState === 4) {
          if (errorReq.status === 404) {
            deferred.resolve(errorReq.responseText)
          } else {
            console.log('xhr: Could not find 404 error page');
          }
        }
      };
      errorReq.ontimeout = function () {
        return deferred.reject(new Error('xhr: Timeout exceeded'));
      };
      errorReq.open('GET', errorUrl);
      errorReq.send();
    } else {
      return deferred.reject(new Error('xhr: Error fetching page content'))
    }
  }
};

    req.ontimeout = function() {
      return deferred.reject(new Error('xhr: Timeout exceeded'));
    };

    req.open('GET', url);
    req.timeout = this.xhrTimeout;
    req.setRequestHeader('x-barba', 'yes');
    req.send();

    return deferred.promise;
  },

  /**
   * Get obj and props and return a new object with the property merged
   *
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
   *
   * @memberOf Barba.Utils
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
  },

  /**
   * Return the port number normalized, eventually you can pass a string to be normalized.
   *
   * @memberOf Barba.Utils
   * @private
   * @param  {String} p
   * @return {Int} port
   */
  getPort: function(p) {
    var port = typeof p !== 'undefined' ? p : window.location.port;
    var protocol = window.location.protocol;

    if (port != '')
      return parseInt(port);

    if (protocol === 'http:')
      return 80;

    if (protocol === 'https:')
      return 443;
  }
};

module.exports = Utils;
