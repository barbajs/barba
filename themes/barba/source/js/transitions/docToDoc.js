import { TimelineMax } from 'gsap/TimelineMax';
import { TweenMax } from 'gsap/TweenMax';

const paths = [
  '/docs/getstarted/intro',
  '/docs/userguide/markup',
  '/docs/userguide/syntax',
  '/docs/plugins/css',
  '/docs/plugins/router',
  '/docs/plugins/prefetch',
  '/docs/plugins/transitions',
  '/docs/plugins/head',
];

export default {
  sync: false,
  from: {
    route: 'doc',
  },
  to: {
    route: 'doc',
  },

  leave(data) {
    return new Promise(resolve => {
      const background = data.current.container.querySelector('.docs__page-transition');
      const tl = new TimelineMax();
      const currentPage = data.current.url.path;
      const nextPage = data.next.url.path;

      if (paths.indexOf(currentPage) < paths.indexOf(nextPage)) {
        tl.add(TweenMax.set(background, {
          right: '-100%',
          display: 'block',
        }));
        tl.add(TweenMax.to(background, 0.6, {
          right: 0,
          ease: 'Power3.easeIn',
          onComplete: () => {
            resolve();
          },
        }));
      } else {
        tl.add(TweenMax.set(background, {
          right: '100%',
          display: 'block',
        }));
        tl.add(TweenMax.to(background, 0.6, {
          right: 0,
          ease: 'Power3.easeIn',
          onComplete: () => {
            resolve();
          },
        }));
      }
    });
  },

  enter(data) {
    return new Promise(resolve => {
      resolve();

      const background = data.next.container.querySelector('.docs__page-transition');
      const tl = new TimelineMax();
      const currentPage = data.current.url.path;
      const nextPage = data.next.url.path;

      if (paths.indexOf(currentPage) < paths.indexOf(nextPage)) {
        tl.add(TweenMax.set(background, {
          right: 0,
          display: 'block',
        }));
        tl.add(TweenMax.to(background, 0.6, {
          right: '100%',
          ease: 'Power3.easeOut',
        }));
        tl.add(TweenMax.set(background, {
          display: 'none',
        }));
      } else {
        tl.add(TweenMax.set(background, {
          right: 0,
          display: 'block',
        }));
        tl.add(TweenMax.to(background, 0.6, {
          right: '-100%',
          ease: 'Power3.easeOut',
        }));
        tl.add(TweenMax.set(background, {
          display: 'none',
        }));
      }
    });
  },
};
