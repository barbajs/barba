import { gsap } from 'gsap'

export default {
  sync: true,

  from: {
    route: 'feature',
  },

  to: {
    route: 'home',
  },

  leave({ current }) {
    const { container } = current
    const feature = container.querySelector('.feature-outer')
    const navigation = container.querySelectorAll('.feature__nav__el')
    const oldLogo = container.querySelectorAll(
      '.logo.featured .base, .logo.featured .hover'
    )
    const fullOldLogo = container.querySelectorAll('.logo.featured')
    const oldBigShape = container.querySelector('.logo.only-big')

    current.container.querySelector('.menu-trigger').style.opacity = '0'

    return gsap
      .timeline()
      .to(
        oldLogo,
        {
          duration: 0.3,
          opacity: 0,
        },
        1
      )
      .to(
        oldBigShape,
        {
          duration: 1.5,
          y: 100,
          opacity: 0,
          ease: 'power4.in',
        },
        0.4
      )
      .to(
        fullOldLogo,
        {
          duration: 1,
          opacity: 0,
        },
        1.3
      )
      .to(
        feature,
        {
          duration: 1,
          y: 100,
          opacity: 0,
          ease: 'power4.in',
        },
        0
      )
      .to(
        navigation,
        {
          duration: 0.5,
          y: 30,
          opacity: 0,
          ease: 'power4.in',
        },
        0.2
      )
      .then()
  },

  enter({ current, next }) {
    const newLogo = next.container.querySelector('.logo')
    const newLogoSVG = newLogo.querySelector('svg')
    const oldLogo = current.container.querySelector('.logo.featured')
    const title = next.container.querySelectorAll('h1 span')
    const buttons = next.container.querySelectorAll('.homepage__buttons a')

    const oldLogoRect = oldLogo.getBoundingClientRect()
    const newLogoRect = newLogo.getBoundingClientRect()
    const scale = oldLogoRect.width / newLogoRect.width

    newLogoSVG.classList.add('fillgray')

    return gsap
      .timeline()
      .set(newLogo, {
        scale,
        // DEV
        // y: -((oldLogoRect.top - newLogoRect.top) + ((newLogoRect.height * scale) * 2) - 6),
        y: -(newLogoRect.top - oldLogoRect.top) - 40,
        opacity: 0,
      })
      .add(() => {
        newLogoSVG.classList.remove('fillgray')
      }, 1.5)
      .to(
        newLogo,
        {
          duration: 0.3,
          opacity: 1,
        },
        1
      )
      .to(
        newLogo,
        {
          duration: 1,
          scale: 1,
          y: 0,
          ease: 'power4.inOut',
        },
        1.3
      )
      .from(
        title,
        {
          duration: 1,
          yPercent: 100,
          ease: 'power4',
          stagger: 0.05,
        },
        1.6
      )
      .from(
        buttons,
        {
          duration: 1,
          y: 40,
          opacity: 0,
          ease: 'power4',
          stagger: 0.05,
        },
        1.7
      )
  },
}
