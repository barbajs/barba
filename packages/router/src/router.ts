/**
 * @barba/router
 * <br><br>
 * ## Barba Router.
 *
 * - Add `route` to Barba transitions resolution
 *
 * @module router
 * @preferred
 */

/***/

// Definitions
import { IBarbaPlugin, ITransitionData } from '@barba/core/src/defs';

// Barba/core
import { Core } from '@barba/core/src/core';
import { Logger } from '@barba/core/src/modules/Logger';
// Local
import { version } from '../package.json';
import { IRouteByName, IRouteResolved, IRouterOptions } from './defs/router';

class Router implements IBarbaPlugin<IRouterOptions> {
  public name = '@barba/router';
  public version = version;
  public barba: Core;
  public logger: Logger;

  public routeNames: string[] = [];
  public routesByName: IRouteByName = {};

  /**
   * Plugin installation.
   */
  public install(barba: Core, { routes = [] }: IRouterOptions = {}) {
    this.logger = new barba.Logger(this.name);
    this.logger.info(this.version);
    this.barba = barba;

    routes.forEach(route => {
      const { name, path } = route;
      const keys: any[] = [];
      const regex = this.barba.helpers.pathToRegexp(path, keys);

      if (this.routeNames.indexOf(name) > -1) {
        console.warn(`[@barba/router] Duplicated route name (${name})`);
      } else {
        this.routeNames.push(name);
        this.routesByName[name] = {
          keys,
          path,
          regex,
        };
      }
    });

    // Add property to "pageSchema" (current, next)
    barba.schemaPage.route = undefined;
  }

  /**
   * Plugin initialisation.
   */
  public init() {
    // Wait for store initialization then add new rule for routes
    this.barba.transitions.store.add('rule', {
      position: 1,
      value: {
        name: 'route',
        type: 'object',
      },
    });
    // Register hooks
    this.barba.hooks.page(this.resolveRoutes, this);
    this.barba.hooks.reset(this.resolveRoutes, this);
  }

  /**
   * Resolve URL to route name.
   */
  public resolveUrl(url: string): IRouteResolved | null {
    const { path } = this.barba.url.parse(url);
    const output: IRouteResolved = {
      name,
      params: {},
    };

    /* tslint:disable:no-shadowed-variable */
    for (let i = 0, l = this.routeNames.length; i < l; i++) {
      const name = this.routeNames[i];
      const { regex, keys } = this.routesByName[name];
      const res = regex.exec(path);

      if (res !== null) {
        output.name = name;

        keys.forEach((key, i) => {
          output.params[key.name] = res[i + 1];
        });

        return output;
      }
    }

    return null;
  }

  /**
   * Hooks: do, reset.
   *
   * - Update `current` and `next` data
   */
  public resolveRoutes(data: ITransitionData): void {
    const { current, next } = data;

    current.route = current.url.href
      ? this.resolveUrl(current.url.href)
      : undefined;
    next.route = next.url.href ? this.resolveUrl(next.url.href) : undefined;
  }
}

const router = new Router();

export default router;
