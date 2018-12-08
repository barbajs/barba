import dom from '../src/dom';
import { attributeSchema } from '../src/schema';

const attr = attributeSchema;
const namespace = 'ns';
const container = document.createElement('div');
const wrapper = document.createElement('div');

container.setAttribute(attr.prefix, attr.container);
container.setAttribute(`${attr.prefix}-${attr.namespace}`, namespace);

wrapper.setAttribute(attr.prefix, attr.wrapper);
wrapper.appendChild(container);

dom.init({ attributeSchema });

afterEach(() => {
  document.body.innerHTML = '';
});

it('has attributeSchema', () => {
  expect(dom.attr).toBe(attributeSchema);
});

it('get html', () => {
  document.body.appendChild(wrapper);

  const fullBody = new RegExp(
    `^<html>.+body.+${dom.attr.wrapper}.+${
      dom.attr.container
    }.+${namespace}.+</html>$`
  );

  expect(dom.getHtml()).toMatch(fullBody);
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
