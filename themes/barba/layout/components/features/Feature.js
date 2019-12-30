import {
  Component,
} from 'kapla';
import lottie from 'lottie-web';

// Bodymovin JSON files
import feature0 from './box-content/feature0.json';
import feature1 from './box-content/feature1.json';
import feature2 from './box-content/feature2.json';
import feature3 from './box-content/feature3.json';
import feature4 from './box-content/feature4.json';

export default class extends Component {
  load() {
    const bodymovins = [
      feature0,
      feature1,
      feature2,
      feature3,
      feature4,
    ];
    const featureOrder = this.data.get('order');
    // const featureNamespace = this.$el.dataset.namespace;

    lottie.loadAnimation({
      container: this.$refs.bodymovin,
      renderer: 'svg',
      loop: true,
      autoplay: true,
      animationData: bodymovins[featureOrder],
    });

    // const bodymovins = {
    //   'dependency-free': prefetch,
    //   'small-size': prefetch,
    //   'core': prefetch,
    //   'router': prefetch,
    //   'prefetch': prefetch,
    // };

    // const bodymovinsKeys = Object.keys(bodymovins);

    // bodymovinsKeys.forEach(key => {
    //   if (key === featureNamespace && bodymovins[key].layers) {
    //     lottie.loadAnimation({
    //       container: this.$refs.bodymovin,
    //       renderer: 'svg',
    //       loop: true,
    //       autoplay: true,
    //       animationData: bodymovins[key],
    //     });
    //   }
    // });
  }

  animateOut() {
    return new Promise(resolve => {
      console.log('animateStart');
      setTimeout(() => {
        console.log('animateEnd');
        resolve();
      }, 1000);

    })
  }
}
