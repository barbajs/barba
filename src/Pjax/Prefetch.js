var Utils = require('../Utils/Utils');
var Pjax = require('./Pjax');

/**
 * BaseCache it's a simple static cache
 * @namespace Barba.BaseCache
 */
var Prefetch = {
  init: function() {
    //document.body.addEventListener('mouseenter', this.onLinkEnter.bind(this));
    
    //TODO IN VANILLA with mouseover event...
    $(document).on('mouseenter', 'a', this.onLinkEnter.bind(this));
  },

  onLinkEnter: function(evt) {
    var el = evt.target;

    while (el && !el.href) {
      el = el.parentNode;
    }
    
    var url = el.href;
    
    //Check if the link is elegible for Pjax
    if (Pjax.preventCheck(evt, el) && !Pjax.Cache.get(url)) {
      var xhr = Utils.xhr(url);

      if (Pjax.cacheEnabled)
        Pjax.Cache.set(url, xhr);
    }
  }
};

module.exports = Prefetch;
