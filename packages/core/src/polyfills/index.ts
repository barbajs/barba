// Element.prototype.matches polyfill
// https://developer.mozilla.org/en-US/docs/Web/API/Element/matches#Polyfill
if (!Element.prototype.matches) {
  Element.prototype.matches =
    (Element as any).prototype.msMatchesSelector ||
    Element.prototype.webkitMatchesSelector;
}

// Element.prototype.closest polyfill
// https://developer.mozilla.org/en-US/docs/Web/API/Element/closest#Polyfill
if (!Element.prototype.closest) {
  Element.prototype.closest = function closest(s: string) {
    let el = this;

    do {
      if (el.matches(s)) {
        return el;
      }

      el = (el.parentElement || el.parentNode) as Element;
    } while (el !== null && el.nodeType === 1);

    return null;
  };
}
