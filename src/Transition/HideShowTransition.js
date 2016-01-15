var Utils = require('../Utils/Utils.js');
var BaseTransition = require('./BaseTransition');

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
    this.oldContainer.style.display = 'none';
    this.newContainer.style.display = 'block';
    document.body.scrollTop = 0;

    this.done();
  }
});

module.exports = HideShowTransition;
