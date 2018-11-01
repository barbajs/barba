import transitions from '../src/transitions';

it('update appear', () => {
  const nb = transitions.appear.length;

  transitions.add('transition', { appear() {} });
  expect(transitions.appear).toHaveLength(nb + 1);
});

it('update wait', () => {
  transitions.add('transition', { to: {} });
  expect(transitions.wait).toBeTruthy();
});
