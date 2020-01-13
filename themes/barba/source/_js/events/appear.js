import isEqual from 'lodash/isEqual';
import { CustomEvent, Multimap } from 'kapla';

/**
 * Intersection observer custom event
 * https://developer.mozilla.org/en-US/docs/Web/API/Intersection_Observer_API
 *
 * Options:
 *    - {HTMLElement} [root=null]
 *    - {string} [rootMargin='0px 0px 0px 0px']
 *    - {number|array} [threshold=[0, 1]]
 *        - 0 = as soon as even one pixel is visible, the callback will be run
 *        - 1 = threshold isn't considered passed until every pixel is visible
 *    - {boolean} [once=false] - removed when once inViewport
 * Call `onAppear` with following params:
 *    - {boolean} isInViewport
 *    - {boolean} isFullyInViewport
 *    - {string} position (center, top, bottom)
 *
 * @class MyEvent
 * @extends {CustomEvent}
 */
class MyEvent extends CustomEvent {
  constructor(...args) {
    super(...args);

    this.scope = 'global';
    this.log = true;
    this.observers = new Set();
    this.elementsByObserver = new Multimap();
    this.onceByElement = new Map();
  }

  bind(component, ee, opts) {
    const { element } = component.context;
    const options = {
      root: null,
      rootMargin: '0px 0px 0px 0px',
      threshold: [0, 1],
      once: false,
      ...opts,
    };
    const observer = this.createObserver(options, element);

    this.onceByElement.set(element, options.once);
    this.eventByElement.set(element, this.callback(component));
    observer.observe(element);
  }

  createObserver(options, element) {
    const existingObserver = this.getObserverByOptions(options);

    if (existingObserver) {
      if (!this.getObserverByElement(element)) {
        this.addObserver(existingObserver, element);
      }

      return existingObserver;
    }

    const newObserver = new IntersectionObserver(this.intersected.bind(this), options);

    this.addObserver(newObserver, element);

    return newObserver;
  }

  getObserverByOptions(options) {
    const thresholds = Array.isArray(options.threshold) ? options.threshold : [options.threshold];

    return Array.from(this.observers).find(
      observer => observer.root === options.root &&
      observer.rootMargin === options.rootMargin &&
      isEqual(observer.thresholds, thresholds)
    );
  }

  getObserverByElement(element) {
    return this.elementsByObserver.getKeysForValue(element)[0];
  }

  addObserver(observer, element) {
    this.observers.add(observer);
    this.elementsByObserver.add(observer, element);
  }

  removeObserver(observer, element) {
    this.elementsByObserver.delete(observer, element);

    if (this.elementsByObserver.getValuesForKey(observer) === 0) {
      this.observers.delete(observer);
    }
  }

  unobserve(element) {
    const existingObserver = this.getObserverByElement(element);

    existingObserver.unobserve(element);
    this.removeObserver(existingObserver, element);
  }

  unbind(component) {
    const { element } = component.context;

    this.unobserve(element);
  }

  intersected(entries) {
    entries.forEach(entry => {
      const element = entry.target;
      let isInViewport = false;
      let isFullyInViewport = false;

      if (entry.isIntersecting) {
        isInViewport = true;
        if (entry.intersectionRatio >= 1) {
          isFullyInViewport = true;
        } else {
          isFullyInViewport = false;
        }
      } else {
        isInViewport = false;
        isFullyInViewport = false;
      }

      const isBeforeViewport = entry.boundingClientRect.top < entry.rootBounds.top;
      const isAfterViewport = entry.boundingClientRect.top + entry.boundingClientRect.height >
      entry.rootBounds.top + entry.rootBounds.height;
      let position = 'center';

      if (isBeforeViewport) {
        position = 'top';
      } else if (isAfterViewport) {
        position = 'bottom';
      }

      this.eventByElement.get(element)(isInViewport, isFullyInViewport, position);

      if (isInViewport && this.onceByElement.get(element)) {
        this.unobserve(element);
      }
    });
  }

  callback(component) { // eslint-disable-line class-methods-use-this
    return function callback(isInViewport, isFullyInViewport, position) {
      component.onAppear(isInViewport, isFullyInViewport, position);
    };
  }
}

export const appear = new MyEvent('appear');
