/**
 * @module typings/core
 */

// Definitions
import {
  IgnoreOption,
  ISchemaAttribute,
  ITransitionPage,
  IView,
  PreventCheck,
  RequestCustomError,
} from '.';
// Core
import { Core } from '../core';
// Modules
import { LogLevels } from '../modules/Logger';

export interface IBarbaOptions {
  /** Array of transitions. */
  transitions?: ITransitionPage[];
  /** Array of views. */
  views?: IView[];
  /** Request timeout. */
  timeout?: number;
  /** Custom request error. */
  requestError?: RequestCustomError | undefined;
  /** Disable cache or ignore some routes. */
  cacheIgnore?: IgnoreOption;
  /** Disable prefetch or ignore routes. */
  prefetchIgnore?: IgnoreOption;
  /** Custom prevent check. */
  prevent?: PreventCheck | null;
  /** Prevent click when transition is running. */
  preventRunning?: boolean;
  /** Custom [data-attribute]. */
  schema?: ISchemaAttribute;
  /** Enable debug mode. */
  debug?: boolean;
  /** Log level. */
  logLevel?: keyof typeof LogLevels;
}

export interface IBarbaPlugin<T> {
  /** Plugin version */
  version: string;
  /** Plugin name */
  name: string;
  /** Install method */
  install(barba: Core, options?: T): void;
  /** Init method */
  init(): void;
}
