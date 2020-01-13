import { gsap } from 'gsap'

export default {
  enter({ current, next }) {
    document.body.scrollTop = 0
    document.documentElement.scrollTop = 0

    const transitionTitle = document.querySelector('.transition__title')
    const transitionBackground = document.querySelector(
      '.transition__background'
    )

    console.log('transitionBackground', transitionBackground)

    transitionTitle.innerHTML = next.container.dataset.barbaNamespace

    document.body.scrollTop = 0
    document.documentElement.scrollTop = 0

    return gsap
      .timeline({
        onComplete: () => {
          transitionTitle.innerHTML = ''
        },
      })
      .set(transitionBackground, { clearProps: 'all' })
      .set(transitionTitle, { y: 100 })
      .to(transitionBackground, {
        duration: 0.7,
        x: '0',
        ease: 'power4',
        onComplete: () => {
          current.container.style.display = 'none'
        },
      })
      .to(
        transitionTitle,
        0.5,
        {
          y: 0,
          opacity: 1,
          ease: 'power4',
        },
        0.1
      )
      .from(next.container, {
        duration: 0.1,
        opacity: 0,
        ease: 'power4',
      })
      .to(
        transitionBackground,
        {
          duration: 0.7,
          x: '100%',
          ease: 'power4.inOut',
        },
        1
      )
      .to(
        transitionTitle,
        0.7,
        {
          y: -100,
          opacity: 0,
          ease: 'power4.inOut',
        },
        0.8
      )
      .then()
  },
}
