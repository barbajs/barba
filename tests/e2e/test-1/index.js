
var Home = Barba.BaseView.extend({
  namespace: 'home',
  onEnter: function() {
  },
  onEnterCompleted: function() {
    document.body.classList.add('home');
  },
  onLeave: function() {
    document.body.classList.remove('home');
  },
  onLeaveCompleted: function() {
  }
});

Home.init();

var About = Barba.BaseView.extend({
  namespace: 'about',
  onEnter: function() {
  },
  onEnterCompleted: function() {
    document.body.classList.add('about');
  },
  onLeave: function() {
    document.body.classList.remove('about');
  },
  onLeaveCompleted: function() {
  }
});

About.init();

Barba.Pjax.start();
