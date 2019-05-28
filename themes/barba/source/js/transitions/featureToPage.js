export default {
  from: {
    route: 'feature',
  },
  to: {
    route: 'page',
  },

  leave(data) {
    return new Promise(resolve => {
      // const menuEls = document.querySelectorAll('.menu__pages__item');
      // const menuSubEls = document.querySelectorAll('.menu-subpages__item');


      // menuEls.forEach(item => {
      //   item.classList.remove('is-active');
      // });

      // menuSubEls.forEach(item => {
      //   item.classList.remove('is-active');
      // });

      resolve();
    });
  },

  enter(data) {
    return new Promise(resolve => {
      // data.trigger.parentNode.classList.add('is-active');
      resolve();
    });
  }
};

