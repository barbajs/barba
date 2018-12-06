import { byPriorities, byDirections } from '../../src/transitions/helpers';

it('sort by priorities', () => {
  const key = { key: true };
  const key2 = { key: true };
  const none = {};

  const sort1 = [key, key2, none].sort(byPriorities('key'));
  const sort2 = [none, key, key2].sort(byPriorities('key'));

  expect(sort1).toEqual([key, key2, none]);
  expect(sort2).toEqual([key, key2, none]);
});

it('sort by directions', () => {
  const fromTo = { from: true, to: true };
  const from = { from: true };
  const none = {};

  const sort1 = [none, from, fromTo].sort(byDirections);
  const sort2 = [from, fromTo, none].sort(byDirections);
  const sort3 = [fromTo, from, none].sort(byDirections);
  const sort4 = [fromTo, none, from].sort(byDirections);
  const sort5 = [from, none, fromTo].sort(byDirections);

  expect(sort1).toEqual([fromTo, from, none]);
  expect(sort2).toEqual([fromTo, from, none]);
  expect(sort3).toEqual([fromTo, from, none]);
  expect(sort4).toEqual([fromTo, from, none]);
  expect(sort5).toEqual([fromTo, from, none]);
});
