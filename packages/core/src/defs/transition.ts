/**
 * @module typings/core
 */

// Definitions
import { ISchemaPage, Trigger } from './index';
import { LinkEvent } from '../defs';

// Data
export interface ITransitionData {
  current: ISchemaPage;
  next: ISchemaPage;
  trigger: Trigger;
  event?: LinkEvent | PopStateEvent;
}

// Filter
export interface ITransitionFilters {
  once?: boolean;
  self?: boolean;
}

// Rules
export interface ITransitionRules {
  namespace?: string | string[];
  route?: string | string[];
  custom?(data: ITransitionData): boolean;
}

// Transitions
export interface ITransitionPage extends ITransitionRules {
  name?: string;
  from?: ITransitionRules;
  to?: ITransitionRules;
  sync?: boolean;
  priority?: number;
  async?: () => (data?: any) => void;
  beforeOnce?(data: ITransitionData): void;
  once?(data: ITransitionData): Promise<void> | void;
  afterOnce?(data: ITransitionData): void;
  before?(data: ITransitionData): void;
  beforeLeave?(data: ITransitionData): void;
  leave?(data: ITransitionData): Promise<any> | void;
  afterLeave?(data: ITransitionData): void;
  beforeEnter?(data: ITransitionData): void;
  enter?(data: ITransitionData): Promise<void> | void;
  afterEnter?(data: ITransitionData): void;
  after?(data: ITransitionData): void;
}

export interface ITransitionOnce extends ITransitionPage {
  once?(data: ITransitionData): Promise<void>;
}
