/**
 * @barba/core/modules/history
 * <br><br>
 * ## History manager.
 *
 * - Keep track of the navigation history
 *
 * @module core/modules/history
 * @preferred
 */

/***/

/**
 * History item.
 *
 * @property namespace
 * @property URL
 */
export type HistoryItem = {
  /** namespace */
  ns: string | undefined;
  /** URL */
  url: string;
};

export class History {
  private _state: HistoryItem[] = [];

  /**
   * Add a new state.
   */
  add(url: string, ns: string): void {
    this._state.push({ url, ns } as HistoryItem);
  }

  /**
   * Remove last state.
   */
  remove(): void {
    this._state.pop();
  }

  /**
   * Add new state then update browser history.
   */
  push(url: string, ns: string): void {
    this.add(url, ns);

    window.history && window.history.pushState(null, '', url);
  }

  /**
   * Remove last state then go back.
   */
  cancel(): void {
    this.remove();

    window.history && window.history.back();
  }

  /**
   * Get the current state.
   */
  get current(): HistoryItem {
    return this._state[this._state.length - 1];
  }

  /**
   * Get the previous state.
   */
  get previous(): HistoryItem | null {
    return this._state.length < 2 ? null : this._state[this._state.length - 2];
  }
}
