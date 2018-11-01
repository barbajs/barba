"use strict";

Object.defineProperty(exports, "__esModule", {
  value: true
});
exports.pageSchema = exports.attributeSchema = void 0;

/**
 * Attributes
 * data-barba
 *    ="wrapper"
 *    ="container"
 *    ="prefetch"
 *    ="disable"
 * data-barba-namespace
 */
var attributeSchema = {
  prefix: 'data-barba',
  wrapper: 'wrapper',
  container: 'container',
  prefetch: 'prefetch',
  disable: 'disable',
  namespace: 'namespace'
};
/**
 * Pages (current and next structure)
 */

exports.attributeSchema = attributeSchema;
var pageSchema = {
  namespace: undefined,
  url: undefined,
  container: undefined,
  html: undefined
};
exports.pageSchema = pageSchema;