export default {
  events: {},

  on(e, f) {
    this.events[e] = this.events[e] || [];
    this.events[e].push(f);
  },

  once(e, f) {
    const newf = (...args) => {
      this.off(e, newf);
      f.apply(this, args);
    };

    this.on(e, newf);
  },

  off(e, f) {
    if (e in this.events === false) {
      return;
    }

    this.events[e].splice(this.events[e].indexOf(f), 1);
  },

  trigger(e, ...args) {
    if (e in this.events === false) {
      return;
    }

    this.events[e].forEach(event => {
      event.apply(this, args);
    });
  },
};
