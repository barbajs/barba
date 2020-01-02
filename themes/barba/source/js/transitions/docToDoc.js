import { TimelineMax } from 'gsap/TimelineMax'
import { TweenMax } from 'gsap/TweenMax'

const { docs } = window.BARBA
const docsUrlOrderedList = []

for (let i = 0; i < docs.length; i++) {
  if (docs[i].subpages) {
    for (let j = 0; j < docs[i].subpages.length; j++) {
      docsUrlOrderedList.push(docs[i].subpages[j].url)
    }
  } else {
    docsUrlOrderedList.push(docs[i].url)
  }
}

export default {
  sync: false,
  from: {
    route: 'doc',
  },
  to: {
    route: 'doc',
  },

  leave(data) {
    return new Promise(resolve => {
      const background = data.current.container.querySelector(
        '.docs__page-transition'
      )
      const tl = new TimelineMax()
      const currentPage = data.current.url.path
      const nextPage = data.next.url.path

      if (
        docsUrlOrderedList.indexOf(currentPage) <
        docsUrlOrderedList.indexOf(nextPage)
      ) {
        tl.add(
          TweenMax.set(background, {
            xPercent: 110,
            display: 'block',
            skewX: -10,
          })
        )
        tl.add(
          TweenMax.to(background, 1, {
            xPercent: 0,
            ease: 'Power4.easeInOut',
            skewX: 0,
            onComplete: () => {
              resolve()
            },
          })
        )
      } else {
        tl.add(
          TweenMax.set(background, {
            xPercent: -110,
            display: 'block',
            skewX: 10,
          })
        )
        tl.add(
          TweenMax.to(background, 1, {
            xPercent: 0,
            ease: 'Power4.easeInOut',
            skewX: 0,
            onComplete: () => {
              resolve()
            },
          })
        )
      }
    })
  },

  enter(data) {
    return new Promise(resolve => {
      resolve()

      document.body.scrollTop = 0
      document.documentElement.scrollTop = 0

      const background = data.next.container.querySelector(
        '.docs__page-transition'
      )
      const tl = new TimelineMax()
      const currentPage = data.current.url.path
      const nextPage = data.next.url.path

      if (
        docsUrlOrderedList.indexOf(currentPage) <
        docsUrlOrderedList.indexOf(nextPage)
      ) {
        tl.add(
          TweenMax.set(background, {
            xPercent: 0,
            display: 'block',
          })
        )
        tl.add(
          TweenMax.to(background, 0.6, {
            xPercent: -100,
            ease: 'Power4.easeInOut',
          })
        )
        tl.add(
          TweenMax.set(background, {
            display: 'none',
          })
        )
      } else {
        tl.add(
          TweenMax.set(background, {
            xPercent: 0,
            display: 'block',
          })
        )
        tl.add(
          TweenMax.to(background, 0.6, {
            xPercent: 100,
            ease: 'Power4.easeInOut',
          })
        )
        tl.add(
          TweenMax.set(background, {
            display: 'none',
          })
        )
      }
    })
  },
}
