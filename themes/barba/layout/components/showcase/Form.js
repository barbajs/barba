import { Component, ee } from 'kapla'
import db from '../../../source/js/connectionDB'
import firebase from 'firebase/app'

export default class Form extends Component {
  load() {
    const dragEvents = ['dragenter', 'dragover', 'dragleave', 'drop']

    this.file = []

    dragEvents.forEach(e => {
      this.$refs.dropArea.addEventListener(
        e,
        this.preventDefaults.bind(this),
        false
      )
    })
    ;['dragenter', 'dragover', 'drop'].forEach(e => {
      this.$refs.dropArea.addEventListener(e, this.highlight.bind(this), false)
    })
    ;['dragleave'].forEach(e => {
      this.$refs.dropArea.addEventListener(
        e,
        this.unhighlight.bind(this),
        false
      )
    })

    this.$refs.dropArea.addEventListener(
      'drop',
      this.handleDrop.bind(this),
      false
    )

    this.$refs.dropArea.addEventListener('click', () => {
      this.onDropAreaClick()
    })

    this.$refs.pictureFile.addEventListener('input', () => {
      this.file = this.$refs.pictureFile.files[0] // eslint-disable-line prefer-destructuring
      this.$refs.pictureName.innerHTML = this.file.name
      this.highlight()
    })

    Array.prototype.forEach.call(this.$el.elements, input => {
      input.addEventListener('input', () => {
        this.checkInputs()
      })
    })
  }

  // eslint-disable-next-line class-methods-use-this
  onClick() {
    ee.emit('modal:focused')
  }

  onSubmit(e) {
    e.preventDefault()

    if (this.formValidation()) {
      // Check if the form has been completed correctly
      this.$refs.inputs.classList.add('is-hidden')
      ee.emit('spinner:start')
      this.unhighlight()

      Form.uploadFile(this.file) // Store the picture in Firebase Cloud and the info in Firestore
        .then(downloadURL => {
          this.createShowcase(downloadURL)
        })
        // Loader to wait the response
        .then(() => {
          ee.emit('spinner:stop')
        })
        // Handle success with feedback
        .then(() => {
          this.$refs.succeed.classList.add('is-active')
          setTimeout(() => {
            this.$refs.succeed.classList.remove('is-active')
            this.resetValues()
            ee.emit('modal:close')
            this.$refs.inputs.classList.remove('is-hidden')
          }, 2000)
        })
        // Handle error with feedback
        .catch(err => {
          console.error(err)
          ee.emit('spinner:stop')
          this.$refs.failed.classList.add('is-active')
          this.$refs.failed.innerHTML = err.message
          setTimeout(() => {
            this.$refs.failed.classList.remove('is-active')
            ee.emit('modal:close')
            this.$refs.inputs.classList.remove('is-hidden')
          }, 5000)
        })
    }
  }

  static uploadFile(file) {
    return new Promise((resolve, reject) => {
      const storageRef = firebase
        .storage()
        .ref()
        .child(`showcases/${file.name}`)

      const uploadTask = storageRef.put(file)

      uploadTask.on(
        'state_changed',
        snapshot => {
          // Observe state change events such as progress, pause, and resume
          // Get task progress, including the number of bytes uploaded and the total number of bytes to be uploaded
          // var progress = (snapshot.bytesTransferred / snapshot.totalBytes) * 100;
          // console.log('Upload is ' + progress + '% done');
          switch (snapshot.state) {
            case firebase.storage.TaskState.PAUSED: // Or 'paused'
              console.log('Upload is paused')
              break
            case firebase.storage.TaskState.RUNNING: // Or 'running'
              console.log('Upload is running')
              break
            default:
          }
        },
        error => {
          // Handle unsuccessful uploads
          console.error(error)
          reject(error)
        },
        () => {
          // Handle successful uploads on complete
          // For instance, get the download URL: https://firebasestorage.googleapis.com/...
          uploadTask.snapshot.ref.getDownloadURL().then(downloadURL => {
            // DEV
            // console.log('File available at', downloadURL)
            resolve(downloadURL)
          })
        }
      )
    })
  }

  createShowcase(downloadURL) {
    return db.collection('showcases').add({
      authorName: this.$refs.authorName.value,
      authorUrl: this.$refs.authorUrl.value,
      isValidated: false,
      pictureUrl: downloadURL,
      siteName: this.$refs.siteName.value,
      siteUrl: this.$refs.siteUrl.value,
      dateCreation: new firebase.firestore.Timestamp.now(), // eslint-disable-line new-cap
    })
  }

  resetValues() {
    this.$refs.authorName.value = ''
    this.$refs.authorUrl.value = ''
    this.$refs.dropArea.value = ''
    this.$refs.pictureFile.value = ''
    this.$refs.pictureName.innerHTML = 'No file submitted'
    this.$refs.siteName.value = ''
    this.$refs.siteUrl.value = ''
    this.file = []
  }

  // eslint-disable-next-line class-methods-use-this
  preventDefaults(e) {
    e.preventDefault()
    e.stopPropagation()
  }

  highlight() {
    this.$refs.dropArea.classList.add('highlight')
  }

  unhighlight() {
    this.$refs.dropArea.classList.remove('highlight')
  }

  handleDrop(e) {
    const dt = e.dataTransfer

    this.file = dt.files[0] // eslint-disable-line prefer-destructuring
    this.checkInputs()
    this.$refs.pictureName.innerHTML = this.file.name
  }

  onDropAreaClick() {
    this.$refs.pictureFile.click()
  }

  checkInputs() {
    if (
      this.$refs.authorName.value &&
      this.$refs.siteName.value &&
      this.$refs.siteUrl.value &&
      this.file.length !== 0
    ) {
      this.$el.classList.remove('is-invalid')

      return true
    }
    this.$el.classList.add('is-invalid')

    return false
  }

  formValidation() {
    // eslint-disable-next-line max-len
    const urlPattern = /^(?:(?:https?|ftp):\/\/)?(?:(?!(?:10|127)(?:\.\d{1,3}){3})(?!(?:169\.254|192\.168)(?:\.\d{1,3}){2})(?!172\.(?:1[6-9]|2\d|3[0-1])(?:\.\d{1,3}){2})(?:[1-9]\d?|1\d\d|2[01]\d|22[0-3])(?:\.(?:1?\d{1,2}|2[0-4]\d|25[0-5])){2}(?:\.(?:[1-9]\d?|1\d\d|2[0-4]\d|25[0-4]))|(?:(?:[a-z\u00a1-\uffff0-9]-*)*[a-z\u00a1-\uffff0-9]+)(?:\.(?:[a-z\u00a1-\uffff0-9]-*)*[a-z\u00a1-\uffff0-9]+)*(?:\.(?:[a-z\u00a1-\uffff]{2,})))(?::\d{2,5})?(?:\/\S*)?$/

    // Picture
    if (
      this.file.length === 0 ||
      this.file.size > 2100000 ||
      (this.file.type !== 'image/jpeg' &&
        this.file.type !== 'image/png' &&
        this.file.type !== 'image/gif')
    ) {
      console.error('Invalid image, please respect indications')

      return false
    } else if (
      // Site Name
      typeof this.$refs.siteName.value !== 'string' &&
      this.$refs.siteName.value.length < 2 &&
      this.$refs.siteName.value.length > 64
    ) {
      console.error(
        'Invalid site name, it should be between 2 and 64 characters'
      )

      return false
    } else if (
      // Site Url
      urlPattern.test(this.$refs.siteUrl.value) === false
    ) {
      console.error('Invalid site url')

      return false
    } else if (
      // Author Name
      typeof this.$refs.authorName.value !== 'string' &&
      this.$refs.authorName.value.length < 2 &&
      this.$refs.authorName.value.length > 64
    ) {
      console.error(
        'Invalid author name, it should be between 2 and 64 characters'
      )

      return false
    } else if (
      // Author Url
      this.$refs.authorUrl.value &&
      urlPattern.test(this.$refs.authorUrl.value) === false
    ) {
      console.error('Invalid author url')

      return false
    }

    return true
  }
}
