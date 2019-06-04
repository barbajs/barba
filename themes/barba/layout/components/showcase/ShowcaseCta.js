import { Component } from 'kapla';
import db from '../../../source/js/connectionDB';
import firebase from 'firebase/app';

export default class ShowcaseCta extends Component {
  load() {
    this.delegateClick = 'button';
    this.delegateSubmit = this.$refs.form;

    // Close modal if click on overlay
    this.$refs.overlay.addEventListener('click', () => {
      this.onOverlayClick();
    });
  }

  onSubmit(e) {
    e.preventDefault();

    const [file] = this.$refs.form.pictureUrl.files;

    ShowcaseCta
      .uploadFile(file)
      .then(downloadURL => {
        this.createShowcase(downloadURL);
      })
      .then(() => {
        console.log('COMPLETE');
        this.$refs.form.authorName.value = '';
        this.$refs.form.authorUrl.value = '';
        this.$refs.form.pictureUrl.value = '';
        this.$refs.form.siteName.value = '';
        this.$refs.form.siteUrl.value = '';
      })
      .catch(err => {
        console.error(err);
      });
  }

  static uploadFile(file) {
    return new Promise((resolve, reject) => {
      const storageRef = firebase
        .storage()
        .ref()
        .child(`showcases/${file.name}`);

      const uploadTask = storageRef.put(file);

      uploadTask.on('state_changed', snapshot => {
        // Observe state change events such as progress, pause, and resume
        // Get task progress, including the number of bytes uploaded and the total number of bytes to be uploaded
        // var progress = (snapshot.bytesTransferred / snapshot.totalBytes) * 100;
        // console.log('Upload is ' + progress + '% done');
        switch (snapshot.state) {
          case firebase.storage.TaskState.PAUSED: // Or 'paused'
            console.log('Upload is paused');
            break;
          case firebase.storage.TaskState.RUNNING: // Or 'running'
            console.log('Upload is running');
            break;
          default:
        }
      }, error => {
        // Handle unsuccessful uploads
        console.error(error);
        reject(error);
      }, () => {
        // Handle successful uploads on complete
        // For instance, get the download URL: https://firebasestorage.googleapis.com/...
        uploadTask.snapshot.ref.getDownloadURL().then(downloadURL => {
          console.log('File available at', downloadURL);
          resolve(downloadURL);
        });
      });
    });
  }

  createShowcase(downloadURL) {
    console.log(this);

    return db.collection('showcases').add({
      authorName: this.$refs.form.authorName.value,
      authorUrl: this.$refs.form.authorUrl.value,
      isValidated: false,
      pictureUrl: downloadURL,
      siteName: this.$refs.form.siteName.value,
      siteUrl: this.$refs.form.siteUrl.value,
      dateCreation: new firebase.firestore.Timestamp.now(), // eslint-disable-line new-cap
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
