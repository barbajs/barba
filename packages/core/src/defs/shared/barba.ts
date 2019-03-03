/**
 * @module typings/core
 */
import { Core } from '../core';
import { SchemaAttribute } from '../schemas';
import { PreventCheck, RequestCustomError, TransitionBase, View } from '.';
import { LogLevels } from '../../utils/Logger';

export type BarbaOptions = {
  transitions?: TransitionBase[];
  views?: View[];
  schema?: SchemaAttribute;
  prevent?: PreventCheck | null;
  timeout?: number;
  requestError?: RequestCustomError | undefined;
  useCache?: boolean;
  usePrefetch?: boolean;
  debug?: boolean;
  logLevel?: keyof typeof LogLevels;
};

export interface BarbaPlugin<T> {
  version: string;
  install(barba: Core, options?: T): void;
  init(): void;
}
