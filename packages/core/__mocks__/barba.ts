import barba from '../src';
import { ITransitionPage } from '../src/defs';

/**
 * Init barba with basic DOM for testing
 */
export function init(transitions: ITransitionPage[] = []): any {
  const wrapper = document.createElement('div');
  const container = document.createElement('div');
  const link = document.createElement('a');
  const span = document.createElement('span');
  const namespace = 'current';
  const mouseover = document.createEvent('HTMLEvents');
  const click = document.createEvent('HTMLEvents');

  wrapper.dataset.barba = 'wrapper';
  container.dataset.barba = 'container';
  container.dataset.barbaNamespace = namespace;

  document.title = 'Current page';
  document.body.appendChild(wrapper);
  wrapper.appendChild(container);
  container.appendChild(link);
  link.appendChild(span);
  mouseover.initEvent('mouseover', true, false);
  click.initEvent('click', true, false);

  barba.init({ transitions });

  return { wrapper, container, link, span, mouseover, click };
}
