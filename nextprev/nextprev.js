/* global barba, TweenLite */
document.addEventListener('DOMContentLoaded', () => {
  const prevLink = document.querySelector('a.prev');
  const nextLink = document.querySelector('a.next');

  const move = (container, direction, xPercent) =>
    new Promise(resolve => {
      TweenLite[direction](container, 0.6, {
        xPercent,
        clearProps: 'all',
        onComplete: resolve,
      });
    });

  const movePageTransition = {
    sync: true,
    before: () =>
      new Promise(resolve => {
        TweenLite.to(window, 0.4, {
          scrollTo: 0,
          onUpdate() {
            window.pageYOffset === 0 && resolve();
          },
          onComplete: resolve,
        });
      }),
    leave: ({ current, trigger }) =>
      move(
        current.container,
        'to',
        trigger.classList.contains('next') ? -100 : 100
      ),
    enter({ next, trigger }) {
      TweenLite.set(next.container, {
        position: 'fixed',
        left: 0,
        top: 0,
        right: 0,
      });

      return move(
        next.container,
        'from',
        trigger.classList.contains('next') ? 100 : -100
      );
    },
    after({ next }) {
      prevLink.href = next.container.dataset.prev;
      nextLink.href = next.container.dataset.next;
    },
  };

  barba.init({
    transitions: [movePageTransition],
  });
});
