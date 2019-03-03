/**
 * @module typings/core
 */
import { SchemaPage } from './schemas';
import { Cache, History, Hooks, Store, Transitions, Views } from './modules';
import { Prevent, Request, Dom } from './utils';
import {
  BarbaOptions,
  BarbaPlugin,
  LinkEvent,
  TransitionData,
  RequestErrorBinded,
  Trigger,
  Wrapper,
} from './shared';
// ---

import { Logger } from '../utils/Logger';

export interface Core {
  // Properties
  version: string;
  schemaPage: SchemaPage;
  cache: Cache;
  history: History;
  hooks: Hooks;
  store: Store;
  transitionsManager: Transitions;
  viewsManager: Views;
  dom: Dom;
  prevent: Prevent;
  request: Request;
  helpers: any;
  url: any;
  Logger: typeof Logger;
  // Main methods
  use<T>(plugin: BarbaPlugin<T>, options?: T): this | false;
  init(options: BarbaOptions): void;
  // Public methods
  appear(): void;
  go(url: string, el: Trigger): void;
  force(href: string): void;
  // Options
  timeout: number;
  useCache: boolean;
  usePrefetch: boolean;
  onRequestError: RequestErrorBinded;
  // Getters
  wrapper: Wrapper;
  // Private methods
  _refreshPages(): void;
  _onLinkEnter(e: LinkEvent): void;
  _onLinkClick(e: LinkEvent): void;
  _onStateChange(): void;
  _bind(): void;
  _getLinkElement(e: LinkEvent): HTMLLinkElement;
  _getData(): TransitionData;
  _updateTitle(data: TransitionData): void;
}
