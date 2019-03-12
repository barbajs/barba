/**
 * @barba/core/modules/cache
 * <br><br>
 * ## Cache for storing URL / HTML.
 *
 * @module core/modules/cache
 * @preferred
 */

/***/

// Definitions
import { IgnoreOption } from '../defs';
// Modules
import { Ignore } from './Ignore';
// Types
type Request = Promise<string | void>;

export class Cache extends Ignore {
  private _state: Map<string, Request> = new Map();

  constructor(ignore: IgnoreOption) {
    super(ignore);
  }

  /**
   * Set value to cache
   */
  public set(url: string, req: Request) {
    if (!this.checkUrl(url)) {
      this._state.set(url, req);
    }

    return req;
  }

  /**
   * Get value from cache
   */
  public get(url: string) {
    return this._state.get(url);
  }

  /**
   * Check if value exists into cache
   */
  public has(url: string) {
    return this._state.has(url);
  }

  /**
   * Delete value from cache
   */
  public delete(url: string) {
    return this._state.delete(url);
  }
}
