/* eslint-disable no-empty-function */
import barba from '../../src';
import { init } from 'barba';

init();
barba.force = jest.fn();

it('forces URL on click', () => {
  barba._onRequestError('trigger', 'enter', 'url', 'error');
  expect(barba.force).not.toHaveBeenCalled();

  barba._onRequestError('trigger', 'click', 'url', 'error');
  expect(barba.force).toHaveBeenCalled();
});

it('calls custom request error', () => {
  barba._requestError = jest.fn();

  barba._onRequestError('trigger', 'click', 'url', 'error');
  expect(barba._requestError).toHaveBeenCalledWith(
    'trigger',
    'click',
    'url',
    'error'
  );
  expect(barba.force).toHaveBeenCalled();
});

it('does not force URL with falsy custom request error', () => {
  barba._requestError = jest.fn(() => false);

  barba._onRequestError('trigger', 'click', 'url', 'error');
  expect(barba._requestError).toHaveBeenCalledWith(
    'trigger',
    'click',
    'url',
    'error'
  );
  expect(barba.force).not.toHaveBeenCalled();
});
