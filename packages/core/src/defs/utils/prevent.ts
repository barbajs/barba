/**
 * @module typings/core
 */
import { PreventCheck } from '../shared';

export interface Prevent {
  // _tests: Map<string, Function>;
  // _suite: string[];
  // init(): void;
  add(name: string, check: PreventCheck, suite?: boolean): void;
  run(name: string, el: HTMLLinkElement, event: Event, href: string): boolean;
  check(el: HTMLLinkElement, event: Event, href: string): boolean;
}
