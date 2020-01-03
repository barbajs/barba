import {
  gsap
} from 'gsap'
import {
  getInstance
} from '../app'
// DEV
// import { qs, qsa } from '../../../source/js/utils/dom'
// import deferred from '../../../source/js/utils/deferred'

export default {
  sync: true,
  from: {
    route: 'home',
  },
  to: {
    route: 'feature',
  },

  leave({
    current,
    next
  }) {
    const intro = current.container.querySelector('.homepage')
    const oldLogo = current.container.querySelector('.logo.homepage__logo')
    const newLogo = next.container.querySelector('.logo.featured')
    const title = current.container.querySelectorAll('h1 span')
    const buttons = current.container.querySelectorAll('.homepage__buttons a')
    const list = current.container.querySelector('.homepage__list')
    const hoverIndex = next.container.querySelector('.feature').dataset.featureOrder
    const bigShape = current.container.querySelectorAll(
      '.logo.only-big .hover .item'
    )[hoverIndex]
    const oldBigShape = current.container.querySelector('.logo.only-big')
    const newBigShape = next.container.querySelector('.logo.only-big')

    newBigShape.classList.remove('can-move')
    current.container.style.zIndex = -1
    oldLogo.querySelector('svg').classList.add('fillgray')

    const oldLogoRect = oldLogo.getBoundingClientRect()
    const newLogoRect = newLogo.getBoundingClientRect()
    const oldBigShapeRect = oldBigShape.getBoundingClientRect()
    const newBigShapeRect = newBigShape.getBoundingClientRect()
    const scale = newLogoRect.width / oldLogoRect.width

    current.container.querySelector('.menu-trigger').style.opacity = '0'
    intro.classList.add('to-feature')

    gsap.killTweensOf(bigShape)

    return gsap
      .timeline({
        onComplete: () => {
          newBigShape.classList.add('can-move')
        },
      })
      .to(
        oldLogo, {
          duration: 1.4,
          scale,
          y: -(
            oldLogoRect.top -
            newLogoRect.top +
            newLogoRect.height * scale * 2 -
            6
          ),
          ease: 'power4.inOut',
        },
        0
      )
      .to(
        bigShape, {
          duration: 0.1,
          opacity: 1,
        },
        0
      )
      .to(
        oldBigShape, {
          duration: 1.3,
          y: newBigShapeRect.top - oldBigShapeRect.top,
          ease: 'power4.inOut',
        },
        0.1
      )
      .to(
        oldBigShape, {
          duration: 0.2,
          opacity: 0,
        },
        1.4
      )
      .from(
        newBigShape, {
          duration: 0.01,
          opacity: 0,
        },
        1.4
      )
      .add(() => {
        bigShape.classList.add('grow')
      }, 0)
      .to(
        list, {
          duration: 0.8,
          opacity: 0,
          ease: 'power4.in',
        },
        0
      )
      .to(
        title, {
          duration: 1,
          yPercent: 100,
          ease: 'power4.inOut',
          stagger: 0.05,
        },
        0
      )
      .to(
        buttons, {
          duration: 1,
          y: 40,
          opacity: 0,
          ease: 'power4.in',
          stagger: 0.05,
        },
        0.1
      )
      .then()
  },
  enter({
    next
  }) {
    const {
      container
    } = next
    const newLogo = container.querySelector('.logo.featured')
    const featureContainer = container.querySelector('.feature__container')
    const navigation = container.querySelectorAll('.feature__nav__el')

    return gsap
      .timeline({
        delay: 1.3,
        onComplete: () => {
          getInstance(next.container, 'feature').animateIn()
        },
      })
      .from(
        newLogo, {
          duration: 1,
          opacity: 0,
        },
        0
      )
      .from(
        featureContainer, {
          duration: 1,
          opacity: 0,
          y: 200,
          ease: 'power4',
          rotationX: '20deg',
        },
        0
      )
      .from(
        navigation, {
          duration: 0.4,
          opacity: 0,
          y: 30,
          ease: 'power4',
          stagger: 0.2,
        },
        0.8
      )
      .then()
  },
}

/**
 *
 * @param {*HTMLElement} data getting container
 */
// function oldEnder(data) {
//   data.next.container.style.cssText = `
//     visibility: hidden;
//     position: absolute;
//     top: 0;
//     left: 0;
//     right: 0;
//     bottom: 0;
//   `

//   const current = {}

//   ;(current.$logo = qs('.logo', data.current.container)),
//     (current.logoRect = current.$logo.getBoundingClientRect())
//   current.$morphParent = qs('.big1', current.$logo)
//   current.$morphs = [...qsa('[data-morph]', current.$morphParent)]
//   current.$fadeOut = qsa('.intro h1, .intro .button')

//   const next = {}
//   ;(next.$logo = qs('.logo', data.next.container)),
//     (next.logoRect = next.$logo.getBoundingClientRect())
//   next.$morphParent = qs('.big1', next.$logo)
//   next.$morphs = [...qsa('[data-morph]', next.$morphParent)]

//   qs('svg', current.$logo).classList.add('fillgray')

//   const dfd = deferred()

//   const tl = gsap.timeline({
//     onComplete: () => {
//       data.next.container.style.cssText = ''
//       dfd.resolve()
//     },
//   })

//   tl.to(
//     current.$logo,
//     {
//       duration: 2,
//       y: next.logoRect.y - current.logoRect.y - 40,
//       width: next.logoRect.width,
//     },
//     0
//   )

//   tl.staggerTo(
//     current.$fadeOut,
//     {
//       duration: 0.4,
//       y: 50,
//       opacity: 0,
//     },
//     0.1
//   )

//   tl.to(
//     current.$morphParent,
//     {
//       duration: 1,
//       opacity: 1,
//     },
//     0
//   )

//   current.$morphs.forEach((el, index) => {
//     tl.to(
//       el,
//       {
//         duration: 3,
//         // transformOrigin: next.$morphs[index].style.transformOrigin,
//         transform: getComputedStyle(next.$morphs[index]).transform,
//       },
//       0.1 + 0.1 * index
//     )
//   })

//   tl.add('crossfade')

//   tl.set(
//     data.next.container,
//     {
//       visibility: 'visible',
//       opacity: 0,
//     },
//     'crossfade'
//   )

//   tl.to(
//     data.next.container,
//     {
//       duration: 1,
//       opacity: 1,
//     },
//     'crossfade'
//   )

//   tl.to(
//     data.current.container,
//     {
//       duration: 1,
//       opacity: 0,
//     },
//     'crossfade'
//   )

//   return dfd.promise
// }
