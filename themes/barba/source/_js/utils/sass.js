// Sass tools
import convertCssColorNameToHex from 'convert-css-color-name-to-hex';

const baseSize = 10;
const parse = function parse(value, base) {
  // Check if "unitless"
  if (/^[0-9]+(\.*[0-9])*$/.test(value)) {
    return parseFloat(value);
  }

    // Check if "px" unit
  if (value.indexOf('px') > -1) {
    return parseFloat(value.replace('px'));
  }

  // Check if "rem" unit
  if (value.indexOf('rem') > -1) {
    return parseFloat(value.replace('rem')) * base;
  }

  // Check if "%" unit
  if (value.indexOf('%') > -1) {
    return parseFloat(value.replace('%'));
  }

  throw new Error(`Unable to parse '${value}'`);
};

/**
 * Convert CSS unit to pixels
 *
 * @export
 * @param {any} value CSS value to convert
 * @param {any} [base=baseSize] base root size for relative units
 * @returns {string} value in pixels
 */
export function toPx(value, base = baseSize) {
  return `${parse(value, base)}px`;
}

/**
 * Convert CSS unit to rem
 *
 * @export
 * @param {any} value CSS value to convert
 * @param {any} [base=baseSize] base root size for relative units
 * @returns {string} value in pixels
 */
export function toRem(value, base = baseSize) {
  return `${parse(value, base) / base}rem`;
}

/**
 * Convert CSS unit to number
 *
 * @export
 * @param {any} value CSS value to convert
 * @param {any} [base=baseSize] base root size for relative units
 * @returns {number} value (number or integer)
 */
export function toInt(value, base = baseSize) {
  return parse(value, base);
}

/**
 * Convert CSS color names to hex
 *
 * @export
 * @param {string} value CSS color to convert
 * @returns {string} hexadecimal color
 */
export function toHex(value) {
  // If named color (Sass should return hex or named color values)
  if (value.indexOf('#') === -1) {
    return convertCssColorNameToHex(value);
  }

  return value;
}

/**
 * Convert SASS list to JS array
 *
 * @export
 * @param {string} list Sass list
 * @returns {array} JavaScript array
 */
export function toArr(list) {
  let arr;

  // Check if quoted strings (Sass should return double quotes)
  if (/^"/.test(list)) {
    arr = list.replace(/(^"|"$)/g, '').replace(/(", "|" ")/g, ',');
  } else {
    arr = list.replace(/(, | )/g, ',');
  }

  return arr.split(',');
}
