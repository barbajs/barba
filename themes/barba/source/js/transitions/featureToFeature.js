import {
  TweenMax,
  TimelineMax
} from 'gsap/TweenMax';

export default {
  from: {
    route: 'feature',
  },
  to: {
    route: 'feature',
  },

  sync: true,

  leave(data) {
    return new Promise(resolve => {
      // Logo (remove big letter)
      const container = data.current.container.querySelector('.feature__container');
      const box = data.current.container.querySelector('.feature__box');
      // const shapes = data.next.container.querySelector('.logo .big');
      const logo = data.current.container.querySelector('.logo');

      data.current.container.querySelector('.menu-trigger').style.opacity = '0';

      const tl = new TimelineMax({
        onComplete: () => {
          resolve();
        }
      });

      tl.to(container, 1.8, {
        x: -window.innerWidth * 1,
        ease: 'Power4.easeInOut',
      }, 0);

      box && tl.to(box, 1.8, {
        x: -window.innerWidth * 0.3,
        ease: 'Power4.easeInOut',
      }, 0);

      // shapes && tl.to(shapes, 2, {
      //   x: -(window.innerWidth * 2),
      //   ease: 'Power4.easeInOut',
      // }, 0);

      tl.to(logo, 1.5, {
        opacity: 0,
        ease: 'Power4.easeInOut'
      }, 0);

    });
  },

  enter(data) {
    return new Promise(resolve => {
      const container = data.next.container.querySelector('.feature__container');
      const box = data.next.container.querySelector('.feature__box');
      const shapes = data.next.container.querySelector('.logo .big');
      const logo = data.next.container.querySelector('.logo');

      const tl = new TimelineMax({
        onComplete: () => {
          resolve();
        }
      });

      tl.from(container, 1.8, {
        x: window.innerWidth * 1,
        ease: 'Power4.easeInOut',
      }, 0);

      box && tl.from(box, 2, {
        x: window.innerWidth * 0.5,
        ease: 'Power4.easeInOut',
      }, 0);

      // shapes && tl.from(shapes, 2, {
      //   x: window.innerWidth * 2,
      //   ease: 'Power4.easeInOut',
      // }, 0);

      tl.from(logo, 1.5, {
        opacity: 0,
        ease: 'Power4.easeInOut'
      }, 0);

      // const bodymovin = data.next.container.querySelector('.feature__bodymovin');

      // // Logo (small letter go big)
      // const logoElementHover = data.next.container.querySelector('.hover');
      // const logoElementBig = data.next.container.querySelectorAll('.select-to-animate');

      // // TweenMax.to(bodymovin, 2, {
      // //   opacity: 1,
      // // });
      // TweenMax.to(logoElementHover, 0.4, {
      //   opacity: 1,
      // });
      // TweenMax.to(logoElementBig, 0.4, {
      //   opacity: 1,
      //   onComplete: () => {
      //     logoElementBig.forEach(item => {
      //       item.classList.add('to-animate');
      //     });
      //   },
      // });
    });
  },
};

// import {
//   TweenMax
// } from 'gsap/TweenMax';

// export default {
//   from: {
//     route: 'feature',
//   },
//   to: {
//     route: 'feature',
//   },

//   leave(data) {
//     return new Promise(resolve => {
//       // Logo (remove big letter)
//       const logoElementHover = data.current.container.querySelector('.hover');
//       const logoElementBig = data.current.container.querySelectorAll('.to-animate');

//       logoElementBig.forEach(item => {
//         item.classList.remove('to-animate');
//       });

//       TweenMax.to(logoElementBig, 0.4, {
//         onComplete: () => {
//           TweenMax.to(logoElementBig, 0.4, {
//             opacity: 0,
//           });
//           TweenMax.to(logoElementHover, 0.4, {
//             opacity: 0,
//             onComplete: () => {
//               resolve();
//             },
//           });
//         },
//       });

//       // Logo (prepare small letter for going big)
//       const logoElementHoverNext = data.next.container.querySelector('.hover');
//       const logoElementBigNext = data.next.container.querySelectorAll('.to-animate');
//       // const bodymovin = data.next.container.querySelector('.feature__bodymovin');

//       logoElementBigNext.forEach(item => {
//         item.classList.remove('to-animate');
//       });
//       TweenMax.set(logoElementBigNext, {
//         opacity: 0,
//       });
//       // TweenMax.set(bodymovin, {
//       //   opacity: 0,
//       // });
//       TweenMax.set(logoElementHoverNext, {
//         opacity: 0,
//       });
//     });
//   },

//   enter(data) {
//     return new Promise(resolve => {
//       resolve();

//       // const bodymovin = data.next.container.querySelector('.feature__bodymovin');

//       // Logo (small letter go big)
//       const logoElementHover = data.next.container.querySelector('.hover');
//       const logoElementBig = data.next.container.querySelectorAll('.select-to-animate');

//       // TweenMax.to(bodymovin, 2, {
//       //   opacity: 1,
//       // });
//       TweenMax.to(logoElementHover, 0.4, {
//         opacity: 1,
//       });
//       TweenMax.to(logoElementBig, 0.4, {
//         opacity: 1,
//         onComplete: () => {
//           logoElementBig.forEach(item => {
//             item.classList.add('to-animate');
//           });
//         },
//       });
//     });
//   },
// };
