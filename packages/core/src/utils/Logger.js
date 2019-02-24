/**
 * Logger
 *
 * @namespace @barba/core/Logger
 * @type {object}
 */

/**
 * Log levels, all lower level messages are printed
 * @readonly
 * @enum {number}
 * @memberof @barba/core/Logger
 */
const LogLevel = {
  /** 0 = mute */
  off: 0,

  /** 1 = error */
  error: 1,

  /** 2 = warn */
  warning: 2,

  /** 3 = info */
  info: 3,

  /** 4 = log */
  debug: 4,
};

let _level = LogLevel.off;

export class Logger {
  /**
   * Creates an instance of Logger
   * @param {string} source Log namespace
   * @memberof @barba/core/Logger
   */
  constructor(source) {
    this._source = source;
  }

  /**
   * Global log level getter/setter
   *
   * @static
   * @returns {number} Log level
   * @memberof @barba/core/Logger
   */
  static get level() {
    return _level;
  }

  static set level(name) {
    _level = LogLevel[name];

    return _level;
  }

  /**
   * Error log
   *
   * @param {array} objects Infos to log
   * @returns {undefined}
   * @memberof @barba/core/Logger
   */
  error(...objects) {
    this._log(console.error, LogLevel.error, objects);
  }

  warn(...objects) {
    this._log(console.warn, LogLevel.warning, objects);
  }

  info(...objects) {
    this._log(console.info, LogLevel.info, objects);
  }

  debug(...objects) {
    this._log(console.log, LogLevel.debug, objects);
  }

  _log(fn, level, objects) {
    if (level <= Logger.level) {
      const log = this._source
        ? [`[${this._source}] `].concat(objects)
        : objects;

      fn.apply(console, log);
    }
  }
}
