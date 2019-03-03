/**
 * @module typings/core
 */
import { Scope, Wrapper } from '../shared';

export interface Dom {
  toString(dom: HTMLElement): string;
  toDocument(htmlString: string): HTMLDocument;
  getHtml(doc?: HTMLDocument): string;
  getWrapper(scope?: Scope): Wrapper;
  getContainer(scope?: Scope): HTMLElement | null;
  getNamespace(scope?: Scope): string | null;
  getUrl(el: HTMLLinkElement): string | null;
}
