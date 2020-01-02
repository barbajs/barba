import { getInstance } from '../app'
import { gsap } from 'gsap'

export default {
  to: {
    namespace: 'feature',
  },
  once: ({ next }) => {
    const { container } = next
    const nextFeatureSlug = container.querySelector('.feature').dataset
      .featureSlug
    const featureContainer = container.querySelector('.feature__container')
    const featureBox = container.querySelector('.feature__box')
    const featureInstance = getInstance(container, 'feature')

    const tl = gsap.timeline()

    featureBox &&
      tl.from(
        featureBox,
        {
          duration: 1.5,
          y: 100,
          opacity: 0,
          ease: 'power4',
        },
        0.5
      )

    tl.from(
      featureContainer,
      {
        duration: 1,
        y: 100,
        opacity: 0,
        ease: 'power4',
        onComplete: () => {
          if (nextFeatureSlug !== 'about') {
            featureInstance.animateIn()
          }
        },
      },
      0.5
    )
  },
}
