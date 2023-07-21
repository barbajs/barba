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
import { CacheAction, CacheRequest, CacheStatus, CacheTarget, ICacheData, IgnoreOption } from '../defs';
// Modules
import { Ignore } from './Ignore';

export class Cache extends Ignore {
  private _state: Map<string, ICacheData> = new Map();

  constructor(ignore: IgnoreOption) {
    super(ignore);
  }

  /**
   * Set value to cache
   */
  public set(
    href: string,
    request: CacheRequest,
    action: CacheAction,
    status: CacheStatus,
    target?: CacheTarget,
  ): ICacheData {
    this._state.set(href, {
      action,
      request,
      status,
      target: target ?? href,
    });

    return {
      action,
      request,
      status,
      target,
    };
  }

  /**
   * Get data from cache
   */
  public get(href: string): ICacheData {
    return this._state.get(href);
  }

  /**
   * Get request from cache
   */
  public getRequest(href: string): CacheRequest {
    return this._state.get(href).request;
  }

  /**
   * Get action from cache
   */
  public getAction(href: string): CacheAction {
    return this._state.get(href).action;
  }

  /**
   * Get status from cache
   */
  public getStatus(href: string): CacheStatus {
    return this._state.get(href).status;
  }

  /**
   * Get target from cache
   */
  public getTarget(href: string): CacheTarget {
    return this._state.get(href).target;
  }

  /**
   * Check if value exists into cache
   */
  public has(href: string): boolean {
    /* istanbul ignore else */
    if (this.checkHref(href)) {
      return false;
    }
    return this._state.has(href);
  }

  /**
   * Delete value from cache
   */
  public delete(href: string): boolean {
    return this._state.delete(href);
  }

  /**
   * Update cache value
   */
  public update(href: string, data: ICacheData): ICacheData {
    const state = {
      ...this._state.get(href),
      ...data,
    };
    this._state.set(href, state);

    return state;
  }
}
