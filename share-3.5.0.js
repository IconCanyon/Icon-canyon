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
    twitter: d => `https://twitter.com/intent/tweet?text=${encodeURIComponent(d.customText||d.text||"")}&url=${encodeURIComponent(d.url||"")}`,
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

  // ===================== Create Popup =====================
  function createPopup(selectedSite = null){
    const overlay = document.createElement("div");
    Object.assign(overlay.style, {
      position:"fixed", top:0, left:0, width:"100%", bottom: "0",
      backgroundColor:"rgba(0,0,0,0)", display:"flex",
      justifyContent:"center", alignItems:"flex-start", zIndex:1000000,
      transition:"background-color 0.3s ease"
    });

    const box = document.createElement("div");
    Object.assign(box.style,{
      backgroundColor:"#fff", padding:"20px", borderRadius:"10px", width:"320px",
      boxShadow:"0 5px 15px rgba(0,0,0,0.3)", textAlign:"center",
      position:"relative", transform:"scale(0.5)", opacity:0,
      transition:"all 0.3s ease", marginTop:"100px",
      userSelect: "none"
    });

    // textarea للرسالة
    const textarea = document.createElement("textarea");
    textarea.placeholder="اكتب رسالتك هنا...";
    Object.assign(textarea.style,{
      width:"100%", height:"80px", marginBottom:"10px", padding:"10px",
      fontSize:"14px", resize:"none", border:"solid 1px #ccc",
      borderRadius:"5px", fontFamily:"'Cairo', sans-serif",
      lineHeight:1, outlineColor:"#3382ff"
    });
    box.appendChild(textarea);

    // إنشاء radio لكل موقع (اختيار واحد فقط)
    const sites = Object.keys(providers);
    const checkContainer = document.createElement("div");
    checkContainer.style.textAlign = "left";
    checkContainer.style.maxHeight = "200px";
    checkContainer.style.overflowY = "auto";
    checkContainer.style.marginBottom = "10px";

    sites.forEach(site=>{
      const label = document.createElement("label");
      label.style.display = "flex";
      label.style.justifyContent = "space-between";
      label.style.alignItems = "center";
      label.style.marginBottom = "5px";

      const radio = document.createElement("input");
      radio.type = "radio";          // تغيير type إلى radio
      radio.name = "shareSite";      // نفس الاسم لكل الخيارات
      radio.value = site;
      radio.style.marginRight="5px";
      radio.style.height="18px";
      radio.style.width="18px";

      // تحديد الموقع الافتراضي
      radio.checked = (site === selectedSite);

      label.appendChild(radio);
      label.appendChild(document.createTextNode(site.charAt(0).toUpperCase() + site.slice(1)));
      checkContainer.appendChild(label);
    });

    box.appendChild(checkContainer);

    // زر الإرسال
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
        alert("يرجى اختيار منصة واحدة للمشاركة");
        return;
      }
      shareMultiple([selectedRadio.value], customText); // تمرير مصفوفة بموقع واحد فقط
      hidePopup();
    });

    // زر الإغلاق
    const closeBtn = document.createElement("button");
    closeBtn.textContent="إغلاق";
    Object.assign(closeBtn.style,{
      padding:"5px 18px", cursor:"pointer",
      borderRadius:"25px", border:"none", color:"#000",
      background:"#bfd6ff", fontFamily:"'Cairo', sans-serif"
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

        // تمرير تلقائي للـ radio المحدد
        if(selectedSite){
          const targetRadio = checkContainer.querySelector(`input[value="${selectedSite}"]`);
          if(targetRadio){
            targetRadio.scrollIntoView({behavior: "smooth", block: "center"});
          }
        }
      });
    }

    function hidePopup(){
      overlay.style.backgroundColor="rgba(0,0,0,0)";
      box.style.transform="scale(0.5)";
      box.style.opacity=0;
      setTimeout(()=> { overlay.remove(); },300);
    }

    overlay.addEventListener("click",(e)=>{
      if(e.target===overlay) hidePopup();
    });

    showPopup();
  }

  // ===================== Auto Bind Buttons =====================
  document.addEventListener("click", e=>{
    const el = e.target.closest('[name^="share:"]');
    if(!el) return;
    const site = el.name.split(":")[1];
    createPopup(site);
  });

  window.Share={save, shareMultiple};

})();
