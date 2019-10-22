/**
 * @barba/core/modules/ignore
 * <br><br>
 * ## Manage ignore options.
 *
 * - cache
 * - prefetch
 *
 * @module core/modules/ignore
 * @preferred
 */

/***/

// Definitions
import { IgnoreOption } from '../defs';
// Utils
import { pathToRegexp } from '../utils/helpers';
import { parse } from '../utils/url';

export class Ignore {
  private _ignoreAll: boolean;
  private _ignoreRegexes: RegExp[] = [];

  constructor(ignore: IgnoreOption) {
    if (typeof ignore === 'boolean') {
      this._ignoreAll = ignore;
    } else {
      const paths = Array.isArray(ignore) ? ignore : [ignore];

      this._ignoreRegexes = paths.map(p => pathToRegexp(p));
    }
  }

  public checkHref(href: string): boolean {
    if (typeof this._ignoreAll === 'boolean') {
      return this._ignoreAll;
    }

    const { path } = parse(href);

    return this._ignoreRegexes.some(regex => regex.exec(path) !== null);
  }
}
