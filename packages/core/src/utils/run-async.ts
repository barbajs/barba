import isPromise from 'is-promise';

// https://github.com/SBoudrias/run-async
/* istanbul ignore next */
export function runAsync(
  func: (...args: any[]) => void | Promise<any>,
  ctx: any = {}
): (...args: any[]) => Promise<any> {
  return (...args: any[]) => {
    let async = false;

    const promise = new Promise((resolve, reject) => {
      // Add async to context
      ctx.async = () => {
        async = true;

        return (err: any, value: any) => {
          if (err) {
            reject(err);
          } else {
            resolve(value);
          }
        };
      };

      const answer = func.apply(ctx, args as []);

      if (!async) {
        if (isPromise(answer)) {
          (answer as Promise<any>).then(resolve, reject);
        } else {
          resolve(answer);
        }
      }
    });

    return promise;
  };
}
