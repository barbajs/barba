import { Component } from 'kapla'

export default class DocsNav extends Component {
  load() {
    const subscriber = this.subscribe('docs-nav-lateral')

    subscriber.on('docs-nav:open', this.open.bind(this))
    subscriber.on('docs-nav:close', this.close.bind(this))

    this.delegateClick = 'a'
  }

  open() {
    this.$el.classList.add('is-open')
  }

  close() {
    this.$el.classList.remove('is-open')
  }

  onOverlayClick() {
    this.emit('overlay:close')
    this.close()
  }

  onClick() {
    this.emit('link:close')
    this.close()
  }
}
