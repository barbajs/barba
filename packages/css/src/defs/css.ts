/**
 * @module typings/css
 */

type CssKinds = 'appear' | 'leave' | 'enter';
export interface ICssCallbacks {
  [key: string]: EventListenerOrEventListenerObject;
}
