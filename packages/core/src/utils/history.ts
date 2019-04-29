/**
 * @barba/core/utils/history
 * <br><br>
 * ## History manager.
 *
 * - Keep track of the navigation history
 *
 * @module core/utils/history
 * @preferred
 */

/***/

/**
 * History item.
 *
 * @property namespace
 * @property URL
 */
interface IHistoryItem {
  /** namespace */
  ns: string | undefined;
  /** URL */
  url: string;
}

export class History {
  private _state: IHistoryItem[] = [];

  /**
   * Add a new state.
   */
  public add(url: string, ns: string): void {
    this._state.push({ url, ns } as IHistoryItem);
  }

  /**
   * Remove last state.
   */
  public remove(): void {
    this._state.pop();
  }

  /**
   * Add new state then update browser history.
   */
  public push(url: string, ns: string): void {
    this.add(url, ns);

    window.history && window.history.pushState(null, '', url);
  }

  /**
   * Remove last state then go back.
   */
  public cancel(): void {
    this.remove();

    window.history && window.history.back();
  }

  /**
   * Get the current state.
   */
  get current(): IHistoryItem {
    return this._state[this._state.length - 1];
  }

  /**
   * Get the previous state.
   */
  get previous(): IHistoryItem | null {
    return this._state.length < 2 ? null : this._state[this._state.length - 2];
  }
}

const history = new History();

export { history };
