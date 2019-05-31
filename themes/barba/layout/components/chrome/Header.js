import { Component } from 'kapla';

export default class extends Component {
  load() {
    const subscriber = this.subscribe('menu-trigger');

    subscriber.on('menu:open', this.open);
    subscriber.on('menu:close', this.close);

    // this
    //   .subscribe('showcase')
    //   .on('showcase:open', () => {
    //     console.log('showcase');
    //   });

    this.delegateClick = 'a';
  }

  open() {
    this.$el.classList.add('is-open');
  }

  close() {
    this.$el.classList.remove('is-open');
  }
}
