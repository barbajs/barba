import { Component } from 'kapla';
import lottie from 'lottie-web';

// Bodymovin JSON files
import prefetch from './box-content/prefetch.json';

export default class extends Component {
  load() {
    const featureNamespace = this.$el.dataset.namespace;
    const bodymovins = {
      'dependency-free': prefetch,
      'small-size': prefetch,
      'core': prefetch,
      'router': prefetch,
      'prefetch': prefetch,
    };
    const bodymovinsKeys = Object.keys(bodymovins);

    bodymovinsKeys.forEach(key => {
      if (key === featureNamespace && bodymovins[key].layers) {
        lottie.loadAnimation({
          container: this.$refs.bodymovin,
          renderer: 'svg',
          loop: true,
          autoplay: true,
          animationData: bodymovins[key],
        });
      }
    });
  }
}
