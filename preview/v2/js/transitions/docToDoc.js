import {
  gsap,
} from 'gsap'

const {
  docs,
} = window.BARBA
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
  from: {
    route: 'docs',
  },
  to: {
    route: 'docs',
  },

  leave({
    current,
    next,
  }) {
    const background = current.container.querySelector('.docs__page-transition')
    const currentPage = current.url.path
    const nextPage = next.url.path
    const tl = gsap.timeline()

    if (
      docsUrlOrderedList.indexOf(currentPage) <
      docsUrlOrderedList.indexOf(nextPage)
    ) {
      tl.add(
        gsap.set(background, {
          xPercent: 110,
          display: 'block',
          skewX: -10,
        })
      ).add(
        gsap.to(background, {
          duration: 1,
          xPercent: 0,
          ease: 'power4.inOut',
          skewX: 0,
        })
      )
    } else {
      tl.add(
        gsap.set(background, {
          xPercent: -110,
          display: 'block',
          skewX: 10,
        })
      ).add(
        gsap.to(background, {
          duration: 1,
          xPercent: 0,
          ease: 'power4.inOut',
          skewX: 0,
        })
      )
    }

    return tl.then()
  },

  enter({
    current,
    next,
  }) {
    document.body.scrollTop = 0
    document.documentElement.scrollTop = 0

    const background = next.container.querySelector('.docs__page-transition')
    const currentPage = current.url.path
    const nextPage = next.url.path
    const tl = gsap.timeline()

    if (
      docsUrlOrderedList.indexOf(currentPage) <
      docsUrlOrderedList.indexOf(nextPage)
    ) {
      tl
        .add(
          gsap.set(background, {
            xPercent: 0,
            display: 'block',
          })
        )
        .to(background, {
          duration: 0.6,
          xPercent: -100,
          ease: 'power4.inOut',
        })
        .set(background, {
          display: 'none',
        })
    } else {
      tl
        .add(
          gsap.set(background, {
            xPercent: 0,
            display: 'block',
          })
        )
        .to(background, {
          duration: 0.6,
          xPercent: 100,
          ease: 'power4.inOut',
        })
        .set(background, {
          display: 'none',
        })
    }
  },
}
