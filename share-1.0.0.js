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
    email: d => `mailto:${d.email||""}?subject=Share&body=${encodeURIComponent(d.customText||d.text||d.url||"")}`
  };

  const KEY = "share_user_data";

  function save(data){ localStorage.setItem(KEY, JSON.stringify(data)); }
  function load(){ return JSON.parse(localStorage.getItem(KEY))||{}; }

  function share(site, customText){
    site = site.toLowerCase();
    const fn = providers[site];
    if(!fn) return;
    const data = load();
    if(customText) data.customText = customText;
    window.open(fn(data), "_blank");
  }

  // ===================== Create Popup =====================
  function createPopup(site){
    // إنشاء العناصر فقط عند الطلب
    const overlay = document.createElement("div");
    Object.assign(overlay.style, {
      position:"fixed", top:0, left:0, width:"100%", height:"100%",
      backgroundColor:"rgba(0,0,0,0)", display:"flex",
      justifyContent:"center", alignItems:"center", zIndex:1000000,
      transition:"background-color 0.3s ease"
    });

    const box = document.createElement("div");
    Object.assign(box.style,{
      backgroundColor:"#fff", padding:"20px", borderRadius:"10px", width:"300px",
      boxShadow:"0 5px 15px rgba(0,0,0,0.3)", textAlign:"center",
      position:"relative", transform:"scale(0.5)", opacity:0,
      transition:"all 0.3s ease",
      borderBottom:"30px"
    });

    const textarea = document.createElement("textarea");
    textarea.placeholder="اكتب رسالتك هنا...";
    Object.assign(textarea.style,{
      width:"100%", height:"80px", marginBottom:"10px", padding:"10px",
      fontSize:"14px", resize:"none", border:"solid 1px #ccc",
      borderRadius:"5px", fontFamily:"'Cairo', sans-serif",
      lineHeight:1, outlineColor:"#3382ff"
    });

    const sendBtn = document.createElement("button");
    sendBtn.textContent="إرسال";
    Object.assign(sendBtn.style,{
      marginLeft:"10px", padding:"5px 18px", cursor:"pointer",
      borderRadius:"25px", border:"none", color:"white",
      background:"#3880ff", fontFamily:"'Cairo', sans-serif"
    });
    sendBtn.addEventListener("click", ()=>{
      const customText = textarea.value.trim();
      share(site, customText);
      hidePopup();
    });

    const closeBtn = document.createElement("button");
    closeBtn.textContent="إغلاق";
    Object.assign(closeBtn.style,{
      padding:"5px 18px", cursor:"pointer",
      borderRadius:"25px", border:"none", color:"#000",
      background:"#bfd6ff", fontFamily:"'Cairo', sans-serif"
    });
    closeBtn.addEventListener("click", hidePopup);

    box.appendChild(textarea);
    box.appendChild(sendBtn);
    box.appendChild(closeBtn);
    overlay.appendChild(box);

    function showPopup(){
      // إضافة الـ overlay إلى الـ DOM عند الظهور
      document.body.appendChild(overlay);
      requestAnimationFrame(()=>{
        overlay.style.backgroundColor="rgba(0,0,0,0.5)";
        box.style.transform="scale(1)";
        box.style.opacity=1;
      });
    }

    function hidePopup(){
      overlay.style.backgroundColor="rgba(0,0,0,0)";
      box.style.transform="scale(0.5)";
      box.style.opacity=0;
      setTimeout(()=> {
        // إزالة العناصر بالكامل بعد انتهاء الانميشن
        overlay.remove();
      },300);
    }

    overlay.addEventListener("click",(e)=>{
      if(e.target===overlay) hidePopup();
    });

    showPopup();
  }

  // ===================== Auto Bind Buttons =====================
  document.addEventListener("click", e=>{
    const el=e.target.closest('[name^="share:"]');
    if(!el) return;
    const site = el.name.split(":")[1];
    if(!site) return;
    createPopup(site);
  });

  window.Share={save, share};

})();


