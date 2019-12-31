import {
  TimelineMax,
  TweenMax,
} from 'gsap/all';

import {
  getInstance,
} from '../app';

import {
  qs,
  qsa,
} from '../../../source/js/utils/dom';
import deferred from '../../../source/js/utils/deferred';

import NAMESPACES_ORDER from './featuresOrder';

export default {
  sync: true,
  from: {
    route: 'home',
  },
  to: {
    route: 'feature',
  },

  leave({
    current,
    next,
  }) {
    return new Promise(resolve => {
      const intro = current.container.querySelector('.intro');
      const oldLogo = current.container.querySelector('.logo.home-logo');
      const newLogo = next.container.querySelector('.logo.featured');
      const title = current.container.querySelectorAll('h1 span');
      const buttons = current.container.querySelectorAll('.intro__buttons a');
      const list = current.container.querySelector('.intro__list');
      const {
        featureSlug,
      } = next.container.querySelector('.feature').dataset;
      const hoverIndex = NAMESPACES_ORDER.indexOf(featureSlug);
      const bigShape = current.container.querySelectorAll('.logo.only-big .hover .item')[hoverIndex];
      const oldBigShape = current.container.querySelector('.logo.only-big');
      const newBigShape = next.container.querySelector('.logo.only-big');


      newBigShape.classList.remove('can-move');

      current.container.style.zIndex = -1;

      oldLogo.querySelector('svg').classList.add('fillgray');

      const oldLogoRect = oldLogo.getBoundingClientRect();
      const newLogoRect = newLogo.getBoundingClientRect();
      const oldBigShapeRect = oldBigShape.getBoundingClientRect();
      const newBigShapeRect = newBigShape.getBoundingClientRect();

      current.container.querySelector('.menu-trigger').style.opacity = '0';
      intro.classList.add('to-feature');

      const tl = new TimelineMax({
        onComplete: () => {
          newBigShape.classList.add('can-move');
          resolve();
        },
      });

      const scale = newLogoRect.width / oldLogoRect.width;

      // TweenMax.set(newBigShape, { opacity: 0 });

      tl.to(oldLogo, 1.4, {
        scale,
        y: -((oldLogoRect.top - newLogoRect.top) + ((newLogoRect.height * scale) * 2) - 6),
        ease: 'Power4.easeInOut',
      }, 0);

      TweenMax.killTweensOf(bigShape);
      tl.to(bigShape, 0.1, {
        opacity: 1,
      }, 0);

      tl.to(oldBigShape, 1.3, {
        y: newBigShapeRect.top - oldBigShapeRect.top,
        ease: 'Power4.easeInOut',
      }, 0.1);

      tl.to(oldBigShape, 0.2, {
        opacity: 0,
      }, 1.4);

      tl.from(newBigShape, 0.01, {
        opacity: 0,
      }, 1.4);

      tl.add(() => {
        bigShape.classList.add('grow');
      }, 0);

      tl.to(list, 0.8, {
        opacity: 0,
        ease: 'Power4.easeIn',
      }, 0);

      tl.staggerTo(title, 1, {
        yPercent: 100,
        ease: 'Power4.easeInOut',
      }, 0.05, 0);

      tl.staggerTo(buttons, 1, {
        y: 40,
        opacity: 0,
        ease: 'Power4.easeIn',
      }, 0.05, 0.1);
    });
  },

  enter({
    next,
  }) {
    return new Promise(resolve => {
      const {
        container,
      } = next;
      const newLogo = container.querySelector('.logo.featured');
      const featureContainer = container.querySelector('.feature__container');
      const navigation = container.querySelectorAll('.feature__nav__el');

      const tl = new TimelineMax({
        delay: 1.3,
        onComplete: () => {
          getInstance(next.container, 'feature').animateIn();
          resolve();
        },
      });

      tl.from(newLogo, 1, {
        opacity: 0,
      }, 0);

      tl.from(featureContainer, 1, {
        opacity: 0,
        y: 200,
        ease: 'Power4.easeOut',
        rotationX: '20deg',
      }, 0);

      tl.staggerFrom(navigation, 0.4, {
        opacity: 0,
        y: 30,
        ease: 'Power4.easeOut',
      }, 0.2, 0.8);
    });
  },

};

/**
 *
 * @param {*HTMLElement} data getting container
 */
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
      transform: getComputedStyle(next.$morphs[index]).transform,
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
