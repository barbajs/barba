"use strict";

Object.defineProperty(exports, "__esModule", {
  value: true
});
exports.forEach = forEach;
exports.map = map;
exports.byDirections = exports.byPriorities = exports.getPort = exports.cleanLink = exports.getUrl = exports.getHref = void 0;

// TODO: handle SVG or other special cases.
var getHref = function getHref(el) {
  return el.href;
};

exports.getHref = getHref;

var getUrl = function getUrl() {
  return window.location.href;
};

exports.getUrl = getUrl;

var cleanLink = function cleanLink(url) {
  return url.replace(/#.*/, '');
};

exports.cleanLink = cleanLink;

var getPort = function getPort(p) {
  var port = typeof p === 'undefined' ? window.location.port : p;
  var protocol = window.location.protocol;

  if (port !== '') {
    return parseInt(port, 10);
  }

  if (protocol === 'https:') {
    return 443;
  }

  return 80;
};

exports.getPort = getPort;

var byPriorities = function byPriorities(key) {
  return function (a, b) {
    if ((a[key] || a.from && a.from[key] || a.to && a.to[key]) && !(b[key] || b.from && b.from[key] || b.to && b.to[key])) {
      return -1;
    }

    if (!(a[key] || a.from && a.from[key] || a.to && a.to[key]) && (b[key] || b.from && b.from[key] || b.to && b.to[key])) {
      return 1;
    }

    return 0;
  };
};

exports.byPriorities = byPriorities;

var byDirections = function byDirections(a, b) {
  if (a.from && a.to && !(b.from || b.to)) {
    return -1;
  }

  if (!(a.from && a.to) && (b.from || b.to)) {
    return 1;
  }

  return 0;
};
/**
 * ForEach for array/object (basic version)
 *
 * @param {Array|Object} collection "collection" to loop over
 * @param {Function} iteratee callback
 * @returns {Array|Object} initial collection
 */


exports.byDirections = byDirections;

function forEach(collection, iteratee) {
  if (collection.forEach === undefined) {
    Object.keys(collection).forEach(function (key) {
      iteratee(collection[key], key);
    });
  } else {
    collection.forEach(iteratee);
  }

  return collection;
}
/**
 * Map for array/object (basic version)
 *
 * @param {Array|Object} collection "collection" to loop over
 * @param {Function} iteratee callback
 * @returns {Array} "mapped" array
 */


function map(collection, iteratee) {
  if (collection.map === undefined) {
    return Object.keys(collection).map(function (key) {
      return iteratee(collection[key], key);
    });
  }

  return collection.map(iteratee);
}