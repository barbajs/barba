import { init } from '../../__mocks__/barba';
import barba from '../../src';

init();

// Mocks
barba.go = jest.fn();

it('handle state change', () => {
  const popstate = document.createEvent('HTMLEvents');

  popstate.initEvent('popstate', true, false);
  window.dispatchEvent(popstate);

  expect(barba.go).toHaveBeenCalledTimes(1);
});
