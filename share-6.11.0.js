(function () {
  "use strict";

  // ===================== Providers =====================
  const providers = {
    whatsapp: d => {
      if (!d.phone) { alert("يرجى إضافة رقم واتساب في Share.save()"); return "https://wa.me/"; }
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

  function save(data){ localStorage.setItem(KEY, JSON.stringify(data)); }
  function load(){ return JSON.parse(localStorage.getItem(KEY))||{}; }

  function shareMultiple(sites, customText){
    const data = load();
    if(customText) data.customText = customText;
    sites.forEach(site=>{
      const fn = providers[site.toLowerCase()];
      if(fn) window.open(fn(data), "_blank");
    });
  }

  // ===================== Get Allowed Sites =====================
  function getAllowedSites() {
    const allowedSites = new Set();
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
    const allowedSites = getAllowedSites();
    const allProviderKeys = Object.keys(providers);

    const overlay = document.createElement("div");
    Object.assign(overlay.style, {
      position:"fixed", top:0, left:0, width:"100%", bottom: "0",
      backgroundColor:"rgba(0,0,0,0)", display:"flex",
      justifyContent:"center", alignItems:"flex-start", zIndex:1000000,
      transition:"background-color 0.3s ease",
      overflowY: "auto",
      padding: "16px 0"
    });

    const box = document.createElement("div");
    Object.assign(box.style,{
      backgroundColor:"#fff", padding:"20px", borderRadius:"10px", width:"320px",
      boxShadow:"0 5px 15px rgba(0,0,0,0.3)", textAlign:"center",
      position:"relative", transform:"scale(0.5)", opacity:0,
      transition:"all 0.3s ease", marginTop:"100px",
      userSelect: "none",
      margin: "auto 0"
    });

    // textarea للرسالة
    const textarea = document.createElement("textarea");
    textarea.placeholder="اكتب رسالتك هنا...";
    textarea.value = initialText; // وضع النص المخصص من textname
    Object.assign(textarea.style,{
      width:"100%", height:"80px", marginBottom:"10px", padding:"10px",
      fontSize:"14px", resize:"none", border:"solid 1px #ccc",
      borderRadius:"5px", fontFamily:"'Cairo', sans-serif",
      lineHeight:1.4, outlineColor:"#3382ff"
    });
    box.appendChild(textarea);

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

    const checkContainer = document.createElement("div");
    Object.assign(checkContainer.style, {
      textAlign: "left", maxHeight: "240px", overflowY: "auto",
      scrollbarWidth: "none", marginBottom: "10px", display: "flex",
      flexWrap: "wrap", gap: "2px"
    });

    // عرض جميع الخيارات المتاحة في السكريبت
    allProviderKeys.forEach(site => {
      const isAllowed = allowedSites.includes(site);
      const label = document.createElement("label");
      label.className = "Wave-cloud";
      
      Object.assign(label.style, {
        position: "relative", display: "grid", justifyContent: "center",
        width: "92px", padding: "11px 0px", textAlign: "center",
        paddingTop: "15px",
        borderRadius: "16px",
        opacity: isAllowed ? "1" : ".5", // شفافية 0.5 إذا لم يكن مضافاً بالموقع
        pointerEvents: isAllowed ? "auto" : "none", // منع النقر إذا لم يكن مضافاً
        cursor: isAllowed ? "pointer" : "default"
      });

      const img = document.createElement("img");
      img.src = siteIcons[site] || "";
      img.alt = site;
      img.style.height = "24px";
      img.style.margin = "auto";

      const radio = document.createElement("input");
      radio.type = "radio";          
      radio.name = "shareSite";      
      radio.value = site;
      radio.style.margin="2px";
      radio.style.height="18px";
      radio.style.width="18px";
      radio.style.position="absolute";
      radio.checked = (site === selectedSite && isAllowed);
      if (!isAllowed) radio.disabled = true;

      const span = document.createElement("span");
      span.textContent = site.charAt(0).toUpperCase() + site.slice(1);
      span.style.fontSize = "12px";
      span.style.position = "relative";
      span.style.bottom = "-8px";

      label.appendChild(img);
      label.appendChild(radio);
      label.appendChild(span);
      checkContainer.appendChild(label);
    });

    box.appendChild(checkContainer);

    const sendBtn = document.createElement("button");
    sendBtn.textContent="إرسال";
    Object.assign(sendBtn.style,{
      marginLeft:"10px", padding:"5px 18px", cursor:"pointer",
      borderRadius:"25px", border:"none", color:"white",
      background:"#3880ff", fontFamily:"'Cairo', sans-serif"
    });
    
    sendBtn.addEventListener("click", ()=>{
      const customText = textarea.value.trim();
      const selectedRadio = checkContainer.querySelector("input:checked");
      if(!selectedRadio){
        alert("يرجى اختيار منصة مفعّلة للمشاركة");
        return;
      }
      shareMultiple([selectedRadio.value], customText);
      hidePopup();
    });

    const closeBtn = document.createElement("button");
    closeBtn.textContent="إغلاق";
    Object.assign(closeBtn.style,{
      padding:"5px 18px", cursor:"pointer",
      borderRadius:"25px", border:"none", color:"rgb(0, 0, 0)",
      background:"#dee7ff", fontFamily:"'Cairo', sans-serif"
    });
    closeBtn.addEventListener("click", hidePopup);

    const btnContainer = document.createElement("div");
    btnContainer.style.marginTop = "10px";
    btnContainer.appendChild(sendBtn);
    btnContainer.appendChild(closeBtn);
    box.appendChild(btnContainer);

    overlay.appendChild(box);

    function showPopup(){
      document.body.appendChild(overlay);
      requestAnimationFrame(()=>{
        overlay.style.backgroundColor="rgba(0,0,0,0.5)";
        box.style.transform="scale(1)";
        box.style.opacity=1;
        textarea.focus();
      });
    }

    function hidePopup(){
      overlay.style.backgroundColor="rgba(0,0,0,0)";
      box.style.transform="scale(0.5)";
      box.style.opacity=0;
      setTimeout(()=> { overlay.remove(); }, 300);
    }

    overlay.addEventListener("click",(e)=>{
      if(e.target===overlay) hidePopup();
    });

    showPopup();
  }

  // مستمع الأحداث المحدث
  document.addEventListener("click", e=>{
    const el = e.target.closest('[name^="share:"]');
    if(!el) return;
    
    const site = el.name.split(":")[1];
    // جلب النص المخصص من سمة textname إذا وجدت
    const customText = el.getAttribute("textname") || ""; 
    
    createPopup(site, customText);
  });

  window.Share={save, shareMultiple};

})();
