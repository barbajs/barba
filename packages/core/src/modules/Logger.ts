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
   * Get global log level.
   */
  public static getLevel(): number {
    return _level;
  }

  /**
   * Set global log level.
   */
  public static setLevel(name: keyof typeof LogLevels): number {
    _level = LogLevels[name];

    return _level;
  }

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
   * Permanent, unremovable log.
   */
  // public print(...objects: any[]): void {
  //   this._log(console.info, LogLevels.off, objects);
  // }

  /**
   * Error log.
   */
  public error(...objects: any[]): void {
    this._log(console.error, LogLevels.error, objects);
  }

  /**
   * Warn log.
   */
  public warn(...objects: any[]): void {
    this._log(console.warn, LogLevels.warning, objects);
  }

  /**
   * Info log.
   */
  public info(...objects: any[]): void {
    this._log(console.info, LogLevels.info, objects);
  }

  /**
   * Debug log.
   */
  public debug(...objects: any[]): void {
    this._log(console.log, LogLevels.debug, objects);
  }

  /**
   * Internal logger.
   */
  private _log(fn: () => void, level: number, objects: any[]): void {
    if (level <= Logger.getLevel()) {
      fn.apply(console, ([`[${this._source}] `].concat(objects) as unknown) as [

      ]);
    }
  }
}
