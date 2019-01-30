import { Component } from 'kapla';

export default class extends Component {
  load() {
    console.log('Menu:load');

    const subscriber = this.subscribe('menu-trigger');
    subscriber.on('Menu:open', this.open);
    subscriber.on('Menu:close', this.close);
  }

  open() {
    this.$el.classList.add('is-open');
  }

  close() {
    this.$el.classList.remove('is-open');
  }
}
