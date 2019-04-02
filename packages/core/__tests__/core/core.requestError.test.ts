/* tslint:disable:no-string-literal */
import { init } from '../../__mocks__/barba';
import barba from '../../src';

init();
barba.force = jest.fn();

const trigger = 'barba';
const href = 'url';
const error = 'error';
const request = Promise.resolve();

it('forces URL on click', () => {
  barba.cache.set(href, request, 'enter');
  barba.onRequestError(trigger, href, error);
  expect(barba.force).not.toHaveBeenCalled();

  barba.cache.update(href, { action: 'click' });
  barba.onRequestError(trigger, href, error);
  expect(barba.force).toHaveBeenCalled();
});

it('calls custom request error', () => {
  barba['_requestCustomError'] = jest.fn();
  barba.cache.set(href, request, 'click');
  barba.onRequestError(trigger, href, error);
  expect(barba['_requestCustomError']).toHaveBeenCalledWith(
    trigger,
    'click',
    href,
    error
  );
  expect(barba.force).toHaveBeenCalled();
});

it('does not force URL with falsy custom request error', () => {
  barba['_requestCustomError'] = jest.fn(() => false);
  barba.cache.set(href, request, 'click');
  barba.onRequestError(trigger, href, error);
  expect(barba['_requestCustomError']).toHaveBeenCalledWith(
    trigger,
    'click',
    href,
    error
  );
  expect(barba.force).not.toHaveBeenCalled();
});
