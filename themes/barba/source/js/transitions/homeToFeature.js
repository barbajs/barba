import {
  TweenMax,
  TimelineMax
} from 'gsap/all';
import {
  qs,
  qsa
} from '../../../source/js/utils/dom';
import deferred from '../../../source/js/utils/deferred';

export default {
  sync: true,
  from: {
    route: 'home',
  },
  to: {
    route: 'feature',
  },

  leave(data) {
    return new Promise(resolve => {
      const oldLogo = data.current.container.querySelector('.logo');
      const newLogo = data.next.container.querySelector('.logo.featured');
      const title = data.current.container.querySelectorAll('h1 span');
      const buttons = data.current.container.querySelectorAll('.intro__buttons a');

      data.current.container.style.zIndex = -1;

      oldLogo.querySelector('svg').classList.add('fillgray');

      const oldLogoRect = oldLogo.getBoundingClientRect();
      const newLogoRect = newLogo.getBoundingClientRect();

      data.current.container.querySelector('.menu-trigger').style.opacity = '0';

      const tl = new TimelineMax({
        onComplete: () => {
          resolve();
        }
      });

      const scale = newLogoRect.width / oldLogoRect.width;

      tl.to(oldLogo, 1.4, {
        scale,
        y: -((oldLogoRect.top - newLogoRect.top) + ((newLogoRect.height * scale) * 2) - 6),
        ease: 'Power4.easeInOut'
      }, 0);

      tl.staggerTo(title, 1, {
        yPercent: 100,
        ease: 'Power4.easeInOut'
      }, 0.05, 0);

      tl.staggerTo(buttons, 1, {
        y: 40,
        opacity: 0,
        ease: 'Power4.easeIn'
      }, 0.05, 0.1);

      // resolve();
    });
  },

  enter(data) {
    return new Promise(resolve => {
      const newLogo = data.next.container.querySelector('.logo.featured');
      const container = data.next.container.querySelector('.feature__container');
      const navigation = data.next.container.querySelectorAll('.feature__nav__el');

      const tl = new TimelineMax({
        delay: 1.3,
        onComplete: () => {
          resolve();
        }
      });

      tl.from(newLogo, 1, {
        opacity: 0,
      }, 0);

      tl.from(container, 1, {
        opacity: 0,
        y: 100,
        ease: 'Power4.easeOut'
      }, 0);

      tl.staggerFrom(navigation, .4, {
        opacity: 0,
        y: 30,
        ease: 'Power4.easeOut'
      }, 0.2, 0.8);

    });
  }

};


function oldEnder(data) {
  data.next.container.style.cssText = `
    visibility: hidden;
    position: absolute;
    top: 0;
    left: 0;
    right: 0;
    bottom: 0;
  `;

  const current = {};
  current.$logo = qs('.logo', data.current.container),
    current.logoRect = current.$logo.getBoundingClientRect();
  current.$morphParent = qs('.big1', current.$logo);
  current.$morphs = [...qsa('[data-morph]', current.$morphParent)];
  current.$fadeOut = qsa('.intro h1, .intro .button');

  const next = {};
  next.$logo = qs('.logo', data.next.container),
    next.logoRect = next.$logo.getBoundingClientRect();
  next.$morphParent = qs('.big1', next.$logo);
  next.$morphs = [...qsa('[data-morph]', next.$morphParent)];

  qs('svg', current.$logo).classList.add('fillgray');

  const dfd = deferred();

  const tl = new TimelineMax({
    onComplete: () => {
      data.next.container.style.cssText = '';
      dfd.resolve();
    }
  });

  tl.to(current.$logo, 2, {
    y: next.logoRect.y - current.logoRect.y - 40,
    width: next.logoRect.width,
  }, 0);

  tl.staggerTo(current.$fadeOut, 0.4, {
    y: 50,
    opacity: 0,
  }, 0.1);

  tl.to(current.$morphParent, 1, {
    opacity: 1,
  }, 0);

  current.$morphs.forEach((el, index) => {
    tl.to(el, 3, {
      // transformOrigin: next.$morphs[index].style.transformOrigin,
      transform: getComputedStyle(next.$morphs[index]).transform
    }, 0.1 + (0.1 * index));
  });

  tl.add('crossfade');

  tl.set(data.next.container, {
    visibility: 'visible',
    opacity: 0,
  }, 'crossfade');

  tl.to(data.next.container, 1, {
    opacity: 1,
  }, 'crossfade');

  tl.to(data.current.container, 1, {
    opacity: 0,
  }, 'crossfade');

  return dfd.promise;
}
