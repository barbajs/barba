import {
  getInstance,
} from '../app';

import {
  TimelineMax,
} from 'gsap/TweenMax';

export default {
  to: {
    namespace: 'feature',
  },
  once: ({
    next,
  }) => {
    const {
      container,
    } = next;
    const nextFeatureSlug = container.querySelector('.feature').dataset.featureSlug;
    const featureContainer = container.querySelector('.feature__container');
    const featureBox = container.querySelector('.feature__box');
    const featureInstance = getInstance(container, 'feature');

    const tl = new TimelineMax();

    featureBox && tl.from(featureBox, 1.5, {
      y: 100,
      opacity: 0,
      ease: 'Power4.easeOut',
    }, 0.5);

    tl
      .from(featureContainer, 1, {
        y: 100,
        opacity: 0,
        ease: 'Power4.easeOut',
        onComplete: () => {
          if (nextFeatureSlug !== 'about') {
            featureInstance.animateIn();
          }
        },
      }, 0.5);
  },
};
