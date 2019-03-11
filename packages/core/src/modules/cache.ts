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
import { Ignore } from './ignore';
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
  set(url: string, req: Request) {
    if (!this.checkUrl(url)) {
      this._state.set(url, req);
    }

    return req;
  }

  /**
   * Get value from cache
   */
  get(url: string) {
    return this._state.get(url);
  }

  /**
   * Check if value exists into cache
   */
  has(url: string) {
    return this._state.has(url);
  }

  /**
   * Delete value from cache
   */
  delete(url: string) {
    return this._state.delete(url);
  }
}
