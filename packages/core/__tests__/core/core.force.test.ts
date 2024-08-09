import barba from '../../src';

it('force url change', () => {
  Object.defineProperty(window, 'location', {
    writable: true,
    value: { assign: jest.fn() },
  });

  const url = 'http://localhost/foo.html';

  barba.force(url);

  expect(window.location.assign).toHaveBeenCalledTimes(1);
});
