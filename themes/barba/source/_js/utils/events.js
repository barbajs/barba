import EventEmitter from 'eventemitter3';

// https://nodejs.org/api/events.html
class Events extends EventEmitter {
  // Log emitted events (if not blacklisted)
  emit(...args) {
    const [name, ...params] = args;

    if (this.logBlacklist && this.logBlacklist.indexOf(name) === -1) {
      console.info(name, params);
    }

    super.emit(...args);
  }
}

const instance = new Events();

instance.logBlacklist = [];

// Fire at window resize -> [width, height, ratio]
instance.RESIZE = 'resize';
instance.logBlacklist.push(instance.RESIZE);

// Fire at virtual scroll -> [{x, y, deltaX, deltaY, originalEvent}]
// instance.SCROLL = 'scroll';
// instance.logBlacklist.push(instance.SCROLL);

// Fire at each rAF -> [delta, now]
// instance.RAF = 'raf';
// instance.logBlacklist.push(instance.RAF);

export default instance;
