import css from '../src';

// Dom
const container = document.createElement('div');
const step = 'test';

it('add/remove class', () => {
  css.add(container, step);

  expect(container.classList.contains(`barba-${step}`)).toBeTruthy();

  css.remove(container, step);

  expect(container.classList.contains(`barba-${step}`)).toBeFalsy();
});
