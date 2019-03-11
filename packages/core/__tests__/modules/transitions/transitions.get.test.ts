/* eslint-disable no-empty-function */
import { Transitions } from '../../../src/modules/Transitions';
import { TransitionData, SchemaPage } from '../../../src/defs';

const appear = {
  appear: () => Promise.resolve(),
};
const enter = {
  enter: () => Promise.resolve(),
};
const transitions = new Transitions([appear, enter]);

const data: TransitionData = {
  current: {} as SchemaPage,
  next: {} as SchemaPage,
  trigger: 'barba',
};

it('gets page transition', () => {
  expect(transitions.get(data)).toBe(enter);
});

it('gets appear transition', () => {
  expect(transitions.get(data, true)).toBe(appear);
});
