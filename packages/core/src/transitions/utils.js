/**
 * Calculate transition priority based on:
 * - rule "position" gives tens (index * 10)
 * - from/to properties give units (0, 1 or 2)
 *
 * @param {object} item transition
 * @param {string} name rule name
 * @param {number} index rule index
 * @returns {number} priority
 */
function calculatePriority(item, name, index) {
  let priority = 0;

  if (
    item[name] ||
    (item.from && item.from[name]) ||
    (item.to && item.to[name])
  ) {
    priority += index * 10;

    if (item.from && item.from[name]) {
      priority += 1;
    }
    if (item.to && item.to[name]) {
      priority += 2;
    }
  }

  return priority;
}

export const byPriorities = rules => (a, b) => {
  let aPriority = 0;
  let bPriority = 0;

  rules.forEach((rule, i) => {
    const { name } = rule;
    const index = i + 1;

    aPriority += calculatePriority(a, name, index);
    bPriority += calculatePriority(b, name, index);
  });

  return aPriority - bPriority;
};

// DEV
// export const byPriorities = key => (a, b) => {
//   if (
//     (a[key] || (a.from && a.from[key]) || (a.to && a.to[key])) &&
//     !(b[key] || (b.from && b.from[key]) || (b.to && b.to[key]))
//   ) {
//     return -1;
//   }
//   if (
//     !(a[key] || (a.from && a.from[key]) || (a.to && a.to[key])) &&
//     (b[key] || (b.from && b.from[key]) || (b.to && b.to[key]))
//   ) {
//     return 1;
//   }

//   return 0;
// };

// export const byDirections = (a, b) => {
//   if (a.from && a.to && !(b.from || b.to)) {
//     return -1;
//   }
//   if (!(a.from && a.to) && (b.from || b.to)) {
//     return 1;
//   }

//   return 0;
// };
