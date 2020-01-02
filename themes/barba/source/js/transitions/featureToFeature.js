import { getInstance } from '../app'
import { gsap } from 'gsap'

/**
 * Check if forward or backward direction
 *
 * @param {int} currentFeatureOrder page namepspace
 * @param {int} nextFeatureOrder page namepspace
 * @returns {boolean} If forward
 */
function isForward(currentFeatureOrder, nextFeatureOrder) {
  const oldIndex = Number(currentFeatureOrder)
  const newIndex = Number(nextFeatureOrder)
  const featureNav = document.querySelector('.menu-subpages__list')
  const featureLength = featureNav.children.length

  // From last to first
  if (oldIndex === featureLength - 1 && newIndex === 0) {
    return true
  }

  // From first to last
  if (oldIndex === 0 && newIndex === featureLength - 1) {
    return false
  }

  return oldIndex < newIndex
}

export default {
  from: {
    route: 'feature',
  },
  to: {
    route: 'feature',
  },

  leave({ current }) {
    document.body.scrollTop = 0
    document.documentElement.scrollTop = 0
    const { container } = current
    const $feature = container.querySelector('.feature')
    const { featureSlug } = $feature.dataset

    if (featureSlug !== 'about') {
      const featureInstance = getInstance(container, 'feature')

      return featureInstance.animateOut()
    }

    return Promise.resolve()
  },

  enter({ current, next }) {
    const $nextFeature = next.container.querySelector('.feature')
    const $currentFeature = current.container.querySelector('.feature')

    const nextFeatureSlug = $nextFeature.dataset.featureSlug
    const nextFeatureOrder = $nextFeature.dataset.featureOrder
    const currentFeatureOrder = $currentFeature.dataset.featureOrder
    const goingForward = isForward(currentFeatureOrder, nextFeatureOrder)

    const $nextContainer = $nextFeature.querySelector('.feature__container')
    const $nextBox = $nextFeature.querySelector('.feature__box')
    const $nextInstance = getInstance(next.container, 'feature')

    const $currentContainer = $currentFeature.querySelector(
      '.feature__container'
    )
    const $currentBox = $currentFeature.querySelector('.feature__box')

    const $currentLogo = $currentFeature.querySelector('.logo')
    const $currentLogoShapes = $currentFeature.querySelector('.logo.only-big')

    const $nextLogo = $nextFeature.querySelector('.logo')
    const $nextLogoShapes = $nextFeature.querySelector('.logo.only-big')

    const tl = gsap.timeline()

    $currentBox &&
      tl.to(
        $currentBox,
        {
          duration: 1,
          x: goingForward ? -window.innerWidth * 0.3 : window.innerWidth * 0.3,
          ease: 'power4.inOut',
        },
        0
      )

    tl.to(
      $currentContainer,
      {
        duration: 1.5,
        x: goingForward ? -window.innerWidth : window.innerWidth,
        rotationY: goingForward ? '45deg' : '-45deg',
        ease: 'power4.inOut',
      },
      0
    )
      .to(
        $currentLogoShapes,
        {
          duration: 1,
          opacity: 0,
          ease: 'power4.inOut',
        },
        0
      )
      .to(
        $currentLogo,
        {
          duration: 0.5,
          opacity: 0,
          ease: 'power4.inOut',
        },
        0
      )
      .from(
        $nextLogoShapes,
        {
          duration: 1,
          opacity: 0,
          ease: 'power4',
        },
        0
      )
      .from(
        $nextLogo,
        {
          duration: 0.5,
          opacity: 0,
          ease: 'power4',
        },
        0
      )
      .from(
        $nextContainer,
        {
          duration: 1.5,
          x: goingForward ? window.innerWidth : -window.innerWidth,
          rotationY: goingForward ? '-45deg' : '45deg',
          ease: 'power4',
          onComplete: () => {
            if (nextFeatureSlug !== 'about') {
              $nextInstance.animateIn()
            }
          },
        },
        0.5
      )

    $nextBox &&
      tl.from(
        $nextBox,
        {
          duration: 1.5,
          x: goingForward ? window.innerWidth * 0.5 : -window.innerWidth * 0.5,
          ease: 'power4',
        },
        1
      )

    return tl.then()
  },
}
