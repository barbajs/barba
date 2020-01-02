import { Component } from 'kapla'
import lottie from 'lottie-web'

// Bodymovin JSON files
import feature0 from './lottie-animation/feature0.json'
import feature1 from './lottie-animation/feature1.json'
import feature2 from './lottie-animation/feature2.json'
import feature3 from './lottie-animation/feature3.json'
import feature4 from './lottie-animation/feature4.json'

const bodymovins = [
  {
    data: feature0,
    step: 158,
  },
  {
    data: feature1,
    step: 140,
  },
  {
    data: feature2,
    step: 100,
  },
  {
    data: feature3,
    step: 140,
  },
  {
    data: feature4,
    step: 110,
  },
]

export default class extends Component {
  load() {
    const featureOrder = this.data.get('order')

    this.bodymovin = bodymovins[featureOrder]

    if (!this.bodymovin) {
      return
    }
    this.animation = lottie.loadAnimation({
      container: this.$refs.bodymovin,
      renderer: 'svg',
      loop: false,
      autoplay: false,
      animationData: this.bodymovin.data,
    })

    this.animation.setSpeed(1.25)
  }

  animateOut() {
    return new Promise(resolve => {
      this.animation.playSegments(
        [this.bodymovin.step, this.animation.animationData.op],
        true
      )
      setTimeout(() => {
        resolve()
      }, 1500)
      // this.animation.onComplete = () => {
      //   resolve();
      // };
    })
  }

  animateIn() {
    return new Promise(resolve => {
      console.log('animateInStart')
      if (this.animation) {
        this.animation.playSegments([0, this.bodymovin.step], true)
        setTimeout(() => {
          console.log('animateInEnd')
          resolve()
        }, 1000)
      }
    })
  }
}
