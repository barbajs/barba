import { CustomEvent } from 'kapla';

/**
 * Window scroll custom event
 *
 * Call `onScroll` with following params:
 *    - {number} scrollX
 *    - {number} scrollY
 *
 * @class MyEvent
 * @extends {CustomEvent}
 */

class MyEvent extends CustomEvent {
  constructor(...args) {
    super(...args);

    this.scope = 'global';
    this.log = false;
  }

  bind(component) {
    const { element } = component.context;

    this.eventByElement.set(element, this.callback(component));
    window.addEventListener('scroll', this.eventByElement.get(element));
  }

  unbind(component) {
    const { element } = component.context;

    window.removeEventListener('scroll', this.eventByElement.get(element));
  }

  callback(component) { // eslint-disable-line class-methods-use-this
    return function callback() {
      component.onScroll(window.scrollX, window.scrollY);
    };
  }
}

export const scroll = new MyEvent('scroll');
