(function (window, document) {
  "use strict";

  window.CustomColorPicker = { init, destroy };

  /* =========================
     Inject CSS
  ========================= */
  if (!document.getElementById("ccp-style")) {
    const style = document.createElement("style");
    style.id = "ccp-style";
    style.textContent = `
    .ccp-wrapper {
      position: relative !important;
      display: inline-block !important;
    }
    .ccp-preview {
      width: 36px !important;
    height: 36px !important;
    overflow: hidden !important;
    border-radius: 25px !important;
    border: 1px solid #ccc !important;
    cursor: pointer !important;
    background-image: linear-gradient(45deg, #ccc 25%, transparent 25%), linear-gradient(-45deg, #ccc 25%, transparent 25%), linear-gradient(45deg, transparent 75%, #ccc 75%), linear-gradient(-45deg, transparent 75%, #ccc 75%);
    background-size: 10px 10px;
    background-position: 0 0, 0 5px, 5px -5px, -5px 0px;
    }
    .ccp-preview-inner {
      width: 100% !important;
      height: 100% !important;
      border-radius: 5px !important;
    }
    .ccp-box {
      position: absolute !important;
      top: 45px !important;
      left: 0 !important;
      background: #fff !important;
      border-radius: 4px !important;
      box-shadow: 0 5px 12px rgba(0, 0, 0, .25), 0px 0px 1px #0000001c !important;
      padding: 10px 0 !important;
      padding-top: 0 !important;
      overflow: hidden !important;
      z-index: 999999 !important;
      display: none;
      resize: horizontal;
      max-width: 453px;
      min-width: 358px !important;
      color: rgb(36, 37, 39) !important;
      user-select: none !important;
    }
    .ccp-box a {
      color: rgb(36, 37, 39) !important;
      fill: rgb(36, 37, 39) !important;
    }
    .ccp-box::after {
      position: absolute !important;
      z-index: 999999 !important;
      content: 'Icon canyon' !important;
      top: -27px !important;
      left: 0 !important;
      opacity: .2 !important;
      font-size: 15px !important;
      padding: 5px 8px !important;
      text-shadow: 0px 27px 0px !important;
    }
    .ccp-sat {
      width: 100% !important;
      height: 150px !important;
      position: relative !important;
      cursor: crosshair !important;
      background: linear-gradient(to top, black, transparent), linear-gradient(to right, white, red);
      margin: 0 !important;
    }
    .ccp-dot {
      width: 10px !important;
      height: 10px !important;
      border: 2px solid #fff !important;
      border-radius: 50% !important;
      position: absolute !important;
      transform: translate(-5px, -5px) !important;
      pointer-events: none !important;
      box-shadow: 0 0 2px rgba(0,0,0,0.5) !important;
    }
    .ccp-hue {
      border-radius: 3px !important;
      margin: 0 10px !important;
      height: 14px !important;
      position: relative !important;
      background: linear-gradient(to right, red, yellow, lime, cyan, blue, magenta, red) !important;
      cursor: pointer !important;
    }
    .ccp-alpha {
      border-radius: 3px !important;
      margin: 0 10px !important;
      height: 14px !important;
      position: relative !important;
      cursor: pointer !important;
      background-image: linear-gradient(45deg, #ccc 25%, transparent 25%),
                        linear-gradient(-45deg, #ccc 25%, transparent 25%),
                        linear-gradient(45deg, transparent 75%, #ccc 75%),
                        linear-gradient(-45deg, transparent 75%, #ccc 75%);
      background-size: 10px 10px;
      background-position: 0 0, 0 5px, 5px -5px, -5px 0px;
    }
    .ccp-alpha-gradient {
      width: 100% !important;
      height: 100% !important;
      border-radius: 3px !important;
    }
    .ccp-hue-line,
    .ccp-alpha-line {
      position: absolute !important;
      top: -2px !important;
      width: 5px !important;
      height: 18px !important;
      background: #878787 !important;
      box-shadow: 0 0 2px #000, 0 0 0 2px #fff inset !important;
      pointer-events: none !important;
      transform: translateX(-3px) !important;
      transition: 0.1s !important;
    }
    .ccp-input {
      margin-top: 8px !important;
      width: -webkit-fill-available !important;
      margin-left: 10px !important;
      margin-right: 10px !important;
      text-align: center !important;
      border: 1px solid #ccc !important;
      border-radius: 5px !important;
      padding: 4px !important;
      font-family: monospace !important;
    }
    .ccp-input-row {
      display: flex !important;
      padding: 0 10px !important;
      margin-top: 8px !important;
      gap: 8px !important;
    }
    .ccp-input-short {
      flex: 1 !important;
      text-align: center !important;
      border: 1px solid #ccc !important;
      border-radius: 5px !important;
      padding: 4px !important;
      font-family: monospace !important;
    }
    .ccp-input-short:focus {
      outline-color: #006eff !important;
      outline-offset: 2px;
      outline: solid 2px;
    }
    .ccp-header-row {
      z-index: 5 !important;
      position: relative !important;
      display: flex !important;
      align-items: center !important;
      padding: 0 10px !important;
      padding-top: 10px !important;
      background: white !important;
      padding-right: 0 !important;
    }
    .ccp-sliders-wrapper {
      flex: 1 !important;
    }
    .ccp-selected-color-wrapper {
      display: flex !important;
      align-items: center !important;
      flex-wrap: wrap !important;
      width: 78px !important;
      height: 62px !important;
    }
    .ccp-selected-color-wrapper a {
      display: flex !important;
      align-items: center !important;
      justify-content: center !important;
      width: 30px !important;
      height: 30px !important;
      border: solid 1px #ababab !important;
      border-radius: 25px !important;
      margin-left: 8px !important;
      cursor: pointer !important;
      background-image: linear-gradient(45deg, #ccc 25%, transparent 25%),
                        linear-gradient(-45deg, #ccc 25%, transparent 25%),
                        linear-gradient(45deg, transparent 75%, #ccc 75%),
                        linear-gradient(-45deg, transparent 75%, #ccc 75%);
      background-size: 8px 8px;
      background-position: 0 0, 0 4px, 4px -4px, -4px 0px;
    }
    .ccp-selected-color-wrapper a svg {
      opacity: 0 !important;
    }
    .ccp-selected-color-wrapper a:hover svg {
      opacity: 1 !important;
    }
    .ccp-selected-color-inner {
      width: 100% !important;
      height: 100% !important;
      border-radius: 25px !important;
    }
    .ccp-selected-color-wrapper button {
      width: 30px !important;
      height: 30px !important;
      border: none !important;
      border-radius: 25px !important;
      background: transparent !important;
      opacity: .5 !important;
      cursor: pointer !important;
      display: flex !important;
      align-items: center !important;
      justify-content: center !important;
      padding: 0 !important;
    }
    .ccp-selected-color-wrapper button svg {
      width: 18px !important;
      height: 18px !important;
      fill: #333 !important;
    }
    .ccp-format-btn svg {
      stroke: #333 !important;
    }
    .ccp-selected-color-wrapper button:hover {
      opacity: 1 !important;
      background: rgba(0,0,0,0.1) !important;
    }
    .ccp-sliders {
      margin-top: 8px !important;
    }
    .ccp-slider-label {
      display: flex !important;
      justify-content: space-between !important;
      padding: 0 10px !important;
      margin-bottom: 4px !important;
      font-size: 12px !important;
      color: #666 !important;
    }
    .color20r0-e2 {
      display: none !important;
      flex-wrap: wrap !important;
      gap: 6.6px !important;
      padding: 0 9px !important;
      margin-top: 10px !important;
    }
    .color20r0-e2.show {
      display: flex !important;
    }
    .color20r0-e2 a {
    position: relative !important;
    cursor: pointer !important;
    display: block !important;
    width: 22.9px;
    height: 22.9px;
    border-radius: 20px !important;
    overflow: hidden !important;
    border: solid 1px #00000021 !important;
    }
    .color20r0-e2 a:hover {
      border: solid 1px #0000005b !important;
    }
    .color20r0-e2 a::after {
      position: absolute !important;
      content: '' !important;
      z-index: -1 !important;
      top: 0 !important;
      left: 0 !important;
      width: 100% !important;
      height: 100% !important;
      background-image: linear-gradient(45deg, #ccc 25%, transparent 25%), linear-gradient(-45deg, #ccc 25%, transparent 25%), linear-gradient(45deg, transparent 75%, #ccc 75%), linear-gradient(-45deg, transparent 75%, #ccc 75%);
      background-size: 8px 8px !important;
      background-position: 0 0, 0 4px, 4px -4px, -4px 0px !important;
    }
    .color20r0-e2 a.selected {
      border-color: #ffffff !important;
    outline: 2px solid #89bcff !important;
    }
    .color20r0-e2 a.selected::before {
      content: '' !important;
      position: absolute !important;
      top: 50% !important;
      left: 50% !important;
      transform: translate(-50%, -50%) !important;
      width: 20px !important;
      height: 20px !important;
      background-image: url("data:image/svg+xml,%3Csvg xmlns='http://www.w3.org/2000/svg' height='24px' viewBox='0 -960 960 960' width='24px' fill='%23ffffff'%3E%3Cpath d='M382-240 154-468l57-57 171 171 367-367 57 57-424 424Z'/%3E%3C/svg%3E");
      background-size: contain !important;
      background-repeat: no-repeat !important;
      background-position: center !important;
      filter: drop-shadow(0 0 2px rgb(36 37 39 / 75%)) !important;
      z-index: 2 !important;
    }
    .color20r0-e2 .ripple {
      background: rgba(0,0,0,0.1) !important;
    }
    `;
    document.head.appendChild(style);
  }

  /* =========================
     Global variables
  ========================= */
  let currentOpenPicker = null;
  let mutationObserver = null;
  let resizeObserver = null;
  let boxResizeObservers = new WeakMap(); // لتخزين ResizeObserver لكل مربع

  /* =========================
     Utils
  ========================= */
  function hsvToHex(h, s, v) {
    let f = (n, k = (n + h / 60) % 6) =>
      v - v * s * Math.max(Math.min(k, 4 - k, 1), 0);
    return "#" + [f(5), f(3), f(1)]
      .map(x => Math.round(x * 255).toString(16).padStart(2, "0"))
      .join("");
  }
  
  function hsvToRgb(h, s, v) {
    let f = (n, k = (n + h / 60) % 6) =>
      v - v * s * Math.max(Math.min(k, 4 - k, 1), 0);
    return {
      r: Math.round(f(5) * 255),
      g: Math.round(f(3) * 255),
      b: Math.round(f(1) * 255)
    };
  }
  
  function hexToRgba(hex, alpha = 1) {
    if (!hex || typeof hex !== 'string' || hex === 'transparent') return 'rgba(0, 0, 0, 0)';
    
    // Handle short hex
    if (hex.length === 4) {
      hex = '#' + hex[1] + hex[1] + hex[2] + hex[2] + hex[3] + hex[3];
    }
    
    if (!isValidHex(hex)) return 'rgba(0, 0, 0, 0)';
    
    const r = parseInt(hex.substr(1, 2), 16);
    const g = parseInt(hex.substr(3, 2), 16);
    const b = parseInt(hex.substr(5, 2), 16);
    
    return `rgba(${r}, ${g}, ${b}, ${alpha})`;
  }
  
  function rgbaToHex(rgba) {
    const match = rgba.match(/rgba?\((\d+),\s*(\d+),\s*(\d+)(?:,\s*([\d.]+))?\)/);
    if (!match) return '#000000';
    
    const r = parseInt(match[1]);
    const g = parseInt(match[2]);
    const b = parseInt(match[3]);
    
    return '#' + [r, g, b].map(x => x.toString(16).padStart(2, '0')).join('');
  }
  
  function getAlphaFromRgba(rgba) {
    const match = rgba.match(/rgba?\([\d\s,]+?,\s*([\d.]+)\)/);
    return match ? parseFloat(match[1]) : 1;
  }

  function hexToHsv(hex) {
    if (!hex || typeof hex !== 'string' || hex === 'transparent') return { h: 0, s: 0, v: 0 };
    
    if (hex.length === 4) {
      hex = '#' + hex[1] + hex[1] + hex[2] + hex[2] + hex[3] + hex[3];
    }
    
    if (!isValidHex(hex)) return { h: 0, s: 0, v: 0 };
    
    let r = parseInt(hex.substr(1, 2), 16) / 255;
    let g = parseInt(hex.substr(3, 2), 16) / 255;
    let b = parseInt(hex.substr(5, 2), 16) / 255;
    let max = Math.max(r, g, b), min = Math.min(r, g, b);
    let d = max - min;
    let h = d === 0 ? 0 :
      max === r ? ((g - b) / d) % 6 :
      max === g ? (b - r) / d + 2 :
                  (r - g) / d + 4;
    h = (h * 60 + 360) % 360;
    let s = max === 0 ? 0 : d / max;
    return { h, s, v: max };
  }

  function isValidHex(hex) {
    if (!hex || typeof hex !== 'string') return false;
    return /^#([0-9A-F]{3}){1,2}$/i.test(hex);
  }
  
  function isValidAlpha(alpha) {
    if (typeof alpha === 'string') {
      alpha = alpha.replace('%', '').trim();
    }
    const num = parseFloat(alpha);
    return !isNaN(num) && num >= 0 && num <= 100;
  }
  
  function isValidRgb(rgb) {
    if (!rgb || typeof rgb !== 'string') return false;
    const match = rgb.match(/^rgb\((\d+),\s*(\d+),\s*(\d+)\)$/);
    if (!match) return false;
    
    const r = parseInt(match[1]);
    const g = parseInt(match[2]);
    const b = parseInt(match[3]);
    
    return r >= 0 && r <= 255 && g >= 0 && g <= 255 && b >= 0 && b <= 255;
  }
  
  function isValidRgba(rgba) {
    if (!rgba || typeof rgba !== 'string') return false;
    const match = rgba.match(/^rgba\((\d+),\s*(\d+),\s*(\d+),\s*([\d.]+)\)$/);
    if (!match) return false;
    
    const r = parseInt(match[1]);
    const g = parseInt(match[2]);
    const b = parseInt(match[3]);
    const a = parseFloat(match[4]);
    
    return r >= 0 && r <= 255 && g >= 0 && g <= 255 && b >= 0 && b <= 255 && a >= 0 && a <= 1;
  }

  function parseColorValue(inputValue) {
    if (!inputValue || inputValue === 'transparent') {
      return { hex: 'transparent', alpha: 0, format: 'hex' };
    }
    
    // If hex
    if (isValidHex(inputValue)) {
      return { hex: inputValue, alpha: 100, format: 'hex' };
    }
    
    // If rgba
    if (isValidRgba(inputValue)) {
      const rgbaMatch = inputValue.match(/rgba?\((\d+),\s*(\d+),\s*(\d+)(?:,\s*([\d.]+))?\)/);
      if (rgbaMatch) {
        const r = parseInt(rgbaMatch[1]);
        const g = parseInt(rgbaMatch[2]);
        const b = parseInt(rgbaMatch[3]);
        const alpha = rgbaMatch[4] ? parseFloat(rgbaMatch[4]) * 100 : 100;
        
        const hex = '#' + [r, g, b].map(x => x.toString(16).padStart(2, '0')).join('');
        return { hex, alpha, format: 'rgba' };
      }
    }
    
    // If rgb
    if (isValidRgb(inputValue)) {
      const rgbMatch = inputValue.match(/rgb\((\d+),\s*(\d+),\s*(\d+)\)/);
      if (rgbMatch) {
        const r = parseInt(rgbMatch[1]);
        const g = parseInt(rgbMatch[2]);
        const b = parseInt(rgbMatch[3]);
        const hex = '#' + [r, g, b].map(x => x.toString(16).padStart(2, '0')).join('');
        return { hex, alpha: 100, format: 'rgb' };
      }
    }
    
    return { hex: '#000000', alpha: 100, format: 'hex' };
  }

  /* =========================
     HTML Template
  ========================= */
  const TEMPLATE = `
    <div class="ccp-wrapper">
      <div class="ccp-preview">
        <div class="ccp-preview-inner"></div>
      </div>
    </div>
  `;

  const COLOR_BOX_TEMPLATE = `
    <div class="ccp-box">
      <div class="ccp-sat">
        <div class="ccp-dot"></div>
      </div>
      <div class="ccp-header-row">
          <div class="ccp-selected-color-wrapper">
              <button class="ccp-dropper Wave-cloud" title="Color picker">
                <svg xmlns="http://www.w3.org/2000/svg" viewBox="0 0 512 512">
                  <path d="M461.05 51a65 65 0 00-45.71-19h-.76a61.81 61.81 0 00-44.36 19.25 12.81 12.81 0 00-1.07 1.25l-54 69.76c-5.62 7.1-12.74 8.68-16.78 4.64l-1.9-1.9a48 48 0 00-67.92 67.92l9.91 9.91a2 2 0 010 2.83L58.7 385.38C54 390.05 46.9 399.85 38.85 431c-4.06 15.71-6.51 29.66-6.61 30.24A16 16 0 0048 480a15.68 15.68 0 002.64-.22c.58-.1 14.44-2.43 30.13-6.44 31.07-7.94 41.05-15.24 45.85-20l179.77-179.79a2 2 0 012.82 0l9.92 9.92a48 48 0 0067.92-67.93l-1.59-1.54c-5-5-2.52-12.11 4.32-17.14l69.75-53.94a17.82 17.82 0 001.47-1.32 63.2 63.2 0 0019-45A63.88 63.88 0 00461.05 51zM250.78 283.9c-2.92 2.92-16.18 7.92-23.39.71s-2.24-20.42.69-23.35l33-33a2 2 0 012.83 0l19.84 19.83a2 2 0 010 2.83z"/>
                </svg>
              </button>
              <a class="ccp-selected-color" title="Copy color">
                  <svg class="ccp-selected-color-icon" xmlns="http://www.w3.org/2000/svg" style="filter: drop-shadow(0px 0px 2px #00000063);position: absolute; background: #00000030 !important; box-shadow: 0 0 0 6px #00000030 !important; border-radius: 25px !important; height: 18px; z-index: 5; fill: white; width: 18px;" height="24px" viewBox="0 -960 960 960" width="24px" fill="#1f1f1f">
                      <path d="M360-240q-33 0-56.5-23.5T280-320v-480q0-33 23.5-56.5T360-880h360q33 0 56.5 23.5T800-800v480q0 33-23.5 56.5T720-240H360Zm0-80h360v-480H360v480ZM200-80q-33 0-56.5-23.5T120-160v-560h80v560h440v80H200Zm160-240v-480 480Z"/>
                  </svg>
                <div class="ccp-selected-color-inner"></div>
              </a>
              <div style="margin-top: 2px; margin-right: 0px; width: 69px; display: flex; justify-content: space-between;">
                  <button class="ccp-format-btn Wave-cloud" title="Change color format">
                      <svg xmlns="http://www.w3.org/2000/svg" style="width: 20px !important; height: 20px !important;" class="ionicon" viewBox="0 0 512 512"><path d="M136 208l120-104 120 104M136 304l120 104 120-104" fill="none" stroke="currentColor" stroke-width="48" stroke-linecap="round" stroke-linejoin="round"/></svg>
                  </button>
                  <button class="Primary-colors Wave-cloud" title="Primary colors">
                      <svg xmlns="http://www.w3.org/2000/svg" class="ionicon" viewBox="0 0 512 512"><path d="M430.11 347.9c-6.6-6.1-16.3-7.6-24.6-9-11.5-1.9-15.9-4-22.6-10-14.3-12.7-14.3-31.1 0-43.8l30.3-26.9c46.4-41 46.4-108.2 0-149.2-34.2-30.1-80.1-45-127.8-45-55.7 0-113.9 20.3-158.8 60.1-83.5 73.8-83.5 194.7 0 268.5 41.5 36.7 97.5 55 152.9 55.4h1.7c55.4 0 110-17.9 148.8-52.4 14.4-12.7 11.99-36.6.1-47.7z" fill="none" stroke="currentColor" stroke-miterlimit="10" stroke-width="32"/><circle cx="144" cy="208" r="32"/><circle cx="152" cy="311" r="32"/><circle cx="224" cy="144" r="32"/><circle cx="256" cy="367" r="48"/><circle cx="328" cy="144" r="32"/></svg>
                  </button>
              </div>
          </div>
          <div class="ccp-sliders-wrapper">
              <div class="ccp-sliders">
                <div class="ccp-slider-label">
                  <span>Hue</span>
                  <span class="ccp-hue-value">0°</span>
                </div>
                <div class="ccp-hue">
                  <div class="ccp-hue-line"></div>
                </div>
                <div class="ccp-slider-label" style="margin-top:8px;">
                  <span>Opacity</span>
                  <span class="ccp-alpha-value">100%</span>
                </div>
                <div class="ccp-alpha">
                  <div class="ccp-alpha-gradient"></div>
                  <div class="ccp-alpha-line" style="direction: rtl;"></div>
                </div>
              </div>
          </div>
      </div>
      <div class="ccp-input-row">
        <input name="hex" class="ccp-input-short ccp-hex-input" type="text" placeholder="#RRGGBB" />
        <input name="alpha" class="ccp-input-short ccp-alpha-input" type="text" placeholder="100%" />
      </div>
      
      <div class="color20r0-e2 Wave-all">
        <a style="background-color: #ff0000;" title="Red" data-color="#ff0000"></a>
        <a style="background-color: #0000ff;" title="Blue" data-color="#0000ff"></a>
        <a style="background-color: #ffff00;" title="Yellow" data-color="#ffff00"></a>
        <a style="background-color: #008000;" title="Green" data-color="#008000"></a>
        <a style="background-color: #ffa500;" title="Orange" data-color="#ffa500"></a>
        <a style="background-color: #800080;" title="Purple" data-color="#800080"></a>
        <a style="background-color: #000000;" title="Black" data-color="#000000"></a>
        <a style="background-color: #ffffff;" title="White" data-color="#ffffff"></a>
        <a style="background-color: #808080;" title="Gray" data-color="#808080"></a>
        <a style="background-color: #a52a2a;" title="Brown" data-color="#a52a2a"></a>
        <a style="background-color: #ffc0cb;" title="Pink" data-color="#ffc0cb"></a>
        <a style="background-color: #00ffff;" title="Cyan" data-color="#00ffff"></a>
        <a style="background-color: #ff00ff;" title="Magenta" data-color="#ff00ff"></a>
        <a style="background-color: transparent;" title="Transparent" data-color="transparent"></a>
      </div>
    </div>
  `;

  /* =========================
     Core
  ========================= */
  function createPicker(input) {
    if (input.dataset.ccp) return;
    input.dataset.ccp = "1";
    input.style.display = "none";

    const { hex: initialHex, alpha: initialAlpha } = parseColorValue(input.value);
    let h, s, v, alpha, currentFormat = 'hex';
    
    // Initialize with parsed values
    ({ h, s, v } = hexToHsv(initialHex));
    alpha = initialAlpha;

    const temp = document.createElement("div");
    temp.innerHTML = TEMPLATE;
    const wrapper = temp.firstElementChild;

    const preview = wrapper.querySelector(".ccp-preview");
    const previewInner = wrapper.querySelector(".ccp-preview-inner");

    let colorBox = null; // سيتم إنشاء مربع الألوان عند الحاجة فقط
    let boxResizeObserver = null;

    input.after(wrapper);

    function createColorBox() {
      if (colorBox && colorBox.parentNode) {
        return colorBox;
      }
      
      const tempBox = document.createElement("div");
      tempBox.innerHTML = COLOR_BOX_TEMPLATE;
      colorBox = tempBox.firstElementChild;
      
      // ضبط العرض على 358px عند الإنشاء
      colorBox.style.width = "358px";
      
      // إضافة المستمعين للأحداث
      setupColorBoxListeners(colorBox);
      
      // إعداد ResizeObserver لمربع الألوان
      setupBoxResizeObserver(colorBox);
      
      return colorBox;
    }

    function setupBoxResizeObserver(box) {
      if (typeof ResizeObserver === 'undefined') return;
      
      // إيقاف أي ResizeObserver موجود سابقاً
      if (boxResizeObserver) {
        boxResizeObserver.disconnect();
      }
      
      boxResizeObserver = new ResizeObserver((entries) => {
        for (let entry of entries) {
          if (entry.target === box && box.style.display === "block") {
            // تأخير بسيط لضمان استقرار الأبعاد
            setTimeout(() => {
              updateIndicatorPositions(box);
            }, 10);
          }
        }
      });
      
      // مراقبة تغييرات حجم مربع الألوان
      boxResizeObserver.observe(box);
      
      // حفظ المرجع للتنظيف لاحقاً
      boxResizeObservers.set(box, boxResizeObserver);
    }

    function updateIndicatorPositions(box) {
      if (!box || box.style.display !== "block") return;
      
      const hueBar = box.querySelector(".ccp-hue");
      const hueLine = box.querySelector(".ccp-hue-line");
      const alphaBar = box.querySelector(".ccp-alpha");
      const alphaLine = box.querySelector(".ccp-alpha-line");
      const sat = box.querySelector(".ccp-sat");
      const dot = box.querySelector(".ccp-dot");
      
      // تحديث مواضع المؤشرات بناءً على القيم الحالية
      if (hueBar && hueLine) {
        const hueBarWidth = hueBar.clientWidth;
        if (hueBarWidth > 0) {
          hueLine.style.left = ((h / 360) * hueBarWidth) + "px";
        }
      }
      
      if (alphaBar && alphaLine) {
        const alphaBarWidth = alphaBar.clientWidth;
        if (alphaBarWidth > 0) {
          alphaLine.style.left = ((alpha / 100) * alphaBarWidth) + "px";
        }
      }
      
      if (sat && dot) {
        const satWidth = sat.clientWidth;
        const satHeight = sat.clientHeight;
        if (satWidth > 0 && satHeight > 0) {
          dot.style.left = (s * satWidth) + "px";
          dot.style.top = ((1 - v) * satHeight) + "px";
        }
      }
      
      // تحديث التدرج اللوني للألفا
      const alphaGradient = box.querySelector(".ccp-alpha-gradient");
      if (alphaGradient) {
        const hex = hsvToHex(h, s, v);
        alphaGradient.style.background = `linear-gradient(to right, ${hex}00 0%, ${hex}FF 100%)`;
      }
    }

    function setupColorBoxListeners(box) {
      const sat = box.querySelector(".ccp-sat");
      const dot = box.querySelector(".ccp-dot");
      const hueBar = box.querySelector(".ccp-hue");
      const hueLine = box.querySelector(".ccp-hue-line");
      const alphaBar = box.querySelector(".ccp-alpha");
      const alphaGradient = box.querySelector(".ccp-alpha-gradient");
      const alphaLine = box.querySelector(".ccp-alpha-line");
      const hexInput = box.querySelector(".ccp-hex-input");
      const alphaInput = box.querySelector(".ccp-alpha-input");
      const selectedColor = box.querySelector(".ccp-selected-color");
      const selectedColorInner = box.querySelector(".ccp-selected-color-inner");
      const selectedColorIcon = box.querySelector(".ccp-selected-color-icon");
      const dropperBtn = box.querySelector(".ccp-dropper");
      const formatBtn = box.querySelector(".ccp-format-btn");
      const primaryColorsBtn = box.querySelector(".Primary-colors");
      const hueValue = box.querySelector(".ccp-hue-value");
      const alphaValue = box.querySelector(".ccp-alpha-value");
      const colorPalette = box.querySelector(".color20r0-e2");
      const colorOptions = colorPalette.querySelectorAll("a");

      function updateAlphaGradient() {
        const hex = hsvToHex(h, s, v);
        alphaGradient.style.background = `linear-gradient(to right, ${hex}00 0%, ${hex}FF 100%)`;
      }

      function formatColor() {
        const hex = hsvToHex(h, s, v);
        const rgb = hsvToRgb(h, s, v);
        
        switch(currentFormat) {
          case 'hex':
            return hex;
          case 'rgb':
            return `rgb(${rgb.r}, ${rgb.g}, ${rgb.b})`;
          case 'rgba':
            return `rgba(${rgb.r}, ${rgb.g}, ${rgb.b}, ${alpha/100})`;
          default:
            return hex;
        }
      }
      
      function updateHexInputValue() {
        const hex = hsvToHex(h, s, v);
        const rgb = hsvToRgb(h, s, v);
        
        switch(currentFormat) {
          case 'hex':
            hexInput.value = hex;
            hexInput.placeholder = "#RRGGBB";
            break;
          case 'rgb':
            hexInput.value = `rgb(${rgb.r}, ${rgb.g}, ${rgb.b})`;
            hexInput.placeholder = "rgb(r, g, b)";
            break;
          case 'rgba':
            hexInput.value = `rgba(${rgb.r}, ${rgb.g}, ${rgb.b}, ${(alpha/100).toFixed(2)})`;
            hexInput.placeholder = "rgba(r, g, b, a)";
            break;
        }
      }

      function updateUI() {
        const hex = hsvToHex(h, s, v);
        const rgba = hexToRgba(hex, alpha / 100);
        
        previewInner.style.background = rgba;
        
        // Update main input field based on selected format
        const formattedColor = formatColor();
        
        // Update input field (hex or rgb or rgba)
        updateHexInputValue();
        
        // Update opacity field
        alphaInput.value = `${Math.round(alpha)}%`;
        
        // Update hidden input field (original input)
        if (input.type === 'color') {
          input.value = hex; // Use hex only for color inputs
        } else {
          input.value = formattedColor; // Use selected format for other inputs
        }
        
        selectedColorInner.style.background = rgba;
        
        hueValue.textContent = `${Math.round(h)}°`;
        alphaValue.textContent = `${Math.round(alpha)}%`;

        // Update saturation area background
        sat.style.background = `
          linear-gradient(to top, black, transparent),
          linear-gradient(to right, white, hsl(${h}, 100%, 50%))
        `;

        // Update dot position in saturation area
        const satWidth = sat.clientWidth;
        const satHeight = sat.clientHeight;
        
        if (satWidth > 0 && satHeight > 0) {
          dot.style.left = (s * satWidth) + "px";
          dot.style.top = ((1 - v) * satHeight) + "px";
        } else {
          setTimeout(() => {
            const satWidth = sat.clientWidth;
            const satHeight = sat.clientHeight;
            if (satWidth > 0 && satHeight > 0) {
              dot.style.left = (s * satWidth) + "px";
              dot.style.top = ((1 - v) * satHeight) + "px";
            }
          }, 10);
        }

        // Update Hue bar position
        const hueBarWidth = hueBar.clientWidth;
        if (hueBarWidth > 0) {
          hueLine.style.left = ((h / 360) * hueBarWidth) + "px";
        }

        // Update Alpha bar position
        const alphaBarWidth = alphaBar.clientWidth;
        if (alphaBarWidth > 0) {
          alphaLine.style.left = ((alpha / 100) * alphaBarWidth) + "px";
        }
        
        updateAlphaGradient();

        // Update selected color in palette
        updateSelectedColorInPalette();

        // Trigger events
        input.dispatchEvent(new Event("input", { bubbles: true }));
        input.dispatchEvent(new Event("change", { bubbles: true }));
      }

      function toggleFormat() {
        const formats = ['hex', 'rgb', 'rgba'];
        const currentIndex = formats.indexOf(currentFormat);
        currentFormat = formats[(currentIndex + 1) % formats.length];
        
        updateHexInputValue();
        updateUI();
      }

      function toggleColorPalette() {
        colorPalette.classList.toggle("show");
      }

      function selectColorFromPalette(colorElement) {
        const color = colorElement.getAttribute("data-color");
        
        colorOptions.forEach(option => {
          option.classList.remove("selected");
        });
        
        colorElement.classList.add("selected");
        
        if (color === "transparent") {
          h = 0;
          s = 0;
          v = 0;
          alpha = 0;
        } else {
          ({ h, s, v } = hexToHsv(color));
          alpha = 100;
        }
        
        updateUI();
      }

      function updateSelectedColorInPalette() {
        const currentHex = hsvToHex(h, s, v);
        
        colorOptions.forEach(option => {
          option.classList.remove("selected");
        });
        
        colorOptions.forEach(option => {
          const optionColor = option.getAttribute("data-color");
          if (optionColor === currentHex.toLowerCase() || 
              (alpha === 0 && optionColor === "transparent")) {
            option.classList.add("selected");
          }
        });
      }

      function setupDrag(element, callback) {
        element.addEventListener("mousedown", (e) => {
          e.preventDefault();
          e.stopPropagation();
          callback(e);
          
          const onMouseMove = (ev) => {
            ev.preventDefault();
            callback(ev);
          };
          
          const onMouseUp = () => {
            document.removeEventListener("mousemove", onMouseMove);
            document.removeEventListener("mouseup", onMouseUp);
          };
          
          document.addEventListener("mousemove", onMouseMove);
          document.addEventListener("mouseup", onMouseUp, { once: true });
        });
      }

      setupDrag(hueBar, (e) => {
        const rect = hueBar.getBoundingClientRect();
        const x = Math.max(0, Math.min(rect.width, e.clientX - rect.left));
        h = (x / rect.width) * 360;
        updateUI();
      });

      setupDrag(sat, (e) => {
        const rect = sat.getBoundingClientRect();
        const x = Math.max(0, Math.min(rect.width, e.clientX - rect.left));
        const y = Math.max(0, Math.min(rect.height, e.clientY - rect.top));
        
        s = x / rect.width;
        v = 1 - (y / rect.height);
        updateUI();
      });

      setupDrag(alphaBar, (e) => {
        const rect = alphaBar.getBoundingClientRect();
        const x = Math.max(0, Math.min(rect.width, e.clientX - rect.left));
        alpha = (x / rect.width) * 100;
        updateUI();
      });

      hexInput.addEventListener("input", () => {
        let value = hexInput.value.trim();
        
        let valid = false;
        
        switch(currentFormat) {
          case 'hex':
            if (!value.startsWith("#")) {
              value = "#" + value;
            }
            
            if (isValidHex(value)) {
              ({ h, s, v } = hexToHsv(value));
              valid = true;
            }
            break;
            
          case 'rgb':
            if (isValidRgb(value)) {
              const rgbMatch = value.match(/rgb\((\d+),\s*(\d+),\s*(\d+)\)/);
              if (rgbMatch) {
                const r = parseInt(rgbMatch[1]);
                const g = parseInt(rgbMatch[2]);
                const b = parseInt(rgbMatch[3]);
                const hex = '#' + [r, g, b].map(x => x.toString(16).padStart(2, '0')).join('');
                if (isValidHex(hex)) {
                  ({ h, s, v } = hexToHsv(hex));
                  valid = true;
                }
              }
            }
            break;
            
          case 'rgba':
            if (isValidRgba(value)) {
              const rgbaMatch = value.match(/rgba\((\d+),\s*(\d+),\s*(\d+),\s*([\d.]+)\)/);
              if (rgbaMatch) {
                const r = parseInt(rgbaMatch[1]);
                const g = parseInt(rgbaMatch[2]);
                const b = parseInt(rgbaMatch[3]);
                const newAlpha = parseFloat(rgbaMatch[4]) * 100;
                const hex = '#' + [r, g, b].map(x => x.toString(16).padStart(2, '0')).join('');
                if (isValidHex(hex) && isValidAlpha(newAlpha)) {
                  ({ h, s, v } = hexToHsv(hex));
                  alpha = newAlpha;
                  valid = true;
                }
              }
            }
            break;
        }
        
        if (valid) {
          updateUI();
        }
      });

      hexInput.addEventListener("blur", () => {
        let value = hexInput.value.trim();
        
        if (!value) {
          updateHexInputValue();
          return;
        }
        
        let isValid = false;
        
        switch(currentFormat) {
          case 'hex':
            if (!value.startsWith("#")) {
              value = "#" + value;
            }
            isValid = isValidHex(value);
            break;
            
          case 'rgb':
            isValid = isValidRgb(value);
            break;
            
          case 'rgba':
            isValid = isValidRgba(value);
            break;
        }
        
        if (!isValid) {
          updateHexInputValue();
        } else {
          hexInput.value = value;
        }
      });

      alphaInput.addEventListener("input", () => {
        let value = alphaInput.value.replace('%', '').trim();
        
        if (isValidAlpha(value)) {
          alpha = Math.max(0, Math.min(100, parseFloat(value)));
          updateUI();
        }
      });

      alphaInput.addEventListener("blur", () => {
        let value = alphaInput.value.replace('%', '').trim();
        if (!isValidAlpha(value)) {
          alphaInput.value = `${Math.round(alpha)}%`;
        } else {
          alpha = Math.max(0, Math.min(100, parseFloat(value)));
          alphaInput.value = `${Math.round(alpha)}%`;
          updateUI();
        }
      });

      dropperBtn.addEventListener("click", (e) => {
        e.preventDefault();
        e.stopPropagation();
        
        if (!window.EyeDropper) {
          alert("Color picker feature is not supported in your browser");
          return;
        }

        const eyeDropper = new EyeDropper();
        
        eyeDropper.open()
          .then(result => {
            const color = result.sRGBHex;
            if (isValidHex(color)) {
              ({ h, s, v } = hexToHsv(color));
              updateUI();
            }
          })
          .catch(err => {
            console.log("Color picker cancelled:", err);
          });
      });

      formatBtn.addEventListener("click", (e) => {
        e.preventDefault();
        e.stopPropagation();
        toggleFormat();
      });

      primaryColorsBtn.addEventListener("click", (e) => {
        e.preventDefault();
        e.stopPropagation();
        toggleColorPalette();
      });

      colorOptions.forEach(option => {
        option.addEventListener("click", (e) => {
          e.preventDefault();
          e.stopPropagation();
          selectColorFromPalette(option);
        });
      });

      selectedColor.addEventListener("click", (e) => {
        e.preventDefault();
        e.stopPropagation();
        const formattedColor = formatColor();
        navigator.clipboard.writeText(formattedColor)
          .then(() => {
            selectedColorIcon.innerHTML = `<path d="M382-240 154-468l57-57 171 171 367-367 57 57-424 424Z"/>`;
            
            const originalText = hexInput.value;
            hexInput.value = "Copied!";
            
            setTimeout(() => {
              selectedColorIcon.innerHTML = `<path d="M360-240q-33 0-56.5-23.5T280-320v-480q0-33 23.5-56.5T360-880h360q33 0 56.5 23.5T800-800v480q0 33-23.5 56.5T720-240H360Zm0-80h360v-480H360v480ZM200-80q-33 0-56.5-23.5T120-160v-560h80v560h440v80H200Zm160-240v-480 480Z"/>`;
              hexInput.value = originalText;
            }, 1000);
          })
          .catch(err => {
            console.error("Failed to copy color:", err);
          });
      });

      // استدعاء updateUI فوراً بعد إعداد المستمعين
      setTimeout(() => {
        updateUI();
      }, 0);
    }

    function toggleBox() {
      // إغلاق مربع الألوان المفتوح حالياً إذا كان مختلفاً عن هذا المربع
      if (currentOpenPicker && currentOpenPicker !== colorBox) {
        currentOpenPicker.style.display = "none";
        if (currentOpenPicker.parentNode) {
          currentOpenPicker.parentNode.removeChild(currentOpenPicker);
        }
        // تنظيف ResizeObserver للمربع المغلق
        const oldObserver = boxResizeObservers.get(currentOpenPicker);
        if (oldObserver) {
          oldObserver.disconnect();
          boxResizeObservers.delete(currentOpenPicker);
        }
        currentOpenPicker = null;
      }
      
      if (!colorBox || !colorBox.parentNode) {
        // إنشاء مربع الألوان إذا لم يكن موجوداً
        colorBox = createColorBox();
        
        // ضبط العرض على 358px
        colorBox.style.width = "358px";
        colorBox.style.minWidth = "358px";
        
        // إضافة مربع الألوان إلى الـ DOM
        wrapper.appendChild(colorBox);
        
        // إظهار المربع
        colorBox.style.display = "block";
        currentOpenPicker = colorBox;
        
        // تأخير طفيف لضمان تحديث المواقع بشكل صحيح
        setTimeout(() => {
          updateIndicatorPositions(colorBox);
        }, 50);
      } else if (colorBox.style.display === "block") {
        // إذا كان المربع مفتوحاً، قم بإغلاقه وحذفه
        colorBox.style.display = "none";
        colorBox.parentNode.removeChild(colorBox);
        
        // تنظيف ResizeObserver للمربع المغلق
        if (boxResizeObserver) {
          boxResizeObserver.disconnect();
          boxResizeObserver = null;
        }
        boxResizeObservers.delete(colorBox);
        
        colorBox = null;
        currentOpenPicker = null;
      } else {
        // إذا كان المربع موجوداً ولكن غير ظاهر، قم بإظهاره
        wrapper.appendChild(colorBox);
        colorBox.style.display = "block";
        currentOpenPicker = colorBox;
        
        // تحديث مواضع المؤشرات عند إعادة العرض
        setTimeout(() => {
          updateIndicatorPositions(colorBox);
        }, 50);
      }
    }

    function handleDocumentClick(e) {
      if (colorBox && colorBox.parentNode && !wrapper.contains(e.target)) {
        colorBox.style.display = "none";
        if (colorBox.parentNode) {
          colorBox.parentNode.removeChild(colorBox);
        }
        
        // تنظيف ResizeObserver للمربع المغلق
        if (boxResizeObserver) {
          boxResizeObserver.disconnect();
          boxResizeObserver = null;
        }
        boxResizeObservers.delete(colorBox);
        
        colorBox = null;
        if (currentOpenPicker === colorBox) {
          currentOpenPicker = null;
        }
      }
    }

    document.addEventListener("mousedown", handleDocumentClick);

    // Function to handle window resize and body resize
    function handleResize() {
      if (currentOpenPicker === colorBox && colorBox && colorBox.style.display === "block") {
        colorBox.style.display = "none";
        if (colorBox.parentNode) {
          colorBox.parentNode.removeChild(colorBox);
        }
        
        // تنظيف ResizeObserver للمربع المغلق
        if (boxResizeObserver) {
          boxResizeObserver.disconnect();
          boxResizeObserver = null;
        }
        boxResizeObservers.delete(colorBox);
        
        colorBox = null;
        currentOpenPicker = null;
      }
    }

    // Add resize event listener
    window.addEventListener('resize', handleResize);
    window.addEventListener('orientationchange', handleResize);

    preview.addEventListener("mousedown", (e) => {
      e.preventDefault();
      e.stopPropagation();
      toggleBox();
    });

    // Initialize preview
    const hex = hsvToHex(h, s, v);
    const rgba = hexToRgba(hex, alpha / 100);
    previewInner.style.background = rgba;

    // Save reference for cleanup
    wrapper._cleanup = () => {
      document.removeEventListener("mousedown", handleDocumentClick);
      window.removeEventListener('resize', handleResize);
      window.removeEventListener('orientationchange', handleResize);
      
      // Remove color box if exists
      if (colorBox && colorBox.parentNode) {
        colorBox.parentNode.removeChild(colorBox);
      }
      
      // تنظيف ResizeObserver
      if (boxResizeObserver) {
        boxResizeObserver.disconnect();
        boxResizeObserver = null;
      }
      if (colorBox) {
        boxResizeObservers.delete(colorBox);
      }
      
      input.style.display = "";
      delete input.dataset.ccp;
      if (currentOpenPicker === colorBox) {
        currentOpenPicker = null;
      }
    };
  }

  function init(selector = 'input[type="color"]') {
    document.querySelectorAll(selector).forEach(createPicker);
  }

  function destroy() {
    document.querySelectorAll('[data-ccp]').forEach(input => {
      const wrapper = input.nextElementSibling;
      if (wrapper && wrapper.classList.contains('ccp-wrapper')) {
        if (wrapper._cleanup) {
          wrapper._cleanup();
        }
        wrapper.remove();
      }
    });
    currentOpenPicker = null;
    
    // تنظيف جميع ResizeObservers
    boxResizeObservers = new WeakMap();
    
    if (resizeObserver) {
      resizeObserver.disconnect();
      resizeObserver = null;
    }
  }

  function checkForDynamicInputs() {
    document.querySelectorAll('input[type="color"]:not([data-ccp])').forEach(createPicker);
    document.querySelectorAll('.custom-color-input:not([data-ccp])').forEach(createPicker);
    document.querySelectorAll('[data-color-picker]:not([data-ccp])').forEach(createPicker);
  }

  function startMutationObserver() {
    if (mutationObserver) {
      mutationObserver.disconnect();
    }
    
    mutationObserver = new MutationObserver((mutations) => {
      mutations.forEach((mutation) => {
        if (mutation.addedNodes.length) {
          mutation.addedNodes.forEach(node => {
            if (node.nodeType === Node.ELEMENT_NODE) {
              if (node.matches && node.matches('input[type="color"]')) {
                createPicker(node);
              }
              
              if (node.querySelectorAll) {
                node.querySelectorAll('input[type="color"]').forEach(createPicker);
                node.querySelectorAll('.custom-color-input').forEach(createPicker);
                node.querySelectorAll('[data-color-picker]').forEach(createPicker);
              }
            }
          });
        }
      });
    });
    
    mutationObserver.observe(document.body, {
      childList: true,
      subtree: true
    });
  }

  function startResizeObserver() {
    if (typeof ResizeObserver !== 'undefined') {
      resizeObserver = new ResizeObserver(() => {
        if (currentOpenPicker) {
          currentOpenPicker.style.display = "none";
          if (currentOpenPicker.parentNode) {
            currentOpenPicker.parentNode.removeChild(currentOpenPicker);
          }
          currentOpenPicker = null;
        }
      });
      
      resizeObserver.observe(document.body);
      resizeObserver.observe(document.documentElement);
    }
  }

  // Auto-initialize when page loads
  if (document.readyState === 'loading') {
    document.addEventListener('DOMContentLoaded', () => {
      init();
      checkForDynamicInputs();
      startMutationObserver();
      startResizeObserver();
    });
  } else {
    init();
    checkForDynamicInputs();
    startMutationObserver();
    startResizeObserver();
  }

  window.CustomColorPicker.checkForNewInputs = checkForDynamicInputs;

})(window, document);
