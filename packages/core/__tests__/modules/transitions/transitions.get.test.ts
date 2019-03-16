import { ISchemaPage, ITransitionData } from '../../../src/defs';
import { Transitions } from '../../../src/modules/Transitions';

const appear = {
  appear: () => Promise.resolve(),
};
const enter = {
  enter: () => Promise.resolve(),
};
const transitions = new Transitions([appear, enter]);

const data: ITransitionData = {
  current: {} as ISchemaPage,
  next: {} as ISchemaPage,
  trigger: 'barba',
};

it('gets page transition', () => {
  expect(transitions.get(data)).toBe(enter);
});

it('gets appear transition', () => {
  expect(transitions.get(data, true)).toBe(appear);
});
