/**
 * @module typings/router
 */

export interface IRoute {
  name: string;
  path: string;
}
export interface IRouteParsed {
  path: string;
  regex: RegExp;
  keys: any[];
}
export interface IRouteResolved {
  name: string;
  params: any;
}
export interface IRouteByName {
  [key: string]: IRouteParsed;
}
export interface IRouterOptions {
  routes?: IRoute[];
}
