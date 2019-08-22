/* tslint:disable:no-string-literal */
import { schemaAttribute } from '../../src/schemas/attribute';
import { dom } from '../../src/utils';

// Init
const attr = schemaAttribute;

// Dom
const namespace = 'ns';
const container = document.createElement('div');
const wrapper = document.createElement('div');

container.setAttribute(attr.prefix, attr.container);
container.setAttribute(`${attr.prefix}-${attr.namespace}`, namespace);

wrapper.setAttribute(attr.prefix, attr.wrapper);
wrapper.appendChild(container);

// Expected
const checkDoc = new RegExp(
  // tslint:disable-next-line:max-line-length
  `^<html>[\\s\\S]+body[\\s\\S]+${dom['_attr'].wrapper}[\\s\\S]+${dom['_attr'].container}[\\s\\S]+${namespace}[\\s\\S]+</html>$`
);

afterEach(() => {
  document.body.innerHTML = '';
});

it('has attributeSchema', () => {
  expect(dom['_attr']).toBe(schemaAttribute);
});

it('stringifies DOM', () => {
  expect(typeof dom.toString(container)).toBe('string');
});

// see https://github.com/barbajs/barba/issues/362
// it('parses string to Doc', () => {
//   expect(dom.toDocument('<div></div>') instanceof HTMLDocument).toBeTruthy();
// });

it('parses string to Element', () => {
  expect(dom.toElement('<div></div>') instanceof HTMLDivElement).toBeTruthy();
});

it('get html', () => {
  document.body.appendChild(wrapper);

  expect(dom.getHtml()).toMatch(checkDoc);
  expect(dom.getHtml(document)).toMatch(checkDoc);
});

it('get wrapper', () => {
  expect(dom.getWrapper()).toBeNull();

  document.body.appendChild(wrapper);

  expect(dom.getWrapper()).toBe(wrapper);
  expect(dom.getWrapper(document.body)).toBe(wrapper);
});

it('get container', () => {
  expect(dom.getContainer()).toBeNull();

  document.body.appendChild(wrapper);

  expect(dom.getContainer()).toBe(container);
  expect(dom.getContainer(wrapper)).toBe(container);
});

it('get namespace', () => {
  expect(dom.getNamespace()).toBeNull();

  document.body.appendChild(wrapper);

  expect(dom.getNamespace()).toBe(namespace);
  expect(dom.getNamespace(wrapper)).toBe(namespace);
});

it('remove container', () => {
  document.body.appendChild(wrapper);

  dom.removeContainer(container);

  expect(wrapper.children.length).toBe(0);
});

it('add container', () => {
  document.body.appendChild(wrapper);

  dom.removeContainer(container);
  dom.addContainer(container, wrapper);

  expect(wrapper.children.length).toBe(1);
});

it('add container with sibling', () => {
  const sibling = document.createElement('div');

  document.body.appendChild(wrapper);
  wrapper.appendChild(sibling);

  dom.removeContainer(container);
  dom.addContainer(container, wrapper);

  expect(wrapper.children.length).toBe(2);
  expect(container.nextElementSibling).toBe(sibling);
});
