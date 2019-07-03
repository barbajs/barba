import {
  TweenMax,
  TimelineMax
} from 'gsap/all';

export default {
  sync: true,

  from: {
    route: 'feature',
  },

  to: {
    route: 'home',
  },

  leave(data) {
    return new Promise(resolve => {
      const container = data.current.container.querySelector('.feature__container');
      const navigation = data.current.container.querySelectorAll('.feature__nav__el');
      const oldLogo = data.current.container.querySelectorAll('.logo.featured .base, .logo.featured .hover');
      const fullOldLogo = data.current.container.querySelectorAll('.logo.featured');
      const oldBigShape = data.current.container.querySelector('.logo.only-big');

      data.current.container.querySelector('.menu-trigger').style.opacity = '0';

      const tl = new TimelineMax({
        onComplete: () => {
          resolve();
        },
      });

      tl.to(oldLogo, 0.3, {
        opacity: 0,
      }, 1);

      tl.to(oldBigShape, 1.5, {
        y: 100,
        opacity: 0,
        ease: 'Power4.easeIn',
      }, 0.4);

      tl.to(fullOldLogo, 1, {
        opacity: 0,
      }, 1.3);

      tl.to(container, 1, {
        y: 100,
        opacity: 0,
        ease: 'Power4.easeIn'
      }, 0);

      tl.to(navigation, 0.5, {
        y: 30,
        opacity: 0,
        ease: 'Power4.easeIn'
      }, 0.2);

    });
  },

  enter(data) {
    return new Promise(resolve => {
      const newLogo = data.next.container.querySelector('.logo');
      const newLogoSVG = newLogo.querySelector('svg');
      const oldLogo = data.current.container.querySelector('.logo.featured');
      const title = data.next.container.querySelectorAll('h1 span');
      const buttons = data.next.container.querySelectorAll('.intro__buttons a');

      const oldLogoRect = oldLogo.getBoundingClientRect();
      const newLogoRect = newLogo.getBoundingClientRect();

      const tl = new TimelineMax({
        onComplete: () => {
          resolve();
        }
      });

      const scale = oldLogoRect.width / newLogoRect.width;

      newLogoSVG.classList.add('fillgray');

      tl.set(newLogo, {
        scale,
        // y: -((oldLogoRect.top - newLogoRect.top) + ((newLogoRect.height * scale) * 2) - 6),
        y: -(newLogoRect.top - oldLogoRect.top) - 40,
        opacity: 0,
      });

      tl.add(() => {
        newLogoSVG.classList.remove('fillgray');
      }, 1.5)

      tl.to(newLogo, 0.3, {
        opacity: 1,
      }, 1);

      tl.to(newLogo, 1, {
        scale: 1,
        y: 0,
        ease: 'Power4.easeInOut',
      }, 1.3);

      tl.staggerFrom(title, 1, {
        yPercent: 100,
        ease: 'Power4.easeOut',
      }, 0.05, 1.6);

      tl.staggerFrom(buttons, 1, {
        y: 40,
        opacity: 0,
        ease: 'Power4.easeOut'
      }, 0.05, 1.7);

    });
  }
};
