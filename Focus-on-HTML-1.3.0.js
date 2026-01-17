(function enableFocus() {

  function applyTabIndex(root = document) {
    if (!(root instanceof Element || root instanceof Document)) return;

    root.querySelectorAll('span, a, label').forEach(el => {
      if (!el.hasAttribute('tabindex')) {
        el.setAttribute('tabindex', '0');
      }
    });
  }

  function startObserver() {
    applyTabIndex();

    const observer = new MutationObserver(mutations => {
      mutations.forEach(mutation => {
        mutation.addedNodes.forEach(node => {
          if (node.nodeType === 1) {
            if (node.matches('span, a, label') && !node.hasAttribute('tabindex')) {
              node.setAttribute('tabindex', '0');
            }
            applyTabIndex(node);
          }
        });
      });
    });

    observer.observe(document.body, {
      childList: true,
      subtree: true
    });
  }

  // التأكد من جاهزية الـ DOM
  if (document.body) {
    startObserver();
  } else {
    document.addEventListener('DOMContentLoaded', startObserver);
  }

})();

// Usage Method
// You can now add focus to any HTML element
// by placing it inside ('span, a, label').

