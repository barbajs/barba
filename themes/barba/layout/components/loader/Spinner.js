import { Component, ee } from 'kapla';
import { Spinner } from 'spin.js';

const opts = {
  lines: 5, // The number of lines to draw
  length: 32, // The length of each line
  width: 17, // The line thickness
  radius: 0, // The radius of the inner circle
  scale: 1.2, // Scales overall size of the spinner
  corners: 0, // Corner roundness (0..1)
  color: 'white', // CSS color or array of colors
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

export default class LoaderSpinner extends Component {
  load() {
    this.spinner = new Spinner(opts);

    ee.on('spinner:start', this.start.bind(this));
    ee.on('spinner:stop', this.stop.bind(this));
  }

  start() {
    this.spinner.spin(this.$el);
    this.$el.classList.add('is-active');
  }

  stop() {
    this.spinner.stop();
    this.$el.classList.remove('is-active');
  }
}
