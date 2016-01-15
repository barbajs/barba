var Dispatcher = require('../Dispatcher/Dispatcher');
var Utils = require('../Utils/Utils.js');

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
