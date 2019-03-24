/**
 * @module typings/core
 */
import { ISchemaPage, Trigger } from '.';

export type HooksBarba =
  | 'page'
  | 'reset'
  | 'currentAdded'
  | 'currentRemoved'
  | 'nextAdded'
  | 'nextRemoved';

export type HooksAppear =
  | 'beforeAppear'
  | 'appear'
  | 'afterAppear'
  | 'appearCanceled';

export type HooksPage =
  | 'before'
  | 'beforeLeave'
  | 'leave'
  | 'afterLeave'
  | 'leaveCanceled'
  | 'beforeEnter'
  | 'enter'
  | 'afterEnter'
  | 'enterCanceled'
  | 'after';

export type HooksBefore = 'beforeAppear' | 'beforeLeave' | 'beforeEnter';
export type HooksAfter = 'afterAppear' | 'afterLeave' | 'afterEnter';

export type HooksTransition = HooksAppear | HooksPage;
export type HooksView = HooksBefore | HooksAfter;
export type HooksAll = HooksBarba | HooksTransition;

// Allow optional "dynamically created" hooks
export type HooksTransitionMap = { [key in HooksTransition]?: any };

export interface IHookViewData {
  current: ISchemaPage;
  next: ISchemaPage;
  trigger: Trigger;
}
