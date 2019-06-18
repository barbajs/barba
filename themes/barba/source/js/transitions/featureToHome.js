export default {
  sync: true,
  from: {
    route: 'feature',
  },
  to: {
    route: 'home',
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

