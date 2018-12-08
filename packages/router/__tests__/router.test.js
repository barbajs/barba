import barba from '@barba/core';
import router from '../src';

const wrapper = document.createElement('div');
const container = document.createElement('div');

wrapper.dataset.barba = 'wrapper';
container.dataset.barba = 'container';

document.body.appendChild(wrapper);
document.body.appendChild(container);

barba.use(router, {
  routes: [
    {
      name: 'foo',
      path: 'foo/:bar',
    },
  ],
});

barba.init();

it('has routes', () => {
  expect(router._routes).toEqual(['foo']);
  expect(router._routesByName.foo).toEqual({
    path: 'foo/:bar',
    regex: /^foo\/([^/]+?)(?:\/)?$/i,
  });
});
