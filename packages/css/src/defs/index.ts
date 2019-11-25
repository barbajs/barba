/**
 * @module typings/css
 */

type CssKinds = 'once' | 'leave' | 'enter';
export interface ICssCallbacks {
  [key: string]: EventListenerOrEventListenerObject;
}
