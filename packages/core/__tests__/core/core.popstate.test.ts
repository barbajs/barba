/* tslint:disable:no-empty no-string-literal */
import { init } from '../../__mocks__/barba';
import barba from '../../src';

init();

it('handle popstate change', () => {
  barba.go = jest.fn();
  const popstate = document.createEvent('HTMLEvents');

  popstate.initEvent('popstate', true, false);
  window.dispatchEvent(popstate);

  expect(barba.go).toHaveBeenCalledTimes(1);
});
