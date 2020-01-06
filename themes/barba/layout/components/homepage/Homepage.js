import barba from '@barba/core'
import {
  Component,
} from 'kapla'
import {
  gsap,
} from 'gsap'
import {
  $on,
  $off,
  qsa,
  qs,
} from '../../../source/js/utils/dom'

export default class extends Component {
  load() {
    this.$logoHover = qs('.logo.only-big', this.$el)

    this.$logo = qs('.homepage__logo.logo svg', this.$el)
    this.$links = [...qsa('.homepage__logo.logo .links a', this.$el)]
    this.$items = [...qsa('.only-big .hover .item', this.$el)]

    this.mouseEnter = this.mouseEnter.bind(this)
    this.mouseLeave = this.mouseLeave.bind(this)

    this.$links.forEach((link, index) => {
      $on(link, 'mouseenter', () => this.mouseEnter(index))
      $on(link, 'mouseleave', () => this.mouseLeave(index))
    })
  }

  destroy() {
    this.$links.forEach((link, index) => {
      $off(link, 'mouseenter', () => this.mouseEnter(index))
      $off(link, 'mouseleave', () => this.mouseLeave(index))
    })
  }

  mouseEnter(index) {
    this.$logo.classList.add('gray')
    const {
      featureSlug
    } = this.$refs.listItem[index].dataset
    const container = document.querySelector('[data-barba="container"]')

    container.dataset.featureSlug = featureSlug;
    gsap.killTweensOf(this.$refs.listItem[index])
    gsap.killTweensOf(this.$items[index])

    gsap.to(this.$items[index], {
      duration: 0.4,
      opacity: 1,
    })

    gsap.to(this.$refs.listItem[index], {
      duration: 0.2,
      opacity: 1,
      scale: 1,
    })

    gsap.to(this.$refs.list, {
      duration: 0.4,
      yPercent: -(index * 100),
      ease: 'power4',
    })
  }

  mouseLeave(index) {
    if (barba.transitions.isRunning) {
      return
    }

    const container = document.querySelector('[data-barba="container"]')

    container.dataset.featureSlug = '';

    this.$logo.classList.remove('gray')

    gsap.killTweensOf(this.$refs.listItem[index])
    gsap.killTweensOf(this.$items[index])

    gsap.to(this.$items[index], {
      duration: 0.4,
      opacity: 0,
    })

    gsap.to(this.$refs.listItem[index], {
      duration: 0.2,
      opacity: 0,
      scale: 0.9,
    })
  }

  // DEV
  // onResize() {
  //   const bounds = this.$logo.getBoundingClientRect();

  //   this.$logoHover.style.top = `${bounds.top}px`;
  //   this.$logoHover.style.left = `${bounds.left}px`;
  //   this.$logoHover.style.right = `${bounds.right}px`;
  //   this.$logoHover.style.bottom = `${bounds.bottom}px`;
  // }
}
