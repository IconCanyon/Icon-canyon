(function() {
    // ===========================
    // انتظار تحميل DOM بالكامل
    // ===========================
    function initTooltip() {
        // ===========================
        // إنشاء Tooltip
        // ===========================
        const tooltip = document.createElement('div');
        tooltip.id = 'custom-tooltip';

        // منع الترجمة نهائياً
        tooltip.classList.add('no-translate');
        tooltip.setAttribute('data-no-translate', 'true');

        Object.assign(tooltip.style, {
            position: 'absolute',
            padding: '6px 10px',
            background: '#4b5869',
            boxShadow: '0px 1px 5px #4b586960',
            color: '#fff',
            borderRadius: '4px',
            fontSize: '13px',
            pointerEvents: 'none',
            zIndex: 1000000000000000,
            maxWidth: '250px',
            wordWrap: 'break-word',
            opacity: 0,
            transition: 'opacity 0.2s',
            display: 'none' // إضافة display none في البداية
        });

        // السهم
        const arrow = document.createElement('div');
        arrow.classList.add('no-translate');
        Object.assign(arrow.style, {
            position: 'absolute',
            width: '0',
            height: '0'
        });

        tooltip.appendChild(arrow);
        
        // التأكد من وجود body قبل الإضافة
        if (document.body) {
            document.body.appendChild(tooltip);
        } else {
            // إذا لم يكن body موجوداً، ننتظر حتى يتم تحميله
            document.addEventListener('DOMContentLoaded', function() {
                document.body.appendChild(tooltip);
            });
        }

        let currentElement = null;

        // ===========================
        // ترجمة النص إذا كانت دالة translateText موجودة
        // ===========================
        function translateIfNeeded(text) {
            try {
                if (typeof translateText === "function") {
                    const lang = localStorage.getItem("selectedLang") || "en";
                    return translateText(text, lang);
                }
            } catch(e) {
                console.warn('Translation error:', e);
            }
            return text;
        }

        // ===========================
        // تموضع Tooltip
        // ===========================
        function positionTooltip(e) {
            const el = e.currentTarget || e;
            if (!el || !tooltip || !tooltip.parentNode) return;

            const rect = el.getBoundingClientRect();
            const spacing = 10;
            const margin = 5;

            const scrollX = window.scrollX;
            const scrollY = window.scrollY;

            const tRect = tooltip.getBoundingClientRect();

            let top, left, direction;

            const spaceTop = rect.top;
            const spaceBottom = window.innerHeight - rect.bottom;
            const spaceLeft = rect.left;
            const spaceRight = window.innerWidth - rect.right;

            if (spaceTop >= tRect.height + spacing) {
                direction = 'top';
                top = rect.top + scrollY - tRect.height - spacing;
                left = rect.left + scrollX + rect.width / 2 - tRect.width / 2;
            }
            else if (spaceBottom >= tRect.height + spacing) {
                direction = 'bottom';
                top = rect.bottom + scrollY + spacing;
                left = rect.left + scrollX + rect.width / 2 - tRect.width / 2;
            }
            else if (spaceRight >= tRect.width + spacing) {
                direction = 'right';
                top = rect.top + scrollY + rect.height / 2 - tRect.height / 2;
                left = rect.right + scrollX + spacing;
            }
            else {
                direction = 'left';
                top = rect.top + scrollY + rect.height / 2 - tRect.height / 2;
                left = rect.left + scrollX - tRect.width - spacing;
            }

            left = Math.max(scrollX + margin, Math.min(left, scrollX + window.innerWidth - tRect.width - margin));
            top = Math.max(scrollY + margin, Math.min(top, scrollY + window.innerHeight - tRect.height - margin));

            tooltip.style.top = top + 'px';
            tooltip.style.left = left + 'px';
            tooltip.style.display = 'block';

            // ===========================
            // السهم في منتصف العنصر
            // ===========================
            const arrowSize = 6;
            arrow.style.border = 'none';

            if (direction === 'top') {
                arrow.style.left = (rect.left + rect.width/2 + scrollX - left - arrowSize) + 'px';
                arrow.style.top = tRect.height + 'px';
                arrow.style.borderLeft = arrowSize + 'px solid transparent';
                arrow.style.borderRight = arrowSize + 'px solid transparent';
                arrow.style.borderTop = arrowSize + 'px solid #4b5869';
            }
            else if (direction === 'bottom') {
                arrow.style.left = (rect.left + rect.width/2 + scrollX - left - arrowSize) + 'px';
                arrow.style.top = -arrowSize + 'px';
                arrow.style.borderLeft = arrowSize + 'px solid transparent';
                arrow.style.borderRight = arrowSize + 'px solid transparent';
                arrow.style.borderBottom = arrowSize + 'px solid #4b5869';
            }
            else if (direction === 'right') {
                arrow.style.top = (rect.top + rect.height/2 + scrollY - top - arrowSize) + 'px';
                arrow.style.left = -arrowSize + 'px';
                arrow.style.borderTop = arrowSize + 'px solid transparent';
                arrow.style.borderBottom = arrowSize + 'px solid transparent';
                arrow.style.borderRight = arrowSize + 'px solid #4b5869';
            }
            else if (direction === 'left') {
                arrow.style.top = (rect.top + rect.height/2 + scrollY - top - arrowSize) + 'px';
                arrow.style.left = tRect.width + 'px';
                arrow.style.borderTop = arrowSize + 'px solid transparent';
                arrow.style.borderBottom = arrowSize + 'px solid transparent';
                arrow.style.borderLeft = arrowSize + 'px solid #4b5869';
            }
        }

        // ===========================
        // إظهار Tooltip
        // ===========================
        function showTooltip(e) {
            const el = e.currentTarget;
            if (!el || !tooltip) return;

            let text = el.dataset.title || el.getAttribute('title');
            if (!text) return;

            currentElement = el;

            // ترجمة النص قبل العرض
            text = translateIfNeeded(text);

            // تحديث نص التولتيب
            while (tooltip.firstChild && tooltip.firstChild !== arrow) {
                tooltip.removeChild(tooltip.firstChild);
            }
            tooltip.insertBefore(document.createTextNode(text), arrow);

            // حفظ النص الأصلي
            el.dataset.originalTitle = el.getAttribute('title') || text;

            // إزالة title لمنع الافتراضي
            el.removeAttribute('title');

            tooltip.style.opacity = 1;
            positionTooltip(e);
        }

        // ===========================
        // تحديث عند تغيير title
        // ===========================
        function updateTooltipText(el) {
            if (!el || !tooltip) return;

            let newText = el.getAttribute('title');
            if (!newText) return;

            el.dataset.title = newText;
            el.dataset.originalTitle = newText;

            if (el === currentElement) {
                const translated = translateIfNeeded(newText);
                while (tooltip.firstChild && tooltip.firstChild !== arrow) {
                    tooltip.removeChild(tooltip.firstChild);
                }
                tooltip.insertBefore(document.createTextNode(translated), arrow);
                positionTooltip({ currentTarget: el });
            }

            el.removeAttribute('title');
        }

        // ===========================
        // إخفاء Tooltip
        // ===========================
        function hideTooltip() {
            if (!tooltip) return;
            currentElement = null;
            tooltip.style.opacity = 0;
            tooltip.style.display = 'none';
        }

        // ===========================
        // تفعيل Lazy
        // ===========================
        function enableTooltipLazy(el) {
            if (!el || el.__tooltip_initialized) return;

            el.addEventListener('mouseenter', showTooltip);
            el.addEventListener('mouseleave', hideTooltip);
            el.addEventListener('mousemove', positionTooltip);

            // MutationObserver لتتبع تغييرات title
            try {
                const titleObserver = new MutationObserver(() => updateTooltipText(el));
                titleObserver.observe(el, { attributes: true, attributeFilter: ['title'] });
            } catch(e) {
                console.warn('MutationObserver not supported:', e);
            }

            el.__tooltip_initialized = true;
        }

        // ===========================
        // تهيئة العناصر الموجودة
        // ===========================
        function initializeExistingElements() {
            try {
                document.querySelectorAll('[title], [data-title]').forEach(enableTooltipLazy);
            } catch(e) {
                console.warn('Error initializing elements:', e);
            }
        }

        // ===========================
        // مراقبة العناصر الجديدة
        // ===========================
        function setupObserver() {
            try {
                const observer = new MutationObserver(mutations => {
                    mutations.forEach(mutation => {
                        // التعامل مع العناصر المضافة
                        mutation.addedNodes.forEach(node => {
                            if (node.nodeType !== 1) return;
                            if (node.id === 'custom-tooltip') return;

                            if (node.hasAttribute && (node.hasAttribute('title') || node.hasAttribute('data-title'))) {
                                enableTooltipLazy(node);
                            }

                            if (node.querySelectorAll) {
                                node.querySelectorAll('[title], [data-title]').forEach(enableTooltipLazy);
                            }
                        });

                        // التعامل مع تغييرات attributes
                        if (mutation.type === 'attributes' && mutation.attributeName === 'title') {
                            if (mutation.target.id === 'custom-tooltip') return;
                            updateTooltipText(mutation.target);
                        }
                    });
                });

                observer.observe(document.body, {
                    childList: true,
                    subtree: true,
                    attributes: true,
                    attributeFilter: ['title']
                });
            } catch(e) {
                console.warn('Observer setup error:', e);
            }
        }

        // ===========================
        // بدء التشغيل
        // ===========================
        if (document.readyState === 'loading') {
            document.addEventListener('DOMContentLoaded', function() {
                initializeExistingElements();
                setupObserver();
            });
        } else {
            initializeExistingElements();
            setupObserver();
        }
    }

    // ===========================
    // تشغيل التولتيب
    // ===========================
    if (document.readyState === 'loading') {
        document.addEventListener('DOMContentLoaded', initTooltip);
    } else {
        initTooltip();
    }

})();
