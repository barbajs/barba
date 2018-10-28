/* global it, expect */
import manager from '../src/manager';

it('manages promises', async () => {
  const expected = {
    current: 'foo',
    next: {},
  };
  const t = {
    beforeAppear(data) {
      expect(data).toBe(expected);

      return Promise.resolve('before');
    },
    appear(data, beforeData) {
      expect(data).toBe(expected);
      expect(beforeData).toBe('before');

      return Promise.resolve('appear');
    },
    afterAppear(appearData) {
      expect(appearData).toBe('appear');

      return Promise.resolve();
    },
  };

  const result = await manager.doAppear(t, expected);

  expect(result).toBeTruthy();
});

it('manages async', async () => {
  const expected = {
    current: 'foo',
    next: {},
  };
  const t = {
    beforeAppear(data) {
      expect(data).toBe(expected);

      const done = this.async();

      done(null, 'before');
    },
    appear(data, beforeData) {
      expect(data).toBe(expected);
      expect(beforeData).toBe('before');

      const done = this.async();

      done(null, 'appear');
    },
    afterAppear(appearData) {
      expect(appearData).toBe('appear');

      const done = this.async();

      done();
    },
  };

  const result = await manager.doAppear(t, expected);

  expect(result).toBeTruthy();
});

it('manages sync', async () => {
  const expected = {
    current: 'foo',
    next: {},
  };
  const t = {
    beforeAppear(data) {
      expect(data).toBe(expected);

      return 'before';
    },
    appear(data, beforeData) {
      expect(data).toBe(expected);
      expect(beforeData).toBe('before');

      return 'appear';
    },
    afterAppear(appearData) {
      expect(appearData).toBe('appear');
    },
  };

  const result = await manager.doAppear(t, expected);

  expect(result).toBeTruthy();
});

it('manages error', async () => {
  const t = {
    appear() {
      throw new Error('🚨');
    },
  };

  const result = await manager.doAppear(t);

  expect(result).toBeFalsy();
});
