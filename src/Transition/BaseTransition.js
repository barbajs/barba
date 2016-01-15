var Utils = require('../Utils/Utils.js');

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
