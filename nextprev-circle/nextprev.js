/* global barba, TweenLite, TimelineMax */
document.addEventListener('DOMContentLoaded', () => {
  if (!('clipPath' in document.body.style)) {
    // eslint-disable-next-line no-alert
    alert(
      'Sorry, this demo is available just with "clip-path" property. Try another browser…'
    );
  }

  let isAnimating = false;
  // eslint-disable-next-line no-extra-parens
  const getXCoord = el => (el.classList.contains('next') ? '97' : '3');
  const tweenMaskTo = (el, radius) => {
    if (isAnimating || !el.classList.contains('nav')) {
      return;
    }

    TweenLite.to(el, 0.3, {
      webkitClipPath: `circle(${radius}px at ${getXCoord(el)}% 50%)`,
    });
  };

  document.addEventListener('mouseover', e => {
    tweenMaskTo(e.target, 100);
  });

  document.addEventListener('mouseout', e => {
    tweenMaskTo(e.target, 40);
  });

  const coverMaskTransition = {
    leave({ current, trigger }) {
      isAnimating = true;

      const done = this.async();
      const { container } = current;
      const { innerWidth } = window;
      const $text = container.querySelector('.text');
      const tl = new TimelineMax({
        onComplete: done,
      });

      TweenLite.set(trigger, { zIndex: 100 });
      tl.add('start').to($text, 0.3, { opacity: 0 }, 'start');
      tl.to(
        trigger,
        1,
        {
          webkitClipPath: `circle(${innerWidth}px at ${getXCoord(
            trigger
          )}% 50%)`,
        },
        'start'
      );
    },
    enter({ next }) {
      const done = this.async();
      const { container } = next;
      const $text = container.querySelector('.text');
      const $newLinkPrev = container.querySelector('.nav.prev');
      const $newLinkNext = container.querySelector('.nav.next');
      const tl = new TimelineMax({
        onComplete() {
          isAnimating = false;
          done();
        },
      });

      TweenLite.set(container, {
        position: 'fixed',
        left: 0,
        top: 0,
        right: 0,
      });

      tl.from($text, 0.3, { opacity: 0 })
        .add('nextLinks')
        .to(
          $newLinkPrev,
          0.2,
          { webkitClipPath: 'circle(40px at 3% 50%)' },
          'nextLinks'
        )
        .to(
          $newLinkNext,
          0.2,
          { webkitClipPath: 'circle(40px at 97% 50%)' },
          'nextLinks'
        );
    },
  };

  barba.init({
    transitions: [coverMaskTransition],
  });
});
