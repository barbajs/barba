import { Ignore } from '../../src/modules/Ignore';

let ignore: Ignore;
const url = 'http://localhost/';
const url2 = 'http://localhost/foo.html';
const url3 = 'http://localhost/bar/foo.html';

it('ignores none', () => {
  ignore = new Ignore(false);

  expect(ignore.checkUrl(url)).toBeFalsy();
});

it('ignores all', () => {
  ignore = new Ignore(true);

  expect(ignore.checkUrl(url)).toBeTruthy();
});

it('ignores URL ', () => {
  ignore = new Ignore('/');

  expect(ignore.checkUrl(url)).toBeTruthy();
  expect(ignore.checkUrl(url2)).toBeFalsy();
});

it('ignores URLs ', () => {
  ignore = new Ignore(['/', '/:segment/foo.html']);

  expect(ignore.checkUrl(url)).toBeTruthy();
  expect(ignore.checkUrl(url2)).toBeFalsy();
  expect(ignore.checkUrl(url3)).toBeTruthy();
});
