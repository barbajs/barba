import { gsap } from 'gsap'

export default {
  leave(data) {
    return gsap
      .to(data.current.container, {
        duration: 0.4,
        opacity: 0,
        ease: 'power4.in',
        onComplete: () => {
          data.current.container.style.display = 'none'
        },
      })
      .then()
  },
  enter(data) {
    document.body.scrollTop = 0
    document.documentElement.scrollTop = 0

    return gsap
      .from(data.next.container, {
        duration: 0.7,
        opacity: 0,
        ease: 'power4.inOut',
      })
      .then()
  },
}
