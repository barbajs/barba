/**
 * @module typings/core
 */

// Definitions
import { ISchemaPage, Trigger } from '.';

export interface IViewData {
  current: ISchemaPage;
  next: ISchemaPage;
  trigger: Trigger;
}

export interface IView {
  namespace: string;
  name?: string;
  beforeOnce?(data: IViewData): void;
  afterOnce?(data: IViewData): void;
  beforeLeave?(data: IViewData): void;
  afterLeave?(data: IViewData): void;
  beforeEnter?(data: IViewData): void;
  afterEnter?(data: IViewData): void;
}
