import verge from 'verge';
import { CustomEvent } from 'kapla';

/**
 * Window resize custom event
 *
 * Call `onResize` with following params:
 *    - {number} width
 *    - {number} height
 *    - {number} ratio (width / heigth)
 *
 * @class MyEvent
 * @extends {CustomEvent}
 */
class MyEvent extends CustomEvent {
  constructor(...args) {
    super(...args);

    this.scope = 'global';
    this.log = true;
  }

  bind(component, ee) {
    const { element } = component.context;

    this.eventByElement.set(element, this.callback(component, ee));
    window.addEventListener('resize', this.eventByElement.get(element));
  }

  unbind(component) {
    const { element } = component.context;

    window.removeEventListener('resize', this.eventByElement.get(element));
  }

  callback(component, ee) { // eslint-disable-line class-methods-use-this
    return function callback() {
      const width = verge.viewportW();
      const height = verge.viewportH();
      const ratio = width / height;

      ee.emit('resize', width, height, ratio);
      component.onResize(width, height, ratio);
    };
  }
}

export const resize = new MyEvent('resize');
