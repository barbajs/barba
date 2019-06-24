import { Component } from 'kapla';
import lottie from 'lottie-web';

export default class extends Component {
  load() {
    console.log('ok');
    lottie.loadAnimation({
      container: this.$refs.bodymovin, // the dom element that will contain the animation
      renderer: 'svg',
      loop: true,
      autoplay: true,
      path: 'b-prefetch.json', // the path to the animation json
    });
  }
}
