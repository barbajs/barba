/**
 * @module typings/core
 */

// Definitions
import { Link } from './index';
/**
 * Available data for all prevent checks.
 *
 * - `el`: the clicked link
 * - `event`: the associated event
 * - `href`: the href to use for fetching
 */
export interface IPreventCheckData {
  el: Link;
  event: Event;
  href: string;
}

/**
 * Prevent check.
 *
 * - Receives check data.
 * - If it returns `true`, Barba will prevent the action.
 */
export type PreventCheck = (data: IPreventCheckData) => boolean;
