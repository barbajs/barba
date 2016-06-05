//Promise polyfill https://github.com/taylorhakes/promise-polyfill

if (typeof Promise !== 'function') {
 window.Promise = require('promise-polyfill');
}

var Barba = {
  version: '0.0.9',
  Dispatcher: require('./Dispatcher/Dispatcher'),
  HistoryManager: require('./Pjax/HistoryManager'),
  BaseTransition: require('./Transition/BaseTransition'),
  BaseView: require('./View/BaseView'),
  Pjax: require('./Pjax/Pjax'),
  Prefetch: require('./Pjax/Prefetch'),
  Utils: require('./Utils/Utils')
};

module.exports = Barba;
