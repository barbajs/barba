// https://developer.mozilla.org/en-US/docs/Web/JavaScript/Reference/Global_Objects/Error
export class BarbaError extends Error {
  /* istanbul ignore next */
  constructor(
    public error: Error,
    public label = 'Barba error',
    ...params: any[]
  ) {
    // Pass remaining arguments (including vendor specific ones) to parent constructor
    super(...params);

    // Maintains proper stack trace for where our error was thrown (only available on V8)
    /* istanbul ignore else */
    if (Error.captureStackTrace) {
      Error.captureStackTrace(this, BarbaError);
    }

    this.name = 'BarbaError';
  }
}
