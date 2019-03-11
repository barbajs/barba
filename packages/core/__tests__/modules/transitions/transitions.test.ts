/* eslint-disable no-empty-function */
import { Transitions } from '../../../src/modules/Transitions';

let transitions: Transitions;

it('has defaults', () => {
  transitions = new Transitions([]);
  expect(transitions.hasAppear).toBeFalsy();
  expect(transitions.shouldWait).toBeFalsy();
  expect(transitions.isRunning).toBeFalsy();
});

it('has appear', () => {
  transitions = new Transitions([{ appear: () => Promise.resolve() }]);
  expect(transitions.hasAppear).toBeTruthy();
});

it('should wait', () => {
  transitions = new Transitions([{ to: { namespace: 'ns' } }]);
  expect(transitions.shouldWait).toBeTruthy();
  transitions = new Transitions([{ sync: true }]);
  expect(transitions.shouldWait).toBeTruthy();
});
