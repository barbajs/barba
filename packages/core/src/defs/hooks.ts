/**
 * @module typings/core
 */
import { ITransitionData, ITransitionPage, IViewData } from './index';

export type HooksBarba =
  | 'ready'
  | 'page'
  | 'reset'
  | 'currentAdded'
  | 'currentRemoved'
  | 'nextAdded'
  | 'nextRemoved';

export type HooksOnce = 'beforeOnce' | 'once' | 'afterOnce';

export type HooksPage =
  | 'before'
  | 'beforeLeave'
  | 'leave'
  | 'afterLeave'
  | 'beforeEnter'
  | 'enter'
  | 'afterEnter'
  | 'after';

export type HooksBefore = 'beforeOnce' | 'beforeLeave' | 'beforeEnter';
export type HooksAfter = 'afterOnce' | 'afterLeave' | 'afterEnter';

export type HooksTransition = HooksOnce | HooksPage;
export type HooksView = HooksBefore | HooksAfter;
export type HooksAll = HooksBarba | HooksTransition;

// Allow optional "dynamically created" hooks
export type HooksTransitionMap = { [key in HooksTransition]?: any };

export type HookFunction = (
  data?: ITransitionData | IViewData,
  t?: ITransitionPage
) => Promise<void> | void;

export class HookMethods {
  public before: (fn: HookFunction, ctx?: any) => void;
  public beforeLeave: (fn: HookFunction, ctx?: any) => void;
  public leave: (fn: HookFunction, ctx?: any) => void;
  public afterLeave: (fn: HookFunction, ctx?: any) => void;
  public beforeEnter: (fn: HookFunction, ctx?: any) => void;
  public enter: (fn: HookFunction, ctx?: any) => void;
  public afterEnter: (fn: HookFunction, ctx?: any) => void;
  public after: (fn: HookFunction, ctx?: any) => void;
}
