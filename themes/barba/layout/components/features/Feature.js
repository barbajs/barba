import { Component } from 'kapla';
import lottie from 'lottie-web';

import prefetch from './box-content/prefetch.json';

export default class extends Component {
  load() {
    lottie.loadAnimation({
      container: this.$refs.bodymovin,
      renderer: 'svg',
      loop: true,
      autoplay: true,
      animationData: prefetch,
    });
  }
}
