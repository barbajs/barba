import { Component } from 'kapla';

export default class extends Component {
  onClick(e) {
    e.preventDefault();

    if (this.isOpen()) {
      this.emit('Menu:close');
      this.$el.classList.remove('is-open');
    } else {
      this.emit('Menu:open');
      this.$el.classList.add('is-open');
    }
  }

  isOpen() {
    return this.$el.classList.contains('is-open');
  }
}
