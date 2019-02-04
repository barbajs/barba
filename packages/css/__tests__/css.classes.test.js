/* eslint-disable no-empty-function */
import css from '../src';

// Dom
const container = document.createElement('div');
const step = 'test';

it('add/remove class', () => {
  css._add(container, step);

  expect(container.classList.contains(`barba-${step}`)).toBeTruthy();

  css._remove(container, step);

  expect(container.classList.contains(`barba-${step}`)).toBeFalsy();
});
