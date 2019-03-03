/**
 * @module core/schemas
 */
import { SchemaAttribute } from '../defs/schemas';

/**
 * ### Defines HTML `data-attribute` used by Barba.
 *
 * @param prefix data-__prefix__
 * @param wrapper data-prefix="__wrapper__"
 * @param container data-prefix="__container__"
 * @param prevent data-prefix-__prevent__
 * @param namespace data-prefix-__namespace__
 */
export const schemaAttribute: SchemaAttribute = {
  prefix: 'data-barba',
  wrapper: 'wrapper',
  container: 'container',
  prevent: 'prevent',
  namespace: 'namespace',
};
