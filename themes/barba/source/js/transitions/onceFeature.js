import {
  getInstance,
} from '../app';

export default {
  to: {
    namespace: 'feature',
  },
  once: ({
    next,
  }) => getInstance(next.container, 'feature').animateIn(),
};
