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
