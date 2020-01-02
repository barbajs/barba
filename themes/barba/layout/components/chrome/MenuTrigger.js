import { Component } from 'kapla'

export default class extends Component {
  load() {
    const subscriber = this.subscribe('menu')

    subscriber.on('overlay:close', this.close)
    subscriber.on('link:close', this.close)
  }

  onClick(e) {
    e.preventDefault()

    if (this.isOpen()) {
      this.close()
    } else {
      this.open()
    }
  }

  open() {
    this.$el.classList.add('is-open')
    document.body.classList.add('prevent-scroll')
    this.emit('menu:open')
  }

  close() {
    this.$el.classList.remove('is-open')
    document.body.classList.remove('prevent-scroll')
    this.emit('menu:close')
  }

  isOpen() {
    return this.$el.classList.contains('is-open')
  }
}
