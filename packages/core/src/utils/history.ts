import { HistoryAction, LinkEvent, Trigger } from '../defs';
// Schemas
import { schemaAttribute } from '../schemas/attribute';

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
    trigger: Trigger,
    e?: LinkEvent | PopStateEvent
  ): void {
    // If no state, it will be updated later.
    const state = e ? (e as PopStateEvent).state : null;
    const ns = state ? state.ns : 'tmp';
    const index = state ? state.index : this.size;

    // By default (popstate), we will add to barba.history but
    // we do not push to browser history.
    let action: HistoryAction = 'none';

    // No popstate means modifying the history.
    if (trigger !== 'popstate') {
      action = this._getAction(trigger);
    }

    const data: IHistoryItem = {
      index,
      ns,
      scroll: {
        x: window.scrollX,
        y: window.scrollY,
      },
      url,
    };

    this._state.push(data);

    switch (action) {
      case 'push':
        window.history && window.history.pushState(data, '', data.url);
        break;
      case 'replace':
        window.history && window.history.replaceState(data, '', data.url);
        break;
      default:
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

  /**
   * Get the hostiry action: push vs replace
   */
  private _getAction(trigger: Trigger): HistoryAction {
    let action: HistoryAction = 'push';

    // Manage `data-barba-history` attribute
    // to get the right action (push vs replace).
    const el = trigger as HTMLAnchorElement;
    const attr = `${schemaAttribute.prefix}-${schemaAttribute.history}`;

    if (el.hasAttribute && el.hasAttribute(attr)) {
      action = el.getAttribute(attr) as HistoryAction;
    }

    return action;
  }
}

const history = new History();

export { history };
