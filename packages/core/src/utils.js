// TODO: handle SVG or other special cases.
export const getHref = el => el.href;
export const getUrl = () => window.location.href;
// Sort array of object by putting "item.prop" first
// export const sort = (arr, prop) =>
//   arr.sort((a, b) => {
//     if (a[prop] && !b[prop]) {
//       return -1;
//     }
//     if (!a[prop] && b[prop]) {
//       return 1;
//     }

//     return 0;
//   });

export const cleanLink = url => url.replace(/#.*/, '');
export const getPort = p => {
  const port = typeof p === 'undefined' ? window.location.port : p;
  const { protocol } = window.location;

  if (port !== '') {
    return parseInt(port, 10);
  }

  if (protocol === 'https:') {
    return 443;
  }

  return 80;
};

export const byPriorities = key => (a, b) => {
  if (
    (a[key] || (a.from && a.from[key]) || (a.to && a.to[key])) &&
    !(b[key] || (b.from && b.from[key]) || (b.to && b.to[key]))
  ) {
    return -1;
  }
  if (
    !(a[key] || (a.from && a.from[key]) || (a.to && a.to[key])) &&
    (b[key] || (b.from && b.from[key]) || (b.to && b.to[key]))
  ) {
    return 1;
  }

  return 0;
};

export const byDirections = (a, b) => {
  if (a.from && a.to && !(b.from || b.to)) {
    return -1;
  }
  if (!(a.from && a.to) && (b.from || b.to)) {
    return 1;
  }

  return 0;
};

// eslint-disable-next-line require-jsdoc
export function checkProp(transition, prop, view, match, direction) {
  let valid = true;
  const t = transition;
  const base = direction ? t[direction] : t; // = t || t.from || t.to
  const exist = direction ? base && base[prop] : base[prop];

  if (exist) {
    // Array support
    const tProps = Array.isArray(base[prop]) ? base[prop] : [base[prop]];

    // For matching, prop should be present on both sides and match
    if (view[prop] && tProps.includes(view[prop])) {
      if (direction) {
        if (!match[direction]) {
          match[direction] = {};
        }
        match[direction][prop] = view[prop];
      } else {
        match[prop] = view[prop];
      }
    }
    // If transition prop is different from current, not valid
    if (!tProps.includes(view[prop])) {
      valid = false;
    }
  }

  return valid;
}

// eslint-disable-next-line require-jsdoc, consistent-return
export function checkCustom(transition, data, match, direction) {
  const t = transition;
  const base = direction ? t[direction] : t; // = t || t.from || t.to
  const exist = direction ? base && base.custom : base.custom;

  if (exist) {
    if (base.custom(data)) {
      if (direction) {
        if (!match[direction]) {
          match[direction] = {};
        }
        match[direction].custom = t[direction].custom;
      } else {
        match.custom = t.custom;
      }
    } else {
      return false;
    }
  }
}
