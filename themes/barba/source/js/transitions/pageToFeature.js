export default {
  sync: true,
  from: {
    route: 'page',
  },
  to: {
    route: 'feature',
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

