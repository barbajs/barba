import { manager } from '../../src/transitions';

it('manages promises', async () => {
  const expected = {
    current: 'foo',
    next: {},
  };
  const transition = {
    beforeAppear(data) {
      expect(data).toBe(expected);
    },
    appear(data) {
      expect(data).toBe(expected);

      return Promise.resolve();
    },
    afterAppear(data) {
      expect(data).toBe(expected);
    },
  };

  const result = await manager.doAppear({ transition, data: expected });

  expect(result).toBeTruthy();
});

it('manages async', async () => {
  const expected = {
    current: 'foo',
    next: {},
  };
  const transition = {
    appear(data) {
      expect(data).toBe(expected);

      const done = this.async();

      done(null);
    },
  };

  const result = await manager.doAppear({ transition, data: expected });

  expect(result).toBeTruthy();
});

it('manages sync', async () => {
  const expected = {
    current: 'foo',
    next: {},
  };
  const transition = {
    appear(data) {
      expect(data).toBe(expected);
    },
  };

  const result = await manager.doAppear({ transition, data: expected });

  expect(result).toBeTruthy();
});

it('manages minimal transition', async () => {
  const transition = {
    appear() {}, // eslint-disable-line no-empty-function
  };

  const result = await manager.doAppear({ transition });

  expect(result).toBeTruthy();
});

it('manages error', async () => {
  const transition = {
    appear() {
      throw new Error('No transition found');
    },
  };

  const result = await manager.doAppear({ transition });

  expect(result).toBeFalsy();
});
