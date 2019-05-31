import { Component } from 'kapla';

export default class extends Component {
  load() {
    this.delegateClick = 'button';

    // Close modal if click on overlay
    this.$refs.overlay.addEventListener('click', () => {
      this.onOverlayClick();
    });
  }

  onClick() {
    this.open();
    this.emit('showcase:open');
  }

  open() {
    this.$refs.modal.classList.add('is-open');
    this.$refs.overlay.classList.add('is-open');
  }

  close() {
    this.$refs.modal.classList.remove('is-open');
    this.$refs.overlay.classList.remove('is-open');
  }

  onOverlayClick() {
    this.close();
  }
}
