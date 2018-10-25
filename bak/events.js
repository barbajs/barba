export default {
  events: {},

  on(e, f) {
    this.events[e] = this.events[e] || [];
    this.events[e].push(f);
  },

  once(e, f) {
    // let self = this;

    // function newf() {
    //   self.off(e, newf);
    //   f.apply(this, arguments);
    // };

    const newf = () => {
      this.off(e, newf);
      f.apply(this, arguments);
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
