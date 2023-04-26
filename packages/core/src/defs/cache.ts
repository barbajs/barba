/**
 * @module typings/core
 */

export interface ICacheData {
  action?: CacheAction;
  request?: CacheRequest;
  status?: CacheStatus;
}
export type CacheRequest = Promise<string | void>;
export type CacheAction = 'init' | 'enter' | 'click' | 'prefetch';
export type CacheStatus = 'pending' | 'fulfilled' | 'rejected';
