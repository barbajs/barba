var BaseTransition = require('./BaseTransition');

/**
 * Basic Transition object, wait for the new Container to be ready
 * and, after that, hide the oldContainer
 *
 * @private
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
