import barba from '../../src';
import { init } from 'barba';

init();

// Mocks
barba.go = jest.fn();

it('handle state change', () => {
  const popstate = document.createEvent('HTMLEvents');

  popstate.initEvent('popstate', true, false);
  window.dispatchEvent(popstate);

  expect(barba.go).toHaveBeenCalledTimes(1);
});
