/**
 * @module typings/core
 */
import { HooksView, HooksMap, HookViewData, View } from '../shared';

type Hook = (data: HookViewData) => void;

export interface Views extends HooksMap {
  init(views: View[]): void;
  _getHook(name: HooksView): Hook;
}
