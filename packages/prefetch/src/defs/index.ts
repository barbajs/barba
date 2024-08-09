/**
 * @module typings/prefetch
 */

import { IBarbaPluginOptions } from '@barba/core/src/defs';

export interface IPrefetchOptions extends IBarbaPluginOptions {
  root?: HTMLElement | HTMLDocument;
  timeout?: number;
  limit?: number;
}
