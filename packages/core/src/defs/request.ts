/**
 * @module typings/core
 */

// Definitions
import { Trigger } from '.';

export type RequestError = (
  url: string,
  errorOrResponse: RequestErrorOrResponse
) => boolean;
// export type RequestErrorBinded = (
//   trigger: Trigger,
//   action: string,
//   ...args: any
// ) => boolean;
export type RequestCustomError = (
  trigger: Trigger,
  action: string,
  url: string,
  response: Response | Error
) => boolean;
export type RequestErrorOrResponse = Error | Response;
