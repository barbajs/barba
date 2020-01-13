import verge from 'verge';
import events from 'utils/events';

class Viewport {
  constructor() {
    this.width = Viewport.calculateWidth();
    this.height = Viewport.calculateHeight();
    this.ratio = this.width / this.height;

    this.bind();
  }

  bind() {
    this.onResize = this.onResize.bind(this);
    window.addEventListener('resize', this.onResize);
  }

  static calculateWidth() {
    return verge.viewportW();
  }

  static calculateHeight() {
    return verge.viewportH();
  }

  onResize() {
    this.width = Viewport.calculateWidth();
    this.height = Viewport.calculateHeight();
    this.ratio = this.width / this.height;

    events.emit(events.RESIZE, this.width, this.height, this.ratio);
  }
}

export default new Viewport();
