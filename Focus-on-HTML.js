(function enableFocus() {
  document.querySelectorAll('div, span, a, label').forEach(el => {
    if (!el.hasAttribute('tabindex')) {
      el.setAttribute('tabindex', '0');
    }
  });
})();
