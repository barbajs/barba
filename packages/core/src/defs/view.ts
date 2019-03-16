/**
 * @module typings/core
 */

// Definitions
import { IHookViewData } from '.';

export interface IView {
  namespace: string;
  name?: string;
  beforeAppear?(data: IHookViewData): void;
  afterAppear?(data: IHookViewData): void;
  beforeLeave?(data: IHookViewData): void;
  afterLeave?(data: IHookViewData): void;
  beforeEnter?(data: IHookViewData): void;
  afterEnter?(data: IHookViewData): void;
}
