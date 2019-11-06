import { BarbaError } from '../../src/modules/Error';

const err = new Error('Test error');

it('has defaults', () => {
  const e = new BarbaError(err);

  expect(e.name).toBe('BarbaError');
  expect(e.label).toBe('Barba error');
  expect(e.error).toBe(err);
});

it('has params', () => {
  const e = new BarbaError(err, 'Label error', 'Message error');

  expect(e.name).toBe('BarbaError');
  expect(e.label).toBe('Label error');
  expect(e.message).toBe('Message error');
  expect(e.error).toBe(err);
});
