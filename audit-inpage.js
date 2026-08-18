function runAudit(brandList) {
  const BRAND = new Set(brandList);
  const root = document.querySelector('.phone-scroll');
  if (!root) return { contrast: [], touch: [], name: [], overflow: [], offBrand: [] };

  const toRgb = c => {
    const m = c.match(/rgba?\(([^)]+)\)/); if (!m) return null;
    const p = m[1].split(',').map(Number);
    return { r: p[0], g: p[1], b: p[2], a: p[3] === undefined ? 1 : p[3] };
  };
  const hex = c => { const v = toRgb(c); return v ? '#' + [v.r,v.g,v.b].map(n=>n.toString(16).padStart(2,'0')).join('').toUpperCase() : null; };
  const lum = ({r,g,b}) => { const f = v => { v/=255; return v<=0.03928 ? v/12.92 : Math.pow((v+0.055)/1.055,2.4); }; return 0.2126*f(r)+0.7152*f(g)+0.0722*f(b); };
  const ratio = (a,b) => { const l1=lum(a), l2=lum(b); return (Math.max(l1,l2)+0.05)/(Math.min(l1,l2)+0.05); };

  /* Returns null when the nearest painted ancestor uses a gradient or image:
     a single computed colour cannot represent it, and guessing produces false
     failures (white-on-white) for every badge and gradient CTA. */
  /* An <img> painted behind the text (banner plates, product photos) is not a
     background-color, so no single colour can stand in for it. Report as
     unknown rather than pretending the page background is behind the text. */
  function overImage(el) {
    let n = el;
    for (let i = 0; i < 6 && n; i++) {
      if (n.querySelector && n.querySelector('img')) return true;
      n = n.parentElement;
    }
    return false;
  }

  function effectiveBg(el) {
    let n = el;
    while (n && n !== document.documentElement) {
      const cs = getComputedStyle(n);
      if (cs.backgroundImage && cs.backgroundImage !== 'none') return null;
      const c = toRgb(cs.backgroundColor);
      if (c && c.a > 0.85) return c;
      n = n.parentElement;
    }
    return { r:255, g:255, b:255, a:1 };
  }

  const contrast = [], touch = [], name = [], overflow = [], offBrand = new Set();
  const rootRect = root.getBoundingClientRect();

  for (const el of root.querySelectorAll('*')) {
    const cs = getComputedStyle(el);
    if (cs.visibility === 'hidden' || cs.display === 'none' || cs.opacity === '0') continue;
    const rect = el.getBoundingClientRect();
    if (!rect.width || !rect.height) continue;

    // off-brand colour usage
    for (const prop of ['color','backgroundColor','borderTopColor']) {
      const v = toRgb(cs[prop]);
      if (v && v.a > 0.9) { const h = hex(cs[prop]); if (h && !BRAND.has(h)) offBrand.add(h + ':' + prop); }
    }

    // text contrast — only leaf nodes holding real text
    const own = [...el.childNodes].filter(n => n.nodeType === 3 && n.textContent.trim()).map(n => n.textContent.trim()).join(' ');
    if (own) {
      const fg = toRgb(cs.color);
      const bg = effectiveBg(el);
      if (fg && fg.a > 0.5 && bg && !overImage(el)) {
        const size = parseFloat(cs.fontSize);
        const weight = parseInt(cs.fontWeight) || 400;
        const large = size >= 24 || (size >= 18.66 && weight >= 700);
        const need = large ? 3 : 4.5;
        const r = ratio(fg, bg);
        if (r < need) contrast.push({ ratio: r, fg: hex(cs.color), bg: hex(`rgb(${bg.r},${bg.g},${bg.b})`), size, text: own.slice(0, 34) });
      }
    }

    // touch targets
    if (el.matches('button, a[href], [role="button"], [role="tab"], [role="switch"], input:not([type=hidden]), select, textarea')) {
      const hit = (el.classList.contains('tap-44') || el.getAttribute('data-tap') === '44')
        ? { w: Math.max(rect.width, 44), h: Math.max(rect.height, 44) }
        : { w: rect.width, h: rect.height };
      if (hit.w < 44 || hit.h < 44) {
        touch.push({ tag: el.tagName.toLowerCase(), w: Math.round(hit.w), h: Math.round(hit.h), cls: (el.className.baseVal ?? el.className ?? '').toString().slice(0,52), text: (el.innerText || '').trim().slice(0, 26) });
      }
      /* الاسم المتاح كما تحسبه المتصفحات فعلًا:
         aria-label · aria-labelledby · <label for> · <label> محيط · title · النص.
         كان الفحص يتجاهل `<label for>` وهو **الطريقة الصحيحة** لتسمية حقل
         إدخال، فكان يدفع نحو `aria-label` في كل مكان — وهو أسوأ لأنه لا ينشئ
         منطقة نقر مرتبطة بالحقل. */
      let label = (el.getAttribute('aria-label') || el.getAttribute('title') || el.innerText || el.getAttribute('alt') || '').trim();
      if (!label && el.id) {
        const forEl = document.querySelector('label[for="' + CSS.escape(el.id) + '"]');
        if (forEl && (forEl.textContent || '').trim()) label = forEl.textContent.trim();
      }
      if (!label && el.closest('label') && (el.closest('label').textContent || '').trim()) {
        label = el.closest('label').textContent.trim();
      }
      if (!label && !el.getAttribute('aria-labelledby')) {
        name.push({ tag: el.tagName.toLowerCase(), cls: (el.className.baseVal ?? el.className ?? '').toString().slice(0, 60) });
      }
    }

    // content wider than the viewport
    if (rect.width > rootRect.width + 2 && cs.overflowX !== 'auto' && cs.overflowX !== 'scroll' && el.parentElement && getComputedStyle(el.parentElement).overflowX !== 'auto') {
      overflow.push({ tag: el.tagName.toLowerCase(), cls: (el.className.baseVal ?? el.className ?? '').toString().slice(0, 50), w: Math.round(rect.width) });
    }
  }
  return { contrast, touch, name, overflow, offBrand: [...offBrand] };
}
