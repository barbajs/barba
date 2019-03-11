/**
 * @module prefetch/polyfills
 */
/**
 * Copyright 2018 Google Inc.
 *
 * Licensed under the Apache License, Version 2.0 (the "License");
 * you may not use this file except in compliance with the License.
 * You may obtain a copy of the License at
 *
 *     http://www.apache.org/licenses/LICENSE-2.0
 *
 * Unless required by applicable law or agreed to in writing, software
 * distributed under the License is distributed on an "AS IS" BASIS,
 * WITHOUT WARRANTIES OR CONDITIONS OF ANY KIND, either express or implied.
 * See the License for the specific language governing permissions and
 * limitations under the License.
 */

// [source](https://github.com/GoogleChromeLabs/quicklink/blob/master/src/request-idle-callback.mjs)
// RIC and shim for browsers setTimeout() without it
export const requestIdleCallback =
  // @ts-ignore
  window.requestIdleCallback ||
  function ric(cb: any) {
    const start = Date.now();

    return setTimeout(() => {
      cb({
        didTimeout: false,
        timeRemaining: function timeRemaining() {
          return Math.max(0, 50 - (Date.now() - start));
        },
      });
    }, 1);
  };
