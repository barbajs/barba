import { Component } from 'kapla';

export default class extends Component {
  load() {
    const subscriber = this.subscribe('menu-trigger');
    const links = this.$el.querySelectorAll('a');
    const overlay = this.$el.querySelector('.menu__overlay');

    subscriber.on('menu:open', this.open);
    subscriber.on('menu:close', this.close);

    this.delegateClick = 'a';

    // Close menu if click on overlay
    overlay.addEventListener('click', () => {
      this.onOverlayClick();
    });
    // Close menu if click on other links
    links.forEach(link => link.addEventListener('click', () => {
      this.onLinkClick();
    }));
  }

  open() {
    this.$el.classList.add('is-open');
  }

  close() {
    this.$el.classList.remove('is-open');
  }

  onOverlayClick() {
    this.emit('overlay:close');
    this.close();
  }

  onLinkClick() {
    this.emit('link:close');
    this.close();
  }

  onClick() {

  }
}
