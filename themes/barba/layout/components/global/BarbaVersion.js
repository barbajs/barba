import { Component } from 'kapla'
import barba from '@barba/core'

export default class BarbaVersion extends Component {
  load() {
    this.$el.innerHTML = `v${barba.version}`;
  }
}
