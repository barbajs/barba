import { Component, ee } from 'kapla';

export default class Modal extends Component {
  load() {
    this.delegateClick = [this.$refs.overlay, this.$refs.close];

    // Close modal if click on escape keypress
    this.$el.addEventListener('keydown', e => {
      if (e.key === 'Escape' || e.keyCode === 27) {
        this.close();
      }
    });

    ee.on('modal:open', this.open.bind(this));
    ee.on('modal:close', this.close.bind(this));
    ee.on('modal:focused', this.isFocused.bind(this));
  }

  onClick() {
    this.close();
  }

  isFocused() {
    this.$refs.close.classList.add('is-open');
  }

  open() {
    this.$el.classList.add('is-open');
  }

  close() {
    this.$el.classList.remove('is-open');
    this.$refs.close.classList.remove('is-open');
  }
}
