import { Component } from 'kapla';

export default class extends Component {
  onClick(e) {
    e.preventDefault();

    if (this.isOpen()) {
      this.emit('menu:close');
      this.$el.classList.remove('is-open');
    } else {
      this.emit('menu:open');
      this.$el.classList.add('is-open');
    }
  }

  isOpen() {
    return this.$el.classList.contains('is-open');
  }
}
