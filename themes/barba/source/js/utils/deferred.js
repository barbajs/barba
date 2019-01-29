/**
 * Deferred
 * Return a special promises, where it exposes the resolve and reject as methods.
 *
 * example:
 *  function exampleDfd() {
 *    const dfd = deferred();
 *    window.setTimeout(dfd.resolve, 3000);
 *    return dfd.promise;
 *  }
 *
 * @returns {Promise} promise
 */

export default () => {
  let _resolve = undefined;
  let _reject = undefined;
  const promise = new Promise((resolve, reject) => {
    _resolve = resolve;
    _reject = reject;
  });

  promise.resolve = _resolve;
  promise.reject = _reject;

  return promise;
};
