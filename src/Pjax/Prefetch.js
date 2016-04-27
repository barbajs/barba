var Utils = require('../Utils/Utils');
var Pjax = require('./Pjax');

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
    if (Pjax.checkPrevent(evt, el) && !Pjax.Cache.get(url)) {
      var xhr = Utils.xhr(url);
      Pjax.Cache.set(url, xhr);
    }
  }
};

module.exports = Prefetch;
