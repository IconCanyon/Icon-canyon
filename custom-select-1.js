(function () {

  /* =============================== CSS =============================== */
  const style = document.createElement("style");
  style.textContent = `
    .native-select { display: none !important; }

    .custom-select {
      position: relative !important;
      font-size: 14px !important;
      width: 250px !important;
      font-family: Arial, sans-serif !important;
      user-select: none !important;
      color: #333 !important;
    }
    .custom-select .ripple {
      background: #b3b3b34b !important;
    }

    .custom-select__trigger {
      background: #fff !important;
      border: 1px solid #ccc !important;
      padding: 10px 14px !important;
      cursor: pointer !important;
      border-radius: 6px !important;
      display: flex !important;
      justify-content: space-between !important;
      align-items: center !important;
    }

    .custom-select__trigger:focus {
      outline: none !important;
      border-color: #4a90e2 !important;
    }

    .custom-select__arrow {
      transition: transform 0.3s !important;
      font-size: 12px !important;
    }

    .custom-select__arrow svg {
      height: 18px !important;
      display: flex !important;
    }

    .custom-select.open .custom-select__arrow {
      transform: rotate(180deg) !important;
    }

    .custom-options {
      position: absolute !important;
      top: 100% !important;
      left: 0 !important;
      right: 0 !important;
      overflow: hidden !important;
      background: #fff !important;
      border: 1px solid #ccc !important;
      border-radius: 6px !important;
      margin-top: 4px !important;
      display: none !important;
      z-index: 9999 !important;
      min-height: 120px !important;
      box-shadow: 0 3px 10px 2px #454b5b3b !important;
    }
    .custom-options::after {
      position: absolute !important;
      content: 'Option not found...';
      top: 60px !important;
      left: 10px !important;
      opacity: .6 !important;
    }

    .custom-options.top {
      top: auto !important;
      bottom: 100% !important;
      margin-top: 0 !important;
      margin-bottom: 4px !important;
    }

    .custom-select.open .custom-options {
      display: block !important;
    }

    .custom-search-container {
      position: sticky !important;
      top: 0 !important;
      z-index: 5 !important;
      padding: 2px 2px !important;
      background: #f9f9f9 !important;
      border-bottom: 1px solid #ddd !important;
      display: flex !important;
      flex-direction: column !important;
    }

    .custom-search {
      padding: 10px 14px !important;
      outline-color: #0077ff !important;
      margin: 4px !important;
      border: 1px solid #ccc !important;
      border-radius: 4px !important;
      flex: 1 !important;
      box-sizing: border-box !important;
      background: #fff !important;
    }
    .custom-search:hover {
      border: 1px solid #afafafff !important;
    }

    .custom-options-list {
      position: relative !important;
      z-index: 10 !important;
      max-height: 360px !important;
      overflow-y: auto !important;
      background: white !important;
    }

    .custom-option {
      padding: 14px 14px !important;
      cursor: pointer !important;
      display: flex;
      align-items: center !important;
    }

    .custom-option:hover,
    .custom-option.active {
      background: #f0f0f0 !important;
    }

    .custom-option.active {
      font-weight: 600 !important;
    //   box-shadow: 4px 0px 0px #006fff inset !important;
    }

    .custom-option.active::before {
      position: absolute !important;
      content: '' !important;
      left: 4px !important;
      width: 4px !important;
      border-radius: 5px !important;
      height: 25px !important;
      background-color: #006fff !important;
    }
    

    .custom-options ::-webkit-scrollbar {
      width: 8px !important;
      height: 8px !important;
    }

    .custom-options ::-webkit-scrollbar-track {
      background: #f1f1f1 !important;
    }

    .custom-options ::-webkit-scrollbar-thumb {
      background: #bdc3c7 !important;
      border-radius: 4px !important;
    }

    .custom-options ::-webkit-scrollbar-thumb:hover {
      background: #95a5a6 !important;
    }
  `;
  document.head.appendChild(style);

  /* =============================== JS =============================== */
  document.querySelectorAll("select").forEach(select => {
    if (select.dataset.customized) return;
    select.dataset.customized = "true";
    select.classList.add("native-select");

    const wrapper = document.createElement("div");
    wrapper.className = "custom-select";

    const trigger = document.createElement("div");
    trigger.className = "custom-select__trigger Wave-cloud";
    trigger.tabIndex = 0;

    const label = document.createElement("span");

    const arrow = document.createElement("span");
    arrow.className = "custom-select__arrow";
    arrow.innerHTML = '<svg xmlns="http://www.w3.org/2000/svg" viewBox="0 0 512 512"><path fill="none" stroke="currentColor" stroke-linecap="round" stroke-linejoin="round" stroke-width="48" d="M112 184l144 144 144-144"/></svg>';

    trigger.append(label, arrow);

    const options = document.createElement("div");
    options.className = "custom-options";

    wrapper.append(trigger, options);
    select.after(wrapper);

    function refreshCustomSelect() {
      options.innerHTML = "";
      label.textContent = select.options[select.selectedIndex]?.text || "اختر";

      let searchContainer = null;
      let searchInput = null;

      // إنشاء قائمة قابلة للتمرير
      const listWrapper = document.createElement("div");
      listWrapper.className = "custom-options-list";

      if (select.options.length > 15) {
        searchContainer = document.createElement("div");
        searchContainer.className = "custom-search-container";

        searchInput = document.createElement("input");
        searchInput.type = "text";
        searchInput.className = "custom-search";
        searchInput.placeholder = "Search...";

        searchInput.addEventListener("input", () => {
          const filter = searchInput.value.toLowerCase();
          listWrapper.querySelectorAll(".custom-option").forEach(opt => {
            opt.style.display = opt.textContent.toLowerCase().includes(filter) ? "" : "none";
          });
        });

        searchContainer.appendChild(searchInput);
        options.appendChild(searchContainer); // البحث خارج الديف القابل للتمرير
      }

      [...select.options].forEach((opt, index) => {
        const option = document.createElement("div");
        option.className = "custom-option Wave-cloud";
        option.textContent = opt.text;
        option.dataset.value = opt.value;

        if (index === select.selectedIndex) option.classList.add("active");

        option.addEventListener("click", () => {
          label.textContent = opt.text;
          select.value = opt.value;
          select.dispatchEvent(new Event("change"));

          listWrapper.querySelectorAll(".custom-option").forEach(o => o.classList.remove("active"));
          option.classList.add("active");

          wrapper.classList.remove("open");
        });

        listWrapper.appendChild(option);
      });

      options.appendChild(listWrapper);
    }

    refreshCustomSelect();

    function adjustDropdownPosition() {
      options.classList.remove("top");

      const rect = trigger.getBoundingClientRect();
      const dropdownHeight = options.scrollHeight;
      const spaceBelow = window.innerHeight - rect.bottom;
      const spaceAbove = rect.top;

      if (spaceBelow < dropdownHeight && spaceAbove > dropdownHeight) {
        options.classList.add("top");
      }
    }

    trigger.addEventListener("click", () => {
      const isOpen = wrapper.classList.toggle("open");
      if (isOpen) {
        adjustDropdownPosition();
        const activeOption = options.querySelector(".custom-option.active");
        if (activeOption) {
          activeOption.scrollIntoView({ behavior: "smooth", block: "nearest" });
        }
      }
    });

    function closeDropdown() { wrapper.classList.remove("open"); }
    document.addEventListener("mousedown", e => { if (!wrapper.contains(e.target)) closeDropdown(); });
    window.addEventListener("resize", closeDropdown);
    document.addEventListener("contextmenu", closeDropdown);

    trigger.addEventListener("keydown", e => {
      const active = options.querySelector(".custom-option.active");
      let next;

      if (e.key === "ArrowDown") {
        e.preventDefault();
        next = active?.nextElementSibling || options.querySelector(".custom-option");
      }

      if (e.key === "ArrowUp") {
        e.preventDefault();
        next = active?.previousElementSibling || options.querySelector(".custom-option:last-child");
      }

      if (next) {
        active?.classList.remove("active");
        next.classList.add("active");
        label.textContent = next.textContent;
        select.value = next.dataset.value;
        select.dispatchEvent(new Event("change"));

        next.scrollIntoView({ behavior: "smooth", block: "nearest" });
      }

      if (e.key === "Enter") {
        wrapper.classList.toggle("open");
        adjustDropdownPosition();
      }

      if (e.key === "Escape") {
        wrapper.classList.remove("open");
      }
    });

    const observer = new MutationObserver(() => { refreshCustomSelect(); });
    observer.observe(select, { childList: true, subtree: true });

  });

})();
