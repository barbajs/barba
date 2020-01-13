/* global barba, TweenLite */
document.addEventListener('DOMContentLoaded', () => {
  const expandTransition = {
    from: { namespace: 'grid' },
    leave({ current, trigger }) {
      if (typeof trigger === 'string') {
        return;
      }

      const done = this.async();
      const thumbPosition = trigger.getBoundingClientRect();
      const cloneThumb = trigger.cloneNode(true);

      cloneThumb.style.position = 'absolute';
      cloneThumb.style.top = `${thumbPosition.top}px`;

      current.container.appendChild(cloneThumb);

      TweenLite.to(cloneThumb, 0.3, {
        top: 0,
        height: window.innerHeight,
        onComplete: done,
      });
    },
  };

  const shrinkTransition = {
    from: { namespace: 'detail' },
    enter({ current, next }) {
      current.container.style.zIndex = '10';

      const done = this.async();
      const href = current.url.path.split('/').pop();
      const destThumb = next.container.querySelector(`a[href="${href}"]`);
      const destThumbPosition = destThumb.getBoundingClientRect();
      const fullImage = current.container.querySelector('.full');

      TweenLite.to(current.container.querySelector('.back'), 0.2, {
        opacity: 0,
      });
      TweenLite.to(fullImage, 0.3, {
        top: destThumbPosition.top,
        height: destThumb.clientHeight,
        onComplete: done,
      });
    },
  };

  barba.init({
    transitions: [expandTransition, shrinkTransition],
  });
});
