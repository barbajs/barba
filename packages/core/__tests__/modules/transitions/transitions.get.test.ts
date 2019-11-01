import { ISchemaPage, ITransitionData } from '../../../src/defs';
import { Transitions } from '../../../src/modules/Transitions';

const once = {
  once: () => Promise.resolve(),
};
const enter = {
  enter: () => Promise.resolve(),
};
const transitions = new Transitions([once, enter]);

const data: ITransitionData = {
  current: {} as ISchemaPage,
  next: {} as ISchemaPage,
  trigger: 'barba',
};

it('gets page transition', () => {
  expect(transitions.get(data)).toBe(enter);
});

it('gets once transition', () => {
  expect(transitions.get(data, { once: true })).toBe(once);
});
