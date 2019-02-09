/* eslint-disable no-empty-function */
import barba from '../../src';
import { init } from 'barba';

init();
barba.force = jest.fn();

it('forces URL on click', () => {
  barba._onRequestError('enter', 'url', 'error');
  expect(barba.force).not.toHaveBeenCalled();

  barba._onRequestError('click', 'url', 'error');
  expect(barba.force).toHaveBeenCalled();
});

it('calls custom request error', () => {
  barba._requestError = jest.fn();

  barba._onRequestError('click', 'url', 'error');
  expect(barba._requestError).toHaveBeenCalledWith('click', 'url', 'error');
  expect(barba.force).toHaveBeenCalled();
});

it('does not force URL with falsy custom request error', () => {
  barba._requestError = jest.fn(() => false);

  barba._onRequestError('click', 'url', 'error');
  expect(barba._requestError).toHaveBeenCalledWith('click', 'url', 'error');
  expect(barba.force).not.toHaveBeenCalled();
});
