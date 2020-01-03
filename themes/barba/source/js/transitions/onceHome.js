import {
  gsap,
} from 'gsap'

export default {
  to: {
    namespace: 'home',
  },

  once() {
    const logo = document.querySelector('.logo.homepage__logo')
    const title = document.querySelectorAll('h1 span')
    const buttons = document.querySelectorAll('.homepage__buttons a')
    const chrome = [
      document.querySelector('.header__infos'),
      document.querySelector('.header__external-links'),
      document.querySelector('.site-footer'),
    ]

    document.documentElement.classList.add('is-transitioning')

    const tl = gsap.timeline({
      delay: 0.5,
      onComplete: () => {
        document.documentElement.classList.remove('is-transitioning')
      },
    })

    tl
      .from(
        logo, {
          duration: 0.5,
          y: 100,
          scale: 1.1,
          ease: 'power4.inOut',
        },
        0
      )
      .from(
        title, {
          duration: 1,
          yPercent: 100,
          scale: 1,
          ease: 'power4',
          stagger: 0.05,
        },
        0.6
      )
      .from(
        buttons, {
          duration: 1,
          y: 40,
          opacity: 0,
          ease: 'power4',
          stagger: 0.05,
        },
        1.2
      )
      .from(
        chrome, {
          duration: 0.3,
          scale: 0,
          ease: 'power4',
          stagger: 0.2,
        },
        1.5
      )
  },
}
