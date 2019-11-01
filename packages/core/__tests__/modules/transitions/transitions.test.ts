import { Transitions } from '../../../src/modules/Transitions';

let transitions: Transitions;

it('has defaults', () => {
  transitions = new Transitions();
  expect(transitions.hasOnce).toBeFalsy();
  expect(transitions.shouldWait).toBeFalsy();
  expect(transitions.isRunning).toBeFalsy();
  expect(transitions.store).toBeDefined();
});

it('has once', () => {
  transitions = new Transitions([{ once: () => Promise.resolve() }]);
  expect(transitions.hasOnce).toBeTruthy();
});

it('should wait', () => {
  transitions = new Transitions([{ to: { namespace: 'ns' } }]);
  expect(transitions.shouldWait).toBeTruthy();
  transitions = new Transitions([{ sync: true }]);
  expect(transitions.shouldWait).toBeTruthy();
});
