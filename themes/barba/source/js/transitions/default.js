import {
  TweenMax
} from 'gsap/TweenMax';

export default {
  leave(data) {
    return new Promise(resolve => {

      TweenMax.to(data.current.container, 0.4, {
        opacity: 0,
        ease: 'Power4.easeIn',
        onComplete: () => {
          data.current.container.style.display = 'none';
          resolve();
        },
      });
    });
  },
  enter(data) {
    const done = this.async();

    document.body.scrollTop = 0;
    document.documentElement.scrollTop = 0;

    TweenMax.from(data.next.container, 0.7, {
      opacity: 0,
      ease: 'Power4.easeInOut',
      onComplete: () => {
        done();
      },
    });
  },
};
