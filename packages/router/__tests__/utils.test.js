import { parsePath, cleanUrl } from '../src/utils';

it('parse path', () => {
  const { path, query, hash } = parsePath('/foo?baz=qux#bar');

  expect(path).toBe('/foo');
  expect(query).toBe('baz=qux');
  expect(hash).toBe('#bar');
});

it('clean url', () => {
  const result = cleanUrl('http://localhost/foo', window.location.origin);

  expect(result).toBe('/foo');
});
