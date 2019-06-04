import { Component } from 'kapla';
import db from '../../../source/js/connectionDB';

export default class extends Component {
  load() {
    this.delegateClick = 'button';

    // Close modal if click on overlay
    this.$refs.overlay.addEventListener('click', () => {
      this.onOverlayClick();
    });
  }

  onSubmit(e) {
    e.preventDefault();
    db.collection('showcases').add({
      authorName: this.$refs.form.authorName.value,
      authorUrl: this.$refs.form.authorUrl.value,
      display: false,
      picture: this.$refs.form.picture.value,
      siteName: this.$refs.form.siteName.value,
      siteUrl: this.$refs.form.siteUrl.value,
    });
    this.$refs.form.authorName.value = '';
    this.$refs.form.authorUrl.value = '';
    this.$refs.form.picture.value = '';
    this.$refs.form.siteName.value = '';
    this.$refs.form.siteUrl.value = '';
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
