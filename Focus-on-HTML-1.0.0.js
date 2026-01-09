(function enableFocus() {

  function applyTabIndex(root = document) {
    root.querySelectorAll('span, a, label').forEach(el => {
      if (!el.hasAttribute('tabindex')) {
        el.setAttribute('tabindex', '0');
      }
    });
  }

  // تطبيق على العناصر الموجودة حاليًا
  applyTabIndex();

  // مراقبة العناصر التي تُنشأ لاحقًا عبر JS
  const observer = new MutationObserver(mutations => {
    mutations.forEach(mutation => {
      mutation.addedNodes.forEach(node => {
        if (node.nodeType === 1) { // عنصر HTML
          if (node.matches?.('span, a, label')) {
            if (!node.hasAttribute('tabindex')) {
              node.setAttribute('tabindex', '0');
            }
          }

          // فحص العناصر المتفرعة داخله
          applyTabIndex(node);
        }
      });
    });
  });

  observer.observe(document.body, {
    childList: true,
    subtree: true
  });

})();

// Usage Method
// You can now add focus to any HTML element
// by placing it inside ('span, a, label').
