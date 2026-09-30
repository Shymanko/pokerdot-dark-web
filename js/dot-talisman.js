// dot-talisman.jsx — DOT tab in the profile: the player's talisman (style × result), carousel, sheets, talisman history.
// Everything is built from the existing design system: SSegment, ClSheet, UI.btn, .me-* classes, Chakra Petch, dot-matrix.
const DT_MONO = UI.font,
  DT_SANS = UI.fontUI,
  DT_ACC = UI.accent;
const dtClick = (f, g) => {
  if (window.playClick) window.playClick(f || 1100, g || 0.04);
};
const dtT = x => window.DOT_RU ? window.DOT_RU.T(x) : x,
  dtTD = x => window.DOT_RU ? window.DOT_RU.TD(x) : x,
  dtRu = () => !!(window.DOT_RU && window.DOT_RU.isRu()),
  dtM = k => window.DOT_RU ? window.DOT_RU.M(k) : window.DOT.METRICS[k] || {
    zones: ['', '', '', '', '']
  },
  dtAN = id => dtT(window.DOT.ANIMAL[id].name);
const dtHex = (hex, a) => {
  const m = /^#?([0-9a-f]{6})$/i.exec(hex || "");
  if (!m) return hex;
  const n = parseInt(m[1], 16);
  return `rgba(${n >> 16 & 255},${n >> 8 & 255},${n & 255},${a})`;
};
if (!document.getElementById("dot-style")) {
  const st = document.createElement("style");
  st.id = "dot-style";
  st.textContent = `
  .dt{position:relative;height:100%;overflow-y:auto;overflow-x:hidden;scrollbar-width:none;color:#fff;font-family:var(--cm-font-ui,${DT_SANS});padding-bottom:104px;box-sizing:border-box;-webkit-overflow-scrolling:touch}
  .dt *{box-sizing:border-box}.dt button{font-family:inherit;cursor:pointer;-webkit-tap-highlight-color:transparent}
  .dt-bar{display:flex;align-items:center;gap:10px;padding:12px 16px 0}.dt-bar>div:first-child{flex:1;min-width:0}
  .dt-window{font:600 12px var(--cm-font-ui,${DT_SANS});letter-spacing:.12em;color:${UI.textDim};white-space:nowrap}
  .dt-scene{position:relative;height:340px;margin:0;overflow:hidden;touch-action:pan-y;user-select:none;-webkit-user-select:none}
  .dt-scene-glow{position:absolute;left:50%;top:50%;width:400px;height:400px;transform:translate(-50%,-50%);border-radius:50%;pointer-events:none;transition:background .6s}
  .dt-scene-dots{position:absolute;inset:0;background-image:radial-gradient(circle,rgba(255,255,255,.16) .7px,transparent 1.1px);background-size:14px 14px;mask-image:radial-gradient(ellipse 60% 55% at 50% 50%,#000 20%,transparent 75%);-webkit-mask-image:radial-gradient(ellipse 60% 55% at 50% 50%,#000 20%,transparent 75%);pointer-events:none}
  .dt-stage{position:absolute;inset:0;display:flex;align-items:center;justify-content:center;perspective:900px;transition:opacity .35s}
  .dt-scene[data-changing=true] .dt-stage{opacity:0;transition-delay:.45s}
  .dt-notyou{position:absolute;top:14px;left:0;right:0;text-align:center;font:700 12px var(--cm-font-ui,${DT_SANS});letter-spacing:.2em;color:${UI.textMute};pointer-events:none}
  .dt-stone{position:relative;transform-style:preserve-3d;will-change:transform}
  .dt-face{position:absolute;inset:0;backface-visibility:hidden;-webkit-backface-visibility:hidden;clip-path:polygon(29% 0,71% 0,100% 25%,100% 75%,71% 100%,29% 100%,0 75%,0 25%);background:#17171b;overflow:hidden}
  .dt-bevel{position:absolute;inset:0;background-image:radial-gradient(circle,rgba(255,255,255,.16) .6px,transparent 1px),linear-gradient(160deg,#4a4a54 0%,#232329 40%,#0b0b0e 100%);background-size:4px 4px,100% 100%}
  .dt-inner{position:absolute;inset:6%;clip-path:polygon(29% 0,71% 0,100% 25%,100% 75%,71% 100%,29% 100%,0 75%,0 25%);background:#17171b;display:flex;align-items:center;justify-content:center}
  .dt-inner:before{content:'';position:absolute;inset:0;background:radial-gradient(circle at 30% 20%,rgba(255,255,255,.08),transparent 55%),radial-gradient(circle at 75% 85%,rgba(255,255,255,.03),transparent 50%),repeating-radial-gradient(circle at 40% 60%,rgba(255,255,255,.012) 0 1px,transparent 1px 3px)}
  .dt-engrave{position:relative;width:68%;height:68%;display:flex;align-items:center;justify-content:center}
  .dt-engrave svg{width:100%;height:100%;overflow:visible;display:block}
  .dt-hole{fill:#17171b}.dt-mini .dt-hole{fill:#1d1d22}
  .dt-engrave:before{content:'';position:absolute;inset:8%;border-radius:50%;background:radial-gradient(circle,var(--dt-c) 0%,transparent 70%);opacity:var(--dt-glow-bg,.22);filter:blur(10px);pointer-events:none}
  .dt-side{position:absolute;left:50%;top:50%;background:linear-gradient(180deg,#26262c,#0e0e11);transform-origin:center;backface-visibility:hidden;-webkit-backface-visibility:hidden}
  .dt-logo{position:relative;display:grid;grid-template-columns:repeat(2,18px);gap:14px;transform:rotate(45deg)}.dt-logo i{width:18px;height:18px;border-radius:50%;background:#ffffff26;box-shadow:inset 0 1px 2px #0009}
  .dt-cracks{position:absolute;inset:0;pointer-events:none}.dt-cracks svg{width:100%;height:100%}
  .dt-smoke{position:absolute;inset:0;pointer-events:none;overflow:visible}.dt-smoke i{position:absolute;width:44px;height:44px;border-radius:50%;background:radial-gradient(circle,#2b1b3dcc,transparent 70%);filter:blur(6px);animation:dt-smoke 3.2s ease-out infinite}
  @keyframes dt-smoke{0%{transform:translateY(10px) scale(.6);opacity:0}30%{opacity:.9}100%{transform:translateY(-70px) scale(1.5);opacity:0}}
  .dt-particles{position:absolute;inset:0;pointer-events:none}.dt-particles i{position:absolute;bottom:22%;width:3.5px;height:3.5px;border-radius:50%;background:var(--dt-c);animation:dt-rise 2s linear infinite;opacity:0}
  @keyframes dt-rise{0%{transform:translateY(0);opacity:0}15%{opacity:1}100%{transform:translateY(-150px);opacity:0}}
  .dt-under{padding:8px 16px 0;text-align:center}
  .dt-name{font:700 28px var(--cm-font-display,${DT_MONO});letter-spacing:.14em;line-height:1.1}.dt-name.dt-type{display:inline-block;overflow:hidden;white-space:nowrap;vertical-align:bottom}
  .dt-power{margin-top:6px;font:700 12px var(--cm-font-ui,${DT_SANS});letter-spacing:.16em;color:${UI.textMute}}
  .dt-tag{margin-top:10px;font:500 14px var(--cm-font-ui,${DT_SANS});color:#fff;line-height:1.4}
  .dt-charge{display:flex;align-items:center;justify-content:center;gap:12px;margin-top:14px}.dt-charge i{display:inline-block;width:5px;height:5px;border-radius:50%;background:rgba(255,255,255,.18);margin:0 1.5px}
  .dt-charge b{font:700 12px var(--cm-font-ui,${DT_SANS});letter-spacing:.16em}
  .dt-metric{margin:16px auto 0;display:flex;flex-direction:column;align-items:center;gap:5px}.dt-metric span{font:700 12px var(--cm-font-ui,${DT_SANS});letter-spacing:.16em;color:${UI.textDim}}.dt-metric b{font:600 13px var(--cm-font-ui,${DT_SANS});color:#e9e9ee}.dt-metric em{font:700 13px var(--cm-font-display,${DT_MONO});font-style:normal}.dt-metric small{font:500 12px var(--cm-font-ui,${DT_SANS});color:${UI.textDim};letter-spacing:.04em}
  .dt-luck-top{display:grid;grid-template-columns:repeat(4,1fr);gap:6px;margin-bottom:12px}.dt-luck-top>div{display:flex;flex-direction:column;gap:5px;min-width:0}.dt-luck-top span{font:700 12px var(--cm-font-ui,${DT_SANS});letter-spacing:.12em;color:${UI.textDim};white-space:nowrap;overflow:hidden;text-overflow:ellipsis}.dt-luck-top b{font:700 18px var(--cm-font-display,${DT_MONO});color:#fff;line-height:1}
  .dt-based{margin-top:8px;font:500 12px var(--cm-font-ui,${DT_SANS});color:${UI.textDim};letter-spacing:.04em}
  .dt-pager{display:flex;justify-content:center;gap:9px;margin-top:14px}.dt-pager button{width:16px;height:16px;padding:0;border:0;background:none;display:flex;align-items:center;justify-content:center}.dt-pager button i{width:5px;height:5px;border-radius:50%;background:rgba(255,255,255,.3);transition:transform .2s,background .2s}.dt-pager button[data-on=true] i{transform:scale(1.6)}
  .dt-cards{display:flex;gap:10px;overflow-x:auto;scrollbar-width:none;padding:18px 16px 0;scroll-snap-type:x mandatory;transition:opacity .25s}.dt-cards::-webkit-scrollbar{display:none}
  .dt-cards-v{flex-direction:column;overflow:visible;scroll-snap-type:none}.dt-cards-v .dt-card{width:100%}
  .dt-improve{margin-top:14px;padding-top:12px;border-top:1px solid rgba(255,255,255,.1)}.dt-improve span{font:700 12px var(--cm-font-ui,${DT_SANS});letter-spacing:.16em;color:${UI.textMute}}.dt-improve p{margin-top:6px!important;color:#fff}
  .dt-card{flex:none;width:calc(100% - 44px);scroll-snap-align:start;padding:16px 16px 14px;border-radius:${UI.r.lg}px;background:${UI.surface1};border:1px solid ${UI.hairline};text-align:left;color:#fff}
  .dt-card-l{font:700 12px var(--cm-font-ui,${DT_SANS});letter-spacing:.16em;color:${UI.textMute};display:flex;align-items:center;justify-content:space-between}
  .dt-card-l span:last-child{font:700 18px var(--cm-font-display,${DT_MONO});color:#fff;letter-spacing:0}
  .dt-card p{margin:10px 0 0;font:500 14px var(--cm-font-ui,${DT_SANS});line-height:1.45;color:#e9e9ee}
  .dt-zone{display:flex;gap:3px;margin-top:12px;position:relative;height:14px;align-items:center}.dt-zone i{flex:1;height:4px;border-radius:2px;background:rgba(255,255,255,.14)}.dt-zone i[data-norm=true]{background:rgba(91,217,106,.6)}
  .dt-zone em{position:absolute;top:50%;width:8px;height:8px;margin:-4px 0 0 -4px;border-radius:50%;background:#fff;box-shadow:0 1px 4px #000c;transition:left .4s}
  .dt-zone-w{display:flex;justify-content:space-between;margin-top:6px;font:600 12px var(--cm-font-ui,${DT_SANS});letter-spacing:.08em;color:${UI.textDim};text-transform:uppercase}
  .dt-sec{margin:22px 16px 0}.dt-sec-h{display:flex;align-items:center;justify-content:space-between;font:700 12px var(--cm-font-ui,${DT_SANS});letter-spacing:.16em;color:${UI.textMute};margin-bottom:10px}.dt-sec-h a{color:${UI.textMute};text-decoration:none;font:600 12px var(--cm-font-ui,${DT_SANS});letter-spacing:.14em;display:inline-flex;align-items:center;gap:4px}
  .dt-box{border-radius:${UI.r.lg}px;background:${UI.surface1};border:1px solid ${UI.hairline};padding:14px 16px;text-align:left;color:#fff;width:100%;display:block}
  .dt-stack{display:flex;height:10px;border-radius:5px;overflow:hidden;gap:2px;margin-top:2px}.dt-stack i{display:block;height:100%;background:rgba(255,255,255,.22)}.dt-stack i[data-hot=true]{background:${DT_ACC}}.dt-stack i[data-fault=true]{background:rgba(255,255,255,.1)}
  .dt-top3-h{display:block;font:700 12px var(--cm-font-ui,${DT_SANS});letter-spacing:.16em;margin-bottom:4px}.dt-top3-row{display:flex;align-items:center;justify-content:space-between;gap:10px;padding:8px 0;border-top:1px solid rgba(255,255,255,.07);font:500 13px var(--cm-font-ui,${DT_SANS});color:#e9e9ee}.dt-top3-row:nth-child(2){border-top:0}.dt-top3-row b{font:700 13px var(--cm-font-display,${DT_MONO});color:#fff;white-space:nowrap;display:flex;align-items:baseline;gap:6px}.dt-top3-row small{font:500 12px var(--cm-font-ui,${DT_SANS});color:${UI.textDim}}
  .dt-line{margin-top:10px;font:500 13px var(--cm-font-ui,${DT_SANS});color:#e9e9ee;line-height:1.45}.dt-line b{color:#fff;font-weight:700}
  .dt-mute{font:500 12px var(--cm-font-ui,${DT_SANS});color:${UI.textDim};line-height:1.5}
  .dt-hist{display:flex;gap:6px;align-items:center;overflow-x:auto;scrollbar-width:none;padding:2px 16px 0}.dt-hist::-webkit-scrollbar{display:none}
  .dt-chip{flex:none;display:inline-flex;align-items:center;gap:8px;height:38px;padding:0 12px 0 6px;border-radius:${UI.r.pill}px;background:rgba(255,255,255,.065);border:1px solid rgba(255,255,255,.18);color:#fff;font:700 12px var(--cm-font-ui,${DT_SANS});letter-spacing:.08em;white-space:nowrap}.dt-chip small{font:500 12px var(--cm-font-ui,${DT_SANS});color:${UI.textDim};letter-spacing:.04em}
  .dt-mini{width:26px;height:30px;clip-path:polygon(29% 0,71% 0,100% 25%,100% 75%,71% 100%,29% 100%,0 75%,0 25%);background:#1d1d22;display:flex;align-items:center;justify-content:center;flex:none}.dt-mini svg{width:60%;height:60%}
  .dt-arrow{color:${UI.textDim};font-size:12px;flex:none}
  .dt-dev{display:flex;align-items:center;gap:8px;margin:22px 16px 0;font:600 12px var(--cm-font-ui,${DT_SANS});letter-spacing:.1em;color:${UI.textDim}}.dt-dev strong{flex:1;text-align:center;font:700 12px var(--cm-font-display,${DT_MONO});color:#d8d8df;letter-spacing:.04em}.dt-dev button{width:26px;height:26px;padding:0;border-radius:50%;border:1px solid #ffffff2a;background:#ffffff0a;color:#d8d8df;font:700 14px var(--cm-font-ui,${DT_SANS})}.dt-dev .dt-dev-w{width:auto;padding:0 10px;border-radius:999px;font:600 12px var(--cm-font-ui,${DT_SANS})}
  .dt-tip{position:absolute;z-index:30;left:16px;right:16px;padding:12px 14px;border-radius:${UI.r.md}px;background:#1e1e26;border:1px solid rgba(255,255,255,.18);box-shadow:${UI.e2};font:500 13px var(--cm-font-ui,${DT_SANS});line-height:1.45;color:#e9e9ee}.dt-tip b{font:700 12px var(--cm-font-display,${DT_MONO});letter-spacing:.12em;color:#fff;display:block;margin-bottom:4px}
  .dt-sheet-anchors{display:flex;gap:6px;overflow-x:auto;scrollbar-width:none;padding:10px 0 4px;position:sticky;top:0;background:linear-gradient(180deg,#15151a 70%,transparent);z-index:2}.dt-sheet-anchors::-webkit-scrollbar{display:none}
  .dt-anchor{flex:none;height:30px;padding:0 12px;border-radius:${UI.r.pill}px;border:1px solid rgba(255,255,255,.16);background:rgba(255,255,255,.05);color:${UI.textMute};font:700 12px var(--cm-font-ui,${DT_SANS});letter-spacing:.12em;white-space:nowrap}.dt-anchor[data-on=true]{color:#fff;border-color:#fff3;background:rgba(255,255,255,.12)}
  .dt-ssec{padding:18px 0 6px;border-bottom:1px solid ${UI.hairline}}.dt-ssec h4{margin:0 0 10px;font:700 12px var(--cm-font-ui,${DT_SANS});letter-spacing:.16em;color:${UI.textMute}}.dt-ssec p{margin:0;font:500 15px var(--cm-font-ui,${DT_SANS});line-height:1.5;color:#fff}
  .dt-sig{padding:12px 0 6px;border-top:1px solid rgba(255,255,255,.08)}.dt-sig:first-of-type{border-top:0}.dt-sig p{font-size:14px!important}
  .dt-sig[data-role=edge] p{color:var(--dt-c)}.dt-sig[data-role=leak] p{color:#ff6b72}
  .dt-row{display:flex;align-items:center;justify-content:space-between;gap:10px;padding:11px 0;border-top:1px solid rgba(255,255,255,.08);font:500 13px var(--cm-font-ui,${DT_SANS});color:#e9e9ee}.dt-row:first-child{border-top:0}.dt-row b{font:700 13px var(--cm-font-display,${DT_MONO});color:#fff;white-space:nowrap}.dt-row small{display:block;font:500 12px var(--cm-font-ui,${DT_SANS});color:${UI.textDim};margin-top:3px}
  .dt-replay{border:0;background:none;color:${UI.textMute};font:700 12px var(--cm-font-ui,${DT_SANS});letter-spacing:.12em;padding:6px 0 0;display:inline-flex;align-items:center;gap:6px}
  .dt-ring{display:flex;align-items:center;gap:16px}.dt-ring svg{flex:none}
  .dt-grid{display:grid;grid-template-columns:repeat(3,1fr);gap:10px;padding-bottom:12px}.dt-grid button{border:0;background:${UI.surface2};border:1px solid ${UI.hairline};border-radius:${UI.r.md}px;padding:12px 6px 10px;color:#fff;display:flex;flex-direction:column;align-items:center;gap:8px;font:700 12px var(--cm-font-ui,${DT_SANS});letter-spacing:.12em}.dt-grid button small{font:500 12px var(--cm-font-ui,${DT_SANS});color:${UI.textDim};letter-spacing:.04em}
  .dt-flag{display:inline-block;margin-top:8px;padding:8px 12px;border-radius:${UI.r.xs}px;border:1px solid var(--dt-c);color:#fff;font:600 12px var(--cm-font-ui,${DT_SANS});letter-spacing:.06em}
  .dt-check{display:flex;gap:10px;align-items:flex-start;padding:9px 0;font:500 14px var(--cm-font-ui,${DT_SANS});color:#e9e9ee;line-height:1.4}.dt-check i{flex:none;width:18px;height:18px;border-radius:50%;display:flex;align-items:center;justify-content:center;font-style:normal;font-size:12px;font-weight:700;margin-top:1px}.dt-check[data-ok=true] i{background:var(--dt-c);color:#000}.dt-check[data-ok=false] i{border:1px solid #fff5;color:#fff}
  .dt-road{padding:8px 0 16px}.dt-road-row{position:relative;display:grid;grid-template-columns:22px 56px minmax(0,1fr);gap:12px;align-items:center;width:100%;padding:14px 0;border:0;background:none;color:#fff;text-align:left}.dt-road-line{position:relative;align-self:stretch}.dt-road-line:before{content:'';position:absolute;left:10px;top:-14px;bottom:-14px;width:2px;background:#ffffff14}.dt-road-row:first-child .dt-road-line:before{top:50%}.dt-road-row:last-child .dt-road-line:before{bottom:50%}.dt-road-line i{position:absolute;left:5px;top:50%;width:12px;height:12px;margin-top:-6px;border-radius:50%;background:#101115;border:2px solid #454852}.dt-road-row[data-cur=true] .dt-road-line i{background:var(--dt-c);border-color:var(--dt-c);box-shadow:0 0 12px var(--dt-c)}.dt-road-art{display:flex;justify-content:center}.dt-road-copy{display:flex;flex-direction:column;gap:4px}.dt-road-k{font:700 12px var(--cm-font-ui,${DT_SANS});letter-spacing:.14em;color:${UI.textDim}}.dt-road-row[data-cur=true] .dt-road-k{color:var(--dt-c)}.dt-road-copy strong{font:700 17px var(--cm-font-display,${DT_MONO});letter-spacing:.08em}.dt-road-row[data-cur=true] .dt-road-copy strong{font-size:22px;color:var(--dt-c)}.dt-road-copy small{font:500 12px var(--cm-font-ui,${DT_SANS});color:${UI.textMute};line-height:1.4}
  .dt-ladder{display:flex;align-items:center;gap:10px;padding:8px 0;border-top:1px solid rgba(255,255,255,.07);font:600 12px var(--cm-font-ui,${DT_SANS});color:${UI.textMute}}.dt-ladder:first-of-type{border-top:0}.dt-ladder-n{width:92px;flex:none;font:700 12px var(--cm-font-display,${DT_MONO});letter-spacing:.1em;color:#fff}.dt-ladder-z{flex:1;font-size:12px;letter-spacing:.08em}.dt-ladder b{font:700 12px var(--cm-font-display,${DT_MONO});color:#fff;white-space:nowrap}.dt-ladder[data-on=true]{color:var(--dt-c)}.dt-ladder[data-on=true] .dt-ladder-n,.dt-ladder[data-on=true] b{color:var(--dt-c)}
  .dt-change{position:absolute;inset:0;z-index:5;pointer-events:none}.dt-change i{position:absolute;width:5px;height:5px;border-radius:50%;left:50%;top:50%}
  .dt-badge{position:relative}.dt-badge:after{content:'';position:absolute;top:-2px;right:-6px;width:6px;height:6px;border-radius:50%;background:${DT_ACC}}
  @media(prefers-reduced-motion:reduce){.dt-smoke i,.dt-particles i{animation:none}}
  `;
  document.head.appendChild(st);
}

// ── the stone: CSS-3D octagonal basalt plate, engraving glows in the animal colour ──────────────
// W×H 1:1.15, thickness .18W, bevel .06W. Front = animal, back = PokerDot four dots. Section 10.
function DtStone({
  animal,
  size = 200,
  state = "active",
  mine = true,
  angle = 0,
  tilt = 0,
  float = 0,
  style
}) {
  const artAnimal = animal || 'tiger';
  return /*#__PURE__*/React.createElement("div", {
    className: "dt-artifact",
    style: {
      width: size,
      height: size,
      transform: `translateY(${float}px) rotateX(${Math.max(-10, Math.min(10, tilt))}deg) rotateY(${Math.sin(angle * Math.PI / 180) * 14}deg)`,
      ...style
    }
  }, /*#__PURE__*/React.createElement("img", {
    src: `assets/talismans3d/${artAnimal}.png`,
    alt: animal ? dtAN(animal) : dtT('FORMING'),
    draggable: "false",
    style: {
      width: '100%',
      height: '100%',
      objectFit: 'contain',
      display: 'block',
      filter: state === 'dormant' ? 'grayscale(1) brightness(.38) blur(1px)' : undefined
    }
  }));
}
function DtLegacyStone({
  animal,
  size = 200,
  state = "active",
  mine = true,
  angle = 0,
  tilt = 0,
  float = 0,
  style
}) {
  const W = size,
    H = Math.round(size * 1.15),
    T = Math.round(size * 0.18);
  const a = animal ? window.DOT.ANIMAL[animal] : null;
  const dormant = state === "dormant" || !a;
  const color = dormant ? "#8A8A92" : mine ? a.color : "#8A8A92";
  const glow = dormant ? 0 : state === "shadow" ? .3 : !mine ? .15 : state === "awakened" ? 1.4 : 1;
  // octagon edges (same polygon as the CSS clip-path) → 8 side slabs
  const P = [[.29, 0], [.71, 0], [1, .25], [1, .75], [.71, 1], [.29, 1], [0, .75], [0, .25]];
  const sides = P.map((p, i) => {
    const q = P[(i + 1) % 8];
    const x1 = p[0] * W,
      y1 = p[1] * H,
      x2 = q[0] * W,
      y2 = q[1] * H;
    const len = Math.hypot(x2 - x1, y2 - y1),
      ang = Math.atan2(y2 - y1, x2 - x1) * 180 / Math.PI;
    return {
      len,
      ang,
      mx: (x1 + x2) / 2 - W / 2,
      my: (y1 + y2) / 2 - H / 2
    };
  });
  const sil = a ? window.DOT.SIL[a.id] : "";
  const eng = `<svg viewBox="-6 -6 112 112" style="color:${color};filter:drop-shadow(0 0 ${Math.round(6 * glow)}px ${dtHex(color, Math.min(1, .9 * glow))}) drop-shadow(0 0 ${Math.round(16 * glow)}px ${dtHex(color, .55 * glow)})"><g fill="currentColor">${sil}</g></svg>`;
  return /*#__PURE__*/React.createElement("div", {
    className: "dt-stone",
    style: {
      width: W,
      height: H,
      transform: `translateY(${float}px) rotateX(${tilt}deg) rotateY(${angle}deg)`,
      "--dt-c": color,
      "--dt-glow-bg": dormant ? 0 : .12 * glow,
      ...style
    }
  }, sides.map((s, i) => /*#__PURE__*/React.createElement("div", {
    key: i,
    className: "dt-side",
    style: {
      width: s.len + 1,
      height: T,
      transform: `translate(-50%,-50%) translate(${s.mx}px,${s.my}px) rotateZ(${s.ang}deg) rotateX(90deg)`,
      opacity: .96
    }
  })), /*#__PURE__*/React.createElement("div", {
    className: "dt-face",
    style: {
      transform: `translateZ(${T / 2}px)`
    }
  }, /*#__PURE__*/React.createElement("div", {
    className: "dt-bevel"
  }), /*#__PURE__*/React.createElement("div", {
    className: "dt-inner"
  }, !dormant && /*#__PURE__*/React.createElement("div", {
    className: "dt-engrave",
    dangerouslySetInnerHTML: {
      __html: eng
    }
  })), state === "shadow" && mine && /*#__PURE__*/React.createElement("div", {
    className: "dt-cracks"
  }, /*#__PURE__*/React.createElement("svg", {
    viewBox: "0 0 100 115",
    fill: "none",
    stroke: "#2B1B3D",
    strokeWidth: "1.4",
    strokeLinecap: "round"
  }, /*#__PURE__*/React.createElement("path", {
    d: "M18 20l9 14-4 12 11 9M84 30l-10 10 3 12-9 6M30 100l8-14-6-9M70 96l-6-12 5-9",
    style: {
      filter: "drop-shadow(0 0 3px #4b2d6a)"
    }
  })))), /*#__PURE__*/React.createElement("div", {
    className: "dt-face",
    style: {
      transform: `rotateY(180deg) translateZ(${T / 2}px)`
    }
  }, /*#__PURE__*/React.createElement("div", {
    className: "dt-bevel"
  }), /*#__PURE__*/React.createElement("div", {
    className: "dt-inner"
  }, /*#__PURE__*/React.createElement("div", {
    className: "dt-logo"
  }, /*#__PURE__*/React.createElement("i", null), /*#__PURE__*/React.createElement("i", null), /*#__PURE__*/React.createElement("i", null), /*#__PURE__*/React.createElement("i", null)))));
}

// ── scene: idle spin (360° / 14 s + float), drag = spin with inertia, flick = carousel, tap = open ─────
function DtScene({
  animal,
  state
}) {
  return /*#__PURE__*/React.createElement("div", {
    className: "dt-scene"
  }, /*#__PURE__*/React.createElement(window.Talisman3D, {
    animal: animal || 'tiger',
    dormant: state === 'dormant'
  }));
}

// ── five-zone scale: norm highlighted green, marker = white dot; tap → tooltip with the metric code ──
function DtZone({
  zone = 2,
  metricKey,
  onTip,
  words = true
}) {
  const M = dtM(metricKey);
  return /*#__PURE__*/React.createElement("div", {
    onClick: e => {
      if (onTip) {
        e.stopPropagation();
        dtClick(1000, .03);
        onTip(metricKey, zone, e);
      }
    },
    style: {
      cursor: onTip ? "pointer" : "default"
    }
  }, /*#__PURE__*/React.createElement("div", {
    className: "dt-zone"
  }, [0, 1, 2, 3, 4].map(i => /*#__PURE__*/React.createElement("i", {
    key: i,
    "data-norm": i === 2
  })), /*#__PURE__*/React.createElement("em", {
    style: {
      left: `${(zone + .5) * 20}%`
    }
  })), words && /*#__PURE__*/React.createElement("div", {
    className: "dt-zone-w"
  }, /*#__PURE__*/React.createElement("span", null, M.zones[0]), /*#__PURE__*/React.createElement("span", {
    style: {
      color: zone === 2 ? "#fff" : undefined
    }
  }, M.zones[2]), /*#__PURE__*/React.createElement("span", null, M.zones[4])));
}
function DtTip({
  tip,
  onClose
}) {
  if (!tip) return null;
  const M = dtM(tip.key);
  return /*#__PURE__*/React.createElement("div", {
    className: "dt-tip",
    style: {
      top: tip.y
    },
    onClick: onClose
  }, /*#__PURE__*/React.createElement("b", null, tip.key), M.def, " ", /*#__PURE__*/React.createElement("span", {
    style: {
      color: UI.textMute
    }
  }, dtT("Your zone:"), " ", M.zones ? M.zones[tip.zone] : "", "."));
}
function DtDots({
  n,
  on,
  color,
  size = 5
}) {
  return /*#__PURE__*/React.createElement("span", null, Array.from({
    length: n
  }).map((_, i) => /*#__PURE__*/React.createElement("i", {
    key: i,
    style: {
      background: i < on ? color : undefined,
      width: size,
      height: size
    }
  })));
}
function DtMini({
  animal,
  mine = true,
  size = 26
}) {
  return /*#__PURE__*/React.createElement("img", {
    className: "dt-mini-artifact",
    src: `assets/talismans3d/${animal || 'tiger'}.png`,
    alt: animal ? dtAN(animal) : '',
    width: size,
    height: size,
    style: {
      width: size,
      height: size,
      objectFit: 'contain',
      display: 'block',
      flex: 'none'
    }
  });
}
function DtLegacyMini({
  animal,
  mine = true,
  size = 26
}) {
  const a = animal ? window.DOT.ANIMAL[animal] : null;
  const c = mine && a ? a.color : "#8A8A92";
  return /*#__PURE__*/React.createElement("span", {
    className: "dt-mini",
    style: {
      width: size,
      height: Math.round(size * 1.15)
    },
    dangerouslySetInnerHTML: {
      __html: a ? `<svg viewBox="-6 -6 112 112" style="color:${c};filter:drop-shadow(0 0 3px ${dtHex(c, .8)})"><g fill="currentColor">${window.DOT.SIL[a.id]}</g></svg>` : ""
    }
  });
}

// ── change animation (8.6): stone flashes → scatters into dots of the old colour → recolours → gathers → new stone spins in ──
function DtChange({
  from,
  to,
  onDone,
  onPhase
}) {
  const [ph, setPh] = React.useState(0);
  React.useEffect(() => {
    const t = [setTimeout(() => setPh(1), 600), setTimeout(() => setPh(2), 1200), setTimeout(() => {
      setPh(3);
      onPhase && onPhase(3);
    }, 1900), setTimeout(() => onDone && onDone(), 2400)];
    return () => t.forEach(clearTimeout);
  }, []);
  const cf = from ? window.DOT.ANIMAL[from].color : "#8A8A92",
    ct = window.DOT.ANIMAL[to].color;
  const dots = React.useMemo(() => Array.from({
    length: 64
  }).map((_, i) => {
    const a = i / 64 * Math.PI * 2,
      r = 60 + i * 37 % 70;
    return {
      x: Math.cos(a) * r,
      y: Math.sin(a) * r * 1.15,
      ox: Math.cos(a) * (80 + i * 53 % 60),
      oy: Math.sin(a) * (80 + i * 29 % 60)
    };
  }), []);
  return /*#__PURE__*/React.createElement("div", {
    className: "dt-change",
    onClick: onDone
  }, dots.map((d, i) => /*#__PURE__*/React.createElement("i", {
    key: i,
    style: {
      background: ph >= 2 ? ct : cf,
      opacity: ph === 0 ? 0 : ph === 3 ? 0 : 1,
      transform: ph === 1 ? `translate(${d.ox + d.x}px,${d.oy + d.y}px)` : ph >= 2 ? `translate(${d.x * .5}px,${d.y * .5}px)` : "translate(0,0)",
      transition: `transform ${ph === 1 ? 600 : 700}ms cubic-bezier(.2,.8,.2,1), background 400ms, opacity 300ms`,
      boxShadow: `0 0 6px ${ph >= 2 ? ct : cf}`
    }
  })));
}

// showdown breakdown + EV/real lines, derived from the luck value (demo)
function dtLuckStats(bi, windowSize = window.DOT.LUCK_WINDOW.showdowns) {
  const n = windowSize,
    up = Math.max(Math.round(n * .3), Math.min(Math.round(n * .7), Math.round(n / 2 + bi / 100 * 3 * n / 100))),
    down = n - up;
  const ev = [],
    real = [];
  let e = 0,
    r = 0;
  for (let i = 0; i < n; i++) {
    e += (35 + i * 7 % 5 * 8) * n / 100;
    r = e + bi * (i / Math.max(1, n - 1)) + (i === n - 1 ? 0 : Math.sin(i * 1.7) * 50);
    ev.push(+e.toFixed(1));
    real.push(+r.toFixed(1));
  }
  return {
    went: n,
    up,
    down,
    lines: {
      ev,
      real
    }
  };
}
// ── the tab: the talisman is the player's LUCK level (last 10 showdowns vs EV). Below: worst beats, best suckouts, stats ──
function LuckSpeedometer({
  value
}) {
  const v = value || 0,
    t = Math.max(-500, Math.min(500, v)),
    angle = t / 500 * 110;
  const [ready, setReady] = React.useState(false);
  React.useEffect(() => {
    const id = requestAnimationFrame(() => setReady(true));
    return () => cancelAnimationFrame(id);
  }, []);
  const tone = v > 100 ? '#70d9ae' : v < -100 ? '#ef7886' : '#c2cbd8';
  const verdict = value === null ? 'СОБИРАЕМ СИГНАЛ' : v >= 450 ? 'ЛЮБИМЧИК ФОРТУНЫ' : v >= 300 ? 'ПОЙМАЛ ВОЛНУ' : v >= 100 ? 'ВЕЗЁТ' : v <= -300 ? 'РЕЖИМ ТУРБУЛЕНТНОСТИ' : v <= -100 ? 'ФОРТУНА НА ПЕРЕРЫВЕ' : 'ПОЛНЫЙ ДЗЕН';
  const point = (degree, r) => {
    const a = (degree - 90) * Math.PI / 180;
    return [170 + Math.cos(a) * r, 165 + Math.sin(a) * r];
  };
  const tip = value === null ? 'Собираем данные. Ещё немного раздач — и будет что обсудить.' : v >= 450 ? 'Фортуна добавила тебя в избранное. Даже носки находятся парами.' : v >= 300 ? 'Сегодня даже бутерброд приземляется маслом вверх.' : v >= 100 ? 'Кажется, у тебя с удачей общий семейный тариф.' : v <= -300 ? 'Сегодня даже Wi-Fi раздаёт тебе плохие карты. Чай и пауза звучат неплохо.' : v <= -100 ? 'Фортуна вышла за кофе. Не пытайся вернуть её повышением ставок.' : 'Вселенная свела дебет с кредитом. Всё честно, даже подозрительно.';
  return /*#__PURE__*/React.createElement("section", {
    className: "pd-luck-meter pd-luck-v2",
    "data-i18n": "off",
    "aria-label": "\u0428\u043A\u0430\u043B\u0430 \u0432\u0435\u0437\u0435\u043D\u0438\u044F",
    style: {
      "--luck-tone": tone
    }
  }, /*#__PURE__*/React.createElement("div", {
    className: "pd-luck-label"
  }, /*#__PURE__*/React.createElement("span", null, /*#__PURE__*/React.createElement("i", null), "\u0423\u0414\u0410\u0427\u0410"), /*#__PURE__*/React.createElement("div", {
    className: "pd-luck-info"
  }, /*#__PURE__*/React.createElement("button", {
    className: "pd-luck-info-button",
    "aria-label": "\u041A\u0430\u043A \u0440\u0430\u0441\u0441\u0447\u0438\u0442\u044B\u0432\u0430\u0435\u0442\u0441\u044F \u0443\u0434\u0430\u0447\u0430",
    "aria-haspopup": "dialog",
    onClick: () => window.showScreenInfo?.({
      kicker: 'УДАЧА',
      title: 'Как рассчитывается удача',
      noLink: true,
      body: ['Учитываем последние 10 шоудаунов — раздач со вскрытием карт.', 'Шкала показывает разницу между фактическим результатом и EV — результатом по вероятностям. BB — большой блайнд. Для каждой раздачи делим разницу на её большой блайнд и суммируем по всем дисциплинам, включая турниры. Шкала от −500 до +500 BB.', 'Короткий отрезок быстро меняется. Это не прогноз следующих раздач.']
    })
  }, /*#__PURE__*/React.createElement("svg", {
    "aria-hidden": "true",
    width: "18",
    height: "18",
    viewBox: "0 0 24 24",
    fill: "none",
    stroke: "currentColor",
    strokeWidth: "1.8",
    strokeLinecap: "round"
  }, /*#__PURE__*/React.createElement("path", {
    d: "M12 11v6"
  }), /*#__PURE__*/React.createElement("circle", {
    cx: "12",
    cy: "7",
    r: ".8",
    fill: "currentColor",
    stroke: "none"
  }))))), /*#__PURE__*/React.createElement("svg", {
    viewBox: "0 0 340 242",
    role: "img",
    "aria-label": value === null ? 'Недостаточно данных' : `Везение ${v} BB относительно EV`
  }, /*#__PURE__*/React.createElement("defs", null, /*#__PURE__*/React.createElement("linearGradient", {
    id: "luckBeam",
    x1: "0",
    y1: "1",
    x2: "0",
    y2: "0"
  }, /*#__PURE__*/React.createElement("stop", {
    stopColor: tone,
    stopOpacity: "0"
  }), /*#__PURE__*/React.createElement("stop", {
    offset: "1",
    stopColor: tone,
    stopOpacity: ".3"
  })), /*#__PURE__*/React.createElement("radialGradient", {
    id: "luckHub"
  }, /*#__PURE__*/React.createElement("stop", {
    stopColor: "#fff"
  }), /*#__PURE__*/React.createElement("stop", {
    offset: ".3",
    stopColor: "#a9b5c4"
  }), /*#__PURE__*/React.createElement("stop", {
    offset: ".6",
    stopColor: "#202730"
  }), /*#__PURE__*/React.createElement("stop", {
    offset: ".85",
    stopColor: "#8493a4"
  }), /*#__PURE__*/React.createElement("stop", {
    offset: "1",
    stopColor: "#151a22"
  })), /*#__PURE__*/React.createElement("linearGradient", {
    id: "luckArc"
  }, /*#__PURE__*/React.createElement("stop", {
    stopColor: "#e84452"
  }), /*#__PURE__*/React.createElement("stop", {
    offset: ".5",
    stopColor: "#bdc7d2"
  }), /*#__PURE__*/React.createElement("stop", {
    offset: "1",
    stopColor: "#52d6a0"
  })), /*#__PURE__*/React.createElement("radialGradient", {
    id: "luckHalo"
  }, /*#__PURE__*/React.createElement("stop", {
    stopColor: "#c5d6ed",
    stopOpacity: ".11"
  }), /*#__PURE__*/React.createElement("stop", {
    offset: "1",
    stopColor: "#c5d6ed",
    stopOpacity: "0"
  }))), /*#__PURE__*/React.createElement("path", {
    d: "M34.7 214.25 A144 144 0 1 1 305.3 214.25",
    fill: "none",
    stroke: "#ffffff0b",
    strokeWidth: "1"
  }), /*#__PURE__*/React.createElement("ellipse", {
    className: "pd-luck-halo",
    cx: "170",
    cy: "150",
    rx: "150",
    ry: "135",
    fill: "url(#luckHalo)"
  }), /*#__PURE__*/React.createElement("path", {
    d: "M45.96 210.14 A132 132 0 1 1 294.04 210.14",
    fill: "none",
    stroke: "#ffffff0b",
    strokeWidth: "12"
  }), /*#__PURE__*/React.createElement("path", {
    d: "M45.96 210.14 A132 132 0 1 1 294.04 210.14",
    fill: "none",
    stroke: "url(#luckArc)",
    strokeWidth: "3",
    strokeLinecap: "round"
  }), Array.from({
    length: 37
  }, (_, i) => {
    const d = -108 + i * 6,
      a = point(d, 135),
      b = point(d, 142),
      lit = t >= 0 ? d >= 0 && d <= angle : d <= 0 && d >= angle;
    return /*#__PURE__*/React.createElement("path", {
      key: 'ring' + i,
      d: `M${a}L${b}`,
      stroke: lit ? tone : '#ffffff',
      strokeOpacity: lit ? .85 : .1,
      strokeWidth: "2",
      strokeLinecap: "round"
    });
  }), Array.from({
    length: 45
  }, (_, i) => {
    const d = -110 + i * 5,
      major = i % 11 === 0,
      a = point(d, major ? 111 : 118),
      b = point(d, 125);
    return /*#__PURE__*/React.createElement("path", {
      key: i,
      d: `M${a}L${b}`,
      stroke: d < -20 ? '#df6670' : d > 20 ? '#69cdaa' : '#d5dce5',
      strokeOpacity: major ? 1 : .4,
      strokeWidth: major ? 2 : 1
    });
  }), [-500, -250, 0, 250, 500].map(n => {
    const p = point(n / 500 * 110, 94);
    return /*#__PURE__*/React.createElement("text", {
      key: n,
      x: p[0],
      y: p[1] + 4,
      textAnchor: "middle",
      fill: "#aeb7c3",
      fontSize: "12"
    }, n > 0 ? '+' + n : n);
  }), /*#__PURE__*/React.createElement("path", {
    className: "pd-luck-live-arc",
    d: "M45.96 210.14 A132 132 0 1 1 294.04 210.14",
    pathLength: "100",
    fill: "none",
    stroke: tone,
    strokeWidth: "5",
    strokeLinecap: "round",
    strokeDasharray: `${Math.abs(t) / 16 * 100} 100`,
    strokeDashoffset: t >= 0 ? -50 : -(50 - Math.abs(t) / 16 * 100)
  }), /*#__PURE__*/React.createElement("g", {
    className: "pd-luck-needle",
    style: {
      transform: `rotate(${ready ? angle : -110}deg)`,
      transformOrigin: '170px 165px'
    }
  }, /*#__PURE__*/React.createElement("path", {
    d: "M166.5 165 L170 50 L173.5 165Z",
    fill: "#f4f6fa"
  }), /*#__PURE__*/React.createElement("path", {
    d: "M170 151V56",
    stroke: tone,
    strokeWidth: "1.5"
  }), /*#__PURE__*/React.createElement("circle", {
    className: "pd-luck-tip",
    cx: "170",
    cy: "33",
    r: "4",
    fill: "#fff"
  }), /*#__PURE__*/React.createElement("circle", {
    cx: "170",
    cy: "33",
    r: "8",
    fill: "none",
    stroke: tone,
    strokeOpacity: ".45"
  })), /*#__PURE__*/React.createElement("circle", {
    cx: "170",
    cy: "165",
    r: "13",
    fill: "url(#luckHub)"
  }), /*#__PURE__*/React.createElement("circle", {
    cx: "170",
    cy: "165",
    r: "5",
    fill: "#121820",
    stroke: tone,
    strokeWidth: "1.2"
  }), /*#__PURE__*/React.createElement("text", {
    className: "pd-luck-number",
    x: "170",
    y: "219",
    textAnchor: "middle",
    fill: "#f5f6fa",
    fontSize: "38",
    fontWeight: "600"
  }, value === null ? '—' : (v > 0 ? '+' : '') + v.toFixed(0), /*#__PURE__*/React.createElement("tspan", {
    fontSize: "12",
    fill: "#aeb7c3"
  }, " BB"))), /*#__PURE__*/React.createElement("div", {
    className: "pd-luck-extremes"
  }, /*#__PURE__*/React.createElement("span", null, "\u041D\u0415 \u0412\u0415\u0417\u0401\u0422"), /*#__PURE__*/React.createElement("span", null, "\u0412\u0415\u0417\u0401\u0422")), /*#__PURE__*/React.createElement("div", {
    className: "pd-luck-advice",
    key: verdict
  }, /*#__PURE__*/React.createElement("div", {
    className: "pd-luck-advice-top"
  }, /*#__PURE__*/React.createElement("span", {
    className: "pd-luck-orbit",
    "aria-hidden": "true"
  }, "\u2726"), /*#__PURE__*/React.createElement("span", null, verdict), /*#__PURE__*/React.createElement("span", {
    className: "pd-luck-quote",
    "aria-hidden": "true"
  }, "\u201C")), /*#__PURE__*/React.createElement("p", {
    className: "pd-luck-joke"
  }, tip)));
}
function DotTab({
  onOverlay,
  onLuck,
  personaIdx: level,
  setPersonaIdx: setLevel,
  after = null
}) {
  const D = window.DOT,
    L = D.LUCK_LEVELS,
    forming = level < 0,
    cur = forming ? null : L[Math.min(L.length - 1, level)],
    a = cur ? D.ANIMAL[cur.animal] : null;
  const [sheet, setSheet] = React.useState(false);
  const [change, setChange] = React.useState(null),
    [typed, setTyped] = React.useState(true);
  React.useEffect(() => {
    onOverlay && onOverlay(!!sheet);
  }, [sheet]);
  const color = a ? a.color : "#8A8A92",
    zone = cur ? dtT(D.LUCK_DEGREES[cur.zone]) : "";
  const bi = cur ? `${cur.bb > 0 ? "+" : "−"}${Math.abs(cur.bb).toFixed(1)} BB` : "";
  const replayChange = () => {
    const from = level > 0 ? L[level - 1].animal : null;
    setChange({
      from,
      to: a.id
    });
    setTyped(false);
  };
  const stats = cur ? dtLuckStats(cur.bb) : null;
  return /*#__PURE__*/React.createElement(React.Fragment, null, /*#__PURE__*/React.createElement("div", {
    className: "dt"
  }, /*#__PURE__*/React.createElement("div", {
    "data-i18n": "off"
  }, /*#__PURE__*/React.createElement("div", {
    className: "ms-luck-widget"
  }, /*#__PURE__*/React.createElement(LuckSpeedometer, {
    value: forming ? null : cur.bb
  }), /*#__PURE__*/React.createElement("button", {
    className: "ms-luck-open",
    "aria-label": "\u041F\u043E\u0434\u0440\u043E\u0431\u043D\u0435\u0435 \u043E\u0431 \u0443\u0434\u0430\u0447\u0435",
    onClick: () => onLuck?.(),
    disabled: forming
  }, /*#__PURE__*/React.createElement("span", null, "\u041F\u043E \u043F\u043E\u0441\u043B\u0435\u0434\u043D\u0438\u043C 10 \u0448\u043E\u0443\u0434\u0430\u0443\u043D\u0430\u043C"), /*#__PURE__*/React.createElement("b", null, "\u041F\u041E\u0414\u0420\u041E\u0411\u041D\u0415\u0415 \u203A")))), after, /*#__PURE__*/React.createElement("div", {
    className: "dt-dev",
    "data-i18n": "off"
  }, /*#__PURE__*/React.createElement("span", null, "\u041F\u0420\u041E\u0421\u041C\u041E\u0422\u0420 \u0428\u041A\u0410\u041B\u042B"), /*#__PURE__*/React.createElement("button", {
    "aria-label": "\u041C\u0435\u043D\u044C\u0448\u0435 \u0432\u0435\u0437\u0435\u043D\u0438\u044F",
    onClick: () => setLevel(Math.max(-1, level - 1))
  }, "\u2212"), /*#__PURE__*/React.createElement("strong", null, forming ? 'Мало данных' : bi), /*#__PURE__*/React.createElement("button", {
    "aria-label": "\u0411\u043E\u043B\u044C\u0448\u0435 \u0432\u0435\u0437\u0435\u043D\u0438\u044F",
    onClick: () => setLevel(Math.min(L.length - 1, level + 1))
  }, "+"))), sheet && /*#__PURE__*/React.createElement(DtLuckSheet, {
    level: level,
    onClose: () => setSheet(false)
  }));
}

// sheet header: small spinning stone + name + power + a sub line
function DtSheetHead({
  animal,
  mine,
  sub
}) {
  const a = window.DOT.ANIMAL[animal];
  const [ang, setAng] = React.useState(0);
  React.useEffect(() => {
    let r;
    const t0 = performance.now();
    const l = t => {
      setAng((t - t0) / 14000 * 360);
      r = requestAnimationFrame(l);
    };
    r = requestAnimationFrame(l);
    return () => cancelAnimationFrame(r);
  }, []);
  return /*#__PURE__*/React.createElement("div", {
    style: {
      display: "flex",
      alignItems: "center",
      gap: 14,
      padding: "10px 0 4px"
    }
  }, /*#__PURE__*/React.createElement("div", {
    style: {
      width: 90,
      height: 104,
      perspective: 500,
      display: "flex",
      alignItems: "center",
      justifyContent: "center",
      flex: "none"
    }
  }, /*#__PURE__*/React.createElement(DtStone, {
    animal: animal,
    size: 78,
    state: "active",
    mine: mine,
    angle: ang,
    tilt: -8
  })), /*#__PURE__*/React.createElement("div", null, /*#__PURE__*/React.createElement("div", {
    className: "dt-name",
    style: {
      fontSize: 22,
      color: mine ? a.color : "#fff"
    }
  }, dtT(a.name).toUpperCase()), sub && /*#__PURE__*/React.createElement("div", {
    className: "dt-mute",
    style: {
      marginTop: 6
    }
  }, sub)));
}

// ── sheet «Luck»: how it's counted, the ladder of 12, talisman history ─────────────────────────
function DtLuckSheet({
  level,
  onClose
}) {
  const D = window.DOT,
    L = D.LUCK_LEVELS,
    Sheet = window.ClSheet,
    cur = level >= 0 ? L[level] : null,
    a = cur ? D.ANIMAL[cur.animal] : null;
  return /*#__PURE__*/React.createElement(Sheet, {
    open: true,
    title: dtT("LUCK"),
    onClose: onClose,
    z: 60
  }, /*#__PURE__*/React.createElement("div", {
    "data-i18n": "off"
  }, a && /*#__PURE__*/React.createElement(DtSheetHead, {
    animal: a.id,
    mine: true,
    sub: `${dtT(D.LUCK_DEGREES[cur.zone])} · ${cur.bb > 0 ? "+" : "−"}${Math.abs(cur.bb).toFixed(1)} BB · ${dtT("last")} ${D.LUCK_WINDOW.showdowns} ${dtT("showdowns")}`
  }), /*#__PURE__*/React.createElement("div", {
    className: "dt-ssec"
  }, /*#__PURE__*/React.createElement("h4", null, dtT("HOW IT'S COUNTED")), /*#__PURE__*/React.createElement("p", null, dtT("Your talisman is your luck. Not your style, not your skill — just how the deck has treated you lately.")), /*#__PURE__*/React.createElement("p", {
    style: {
      marginTop: 10,
      color: UI.textMute,
      fontSize: 14
    }
  }, dtT("For each of your last 10 showdowns we compare what you won to what the odds said you should win. The difference, in buy-ins, is the luck level. Every level has its own talisman."))), /*#__PURE__*/React.createElement("div", {
    className: "dt-ssec"
  }, /*#__PURE__*/React.createElement("h4", null, dtT("LUCK LADDER")), L.slice().reverse().map((l, i) => {
    const x = D.ANIMAL[l.animal],
      on = cur && l.animal === cur.animal;
    return /*#__PURE__*/React.createElement("div", {
      key: l.animal,
      className: "dt-ladder",
      "data-on": on,
      style: {
        "--dt-c": x.color
      }
    }, /*#__PURE__*/React.createElement(DtMini, {
      animal: l.animal,
      mine: on,
      size: 24
    }), /*#__PURE__*/React.createElement("span", {
      className: "dt-ladder-n"
    }, dtT(x.name).toUpperCase()), /*#__PURE__*/React.createElement("span", {
      className: "dt-ladder-z"
    }, dtT(D.LUCK_DEGREES[l.zone])), /*#__PURE__*/React.createElement("b", null, l.range, " BB"));
  })), /*#__PURE__*/React.createElement("div", {
    className: "dt-ssec",
    style: {
      borderBottom: 0
    }
  }, /*#__PURE__*/React.createElement("h4", null, dtT("TALISMAN HISTORY")), /*#__PURE__*/React.createElement("div", {
    className: "dt-road",
    style: {
      padding: 0
    }
  }, D.LUCK_HISTORY.map((entry, i) => {
    const h = !entry[2] && a ? [a.id, entry[1], entry[2]] : entry;
    const x = D.ANIMAL[h[0]],
      c = !h[2];
    return /*#__PURE__*/React.createElement("div", {
      key: i,
      className: "dt-road-row",
      "data-cur": c,
      style: {
        "--dt-c": x.color,
        padding: "10px 0"
      }
    }, /*#__PURE__*/React.createElement("span", {
      className: "dt-road-line"
    }, /*#__PURE__*/React.createElement("i", null)), /*#__PURE__*/React.createElement("span", {
      className: "dt-road-art"
    }, /*#__PURE__*/React.createElement(DtMini, {
      animal: h[0],
      mine: c,
      size: c ? 40 : 30
    })), /*#__PURE__*/React.createElement("span", {
      className: "dt-road-copy"
    }, /*#__PURE__*/React.createElement("span", {
      className: "dt-road-k"
    }, c ? dtT("CURRENT") : `${dtTD(h[1])} – ${dtTD(h[2])}`), /*#__PURE__*/React.createElement("strong", null, dtT(x.name).toUpperCase()), c && /*#__PURE__*/React.createElement("small", null, dtT("SINCE").toLowerCase(), " ", dtTD(h[1]))));
  })))));
}

// two lines over the window: EV (animal colour) vs real (white 60%), fill between = colour 12%
function DtLuckLines({
  lines,
  color = '#f1f3f7',
  h = 128,
  compact = false
}) {
  const uid = React.useRef('dt-graph-' + Math.random().toString(36).slice(2)).current;
  if (!lines) return null;
  const W = 338,
    all = lines.ev.concat(lines.real),
    mn = Math.min(0, ...all),
    mx = Math.max(...all),
    n = lines.ev.length;
  const x = i => i / (n - 1) * W,
    y = v => h - 6 - (v - mn) / (mx - mn || 1) * (h - 18);
  const path = arr => arr.map((v, i) => {
    if (!i) return `M0 ${y(v)}`;
    const xm = (x(i - 1) + x(i)) / 2;
    return `C${xm} ${y(arr[i - 1])} ${xm} ${y(v)} ${x(i)} ${y(v)}`;
  }).join(' ');
  return /*#__PURE__*/React.createElement("div", {
    className: "dt-trend"
  }, /*#__PURE__*/React.createElement("svg", {
    viewBox: `0 0 ${W} ${h}`,
    width: "100%",
    height: h,
    preserveAspectRatio: "none",
    "aria-label": "\u0424\u0430\u043A\u0442\u0438\u0447\u0435\u0441\u043A\u0438\u0439 \u0440\u0435\u0437\u0443\u043B\u044C\u0442\u0430\u0442 \u0438 \u043C\u0430\u0442\u0435\u043C\u0430\u0442\u0438\u0447\u0435\u0441\u043A\u043E\u0435 \u043E\u0436\u0438\u0434\u0430\u043D\u0438\u0435"
  }, /*#__PURE__*/React.createElement("defs", null, /*#__PURE__*/React.createElement("linearGradient", {
    id: uid,
    x1: "0",
    y1: "0",
    x2: "0",
    y2: "1"
  }, /*#__PURE__*/React.createElement("stop", {
    stopColor: color,
    stopOpacity: ".16"
  }), /*#__PURE__*/React.createElement("stop", {
    offset: "1",
    stopColor: color,
    stopOpacity: "0"
  }))), !compact && [.25, .6, .95].map(t => /*#__PURE__*/React.createElement("path", {
    key: t,
    d: `M0 ${h * t}H${W}`,
    stroke: "#ffffff0b"
  })), /*#__PURE__*/React.createElement("path", {
    className: "dt-trend-fill",
    d: path(lines.real) + `L${W} ${h}H0Z`,
    fill: `url(#${uid})`
  }), /*#__PURE__*/React.createElement("path", {
    d: path(lines.ev),
    fill: "none",
    stroke: "#717782",
    strokeWidth: "1.4",
    strokeDasharray: "4 5"
  }), /*#__PURE__*/React.createElement("path", {
    className: "dt-trend-line",
    key: lines.real.join(','),
    d: path(lines.real),
    fill: "none",
    stroke: color,
    strokeWidth: "2",
    strokeLinecap: "round",
    pathLength: "1"
  }), /*#__PURE__*/React.createElement("circle", {
    cx: W,
    cy: y(lines.real[n - 1]),
    r: "3",
    fill: color
  })), !compact && /*#__PURE__*/React.createElement("div", {
    className: "dt-trend-legend"
  }, /*#__PURE__*/React.createElement("span", null, "EV ", /*#__PURE__*/React.createElement("b", null, lines.ev[n - 1] > 0 ? '+' : '', lines.ev[n - 1], " BB")), /*#__PURE__*/React.createElement("span", null, "\u0424\u0430\u043A\u0442 ", /*#__PURE__*/React.createElement("b", null, lines.real[n - 1] > 0 ? '+' : '', lines.real[n - 1], " BB"))));
}
Object.assign(window, {
  DotTab,
  DtStone,
  DtScene,
  DtZone,
  DtMini,
  DtLuckLines,
  DtLuckSheet,
  dtLuckStats
});