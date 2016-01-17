/**
 * Dom object
 * @namespace Barba.Pjax.Dom
 * @type {Object}
 */
var Dom = {
  /**
   * Parse the responseText obtained from the xhr call
   * @memberOf Barba.Pjax.Dom
   * @private
   * @param  {String} responseText
   * @return {HTMLElement}
   */
  parseResponse: function(responseText) {
    var wrapper = document.createElement('div');
    wrapper.innerHTML = responseText;

    var titleEl = wrapper.querySelector('title');

    if (titleEl)
      document.title = titleEl.innerText;

    return this.getContainer(wrapper);
  },

  /**
   * get the container on the current DOM,
   * or from an HTMLElement passed via argument
   * @memberOf Barba.Pjax.Dom
   * @private
   * @param  {HTMLElement} [element]
   * @return {HTMLElement}
   */
  getContainer: function(element) {
    if (!element)
      element = document.body;

    if (!element)
      throw new Error('Barba.js: DOM not ready!');

    var container = this.parseContainer(element);

    if (container && container.jquery)
      container = container[0];

    if (!container)
      throw new Error('Barba.js: no container found');

    return container;
  },

  /**
   * Get the namespace of the container
   * @memberOf Barba.Pjax.Dom
   * @param  {HTMLElement}
   * @return {String}
   */
  getNamespace: function(element) {
    //User customizable
    return element && element.dataset ? element.dataset.namespace : null;
  },

  /**
   * Put the container on the page
   * @memberOf Barba.Pjax.Dom
   * @param  {HTMLElement} element
   */
  putContainer: function(element) {
    //User customizable
    element.style.visibility = 'hidden';
    document.getElementById('barba-wrapper').appendChild(element);
  },

  /**
   * [parseContainer description]
   * @memberOf Barba.Pjax.Dom
   * @param  {[type]} element [description]
   * @return {[type]}         [description]
   */
  parseContainer: function(element) {
    //User customizable
    return element.querySelector('.barba-container');
  }
};

module.exports = Dom;
