import { TweenMax } from 'gsap/TweenMax';

export default {
  sync: false,
  from: {
    route: 'feature',
  },
  to: {
    route: 'feature',
  },

  leave() {
    return new Promise(resolve => {
      // Menu
      const menuEls = document.querySelectorAll('.menu__pages__item');
      const menuSubEls = document.querySelectorAll('.menu-subpages__item');

      menuEls.forEach(item => {
        item.classList.remove('is-active');
      });
      menuSubEls.forEach(item => {
        item.classList.remove('is-active');
      });

      // Logo
      const logoElementHover = document.querySelector('.hover');
      const logoElementBig = document.querySelectorAll('.to-animate');

      console.log(logoElementBig);

      logoElementBig.forEach(item => {
        item.classList.remove('to-animate');
      });
      TweenMax.to(logoElementBig, 0.4, {
        onComplete: () => {
          TweenMax.to(logoElementBig, 0.4, {
            opacity: 0,
          });
          TweenMax.to(logoElementHover, 0.4, {
            opacity: 0,
            onComplete: () => {
              resolve();
            },
          });
        },
      });
    });
  },

  enter() {
    return new Promise(resolve => {
      resolve();

      // Menu
      const item = window.location.href.substr(window.location.href.lastIndexOf('/') + 1);

      document.querySelector(`.${item}`).classList.add('is-active');

      // Logo
      const logoElementHover = document.querySelector('.hover');
      const logoElementBig = document.querySelectorAll('.to-animate');

      logoElementBig.forEach(item => {
        item.classList.remove('to-animate');
      });

      TweenMax.to(logoElementHover, 0.4, {
        opacity: 1,
        onComplete: () => {
          logoElementBig.forEach(item => {
            item.classList.add('to-animate');
          });
        },
      });
    });
  },
};

