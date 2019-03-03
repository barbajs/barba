/**
 * @module typings/core
 */
import { HookViewData } from '.';

export type View = {
  namespace: string;
  beforeAppear?(data: HookViewData): void;
  afterAppear?(data: HookViewData): void;
  beforeLeave?(data: HookViewData): void;
  afterLeave?(data: HookViewData): void;
  beforeEnter?(data: HookViewData): void;
  afterEnter?(data: HookViewData): void;
};
