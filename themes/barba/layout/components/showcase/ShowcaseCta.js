import { Component, ee } from 'kapla'

export default class ShowcaseCta extends Component {
  load() {
    this.delegateClick = 'button'
  }

  // eslint-disable-next-line class-methods-use-this
  onClick() {
    ee.emit('modal:open')
  }
}
