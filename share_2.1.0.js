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
    email: d => {
      const subject = "Shared File & Message";
      const body = encodeURIComponent((d.customText || d.text || "") + (d.url ? "\n\n" + d.url : ""));
      return `mailto:${d.email||""}?subject=${encodeURIComponent(subject)}&body=${body}`;
    },
    sms: d => {
      const msg = encodeURIComponent(d.customText || d.text || d.url || "");
      return `sms:?&body=${msg}`;
    },
    messenger: d => `https://www.facebook.com/dialog/send?link=${encodeURIComponent(d.url||"")}&app_id=YOUR_APP_ID&redirect_uri=${encodeURIComponent(d.url||"")}`,
    reddit: d => `https://www.reddit.com/submit?url=${encodeURIComponent(d.url||"")}&title=${encodeURIComponent(d.customText||d.text||"")}`,
    pinterest: d => `https://pinterest.com/pin/create/button/?url=${encodeURIComponent(d.url||"")}&description=${encodeURIComponent(d.customText||d.text||"")}`,
    
    // المواقع الإضافية الخمسة
    instagram: d => {
      const text = encodeURIComponent(d.customText || d.text || "");
      const url = encodeURIComponent(d.url || "");
      const fullText = url ? `${text} ${url}`.trim() : text;
      return `https://www.instagram.com/?text=${fullText}`;
    },
    tumblr: d => `https://www.tumblr.com/widgets/share/tool?canonicalUrl=${encodeURIComponent(d.url||"")}&title=${encodeURIComponent(d.customText||d.text||"")}`,
    skype: d => `https://web.skype.com/share?url=${encodeURIComponent(d.url||"")}&text=${encodeURIComponent(d.customText||d.text||"")}`,
    viber: d => `viber://forward?text=${encodeURIComponent((d.customText||d.text||"") + " " + (d.url||""))}`,
    wechat: d => {
      const text = encodeURIComponent((d.customText || d.text || "") + " " + (d.url || ""));
      return `weixin://dl/moments?text=${text}`;
    }
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

  function shareMultiple(sites, customText, fileData = null){
    const data = loadShareData(); // استخدام بيانات المشاركة فقط
    if(customText) data.customText = customText;
    
    sites.forEach(site => {
      const fn = providers[site.toLowerCase()];
      if(fn) {
        const shareUrl = fn(data);
        
        // إذا كان الملف مرفقًا وبريد إلكتروني، استخدام طريقة مختلفة
        if (site === 'email' && fileData) {
          shareWithFile(shareUrl, fileData, customText || data.text || "");
        } else {
          window.open(shareUrl, "_blank");
        }
      }
    });
  }

  // دالة لمشاركة الملف عبر البريد الإلكتروني
  function shareWithFile(emailUrl, fileData, text) {
    // إنشاء رابط بريد إلكتروني مع النص
    const emailBody = encodeURIComponent(text + "\n\n" + "File attached: " + fileData.name);
    const mailtoLink = emailUrl.split('?')[0] + `?subject=Shared File & Message&body=${emailBody}`;
    
    // فتح البريد الإلكتروني
    window.open(mailtoLink, "_blank");
    
    // ملاحظة: لا يمكن رفع الملفات تلقائيًا عبر mailto:
    // المستخدم سيحتاج إلى رفع الملف يدويًا في عميل البريد
    alert("ملاحظة: سيتم فتح عميل البريد الإلكتروني. يرجى رفع الملف يدويًا في نافذة البريد الجديدة.");
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

    // متغير لتخزين بيانات الملف المرفق
    let attachedFile = null;
    let attachedFileName = "";

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
          width: 340px !important;
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
        
        .textarea-container {
          position: relative;
          margin-bottom: 18px !important;
        }
        
        .share-textarea {
          display: block;
          width: 100% !important;
          height: 100px !important;
          padding: 12px !important;
          font-size: 14px !important;
          resize: none !important;
          border: solid 1px #3642531f !important;
          border-radius: 8px !important;
          font-family: 'Cairo', sans-serif;
          line-height: 1.4 !important;
          outline-color: #3382ff !important;
          direction: rtl !important;
          text-align: right !important;
          background: #5e6e800f;
        }
        
        .share-textarea::placeholder {
          color: #999 !important;
          direction: ${textDirection} !important;
          text-align: ${textAlign} !important;
        }
        
        .file-attachment-area {
          position: absolute;
          left: 8px;
          bottom: 8px;
          display: flex;
          align-items: center;
          gap: 8px;
          direction: ltr;
        }
        
        .file-attach-btn {
          display: flex;
          align-items: center;
          justify-content: center;
          width: 36px;
          height: 36px;
          border-radius: 50%;
          background-color: #ffffff;
          border: 1px solid #e0e0e0;
          transition: all 0.2s ease;
        }
        
        .file-attach-btn:hover {
          background-color: #eaf1ff;
          border-color: #3382ff;
        }
        
        .file-attach-btn:hover svg {
          color: rgb(2, 120, 255);
        }
        
        .file-attach-btn svg {
          height: 20px;
          width: 20px;
          color: #666;
          transition: color 0.2s ease;
        }
        
        .file-name-display {
          font-size: 12px;
          color: #666;
          max-width: 150px;
          overflow: hidden;
          text-overflow: ellipsis;
          white-space: nowrap;
          padding: 4px 8px;
          background: #f5f5f5;
          border-radius: 12px;
          display: none;
        }
        
        .remove-file-btn {
          background: none;
          border: none;
          color: #ff4444;
          font-size: 14px;
          cursor: pointer;
          padding: 2px 6px;
          display: none;
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
          padding: 8px 24px !important;
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
          padding: 8px 24px !important;
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
        
        .file-info {
          font-size: 11px;
          color: #666;
          margin-top: 5px;
          text-align: center;
          direction: ${textDirection} !important;
        }
        
        @keyframes fadeIn {
          from {
            opacity: 0;
            transform: scale(0);
          }
          to {
            opacity: 1;
            transform: scale(1);
          }
        }
        
        .site-label {
          animation: fadeIn 0.3s ease backwards;
        }
      </style>
      
      <div class="share-box">
        <div class="textarea-container">
          <textarea class="share-textarea" name="textarea" placeholder="${placeholderText}">${initialText}</textarea>
          <div class="file-attachment-area">
            <label for="sharefile" class="file-attach-btn Wave-center">
              <svg xmlns="http://www.w3.org/2000/svg" class="ionicon" viewBox="0 0 512 512">
                <path d="M448 256c0-106-86-192-192-192S64 150 64 256s86 192 192 192 192-86 192-192z" fill="none" stroke="currentColor" stroke-miterlimit="10" stroke-width="32"/>
                <path fill="none" stroke="currentColor" stroke-linecap="round" stroke-linejoin="round" stroke-width="32" d="M256 176v160M336 256H176"/>
              </svg>
            </label>
            <span class="file-name-display" id="fileNameDisplay"></span>
            <button class="remove-file-btn" id="removeFileBtn">×</button>
            <input type="file" id="sharefile" style="display: none;">
          </div>
        </div>
        <!-- <div class="file-info">${direction === "left" ? "Select a file to share with your message" : "اختر ملفاً لمشاركته مع رسالتك"}</div> -->

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
              pinterest: "https://github.com/IconCanyon/Icon-canyon/blob/main/icon/pinterest.png?raw=true",
              instagram: "https://github.com/IconCanyon/Icon-canyon/blob/main/icon/Instagram.webp?raw=true",
              tumblr: "https://raw.githubusercontent.com/IconCanyon/Icon-canyon/505dd48ae8a71127f0b5551e6fc9fea903bed347/icon/tumblr.svg",
              skype: "https://github.com/IconCanyon/Icon-canyon/blob/main/icon/skype.png?raw=true",
              viber: "https://github.com/IconCanyon/Icon-canyon/blob/main/icon/viber.webp?raw=true",
              wechat: "https://github.com/IconCanyon/Icon-canyon/blob/main/icon/wechat.webp?raw=true"
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

    // دالة تحديث عرض اسم الملف
    function updateFileNameDisplay() {
      const fileNameDisplay = overlay.querySelector("#fileNameDisplay");
      const removeFileBtn = overlay.querySelector("#removeFileBtn");
      
      if (attachedFileName) {
        fileNameDisplay.textContent = attachedFileName;
        fileNameDisplay.style.display = "inline-block";
        removeFileBtn.style.display = "inline-block";
      } else {
        fileNameDisplay.style.display = "none";
        removeFileBtn.style.display = "none";
      }
    }

    // إضافة event listeners للأزرار والعناصر
    const sendBtn = overlay.querySelector(".share-btn");
    const closeBtn = overlay.querySelector(".close-btn");
    const fileInput = overlay.querySelector("#sharefile");
    const removeFileBtn = overlay.querySelector("#removeFileBtn");
    
    // حدث اختيار ملف
    fileInput.addEventListener("change", function(e) {
      const file = e.target.files[0];
      if (file) {
        // التحقق من حجم الملف (حد أقصى 10MB)
        const maxSize = 10 * 1024 * 1024; // 10MB
        if (file.size > maxSize) {
          alert(direction === "left" ? "File size is too large. Maximum size is 10MB." : "حجم الملف كبير جداً. الحد الأقصى هو 10 ميجابايت.");
          fileInput.value = "";
          return;
        }
        
        attachedFile = file;
        attachedFileName = file.name;
        updateFileNameDisplay();
        
        // إضافة نص حول الملف في خانة النص إذا كانت فارغة
        const textarea = overlay.querySelector(".share-textarea");
        if (!textarea.value.trim()) {
          const fileMessage = direction === "left" 
            ? `Sharing file: ${file.name}\n\n` 
            : `مشاركة الملف: ${file.name}\n\n`;
          textarea.value = fileMessage;
        }
      }
    });
    
    // حدث إزالة الملف
    removeFileBtn.addEventListener("click", function() {
      attachedFile = null;
      attachedFileName = "";
      fileInput.value = "";
      updateFileNameDisplay();
    });
    
    sendBtn.addEventListener("click", () => {
      const customText = overlay.querySelector(".share-textarea").value.trim();
      const selectedRadio = overlay.querySelector(".site-radio:checked");
      if(!selectedRadio){
        alert(direction === "left" ? "Please select an enabled platform to share" : "يرجى اختيار منصة مفعّلة للمشاركة");
        return;
      }
      
      const selectedSite = selectedRadio.value;
      
      // تحذير إذا كان الملف مرفقاً لكن المنصة ليست بريد إلكتروني
      if (attachedFile && selectedSite !== 'email') {
        const confirmMsg = direction === "left" 
          ? "Files can only be shared via Email. The file will be ignored for other platforms. Continue?"
          : "يمكن مشاركة الملفات عبر البريد الإلكتروني فقط. سيتم تجاهل الملف للمنصات الأخرى. المتابعة؟";
        
        if (!confirm(confirmMsg)) {
          return;
        }
      }
      
      shareMultiple([selectedSite], customText, attachedFile);
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
    updateFileNameDisplay(); // تهيئة عرض اسم الملف
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
