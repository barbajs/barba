var Dispatcher = require('../Dispatcher/Dispatcher');
var Utils = require('../Utils/Utils.js');

/**
 * BaseView to be extended
 *
 * @namespace Barba.BaseView
 * @type {Object}
 */
var BaseView  = {
  /**
   * Namespace of the view.
   * (need to be associated with the data-namespace of the container)
   *
   * @memberOf Barba.BaseView
   * @type {String}
   */
  namespace: null,

  /**
   * Helper to extend the object
   *
   * @memberOf Barba.BaseView
   * @param  {Object} newObject
   * @return {Object} newInheritObject
   */
  extend: function(obj){
    return Utils.extend(this, obj);
  },

  /**
   * Init the view.
   * P.S. Is suggested to init the view before starting Barba.Pjax.start(),
   * in this way .onEnter() and .onEnterCompleted() will be fired for the current
   * container when the page is loaded.
   *
   * @memberOf Barba.BaseView
   */
  init: function() {
    var _this = this;

    Dispatcher.on('initStateChange',
      function(newStatus, oldStatus) {
        if (oldStatus && oldStatus.namespace === _this.namespace)
          _this.onLeave();
      }
    );

    Dispatcher.on('newPageReady',
      function(newStatus, oldStatus, container) {
        _this.container = container;

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

 /**
  * This function will be fired when the container
  * is ready and attached to the DOM.
  *
  * @memberOf Barba.BaseView
  * @abstract
  */
  onEnter: function() {},

  /**
   * This function will be fired when the transition
   * to this container has just finished.
   *
   * @memberOf Barba.BaseView
   * @abstract
   */
  onEnterCompleted: function() {},

  /**
   * This function will be fired when the transition
   * to a new container has just started.
   *
   * @memberOf Barba.BaseView
   * @abstract
   */
  onLeave: function() {},

  /**
   * This function will be fired when the container
   * has just been removed from the DOM.
   *
   * @memberOf Barba.BaseView
   * @abstract
   */
  onLeaveCompleted: function() {}
}

module.exports = BaseView;
