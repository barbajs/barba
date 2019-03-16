/**
 * @module typings/core
 */

// Definitions
import { ISchemaPage, Trigger } from '.';

// Data
export interface ITransitionData {
  current: ISchemaPage;
  next: ISchemaPage;
  trigger: Trigger;
}

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
  beforeAppear?(data: ITransitionData): void;
  appear?(data: ITransitionData): Promise<void> | void;
  afterAppear?(data: ITransitionData): void;
  before?(data: ITransitionData): void;
  beforeLeave?(data: ITransitionData): void;
  leave?(data: ITransitionData): Promise<any> | void;
  afterLeave?(data: ITransitionData): void;
  beforeEnter?(data: ITransitionData): void;
  enter?(data: ITransitionData): Promise<void> | void;
  afterEnter?(data: ITransitionData): void;
  after?(data: ITransitionData): void;
  leaveCanceled?(data: ITransitionData): void;
  enterCanceled?(data: ITransitionData): void;
}

export interface ITransitionAppear extends ITransitionPage {
  appear(data: ITransitionData): Promise<void>;
}
