import transitions from '../src/transitions';

it('add rule and update', () => {
  const nb = transitions.rules.length;
  const r = {
    name: 'test',
    type: 'strings',
  };

  transitions.add('rule', {
    position: 1,
    value: r,
  });
  expect(transitions.rules).toHaveLength(nb + 1);
  expect(transitions.rules[1]).toBe(r);
});

it('add transition and update', () => {
  const nb = transitions.all.length;
  const t = {
    enter() {},
    leave() {},
  };

  transitions.add('transition', t);
  expect(transitions.all).toHaveLength(nb + 1);
  expect(transitions.all[1]).toBe(t);
});

it('update transitions', () => {
  transitions.update = jest.fn();

  transitions.add();
  expect(transitions.update).toHaveBeenCalledTimes(1);
});
