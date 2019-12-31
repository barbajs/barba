import {
  getInstance,
} from '../app';

import {
  TimelineMax,
} from 'gsap/TweenMax';

import NAMESPACES_ORDER from './featuresOrder';



// Return true for forward, false for backwards

/**
 * Get namespace from pages
 *
 * @param {int} currentFeatureOrder page namepspace
 * @param {int} nextFeatureOrder page namepspace
 * @returns {string} Page namespace
 */
function isForward(currentFeatureOrder, nextFeatureOrder) {
  const oldIndex = Number(currentFeatureOrder);
  const newIndex = Number(nextFeatureOrder);

  // From last to first
  if (oldIndex === NAMESPACES_ORDER.length - 1 && newIndex === 0) {
    return true;
  }

  // From first to last
  if (oldIndex === 0 && newIndex === NAMESPACES_ORDER.length - 1) {
    return false;
  }

  return oldIndex < newIndex ? true : false;
}

export default {
  from: {
    route: 'feature',
  },
  to: {
    route: 'feature',
  },

  leave({
    current,
    next,
  }) {
    return new Promise(async resolve => {
      document.body.scrollTop = 0;
      document.documentElement.scrollTop = 0;
      const {
        container,
      } = current;
      const currentFeatureSlug = container.querySelector('.feature').dataset.featureSlug;
      const currentFeatureOrder = container.querySelector('.feature').dataset.featureOrder;
      const nextFeatureOrder = next.container.querySelector('.feature').dataset.featureOrder;
      const goingForward = isForward(currentFeatureOrder, nextFeatureOrder);
      const featureContainer = container.querySelector('.feature__container');
      const featureBox = container.querySelector('.feature__box');
      const featureInstance = getInstance(container, 'feature');

      const logo = container.querySelector('.logo');
      const logoShapes = container.querySelector('.logo.only-big');

      const nextLogo = next.container.querySelector('.logo');
      const nextLogoShapes = next.container.querySelector('.logo.only-big');

      if (currentFeatureSlug !== 'about') {
        await featureInstance.animateOut();
      }
      container.querySelector('.menu-trigger').style.opacity = '0';

      resolve();
      const tl = new TimelineMax();

      featureBox && tl.to(featureBox, 1, {
        x: goingForward ? -window.innerWidth * 0.3 : window.innerWidth * 0.3,
        ease: 'Power4.easeInOut',
      }, 0);

      tl
        .to(featureContainer, 1.5, {
          x: goingForward ? -window.innerWidth : window.innerWidth,
          rotationY: goingForward ? '45deg' : '-45deg',
          ease: 'Power4.easeInOut',
        }, 0)
        .to(logoShapes, 1, {
          opacity: 0,
          ease: 'Power4.easeInOut',
        }, 0)
        .to(logo, 0.5, {
          opacity: 0,
          ease: 'Power4.easeInOut',
        }, 0)
        .from(nextLogoShapes, 1, {
          opacity: 0,
          ease: 'Power4.easeOut',
        }, 0)
        .from(nextLogo, 0.5, {
          opacity: 0,
          ease: 'Power4.easeOut',
        }, 0);
    });
  },

  enter({
    current,
    next,
  }) {
    return new Promise(resolve => {
      const {
        container,
      } = next;
      const nextFeatureSlug = container.querySelector('.feature').dataset.featureSlug;
      const currentFeatureOrder = current.container.querySelector('.feature').dataset.featureOrder;
      const nextFeatureOrder = container.querySelector('.feature').dataset.featureOrder;
      const goingForward = isForward(currentFeatureOrder, nextFeatureOrder);
      const featureContainer = container.querySelector('.feature__container');
      const featureBox = container.querySelector('.feature__box');
      const featureInstance = getInstance(container, 'feature');

      const tl = new TimelineMax({
        onComplete: () => {
          resolve();
          if (nextFeatureSlug !== 'about') {
            featureInstance.animateIn();
          }
        },
      });

      featureBox && tl.from(featureBox, 2, {
        x: goingForward ? window.innerWidth * 0.5 : -window.innerWidth * 0.5,
        ease: 'Power4.easeOut',
      }, 0.5);

      tl
        .from(featureContainer, 1.8, {
          x: goingForward ? window.innerWidth : -window.innerWidth,
          rotationY: goingForward ? '-45deg' : '45deg',
          ease: 'Power4.easeOut',
        }, 0.5);
    });
  },
};
