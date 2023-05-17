/**
 * @module typings/core
 */

import { IResponse } from './index';

export interface ICacheData {
  action?: CacheAction;
  request?: CacheRequest;
  status?: CacheStatus;
}

export type CacheRequest = Promise<IResponse | void>;
export type CacheAction = 'init' | 'enter' | 'click' | 'prefetch';
export type CacheStatus = 'pending' | 'fulfilled' | 'rejected';
