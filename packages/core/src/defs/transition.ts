/**
 * @module typings/core
 */

// Definitions
import { SchemaPage, Trigger } from '.';

// Data
export type TransitionData = {
  current: SchemaPage;
  next: SchemaPage;
  trigger: Trigger;
};

export interface TransitionRules {
  custom?(data: TransitionData): boolean;
  route?: string | string[];
  namespace?: string | string[];
}

// Transitions
export interface TransitionPage extends TransitionRules {
  name?: string;
  from?: TransitionRules;
  to?: TransitionRules;
  sync?: boolean;
  priority?: number;
  async?: () => (data?: any) => void;
  beforeAppear?(data: TransitionData): void;
  appear?(data: TransitionData): Promise<void> | void;
  afterAppear?(data: TransitionData): void;
  before?(data: TransitionData): void;
  beforeLeave?(data: TransitionData): void;
  leave?(data: TransitionData): Promise<any> | void;
  afterLeave?(data: TransitionData): void;
  beforeEnter?(data: TransitionData): void;
  enter?(data: TransitionData): Promise<void> | void;
  afterEnter?(data: TransitionData): void;
  after?(data: TransitionData): void;
  leaveCanceled?(data: TransitionData): void;
  enterCanceled?(data: TransitionData): void;
}

export interface TransitionAppear extends TransitionPage {
  appear(data: TransitionData): Promise<void>;
}
