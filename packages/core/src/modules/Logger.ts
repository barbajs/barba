/**
 * @barba/core/modules/Logger
 * <br><br>
 * ## Logger.
 *
 * - Display informations via the console
 *
 * @module core/modules/Logger
 * @preferred
 */

/***/

/**
 * Log levels, all lower level messages are printed
 *
 * 0. mute
 * 1. error = `console.error()`
 * 2. warning= `console.warn()`
 * 3. info = `console.info()`
 * 4. debug = `console.log()`
 */
export enum LogLevels {
  off = 0,
  error = 1,
  warning = 2,
  info = 3,
  debug = 4,
}

/**
 * Global log level
 */
let _level: number = LogLevels.off;

export class Logger {
  /**
   * Log "prefix".
   */
  private _source: string;

  /**
   * Creates an instance of Logger.
   */
  constructor(source: string) {
    this._source = source;
  }

  /**
   * Get global log level.
   */
  static getLevel(): number {
    return _level;
  }

  /**
   * Set global log level.
   */
  static setLevel(name: keyof typeof LogLevels): number {
    _level = LogLevels[name];

    return _level;
  }

  /**
   * Error log.
   */
  error(...objects: any[]): void {
    this._log(console.error, LogLevels.error, objects);
  }

  /**
   * Warn log.
   */
  warn(...objects: any[]): void {
    this._log(console.warn, LogLevels.warning, objects);
  }

  /**
   * Info log.
   */
  info(...objects: any[]): void {
    this._log(console.info, LogLevels.info, objects);
  }

  /**
   * Debug log.
   */
  debug(...objects: any[]): void {
    this._log(console.log, LogLevels.debug, objects);
  }

  /**
   * Internal logger.
   */
  private _log(fn: Function, level: number, objects: any[]): void {
    if (level <= Logger.getLevel()) {
      // const log = this._source
      //   ? [`[${this._source}] `].concat(objects)
      //   : objects;

      fn.apply(console, [`[${this._source}] `].concat(objects));
    }
  }
}
