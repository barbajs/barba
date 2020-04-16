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

  onClick(event) {
    const title = event.target;

    // Manage navigation titles
    if (title.classList.contains('docs__nav__title')) {
      document.querySelectorAll('.docs__nav__list .is-open').forEach(item => {
        item.classList.remove('is-open');
      });

      // Open the clicked title, sublist and first sublist title
      const sublist = title.parentNode.parentNode.querySelector('.docs__nav__sublist');

      title.classList.add('is-open');
      sublist.classList.add('is-open');
      sublist.querySelector('li:first-child').classList.add('is-open');
      sublist.querySelector('li:first-child .docs__nav__subtitle').classList.add('is-open');
    }

    // Manage navigation subtitles
    if (title.classList.contains('docs__nav__subtitle')) {
      document.querySelectorAll('.docs__nav__sublist .is-open').forEach(item => {
        item.classList.remove('is-open');
      });

      title.classList.add('is-open');
      title.parentNode.parentNode.classList.add('is-open');
    }

    this.emit('link:close')
    this.close()
  }
}
