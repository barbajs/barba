import { Component } from 'kapla';
import { Spinner } from 'spin.js';

const opts = {
  lines: 5, // The number of lines to draw
  length: 32, // The length of each line
  width: 17, // The line thickness
  radius: 0, // The radius of the inner circle
  scale: 1.2, // Scales overall size of the spinner
  corners: 0, // Corner roundness (0..1)
  color: '#3c5dcd', // CSS color or array of colors
  fadeColor: 'transparent', // CSS color or array of colors
  speed: 1.2, // Rounds per second
  rotate: 0, // The rotation offset
  animation: 'spinner-line-fade-quick', // The CSS animation name for the lines
  direction: 1, // 1: clockwise, -1: counterclockwise
  zIndex: 2e9, // The z-index (defaults to 2000000000)
  className: 'spinner', // The CSS class to assign to the spinner
  top: '50%', // Top position relative to parent
  left: '50%', // Left position relative to parent
  shadow: '0 0 1px transparent', // Box-shadow for the lines
  position: 'absolute' // Element positioning
};

export default class ShowcaseCta extends Component {
  load() {
    const subscriber = this.subscribe('showcase-cta');

    this.spinner = new Spinner(opts);

    subscriber.on('spinner:start', this.start);
    subscriber.on('spinner:stop', this.stop);
  }

  start() {
    this.spinner.spin(this.$el);
  }

  stop() {
    this.spinner.stop();
  }
}
