import { ITransitionPage } from '../src/defs';

const namespace = 'n';
const route = 'r';
const custom = () => true;
const unamed: ITransitionPage[] = [
  /* 0000 */ {}, // Nothing
  /* 0010 */ { namespace }, // Namespace
  /* 0011 */ { from: { namespace } },
  /* 0012 */ { to: { namespace } },
  /* 0013 */ { from: { namespace }, to: { namespace } },
  /* 0100 */ { route }, // Route
  /* 0101 */ { from: { route } },
  /* 0102 */ { to: { route } },
  /* 0103 */ { from: { route }, to: { route } },
  /* 0110 */ { route, namespace }, // Route + namespace
  /* 0111 */ { from: { route, namespace } }, // 10
  /* 0112 */ { to: { route, namespace } },
  /* 0113 */ { from: { route, namespace }, to: { route, namespace } },
  /* 1000 */ { custom }, // Custom
  /* 1001 */ { from: { custom } },
  /* 1002 */ { to: { custom } },
  /* 1003 */ { from: { custom }, to: { custom } }, // 16
  /* 1010 */ { custom, namespace }, // Custom + namespace
  /* 1011 */ { from: { custom, namespace } },
  /* 1012 */ { to: { custom, namespace } },
  /* 1013 */ { from: { custom, namespace }, to: { custom, namespace } },
  /* 1100 */ { custom, route }, // Custom + route
  /* 1101 */ { from: { custom, route } },
  /* 1102 */ { to: { custom, route } },
  /* 1103 */ { from: { custom, route }, to: { custom, route } },
  /* 1110 */ { custom, route, namespace }, // Custom + route + namespace
  /* 1111 */ { from: { custom, route, namespace } },
  /* 1112 */ { to: { custom, route, namespace } },
  /* 1113 */ {
    from: { custom, route, namespace },
    to: { custom, route, namespace },
  },
];
const named: ITransitionPage[] = unamed.map((t, i) => {
  t.name = i.toString();

  return t;
});

export default named;
