/**
 * @module typings/core
 */

// Definitions
import {
  IgnoreOption,
  PreventCheck,
  RequestCustomError,
  SchemaAttribute,
  TransitionPage,
  View,
} from '.';
// Core
import { Core } from '../core';
// Modules
import { LogLevels } from '../modules/Logger';

export type BarbaOptions = {
  /** Array of transitions. */
  transitions?: TransitionPage[];
  /** Array of views. */
  views?: View[];
  /** Custom prevent check. */
  prevent?: PreventCheck | null;
  /** Request timeout. */
  timeout?: number;
  /** Custom request error. */
  requestError?: RequestCustomError | undefined;
  /** Disable cache or ignore some routes. */
  cacheIgnore?: IgnoreOption;
  /** Disable prefetch or ignore routes. */
  prefetchIgnore?: IgnoreOption;
  /** Enable debug mode. */
  debug?: boolean;
  /** Log level. */
  logLevel?: keyof typeof LogLevels;
};

export interface BarbaPlugin<T> {
  /** Plugin version */
  version: string;
  /** Plugin name */
  name: string;
  /** Install method */
  install(barba: Core, options?: T): void;
  /** Init method */
  init(): void;
}
