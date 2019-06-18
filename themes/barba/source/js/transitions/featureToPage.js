export default {
  from: {
    route: 'feature',
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

