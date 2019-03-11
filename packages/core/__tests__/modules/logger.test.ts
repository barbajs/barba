/* tslint:disable:no-string-literal */
import { Logger, LogLevels } from '../../src/modules/Logger';

let logger: Logger;
const source = 'source';
const objects = ['foo', 'bar'];

beforeEach(() => {
  logger = new Logger(source);
});

// it('creates instances', () => {
//   expect(logger._source).toBeUndefined();
//   expect(loggerSource._source).toBe(source);
// });

it('has static log level', () => {
  expect(Logger.getLevel()).toBe(0);

  Logger.setLevel('error');
  expect(Logger.getLevel()).toBe(1);
  Logger.setLevel('warning');
  expect(Logger.getLevel()).toBe(2);
  Logger.setLevel('info');
  expect(Logger.getLevel()).toBe(3);
  Logger.setLevel('debug');
  expect(Logger.getLevel()).toBe(4);
  Logger.setLevel('off');
  expect(Logger.getLevel()).toBe(0);
});

it('logs all levels', () => {
  logger['_log'] = jest.fn();

  logger.error(...objects);
  logger.warn(...objects);
  logger.info(...objects);
  logger.debug(...objects);

  expect(logger['_log']).toHaveBeenNthCalledWith(1, console.error, 1, objects);
  expect(logger['_log']).toHaveBeenNthCalledWith(2, console.warn, 2, objects);
  expect(logger['_log']).toHaveBeenNthCalledWith(3, console.info, 3, objects);
  expect(logger['_log']).toHaveBeenNthCalledWith(4, console.log, 4, objects);
});

it('logs with source', () => {
  Logger.setLevel('debug');
  global.console.log = jest.fn();

  logger.debug(...objects);
  expect(global.console.log).toHaveBeenCalledWith(`[${source}] `, ...objects);
});

it('logs all when level is debug', () => {
  const mock = jest.fn();
  const levels = ['off', 'error', 'warning', 'info', 'debug'];

  global.console.log = mock;
  global.console.info = mock;
  global.console.warn = mock;
  global.console.error = mock;

  levels.forEach((level, i) => {
    Logger.setLevel(level as keyof typeof LogLevels);

    logger.debug();
    logger.info();
    logger.warn();
    logger.error();

    expect(mock).toHaveBeenCalledTimes(i);
    mock.mockReset();
  });
});
