export default {
  sync: true,
  from: {
    route: 'home',
  },
  to: {
    route: 'page',
  },

  leave() {
    return new Promise(resolve => {
      resolve();
    });
  },

  enter() {
    return new Promise(resolve => {
      resolve();
    });
  }
};

