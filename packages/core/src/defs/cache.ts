/**
 * @module typings/core
 */

export interface ICacheData {
  action?: CacheAction;
  request?: CacheRequest;
}
export type CacheRequest = Promise<string | void>;
export type CacheAction = 'init' | 'enter' | 'click' | 'prefetch';
