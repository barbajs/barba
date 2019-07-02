import {
  TweenMax,
  TimelineMax
} from 'gsap/TweenMax';

const NAMESPACES_ORDER = [
  'dependency-free',
  'small-size',
  'core',
  'router',
  'prefetch',
  'change-log',
];

// Return true for forward, false for backwards
function isForward(fromNamespace, toNamespace) {
  const oldIndex = NAMESPACES_ORDER.indexOf(fromNamespace);
  const newIndex = NAMESPACES_ORDER.indexOf(toNamespace);

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

  sync: true,

  leave(data) {
    return new Promise(resolve => {
      const goingForward = isForward(data.current.namespace, data.next.namespace);

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
        x: goingForward ? -window.innerWidth : window.innerWidth,
        rotationY: goingForward ? '45deg' : '-45deg',
        ease: 'Power4.easeInOut',
      }, 0);

      box && tl.to(box, 1.8, {
        x: goingForward ? (-window.innerWidth * 0.3) : (window.innerWidth * 0.3),
        ease: 'Power4.easeInOut',
      }, 0);

      tl.to(logo, 1.5, {
        opacity: 0,
        ease: 'Power4.easeInOut'
      }, 0);

    });
  },

  enter(data) {
    return new Promise(resolve => {
      const goingForward = isForward(data.current.namespace, data.next.namespace);

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
        x: goingForward ? window.innerWidth : -window.innerWidth,
        rotationY: goingForward ? '-45deg' : '45deg',
        ease: 'Power4.easeInOut',
      }, 0);

      box && tl.from(box, 2, {
        x: goingForward ? window.innerWidth * 0.5 : -window.innerWidth * 0.5,
        ease: 'Power4.easeInOut',
      }, 0);

      tl.from(logo, 1.5, {
        opacity: 0,
        ease: 'Power4.easeInOut'
      }, 0);

    });
  },
};
