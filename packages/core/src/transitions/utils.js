/**
 * Calculate transition priority based on:
 * - rule "position" (index) give tens, hundreds, thousands, …
 * - from/to properties give units (0, 1 or 2)
 *
 * @param {object} item transition
 * @param {string} name rule name
 * @param {number} index rule index
 * @returns {number} priority
 * @private
 */
function calculatePriority(item, name, index) {
  let priority = 0;

  if (
    item[name] ||
    (item.from && item.from[name]) ||
    (item.to && item.to[name])
  ) {
    priority += Math.pow(10, index);

    if (item.from && item.from[name]) {
      priority += 1;
    }
    if (item.to && item.to[name]) {
      priority += 2;
    }
  }

  return priority;
}

export const addPriority = rules => t => {
  t.priority = 0;
  let priority = 0;

  rules.forEach((rule, i) => {
    const { name } = rule;
    const index = i + 1;

    priority += calculatePriority(t, name, index);
  });

  t.priority = priority;

  return t;
};
