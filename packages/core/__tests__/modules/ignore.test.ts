import { Ignore } from '../../src/modules/Ignore';

let ignore: Ignore;
const url = 'http://localhost/';
const url2 = 'http://localhost/foo.html';
const url3 = 'http://localhost/bar/foo.html';

it('ignores none', () => {
  ignore = new Ignore(false);

  expect(ignore.checkHref(url)).toBeFalsy();
});

it('ignores all', () => {
  ignore = new Ignore(true);

  expect(ignore.checkHref(url)).toBeTruthy();
});

it('ignores URL', () => {
  ignore = new Ignore('/');

  expect(ignore.checkHref(url)).toBeTruthy();
  expect(ignore.checkHref(url2)).toBeFalsy();
});

it('ignores URLs', () => {
  ignore = new Ignore(['/', '/:segment/foo.html']);

  expect(ignore.checkHref(url)).toBeTruthy();
  expect(ignore.checkHref(url2)).toBeFalsy();
  expect(ignore.checkHref(url3)).toBeTruthy();
});
