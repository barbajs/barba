import { TweenMax } from 'gsap/TweenMax';

export default {
  leave(data) {
    console.log(data);

    return new Promise(resolve => {
      TweenMax.to(data.current.container, 0.2, {
        opacity: 0,
        onComplete: () => {
          resolve();
        },
      });
    });
  },
  enter(data) {
    console.log(data);
    const done = this.async();

    document.body.scrollTop = 0;
    document.documentElement.scrollTop = 0;

    TweenMax.from(data.next.container, 0.4, {
      opacity: 0,
      onComplete: () => {
        done();
      },
    });
  },
};

