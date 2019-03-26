/* tslint:disable:no-string-literal */
import { init } from '../../__mocks__/barba';
import barba from '../../src';

init();
barba.force = jest.fn();

it('forces URL on click', () => {
  barba.onRequestError('barba', 'enter', 'url', 'error');
  expect(barba.force).not.toHaveBeenCalled();

  barba.onRequestError('barba', 'click', 'url', 'error');
  expect(barba.force).toHaveBeenCalled();
});

it('calls custom request error', () => {
  barba['_requestCustomError'] = jest.fn();

  barba.onRequestError('barba', 'click', 'url', 'error');
  expect(barba['_requestCustomError']).toHaveBeenCalledWith(
    'barba',
    'click',
    'url',
    'error'
  );
  expect(barba.force).toHaveBeenCalled();
});

it('does not force URL with falsy custom request error', () => {
  barba['_requestCustomError'] = jest.fn(() => false);

  barba.onRequestError('barba', 'click', 'url', 'error');
  expect(barba['_requestCustomError']).toHaveBeenCalledWith(
    'barba',
    'click',
    'url',
    'error'
  );
  expect(barba.force).not.toHaveBeenCalled();
});
