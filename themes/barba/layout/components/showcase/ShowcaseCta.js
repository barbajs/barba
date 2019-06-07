import { Component, ee } from 'kapla';

export default class ShowcaseCta extends Component {
  load() {
    this.delegateClick = 'button';
  }

  onClick() { // eslint-disable-line class-methods-use-this
    ee.emit('modal:open');
  }
}
