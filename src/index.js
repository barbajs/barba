import { version } from '../package.json';

import { getHref } from './utils';

export default {
  version,
  link: undefined, // Will store the HTMLElement of the last link clicked
  hash: undefined, // Will store the hash of the next page

  init(options) {
    this.options = Object.assign(
      {
        cache: false,
        prefetch: false,
        transition: () => done => done(),
        views: {},
      },
      options
    );

    this.onClick = this.onClick.bind(this);
    this.onURLChange = this.onURLChange.bind(this);
    this.bind();
  },

  bind() {
    document.addEventListener('click', this.onClick);
    window.addEventListener('popstate', this.onURLChange);
  },

  destroy() {
    document.removeEventListener('click', this.onClick);
    window.removeEventListener('popstate', this.onURLChange);
  },

  onClick(e) {
    let el = e.target;

    while (el && !getHref(el)) {
      el = el.parentNode;
    }
  },

  onURLChange() {},
};
