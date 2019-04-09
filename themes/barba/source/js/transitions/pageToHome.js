export default {
  sync: true,
  from: {
    route: 'page',
  },
  to: {
    route: 'home',
  },

  leave(data) {
    return new Promise(resolve => {
      const menuEls = document.querySelectorAll('.menu__pages__item');
      const menuSubEls = document.querySelectorAll('.menu-subpages__item');


      menuEls.forEach(item => {
        item.classList.remove('is-active');
      });

      menuSubEls.forEach(item => {
        item.classList.remove('is-active');
      });

      resolve();
    });
  },

  enter(data) {
    return new Promise(resolve => {
      data.trigger.parentNode.classList.add('is-active');
      resolve();
    });
  }
};

