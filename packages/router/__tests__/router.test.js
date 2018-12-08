import barba from '@barba/core';
import router from '../src';

const wrapper = document.createElement('div');
const container = document.createElement('div');

wrapper.dataset.barba = 'wrapper';
container.dataset.barba = 'container';

document.body.appendChild(wrapper);
document.body.appendChild(container);

barba.use(router, { routes: { foo: '/foo' } });
barba.init();

it('has routes', () => {
  expect(router.routes).toMatchObject({ foo: '/foo' });
});
