document.addEventListener("DOMContentLoaded", function() {
  if (!('webkitClipPath' in document.body.style)) {
    alert('Sorry, this demo is available just with webkitClipPath. Try with Chrome/Safari.');
  }

  Barba.Pjax.init();
  Barba.Prefetch.init();

  var isAnimating = false;

  document.addEventListener('mouseover', function(e) {
    tweenMaskTo(e.target, 100);
  });

  document.addEventListener('mouseout', function(e) {
    tweenMaskTo(e.target, 40);
  });

  var tweenMaskTo = function(el, radius) {
    if (isAnimating || !el.classList.contains('nav'))
      return;

    var xCoord = el.classList.contains('next') ? '97' : '3';
    TweenLite.to(el, 0.3, { webkitClipPath: 'circle(' + radius + 'px at ' + xCoord + '% 50%)' });
  };

  var CoverMaskTransition = Barba.BaseTransition.extend({
    start: function() {
      isAnimating = true;

      Promise
        .all([this.newContainerLoading, this.scrollTop()])
        .then(this.display.bind(this));
    },

    scrollTop: function() {
      var deferred = Barba.Utils.deferred();
      var obj = { y: window.pageYOffset };

      TweenLite.to(obj, 0.4, {
        y: 0,
        onUpdate: function() {
          if (obj.y === 0) {
            deferred.resolve();
          }

          window.scroll(0, obj.y);
        },
        onComplete: function() {
          deferred.resolve();
        }
      });

      return deferred.promise;
    },

    getNewPageFile: function() {
      return Barba.HistoryManager.currentStatus().url.split('/').pop();
    },

    getLinkByHref: function(href) {
      return document.querySelector('a[href="' + href + '"]');
    },

    display: function() {
      var _this = this;
      var tl = new TimelineMax({
        onComplete: function() {
          _this.newContainer.style.position = 'static';
          _this.done();
          isAnimating = false;
        }
      });

      var wWidth = window.innerWidth;
      var oldText = this.oldContainer.querySelector('.text');
      var newText = this.newContainer.querySelector('.text');
      var newLinkPrev = this.newContainer.querySelector('.nav.prev');
      var newLinkNext = this.newContainer.querySelector('.nav.next');

      var linkElement = this.getLinkByHref(this.getNewPageFile());
      var xCoord = linkElement.classList.contains('next') ? '97' : '3';

      TweenLite.set(linkElement, { zIndex: 100 });

      TweenLite.set(this.newContainer, {
        position: 'fixed',
        visibility: 'visible',
        top: 0,
        right: 0,
        bottom: 0,
        left: 0,
        opacity: 0,
        zIndex: 200
      });

      TweenLite.set(newText, { opacity: 0 });
      TweenLite.set(newLinkPrev, { webkitClipPath: 'circle(0px at 3% 50%)' });
      TweenLite.set(newLinkNext, { webkitClipPath: 'circle(0px at 97% 50%)' });

      tl.add('start');
      tl.to(oldText, 0.3, { opacity: 0 }, 'start');
      tl.to(linkElement, 1, { webkitClipPath: 'circle(' + wWidth + 'px at ' + xCoord + '% 50%)' }, 'start');
      tl.to(this.newContainer, 0.3, { opacity: 1 });
      tl.to(newText, 0.3, { opacity: 1 });

      tl.add('nextLinks');
      tl.to(newLinkPrev, 0.2, { webkitClipPath: 'circle(40px at 3% 50%)' }, 'nextLinks');
      tl.to(newLinkNext, 0.2, { webkitClipPath: 'circle(40px at 97% 50%)' }, 'nextLinks');
    }
  });

  Barba.Pjax.getTransition = function() {
    return CoverMaskTransition;
  };
});
