/**
 * @module typings/core
 */
import {
  TransitionData,
  TransitionBase,
  HooksTransition,
  HooksMap,
  Wrapper,
} from '../shared';

type AppearOptions = {
  data: TransitionData;
  transition: TransitionBase;
};

type PageOptions = {
  data: TransitionData;
  transition: TransitionBase;
  page: Promise<string | void>;
  wrapper: Wrapper;
};

export interface Transitions {
  running: boolean;
  doAppear(options: AppearOptions): void;
  doPage(options: PageOptions): void;
  appear(data: TransitionData, t: TransitionBase): Promise<void>;
  leave(data: TransitionData, t: TransitionBase): Promise<any>;
  enter(
    data: TransitionData,
    t: TransitionBase,
    leaveResult?: any
  ): Promise<void>;
  _doSyncHook(hook: HooksTransition, data: TransitionData, t: HooksMap): void;
  _addNext(data: TransitionData, wrapper: Wrapper): void;
  _removeCurrent(data: TransitionData): void;
}
