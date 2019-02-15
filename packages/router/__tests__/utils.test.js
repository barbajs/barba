import { parsePath, parseQuery, cleanUrl } from '../src/utils';

it('parse minimal path', () => {
  const { path, query, hash } = parsePath('/');

  expect(path).toBe('/');
  expect(query).toEqual({});
  expect(hash).toBeUndefined();
});

it('parse full path', () => {
  const { path, query, hash } = parsePath('/foo?baz=qux#bar');

  expect(path).toBe('/foo');
  expect(query).toEqual({ baz: 'qux' });
  expect(hash).toBe('bar');
});

it('parse simple query', () => {
  const query = parseQuery('foo=bar');

  expect(query).toEqual({ foo: 'bar' });
});

it('parse complex query', () => {
  const query = parseQuery('foo=bar&baz=qux');

  expect(query).toEqual({ foo: 'bar', baz: 'qux' });
});

it('clean url', () => {
  const result = cleanUrl('http://localhost/foo', window.location.origin);

  expect(result).toBe('/foo');
});
