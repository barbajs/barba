var Utils = require('../Utils/Utils');
var Pjax = require('./Pjax');

/**
 * Prefetch
 *
 * @namespace Barba.Prefetch
 * @type {Object}
 */
var Prefetch = {
  /**
   * Class name used to ignore prefetch on links
   *
   * @memberOf Barba.Prefetch
   * @type {String}
   * @default
   */
  ignoreClassLink: 'no-barba-prefetch',

  /**
   * Init the event listener on mouseover and touchstart
   * for the prefetch
   *
   * @memberOf Barba.Prefetch
   */
  init: function() {
    if (!window.history.pushState) {
      return false;
    }

    document.body.addEventListener('mouseover', this.onLinkEnter.bind(this));
    document.body.addEventListener('touchstart', this.onLinkEnter.bind(this));
  },

  /**
   * Callback for the mousehover/touchstart
   *
   * @memberOf Barba.Prefetch
   * @private
   * @param  {Object} evt
   */
  onLinkEnter: function(evt) {
    var el = evt.target;

    while (el && !Pjax.getHref(el)) {
      el = el.parentNode;
    }

    if (!el || el.classList.contains(this.ignoreClassLink)) {
      return;
    }

    var url = Pjax.getHref(el);

    //Check if the link is elegible for Pjax
    if (Pjax.preventCheck(evt, el) && !Pjax.Cache.get(url)) {
      var xhr = Utils.xhr(url);
      Pjax.Cache.set(url, xhr);
    }
  }
};

module.exports = Prefetch;
