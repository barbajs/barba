import { TweenMax } from 'gsap/TweenMax';

export default {
  from: {
    route: 'feature',
  },
  to: {
    route: 'feature',
  },

  leave(data) {
    return new Promise(resolve => {
      // Menu (remove close the header and side menu if open)
      // const header = data.current.container.querySelector('.site-header');
      // const menu = data.current.container.querySelector('.menu');
      // const menuTrigger = data.current.container.querySelector('.menu-trigger');
      // const menuEls = data.current.container.querySelectorAll('.menu__pages__item');
      // const menuSubEls = data.current.container.querySelectorAll('.menu-subpages__item');

      // if (header.classList.contains('is-open')) {
      //   header.classList.remove('is-open');
      //   menu.classList.remove('is-open');
      //   menuTrigger.classList.remove('is-open');
      //   menuEls.forEach(item => {
      //     item.classList.remove('is-active');
      //   });
      //   menuSubEls.forEach(item => {
      //     item.classList.remove('is-active');
      //   });
      //   document.body.classList.remove('prevent-scroll');
      // }

      // Logo (remove big letter)
      const logoElementHover = data.current.container.querySelector('.hover');
      const logoElementBig = data.current.container.querySelectorAll('.to-animate');

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

      // Logo (prepare small letter for going big)
      const logoElementHoverNext = data.next.container.querySelector('.hover');
      const logoElementBigNext = data.next.container.querySelectorAll('.to-animate');

      logoElementBigNext.forEach(item => {
        item.classList.remove('to-animate');
      });
      TweenMax.set(logoElementBigNext, {
        opacity: 0,
      });
      TweenMax.set(logoElementHoverNext, {
        opacity: 0,
      });
    });
  },

  enter(data) {
    return new Promise(resolve => {
      resolve();

      // Logo (small letter go big)
      const logoElementHover = data.next.container.querySelector('.hover');
      const logoElementBig = data.next.container.querySelectorAll('.select-to-animate');

      TweenMax.to(logoElementHover, 0.4, {
        opacity: 1,
      });
      TweenMax.to(logoElementBig, 0.4, {
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

