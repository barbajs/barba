var Utils = require('../Utils/Utils.js');

/**
 * BaseTransition to extend
 *
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
   * Helper to extend the object
   *
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
   *
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
   * This function needs to be called as soon the Transition is finished
   *
   * @memberOf Barba.BaseTransition
   */
  done: function() {
    this.oldContainer.parentNode.removeChild(this.oldContainer);
    this.newContainer.style.visibility = 'visible';
    this.deferred.resolve();
  },

  /**
   * Constructor for your Transition
   *
   * @memberOf Barba.BaseTransition
   * @abstract
   */
  start: function() {},
};

module.exports = BaseTransition;
