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
      // const bodymovin = data.next.container.querySelector('.feature__bodymovin');

      logoElementBigNext.forEach(item => {
        item.classList.remove('to-animate');
      });
      TweenMax.set(logoElementBigNext, {
        opacity: 0,
      });
      // TweenMax.set(bodymovin, {
      //   opacity: 0,
      // });
      TweenMax.set(logoElementHoverNext, {
        opacity: 0,
      });
    });
  },

  enter(data) {
    return new Promise(resolve => {
      resolve();

      // const bodymovin = data.next.container.querySelector('.feature__bodymovin');

      // Logo (small letter go big)
      const logoElementHover = data.next.container.querySelector('.hover');
      const logoElementBig = data.next.container.querySelectorAll('.select-to-animate');

      // TweenMax.to(bodymovin, 2, {
      //   opacity: 1,
      // });
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

