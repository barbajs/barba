/**
 * @module typings/core
 */
import { HooksAll, HooksMap } from '../shared';

export interface Hooks extends HooksMap {
  init(): this;
  do(hook: HooksAll, ...args: any): void;
  help(): void;
}
