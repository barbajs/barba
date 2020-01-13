import events from 'utils/events';

class Raf {
  constructor() {
    // !TODO: calculate avarage FPS
    this.fps = undefined;
    this.time = window.performance.now();

    this.start = this.start.bind(this);
    this.pause = this.pause.bind(this);
    this.onTick = this.onTick.bind(this);
    this.start();
    this.bind();

    window.requestAnimationFrame(this.onTick);
  }

  bind() {
    events.on(events.VISIBILITY_HIDDEN, this.pause);
    events.on(events.VISIBILITY_VISIBLE, this.start);
  }

  start() {
    this.startTime = window.performance.now();
    this.oldTime = this.startTime;
    this.isPaused = false;
  }

  pause() {
    this.isPaused = true;
  }

  onTick(now) {
    this.time = now;

    if (!this.isPaused) {
      this.delta = (now - this.oldTime) / 1000;
      this.oldTime = now;

      events.emit(events.RAF, this.delta, now);
    }

    window.requestAnimationFrame(this.onTick);
  }
}

export default new Raf();
