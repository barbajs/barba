import { Logger } from '../src/utils';

let logger;
let loggerSource;
const source = 'source';
const objects = ['foo', 'bar'];

beforeEach(() => {
  logger = new Logger();
  loggerSource = new Logger(source);
});

it('creates instances', () => {
  expect(logger._source).toBeUndefined();
  expect(loggerSource._source).toBe(source);
});

it('has static log level', () => {
  expect(Logger.level).toBe(0);

  Logger.level = 'error';
  expect(Logger.level).toBe(1);
  Logger.level = 'warning';
  expect(Logger.level).toBe(2);
  Logger.level = 'info';
  expect(Logger.level).toBe(3);
  Logger.level = 'debug';
  expect(Logger.level).toBe(4);
  Logger.level = 'off';
  expect(Logger.level).toBe(0);
});

it('logs all levels', () => {
  logger._log = jest.fn();

  logger.error(...objects);
  logger.warn(...objects);
  logger.info(...objects);
  logger.debug(...objects);

  expect(logger._log).toHaveBeenNthCalledWith(1, console.error, 1, objects);
  expect(logger._log).toHaveBeenNthCalledWith(2, console.warn, 2, objects);
  expect(logger._log).toHaveBeenNthCalledWith(3, console.info, 3, objects);
  expect(logger._log).toHaveBeenNthCalledWith(4, console.log, 4, objects);
});

it('logs with source', () => {
  Logger.level = 'debug';
  global.console.log = jest.fn();

  logger.debug(...objects);
  expect(global.console.log).toHaveBeenNthCalledWith(1, ...objects);
  loggerSource.debug(...objects);
  expect(global.console.log).toHaveBeenNthCalledWith(
    2,
    `[${source}] `,
    ...objects
  );
});

it('logs all when level is debug', () => {
  const mock = jest.fn();
  const levels = ['off', 'error', 'warning', 'info', 'debug'];

  global.console.log = mock;
  global.console.info = mock;
  global.console.warn = mock;
  global.console.error = mock;

  levels.forEach((level, i) => {
    Logger.level = level;

    logger.debug();
    logger.info();
    logger.warn();
    logger.error();

    expect(mock).toHaveBeenCalledTimes(i);
    mock.mockReset();
  });
});
