/**
 * @module core/modules/history
 */
import { History, HistoryItem } from '../defs/modules';

const _state: HistoryItem[] = [];

/**
 * ### Keep track of the navigation history.
 *
 * Save URL and the associated page namespace (`url`/`ns`).
 */
const history: History = {
  /**
   * Add a new state.
   */
  add(url: string, ns: string): void {
    _state.push({ url, ns } as HistoryItem);
  },

  /**
   * Remove last state.
   */
  remove(): void {
    _state.pop();
  },

  /**
   * Add new state then update browser history.
   */
  push(url: string, ns: string): void {
    this.add(url, ns);

    window.history && window.history.pushState(null, '', url);
  },

  /**
   * Remove last state then go back.
   */
  cancel(): void {
    this.remove();

    window.history && window.history.back();
  },

  /**
   * Get the current state.
   */
  current(): HistoryItem {
    return _state[_state.length - 1];
  },

  /**
   * Get the previous state.
   */
  previous(): HistoryItem | null {
    return _state.length < 2 ? null : _state[_state.length - 2];
  },
};

export { history };
