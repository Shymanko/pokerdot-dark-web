// ui-tokens.js — single source of truth for the poker app.
// window.UI holds the standardized tokens from "Дизайн-аудит і стандарти".
// Screens should read from here instead of re-declaring MONO/SANS/ARC/GOLD…
(function () {
  const font = "'Chakra Petch', 'Geist Mono', ui-monospace, monospace";
  const fontUI = "'Chakra Petch', system-ui, sans-serif";
  const UI = {
    // type — one family, roles differ by weight/tracking
    font,            // display / numbers / labels (mono role)
    fontUI,          // sans role (labels)
    // color
    bg: "#0A0A0C", surface1: "#1e1e26", surface2: "#1E1E24",
    hairline: "rgba(255,255,255,.14)",
    text: "#FFFFFF", textMute: "rgba(255,255,255,.60)", textDim: "rgba(255,255,255,.40)",
    accent: "#D71921", accentPress: "#A8121A", accentGlow: "rgba(215,25,33,.40)",
    gold: "#f0c75e", green: "#5BD96A", blue: "#6FA8FF",
    // radius — одна драбина на весь застосунок (D2, 08.09)
    //   xs 8   значки, бейджі, мікро-плашки
    //   sm 12  контроли, іконкові кнопки, сегменти
    //   chip 14 рядки списків, чіпи, слоти
    //   md 16  картки
    //   lg 20  великі картки й модалки
    //   xl 24  шторки
    //   pill 125 — усе, що має бути капсулою
    r: { xs: 8, sm: 12, chip: 14, md: 16, lg: 20, xl: 24, pill: 125 },
    // type ramp — розміри тексту (D1, 08.09). Нижче 18px крок фіксований,
    // вище — дисплейні числа, що живуть за власними правилами.
    t: { xs: 8.5, sm: 9.5, label: 10.5, body: 11, bodyL: 12, row: 13, title: 14, h3: 15, h2: 16, h1: 17 },
    // ваги: тільки чотири
    // ваги: сімʼя Chakra Petch має 400–700, тож 800/900 браузер підробляв —
    // у застосунку лишились рівно три реальні ваги
    w: { normal: 500, medium: 600, bold: 700 },
    // shadow
    e1: "0 6px 16px rgba(0,0,0,.35)",
    e2: "0 12px 30px rgba(0,0,0,.50)",
    eAccent: "0 6px 16px rgba(215,25,33,.40)",
    // letter-spacing
    lsLabel: ".14em", lsHeading: ".03em",
  };

  // ── D2. Кнопкова система ───────────────────────────────────────────
  // Чотири розміри × три види. Все інше в застосунку має зводитись сюди.
  //   size: "xl" головна дія екрана · "l" звичайна дія · "m" у картці
  //         "s" дрібна дія · "icon" квадратна кнопка-іконка
  //   kind: "primary" заливка акцентом · "ghost" прозора з рамкою
  //         "outline" рамка акцентом (небезпечні / вторинні дії)
  const BTN_SIZE = {
    xl:   { padding: "16px 22px", fontSize: 16,   letterSpacing: ".1em",  radius: UI.r.pill, shadow: "0 14px 30px " },
    l:    { padding: "14px 20px", fontSize: 14,   letterSpacing: ".12em", radius: UI.r.pill, shadow: "0 12px 26px " },
    m:    { padding: "12px 18px", fontSize: 12.5, letterSpacing: ".14em", radius: UI.r.pill, shadow: "0 10px 24px " },
    s:    { padding: "8px 14px",  fontSize: 10.5, letterSpacing: ".14em", radius: UI.r.pill, shadow: "0 8px 18px " },
    icon: { width: 36, height: 36, padding: 0, fontSize: 0, radius: UI.r.sm, shadow: "0 8px 18px " },
  };
  UI.btn = function (size, kind, accent) {
    const z = BTN_SIZE[size] || BTN_SIZE.l;
    const c = accent || UI.accent;
    const base = {
      boxSizing: "border-box", display: "flex", alignItems: "center", justifyContent: "center",
      gap: 8, cursor: "pointer", padding: z.padding, borderRadius: z.radius,
      fontFamily: UI.font, fontWeight: UI.w.bold, fontSize: z.fontSize,
      letterSpacing: z.letterSpacing, transition: "all 160ms",
    };
    if (z.width) { base.width = z.width; base.height = z.height; base.flex = "none"; }
    if (kind === "ghost") return Object.assign(base, {
      background: "rgba(255,255,255,.06)", border: "1px solid rgba(255,255,255,.16)", color: "#fff",
    });
    if (kind === "outline") return Object.assign(base, {
      background: "transparent", border: "1px solid " + c + "66", color: c,
    });
    return Object.assign(base, {
      background: UI.grad(c), border: 0, color: "#fff", boxShadow: z.shadow + c + "66",
    });
  };
  // v3: усі акцентні (червоні) кнопки — градієнт, а не плоска заливка
  UI.shade = function (hex, k) {
    const m = /^#?([0-9a-f]{6})$/i.exec(hex || ""); if (!m) return hex;
    const n = parseInt(m[1], 16), f = (v) => Math.max(0, Math.min(255, Math.round(v + (k > 0 ? (255 - v) * k / 100 : v * k / 100))));
    return "#" + [(n >> 16) & 255, (n >> 8) & 255, n & 255].map((v) => f(v).toString(16).padStart(2, "0")).join("");
  };
  UI.grad = function (c) { return `linear-gradient(180deg, ${UI.shade(c, 16)} 0%, ${c} 52%, ${UI.shade(c, -22)} 100%)`; };
  // кнопки, зверстані inline-стилем «background: accent» по всьому застосунку, отримують градієнт поверх заливки
  if (typeof document !== "undefined" && !document.getElementById("ui-grad-style")) {
    const st = document.createElement("style"); st.id = "ui-grad-style";
    st.textContent = `
      button[style*="rgb(215, 25, 33)"]:not([style*="gradient"]),[role=button][style*="rgb(215, 25, 33)"]:not([style*="gradient"]),
      button[style*="#D71921"]:not([style*="gradient"]),button[style*="#d71921"]:not([style*="gradient"]){
        background-image:linear-gradient(180deg,rgba(255,255,255,.17) 0%,rgba(255,255,255,0) 52%,rgba(0,0,0,.24) 100%) !important}
      .rb-unlock .rb-unlock-continue{background:linear-gradient(180deg,#ee3f49 0%,#d71921 52%,#a8121a 100%) !important}
    `;
    document.head.appendChild(st);
  }
  // React-обгортка — щоб нові екрани не збирали стилі руками
  UI.Button = function (props) {
    const p = props || {};
    const st = Object.assign(UI.btn(p.size, p.kind, p.accent), p.full ? { width: "100%" } : null, p.style || null);
    return window.React.createElement("button", { onClick: p.onClick, style: st, "aria-label": p["aria-label"] }, p.children);
  };
  window.UI = UI;
})();
// app-wide digit grouping: spaces (NBSP) instead of commas — "1 000 000"
(function () {
  var grp = function (s) { return s.replace(/\B(?=(\d{3})+(?!\d))/g, "\u00A0"); };
  Number.prototype.toLocaleString = function (l, o) {
    var n = Number(this); o = o || {};
    if (!isFinite(n)) return String(n);
    var dec = (String(n).split(".")[1] || "").length;
    var min = o.minimumFractionDigits != null ? o.minimumFractionDigits : 0;
    var max = o.maximumFractionDigits != null ? o.maximumFractionDigits : Math.max(min, Math.min(dec, 3));
    var s = Math.abs(n).toFixed(Math.max(min, Math.min(dec, max)));
    var p = s.split(".");
    return (n < 0 ? "-" : "") + grp(p[0]) + (p[1] ? "." + p[1] : "");
  };
})();
