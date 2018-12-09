import barba from '../src';

/**
 * Init barba with basic DOM for testing
 *
 * @returns {object} elements + events
 * @export
 */
export function init() {
  const wrapper = document.createElement('div');
  const container = document.createElement('div');
  const link = document.createElement('a');
  const span = document.createElement('span');
  const namespace = 'ns';
  const mouseover = document.createEvent('HTMLEvents');
  const click = document.createEvent('HTMLEvents');

  wrapper.dataset.barba = 'wrapper';
  container.dataset.barba = 'container';
  container.dataset.barbaNamespace = namespace;

  document.body.appendChild(wrapper);
  wrapper.appendChild(container);
  container.appendChild(link);
  link.appendChild(span);
  mouseover.initEvent('mouseover', true, false);
  click.initEvent('click', true, false);

  barba.init();

  return { wrapper, container, link, span, mouseover, click };
}
