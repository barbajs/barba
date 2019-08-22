import { Trigger } from '../defs';

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

interface ICoords {
  x: number;
  y: number;
}

/**
 * History item.
 *
 * @property index
 * @property namespace
 * @property scroll
 * @property URL
 */
interface IHistoryItem {
  /** index */
  index: number;
  /** namespace */
  ns: string | undefined;
  /** Scroll position */
  scroll: ICoords;
  /** URL */
  url: string;
}

export class History {
  private _state: IHistoryItem[] = [];

  /**
   * Init with first state.
   */
  public init(url: string, ns: string): void {
    const state: IHistoryItem = {
      index: 0,
      ns,
      scroll: {
        x: window.scrollX,
        y: window.scrollY,
      },
      url,
    };

    this._state.push(state);
    window.history && window.history.replaceState(state, '', state.url);
  }

  /**
   * Add a new state.
   */
  public add(
    url: string,
    ns: string,
    i: number = null,
    push: boolean = true
  ): void {
    const index = i || this.size;
    const state: IHistoryItem = {
      index,
      ns,
      scroll: {
        x: window.scrollX,
        y: window.scrollY,
      },
      url,
    };

    this._state.push(state);

    if (push) {
      window.history && window.history.pushState(state, '', state.url);
    }
  }

  /**
   * Remove last state.
   */
  public remove(): void {
    this._state.pop();
  }

  /**
   * Delete all states.
   */
  public clear(): void {
    this._state = [];
  }

  /**
   * Update current state.
   */
  public update(data: any): void {
    const state: IHistoryItem = {
      ...this.current,
      ...data,
    };

    this.current = state;
    window.history && window.history.replaceState(state, '', state.url);
  }

  /**
   * Remove last state then go back.
   */
  public cancel(): void {
    this.remove();

    window.history && window.history.back();
  }

  /**
   * Get state by index.
   */
  public get(index: number) {
    return this._state[index];
  }

  public getDirection(index: number): Trigger {
    let direction: Trigger = 'popstate';

    if (index < this.current.index) {
      direction = 'back';
    } else if (index > this.current.index) {
      direction = 'forward';
    }

    return direction;
  }

  /**
   * Get/set the current state.
   */
  get current(): IHistoryItem {
    return this._state[this._state.length - 1];
  }

  set current(state: IHistoryItem) {
    this._state[this._state.length - 1] = state;
  }

  /**
   * Get the previous state.
   */
  get previous(): IHistoryItem | null {
    return this._state.length < 2 ? null : this._state[this._state.length - 2];
  }

  /**
   * Get the state size.
   */
  get size(): number {
    return this._state.length;
  }
}

const history = new History();

export { history };
