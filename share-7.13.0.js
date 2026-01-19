
// Example of usage:
// Share.save({
//   phone: "phone",
//   email: "user@gmail.com",
//   url: "https://chat-rp1c.vercel.app/",
//   text: "Hello Eyad",

//   onAll: "", // Enable all sharing options by writing "on"
//   offAll: "", // Remove unsupported options by writing "on"
    
//   // Customizable content
//   shareBtnText: "Send",
//   closeBtnText: "Close",
//   direction: "left", // ← Direction from left to right
//   placeholder: "Write your message here..." //Write your message here...
// });


(function () {
  "use strict";

  // ===================== Providers =====================
  const providers = {
    whatsapp: d => {
      if (!d.phone) { 
        alert("يرجى إضافة رقم واتساب في Share.save()"); 
        return "https://wa.me/"; 
      }
      const msg = encodeURIComponent(d.customText || d.text || d.url || "");
      return `https://wa.me/${d.phone}?text=${msg}`;
    },
    telegram: d => `https://t.me/share/url?url=${encodeURIComponent(d.url||"")}&text=${encodeURIComponent(d.customText||d.text||"")}`,
    facebook: d => `https://www.facebook.com/sharer/sharer.php?u=${encodeURIComponent(d.url||"")}`,
    x: d => `https://twitter.com/intent/tweet?text=${encodeURIComponent(d.customText||d.text||"")}&url=${encodeURIComponent(d.url||"")}`,
    linkedin: d => `https://www.linkedin.com/sharing/share-offsite/?url=${encodeURIComponent(d.url||"")}`,
    email: d => `mailto:${d.email||""}?subject=Share&body=${encodeURIComponent(d.customText||d.text||d.url||"")}`,
    sms: d => {
      const msg = encodeURIComponent(d.customText || d.text || d.url || "");
      return `sms:?&body=${msg}`;
    },
    messenger: d => `https://www.facebook.com/dialog/send?link=${encodeURIComponent(d.url||"")}&app_id=YOUR_APP_ID&redirect_uri=${encodeURIComponent(d.url||"")}`,
    reddit: d => `https://www.reddit.com/submit?url=${encodeURIComponent(d.url||"")}&title=${encodeURIComponent(d.customText||d.text||"")}`,
    pinterest: d => `https://pinterest.com/pin/create/button/?url=${encodeURIComponent(d.url||"")}&description=${encodeURIComponent(d.customText||d.text||"")}`
  };

  const KEY = "share_user_data";
  const KEY_CONFIG = "share_config_data"; // مفتاح منفصل للإعدادات

  function save(data){ 
    // فصل البيانات: البيانات الأساسية للإرسال
    const shareData = {
      phone: data.phone,
      email: data.email,
      url: data.url,
      text: data.text
    };
    
    // البيانات الإضافية للإعدادات
    const configData = {
      onAll: data.onAll,
      offAll: data.offAll,
      shareBtnText: data.shareBtnText,
      closeBtnText: data.closeBtnText,
      placeholder: data.placeholder,
      direction: data.direction || "rtl" // قيمة افتراضية rtl
    };
    
    // حفظ في مفتاحين مختلفين
    localStorage.setItem(KEY, JSON.stringify(shareData)); 
    localStorage.setItem(KEY_CONFIG, JSON.stringify(configData)); 
  }
  
  function loadShareData(){ 
    return JSON.parse(localStorage.getItem(KEY)) || {}; 
  }
  
  function loadConfigData(){ 
    return JSON.parse(localStorage.getItem(KEY_CONFIG)) || {}; 
  }
  
  function loadAllData() {
    return {
      ...loadShareData(),
      ...loadConfigData()
    };
  }

  function shareMultiple(sites, customText){
    const data = loadShareData(); // استخدام بيانات المشاركة فقط
    if(customText) data.customText = customText;
    sites.forEach(site => {
      const fn = providers[site.toLowerCase()];
      if(fn) window.open(fn(data), "_blank");
    });
  }

  // ===================== Get Allowed Sites =====================
  function getAllowedSites(configData) {
    const allowedSites = new Set();
    
    // إذا كان onAll مفعلًا، نضيف كل المنصات المدعومة
    if (configData.onAll === "on") {
      return Object.keys(providers);
    }
    
    // إذا لم يكن onAll مفعلًا، نجمع من الأزرار في الصفحة
    const shareElements = document.querySelectorAll('[name^="share:"]');
    
    shareElements.forEach(el => {
      const site = el.name.split(":")[1];
      if (site && providers[site.toLowerCase()]) {
        allowedSites.add(site.toLowerCase());
      }
    });
    
    return Array.from(allowedSites);
  }

  // ===================== Create Popup =====================
  function createPopup(selectedSite = null, initialText = ""){
    const configData = loadConfigData();
    const shareData = loadShareData();
    const allowedSites = getAllowedSites(configData);
    const allProviderKeys = Object.keys(providers);
    
    // تحديد المنصات التي سيتم عرضها
    let sitesToShow = allProviderKeys;
    if (configData.offAll === "on") {
      sitesToShow = allowedSites;
    }

    const overlay = document.createElement("div");
    
    // الحصول على النصوص المخصصة من البيانات
    const shareBtnText = configData.shareBtnText || "إرسال";
    const closeBtnText = configData.closeBtnText || "إغلاق";
    const placeholderText = configData.placeholder || "اكتب رسالتك هنا...";
    const direction = configData.direction || "rtl"; // قيمة افتراضية rtl
    
    // تحديد اتجاه الكتابة
    const textDirection = direction === "left" ? "ltr" : "rtl";
    const textAlign = direction === "left" ? "left" : "right";
    
    overlay.innerHTML = `
      <style>
        .share-overlay {
          position: fixed !important;
          top: 0 !important;
          left: 0 !important;
          width: 100% !important;
          height: 100% !important;
          background-color: rgba(0,0,0,0); !important;
          display: flex;
          justify-content: center;
          align-items: flex-start;
          z-index: 1000000 !important;
          transition: background-color 0.3s ease;
          overflow-y: auto !important;
          padding: 16px 0 !important;
        }
        
        .share-box {
          background-color: #fff !important;
          padding: 20px !important;
          border-radius: 10px !important;
          width: 320px !important;
          box-shadow: 0 5px 15px rgba(0,0,0,0.3) !important;
          text-align: center !important;
          position: relative !important;
          transform: scale(0.5);
          opacity: 0;
          transition: all 0.3s ease;
          margin-top: 100px !important;
          user-select: none !important;
          margin-bottom: auto !important;
          margin-top: 50px !important;
        }
        
        .share-textarea {
          width: 100% !important;
          height: 80px !important;
          margin-bottom: 10px !important;
          padding: 10px !important;
          font-size: 14px !important;
          resize: none !important;
          border: solid 1px #ccc !important;
          border-radius: 5px !important;
          font-family: 'Cairo', sans-serif;
          line-height: 1.4 !important;
          outline-color: #3382ff !important;
          direction: ${textDirection} !important;
          text-align: ${textAlign} !important;
        }
        
        .share-textarea::placeholder {
          color: #999 !important;
          direction: ${textDirection} !important;
          text-align: ${textAlign} !important;
        }
        
        .sites-container {
          text-align: left !important;
          max-height: 240px !important;
          overflow-y: auto !important;
          scrollbar-width: none !important;
          margin-bottom: 10px !important;
          display: flex;
          flex-wrap: wrap !important;
          gap: 2px !important;
        }
        
        .sites-container::-webkit-scrollbar {
          display: none;
        }
        
        .site-label {
          position: relative !important;
          display: grid;
          justify-content: center !important;
          width: 92px !important;
          padding: 11px 0px !important;
          padding-top: 15px !important;
          text-align: center !important;
          border-radius: 16px !important;
          transition: all 0.2s ease;
          border: 1px solid transparent !important;
        }
        
        .site-label:hover {
          background-color: #f5f5f5 !important;
        }
        
        .site-label.disabled {
          opacity: 0.5 !important;
          pointer-events: none !important;
          cursor: default !important;
        }
        
        .site-radio {
          margin: 2px !important;
          height: 18px !important;
          width: 18px !important;
          position: absolute !important;
          right: 0 !important;
        }
        
        .site-icon {
          height: 24px !important;
          margin: auto !important;
        }
        
        .site-name {
          font-size: 12px !important;
          position: relative !important;
          bottom: -8px !important;
          color: #333 !important;
          font-family: 'Cairo', sans-serif;
        }
        
        .buttons-container {
          margin-top: 10px !important;
          display: flex;
          gap: 10px !important;
          justify-content: center !important;
          direction: ${textDirection} !important;
        }
        
        .buttons-container .ripple {
          background: #ffffff2d !important;
        }
        
        .share-btn {
          padding: 5px 18px !important;
          border-radius: 25px !important;
          border: none !important;
          color: white !important;
          background: #3880ff;
          font-family: 'Cairo', sans-serif;
          font-weight: 600 !important;
          transition: all 0.2s ease;
          cursor: pointer;
          direction: ${textDirection} !important;
        }
        
        .share-btn:hover {
          background: #2c6ee0 !important;
        }
        
        .close-btn {
          padding: 5px 18px !important;
          border-radius: 25px !important;
          border: none !important;
          color: rgb(0, 0, 0) !important;
          background: #dee7ff !important;
          font-family: 'Cairo', sans-serif;
          font-weight: 600;
          transition: all 0.2s ease;
          cursor: pointer;
          direction: ${textDirection} !important;
        }
        
        .close-btn:hover {
          background: #c8d6ff !important;
        }
        
        @keyframes fadeIn {
          from {
            opacity: 0;
            transform: translateY(-20px);
          }
          to {
            opacity: 1;
            transform: translateY(0);
          }
        }
        
        .site-label {
          animation: fadeIn 0.3s ease backwards;
        }
      </style>
      
      <div class="share-box">
        <textarea class="share-textarea" name="textarea" placeholder="${placeholderText}">${initialText}</textarea>
        
        <div class="sites-container">
          ${sitesToShow.map(site => {
            const isAllowed = allowedSites.includes(site);
            const siteIcons = {
              whatsapp: "https://raw.githubusercontent.com/IconCanyon/Icon-canyon/d897f7ddec753f3c0a2e67d7ef0b6cd31ec780b8/icon/whatsapp.svg",
              telegram: "https://github.com/IconCanyon/Icon-canyon/blob/main/icon/Telegram.png?raw=true",
              facebook: "https://github.com/IconCanyon/Icon-canyon/blob/main/icon/Facebook.png?raw=true",
              x: "https://raw.githubusercontent.com/IconCanyon/Icon-canyon/d897f7ddec753f3c0a2e67d7ef0b6cd31ec780b8/icon/X.svg",
              linkedin: "https://github.com/IconCanyon/Icon-canyon/blob/main/icon/LinkedIn.png?raw=true",
              email: "https://github.com/IconCanyon/Icon-canyon/blob/main/icon/gmail.png?raw=true",
              sms: "https://github.com/IconCanyon/Icon-canyon/blob/main/icon/sms.webp?raw=true",
              messenger: "https://github.com/IconCanyon/Icon-canyon/blob/main/icon/Messenger.png?raw=true",
              reddit: "https://github.com/IconCanyon/Icon-canyon/blob/main/icon/reddit.png?raw=true",
              pinterest: "https://github.com/IconCanyon/Icon-canyon/blob/main/icon/pinterest.png?raw=true"
            };
            
            return `
              <label for="" class="site-label Wave-cloud ${isAllowed ? '' : 'disabled'}" style="animation-delay: ${sitesToShow.indexOf(site) * 0.05}s">
                ${isAllowed ? `<input type="radio" name="shareSite" value="${site}" class="site-radio" ${site === selectedSite ? 'checked' : ''}>` : ''}
                <img src="${siteIcons[site] || ''}" alt="${site}" class="site-icon">
                <span class="site-name">${site.charAt(0).toUpperCase() + site.slice(1)}</span>
              </label>
            `;
          }).join('')}
        </div>
        
        <div class="buttons-container Wave-all">
          <button class="share-btn">${shareBtnText}</button>
          <button class="close-btn">${closeBtnText}</button>
        </div>
      </div>
    `;

    overlay.className = "share-overlay";

    function showPopup(){
      document.body.appendChild(overlay);
      requestAnimationFrame(() => {
        overlay.style.backgroundColor = "rgba(0,0,0,0.5)";
        const box = overlay.querySelector(".share-box");
        box.style.transform = "scale(1)";
        box.style.opacity = 1;
        
        const textarea = overlay.querySelector(".share-textarea");
        // تم إزالة التركيز التلقائي
        // textarea.focus(); 
        
        // تعيين اتجاه النص حسب الإعدادات
        textarea.style.direction = textDirection;
        textarea.style.textAlign = textAlign;
      });
    }

    function hidePopup(){
      overlay.style.backgroundColor = "rgba(0,0,0,0)";
      const box = overlay.querySelector(".share-box");
      box.style.transform = "scale(0.5)";
      box.style.opacity = 0;
      setTimeout(() => { 
        overlay.remove(); 
        // إزالة مستمع حدث Esc بعد إغلاق النافذة
        document.removeEventListener("keydown", escKeyHandler);
      }, 300);
    }

    // إضافة event listeners للأزرار
    const sendBtn = overlay.querySelector(".share-btn");
    const closeBtn = overlay.querySelector(".close-btn");
    
    sendBtn.addEventListener("click", () => {
      const customText = overlay.querySelector(".share-textarea").value.trim();
      const selectedRadio = overlay.querySelector(".site-radio:checked");
      if(!selectedRadio){
        alert("يرجى اختيار منصة مفعّلة للمشاركة");
        return;
      }
      shareMultiple([selectedRadio.value], customText);
      hidePopup();
    });
    
    closeBtn.addEventListener("click", hidePopup);

    overlay.addEventListener("click", (e) => {
      if(e.target === overlay) hidePopup();
    });

    // إضافة event listeners لـ labels
    const labels = overlay.querySelectorAll(".site-label:not(.disabled)");
    labels.forEach(label => {
      label.addEventListener("click", (e) => {
        if (e.target.type !== "radio") {
          const radio = label.querySelector(".site-radio");
          if (radio) {
            radio.checked = true;
            // إزالة التحديد من الآخرين
            labels.forEach(l => {
              if (l !== label) {
                const otherRadio = l.querySelector(".site-radio");
                if (otherRadio) otherRadio.checked = false;
              }
            });
          }
        }
      });
    });

    // دالة معالجة ضغط مفتاح Esc
    function escKeyHandler(e) {
      if (e.key === "Escape" || e.keyCode === 27) {
        hidePopup();
      }
    }
    
    // إضافة مستمع حدث لزر Esc
    document.addEventListener("keydown", escKeyHandler);

    showPopup();
  }

  // مستمع الأحداث المحدث
  document.addEventListener("click", e => {
    const el = e.target.closest('[name^="share:"]');
    if(!el) return;
    
    const site = el.name.split(":")[1];
    // جلب النص المخصص من سمة textname إذا وجدت
    const shareData = loadShareData();
    const customText = el.getAttribute("textname") || shareData.text || ""; 
    
    createPopup(site, customText);
  });

  window.Share = { save, shareMultiple, loadAllData };
})();

