/**
 * @barba/core/modules/headers
 * <br><br>
 * ## Manage request Headers.
 *
 * @module core/modules/headers
 * @preferred
 */

/***/

// Definitions
import { HeaderList, IHeaderData } from '../defs';

export class Headers {
  private _list: HeaderList = new Map();

  /**
   * Set a new header
   */
  public set(name: string, value: string): IHeaderData {
    this._list.set(name, value);

    return {
      name: value
    };
  }

  /**
   * Get a specific header
   */
  public get(name: string): string {
    return this._list.get(name);
  }

  /**
   * Get all headers
   */
  public all(): HeaderList {
    return this._list;
  }

  /**
   * Check if header exists
   */
  public has(name: string): boolean {
    return this._list.has(name);
  }

  /**
   * Delete a header
   */
  public delete(name: string): boolean {
    return this._list.delete(name);
  }

  /**
   * Clear all headers
   */
  public clear(): void {
    return this._list.clear();
  }
}
