import { Component } from 'kapla';
import { format } from 'url';
export default class extends Component {
  load() {
    this.delegateClick = 'button';

    // Close modal if click on overlay
    this.$refs.overlay.addEventListener('click', () => {
      this.onOverlayClick();
    });
  }

  // onSubmit() {
  //   db.collection('showcases').add({
  //     authorName: form.authorName.value,
  //     authorUrl: form.authorUrl.value,
  //     display: false,
  //     picture: form.picture.value,
  //     siteName: form.siteName.value,
  //     siteUrl: form.siteUrl.value,
  //   });
  // }

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
