/**
 * @module typings/css
 */
import { IBarbaPluginOptions } from '@barba/core/src/defs';

type CssKinds = 'once' | 'leave' | 'enter';

export interface ICssCallbacks {
  [key: string]: EventListenerOrEventListenerObject;
}

export interface ICssOptions extends IBarbaPluginOptions {}
