import dom from '../src/dom';
import { attributeSchema } from '../src/schema';

// Init
const attr = attributeSchema;

dom.init({ attributeSchema });

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
  `^<html>.+body.+${dom.attr.wrapper}.+${
    dom.attr.container
  }.+${namespace}.+</html>$`
);

afterEach(() => {
  document.body.innerHTML = '';
});

it('has attributeSchema', () => {
  expect(dom.attr).toBe(attributeSchema);
});

it('stringifies DOM', () => {
  expect(typeof dom.toString(container)).toBe('string');
});

it('parses string to Doc', () => {
  expect(dom.toDocument('<div></div>') instanceof HTMLDocument).toBeTruthy();
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
