/**
 * @module typings/core
 */

export type HistoryItem = {
  ns: string | undefined;
  url: string;
};

export interface History {
  add(url: string, ns?: string): void;
  remove(): void;
  push(url: string, ns?: string): void;
  cancel(): void;
  current(): HistoryItem;
  previous(): HistoryItem | null;
}
