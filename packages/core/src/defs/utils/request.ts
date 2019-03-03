/**
 * @module typings/core
 */
import { RequestError, RequestCustomError } from '../shared';

export type RequestFetcher = (url: string) => Promise<string>;

export type RequestTimeout = (
  url: string,
  ms: number,
  request: Promise<string>,
  requestError: RequestError
) => Promise<string>;

export type Request = (
  url: string,
  ttl: number,
  requestError: RequestError | boolean
) => Promise<string>;
