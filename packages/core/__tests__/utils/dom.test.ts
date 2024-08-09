/* tslint:disable:no-string-literal */
import { schemaAttribute } from '../../src/schemas/attribute';
import { dom } from '../../src/utils';

// Init
const attr = schemaAttribute;

// Dom
const namespace = 'ns';
const currentContainer = document.createElement('div');
const nextContainer = document.createElement('div');
const wrapper = document.createElement('div');
const link = document.createElement('a');
const svg = document.createElementNS('http://www.w3.org/2000/svg', 'svg');

// const svgLink = document.createElement('a');
const svgLink = document.createElementNS('http://www.w3.org/2000/svg', 'a');
const svgXlink = document.createElementNS('http://www.w3.org/2000/svg', 'a');

svg.appendChild(svgLink);
svg.appendChild(svgXlink);

attr.prefix &&
  attr.container &&
  currentContainer.setAttribute(attr.prefix, attr.container);
currentContainer.setAttribute(`${attr.prefix}-${attr.namespace}`, namespace);

attr.prefix && attr.wrapper && wrapper.setAttribute(attr.prefix, attr.wrapper);

// Expected
const checkDoc = new RegExp(
  // tslint:disable-next-line:max-line-length
  `^<html>[\\s\\S]+body[\\s\\S]+${dom['_attr'].wrapper}[\\s\\S]+${dom['_attr'].container}[\\s\\S]+${namespace}[\\s\\S]+</html>$`
);
const checkHref = 'http://localhost/page.html';

afterEach(() => {
  wrapper.innerHTML = '';
  document.body.innerHTML = '';
});

it('has attributeSchema', () => {
  expect(dom['_attr']).toBe(schemaAttribute);
});

it('stringifies DOM', () => {
  expect(typeof dom.toString(currentContainer)).toBe('string');
});

// see https://github.com/barbajs/barba/issues/362
// it('parses string to Doc', () => {
//   expect(dom.toDocument('<div></div>') instanceof HTMLDocument).toBeTruthy();
// });

it('parses string to Element', () => {
  expect(dom.toElement('<div></div>') instanceof HTMLDivElement).toBeTruthy();
});

it('get html', () => {
  wrapper.appendChild(currentContainer);
  document.body.appendChild(wrapper);

  expect(dom.getHtml()).toMatch(checkDoc);
  expect(dom.getHtml(document)).toMatch(checkDoc);
});

it('get wrapper', () => {
  expect(dom.getWrapper()).toBeNull();

  wrapper.appendChild(currentContainer);
  document.body.appendChild(wrapper);

  expect(dom.getWrapper()).toBe(wrapper);
  expect(dom.getWrapper(document.body)).toBe(wrapper);
});

it('get container', () => {
  expect(dom.getContainer()).toBeNull();

  wrapper.appendChild(currentContainer);
  document.body.appendChild(wrapper);

  expect(dom.getContainer()).toBe(currentContainer);
  expect(dom.getContainer(wrapper)).toBe(currentContainer);
});

it('get namespace', () => {
  expect(dom.getNamespace()).toBeNull();

  wrapper.appendChild(currentContainer);
  document.body.appendChild(wrapper);

  expect(dom.getNamespace()).toBe(namespace);
  expect(dom.getNamespace(wrapper)).toBe(namespace);
});

it('get href [link / absolute]', () => {
  link.setAttribute('href', 'http://localhost/page.html');

  expect(dom.getHref(link)).toBe(checkHref);
});

it('get href [link / relative]', () => {
  link.setAttribute('href', 'page.html');

  expect(dom.getHref(link)).toBe(checkHref);
});

it('get href [svg / absolute]', () => {
  const val = 'http://localhost/page.html';

  svgLink.setAttribute('href', val);
  svgXlink.setAttributeNS('http://www.w3.org/1999/xlink', 'xlink:href', val);

  expect(dom.getHref(svgLink)).toBe(checkHref);
  expect(dom.getHref(svgXlink)).toBe(checkHref);
});

it('get href [svg / absolute no protocol]', () => {
  const val = '//localhost/page.html';

  svgLink.setAttribute('href', val);
  svgXlink.setAttributeNS('http://www.w3.org/1999/xlink', 'xlink:href', val);

  expect(dom.getHref(svgLink)).toBe(checkHref);
  expect(dom.getHref(svgXlink)).toBe(checkHref);
});

it('get href [svg / relative root]', () => {
  const val = '/page.html';

  svgLink.setAttribute('href', val);
  svgXlink.setAttributeNS('http://www.w3.org/1999/xlink', 'xlink:href', val);

  expect(dom.getHref(svgLink)).toBe(checkHref);
  expect(dom.getHref(svgXlink)).toBe(checkHref);
});

it('get href [svg / relative simple]', () => {
  const val = 'page.html';

  svgLink.setAttribute('href', val);
  svgXlink.setAttributeNS('http://www.w3.org/1999/xlink', 'xlink:href', val);

  expect(dom.getHref(svgLink)).toBe(checkHref);
  expect(dom.getHref(svgXlink)).toBe(checkHref);
});

it('get href [svg / relative same]', () => {
  const val = './page.html';

  svgLink.setAttribute('href', val);
  svgXlink.setAttributeNS('http://www.w3.org/1999/xlink', 'xlink:href', val);

  expect(dom.getHref(svgLink)).toBe(checkHref);
  expect(dom.getHref(svgXlink)).toBe(checkHref);
});

it('get href [svg / relative level]', () => {
  (global as any).jsdom.reconfigure({ url: 'http://localhost/foo/' });
  const val = '../page.html';

  svgLink.setAttribute('href', val);
  svgXlink.setAttributeNS('http://www.w3.org/1999/xlink', 'xlink:href', val);

  expect(dom.getHref(svgLink)).toBe(checkHref);
  expect(dom.getHref(svgXlink)).toBe(checkHref);
});

it('get href [svg / relative level]', () => {
  const url = 'http://localhost/foo.html';
  const val = '#hash';

  (global as any).jsdom.reconfigure({ url });

  svgLink.setAttribute('href', val);
  svgXlink.setAttributeNS('http://www.w3.org/1999/xlink', 'xlink:href', val);

  expect(dom.getHref(svgLink)).toBe(url + val);
  expect(dom.getHref(svgXlink)).toBe(url + val);
});

it('remove container', () => {
  document.body.appendChild(wrapper);

  dom.removeContainer(currentContainer);

  expect(wrapper.children.length).toBe(0);
});

it('add container', () => {
  wrapper.appendChild(currentContainer);
  document.body.appendChild(wrapper);

  dom.addContainer(nextContainer, wrapper);
  dom.removeContainer(currentContainer);

  expect(wrapper.children.length).toBe(1);
});

it('add container with container sibling', () => {
  wrapper.appendChild(currentContainer);
  document.body.appendChild(wrapper);

  dom.addContainer(nextContainer, wrapper);

  expect(wrapper.children.length).toBe(2);
  expect(nextContainer.previousElementSibling).toBe(currentContainer);
  expect(dom.getContainer()).toBe(currentContainer);
});

it('add container with before sibling', () => {
  const before = document.createElement('div');

  wrapper.appendChild(before);
  wrapper.appendChild(currentContainer);
  document.body.appendChild(wrapper);

  dom.removeContainer(currentContainer);
  dom.addContainer(nextContainer, wrapper);

  expect(wrapper.children.length).toBe(2);
  expect(nextContainer.previousElementSibling).toBe(before);
  expect(dom.getSibling().before).not.toBeNull();
});

it('add container with after sibling', () => {
  const after = document.createElement('div');

  wrapper.appendChild(currentContainer);
  wrapper.appendChild(after);
  document.body.appendChild(wrapper);

  dom.removeContainer(currentContainer);
  dom.addContainer(nextContainer, wrapper);

  expect(wrapper.children.length).toBe(2);
  expect(nextContainer.nextElementSibling).toBe(after);
  expect(dom.getSibling().after).not.toBeNull();
});

it('add container with parent sibling', () => {
  const parent = document.createElement('div');

  parent.appendChild(currentContainer);
  wrapper.appendChild(parent);
  document.body.appendChild(wrapper);

  dom.removeContainer(currentContainer);
  dom.addContainer(nextContainer, wrapper);

  expect(wrapper.children.length).toBe(1);
  expect(nextContainer.parentNode).toBe(parent);
  expect(dom.getSibling().parent).not.toBeNull();
});
