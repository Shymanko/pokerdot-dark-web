function _extends() { return _extends = Object.assign ? Object.assign.bind() : function (n) { for (var e = 1; e < arguments.length; e++) { var t = arguments[e]; for (var r in t) ({}).hasOwnProperty.call(t, r) && (n[r] = t[r]); } return n; }, _extends.apply(null, arguments); }
// ME: permanent 3D house, independent rake cycle, and the original 53-card collection.
// The profile and reward history reuse the app typography and controls.
// Older helpers below are retained for compatibility; RbHouseFirst owns ME.
const ME_MONO = UI.font;
const ME_SANS = UI.fontUI;
const ME_TH = () => Math.max(1, Number((window.cmPlayer || {}).safeThreshold) || 1000);
const RULER_SP_CSS = 14;
const meFmt = v => Math.round(v).toLocaleString("en-US").split(",").join(" ");
const mePct = v => (Math.round(v * 10) / 10).toString().replace(".", ",") + "%";
const meMoney = v => window.pxMoney ? window.pxMoney(v, true) : "$" + Number(v).toFixed(2);
const meClick = (f, g) => {
  if (window.playClick) window.playClick(f || 1100, g || 0.04);
};
if (!document.getElementById("me-style")) {
  const st = document.createElement("style");
  st.id = "me-style";
  st.textContent = `
    .me-records,.me-performance{margin:26px 16px 0}
    .me-section-heading{margin:0 0 12px;font:600 12px ${ME_SANS};letter-spacing:.14em;color:${UI.textMute}}
    .me-record-list{border-top:1px solid ${UI.hairline};border-bottom:1px solid ${UI.hairline};background:linear-gradient(110deg,${UI.gold}08,transparent 68%)}
    .me-record{display:flex;align-items:center;justify-content:space-between;gap:16px;padding:19px 12px 19px 2px;min-width:0}
    .me-record+.me-record{border-top:1px solid ${UI.hairline}}
    .me-record-copy{min-width:0}
    .me-record-result{display:flex;align-items:center;gap:6px;color:#79cfab;font:600 12px ${ME_SANS};letter-spacing:.1em}
    .me-record[data-won=false] .me-record-result{color:#f08593}
    .me-record-result>span{font-size:17px;line-height:12px}
    .me-record-amount{display:block;margin-top:6px;font:600 30px ${ME_SANS};letter-spacing:-.04em;color:${UI.text};font-variant-numeric:tabular-nums;line-height:1.14}
    .me-record-meta{margin-top:7px;display:flex;gap:8px;color:${UI.textMute};font:500 12px ${ME_SANS};font-variant-numeric:tabular-nums}
    .me-record-meta>span{opacity:.4}
    .me-record-hand{display:flex;gap:7px;padding:4px 2px;flex:none}
    .me-record-card{display:flex;flex-direction:column;align-items:center;justify-content:center;gap:4px;width:40px;height:57px;border-radius:7px;border:1px solid #ffffff30;background:linear-gradient(150deg,#2a2c34,#101115 76%);box-shadow:0 5px 12px #0005,inset 0 1px 0 #ffffff12}
    .me-record-card>b{font:700 23px ${ME_SANS};line-height:1;color:#fff}
    .me-performance{margin-top:27px}
    .me-performance-grid{display:grid;grid-template-columns:repeat(2,minmax(0,1fr));column-gap:24px}
    .me-performance-item{min-width:0;padding:15px 0 17px;border-bottom:1px solid ${UI.hairline}}
    .me-performance-item:nth-last-child(-n+2){border-bottom:0;padding-bottom:0}
    .me-performance-label{font:500 12px ${ME_SANS};letter-spacing:.055em;color:${UI.textMute};line-height:1.4}
    .me-performance-item>strong{display:block;margin:7px 0 5px;font:600 24px ${ME_SANS};letter-spacing:-.025em;color:${UI.text};font-variant-numeric:tabular-nums;line-height:1.2}
    .me-performance-note{font:400 12px ${ME_SANS};line-height:1.45;color:${UI.textMute}}
    .me-copy-id{display:flex;align-items:center;gap:8px;min-height:36px;padding:0;border:0;background:transparent;color:${UI.textMute};font:500 14px ${ME_SANS};cursor:pointer;text-align:left}
    .me-copy-id:hover{color:${UI.text}}.me-copy-id:focus-visible,.me-record:focus-visible{outline:2px solid ${UI.gold};outline-offset:3px}
    .me-copy-feedback{position:absolute;font:500 12px ${ME_SANS};color:${UI.gold};transform:translateY(-2px);pointer-events:none}
    .me-record-list{display:grid;grid-template-columns:repeat(2,minmax(0,1fr));gap:12px;border:0;background:none}
    .me-record{position:relative;display:flex;flex-direction:column;align-items:flex-start;gap:12px;text-align:left;padding:16px 14px 12px;border:1px solid ${UI.hairline};border-radius:16px;background:linear-gradient(145deg,#ffffff07,transparent 75%);color:${UI.text};cursor:pointer;transition:border-color 180ms,background 180ms}
    .me-record+.me-record{border-top:1px solid ${UI.hairline}}
    .me-record:hover{border-color:#ffffff40;background:linear-gradient(145deg,#ffffff0c,transparent 75%)}
    .me-record-amount{font-size:26px;margin-top:8px}.me-record-meta{font-size:12px}
    .me-record-card{width:31px;height:43px;gap:2px;border-radius:5px}.me-record-card>b{font-size:19px}.me-record-card>svg{width:16px;height:16px}
    .me-record-hand{gap:6px;padding:2px 1px}.me-record-play{position:absolute;bottom:17px;right:12px;display:flex;flex-direction:column;align-items:center;gap:4px;font:600 12px ${ME_SANS};letter-spacing:.05em;color:${UI.textMute}}
    /* Career entrance: one gesture opens the space, then the player and value arrive.
       Only opacity/transforms animate; the dock stays fixed and never blocks input. */
    @keyframes me-arrival-screen{from{opacity:0}to{opacity:1}}
    @keyframes me-arrival-scrim{0%,12%{opacity:1}100%{opacity:0}}
    @keyframes me-arrival-orbit{0%{opacity:0;transform:translate(-50%,50%) scale(.12)}12%{opacity:.6}62%{opacity:.18}100%{opacity:0;transform:translate(-50%,50%) scale(10)}}
    @keyframes me-arrival-atmosphere{0%{opacity:0;transform:scale(.72)}35%{opacity:.45}100%{opacity:0;transform:scale(1.2)}}
    @keyframes me-arrival-ui{from{opacity:0;transform:translate3d(0,14px,0)}to{opacity:1;transform:translate3d(0,0,0)}}
    @keyframes me-arrival-ruler{from{opacity:0;transform:translate3d(14px,0,0)}to{opacity:1;transform:translate3d(0,0,0)}}
    @keyframes me-arrival-progress{from{transform:scaleX(0)}to{transform:scaleX(1)}}
    @keyframes me-arrival-dock{0%{opacity:0;transform:scale(.5)}30%{opacity:.9}100%{opacity:0;transform:scale(1.35)}}
    .me-screen{isolation:isolate;overflow:hidden;animation:me-arrival-screen 260ms ease-out both}
    .me-arrival-scrim,.me-arrival-orbit,.me-arrival-atmosphere{position:absolute;inset:0;pointer-events:none;z-index:7}
    .me-arrival-scrim{background:#101115;opacity:0}
    .me-arrival-orbit,.me-arrival-atmosphere{opacity:0;overflow:hidden}
    .me-arrival-orbit::before{content:'';position:absolute;width:220px;height:220px;left:13%;bottom:6%;border:1px solid ${UI.gold}66;border-radius:50%;box-shadow:0 0 26px ${UI.accent}20,inset 0 0 28px ${UI.gold}10;opacity:0}
    .me-arrival-atmosphere{inset:30% -12% 5%;background:radial-gradient(ellipse at 50% 64%,${UI.gold}20,${UI.accent}0a 40%,transparent 68%)}
    .me-screen[data-arrival=preparing] .me-arrival-scrim{opacity:1}
    .me-screen[data-arrival=preparing] .me-identity,.me-screen[data-arrival=preparing] .rb-iso-next,.me-screen[data-arrival=preparing] .rb-iso-value,.me-screen[data-arrival=preparing] .rb-iso-ruler{opacity:0}
    .me-screen[data-arrival=playing] .me-arrival-scrim{animation:me-arrival-scrim 430ms ease-out both}
    .me-screen[data-arrival=playing] .me-arrival-orbit{opacity:1}
    .me-screen[data-arrival=playing] .me-arrival-orbit::before{animation:me-arrival-orbit 1050ms cubic-bezier(.16,1,.3,1) both}
    .me-screen[data-arrival=playing] .me-arrival-atmosphere{animation:me-arrival-atmosphere 1150ms ease-out both}
    .me-screen[data-arrival=playing] .me-identity{animation:me-arrival-ui 540ms 180ms cubic-bezier(.16,1,.3,1) both}
    .me-screen[data-arrival=playing] .rb-iso-next{animation:me-arrival-ui 500ms 280ms cubic-bezier(.16,1,.3,1) both}
    .me-screen[data-arrival=playing] .rb-iso-total>span{transform-origin:left center;animation:me-arrival-progress 740ms 320ms cubic-bezier(.16,1,.3,1) both}
    .me-screen[data-arrival=playing] .rb-iso-value{animation:me-arrival-ui 620ms 430ms cubic-bezier(.16,1,.3,1) both}
    .me-screen[data-arrival=playing] .rb-iso-ruler{animation:me-arrival-ruler 600ms 540ms cubic-bezier(.16,1,.3,1) both}
    .pd-lobby-underlay{transform-origin:50% 62%;transition:opacity 260ms ease,transform 600ms cubic-bezier(.16,1,.3,1)}
    [data-app-root][data-section=profile]>.pd-lobby-underlay{opacity:.25;transform:scale(.965)}
    .pd-dock-me[data-active=true]::before{content:'';position:absolute;inset:1px;border-radius:inherit;background:radial-gradient(ellipse,${UI.accent}38,transparent 72%);pointer-events:none;animation:me-arrival-dock 720ms ease-out both}
    @media(prefers-reduced-motion:reduce){
      .me-screen,.me-screen[data-arrival=playing] .me-identity,.me-screen[data-arrival=playing] .rb-iso-next,.me-screen[data-arrival=playing] .rb-iso-total>span,.me-screen[data-arrival=playing] .rb-iso-value,.me-screen[data-arrival=playing] .rb-iso-ruler{animation:none}
      .me-arrival-scrim,.me-arrival-orbit,.me-arrival-atmosphere,.pd-dock-me::before{display:none}
      .me-screen[data-arrival=preparing] .me-identity,.me-screen[data-arrival=preparing] .rb-iso-next,.me-screen[data-arrival=preparing] .rb-iso-value,.me-screen[data-arrival=preparing] .rb-iso-ruler{opacity:1}
      .pd-lobby-underlay{transition:none}[data-app-root][data-section=profile]>.pd-lobby-underlay{transform:none}
    }

    @keyframes me-cashback-glow{0%,100%{box-shadow:0 0 10px #d6a94f16,inset 0 1px 0 #fff0bc12}50%{box-shadow:0 0 20px #d6a94f36,inset 0 1px 0 #fff0bc20}}
    .me-cashback-cta{position:relative;flex:none;width:120px;height:44px;padding:0;border:0;border-radius:999px;background:linear-gradient(rgba(214,169,79,.1),rgba(214,169,79,.1)),#09090b;color:#ffebbc;font:700 12px ${ME_SANS};letter-spacing:.06em;cursor:pointer;transition:background 300ms,transform 150ms}
    .me-cashback-cta[data-ready=true]{animation:me-cashback-glow 3.8s ease-in-out infinite}
    .me-cashback-cta:active{transform:scale(.97)}
    .me-cashback-rim{position:absolute;inset:0;width:100%;height:100%;pointer-events:none;overflow:visible}
    .me-cashback-rim-fill{transition:stroke-dashoffset 600ms cubic-bezier(.2,.8,.2,1)}
    .me-rb-summary{position:absolute;top:18px;left:22px;right:22px;z-index:3;color:${UI.text};background:transparent}
    .me-rb-parts{display:grid;grid-template-columns:1fr 1fr;gap:16px}
    .me-rb-part{padding:0;border:0;cursor:pointer;background:none;text-align:left;color:${UI.text};min-height:70px}
    .me-rb-part+.me-rb-part{padding-left:16px;border-left:1px solid ${UI.hairline}}
    .me-rb-part-label{display:flex;align-items:center;gap:5px;font:600 13px ${ME_SANS};line-height:1.35;letter-spacing:0;color:#BFC0C8;white-space:nowrap}
    .me-rb-info{flex:none;font:600 12px ${ME_SANS};border:1px solid ${UI.hairline};border-radius:50%;width:18px;height:18px;display:inline-flex;justify-content:center;align-items:center}
    .me-rb-number{display:flex;align-items:center;gap:9px;font:700 35px ${ME_MONO};line-height:1.2;letter-spacing:-.025em;margin-top:6px;font-variant-numeric:tabular-nums}
    .me-rb-part:last-child .me-rb-number{color:#e9c77e}
    .me-rb-equation{display:flex;justify-content:space-between;align-items:center;border-top:1px solid ${UI.hairline};margin-top:14px;padding-top:10px;font:500 12px ${ME_SANS};color:${UI.textMute};letter-spacing:.02em}
    .me-rb-equation strong{color:${UI.text};font-weight:600;font-size:12px}
    .me-house-history{display:inline-flex;align-items:center;justify-content:center;gap:8px;min-height:44px;padding:0 15px;border:1px solid #cba45e70;border-radius:999px;background:linear-gradient(180deg,#66502a45,#33271a30);color:#f2ddaf;font:600 14px ${ME_SANS};letter-spacing:.01em;cursor:pointer;white-space:nowrap;box-shadow:inset 0 1px 0 #ffe8b30c}
    .me-house-history svg{width:17px;height:17px;color:#e7bd73}
    .me-house-history:hover{border-color:#dfbc7ca0;background:linear-gradient(180deg,#79613650,#49361b40)}
    .me-house-history:active{transform:scale(.98)}
    .me-house-progress{margin-top:0;padding:0 0 4px;color:${UI.text}}
    .me-house-progress-head{display:flex;align-items:center;justify-content:space-between;gap:10px;margin-bottom:16px}
    .me-house-xp{font:700 25px ${ME_MONO};line-height:1;font-variant-numeric:tabular-nums;white-space:nowrap}
    .me-house-xp small{font:600 13px ${ME_SANS};color:#BFC0C8;margin-left:5px}
    .me-house-track{height:8px;background:#ffffff0c;border-radius:8px;position:relative;overflow:hidden;box-shadow:inset 0 1px 2px #0006}
    .me-house-track-fill{position:absolute;inset:0;border-radius:inherit;transform-origin:left;background:linear-gradient(90deg,${UI.accentPress},${UI.accent} 68%,#eb5262);transition:transform 550ms cubic-bezier(.2,.8,.2,1)}
    .me-house-track-mark{position:absolute;top:0;bottom:0;width:3px;background:#101115}
    .me-house-milestones{position:relative;height:30px;margin-top:10px;font:600 13px ${ME_MONO};color:${UI.textDim}}
    .me-house-milestones span{position:absolute;transform:translateX(-50%);display:inline-flex;gap:5px;align-items:center}
    .me-house-milestones span:last-child{right:0;left:auto!important;transform:none}
    .me-house-milestones [data-reached=true]{color:#dedee5}
    .me-house-extra{color:#e9c77e;font:600 14px ${ME_SANS};line-height:1.45;letter-spacing:0;margin-bottom:4px;display:flex;flex-wrap:wrap;align-items:baseline;column-gap:6px;row-gap:2px}.me-house-extra span{color:#BFC0C8!important}
    @media(prefers-reduced-motion:reduce){.me-cashback-cta[data-ready=true]{animation:none}.me-house-track-fill,.me-cashback-rim-fill{transition:none}}
    .me-screen,.me-screen *{box-sizing:border-box}
    .me-screen button{font-family:${ME_SANS};-webkit-tap-highlight-color:transparent;touch-action:manipulation}
    .me-screen button:focus-visible{outline:2px solid #fff;outline-offset:3px}
    @keyframes me-ring-glow{0%,100%{box-shadow:0 0 10px var(--ring-c),0 0 24px var(--ring-c2)}50%{box-shadow:0 0 18px var(--ring-c),0 0 42px var(--ring-c2)}}
    @keyframes me-rise{from{opacity:0;transform:translateY(10px)}to{opacity:1;transform:translateY(0)}}
    .me-overlay{position:absolute;inset:0;z-index:70;background:#101115;display:flex;flex-direction:column;animation:px-up 340ms cubic-bezier(.2,.8,.2,1) both}
    .me-top{position:relative;z-index:5;padding:62px 20px 8px;display:flex;align-items:center;justify-content:space-between}
    .me-back{width:36px;height:36px;border-radius:${UI.r.sm}px;background:rgba(255,255,255,.085);border:1px solid rgba(255,255,255,.18);display:flex;align-items:center;justify-content:center;cursor:pointer;padding:0}
    .me-title{font:700 15px ${ME_MONO};letter-spacing:.16em;color:#fff;display:inline-flex;align-items:center;gap:7px}
    .me-scroll{flex:1;min-height:0;overflow-y:auto;overflow-x:hidden;-webkit-overflow-scrolling:touch;position:relative;z-index:2}
    .me-card{margin:0 16px;border-radius:${UI.r.lg}px;background:${UI.surface1};border:1px solid ${UI.hairline}}
    .me-label{font:700 12px ${ME_SANS};letter-spacing:.16em;color:#8A8A93}
    .me-row{display:flex;align-items:center;gap:13px;width:100%;padding:15px 16px;cursor:pointer;background:transparent;border:0;border-top:1px solid rgba(255,255,255,.085);text-align:left;color:#fff}
    .me-row:first-child{border-top:0}
    .me-row-ic{width:36px;height:36px;border-radius:${UI.r.sm}px;flex:none;background:rgba(0,0,0,.34);border:1px solid rgba(255,255,255,.14);display:flex;align-items:center;justify-content:center}
    .me-row-t{display:block;font:500 13px ${ME_MONO};letter-spacing:.04em;color:#fff}
    .me-row-s{display:block;font:600 12px ${ME_SANS};color:#A9A9B2;letter-spacing:.03em;margin-top:3px}
    .me-stat{padding:13px 14px;border-radius:${UI.r.chip}px;background:rgba(255,255,255,.045);border:1px solid rgba(255,255,255,.1);min-width:0}
    .me-stat-l{font:700 12px ${ME_SANS};letter-spacing:.12em;color:#8A8A93;white-space:nowrap;overflow:hidden;text-overflow:ellipsis}
    .me-stat-v{font:700 19px ${ME_MONO};color:#fff;margin-top:7px;line-height:1;white-space:nowrap;font-variant-numeric:tabular-nums}
    .me-stat-s{font:600 12px ${ME_SANS};color:#A9A9B2;margin-top:6px;white-space:nowrap;overflow:hidden;text-overflow:ellipsis}
    .me-seg{display:flex;background:#25262e;border-radius:${UI.r.pill}px;padding:3px}
    .me-seg button{flex:1;min-height:44px;border-radius:${UI.r.pill}px;border:0;cursor:pointer;background:transparent;color:rgba(255,255,255,.74);font:700 13px ${ME_SANS};letter-spacing:.06em;transition:background 160ms}
    .me-seg button[aria-pressed=true]{background:${UI.accent};color:#fff}
    .me-hint{font:500 13px ${ME_SANS};line-height:1.55;color:#A9A9B2;text-wrap:pretty}
    /* ізометричний шлях усередині «Я»: док і так нижче, панель притискаємо до низу */
    .me-screen .rb-iso-viewport{inset:0 0 0}
    .rb-iso-ruler{position:absolute;right:10px;top:36px;bottom:104px;width:74px;z-index:6;pointer-events:auto;touch-action:none;cursor:ns-resize;overflow:hidden;mask-image:linear-gradient(transparent,#000 18%,#000 82%,transparent);-webkit-mask-image:linear-gradient(transparent,#000 18%,#000 82%,transparent)}
    .rb-iso-ruler-track{position:absolute;left:0;right:0;top:0;will-change:transform}
    .rb-iso-tick{position:absolute;right:0;height:${RULER_SP_CSS}px;width:100%;display:flex;align-items:center;justify-content:flex-end;gap:6px}
    .rb-iso-tick i{display:block;width:10px;height:1.5px;background:#e9c77e;opacity:.32;border-radius:1px;transition:width .25s,opacity .25s}
    .rb-iso-tick[data-owned=true] i{opacity:.55}
    .rb-iso-tick[data-rank=true] i{width:16px;opacity:.7}
    .rb-iso-tick[data-legend=true] i{background:#fff0c4;opacity:.85;box-shadow:0 0 6px #e9c77e}
    .rb-iso-tick[data-sel=true] i{width:24px;height:2.5px;opacity:1;background:#ffe9a8;box-shadow:0 0 10px #e9c77e}
    /* поточна карта гравця: червона рисочка з крапкою, помітна і коли не в фокусі */
    .rb-iso-tick[data-current=true] i{width:22px;height:2.5px;opacity:1;background:#ff5c6a;box-shadow:0 0 8px #ff5c6a99}
    .rb-iso-tick[data-current=true]::before{content:'';width:6px;height:6px;border-radius:50%;background:#ff5c6a;box-shadow:0 0 6px #ff5c6a}
    .rb-iso-tick[data-current=true][data-sel=true] i{width:26px;background:#ff8993;box-shadow:0 0 12px #ff5c6a}
    .rb-iso-tick-rank{font:600 12px ${ME_MONO};color:#e9c77e;opacity:.6}
    .rb-iso-tick-val{font:700 13px ${ME_MONO};color:#ffe9a8;text-shadow:0 0 12px #e9c77e88;white-space:nowrap}
    .rb-iso-value{position:absolute;left:18px;right:96px;top:0;height:33%;display:flex;flex-direction:column;justify-content:center;z-index:6;text-align:left;pointer-events:none}
    .rb-iso-value-unit{font:700 12px ${ME_SANS};color:#8A8A93;letter-spacing:.18em;margin-top:8px;white-space:nowrap}
    .rb-iso-value-big{font:700 44px ${ME_MONO};line-height:1;color:#ffe9a8;text-shadow:0 0 22px #e9c77e55;white-space:nowrap;margin-top:6px;letter-spacing:-.01em}
    .rb-iso-value-l{font:700 12px ${ME_SANS};letter-spacing:.18em;color:#8A8A93;white-space:nowrap}
    .rb-iso-value-d{display:inline-flex;align-items:center;padding:3px 8px;border-radius:999px;font:700 12px ${ME_MONO};background:rgba(159,240,182,.12);color:#9ff0b6;white-space:nowrap}
    .rb-iso-value-s{font:500 12px ${ME_SANS};color:#a9b1bb;margin-top:8px;white-space:nowrap;overflow:hidden;text-overflow:ellipsis}
    .rb-iso-counter{position:absolute;top:10px;right:18px;z-index:6;font:500 12px ${ME_MONO};color:#aab3bf;letter-spacing:.06em;display:flex;align-items:center;gap:8px}.rb-iso-counter b{font-weight:700;font-size:16px;color:#fff}.rb-iso-counter-ready{padding:2px 8px;border-radius:999px;background:#1f3a2a;color:#9ff0b6;font:700 12px ${ME_SANS};letter-spacing:.1em}
    .me-screen .rb-iso-level[data-focused=true]{display:none}
    .me-screen .rb-iso-panel{bottom:0;padding-top:10px}
    .me-screen .rb-iso-panel-slim .rb-iso-meta{margin-bottom:4px}
    .me-screen .rb-iso-panel-slim .rb-iso-status{margin-top:0;min-height:18px;font-size:12px;padding-right:76px}
    .me-screen .rb-iso-panel-slim .rb-iso-meta{padding-right:76px}
    .me-screen .rb-iso-panel-slim{min-height:76px}
    .me-screen .rb-iso-next{position:absolute;left:18px;right:18px;top:0;z-index:6;pointer-events:none}
    .me-screen .rb-iso-next-row{display:flex;justify-content:space-between;align-items:center;gap:10px;margin-bottom:8px}
    .me-screen .rb-iso-next-l{display:flex;align-items:center;gap:6px;min-width:0;font:600 12px ${ME_SANS};letter-spacing:0;line-height:1.35;color:#C5C5CD}.me-screen .rb-iso-next-status{white-space:nowrap}
    .me-screen .rb-iso-next-l b{font:700 22px ${ME_SANS};letter-spacing:0;color:#fff;white-space:nowrap;flex:none}
    .me-screen .rb-iso-next-v{font:600 15px ${ME_SANS};color:#fff;white-space:nowrap;font-variant-numeric:tabular-nums}
    .me-screen .rb-iso-total{position:relative;top:auto;left:0;right:0;height:5px;border-radius:3px}
    .me-screen .rb-iso-total>span{box-shadow:0 0 8px #d7192188}
    .me-screen .rb-iso-value{top:45px;height:auto;padding-top:22px;justify-content:flex-start}
    .rb-iso-tap{position:absolute;left:50%;bottom:0;width:280px;height:360px;transform:translateX(-50%);z-index:5;background:none;border:0;padding:0}
    .me-screen .rb-iso-legend-intro{display:none}
    .me-screen .rb-iso[data-legend=true] .rb-iso-legend-light{opacity:.05}
    .me-screen .rb-iso[data-ready=true] .rb-iso-legend-light{opacity:.03}
    .me-screen .rb-iso-level[data-locked=true] .rb-iso-level-label{color:#8a94a3;background:#0d1015ec}
    .rb-iso-lock{font-size:12px;margin-right:2px;filter:grayscale(1) brightness(1.4)}
    .me-screen .rb-iso-level[data-focused=true] .rb-iso-level-label{top:118px}
    .me-screen .rb-iso-here{top:150px}
    .me-screen .rb-iso-count{display:none}
    .me-screen .rb-iso-hint{display:none}
    .rb-iso-hint-inline{font:500 12px ${ME_SANS};color:#8494a8;letter-spacing:.02em}
    .me-screen .rb-iso-title strong{font-size:24px}.me-screen .rb-iso-title span{font-size:15px}
    .me-screen .rb-iso-status{font-size:13px;margin-top:5px}
    .me-screen .rb-iso-actions{margin-top:9px}.me-screen .rb-iso-arrow{width:44px;height:44px}.me-screen .rb-iso-open{min-height:44px;font-size:13px}
    @media(prefers-reduced-motion:reduce){.me-screen *{animation:none!important}}
  `;
  document.head.appendChild(st);
}

// ── Кільце доміка ─────────────────────────────────────────────────────
// Мініатюра зібраного доміка в колі; рамка кола — прогрес будівництва.
// Заповнене кільце світиться: домік готовий, можна забирати.
function MeRakebackButton({
  xp = 0,
  th = 1000,
  onClick
}) {
  const progress = Math.min(1, Math.max(0, xp / Math.max(1, th))),
    ready = progress >= 1;
  const rim = "M60 2 H98 A20 20 0 0 1 98 42 H22 A20 20 0 0 1 22 2 H60";
  return /*#__PURE__*/React.createElement("button", {
    className: "me-cashback-cta",
    "data-ready": ready,
    "data-i18n": "off",
    "aria-label": "\u0420\u0435\u0439\u043A\u0431\u0435\u043A",
    title: ready ? 'Рейкбек готов к получению' : `Домик построен на ${Math.round(progress * 100)}%`,
    onClick: onClick
  }, /*#__PURE__*/React.createElement("svg", {
    className: "me-cashback-rim",
    viewBox: "0 0 120 44",
    role: "progressbar",
    "aria-label": "\u0413\u043E\u0442\u043E\u0432\u043D\u043E\u0441\u0442\u044C \u0440\u0435\u0439\u043A\u0431\u0435\u043A\u0430",
    "aria-valuemin": "0",
    "aria-valuemax": "100",
    "aria-valuenow": Math.round(progress * 100)
  }, /*#__PURE__*/React.createElement("path", {
    d: rim,
    fill: "none",
    stroke: "#e8bc672e",
    strokeWidth: "2"
  }), /*#__PURE__*/React.createElement("path", {
    className: "me-cashback-rim-fill",
    d: rim,
    fill: "none",
    stroke: "#ffe0a0",
    strokeWidth: "2",
    pathLength: "100",
    strokeDasharray: "100",
    strokeDashoffset: 100 - progress * 100,
    strokeLinecap: progress > 0 ? 'round' : 'butt'
  })), "\u0420\u0415\u0419\u041A\u0411\u0415\u041A");
}
function HouseRing({
  xp = 0,
  th = 1000,
  color = "#2FA84F",
  size = 54,
  onClick,
  style
}) {
  const pct = Math.max(0, Math.min(1, xp / th)),
    full = xp >= th;
  const r = size / 2 - 3,
    C = 2 * Math.PI * r;
  const ink = full ? "#f0c75e" : color;
  return /*#__PURE__*/React.createElement("button", {
    onClick: onClick,
    "aria-label": full ? "Card house is built. Collect the reward" : `Card house · ${Math.round(pct * 100)}%`,
    style: Object.assign({
      position: "relative",
      width: size,
      height: size,
      borderRadius: "50%",
      flex: "none",
      padding: 0,
      cursor: "pointer",
      background: full ? "radial-gradient(circle at 50% 40%, #3a2f12, #15130c 70%)" : "rgba(0,0,0,.42)",
      border: 0,
      "--ring-c": ink + "aa",
      "--ring-c2": ink + "55",
      animation: full ? "me-ring-glow 1.8s ease-in-out infinite" : "none",
      boxShadow: full ? `0 0 12px ${ink}aa` : "0 6px 16px rgba(0,0,0,.4)"
    }, style || {})
  }, /*#__PURE__*/React.createElement("svg", {
    width: size,
    height: size,
    viewBox: `0 0 ${size} ${size}`,
    style: {
      position: "absolute",
      inset: 0,
      transform: "rotate(-90deg)"
    },
    "aria-hidden": "true"
  }, /*#__PURE__*/React.createElement("circle", {
    cx: size / 2,
    cy: size / 2,
    r: r,
    fill: "none",
    stroke: "rgba(255,255,255,.14)",
    strokeWidth: "3"
  }), /*#__PURE__*/React.createElement("circle", {
    cx: size / 2,
    cy: size / 2,
    r: r,
    fill: "none",
    stroke: ink,
    strokeWidth: "3",
    strokeLinecap: "round",
    strokeDasharray: C,
    strokeDashoffset: C * (1 - pct),
    style: {
      transition: "stroke-dashoffset .6s ease"
    }
  })), /*#__PURE__*/React.createElement("svg", {
    width: size * .56,
    height: size * .56,
    viewBox: "0 0 30 30",
    fill: "none",
    stroke: full ? "#ffe9a8" : "#fff",
    strokeWidth: "1.9",
    strokeLinecap: "round",
    strokeLinejoin: "round",
    style: {
      position: "absolute",
      left: "50%",
      top: "50%",
      transform: "translate(-50%,-50%)",
      opacity: full ? 1 : .55 + pct * .45
    },
    "aria-hidden": "true"
  }, /*#__PURE__*/React.createElement("path", {
    d: "M4 27l4-8 4 8M11 27l4-8 4 8M18 27l4-8 4 8"
  }), /*#__PURE__*/React.createElement("path", {
    d: "M7.5 18.5l4-7.5 4 7.5M14.5 18.5l4-7.5 4 7.5"
  }), /*#__PURE__*/React.createElement("path", {
    d: "M11 10.5L15 3l4 7.5"
  })), full && /*#__PURE__*/React.createElement("span", {
    style: {
      position: "absolute",
      right: -2,
      top: -2,
      width: 14,
      height: 14,
      borderRadius: "50%",
      background: "#f0c75e",
      border: "2px solid #101115",
      boxShadow: "0 0 8px #f0c75e"
    }
  }));
}

// ── 3D домік: три етапи ────────────────────────────────────────────────
//   0 XP    — купа карт лежить перед майданчиком
//   333 XP  — 1-й поверх: три А-рамки (6 карт) + 2 плоскі карти-перекриття
//   666 XP  — 2-й поверх: дві А-рамки (4 карти) + 1 перекриття
//   1000 XP — дах: одна А-рамка (2 карти) по центру
// Карти, що ще не в будівлі, лежать у купі; при новому етапі перелітають
// на місце. «Забрати» — домік розсипається.
function meHouseMarks(th) {
  return [Math.floor(th / 3), Math.floor(th * 2 / 3), th];
}
function meHouseStage(xp, th) {
  const m = meHouseMarks(th);
  if (xp >= m[2]) return 3;
  if (xp >= m[1]) return 2;
  if (xp >= m[0]) return 1;
  return 0;
}
function RbHouseStages3D({
  stage = 0,
  level = null,
  lg,
  w = 402,
  h = 400,
  collapse = false,
  onCollapsed,
  autoRotate = true,
  zoom = 1,
  energy = 1,
  materialTier = 1,
  rotationSpeed = .12
}) {
  const ref = React.useRef(null),
    three = React.useRef(null),
    state = React.useRef({
      orbit: .42,
      tilt: .27,
      drag: null,
      age: 0,
      fall: null
    });
  const callback = React.useRef(onCollapsed);
  callback.current = onCollapsed;
  const buildLevel = level == null ? [1, 4, 9, 13][stage] || 1 : Math.max(1, Math.min(13, level));
  const stageRef = React.useRef(buildLevel);
  const [failed, setFailed] = React.useState(false);
  const CH = window.CH3D;
  React.useEffect(() => {
    if (!CH || !CH.ok() || !ref.current) return;
    let r;
    try {
      const T = window.THREE;
      r = CH.renderer(ref.current, w, h, 1.6);
      const scene = new T.Scene(),
        cam = new T.PerspectiveCamera(31, w / h, .1, 70),
        env = CH.envFor(r),
        root = new T.Group();
      scene.add(root);
      scene.add(new T.HemisphereLight(0xf5f7ff, 0x68788e, 1.15));
      const key = new T.DirectionalLight(0xffffff, 1.25);
      key.position.set(-3, 6, 5);
      scene.add(key);
      const rim = new T.DirectionalLight(0x8ca7ff, .8);
      rim.position.set(5, 1, -5);
      scene.add(rim);
      const CW = .52,
        HH = .76,
        lean = .37,
        AH = HH * Math.cos(lean),
        off = HH * Math.sin(lean) / 2,
        FLAT = .012,
        TIER = AH + FLAT + .012;
      const RANKS = window.cmLeague.RANKS;
      // Four physical cards per unlocked rank. Supports are built before the next floor.
      const poses = [];
      const frame = (x, y, z) => {
        for (const sign of [-1, 1]) poses.push({
          pos: [x + sign * off, y + AH / 2, z],
          rot: [0, sign > 0 ? -Math.PI / 2 : Math.PI / 2, sign * lean],
          order: 'ZYX'
        });
      };
      const flat = (x, y, z) => poses.push({
        pos: [x, y, z],
        rot: [-Math.PI / 2, 0, Math.PI / 2],
        order: 'XYZ'
      });
      const rows = [.27, -.27];
      // Begin with two neighbouring A-frames: exactly four twos.
      for (const xs of [[-.31, .31], [-.93, .93]]) for (const z of rows) for (const x of xs) frame(x, 0, z);
      for (let floor = 0; floor < 3; floor++) {
        const count = 3 - floor,
          y = floor * TIER;
        for (const z of rows) for (let i = 0; i < count; i++) flat((i - (count - 1) / 2) * .62, y + AH + FLAT, z);
        for (const z of rows) for (let i = 0; i < count; i++) frame((i - (count - 1) / 2) * .62, (floor + 1) * TIER, z);
      }
      poses.forEach((p, i) => {
        p.stage = Math.floor(i / 4) + 1;
        p.rank = RANKS[p.stage - 1];
      });
      const builtPoses = poses.filter(p => p.stage <= Math.max(1, buildLevel));
      const height = Math.max(AH, ...builtPoses.map(p => p.pos[1] + (p.order === 'ZYX' ? AH / 2 : FLAT)));
      root.position.y = -height * .5;
      const pileAt = (i, st) => {
        if (st > 0) {
          // будівництво почалося: решта карт лежить плоско навколо підніжжя домика (при будь-якому куті обертання)
          const ang = i * 2.399 + .7,
            r = 1.3 + i % 2 * .28 + Math.sin(i * 12.9898) * .06,
            spin = ang + Math.PI / 2 + Math.sin(i * 39.17) * .3;
          return {
            pos: new T.Vector3(Math.cos(ang) * r, .008 + i % 3 * .012, Math.sin(ang) * r),
            rot: new T.Euler(-Math.PI / 2, 0, spin, "XYZ")
          };
        }
        const jx = Math.sin(i * 12.9898) * .3,
          jz = Math.cos(i * 78.233) * .24 + .1,
          spin = Math.sin(i * 39.17) * .8 + i % 3 * .2,
          tip = i % 4 === 3 ? .1 : 0;
        return {
          pos: new T.Vector3(jx, .008 + i * .009 + tip * .3, jz),
          rot: new T.Euler(-Math.PI / 2 + tip, 0, spin, "XYZ")
        };
      };
      const cards = poses.map((p, i) => {
        const card = CH.makeCard({
          rank: p.rank,
          lg: window.cmLeague.LEAGUES[i % 4],
          w: CW,
          h: HH,
          d: .012,
          env,
          emblem: true,
          classic: true
        });
        // купа: недбала стопка карт. Поки будинку немає — по центру майданчика; коли будівництво
        // почалося — зсувається вперед-праворуч, щоб не заважати каркасу (див. pileAt)
        card.userData.pile = pileAt(i, stage);
        card.userData.home = {
          pos: new T.Vector3(...p.pos),
          rot: new T.Euler(p.rot[0], p.rot[1], p.rot[2], p.order)
        };
        card.userData.stage = p.stage;
        card.userData.built = p.stage <= buildLevel;
        card.userData.t = 1;
        card.userData.delay = i % 8 * .06;
        const from = card.userData.built ? card.userData.home : card.userData.pile;
        card.position.copy(from.pos);
        card.rotation.copy(from.rot);
        card.visible = card.userData.built;
        // Unlocked construction is always solid; rake-cycle progress never ghosts cards.
        card.traverse(m => {
          if (m.isMesh && m.material) {
            const mats = Array.isArray(m.material) ? m.material : [m.material];
            mats.forEach(mat => {
              mat.transparent = false;
              mat.opacity = 1;
              mat.depthWrite = true;
              if (mat.metalness != null) mat.metalness = materialTier >= 3 ? .35 : .12;
              // менше відблисків при обертанні: приглушене оточення, матовіший лак
              if (mat.envMapIntensity != null) mat.envMapIntensity = Math.min(mat.envMapIntensity, materialTier >= 3 ? .45 : .3);
              if (mat.clearcoat != null) mat.clearcoat = Math.min(mat.clearcoat, .3);
              if (mat.clearcoatRoughness != null) mat.clearcoatRoughness = Math.max(mat.clearcoatRoughness, .35);
              if (mat.roughness != null) mat.roughness = Math.max(mat.roughness, .42);
              if (materialTier === 4 && mat.color) mat.color.set(0xe1c386);
            });
          }
        });
        root.add(card);
        return card;
      });
      // тонка підлога-майданчик, щоб купа і будівля читалися на одній площині
      const pad = new T.Mesh(new T.CylinderGeometry(1.75, 1.75, .02, 64), new T.MeshPhysicalMaterial({
        color: 0x1b2027,
        metalness: .6,
        roughness: .45,
        envMap: env,
        envMapIntensity: .5,
        transparent: true,
        opacity: .55
      }));
      pad.position.y = -.012;
      pad.visible = false;
      root.add(pad);
      const innerLight = new T.PointLight(0xeac479, 0, 6);
      innerLight.position.set(0, .65, 0);
      root.add(innerLight);
      // Inspect the unlocked object up close, including the four-card starter.
      // Construction follows accumulation; the camera frames its actual bounds.
      const minZ = Math.min(...builtPoses.map(p => p.pos[2])),
        maxZ = Math.max(...builtPoses.map(p => p.pos[2]));
      const centerZ = (minZ + maxZ) * .5;
      cards.forEach(c => {
        c.position.z -= centerZ;
        c.userData.home.pos.z -= centerZ;
      });
      const extentX = Math.max(...builtPoses.map(p => Math.abs(p.pos[0]))) + HH * .19;
      const extentZ = (maxZ - minZ) * .5 + CW * .5;
      const orbitRadius = Math.hypot(extentX, extentZ);
      const dist = Math.max(height * .67, orbitRadius * .95 / (w / h)) / Math.tan(cam.fov * Math.PI / 360) * 1.12;
      cam.position.set(0, dist * .33, dist * .94);
      cam.lookAt(0, 0, 0);
      state.current.age = 0;
      state.current.fall = null;
      three.current = {
        r,
        scene,
        cam,
        root,
        cards,
        dist,
        T,
        pileAt,
        innerLight
      };
    } catch (e) {
      console.warn("house3d:", e.message);
      if (r) r.dispose();
      setFailed(true);
    }
    return () => {
      const d = three.current;
      if (d) CH.release(d.scene, d.r);
      three.current = null;
    };
  }, [lg && lg.id, w, h, materialTier, buildLevel]);
  // зміна етапу: карти перелітають з купи на місце (або назад)
  React.useEffect(() => {
    stageRef.current = buildLevel;
    const d = three.current;
    if (!d) return;
    d.cards.forEach((c, i) => {
      const built = c.userData.stage <= buildLevel,
        pile = d.pileAt(i, stage),
        moved = !pile.pos.equals(c.userData.pile.pos);
      c.userData.pile = pile;
      if (built !== c.userData.built || !built && moved) {
        c.userData.built = built;
        c.userData.t = 0;
        c.userData.from = {
          pos: c.position.clone(),
          rot: c.rotation.clone()
        };
      }
    });
    if (window.playClick && d.cards.some(c => c.userData.t === 0)) window.playClick(1300, .04);
  }, [buildLevel]);
  React.useEffect(() => {
    if (!collapse) {
      state.current.fall = null;
      const d = three.current;
      if (d) d.cards.forEach((c, i) => {
        const u = c.userData;
        if (!u.built) {
          u.pile = d.pileAt(i, stageRef.current);
          c.scale.setScalar(1);
          const fromPos = u.pile.pos.clone();
          fromPos.y += 1.7;
          u.from = {
            pos: fromPos,
            rot: u.pile.rot.clone()
          };
          u.t = 0;
          u.delay = i % 8 * .05;
        }
      });
      return;
    }
    if (!three.current) {
      const id = setTimeout(() => callback.current && callback.current(), 900);
      return () => clearTimeout(id);
    }
    const d = three.current,
      T = d.T,
      items = [];
    d.cards.filter(c => c.userData.built).forEach((c, i) => {
      items.push({
        c,
        p: c.position.clone(),
        rot: c.rotation.clone(),
        v: new T.Vector3(Math.sin(i * 2.4) * 1.5, 1.8 + i % 3 * .17, Math.cos(i * 2.4) * 1.4),
        i
      });
    });
    state.current.fall = {
      t: 0,
      items,
      done: false
    };
  }, [collapse]);
  window.chUseLoop3D(ref, (dt, t) => {
    const d = three.current;
    if (!d) return;
    const s = state.current,
      reduced = window.matchMedia("(prefers-reduced-motion: reduce)").matches;
    s.age += dt;
    if (s.drag) {
      s.orbit += s.drag.dx * .011;
      s.tilt = Math.max(.08, Math.min(.67, s.tilt + s.drag.dy * .003));
      s.drag.dx = s.drag.dy = 0;
    } else if (autoRotate && !reduced && !s.fall) s.orbit += dt * rotationSpeed;
    d.root.rotation.y = s.orbit;
    d.innerLight.intensity = .16;
    d.cam.position.set(0, Math.sin(s.tilt) * d.dist / zoom, Math.cos(s.tilt) * d.dist / zoom);
    d.cam.lookAt(0, -.05, 0);
    if (!s.fall) d.cards.forEach(c => {
      c.visible = c.userData.built;
      const u = c.userData;
      if (c.scale.x !== 1) c.scale.setScalar(1);
      if (u.t >= 1) return;
      u.t = reduced ? 1 : Math.min(1, u.t + dt / .9);
      const k = Math.max(0, Math.min(1, u.t * 1.35 - u.delay)),
        e = 1 - Math.pow(1 - k, 3);
      const from = u.from || (u.built ? u.pile : u.home),
        to = u.built ? u.home : u.pile;
      if (u.t >= 1) u.from = null;
      c.position.lerpVectors(from.pos, to.pos, e);
      c.position.y += Math.sin(Math.PI * e) * .5;
      const qa = new d.T.Quaternion().setFromEuler(from.rot),
        qb = new d.T.Quaternion().setFromEuler(to.rot);
      c.quaternion.copy(qa).slerp(qb, e);
    });
    if (s.fall) {
      const f = s.fall;
      f.t += dt;
      f.items.forEach(({
        c,
        p,
        rot,
        v,
        i
      }) => {
        const q = Math.max(0, f.t - .12);
        c.position.copy(p).addScaledVector(v, q);
        c.position.y -= 3.4 * q * q;
        c.rotation.set(rot.x + q * (2 + i % 3), rot.y + q * (i % 2 ? 3 : -3), rot.z + q);
        c.scale.setScalar(Math.max(.001, 1 - Math.max(0, q - .75)));
      });
      if (!f.done && f.t > (reduced ? .25 : 1.55)) {
        f.done = true;
        callback.current && callback.current();
      }
    }
    d.r.render(d.scene, d.cam);
  }, [lg && lg.id, w, h, autoRotate, zoom, rotationSpeed]);
  if (!CH || !CH.ok() || failed) return /*#__PURE__*/React.createElement("div", {
    style: {
      width: "100%",
      height: h,
      display: "grid",
      placeItems: "center",
      color: "#c2c9d2",
      textAlign: "center",
      fontFamily: ME_SANS
    }
  }, "\u2666 \u2663 \u2665 \u2660 \u25CF", /*#__PURE__*/React.createElement("br", null), "3D is not available on this device.", /*#__PURE__*/React.createElement("br", null), /*#__PURE__*/React.createElement("span", {
    "data-i18n": "off"
  }, stage, " / 3"));
  return /*#__PURE__*/React.createElement("canvas", _extends({
    key: `${lg && lg.id}:${w}:${h}:${buildLevel}:${materialTier}`,
    ref: ref,
    width: w,
    height: h,
    role: "img",
    "data-house-level": buildLevel,
    "data-house-cards": buildLevel * 4,
    "aria-label": `Домик: уровень ${buildLevel} из 13, ${buildLevel * 4} карт. Потяните, чтобы повернуть.`
  }, window.chPointer3D(state), {
    onPointerUp: () => state.current.drag = null,
    style: {
      width: "100%",
      height: "auto",
      aspectRatio: `${w}/${h}`,
      display: "block",
      touchAction: "pan-y",
      cursor: "grab"
    }
  }));
}

// ── Екран карткового доміка ───────────────────────────────────────────
// Пояснення базового рейкбеку — компактний лист знизу (текст Вадима, 18.09.2026)
const ME_BASE_RB_INFO = [["ДИСТАНЦИЯ", "Основа расчёта — ваши результаты на длинной дистанции."], ["ТЕКУЩАЯ ИГРА", "Модель чувствительна к тому, как вы играете сейчас."], ["АКТИВНОСТЬ", "Объём игры за столами весит больше, чем раньше."], ["ФОРМАТ", "Тип игры, лимиты и игровая динамика учитываются отдельно."]];
function MeCardIcon({
  level,
  w = 22,
  h = 30
}) {
  const L = window.cmLeague,
    lg = L.forLevel(level),
    rank = L.rankForLevel(level),
    k = w / 16;
  return /*#__PURE__*/React.createElement("span", {
    "data-i18n": "off",
    "aria-label": rank + lg.suit,
    style: {
      display: "inline-flex",
      flexDirection: "column",
      alignItems: "center",
      justifyContent: "center",
      width: w,
      height: h,
      borderRadius: 3 * k,
      background: `linear-gradient(160deg, ${L.shade(lg.color, 30)}, ${lg.color} 55%, ${L.shade(lg.color, -35)})`,
      boxShadow: `0 0 0 1px rgba(255,255,255,.22), 0 2px 6px ${lg.color}66`,
      color: "#fff",
      lineHeight: 1,
      flex: "none"
    }
  }, /*#__PURE__*/React.createElement("span", {
    style: {
      fontFamily: ME_MONO,
      fontWeight: 700,
      fontSize: 8.5 * k
    }
  }, rank), /*#__PURE__*/React.createElement("span", {
    style: {
      fontFamily: ME_SANS,
      fontSize: (lg.id === "dot" ? 6 : 8) * k,
      marginTop: 1
    }
  }, lg.suit));
}
// Shared header: avatar, nickname, transparent rank + suit.
function PxIdentity({
  nick = "SASHA02",
  avatar = "assets/avatar.png",
  size = 48,
  ring = 3,
  nickSize = 17,
  cardW = 16,
  onClick,
  style
}) {
  const level = (window.cmPlayer || {}).level || 14;
  const variant = Number(new URLSearchParams(location.search).get('statusConcept')) || 0;
  const rank = window.cmLeague.rankForLevel(level),
    rankName = rank === 'Q' ? 'QUEEN' : rank === 'K' ? 'KING' : rank === 'J' ? 'JACK' : rank === 'A' ? 'ACE' : rank;
  const label = {
    fontFamily: ME_SANS,
    fontSize: 12,
    fontWeight: 600,
    lineHeight: '16px',
    letterSpacing: '.045em',
    whiteSpace: 'nowrap'
  };
  const gold = '#debf88',
    silver = '#d8d9df';
  const rankCircle = {
    display: 'inline-grid',
    placeItems: 'center',
    width: 19,
    height: 19,
    borderRadius: '50%',
    fontFamily: ME_SANS,
    fontSize: 12,
    fontWeight: 700,
    lineHeight: 1,
    letterSpacing: 0,
    flex: 'none',
    color: '#18191d',
    background: 'linear-gradient(135deg,#fafafa,#a5a8b0)',
    boxShadow: '0 1px 4px #0008'
  };
  const mini = /*#__PURE__*/React.createElement("span", {
    "data-i18n": "off",
    style: {
      display: 'inline-grid',
      placeItems: 'center',
      width: 17,
      height: 23,
      borderRadius: 3,
      background: '#f7f6f2',
      color: '#18191d',
      font: '700 16px Georgia,serif',
      boxShadow: '0 2px 5px #0006',
      flex: 'none',
      letterSpacing: 0
    }
  }, rank);
  const rbLabel = {
    ...label,
    fontSize: 12,
    letterSpacing: '.025em',
    display: 'inline-flex',
    alignItems: 'center',
    gap: 6,
    height: 20
  };
  const sub = variant === 20 ? /*#__PURE__*/React.createElement("span", {
    style: {
      width: 94,
      display: 'flex',
      flexDirection: 'column',
      gap: 3
    }
  }, /*#__PURE__*/React.createElement("span", {
    style: {
      ...label,
      fontSize: 12,
      color: silver,
      display: 'flex',
      justifyContent: 'space-between'
    }
  }, "RAKEBACK ", /*#__PURE__*/React.createElement("b", {
    style: {
      color: gold
    }
  }, "Q \u2192 K")), /*#__PURE__*/React.createElement("span", {
    style: {
      height: 3,
      borderRadius: 4,
      background: '#ffffff20',
      overflow: 'hidden'
    }
  }, /*#__PURE__*/React.createElement("span", {
    style: {
      display: 'block',
      width: '68%',
      height: '100%',
      background: gold
    }
  }))) : variant === 21 ? /*#__PURE__*/React.createElement("span", {
    style: {
      ...label,
      color: gold,
      fontSize: 12,
      letterSpacing: '.08em'
    }
  }, "QUEEN ", /*#__PURE__*/React.createElement("span", {
    style: {
      fontSize: 12,
      color: '#9898a2',
      letterSpacing: 0
    }
  }, "RAKEBACK")) : variant === 22 ? /*#__PURE__*/React.createElement("span", {
    style: {
      display: 'flex',
      alignItems: 'center',
      gap: 5
    }
  }, /*#__PURE__*/React.createElement("span", {
    style: {
      ...label,
      fontSize: 12,
      color: silver
    }
  }, "RAKEBACK"), /*#__PURE__*/React.createElement("span", {
    style: {
      display: 'flex',
      gap: 2
    }
  }, [1, 2, 3, 4, 5].map(n => /*#__PURE__*/React.createElement("i", {
    key: n,
    style: {
      display: 'block',
      height: 9,
      width: 3,
      borderRadius: 2,
      background: n < 4 ? gold : '#ffffff24'
    }
  })))) : variant === 23 ? /*#__PURE__*/React.createElement("span", {
    style: {
      ...label,
      fontSize: 12,
      color: silver
    }
  }, "RAKEBACK ", /*#__PURE__*/React.createElement("b", {
    style: {
      color: gold,
      fontSize: 12
    }
  }, "+$1.96")) : variant === 26 ? /*#__PURE__*/React.createElement("span", {
    style: {
      ...label,
      fontSize: 12,
      color: silver
    }
  }, "RAKEBACK ", /*#__PURE__*/React.createElement("b", {
    style: {
      color: gold
    }
  }, "Q"), /*#__PURE__*/React.createElement("span", {
    style: {
      width: 5,
      height: 5,
      background: '#d7b980',
      borderRadius: '50%',
      boxShadow: '0 0 7px #d7b98088'
    }
  })) : variant === 11 ? /*#__PURE__*/React.createElement("span", {
    style: {
      ...rbLabel,
      color: '#bfc0c8'
    }
  }, "RAKEBACK ", /*#__PURE__*/React.createElement("b", {
    style: {
      fontSize: 14,
      color: gold
    }
  }, rank)) : variant === 12 ? /*#__PURE__*/React.createElement("span", {
    style: {
      ...rbLabel,
      color: '#bfc0c8'
    }
  }, "RAKEBACK ", /*#__PURE__*/React.createElement("b", {
    style: {
      ...rankCircle,
      width: 18,
      height: 18,
      fontSize: 12
    }
  }, rank)) : variant === 13 ? /*#__PURE__*/React.createElement("span", {
    style: {
      ...rbLabel,
      color: '#d4d4db',
      background: 'linear-gradient(#ffffff0d,#ffffff04)',
      border: '1px solid #ffffff20',
      padding: '0 7px',
      borderRadius: 12,
      fontSize: 12,
      gap: 7
    }
  }, "RAKEBACK ", /*#__PURE__*/React.createElement("b", {
    style: {
      color: gold,
      fontSize: 12
    }
  }, rank)) : variant === 14 ? /*#__PURE__*/React.createElement("span", {
    style: {
      ...rbLabel,
      color: '#c7c7cf',
      borderLeft: '2px solid #d71921',
      paddingLeft: 6,
      height: 15,
      gap: 5
    }
  }, "RAKEBACK ", /*#__PURE__*/React.createElement("b", {
    style: {
      color: '#fff',
      fontSize: 13
    }
  }, rank)) : variant === 15 ? /*#__PURE__*/React.createElement("span", {
    style: {
      ...rbLabel,
      color: '#bfc0c8',
      gap: 5,
      fontSize: 12
    }
  }, "RAKEBACK ", /*#__PURE__*/React.createElement("b", {
    style: {
      color: gold,
      fontSize: 12
    }
  }, "+", window.cmLeague.rbExtra(level), "%")) : variant === 1 ? /*#__PURE__*/React.createElement("span", {
    style: {
      ...label,
      color: silver
    }
  }, rankName) : variant === 2 ? /*#__PURE__*/React.createElement("span", {
    style: {
      ...label,
      color: gold
    }
  }, /*#__PURE__*/React.createElement("b", {
    style: {
      color: '#fff'
    }
  }, rank), /*#__PURE__*/React.createElement("span", {
    style: {
      color: '#6f7079',
      margin: '0 6px'
    }
  }, "\xB7"), "+42% RB") : variant === 5 ? /*#__PURE__*/React.createElement("span", {
    style: {
      ...label,
      color: silver,
      borderLeft: '2px solid #d71921',
      paddingLeft: 7
    }
  }, rankName) : variant === 7 ? /*#__PURE__*/React.createElement("span", {
    style: {
      ...label,
      color: gold,
      borderTop: '1px solid #c6a76955',
      paddingTop: 3,
      width: '100%',
      display: 'flex',
      justifyContent: 'space-between',
      gap: 10
    }
  }, /*#__PURE__*/React.createElement("b", null, rank), /*#__PURE__*/React.createElement("span", {
    style: {
      color: '#aaaab4',
      fontSize: 12
    }
  }, "RAKEBACK")) : variant === 8 ? /*#__PURE__*/React.createElement("span", {
    style: {
      ...label,
      color: gold,
      border: '1px solid #d6b67c38',
      background: '#d6b67c0b',
      borderRadius: 20,
      padding: '1px 9px',
      fontSize: 12,
      lineHeight: '16px'
    }
  }, rankName) : variant === 10 ? /*#__PURE__*/React.createElement("span", {
    style: {
      ...label,
      color: '#b3b4bd',
      fontSize: 12
    }
  }, "RAKEBACK ", /*#__PURE__*/React.createElement("b", {
    style: {
      color: gold,
      marginLeft: 3
    }
  }, rank)) : null;
  return /*#__PURE__*/React.createElement("div", {
    onClick: onClick,
    role: onClick ? "button" : undefined,
    tabIndex: onClick ? 0 : undefined,
    "aria-label": onClick ? "Open profile" : undefined,
    style: Object.assign({
      display: "flex",
      alignItems: "center",
      gap: 10,
      minWidth: 0,
      cursor: onClick ? "pointer" : "default"
    }, style || {})
  }, /*#__PURE__*/React.createElement("div", {
    style: {
      position: 'relative',
      flex: 'none',
      width: size,
      height: size
    }
  }, window.LeagueFrame ? /*#__PURE__*/React.createElement(window.LeagueFrame, {
    level: level,
    size: size,
    ring: ring,
    showRank: true
  }, /*#__PURE__*/React.createElement("img", {
    src: avatar,
    alt: "",
    style: {
      width: '100%',
      height: '100%',
      objectFit: 'cover',
      objectPosition: 'center 30%'
    }
  })) : /*#__PURE__*/React.createElement("img", {
    src: avatar,
    alt: "",
    style: {
      width: size,
      height: size,
      borderRadius: '50%',
      objectFit: 'cover'
    }
  }), variant === 4 && /*#__PURE__*/React.createElement("span", {
    "data-i18n": "off",
    style: {
      ...rankCircle,
      position: 'absolute',
      zIndex: 6,
      bottom: -5,
      right: -3,
      width: 18,
      height: 18,
      fontSize: 12,
      boxShadow: '0 0 0 2px #0b0b0d'
    }
  }, rank), variant === 9 && /*#__PURE__*/React.createElement("span", {
    "data-i18n": "off",
    style: {
      position: 'absolute',
      zIndex: 6,
      bottom: -6,
      left: '50%',
      transform: 'translateX(-50%)',
      minWidth: 29,
      height: 15,
      borderRadius: 8,
      background: 'linear-gradient(#ecd4ab,#b89460)',
      color: '#201a12',
      fontFamily: ME_SANS,
      fontWeight: 700,
      fontSize: 12,
      lineHeight: '15px',
      textAlign: 'center',
      boxShadow: '0 1px 4px #0009'
    }
  }, rank)), /*#__PURE__*/React.createElement("div", {
    style: {
      display: "flex",
      flexDirection: "column",
      justifyContent: "center",
      alignItems: "flex-start",
      height: size,
      minWidth: 0
    }
  }, /*#__PURE__*/React.createElement("div", {
    style: {
      display: 'flex',
      alignItems: 'center',
      gap: 6,
      height: 20
    }
  }, /*#__PURE__*/React.createElement("span", {
    "data-i18n": "off",
    style: {
      fontFamily: ME_MONO,
      fontSize: nickSize,
      lineHeight: '20px',
      color: '#fff',
      letterSpacing: '.06em',
      whiteSpace: 'nowrap'
    }
  }, nick), variant === 3 && /*#__PURE__*/React.createElement("span", {
    "data-i18n": "off",
    style: rankCircle
  }, rank), variant === 6 && mini), sub && /*#__PURE__*/React.createElement("div", {
    "data-i18n": "off",
    style: {
      marginTop: 3,
      display: 'flex',
      alignItems: 'center',
      height: variant === 7 ? 21 : 18
    }
  }, sub)));
}
function MeInfoSheet({
  open,
  title,
  value,
  valueColor,
  onClose,
  accent = "#D71921",
  children
}) {
  if (!open) return null;
  return /*#__PURE__*/React.createElement("div", {
    onClick: onClose,
    role: "dialog",
    "aria-modal": "true",
    "aria-label": title,
    style: {
      position: "absolute",
      inset: 0,
      zIndex: 90,
      background: "rgba(0,0,0,.72)",
      backdropFilter: "blur(8px)",
      WebkitBackdropFilter: "blur(8px)",
      display: "flex",
      alignItems: "flex-end",
      animation: "pp-fadeIn .22s ease"
    }
  }, /*#__PURE__*/React.createElement("div", {
    onClick: e => e.stopPropagation(),
    "data-i18n": "off",
    style: {
      width: "100%",
      maxHeight: "86%",
      overflowY: "auto",
      background: "linear-gradient(#1a1c22,#111217)",
      borderRadius: "22px 22px 0 0",
      border: "1px solid rgba(255,255,255,.12)",
      borderBottom: 0,
      padding: "14px 20px 28px",
      animation: "px-up 300ms cubic-bezier(.2,.8,.2,1) both"
    }
  }, /*#__PURE__*/React.createElement("div", {
    style: {
      width: 40,
      height: 4,
      borderRadius: 2,
      background: "rgba(255,255,255,.22)",
      margin: "0 auto 14px"
    }
  }), /*#__PURE__*/React.createElement("div", {
    style: {
      display: "flex",
      alignItems: "baseline",
      justifyContent: "space-between",
      gap: 12
    }
  }, /*#__PURE__*/React.createElement("div", {
    style: {
      fontFamily: ME_MONO,
      fontWeight: 700,
      fontSize: 18,
      letterSpacing: ".04em",
      color: "#fff"
    }
  }, title), /*#__PURE__*/React.createElement("div", {
    style: {
      fontFamily: ME_MONO,
      fontWeight: 700,
      fontSize: 26,
      color: valueColor || accent
    }
  }, value)), children, /*#__PURE__*/React.createElement("button", {
    className: "hf-primary",
    onClick: onClose,
    style: Object.assign(UI.btn("l", "primary", accent), {
      width: "100%",
      minHeight: 52,
      marginTop: 18
    })
  }, "\u041F\u041E\u041D\u042F\u0422\u041D\u041E")));
}
function MeInfoSteps({
  items,
  accent
}) {
  return /*#__PURE__*/React.createElement("div", {
    style: {
      display: "flex",
      flexDirection: "column",
      marginTop: 4
    }
  }, items.map(([t, d], i) => /*#__PURE__*/React.createElement("div", {
    key: t,
    style: {
      display: "flex",
      gap: 12,
      padding: "11px 0",
      borderBottom: i < items.length - 1 ? `1px solid ${UI.hairline}` : "none"
    }
  }, /*#__PURE__*/React.createElement("span", {
    style: {
      flex: "none",
      width: 26,
      height: 26,
      borderRadius: "50%",
      background: `${accent}1f`,
      border: `1px solid ${accent}66`,
      color: accent,
      display: "flex",
      alignItems: "center",
      justifyContent: "center",
      fontFamily: ME_MONO,
      fontWeight: 700,
      fontSize: 12
    }
  }, i + 1), /*#__PURE__*/React.createElement("div", {
    style: {
      flex: 1,
      minWidth: 0
    }
  }, /*#__PURE__*/React.createElement("div", {
    style: {
      fontFamily: ME_MONO,
      fontSize: 13,
      color: "#fff",
      letterSpacing: ".05em"
    }
  }, t), /*#__PURE__*/React.createElement("div", {
    className: "me-hint",
    style: {
      marginTop: 2,
      fontSize: 13,
      color: "#CDD2DB"
    }
  }, d)))));
}
function MeBaseRbBody({
  accent
}) {
  return /*#__PURE__*/React.createElement(React.Fragment, null, /*#__PURE__*/React.createElement("div", {
    className: "me-hint",
    style: {
      marginTop: 8,
      fontSize: 14,
      color: "#CDD2DB"
    }
  }, "\u0411\u0430\u0437\u043E\u0432\u0430\u044F \u0441\u0442\u0430\u0432\u043A\u0430 \u0440\u0435\u0439\u043A\u0431\u0435\u043A\u0430 \u2014 \u0432\u0430\u0448\u0430 \u043B\u0438\u0447\u043D\u0430\u044F. \u0415\u0451 \u0441\u0447\u0438\u0442\u0430\u0435\u0442 \u043C\u043E\u0434\u0435\u043B\u044C, \u043A\u043E\u0442\u043E\u0440\u0430\u044F \u043E\u0434\u043D\u043E\u0432\u0440\u0435\u043C\u0435\u043D\u043D\u043E \u043E\u043F\u0438\u0440\u0430\u0435\u0442\u0441\u044F \u043D\u0430 \u0434\u0438\u0441\u0442\u0430\u043D\u0446\u0438\u044E, \u043E\u0442\u0432\u0435\u0447\u0430\u0435\u0442 \u043D\u0430 \u0442\u0435\u043A\u0443\u0449\u0438\u0435 \u0440\u0435\u0437\u0443\u043B\u044C\u0442\u0430\u0442\u044B \u0438 \u0443\u0447\u0438\u0442\u044B\u0432\u0430\u0435\u0442, \u0441\u043A\u043E\u043B\u044C\u043A\u043E \u0438 \u0432\u043E \u0447\u0442\u043E \u0432\u044B \u0438\u0433\u0440\u0430\u0435\u0442\u0435."), /*#__PURE__*/React.createElement("div", {
    className: "me-label",
    style: {
      marginTop: 16,
      color: "#8A8A93"
    }
  }, "\u0418\u0417 \u0427\u0415\u0413\u041E \u0421\u041A\u041B\u0410\u0414\u042B\u0412\u0410\u0415\u0422\u0421\u042F"), /*#__PURE__*/React.createElement(MeInfoSteps, {
    items: ME_BASE_RB_INFO,
    accent: accent
  }), /*#__PURE__*/React.createElement("div", {
    className: "me-label",
    style: {
      marginTop: 16,
      color: "#8A8A93"
    }
  }, "\u041A\u0410\u041A \u042D\u0422\u041E \u0420\u0410\u0411\u041E\u0422\u0410\u0415\u0422"), /*#__PURE__*/React.createElement("div", {
    className: "me-hint",
    style: {
      marginTop: 6,
      fontSize: 14,
      color: "#CDD2DB"
    }
  }, "\u0421\u0438\u0441\u0442\u0435\u043C\u0430 \u0436\u0438\u0432\u0430\u044F: \u043E\u043D\u0430 \u0430\u043D\u0430\u043B\u0438\u0437\u0438\u0440\u0443\u0435\u0442 \u043F\u043E\u0432\u0435\u0434\u0435\u043D\u0438\u0435 \u0437\u0430 \u0441\u0442\u043E\u043B\u0430\u043C\u0438 \u0438 \u0430\u0434\u0430\u043F\u0442\u0438\u0440\u0443\u0435\u0442\u0441\u044F, \u0447\u0442\u043E\u0431\u044B \u043E\u0441\u0442\u0430\u0432\u0430\u0442\u044C\u0441\u044F \u0441\u043F\u0440\u0430\u0432\u0435\u0434\u043B\u0438\u0432\u043E\u0439 \u0438 \u043F\u0440\u0435\u0434\u0441\u043A\u0430\u0437\u0443\u0435\u043C\u043E\u0439 \u043D\u0430 \u0434\u0438\u0441\u0442\u0430\u043D\u0446\u0438\u0438. \u041E\u043D\u0430 \u0437\u0430\u043C\u0435\u0447\u0430\u0435\u0442, \u043A\u0430\u043A \u0432\u044B \u043E\u0441\u0432\u0430\u0438\u0432\u0430\u0435\u0442\u0435 \u043D\u043E\u0432\u044B\u0435 \u0444\u043E\u0440\u043C\u0430\u0442\u044B, \u0440\u0430\u0441\u0442\u0451\u0442\u0435 \u043F\u043E \u043B\u0438\u043C\u0438\u0442\u0430\u043C \u0438 \u043C\u0435\u043D\u044F\u0435\u0442\u0435 \u043F\u043E\u0434\u0445\u043E\u0434 \u043A \u0438\u0433\u0440\u0435."), /*#__PURE__*/React.createElement("div", {
    className: "me-hint",
    style: {
      marginTop: 8,
      fontSize: 14,
      color: "#CDD2DB"
    }
  }, "\u0421\u0435\u0439\u0447\u0430\u0441 \u0438\u0434\u0451\u0442 \u043A\u0430\u043B\u0438\u0431\u0440\u043E\u0432\u043A\u0430: \u043C\u044B \u043D\u0430\u0431\u043B\u044E\u0434\u0430\u0435\u043C \u0437\u0430 \u0440\u0435\u0430\u043B\u044C\u043D\u044B\u043C\u0438 \u0434\u0430\u043D\u043D\u044B\u043C\u0438 \u0438 \u043F\u043E\u0441\u0442\u0435\u043F\u0435\u043D\u043D\u043E \u0443\u0442\u043E\u0447\u043D\u044F\u0435\u043C \u043C\u043E\u0434\u0435\u043B\u044C."), /*#__PURE__*/React.createElement("div", {
    style: {
      marginTop: 14,
      padding: "12px 14px",
      borderRadius: UI.r.chip,
      background: `${accent}14`,
      border: `1px solid ${accent}55`,
      fontFamily: ME_SANS,
      fontWeight: 600,
      fontSize: 14,
      color: "#fff",
      lineHeight: 1.45
    }
  }, "\u0426\u0435\u043B\u044C \u2014 \u0432\u043E\u0437\u043D\u0430\u0433\u0440\u0430\u0436\u0434\u0430\u0442\u044C \u0430\u043A\u0442\u0438\u0432\u043D\u043E\u0441\u0442\u044C \u0438 \u0434\u0438\u043D\u0430\u043C\u0438\u043A\u0443 \u0438\u0433\u0440\u044B, \u0430 \u043D\u0435 \u0442\u043E\u043B\u044C\u043A\u043E \u043D\u0430\u043A\u043E\u043F\u043B\u0435\u043D\u043D\u044B\u0439 \u0440\u0435\u0437\u0443\u043B\u044C\u0442\u0430\u0442."));
}
// Бонус карти: відсоток ДО РОЗРАХОВАНОГО базового рейкбеку, а не від рейку. Приклад на реальних цифрах гравця.
function MeCardBonusBody({
  accent,
  level,
  rbBase,
  rbExtra
}) {
  const L = window.cmLeague,
    lg = L.forLevel(level),
    card = L.cardForLevel(level),
    next = Math.min(L.TOTAL, level + 1);
  const pct1 = v => (Math.round(v * 10) / 10).toString().replace(".", ",");
  const step = L.rbStep ? L.rbStep(next) : 0;
  return /*#__PURE__*/React.createElement(React.Fragment, null, /*#__PURE__*/React.createElement("div", {
    className: "me-hint",
    style: {
      marginTop: 8,
      fontSize: 14,
      color: "#CDD2DB"
    }
  }, "\u041A\u0430\u0436\u0434\u0430\u044F \u043E\u0442\u043A\u0440\u044B\u0442\u0430\u044F \u043A\u0430\u0440\u0442\u0430 \u0443\u0432\u0435\u043B\u0438\u0447\u0438\u0432\u0430\u0435\u0442 \u0432\u0430\u0448 \u0431\u0430\u0437\u043E\u0432\u044B\u0439 \u0440\u0435\u0439\u043A\u0431\u0435\u043A. \u0411\u043E\u043D\u0443\u0441 \u0441\u0447\u0438\u0442\u0430\u0435\u0442\u0441\u044F \u043E\u0442 ", /*#__PURE__*/React.createElement("b", {
    style: {
      color: "#fff"
    }
  }, "\u0440\u0430\u0441\u0441\u0447\u0438\u0442\u0430\u043D\u043D\u043E\u0433\u043E \u0431\u0430\u0437\u043E\u0432\u043E\u0433\u043E \u0440\u0435\u0439\u043A\u0431\u0435\u043A\u0430"), ", \u0430 \u043D\u0435 \u043E\u0442 \u0440\u0435\u0439\u043A\u0430: \u043E\u043D \u0443\u043C\u043D\u043E\u0436\u0430\u0435\u0442 \u0432\u0430\u0448\u0443 \u0441\u0442\u0430\u0432\u043A\u0443, \u0430 \u043D\u0435 \u043F\u0440\u0438\u0431\u0430\u0432\u043B\u044F\u0435\u0442\u0441\u044F \u043A \u043D\u0435\u0439."), /*#__PURE__*/React.createElement("div", {
    className: "me-label",
    style: {
      marginTop: 16,
      color: "#8A8A93"
    }
  }, "\u041D\u0410 \u0412\u0410\u0428\u0418\u0425 \u0426\u0418\u0424\u0420\u0410\u0425"), /*#__PURE__*/React.createElement("div", {
    style: {
      marginTop: 8,
      padding: "12px 14px",
      borderRadius: UI.r.chip,
      background: "rgba(255,255,255,.045)",
      border: "1px solid rgba(255,255,255,.1)",
      fontFamily: ME_MONO,
      fontSize: 14,
      color: "#fff",
      lineHeight: 1.7
    }
  }, /*#__PURE__*/React.createElement("div", null, /*#__PURE__*/React.createElement("span", {
    style: {
      color: "#8A8A93"
    }
  }, "\u0411\u0430\u0437\u043E\u0432\u044B\u0439 \u0440\u0435\u0439\u043A\u0431\u0435\u043A"), " ", /*#__PURE__*/React.createElement("b", null, pct1(rbBase), "%")), /*#__PURE__*/React.createElement("div", null, /*#__PURE__*/React.createElement("span", {
    style: {
      color: "#8A8A93"
    }
  }, "\u0411\u043E\u043D\u0443\u0441 \u043A\u0430\u0440\u0442\u044B ", card), " ", /*#__PURE__*/React.createElement("b", {
    style: {
      color: L.shade(lg.color, 48)
    }
  }, "+", pct1(rbExtra), "%"), " ", /*#__PURE__*/React.createElement("span", {
    style: {
      color: "#8A8A93"
    }
  }, "\u043A \u0431\u0430\u0437\u043E\u0432\u043E\u043C\u0443"))), /*#__PURE__*/React.createElement("div", {
    className: "me-label",
    style: {
      marginTop: 16,
      color: "#8A8A93"
    }
  }, "\u0411\u041E\u041D\u0423\u0421 \u041F\u041E \u041A\u0410\u0420\u0422\u0410\u041C"), /*#__PURE__*/React.createElement("div", {
    style: {
      display: "grid",
      gridTemplateColumns: "repeat(2, auto 1fr)",
      columnGap: 14,
      rowGap: 5,
      marginTop: 8,
      padding: "12px 14px",
      borderRadius: UI.r.chip,
      background: "rgba(255,255,255,.045)",
      border: "1px solid rgba(255,255,255,.1)",
      fontFamily: ME_MONO,
      fontSize: 13
    }
  }, L.RANKS.map((r, i) => /*#__PURE__*/React.createElement(React.Fragment, {
    key: r
  }, /*#__PURE__*/React.createElement("span", {
    style: {
      color: i + 1 === level ? "#fff" : "#CDD2DB",
      fontWeight: i + 1 === level ? 700 : 400
    }
  }, r), /*#__PURE__*/React.createElement("span", {
    style: {
      color: i + 1 <= level ? L.shade(lg.color, 48) : "#8A8A93",
      fontWeight: 700
    }
  }, L.rbBonusTable[i] ? "+" + L.rbBonusTable[i] + " %" : "—")))), /*#__PURE__*/React.createElement(MeInfoSteps, {
    accent: accent,
    items: [["ДВОЙКА — БЕЗ БОНУСА", "Стартовая карта даёт базовый рейкбек как есть. Бонус появляется с тройки."], ["КАЖДАЯ КАРТА ЗАМЕНЯЕТ ПРЕДЫДУЩУЮ", `Действует бонус текущей карты, а не сумма всех. Следующая карта ${L.cardForLevel(next)} даст +${pct1(L.rbExtra(next))} % вместо +${pct1(rbExtra)} %.`], ["ДЕЙСТВУЕТ НА ВСЁ", "Бонус применяется к каждой награде за домик: чем выше карта, тем больше рейкбек с того же рейка."]]
  }));
}
function RewardHistoryScreen({
  open,
  onClose,
  accent = "#D71921",
  version = 0
}) {
  const [period, setPeriod] = React.useState(7);
  React.useEffect(() => {
    if (!open) return;
    window.dispatchEvent(new CustomEvent("px-full", {
      detail: 1
    }));
    return () => window.dispatchEvent(new CustomEvent("px-full", {
      detail: -1
    }));
  }, [open]);
  if (!open) return null;
  const L = window.cmLeague,
    P = window.cmPlayer || {
      level: 24
    },
    lg = L.forLevel(P.level),
    tone = L.shade(lg.color, 62);
  const calc = n => {
    const days = RB_HIST.slice(0, n);
    const rake = days.reduce((a, d) => a + d.rake, 0);
    const got = days.reduce((a, d) => a + d.ev.reduce((m, e) => m + e.amount, 0), 0);
    return {
      rake,
      got,
      pct: rake ? Math.round(got / rake * 100) : 0
    };
  };
  const d7 = calc(7),
    d30 = calc(30),
    total = calc(RB_HIST.length).got;
  const events = [];
  RB_HIST.slice(0, period).forEach(d => d.ev.forEach(e => events.push({
    ...e,
    day: d.day
  })));
  const houseN = events.filter(e => e.kind === "house").length,
    cardN = events.length - houseN;
  return /*#__PURE__*/React.createElement("div", {
    className: "me-overlay me-screen",
    style: {
      zIndex: 80
    },
    role: "dialog",
    "aria-modal": "true",
    "aria-label": "Reward history"
  }, /*#__PURE__*/React.createElement("div", {
    style: {
      position: "absolute",
      top: 0,
      left: 0,
      right: 0,
      height: 300,
      pointerEvents: "none",
      background: `radial-gradient(ellipse 80% 70% at 50% 4%, ${lg.color}22 0%, transparent 60%)`
    }
  }), /*#__PURE__*/React.createElement("div", {
    className: "me-top"
  }, /*#__PURE__*/React.createElement("button", {
    className: "me-back",
    "aria-label": "Back",
    onClick: () => {
      meClick(900);
      onClose();
    }
  }, /*#__PURE__*/React.createElement("svg", {
    width: "16",
    height: "16",
    viewBox: "0 0 24 24",
    fill: "none",
    stroke: "#fff",
    strokeWidth: "2.4",
    strokeLinecap: "round",
    strokeLinejoin: "round"
  }, /*#__PURE__*/React.createElement("path", {
    d: "M15 6l-6 6 6 6"
  }))), /*#__PURE__*/React.createElement("span", {
    className: "me-title"
  }, "REWARD HISTORY"), /*#__PURE__*/React.createElement("span", {
    style: {
      width: 36
    }
  })), /*#__PURE__*/React.createElement("div", {
    className: "me-scroll",
    style: {
      padding: "6px 0 44px"
    }
  }, /*#__PURE__*/React.createElement("div", {
    className: "me-card",
    style: {
      padding: "18px 18px 16px",
      background: `linear-gradient(150deg, ${lg.color}22, ${UI.surface1} 60%)`
    }
  }, /*#__PURE__*/React.createElement("div", {
    className: "me-label",
    style: {
      color: "#CDD2DB"
    }
  }, "TOTAL REWARDS RECEIVED"), /*#__PURE__*/React.createElement("div", {
    "data-i18n": "off",
    style: {
      fontFamily: ME_MONO,
      fontWeight: 700,
      fontSize: 38,
      color: "#fff",
      marginTop: 8,
      lineHeight: 1,
      fontVariantNumeric: "tabular-nums"
    }
  }, meMoney(total)), /*#__PURE__*/React.createElement("div", {
    className: "me-hint",
    style: {
      marginTop: 8,
      fontSize: 13
    }
  }, "Card house + card rewards, since your first hand.")), /*#__PURE__*/React.createElement("div", {
    style: {
      display: "flex",
      gap: 9,
      margin: "10px 18px 0"
    }
  }, [[d7, "LAST 7 DAYS"], [d30, "LAST 30 DAYS"]].map(([d, l]) => /*#__PURE__*/React.createElement("div", {
    key: l,
    className: "me-stat",
    style: {
      flex: 1
    }
  }, /*#__PURE__*/React.createElement("div", {
    className: "me-stat-l"
  }, l), /*#__PURE__*/React.createElement("div", {
    style: {
      display: "flex",
      alignItems: "baseline",
      gap: 6,
      marginTop: 8
    }
  }, /*#__PURE__*/React.createElement("span", {
    "data-i18n": "off",
    style: {
      fontFamily: ME_MONO,
      fontWeight: 700,
      fontSize: 26,
      color: tone,
      lineHeight: 1
    }
  }, d.pct, "%"), /*#__PURE__*/React.createElement("span", {
    className: "me-label",
    style: {
      fontSize: 12
    }
  }, "OF RAKE")), /*#__PURE__*/React.createElement("div", {
    style: {
      position: "relative",
      height: 5,
      borderRadius: 3,
      background: "rgba(255,255,255,.1)",
      marginTop: 9,
      overflow: "hidden"
    }
  }, /*#__PURE__*/React.createElement("span", {
    style: {
      position: "absolute",
      left: 0,
      top: 0,
      bottom: 0,
      width: `${Math.min(100, d.pct)}%`,
      background: lg.color,
      borderRadius: 3
    }
  })), /*#__PURE__*/React.createElement("div", {
    className: "me-stat-s",
    "data-i18n": "off"
  }, meMoney(d.got), " ", /*#__PURE__*/React.createElement("span", {
    style: {
      color: "#6f6f78"
    }
  }, "/ ", meMoney(d.rake)))))), /*#__PURE__*/React.createElement("div", {
    className: "me-hint",
    style: {
      margin: "10px 18px 0",
      fontSize: 12
    }
  }, "Rewards received divided by the rake you generated in the same period. Your real return is usually above the league rate: card rewards add to the house."), /*#__PURE__*/React.createElement("div", {
    style: {
      margin: "20px 18px 0"
    }
  }, /*#__PURE__*/React.createElement("div", {
    className: "me-seg"
  }, [[7, "7 DAYS"], [30, "30 DAYS"]].map(([v, l]) => /*#__PURE__*/React.createElement("button", {
    key: v,
    "aria-pressed": period === v,
    onClick: () => {
      meClick(1000, .03);
      setPeriod(v);
    }
  }, l))), /*#__PURE__*/React.createElement("div", {
    style: {
      display: "flex",
      justifyContent: "space-between",
      alignItems: "baseline",
      marginTop: 18
    }
  }, /*#__PURE__*/React.createElement("span", {
    style: {
      fontFamily: ME_MONO,
      fontSize: 15,
      color: "#fff",
      letterSpacing: ".06em"
    }
  }, "ACCRUALS"), /*#__PURE__*/React.createElement("span", {
    style: {
      fontFamily: ME_SANS,
      fontWeight: 600,
      fontSize: 12,
      color: "#A9A9B2"
    }
  }, /*#__PURE__*/React.createElement("span", {
    "data-i18n": "off"
  }, houseN, " "), /*#__PURE__*/React.createElement("span", null, "\xD7 house"), /*#__PURE__*/React.createElement("span", {
    "data-i18n": "off"
  }, " \xB7 ", cardN, " "), /*#__PURE__*/React.createElement("span", null, "\xD7 card"))), events.length === 0 && /*#__PURE__*/React.createElement("div", {
    style: {
      padding: "26px 0",
      textAlign: "center",
      fontFamily: ME_SANS,
      fontWeight: 600,
      fontSize: 14,
      letterSpacing: ".12em",
      color: "#AFB6C2"
    }
  }, "NO REWARDS IN THIS PERIOD"), events.map((e, i) => {
    const house = e.kind === "house";
    return /*#__PURE__*/React.createElement("div", {
      key: i,
      style: {
        display: "flex",
        alignItems: "center",
        gap: 12,
        padding: "15px 0",
        borderBottom: `1px solid ${UI.hairline}`
      }
    }, /*#__PURE__*/React.createElement("span", {
      style: {
        flex: "none",
        width: 40,
        height: 40,
        borderRadius: "50%",
        background: house ? `${lg.color}22` : "rgba(240,199,94,.12)",
        border: `1px solid ${house ? lg.color + "66" : "rgba(240,199,94,.4)"}`,
        display: "flex",
        alignItems: "center",
        justifyContent: "center"
      }
    }, house ? /*#__PURE__*/React.createElement("svg", {
      "aria-hidden": "true",
      width: "22",
      height: "22",
      viewBox: "0 0 24 24",
      fill: "none",
      stroke: tone,
      strokeWidth: "1.65",
      strokeLinecap: "round",
      strokeLinejoin: "round"
    }, /*#__PURE__*/React.createElement("path", {
      d: "M3 21 7.5 12.5 12 21M12 21l4.5-8.5L21 21M7.5 12.5 12 4l4.5 8.5M5.5 12.5h13"
    })) : /*#__PURE__*/React.createElement("svg", {
      width: "17",
      height: "17",
      viewBox: "0 0 24 24",
      fill: "none",
      stroke: "#f0c75e",
      strokeWidth: "2",
      strokeLinecap: "round",
      strokeLinejoin: "round"
    }, /*#__PURE__*/React.createElement("rect", {
      x: "5",
      y: "3",
      width: "14",
      height: "18",
      rx: "2"
    }), /*#__PURE__*/React.createElement("path", {
      d: "M9 8h.01M15 16h.01"
    }))), /*#__PURE__*/React.createElement("span", {
      style: {
        flex: 1,
        minWidth: 0
      }
    }, /*#__PURE__*/React.createElement("span", {
      style: {
        display: "block",
        fontFamily: ME_MONO,
        fontWeight: 700,
        fontSize: 14,
        color: "#fff",
        lineHeight: 1.35
      }
    }, house ? "CARD HOUSE OPENED" : /*#__PURE__*/React.createElement("span", null, "LEVEL CARD \xB7 ", /*#__PURE__*/React.createElement("span", {
      "data-i18n": "off"
    }, e.label))), /*#__PURE__*/React.createElement("span", {
      style: {
        display: "block",
        marginTop: 3,
        fontFamily: ME_SANS,
        fontWeight: 700,
        fontSize: 12,
        letterSpacing: ".06em",
        color: "#AFB6C2"
      }
    }, rbDayLabel(e.day))), /*#__PURE__*/React.createElement("span", {
      "data-i18n": "off",
      style: {
        flex: "none",
        fontFamily: ME_MONO,
        fontWeight: 700,
        fontSize: 16,
        color: house ? tone : "#f0c75e",
        fontVariantNumeric: "tabular-nums",
        whiteSpace: "nowrap"
      }
    }, "+", e.currency === "tdollar" ? "T$" + Number(e.amount).toFixed(2) : e.currency === "cash" ? "C$" + Number(e.amount).toFixed(2) : meMoney(e.amount)));
  }))));
}

// ── Профіль (тап по аватару) ──────────────────────────────────────────
const ME_STATS = [{
  l: "HANDS PLAYED",
  v: "12 480",
  s: "since March 2026"
}, {
  l: "HOURS AT TABLES",
  v: "214",
  s: "cash + tournaments"
}, {
  l: "WIN RATE",
  v: "+4.2",
  s: "bb/100 · cash"
}, {
  l: "SHOWDOWN WINS",
  v: "54%",
  s: "1 930 showdowns"
}, {
  l: "VPIP / PFR",
  v: "24 / 18",
  s: "hold'em"
}, {
  l: "TOURNEYS · ITM",
  v: "86 · 19%",
  s: "3 final tables"
}];
// «Самый крупный банк» — одна секція для Карʼєри та екрана «Моя статистика»
function MeBiggestPot({
  onReplay
}) {
  return /*#__PURE__*/React.createElement("section", {
    className: "me-records",
    "aria-label": "Biggest pots"
  }, /*#__PURE__*/React.createElement("h3", {
    className: "me-section-heading"
  }, "BIGGEST POT"), /*#__PURE__*/React.createElement("div", {
    className: "me-record-list"
  }, [{
    won: true,
    amount: "$1 240 000",
    date: "12.08",
    cards: [["A", "spade"], ["A", "heart"]]
  }, {
    won: false,
    amount: "$96 400",
    date: "29.07",
    cards: [["K", "diamond"], ["K", "club"]]
  }].map((pot, index) => /*#__PURE__*/React.createElement("button", {
    className: "me-record",
    "data-won": pot.won,
    key: pot.date,
    onClick: () => {
      meClick();
      onReplay(ME_RECORD_HANDS[index]);
    },
    "aria-label": `Реплей ${pot.won ? "выигранного" : "проигранного"} банка ${pot.amount}`
  }, /*#__PURE__*/React.createElement("div", {
    className: "me-record-copy"
  }, /*#__PURE__*/React.createElement("div", {
    className: "me-record-result"
  }, /*#__PURE__*/React.createElement("span", {
    "aria-hidden": "true"
  }, pot.won ? "↗" : "↘"), pot.won ? "WON" : "LOST"), /*#__PURE__*/React.createElement("strong", {
    className: "me-record-amount",
    style: {
      whiteSpace: "nowrap",
      ...(pot.amount.length > 8 ? {
        fontSize: 24
      } : {})
    },
    "data-i18n": "off"
  }, pot.amount), /*#__PURE__*/React.createElement("div", {
    className: "me-record-meta",
    "data-i18n": "off"
  }, "$2/$5 ", /*#__PURE__*/React.createElement("span", null, "\xB7"), " ", pot.date)), /*#__PURE__*/React.createElement("div", {
    className: "me-record-hand",
    "data-i18n": "off",
    role: "img",
    "aria-label": pot.cards.map(([r, s]) => r + {
      spade: "♠",
      heart: "♥",
      diamond: "♦",
      club: "♣"
    }[s]).join(" ")
  }, pot.cards.map(([rank, suit], i) => /*#__PURE__*/React.createElement("span", {
    className: "me-record-card",
    key: suit
  }, /*#__PURE__*/React.createElement("b", null, rank), /*#__PURE__*/React.createElement(window.Suit, {
    kind: suit,
    size: 20,
    color: suit === "heart" || suit === "diamond" ? "#E5484D" : "#fff"
  })))), /*#__PURE__*/React.createElement("span", {
    className: "me-record-play"
  }, /*#__PURE__*/React.createElement("svg", {
    width: "19",
    height: "19",
    viewBox: "0 0 24 24",
    fill: "none",
    "aria-hidden": "true"
  }, /*#__PURE__*/React.createElement("path", {
    d: "M4.3 8a8 8 0 1 1-.1 7",
    stroke: "currentColor",
    strokeWidth: "1.6",
    strokeLinecap: "round"
  }), /*#__PURE__*/React.createElement("path", {
    d: "M4 3.8V8h4.2",
    stroke: "currentColor",
    strokeWidth: "1.6",
    strokeLinecap: "round",
    strokeLinejoin: "round"
  }), /*#__PURE__*/React.createElement("path", {
    d: "m10 8.5 5.5 3.5-5.5 3.5z",
    fill: "currentColor"
  })), /*#__PURE__*/React.createElement("span", null, "REPLAY"))))));
}
// Демо-статистика за дисципліною та періодом: детерміновано від назви дисципліни, масштаб від періоду.
const ME_PERIOD = {
  today: {
    k: .03,
    s: "today"
  },
  week: {
    k: .14,
    s: "7 days"
  },
  "30d": {
    k: .5,
    s: "30 days"
  }
};
function meStatsFor(disc, period) {
  const pf = ME_PERIOD[period] || ME_PERIOD["30d"],
    fmt = v => v.toLocaleString("en-US").replace(/,/g, " ");
  const seed = [...disc].reduce((a, c) => a + c.charCodeAt(0), 0),
    d = disc === "ALL" ? 1 : .55 + seed % 7 / 20;
  const hands = Math.round(12480 * pf.k * d),
    hours = Math.round(214 * pf.k * d),
    wr = 4.2 + (seed % 9 - 4) * .6 - (period === "today" ? 1.1 : 0);
  const sd = 54 + (seed % 5 - 2) * 2,
    sdn = Math.round(1930 * pf.k * d),
    vp = 24 + seed % 6 - 2,
    pfr = Math.max(10, vp - 6 - seed % 3);
  const tr = Math.round(86 * pf.k * d),
    itm = 19 + (seed % 4 - 1) * 2,
    ft = Math.round(3 * pf.k * 2);
  const game = disc === "ALL" ? "cash + tournaments" : disc.toLowerCase();
  return [{
    l: "HANDS PLAYED",
    v: fmt(hands),
    s: pf.s
  }, {
    l: "HOURS AT TABLES",
    v: String(hours),
    s: game
  }, {
    l: "WIN RATE",
    v: (wr >= 0 ? "+" : "") + wr.toFixed(1),
    s: "bb/100 · cash"
  }, {
    l: "SHOWDOWN WINS",
    v: sd + "%",
    s: fmt(sdn) + " showdowns"
  }, {
    l: "VPIP / PFR",
    v: vp + " / " + pfr,
    s: disc === "ALL" ? "hold'em" : disc.toLowerCase()
  }, {
    l: "TOURNEYS · ITM",
    v: tr + " · " + itm + "%",
    s: ft + " final tables"
  }];
}
// «Моя статистика»: Holdem / Omaha × 7 дней / 30 дней / всё время — детерміновані демо-числа
const ME_CAREER_PERIOD = {
  "7d": .12,
  "30d": .5,
  all: 1
};
function meCareerFor(disc, period) {
  const k = ME_CAREER_PERIOD[period] || 1,
    om = disc === "OMAHA";
  const games = Math.round((om ? 41 : 69) * k) || 1,
    hands = Math.round((om ? 2210 : 3736) * k) || 1;
  const base = om ? {
    win: 31,
    vpip: 63,
    pfr: 34,
    cbet: 24,
    tb: 4,
    wt: 29,
    wsd: 52
  } : {
    win: 34,
    vpip: 71,
    pfr: 40,
    cbet: 19,
    tb: 5,
    wt: 32,
    wsd: 55
  };
  const j = period === "7d" ? 3 : period === "30d" ? 1 : 0;
  return {
    games,
    hands,
    win: base.win + j,
    vpip: base.vpip - j,
    pfr: base.pfr,
    cbet: base.cbet + j,
    tb: base.tb,
    wt: base.wt - j,
    wsd: base.wsd + j,
    af: (om ? 2.1 : 2.6 + j * .1).toFixed(1)
  };
}
const ME_RECENT = [{
  disc: "HOLD'EM",
  title: "HOLD'EM 40-200",
  blinds: "1/2",
  hands: 1,
  time: "38s",
  date: "28.08.2026 14:06",
  pot: "$14"
}, {
  disc: "HOLD'EM",
  title: "HOLD'EM 100-500",
  blinds: "2/5",
  hands: 142,
  time: "1h 12m",
  date: "27.08.2026 21:40",
  pot: "$412"
}, {
  disc: "OMAHA",
  title: "OMAHA 40-200",
  blinds: "1/2",
  hands: 64,
  time: "36m",
  date: "26.08.2026 19:15",
  pot: "$96"
}, {
  disc: "OMAHA",
  title: "OMAHA 100-500",
  blinds: "2/5",
  hands: 210,
  time: "2h 05m",
  date: "24.08.2026 20:02",
  pot: "$1 180"
}];
// Stable prototype replays: hole cards, outcome and total pot match the record tiles.
function meRecordHand(won, potValue = won ? 1240 : 860, heroRank = won ? 'A' : 'K') {
  const card = (r, s) => ({
      r,
      s
    }),
    heroCards = heroRank === 'A' ? [card('A', 'spade'), card('A', 'heart')] : [card('K', 'diamond'), card('K', 'club')];
  const pocket = [['8', 'club', '7', 'club'], ['Q', 'diamond', 'J', 'diamond'], ['9', 'heart', '8', 'heart'], ['6', 'spade', '5', 'spade']];
  const players = ['UTG', 'UTG+1', 'CO', 'BTN', 'SB', 'BB'].map((pos, i) => ({
    pos,
    name: i === 4 ? 'SASHA02' : i === 5 ? 'RiverStone' : ['mokuoha', 'TRAMOLLERO', 'aegbtc', 'ShabbaMatty'][i],
    hero: i === 4,
    cards: i === 4 ? heroCards : i === 5 ? [card('Q', 'spade'), card('Q', 'heart')] : [card(pocket[i][0], pocket[i][1]), card(pocket[i][2], pocket[i][3])],
    put: i >= 4 ? potValue / 2 : 0,
    live: i >= 4,
    shown: i >= 4,
    stack: potValue
  }));
  const hero = players[4],
    opponent = players[5],
    winner = won ? hero : opponent;
  const board = [won ? card(heroRank, heroRank === 'A' ? 'diamond' : 'spade') : card('Q', 'club'), card('9', 'club'), card('4', 'spade'), card('2', 'heart'), card('J', 'club')];
  let committed = 0;
  const streets = ['PREFLOP', 'FLOP', 'TURN', 'RIVER'].map((name, i) => {
    const amount = potValue * [.015, .085, .15, .25][i];
    committed += amount;
    return {
      name,
      cards: i ? i + 2 : 0,
      pot: committed * 2,
      rows: [...(i === 0 ? players.slice(0, 4).map(p => ({
        p,
        act: 'FOLD'
      })) : []), {
        p: hero,
        act: i === 0 ? 'RAISE' : 'BET',
        amt: amount
      }, {
        p: opponent,
        act: 'CALL',
        amt: amount
      }]
    };
  });
  const results = players.map(p => ({
    p,
    delta: p === winner ? potValue - p.put : -p.put,
    won: p === winner,
    shown: p.live
  }));
  return {
    id: 'record-' + potValue + '-' + heroRank,
    disc: "HOLD'EM",
    stakes: '$2 / $5',
    cards: heroCards,
    won,
    amt: potValue,
    format: 'CASH',
    replayData: {
      players,
      board,
      streets,
      pot: potValue,
      results,
      bb: 5,
      sb: 2,
      winner,
      hero,
      heroDelta: won ? potValue / 2 : -potValue / 2,
      heroWon: won
    }
  };
}
const ME_RECORD_HANDS = [meRecordHand(true, 1240000, 'A'), meRecordHand(false, 96400, 'K')];
// Сутність гравця (аватар у рамці масті · нік · ID з копіюванням · плоска картка статусу) — з 22.09 живе в «Настройках»
function PxProfileHero({
  avatar = "assets/avatar.png",
  onEdit,
  onRakeback,
  style
}) {
  const [idCopy, setIdCopy] = React.useState('');
  React.useEffect(() => {
    if (!idCopy) return;
    const timer = setTimeout(() => setIdCopy(''), 1800);
    return () => clearTimeout(timer);
  }, [idCopy]);
  const copyId = async () => {
    try {
      await navigator.clipboard.writeText('48213');
      setIdCopy('Скопировано');
    } catch (e) {
      setIdCopy('Не удалось скопировать');
    }
  };
  const L = window.cmLeague,
    P = window.cmPlayer || {
      level: 24
    };
  return /*#__PURE__*/React.createElement("div", {
    className: "ps-identity",
    "data-i18n": "off"
  }, /*#__PURE__*/React.createElement("div", {
    className: "ps-player"
  }, /*#__PURE__*/React.createElement("button", {
    className: "ps-avatar",
    "aria-label": "\u0421\u043C\u0435\u043D\u0438\u0442\u044C \u0444\u043E\u0442\u043E",
    onClick: onEdit
  }, /*#__PURE__*/React.createElement("span", {
    className: "ps-avatar-well"
  }, /*#__PURE__*/React.createElement("img", {
    src: avatar,
    alt: ""
  })), window.LegendFrameOverlay && /*#__PURE__*/React.createElement(window.LegendFrameOverlay, {
    player: true
  })), /*#__PURE__*/React.createElement("div", null, /*#__PURE__*/React.createElement("strong", null, "SASHA02"), /*#__PURE__*/React.createElement("button", {
    className: "ps-id",
    onClick: copyId,
    "aria-label": "\u0421\u043A\u043E\u043F\u0438\u0440\u043E\u0432\u0430\u0442\u044C ID 48213"
  }, /*#__PURE__*/React.createElement("span", {
    "aria-live": "polite"
  }, idCopy || "ID 48213"), /*#__PURE__*/React.createElement("svg", {
    width: "14",
    height: "14",
    viewBox: "0 0 24 24",
    fill: "none",
    stroke: "currentColor",
    strokeWidth: "1.5"
  }, /*#__PURE__*/React.createElement("rect", {
    x: "8",
    y: "8",
    width: "12",
    height: "13",
    rx: "3"
  }), /*#__PURE__*/React.createElement("path", {
    d: "M16 8V5a2 2 0 0 0-2-2H5a2 2 0 0 0-2 2v9a2 2 0 0 0 2 2h3"
  }))))), /*#__PURE__*/React.createElement("button", {
    className: "ps-rake",
    onClick: onRakeback,
    "aria-label": "\u0421\u0442\u0430\u0442\u0443\u0441 \u0440\u0435\u0439\u043A\u0431\u0435\u043A\u0430"
  }, /*#__PURE__*/React.createElement("span", {
    className: "ps-rake-art"
  }, /*#__PURE__*/React.createElement(RbFlatStatusCard, {
    level: P.level,
    width: 43
  })), /*#__PURE__*/React.createElement("span", {
    className: "ps-rake-copy"
  }, /*#__PURE__*/React.createElement("span", {
    className: "ps-rake-label"
  }, "\u0411\u043E\u043D\u0443\u0441 \u043A\u0430\u0440\u0442\u044B"), /*#__PURE__*/React.createElement("strong", {
    className: "ps-rake-bonus"
  }, "+", L.rbExtra(P.level), "% ", /*#__PURE__*/React.createElement("span", null, "\u043A \u0431\u0430\u0437\u043E\u0432\u043E\u043C\u0443 \u0440\u0435\u0439\u043A\u0431\u0435\u043A\u0443")))));
}
function PlayerProfileScreen({
  open,
  onClose,
  accent = "#D71921",
  avatar,
  onAvatar,
  inline = false,
  embedded = false,
  onReplay
}) {
  const [handsOpen, setHandsOpen] = React.useState(false);
  // Карьера: дисципліна та період статистики (пігулки дисциплін — ті самі, що в кеш-лобі; період — той самий сегмент, що в налаштуваннях)
  const [disc, setDisc] = React.useState("ALL");
  const [period, setPeriod] = React.useState("30d");
  const [helpOpen, setHelpOpen] = React.useState(false);
  const [pickerOpen, setPickerOpen] = React.useState(false);
  const [recordReplay, setRecordReplay] = React.useState(null);
  const [idCopy, setIdCopy] = React.useState('');
  React.useEffect(() => {
    if (!idCopy) return;
    const timer = setTimeout(() => setIdCopy(''), 1800);
    return () => clearTimeout(timer);
  }, [idCopy]);
  const copyId = async () => {
    try {
      await navigator.clipboard.writeText('48213');
      setIdCopy('Скопировано');
    } catch (e) {
      setIdCopy('Не удалось скопировать');
    }
  };
  React.useEffect(() => {
    if (!open) {
      setHandsOpen(false);
      setHelpOpen(false);
      setPickerOpen(false);
      setRecordReplay(null);
      setIdCopy('');
      return;
    }
    if (inline) return;
    window.dispatchEvent(new CustomEvent("px-full", {
      detail: 1
    }));
    return () => window.dispatchEvent(new CustomEvent("px-full", {
      detail: -1
    }));
  }, [open]);
  if (!open) return null;
  const L = window.cmLeague,
    P = window.cmPlayer || {
      level: 24
    },
    lg = L.forLevel(P.level);
  return /*#__PURE__*/React.createElement("div", {
    className: "me-overlay me-screen",
    role: inline ? undefined : "dialog",
    "aria-modal": inline ? undefined : "true",
    "aria-label": "Profile",
    style: embedded ? {
      position: "static",
      inset: "auto",
      height: "auto",
      zIndex: "auto",
      background: "transparent",
      animation: "none",
      display: "block"
    } : inline ? {
      position: "relative",
      inset: "auto",
      height: "100%",
      zIndex: 1,
      background: "transparent",
      animation: "none"
    } : undefined
  }, !embedded && /*#__PURE__*/React.createElement("div", {
    style: {
      position: "absolute",
      top: 0,
      left: 0,
      right: 0,
      height: 340,
      pointerEvents: "none",
      background: `radial-gradient(ellipse 90% 70% at 50% 0%, ${lg.color}2a 0%, transparent 62%)`
    }
  }), !inline && /*#__PURE__*/React.createElement("div", {
    className: "me-top"
  }, /*#__PURE__*/React.createElement("button", {
    className: "me-back",
    "aria-label": "Back",
    onClick: () => {
      meClick(900);
      onClose();
    }
  }, /*#__PURE__*/React.createElement("svg", {
    width: "16",
    height: "16",
    viewBox: "0 0 24 24",
    fill: "none",
    stroke: "#fff",
    strokeWidth: "2.4",
    strokeLinecap: "round",
    strokeLinejoin: "round"
  }, /*#__PURE__*/React.createElement("path", {
    d: "M15 6l-6 6 6 6"
  }))), /*#__PURE__*/React.createElement("span", {
    className: "me-title"
  }, "PROFILE"), /*#__PURE__*/React.createElement("span", {
    style: {
      width: 36
    }
  })), /*#__PURE__*/React.createElement("div", {
    className: "me-scroll",
    style: embedded ? {
      overflow: "visible",
      flex: "none",
      padding: "4px 0 0",
      zIndex: "auto"
    } : {
      padding: "4px 0 44px"
    }
  }, !inline && /*#__PURE__*/React.createElement(PxProfileHero, {
    avatar: avatar,
    onEdit: () => {
      meClick(1200);
      setPickerOpen(true);
    }
  }), inline && window.ClDiscTabs && /*#__PURE__*/React.createElement("div", {
    style: {
      marginTop: embedded ? 22 : 14
    }
  }, /*#__PURE__*/React.createElement(window.ClDiscTabs, {
    discs: ["ALL", "HOLD'EM", "PLO", "PLO5", "SHORT DECK"],
    value: disc,
    onChange: setDisc
  })), inline && window.SSegment && /*#__PURE__*/React.createElement("div", {
    style: {
      padding: "2px 16px 6px"
    }
  }, /*#__PURE__*/React.createElement(window.SSegment, {
    options: [{
      id: "today",
      label: "TODAY"
    }, {
      id: "week",
      label: "WEEK"
    }, {
      id: "30d",
      label: "30 DAYS"
    }],
    value: period,
    onChange: setPeriod,
    accent: accent
  })), /*#__PURE__*/React.createElement(MeBiggestPot, {
    onReplay: h => setRecordReplay(h)
  }), /*#__PURE__*/React.createElement("section", {
    className: "me-performance",
    "aria-label": "Game statistics"
  }, /*#__PURE__*/React.createElement("h3", {
    className: "me-section-heading"
  }, "GAME STATS"), /*#__PURE__*/React.createElement("div", {
    className: "me-performance-grid"
  }, (inline ? meStatsFor(disc, period) : ME_STATS).map(s => /*#__PURE__*/React.createElement("div", {
    className: "me-performance-item",
    key: s.l
  }, /*#__PURE__*/React.createElement("div", {
    className: "me-performance-label"
  }, s.l), /*#__PURE__*/React.createElement("strong", {
    "data-i18n": "off"
  }, s.v), /*#__PURE__*/React.createElement("div", {
    className: "me-performance-note"
  }, s.s))))), !inline && /*#__PURE__*/React.createElement("div", {
    className: "me-card",
    style: {
      marginTop: 20,
      overflow: "hidden",
      background: `linear-gradient(150deg, ${accent}17 0%, #0c0c0f 56%, #0a0a0c 100%)`,
      borderColor: `${accent}30`
    }
  }, /*#__PURE__*/React.createElement("button", {
    className: "me-row",
    onClick: () => {
      meClick();
      setHandsOpen(true);
    }
  }, /*#__PURE__*/React.createElement("span", {
    className: "me-row-ic"
  }, /*#__PURE__*/React.createElement(PIcon, {
    kind: "history",
    color: "rgba(255,255,255,.85)",
    size: 18
  })), /*#__PURE__*/React.createElement("span", {
    style: {
      flex: 1,
      minWidth: 0
    }
  }, /*#__PURE__*/React.createElement("span", {
    className: "me-row-t"
  }, "HAND HISTORY"), /*#__PURE__*/React.createElement("span", {
    className: "me-row-s"
  }, "Your last 100 hands \xB7 replay")), /*#__PURE__*/React.createElement("svg", {
    width: "14",
    height: "14",
    viewBox: "0 0 24 24",
    fill: "none",
    stroke: "rgba(255,255,255,.35)",
    strokeWidth: "2.4",
    strokeLinecap: "round",
    strokeLinejoin: "round"
  }, /*#__PURE__*/React.createElement("path", {
    d: "M9 6l6 6-6 6"
  }))), /*#__PURE__*/React.createElement("button", {
    className: "me-row",
    onClick: () => {
      meClick();
      setHelpOpen(true);
    }
  }, /*#__PURE__*/React.createElement("span", {
    className: "me-row-ic"
  }, /*#__PURE__*/React.createElement(PIcon, {
    kind: "help",
    color: "rgba(255,255,255,.85)",
    size: 18
  })), /*#__PURE__*/React.createElement("span", {
    style: {
      flex: 1,
      minWidth: 0
    }
  }, /*#__PURE__*/React.createElement("span", {
    className: "me-row-t"
  }, "HELP & SUPPORT"), /*#__PURE__*/React.createElement("span", {
    className: "me-row-s"
  }, "Telegram \xB7 around the clock")), /*#__PURE__*/React.createElement("svg", {
    width: "14",
    height: "14",
    viewBox: "0 0 24 24",
    fill: "none",
    stroke: "rgba(255,255,255,.35)",
    strokeWidth: "2.4",
    strokeLinecap: "round",
    strokeLinejoin: "round"
  }, /*#__PURE__*/React.createElement("path", {
    d: "M9 6l6 6-6 6"
  })))), !inline && /*#__PURE__*/React.createElement("div", {
    style: {
      textAlign: "center",
      marginTop: 18,
      fontFamily: ME_SANS,
      fontWeight: 600,
      fontSize: 12,
      color: "#A9A9B2",
      letterSpacing: ".16em"
    },
    "data-i18n": "off"
  }, "POKERDOT \xB7 v3")), window.HandHistoryScreen && /*#__PURE__*/React.createElement(window.HandHistoryScreen, {
    open: handsOpen,
    onClose: () => setHandsOpen(false),
    accent: accent
  }), window.HelpSupportSheet && /*#__PURE__*/React.createElement(window.HelpSupportSheet, {
    open: helpOpen,
    onClose: () => setHelpOpen(false),
    accent: accent
  }), recordReplay && /*#__PURE__*/React.createElement(window.HandReplayV2, {
    open: true,
    hand: recordReplay,
    onClose: () => setRecordReplay(null),
    accent: accent
  }), /*#__PURE__*/React.createElement(AvatarPickerSheet, {
    open: pickerOpen,
    current: avatar,
    accent: accent,
    onClose: () => setPickerOpen(false),
    onSelect: src => onAvatar && onAvatar(src)
  }));
}

// ── Розділ «Я» ─────────────────────────────────────────────────────────
// House-first loyalty: rake cycles and card XP are independent.
let RB_CARD_ART_ID = 0;
// Flat companion of the house back: same charcoal plate, pinstripes and red/chrome DOT.
function RbHouseCardBack({
  width = 56
}) {
  const [id] = React.useState(() => `pd-house-back-${++RB_CARD_ART_ID}`);
  return /*#__PURE__*/React.createElement("span", {
    className: "pd-status-card",
    "data-i18n": "off",
    "aria-label": "\u0417\u0430\u043A\u0440\u044B\u0442\u0430\u044F \u043A\u0430\u0440\u0442\u0430",
    style: {
      display: 'inline-block',
      width,
      height: width * 1.4,
      flex: 'none',
      verticalAlign: 'middle',
      borderRadius: width * .05,
      boxShadow: '0 7px 16px #0005'
    }
  }, /*#__PURE__*/React.createElement("svg", {
    viewBox: "0 0 512 720",
    width: "100%",
    height: "100%",
    "aria-hidden": "true",
    style: {
      display: 'block',
      borderRadius: 'inherit'
    }
  }, /*#__PURE__*/React.createElement("defs", null, /*#__PURE__*/React.createElement("linearGradient", {
    id: `${id}-plate`,
    x2: "1",
    y2: "1"
  }, /*#__PURE__*/React.createElement("stop", {
    stopColor: "#30333b"
  }), /*#__PURE__*/React.createElement("stop", {
    offset: ".42",
    stopColor: "#17191e"
  }), /*#__PURE__*/React.createElement("stop", {
    offset: "1",
    stopColor: "#0c0d11"
  })), /*#__PURE__*/React.createElement("radialGradient", {
    id: `${id}-chrome`,
    cx: ".28",
    cy: ".18",
    r: ".92"
  }, /*#__PURE__*/React.createElement("stop", {
    stopColor: "#fff"
  }), /*#__PURE__*/React.createElement("stop", {
    offset: ".3",
    stopColor: "#e2e5ee"
  }), /*#__PURE__*/React.createElement("stop", {
    offset: ".56",
    stopColor: "#9fa9b8"
  }), /*#__PURE__*/React.createElement("stop", {
    offset: ".72",
    stopColor: "#e9eef5"
  }), /*#__PURE__*/React.createElement("stop", {
    offset: "1",
    stopColor: "#535d70"
  })), /*#__PURE__*/React.createElement("radialGradient", {
    id: `${id}-red`,
    cx: ".3",
    cy: ".16",
    r: ".95"
  }, /*#__PURE__*/React.createElement("stop", {
    stopColor: "#ff9aa5"
  }), /*#__PURE__*/React.createElement("stop", {
    offset: ".22",
    stopColor: "#e31e3b"
  }), /*#__PURE__*/React.createElement("stop", {
    offset: ".66",
    stopColor: "#b10822"
  }), /*#__PURE__*/React.createElement("stop", {
    offset: "1",
    stopColor: "#510717"
  })), /*#__PURE__*/React.createElement("pattern", {
    id: `${id}-brush`,
    width: "5",
    height: "720",
    patternUnits: "userSpaceOnUse"
  }, /*#__PURE__*/React.createElement("path", {
    d: "M.5 58V662",
    stroke: "#89909c",
    strokeWidth: ".65",
    opacity: ".055"
  }))), /*#__PURE__*/React.createElement("rect", {
    x: "1",
    y: "1",
    width: "510",
    height: "718",
    rx: "25",
    fill: `url(#${id}-plate)`,
    stroke: "#89909c",
    strokeWidth: "2"
  }), [21, 33].map((n, i) => /*#__PURE__*/React.createElement("rect", {
    key: n,
    x: n,
    y: n,
    width: 512 - n * 2,
    height: 720 - n * 2,
    rx: "22",
    fill: "none",
    stroke: i ? '#89909c' : '#e8eff9',
    strokeWidth: i ? 1.2 : 2.7
  })), /*#__PURE__*/React.createElement("rect", {
    x: "51",
    y: "58",
    width: "414",
    height: "604",
    fill: `url(#${id}-brush)`
  }), /*#__PURE__*/React.createElement("path", {
    d: "M256 158 440 360 256 562 72 360Z",
    fill: "#17191e",
    stroke: "#a42a3b",
    strokeOpacity: ".7",
    strokeWidth: "1.5"
  }), /*#__PURE__*/React.createElement("path", {
    d: "M256 169 430 360 256 551 82 360Z",
    fill: "none",
    stroke: "#a42a3b",
    strokeOpacity: ".4",
    strokeWidth: ".8"
  }), /*#__PURE__*/React.createElement("text", {
    x: "256",
    y: "107",
    textAnchor: "middle",
    dominantBaseline: "middle",
    fontFamily: "sans-serif",
    fontWeight: "600",
    fontSize: "17",
    fill: "#edf3fc"
  }, "P O K E R D O T"), [[256, 286, true], [182, 360, false], [330, 360, false], [256, 434, false]].map(([x, y, red]) => /*#__PURE__*/React.createElement("g", {
    key: x + ':' + y
  }, /*#__PURE__*/React.createElement("ellipse", {
    cx: x,
    cy: y + 5,
    rx: "40",
    ry: "39",
    fill: "#000",
    opacity: ".5"
  }), /*#__PURE__*/React.createElement("circle", {
    cx: x,
    cy: y,
    r: "40",
    fill: `url(#${id}-${red ? 'red' : 'chrome'})`
  }), /*#__PURE__*/React.createElement("path", {
    d: `M${x - 23} ${y + 21}Q${x - 40} ${y - 9} ${x - 13} ${y - 31}`,
    stroke: "#fff",
    opacity: red ? .5 : .72,
    strokeWidth: "2.3",
    fill: "none"
  })))));
}
function RbFlatStatusCard({
  level,
  locked = false,
  width = 56
}) {
  const [id] = React.useState(() => `pd-deck-${++RB_CARD_ART_ID}`);
  if (locked) return /*#__PURE__*/React.createElement(RbHouseCardBack, {
    width: width
  });
  const rank = level === 14 ? 'DOT' : window.cmLeague.rankForLevel(level),
    gold = level === 14 && !locked;
  const palette = locked ? ['#242830', '#101216', '#707780'] : gold ? ['#6e5030', '#211911', '#d5af6b'] : level > 9 ? ['#851f37', '#2c0b19', '#e7a2ac'] : level > 5 ? ['#135459', '#071f28', '#86c3c3'] : ['#243b59', '#0b1425', '#a4bddb'];
  const paint = name => `url(#${id}-${name})`;
  const rankStyle = {
    fontFamily: 'var(--cm-font-display, ' + ME_SANS + ')',
    fontWeight: 500,
    letterSpacing: '-.055em'
  };
  const mark = (x, y, size, fill, extra = {}) => /*#__PURE__*/React.createElement("use", _extends({
    href: `#${id}-symbol`,
    x: x,
    y: y,
    width: size,
    height: size * 108 / 107,
    fill: fill
  }, extra));
  const corner = /*#__PURE__*/React.createElement("g", {
    className: "pd-card-index"
  }, mark(22, 24, 38, '#f6f4f0'));
  return /*#__PURE__*/React.createElement("span", {
    className: "pd-status-card",
    "data-i18n": "off",
    "data-art": "dot-engraved",
    "aria-label": locked ? 'Закрытая карта' : `Карта ${rank}`,
    style: {
      display: 'inline-block',
      position: 'relative',
      width,
      height: width * 1.4,
      flex: 'none',
      verticalAlign: 'middle',
      borderRadius: width * .05,
      boxShadow: '0 7px 16px #0005'
    }
  }, /*#__PURE__*/React.createElement("svg", {
    viewBox: "0 0 240 336",
    width: "100%",
    height: "100%",
    role: "img",
    "aria-hidden": "true",
    style: {
      display: 'block',
      borderRadius: 'inherit',
      fontFamily: 'var(--cm-font-display, ' + ME_SANS + ')'
    }
  }, /*#__PURE__*/React.createElement("defs", null, /*#__PURE__*/React.createElement("symbol", {
    id: `${id}-symbol`,
    viewBox: "-3 4.5 107 108"
  }, /*#__PURE__*/React.createElement("path", {
    d: "M63.1171298,77.5219731 C70.0854238,84.4811655 70.0854238,95.7642414 63.1171298,102.723434 C56.1488303,109.682621 44.850989,109.682621 37.8826895,102.723434 C30.9143955,95.7642414 30.9143955,84.4811655 37.8826895,77.5219731 C44.850989,70.5627861 56.1488303,70.5627861 63.1171298,77.5219731 Z M30.4606608,44.9081838 C37.4289548,51.8673762 37.4289548,63.1504521 30.4606608,70.1096445 C23.4923613,77.0688315 12.19452,77.0688315 5.22622051,70.1096445 C-1.7420735,63.1504521 -1.7420735,51.8673762 5.22622051,44.9081838 C12.19452,37.9489968 23.4923613,37.9489968 30.4606608,44.9081838 Z M70.5391584,44.9081838 C77.507458,37.9489968 88.8052993,37.9489968 95.7735988,44.9081838 C102.741893,51.8673762 102.741893,63.1504521 95.7735988,70.1096445 C88.8052993,77.0688315 77.507458,77.0688315 70.5391584,70.1096445 C63.5708644,63.1504521 63.5708644,51.8673762 70.5391584,44.9081838 Z"
  }), /*#__PURE__*/React.createElement("circle", {
    cx: "50.7749778",
    cy: "25.2115551",
    r: "17.8272615"
  })), /*#__PURE__*/React.createElement("linearGradient", {
    id: `${id}-face`,
    x1: "0",
    y1: "0",
    x2: "1",
    y2: "1"
  }, /*#__PURE__*/React.createElement("stop", {
    stopColor: palette[0]
  }), /*#__PURE__*/React.createElement("stop", {
    offset: ".56",
    stopColor: palette[1]
  }), /*#__PURE__*/React.createElement("stop", {
    offset: "1",
    stopColor: palette[0]
  })), /*#__PURE__*/React.createElement("linearGradient", {
    id: `${id}-edge`,
    x1: "0",
    y1: "0",
    x2: "1",
    y2: "1"
  }, /*#__PURE__*/React.createElement("stop", {
    stopColor: "#fff3"
  }), /*#__PURE__*/React.createElement("stop", {
    offset: ".2",
    stopColor: palette[2]
  }), /*#__PURE__*/React.createElement("stop", {
    offset: ".45",
    stopColor: palette[1]
  }), /*#__PURE__*/React.createElement("stop", {
    offset: ".72",
    stopColor: palette[2]
  }), /*#__PURE__*/React.createElement("stop", {
    offset: "1",
    stopColor: "#fff4"
  })), /*#__PURE__*/React.createElement("linearGradient", {
    id: `${id}-silk`,
    x1: "0",
    y1: "0",
    x2: "1",
    y2: ".7"
  }, /*#__PURE__*/React.createElement("stop", {
    stopColor: "#fff",
    stopOpacity: ".07"
  }), /*#__PURE__*/React.createElement("stop", {
    offset: ".43",
    stopColor: "#fff",
    stopOpacity: "0"
  }), /*#__PURE__*/React.createElement("stop", {
    offset: ".8",
    stopColor: "#fff",
    stopOpacity: ".045"
  }), /*#__PURE__*/React.createElement("stop", {
    offset: "1",
    stopColor: "#fff",
    stopOpacity: "0"
  })), /*#__PURE__*/React.createElement("pattern", {
    id: `${id}-grain`,
    width: "4",
    height: "4",
    patternUnits: "userSpaceOnUse"
  }, /*#__PURE__*/React.createElement("path", {
    d: "M0 .5h4",
    stroke: "#fff",
    strokeWidth: ".4",
    opacity: ".06"
  })), /*#__PURE__*/React.createElement("linearGradient", {
    id: `${id}-engraving`,
    x1: "0",
    y1: "0",
    x2: "1",
    y2: "0"
  }, /*#__PURE__*/React.createElement("stop", {
    stopColor: palette[2],
    stopOpacity: ".4"
  }), /*#__PURE__*/React.createElement("stop", {
    offset: ".35",
    stopColor: palette[2],
    stopOpacity: ".07"
  }), /*#__PURE__*/React.createElement("stop", {
    offset: ".65",
    stopColor: palette[2],
    stopOpacity: ".07"
  }), /*#__PURE__*/React.createElement("stop", {
    offset: "1",
    stopColor: palette[2],
    stopOpacity: ".4"
  })), /*#__PURE__*/React.createElement("linearGradient", {
    id: `${id}-glint`,
    x1: "0",
    y1: "0",
    x2: "1",
    y2: ".2"
  }, /*#__PURE__*/React.createElement("stop", {
    stopColor: "#fff",
    stopOpacity: "0"
  }), /*#__PURE__*/React.createElement("stop", {
    offset: ".47",
    stopColor: "#fff",
    stopOpacity: "0"
  }), /*#__PURE__*/React.createElement("stop", {
    offset: ".5",
    stopColor: "#fff",
    stopOpacity: ".1"
  }), /*#__PURE__*/React.createElement("stop", {
    offset: ".54",
    stopColor: "#fff",
    stopOpacity: "0"
  }), /*#__PURE__*/React.createElement("stop", {
    offset: "1",
    stopColor: "#fff",
    stopOpacity: "0"
  })), /*#__PURE__*/React.createElement("pattern", {
    id: `${id}-back`,
    width: "40",
    height: "40",
    patternUnits: "userSpaceOnUse"
  }, /*#__PURE__*/React.createElement("path", {
    d: "M20 0C20 12 8 20 0 20C12 20 20 28 20 40C20 28 28 20 40 20C28 20 20 12 20 0Z",
    fill: "none",
    stroke: "#929ca9",
    strokeWidth: ".6",
    opacity: ".18"
  })), /*#__PURE__*/React.createElement("clipPath", {
    id: `${id}-clip`
  }, /*#__PURE__*/React.createElement("rect", {
    x: "2",
    y: "2",
    width: "236",
    height: "332",
    rx: "11"
  }))), /*#__PURE__*/React.createElement("rect", {
    x: "1",
    y: "1",
    width: "238",
    height: "334",
    rx: "12",
    fill: paint('face'),
    stroke: paint('edge'),
    strokeWidth: "2"
  }), /*#__PURE__*/React.createElement("g", {
    clipPath: paint('clip')
  }, /*#__PURE__*/React.createElement("rect", {
    x: "2",
    y: "2",
    width: "236",
    height: "332",
    fill: paint('grain')
  }), /*#__PURE__*/React.createElement("rect", {
    x: "2",
    y: "2",
    width: "236",
    height: "332",
    fill: paint('silk')
  }), /*#__PURE__*/React.createElement("rect", {
    x: "9",
    y: "9",
    width: "222",
    height: "318",
    rx: "7",
    fill: "none",
    stroke: palette[2],
    strokeWidth: ".9",
    opacity: ".65"
  }), /*#__PURE__*/React.createElement("path", {
    d: "M13 81V25a12 12 0 0 1 12-12h55M227 255v56a12 12 0 0 1-12 12h-55",
    fill: "none",
    stroke: "#f3eee5",
    strokeWidth: "1.4",
    opacity: ".6"
  }), locked ? /*#__PURE__*/React.createElement(React.Fragment, null, /*#__PURE__*/React.createElement("rect", {
    x: "16",
    y: "16",
    width: "208",
    height: "304",
    rx: "4",
    fill: paint('back')
  }), /*#__PURE__*/React.createElement("path", {
    d: "M120 89C149 117 174 129 185 168C174 207 149 219 120 247C91 219 66 207 55 168C66 129 91 117 120 89Z",
    fill: palette[1],
    stroke: "#9ba3af",
    strokeWidth: ".8"
  }), /*#__PURE__*/React.createElement("path", {
    d: "M120 100C143 124 165 136 174 168C165 200 143 212 120 236C97 212 75 200 66 168C75 136 97 124 120 100Z",
    fill: "none",
    stroke: "#9ba3af",
    strokeWidth: ".5",
    opacity: ".4"
  }), mark(83, 130, 74, '#bfc4cc'), /*#__PURE__*/React.createElement("g", {
    transform: "translate(111 265)",
    fill: "none",
    stroke: "#9ba3af",
    strokeWidth: "2",
    strokeLinecap: "round"
  }, /*#__PURE__*/React.createElement("rect", {
    y: "8",
    width: "18",
    height: "16",
    rx: "3"
  }), /*#__PURE__*/React.createElement("path", {
    d: "M4 8V5a5 5 0 0 1 10 0v3M9 14v4"
  }))) : /*#__PURE__*/React.createElement(React.Fragment, null, /*#__PURE__*/React.createElement("path", {
    d: "M76 23h130a11 11 0 0 1 11 11v154M23 148v154a11 11 0 0 0 11 11h130",
    fill: "none",
    stroke: palette[2],
    strokeWidth: ".7",
    opacity: ".55"
  }), /*#__PURE__*/React.createElement("g", {
    fill: "none",
    stroke: paint('engraving'),
    strokeWidth: ".8"
  }, Array.from({
    length: 18
  }, (_, n) => /*#__PURE__*/React.createElement(React.Fragment, {
    key: n
  }, /*#__PURE__*/React.createElement("path", {
    d: `M${23 + n * 3.3} 68C${132 + n * 2} 97 ${-48 + n * 6} 239 ${77 + n * 4.5} 271`
  }), /*#__PURE__*/React.createElement("path", {
    d: `M${217 - n * 3.3} 268C${108 - n * 2} 239 ${288 - n * 6} 97 ${163 - n * 4.5} 65`
  })))), /*#__PURE__*/React.createElement("text", {
    className: "pd-card-rank",
    x: "120",
    y: "170",
    dominantBaseline: "central",
    textAnchor: "middle",
    fontSize: gold ? 78 : rank === '10' ? 136 : 176,
    style: rankStyle,
    fill: "#000",
    opacity: ".45",
    transform: "translate(0 1.5)"
  }, rank), /*#__PURE__*/React.createElement("text", {
    className: "pd-card-rank",
    x: "120",
    y: "168",
    dominantBaseline: "central",
    textAnchor: "middle",
    fontSize: gold ? 78 : rank === '10' ? 136 : 176,
    style: rankStyle,
    fill: gold ? '#f3dfb8' : '#f4f0e8'
  }, rank), corner, /*#__PURE__*/React.createElement("g", {
    transform: "translate(240 336) rotate(180)"
  }, corner), /*#__PURE__*/React.createElement("text", {
    x: "150",
    y: "43",
    textAnchor: "middle",
    fill: palette[2],
    style: {
      fontFamily: "inherit"
    },
    fontSize: "9",
    fontWeight: "600",
    letterSpacing: "2.6"
  }, "POKERDOT"), /*#__PURE__*/React.createElement("g", {
    transform: "translate(240 336) rotate(180)"
  }, /*#__PURE__*/React.createElement("text", {
    x: "150",
    y: "43",
    textAnchor: "middle",
    fill: palette[2],
    style: {
      fontFamily: "inherit"
    },
    fontSize: "9",
    fontWeight: "600",
    letterSpacing: "2.6"
  }, "POKERDOT"))), width > 100 && !locked && /*#__PURE__*/React.createElement("rect", {
    className: "pd-card-glint",
    x: "-240",
    y: "0",
    width: "240",
    height: "336",
    fill: paint('glint')
  }, /*#__PURE__*/React.createElement("animate", {
    attributeName: "x",
    from: "-240",
    to: "240",
    dur: "1.8s",
    begin: ".15s",
    fill: "freeze"
  })))));
}
const rbBonusLabel = n => String(window.cmLeague.rbExtra(n)).replace('.', ',');
const rbRankName = n => ({
  J: 'Валет',
  Q: 'Дама',
  K: 'Король',
  A: 'Туз',
  DOT: 'DOT'
})[window.cmLeague.rankForLevel(n)] || `Карта ${window.cmLeague.rankForLevel(n)}`;
function RbCardProgress({
  player: P,
  noRank = false,
  league: L = window.cmLeague
}) {
  const complete = P.level >= L.TOTAL,
    next = Math.min(L.TOTAL, P.level + 1),
    pct = complete ? 100 : Math.min(100, P.xp / P.xpNext * 100),
    remaining = Math.max(0, P.xpNext - P.xp);
  return /*#__PURE__*/React.createElement("div", {
    className: "rb-card-progress"
  }, /*#__PURE__*/React.createElement("div", {
    className: "rb-card-progress-top"
  }, noRank ? /*#__PURE__*/React.createElement("strong", {
    style: {
      fontSize: 12,
      letterSpacing: ".1em",
      color: "#9a9fab",
      fontWeight: 600
    }
  }, complete ? "ВЫСШАЯ КАРТА" : "СЛЕДУЮЩАЯ КАРТА") : /*#__PURE__*/React.createElement("strong", null, L.rankForLevel(P.level), !complete && /*#__PURE__*/React.createElement(React.Fragment, null, /*#__PURE__*/React.createElement("span", {
    "aria-hidden": "true"
  }, "\u2192"), L.rankForLevel(next))), /*#__PURE__*/React.createElement("span", null, complete ? `${L.TOTAL} / ${L.TOTAL} карт` : /*#__PURE__*/React.createElement(React.Fragment, null, /*#__PURE__*/React.createElement("b", null, P.xp.toLocaleString()), /*#__PURE__*/React.createElement("i", null, " / ", P.xpNext.toLocaleString(), " XP")))), /*#__PURE__*/React.createElement("div", {
    className: "rb-card-progress-bar",
    role: "progressbar",
    "aria-label": "\u041F\u0440\u043E\u0433\u0440\u0435\u0441\u0441 \u0434\u043E \u0441\u043B\u0435\u0434\u0443\u044E\u0449\u0435\u0439 \u043A\u0430\u0440\u0442\u044B",
    "aria-valuenow": pct,
    "aria-valuemin": 0,
    "aria-valuemax": 100
  }, /*#__PURE__*/React.createElement("span", {
    style: {
      width: pct + '%'
    }
  })), /*#__PURE__*/React.createElement("div", {
    className: "rb-card-progress-bottom"
  }, /*#__PURE__*/React.createElement("span", null, complete ? 'Коллекция собрана' : 'Прогресс до следующей карты')));
}
// The collection has one supported format: 53 cards.
function RbCardCollection({
  onClose,
  onOverlay
}) {
  const [mounted, setMounted] = React.useState(false),
    [overlay, setOverlay] = React.useState(false);
  React.useLayoutEffect(() => {
    window.__iso53.on();
    setMounted(true);
    return () => window.__iso53.off();
  }, []);
  React.useEffect(() => {
    onOverlay?.(overlay);
    return () => onOverlay?.(false);
  }, [overlay, onOverlay]);
  if (!mounted) return null;
  return /*#__PURE__*/React.createElement("section", {
    "data-i18n": "off",
    "aria-label": "\u041A\u043E\u043B\u043B\u0435\u043A\u0446\u0438\u044F \u043A\u0430\u0440\u0442",
    style: {
      position: 'absolute',
      inset: 0,
      zIndex: 82
    }
  }, /*#__PURE__*/React.createElement(window.RbIso53Screen, {
    onClose: onClose,
    onOverlay: setOverlay
  }));
}
function RbHouseFirst({
  onProfile,
  onHistory,
  onOverlay,
  onFullscreen,
  onBack,
  compact = false,
  noIdentity = false,
  onIso53,
  onCollection,
  obscured = false
}) {
  const [notReady, setNotReady] = React.useState(false);
  const [, refresh] = React.useState(0),
    [collection, setCollection] = React.useState(false),
    [selected, setSelected] = React.useState(null),
    [flipping, setFlipping] = React.useState(false),
    [revealed, setRevealed] = React.useState(null),
    [cardReward, setCardReward] = React.useState(null),
    [baseInfo, setBaseInfo] = React.useState(false),
    [cardInfo, setCardInfo] = React.useState(false),
    [rules, setRules] = React.useState(false),
    [pay, setPay] = React.useState(null),
    [collecting, setCollecting] = React.useState(false);
  const timer = React.useRef(null),
    guard = React.useRef(false);
  const houseRoot = React.useRef(null),
    savedScroll = React.useRef(0),
    fullscreen = pay != null || cardReward != null;
  React.useLayoutEffect(() => {
    onFullscreen?.(fullscreen);
    const el = houseRoot.current;
    if (fullscreen && el) {
      savedScroll.current = el.scrollTop;
      el.scrollTop = 0;
    }
    return () => {
      onFullscreen?.(false);
      if (fullscreen && el) el.scrollTop = savedScroll.current;
    };
  }, [fullscreen, onFullscreen]);
  React.useEffect(() => {
    onOverlay?.(collection || pay != null || cardReward != null || rules || collecting || notReady);
    return () => onOverlay?.(false);
  }, [collection, pay, cardReward, rules, collecting, notReady]);
  React.useEffect(() => {
    const f = () => refresh(x => x + 1);
    window.addEventListener('me-refresh', f);
    return () => {
      window.removeEventListener('me-refresh', f);
      clearTimeout(timer.current);
    };
  }, []);
  const ringRef = React.useRef(null),
    [ringBox, setRingBox] = React.useState({
      w: 0,
      h: 54
    });
  React.useEffect(() => {
    const el = ringRef.current;
    if (!el) return;
    const upd = () => setRingBox({
      w: el.offsetWidth + 8,
      h: el.offsetHeight + 8
    });
    upd();
    const ro = new ResizeObserver(upd);
    ro.observe(el);
    return () => ro.disconnect();
  }, []);
  // Rakeback collection settles only the house payout, never card progression.
  const P = window.cmPlayer,
    L = window.cmLeague,
    ready = P.rakeCycle >= P.rakeThreshold,
    progress = Math.min(1, P.rakeCycle / P.rakeThreshold),
    hLevel = window.rbCycle.stage(P),
    tier = Math.min(3, Math.ceil(hLevel / 5)),
    gold = hLevel === 13;
  const historyButton = /*#__PURE__*/React.createElement("button", {
    className: "me-house-history",
    "aria-label": "\u0418\u0441\u0442\u043E\u0440\u0438\u044F \u0440\u0435\u0439\u043A\u0431\u0435\u043A\u0430",
    onClick: onHistory,
    style: {
      ...UI.btn("s", "ghost"),
      minHeight: 36,
      boxShadow: "none"
    }
  }, /*#__PURE__*/React.createElement("svg", {
    viewBox: "0 0 24 24",
    fill: "none",
    stroke: "currentColor",
    strokeWidth: "1.6"
  }, /*#__PURE__*/React.createElement("path", {
    d: "M4 8a8 8 0 1 1 0 8M4 3v5h5M12 7v5l3 2",
    strokeLinecap: "round",
    strokeLinejoin: "round"
  })), "\u0418\u0421\u0422\u041E\u0420\u0418\u042F \u0420\u0415\u0419\u041A\u0411\u0415\u041A\u0410");
  const notify = () => window.dispatchEvent(new Event('me-refresh'));
  const collect = () => {
    if (guard.current) return;
    if (!ready) {
      setNotReady(true);
      return;
    }
    window.rbCoinAudio?.prepare();
    guard.current = true;
    setCollecting(true);
    // Prototype settlement boundary. Production replaces this with a server response.
    timer.current = setTimeout(() => {
      const base = Math.round(P.rakeCycle * .10 * 100) / 100,
        amount = Math.round(base * (1 + L.rbExtra(P.level) / 100) * 100) / 100;
      setCollecting(false);
      setPay({
        amount,
        base,
        bonus: L.rbExtra(P.level),
        level: P.level,
        credited: false
      });
    }, 650);
  };
  const unlock = () => setSelected(null);
  return /*#__PURE__*/React.createElement("div", {
    ref: houseRoot,
    className: "hf",
    "data-i18n": "off",
    style: fullscreen ? {
      overflow: "hidden"
    } : undefined
  }, /*#__PURE__*/React.createElement("style", null, `
 .hf-xp{display:flex;align-items:baseline;justify-content:center;gap:4px;margin:0 0 8px;font-family:var(--cm-font,${ME_MONO});font-variant-numeric:tabular-nums}.hf-xp strong{font-size:22px;font-weight:700;color:#fff;line-height:1}.hf-xp span{font-size:13px;font-weight:600;color:#a4a7af;letter-spacing:.04em}
 .hf-restored-progress .rb-card-progress-top{flex-wrap:wrap;gap:4px}.hf-restored-progress .rb-card-progress-top>strong{font-size:19px}.hf-restored-progress .rb-card-progress-top>span,.hf-restored-progress .rb-card-progress-top b{font-size:12px}
 .hf-primary-wrap{position:relative;width:100%;margin:6px 0 10px}.hf-ring{position:absolute;left:-4px;top:-4px;pointer-events:none;overflow:visible;display:block}
 .hf-ring path{fill:none;stroke-width:2px;stroke-linecap:round}.hf-ring-track{stroke:#ffffff12}.hf-ring-fill{stroke:#e0e7f0;filter:drop-shadow(0 0 3px #c5d6eb40);transition:stroke-dasharray .8s cubic-bezier(.2,.8,.2,1)}
 .hf-primary-wrap[data-ready=true] .hf-ring-track{stroke:transparent}
 .pd-career .hf .hf-primary-wrap:not([data-ready=true]) .hf-primary{background:linear-gradient(180deg,#242833,#171a22)!important;color:#e9edf3!important;opacity:1!important;box-shadow:inset 0 1px 0 #ffffff0d!important}
 .hf-primary-wrap[data-ready=true] .hf-ring-fill{stroke:#ffb5bb;filter:drop-shadow(0 0 4px #f1475350)}
 .hf-primary:focus-visible,.hf-collection-entry:focus-visible{outline:2px solid #e4eaf3;outline-offset:7px}
 .hf-collection-entry{display:block;width:100%;margin:26px 0 0;padding:0;text-align:left;color:#f5f6f8;border:1px solid #ffffff20;border-radius:18px;overflow:hidden;background:radial-gradient(ellipse at 100% 0,#37435745,transparent 65%),linear-gradient(140deg,#20242d,#121419 75%);box-shadow:inset 0 1px 0 #ffffff08,0 8px 24px #0002;transition:border-color .2s,transform .2s,background .2s}
 .hf-entry-body{display:flex;align-items:center;justify-content:space-between;padding:18px 22px 17px;gap:14px}.hf-entry-copy{display:flex;flex-direction:column;gap:6px}.hf-entry-title{display:flex;align-items:center;gap:8px;font-size:14px;font-weight:700;letter-spacing:.12em}.hf-entry-count{font-size:12px;color:#9fa7b6}.hf-entry-next{margin-top:6px;font-size:13px;color:#d6dbe4}.hf-entry-next strong{color:#fff;font-weight:600}.hf-entry-next small{display:block;margin-top:4px;color:#929ba9;font-size:12px}.hf-entry-art{position:relative;display:block;transform:rotate(7deg);margin:0 6px 0 0;filter:drop-shadow(0 6px 8px #0006)}.hf-entry-art>i{position:absolute;inset:0;border:1px solid #75829266;border-radius:4px;background:#171e28;transform:translate(-9px,3px) rotate(-14deg)}.hf-entry-art>span{position:relative}.hf-entry-action{display:flex;align-items:center;justify-content:space-between;gap:12px;border-top:1px solid #ffffff10;padding:13px 20px;font-size:12px;letter-spacing:.12em;font-weight:700;color:#e0e5ee;background:#ffffff03}.hf-entry-action svg{transition:transform .2s}.hf-collection-entry:active{transform:scale(.985)}
 @media(hover:hover){.hf-collection-entry:hover{border-color:#a9b9d15c;background-color:#252b35}.hf-collection-entry:hover .hf-entry-action svg{transform:translateX(3px)}}
 @media(prefers-reduced-motion:reduce){.hf-collection-entry,.hf-entry-action svg,.hf-ring-fill{transition:none}}

 .hf-glow{position:absolute;inset:-4px;border-radius:999px;pointer-events:none;box-shadow:0 0 18px 1px #ed344438,inset 0 0 5px #ffffff10;opacity:.45;animation:hf-glow 3s ease-in-out infinite}
 @keyframes hf-glow{0%,100%{opacity:.35}50%{opacity:.8}}
 @media (prefers-reduced-motion:reduce){.hf-glow{animation:none;opacity:.5}}
 .hf .hf-primary[data-ready=false]{background:#16171c!important;background-image:none!important;color:#8f95a1!important;opacity:1}
 .hf-stats{display:grid;grid-template-columns:1fr 1fr 1fr;margin:16px 16px 0;border:0;border-radius:0;background:transparent;overflow:visible}
 .hf .hf-stat{display:flex;flex-direction:column;align-items:center;justify-content:center;gap:7px;min-height:52px;padding:6px 6px;border:0;border-left:1px solid #ffffff22;border-radius:0;background:transparent;color:#fff;text-align:center;box-shadow:none!important;min-width:0}.hf .hf-stat:first-child{border-left:0}.hf .hf-stat-link strong{color:#d9dbe1;align-items:center}.hf .hf-stat:active{background:#ffffff0a}
 .hf-stat-label{display:inline-flex;align-items:center;gap:5px;font:600 12px ${ME_SANS};letter-spacing:.12em;color:#a4a7af;white-space:nowrap}.hf .hf-stat .hf-rules{width:14px;height:14px;font-size:12px;font-style:normal;flex:none;color:#a4a7af}
 .hf .hf-stat strong{display:inline-flex;align-items:center;gap:5px;height:18px;font:700 16px var(--cm-font,${ME_MONO});line-height:1;font-variant-numeric:tabular-nums;flex:none}
 .hf .hf-stat>.hf-stat-label,.hf .hf-stat>strong{display:inline-flex!important;width:auto!important;flex:none!important;align-self:center;justify-content:center}
 .hf-dev{display:flex;align-items:center;gap:8px;padding:8px 0 0;font:600 12px ${ME_SANS};letter-spacing:.12em;color:#6f7380}.hf-dev strong{font:700 12px var(--cm-font,${ME_MONO});color:#a4a7af;letter-spacing:.04em;min-width:110px;text-align:center}
 .hf .hf-dev button{width:26px;height:26px;padding:0;border-radius:50%;border:1px solid #ffffff2a;background:#ffffff0a;color:#d8d8df;font:700 14px ${ME_SANS};line-height:1;box-shadow:none!important}.hf .hf-dev .hf-dev-reset{width:auto;padding:0 10px;border-radius:999px;font:600 12px ${ME_SANS};letter-spacing:.1em}
 .hf-rules{display:grid;place-items:center;width:20px;height:20px;padding:0;border:1px solid #ffffff38;border-radius:50%;background:transparent;color:#a2a6af;font:600 12px ${ME_SANS}}
 .hf .hf-primary,.hf .rb-pay-primary{background:#d71921!important;background-image:none!important;color:#fff!important;border:0!important;box-shadow:none!important;min-height:54px;border-radius:999px;font-family:${ME_SANS};font-size:14px;font-weight:700;letter-spacing:.12em}.hf button{box-shadow:none!important}.hf .hf-secondary{background:transparent!important;background-image:none!important;border:1px solid #ffffff30!important;color:#eee!important}.hf-reveal-kicker{font-size:12px;letter-spacing:.14em;color:#a4a8b1;margin-bottom:30px}.hf-card-detail{perspective:900px}.hf-reveal-bonus{display:block;margin:22px 0;color:#e5c88f;font-size:12px;line-height:2.3;animation:hf-bonus .5s ease both}.hf-reveal-bonus strong{font-family:${ME_MONO};font-size:32px}.hf-card-detail[data-revealed=true]>div:nth-child(2){animation:hf-card-settle .65s cubic-bezier(.2,.8,.2,1) both}@keyframes hf-card-settle{0%{transform:scale(.94) translateY(8px)}60%{transform:scale(1.04) translateY(-3px)}100%{transform:none}}@keyframes hf-bonus{from{opacity:0;transform:translateY(12px)}to{opacity:1;transform:none}}@media(prefers-reduced-motion:reduce){.hf-card-detail[data-revealed=true]>div:nth-child(2),.hf-reveal-bonus{animation:none}}
 .hf{position:relative;isolation:isolate;height:100%;display:flex;flex-direction:column;color:#f4f4f6;font-family:${ME_SANS};background:radial-gradient(ellipse 90% 55% at 50% 38%,#3a4256 0%,#1a1e28 45%,transparent 80%),radial-gradient(ellipse 70% 40% at 50% 100%,#d7192114,transparent 70%),#0a0a0c;overflow:auto;scrollbar-width:none;padding-bottom:92px;box-sizing:border-box}.hf>*{flex:none}.hf *{box-sizing:border-box}.hf button{font-family:inherit;cursor:pointer}.hf button:disabled{cursor:default}.hf-content>button:first-child{background:#d71921!important;box-shadow:none!important}.hf-content>button:first-child:disabled{background:#d71921!important;opacity:.48}.hf-section-nav{display:flex;align-items:center;justify-content:space-between;padding:18px 16px 0}.hf-head{display:flex;align-items:center;gap:8px;padding:26px 22px 0}.hf-head h2{font:700 14px var(--cm-font-ui,${ME_SANS});letter-spacing:.12em;margin:0}.hf-scene{margin-top:0;flex:1 1 auto!important;min-height:340px;position:relative;isolation:isolate;overflow:hidden;display:flex;align-items:center;justify-content:center}.hf-scene>canvas{flex:none}.hf-scene canvas{position:relative;width:100%!important;max-width:none;z-index:1}.hf-cards-head{padding:0!important;justify-content:space-between;margin-top:22px}.hf-cards-head>span{font-size:12px;color:#9095a0;letter-spacing:.04em}.hf-content .hf-status{border-top:0;padding:16px 0 14px}.hf-ready{text-align:center;font-size:12px;line-height:18px;letter-spacing:.08em;color:#c9cbd1;margin:4px 0 15px}.hf-content{padding:18px 16px 0}.hf-caption{font-size:13px;color:#969ba7;text-align:center;line-height:1.5;margin:12px 0 26px}.hf-track{height:4px;background:#ffffff15;border-radius:2px;overflow:hidden}.hf-track>i{height:100%;display:block;background:#d71921;transition:width .5s}.hf-status{width:100%;display:flex;align-items:center;gap:14px;background:transparent;border:0;border-top:1px solid #ffffff18;border-bottom:1px solid #ffffff18;padding:18px 0;color:#fff;text-align:left}.hf-status-copy{flex:1;min-width:0}.hf-status-top{display:flex;align-items:center;justify-content:space-between;font-size:14px;margin-bottom:10px}.hf-status small{display:block;font-size:12px;color:#979ca6;margin-top:8px}.hf-status b{color:#e2c587;font-family:${ME_MONO};font-size:18px}.hf-note{font-size:13px;line-height:1.6;color:#979ca6;margin:18px 0}.hf-collection{position:absolute;inset:0;z-index:12;background:#101115;overflow:auto;padding:65px 22px 110px}.hf-collection h2{font:700 20px ${ME_MONO};letter-spacing:.08em;margin:0}.hf-grid{display:grid;grid-template-columns:repeat(4,1fr);gap:18px 12px;margin-top:26px}.hf-grid button{border:0;background:none;color:#969ba7;display:flex;align-items:center;flex-direction:column;gap:9px;padding:0;font-size:12px}.hf-card-modal{position:absolute;inset:0;z-index:14;display:flex;align-items:center;justify-content:center;padding:28px;background:#080a0dea;backdrop-filter:blur(10px)}.hf-card-detail{text-align:center;width:100%}.hf-card-detail h2{font:700 24px ${ME_MONO};margin:22px 0 10px}.hf-card-detail p{color:#a5a9b3;font-size:14px;line-height:1.6}.hf-flip{animation:hf-flip .84s ease-in-out both}@keyframes hf-flip{0%{transform:rotateY(0)}50%{transform:rotateY(90deg)}51%{transform:rotateY(-90deg)}100%{transform:rotateY(0)}}.hf-claim-light{position:absolute;inset:40% 15% 0;background:radial-gradient(ellipse,#edca7155,transparent 65%);animation:hf-release .65s ease-out both;pointer-events:none}@keyframes hf-release{to{transform:translateY(60px);opacity:0}}@media(prefers-reduced-motion:reduce){.pd-card-glint{display:none}.hf-flip,.hf-claim-light{animation:none}.hf-track>i{transition:none}}

 .hf .hf-card-modal{position:absolute;inset:0;z-index:14;display:flex;flex-direction:column;justify-content:flex-start;align-items:stretch;padding:0;background:#0a0a0c;backdrop-filter:none;font-family:var(--cm-font-ui,${ME_SANS});overflow:hidden}
 .rb-detail-header{display:grid;grid-template-columns:52px 1fr 52px;align-items:center;flex:none;padding:62px 22px 20px}.rb-detail-header h2{margin:0;text-align:center;font:700 16px var(--cm-font-ui,${ME_SANS});letter-spacing:.1em}.rb-detail-header>span{font-size:12px;color:#8f95a1;text-align:right}
 .hf .hf-card-detail{width:100%;flex:1;min-height:0;overflow:auto;padding:10px 22px 24px;text-align:center;display:flex;flex-direction:column;justify-content:center}.rb-detail-stage{padding:12px 0 28px}.hf .hf-reveal-kicker{margin:0 0 20px;font-size:12px;line-height:16px;letter-spacing:.14em;color:#aab0ba}.rb-detail-info{border-top:1px solid #ffffff14;padding:22px 0 0}.rb-detail-label{font-size:12px;letter-spacing:.12em;color:#9ca2ae}.rb-detail-value{font-size:36px;font-weight:700;line-height:44px;color:#e2c587;margin-top:8px}.rb-detail-value small{font-size:20px;color:#8e95a1;font-weight:400}.hf .hf-card-detail p{margin:4px 0 0;font-size:14px;line-height:20px;color:#c0c4cd}.rb-detail-note{margin:22px 0 0;color:#9198a4;font-size:13px;line-height:20px}.rb-detail-note .hf-track{margin:10px 0}.rb-detail-note>span{color:#eee}.rb-detail-footer{flex:none;padding:16px 22px max(28px,env(safe-area-inset-bottom));background:#101115}.hf .rb-detail-footer button{font-family:var(--cm-font-ui,${ME_SANS})}.hf-card-detail[data-revealed=true]>.rb-detail-stage{animation:hf-card-settle .65s ease both}.hf-card-detail[data-revealed=true]>div:nth-child(2){animation:none}
 .rb-route-row[data-state=past],.rb-route-row[data-state=past] .rb-route-art,.rb-route-row[data-state=past] .rb-route-copy{opacity:1;filter:none}.rb-route-row[data-state=past] .rb-route-copy>strong{color:#f4f4f6}
 .rb-card-progress,.hf-status{font-family:var(--cm-font-ui,${ME_SANS})}
 .rb-status-label{display:block;margin-bottom:7px;font-size:12px;letter-spacing:.14em;color:#a4a7af}.hf-status-copy{display:block}.hf-status .rb-card-progress{width:100%}.rb-card-progress-top{display:flex;align-items:center;justify-content:space-between;gap:10px}.rb-card-progress-top>strong{font:500 25px var(--cm-font-ui,${ME_SANS});color:#f4f4f6;display:flex;gap:12px;align-items:center}.rb-card-progress-top>strong>span{font-size:16px;color:#767c87}.rb-card-progress-top>span{font-size:14px;color:#f4f4f6;font-variant-numeric:tabular-nums;white-space:nowrap}.rb-card-progress-top b{font:600 14px var(--cm-font-ui,${ME_SANS});color:#f4f4f6}.rb-card-progress-top i{font-style:normal;color:#7f8590}.rb-card-progress-bar{height:4px;margin:10px 0;background:#ffffff12;border-radius:2px;overflow:hidden}.rb-card-progress-bar>span{display:block;height:100%;background:#d71921;border-radius:2px}.rb-card-progress-bottom{display:flex;justify-content:space-between;gap:8px;font-size:12px;line-height:18px;color:#8e95a1}.rb-card-progress-bottom>span:first-child{color:#c3c7cf}.rb-card-progress-bottom>span:last-child{text-align:right}.rb-card-progress-bottom small{display:block;font:inherit;color:#8e95a1}.rb-card-progress-bottom b{font:500 12px var(--cm-font-ui,${ME_SANS});color:#d8b981}.hf-status .rb-card-progress-top>strong{font-size:21px}.hf-status .rb-card-progress-bottom{flex-wrap:wrap;gap:2px 8px}.hf-status .rb-card-progress-bottom>span:last-child{text-align:right}.rb-card-progress-bottom small{display:block;font:inherit;color:#8e95a1}.rb-card-progress-bottom b{font-size:12px}
 .hf .hf-collection{font-family:var(--cm-font-ui,${ME_SANS});position:absolute;inset:0;z-index:12;display:flex;flex-direction:column;overflow:hidden;padding:0;background:radial-gradient(ellipse 100% 40% at 85% 45%,#44212d22,transparent 80%),#0a0a0c}.rb-route-header{flex:none;padding:62px 22px 20px;background:#0a0a0c;border-bottom:1px solid #ffffff10;z-index:2}.rb-route-title{display:flex;align-items:center;justify-content:space-between;margin-bottom:24px}.rb-route-title h2{font:700 16px var(--cm-font-ui,${ME_SANS});letter-spacing:.12em}.rb-route-title>span{font-size:13px;color:#eee;min-width:36px;text-align:right}.rb-route-title i{font-style:normal;color:#6f7682}.rb-route-scroll{position:relative;flex:1;min-height:0;overflow-y:auto;overscroll-behavior:contain;scrollbar-width:none;scroll-padding:16px}.rb-route-list{position:relative;margin:0 22px;padding:12px 0 4px}.rb-route-row{position:relative;display:grid;grid-template-columns:24px 104px minmax(0,1fr);align-items:center;gap:12px;width:100%;min-height:128px;padding:18px 0;border:0;background:none;color:#fff;text-align:left}.rb-route-row[data-state=current]{min-height:188px}.rb-route-link{position:absolute;top:38px;bottom:-38px;left:11px;width:2px;background:#ffffff12}.rb-route-link>i{display:block;position:absolute;bottom:0;height:var(--route-progress);width:100%;background:#d71921}.rb-route-row[data-state=past] .rb-route-link>i{background:#707780}.rb-route-node{position:absolute;top:28px;left:1px;width:22px;height:22px;display:grid;place-items:center;border-radius:50%;background:#101115;border:1px solid #454852;color:#9aa1ae;font-size:12px;z-index:1}.rb-route-node svg{width:14px;height:14px}.rb-route-row[data-state=current] .rb-route-node{background:#d71921;border-color:#e53b45;color:#fff}.rb-route-art{grid-column:2;display:flex;justify-content:center;position:relative;isolation:isolate}.rb-route-row[data-state=current] .rb-route-art:before{content:'';position:absolute;inset:-15px;background:radial-gradient(ellipse,#9e2e3b30,transparent 70%);z-index:-1}.rb-route-copy{grid-column:3;position:relative;display:flex;flex-direction:column;gap:7px}.rb-route-kicker{font-size:12px;letter-spacing:.12em;line-height:15px;color:#818896}.rb-route-copy>strong{font:500 21px var(--cm-font-ui,${ME_SANS});line-height:26px}.rb-route-row[data-state=current] .rb-route-kicker{color:#e8a2ad}.rb-route-row[data-state=current] .rb-route-copy>strong{font-size:27px;line-height:32px}.rb-route-bonus{font:500 18px var(--cm-font-ui,${ME_SANS});color:#e1c28b;line-height:23px;white-space:nowrap}.rb-route-bonus small{display:block;font:500 12px var(--cm-font-ui,${ME_SANS});color:#a8aeb8;line-height:17px;white-space:normal}.rb-route-note{font-size:12px;line-height:17px;color:#8d94a1}.rb-route-row[data-state=locked] .rb-route-copy>strong{font-size:16px;line-height:21px}.rb-route-row[data-state=locked] .rb-route-bonus{font-size:15px;color:#afb5bf}.rb-route-lock{position:absolute;top:0;right:0;width:16px;height:16px;color:#69717f}.rb-route-foot{margin:10px 34px 34px 58px;color:#7f8591;font-size:12px;line-height:19px}
 `), !compact && !noIdentity && /*#__PURE__*/React.createElement("div", {
    style: {
      padding: '62px 16px 0',
      display: 'flex',
      alignItems: 'center',
      justifyContent: 'space-between',
      gap: 12
    }
  }, /*#__PURE__*/React.createElement("button", {
    onClick: onProfile,
    style: {
      border: 0,
      padding: 0,
      background: 'none',
      color: '#fff',
      textAlign: 'left'
    }
  }, /*#__PURE__*/React.createElement(PxIdentity, null)), historyButton), compact && /*#__PURE__*/React.createElement("div", {
    className: "hf-section-nav"
  }, /*#__PURE__*/React.createElement(HfBack, {
    onClick: onBack
  }), historyButton), /*#__PURE__*/React.createElement("div", {
    className: "hf-stats",
    style: noIdentity ? {
      marginTop: 8
    } : null
  }, /*#__PURE__*/React.createElement("button", {
    className: "hf-stat",
    onClick: () => setBaseInfo(true),
    "aria-label": "\u0427\u0442\u043E \u0442\u0430\u043A\u043E\u0435 \u0431\u0430\u0437\u043E\u0432\u044B\u0439 \u0440\u0435\u0439\u043A\u0431\u0435\u043A"
  }, /*#__PURE__*/React.createElement("span", {
    className: "hf-stat-label"
  }, "\u0411\u0410\u0417\u041E\u0412\u042B\u0419", /*#__PURE__*/React.createElement("br", null), "\u0420\u0415\u0419\u041A\u0411\u0415\u041A"), /*#__PURE__*/React.createElement("strong", null, String(L.rbBase).replace('.', ','), "%", /*#__PURE__*/React.createElement("i", {
    className: "hf-rules"
  }, "i"))), /*#__PURE__*/React.createElement("button", {
    className: "hf-stat",
    onClick: () => setCardInfo(true),
    "aria-label": "\u0427\u0442\u043E \u0442\u0430\u043A\u043E\u0435 \u0431\u043E\u043D\u0443\u0441 \u043E\u0442 \u043A\u0430\u0440\u0442\u044B"
  }, /*#__PURE__*/React.createElement("span", {
    className: "hf-stat-label"
  }, "\u0411\u041E\u041D\u0423\u0421", /*#__PURE__*/React.createElement("br", null), "\u041A\u0410\u0420\u0422\u042B"), /*#__PURE__*/React.createElement("strong", {
    style: {
      color: '#e2bd72'
    }
  }, L.rbExtra(P.level) ? '+' + rbBonusLabel(P.level) + '%' : '—', /*#__PURE__*/React.createElement("i", {
    className: "hf-rules"
  }, "i"))), /*#__PURE__*/React.createElement("button", {
    className: "hf-stat hf-stat-link",
    onClick: onHistory,
    "aria-label": "\u0418\u0441\u0442\u043E\u0440\u0438\u044F \u0440\u0435\u0439\u043A\u0431\u0435\u043A\u0430"
  }, /*#__PURE__*/React.createElement("span", {
    className: "hf-stat-label"
  }, "\u0418\u0421\u0422\u041E\u0420\u0418\u042F", /*#__PURE__*/React.createElement("br", null), "\u0411\u041E\u041D\u0423\u0421\u041E\u0412"), /*#__PURE__*/React.createElement("strong", {
    style: {
      fontSize: 13,
      letterSpacing: ".08em",
      gap: 6
    }
  }, "\u041E\u0422\u041A\u0420\u042B\u0422\u042C", /*#__PURE__*/React.createElement("svg", {
    width: "12",
    height: "12",
    viewBox: "0 0 24 24",
    fill: "none",
    stroke: "currentColor",
    strokeWidth: "2.6",
    strokeLinecap: "round",
    strokeLinejoin: "round"
  }, /*#__PURE__*/React.createElement("path", {
    d: "M9 6l6 6-6 6"
  }))))), /*#__PURE__*/React.createElement("div", {
    className: "hf-scene",
    style: {
      position: "relative"
    }
  }, !obscured && !collection && !pay && /*#__PURE__*/React.createElement(RbHouseStages3D, {
    level: hLevel,
    lg: L.forLevel(hLevel),
    w: 402,
    h: 400,
    zoom: .9,
    rotationSpeed: .035,
    autoRotate: !collecting,
    materialTier: gold ? 4 : tier
  })), /*#__PURE__*/React.createElement("div", {
    className: "hf-content"
  }, (() => {
    const rate = P.xpRate || 100,
      xp = Math.round(P.rakeCycle * rate),
      xpMax = Math.round(P.rakeThreshold * rate),
      fmt = v => v.toLocaleString('en-US').replace(/,/g, ' ');
    const W = ringBox.w,
      H = ringBox.h,
      R = H / 2; // реальні розміри кнопки в px (ResizeObserver) — дуги лишаються круглими
    return /*#__PURE__*/React.createElement(React.Fragment, null, /*#__PURE__*/React.createElement("div", {
      className: "hf-xp"
    }, /*#__PURE__*/React.createElement("strong", null, fmt(xp)), /*#__PURE__*/React.createElement("span", null, " / ", fmt(xpMax), " XP")), /*#__PURE__*/React.createElement("div", {
      className: "hf-primary-wrap",
      "data-ready": ready,
      ref: ringRef
    }, ready && /*#__PURE__*/React.createElement("span", {
      className: "hf-glow",
      "aria-hidden": "true"
    }), W > 0 && (() => {
      const sw = 2,
        o = sw / 2,
        r = H / 2 - o,
        d = `M${W / 2} ${o} H${W - R} A${r} ${r} 0 0 1 ${W - o} ${H / 2} A${r} ${r} 0 0 1 ${W - R} ${H - o} H${R} A${r} ${r} 0 0 1 ${o} ${H / 2} A${r} ${r} 0 0 1 ${R} ${o} Z`;
      return /*#__PURE__*/React.createElement("svg", {
        className: "hf-ring",
        viewBox: `0 0 ${W} ${H}`,
        width: W,
        height: H,
        "aria-hidden": "true"
      }, /*#__PURE__*/React.createElement("path", {
        className: "hf-ring-track",
        d: d,
        pathLength: "100"
      }), /*#__PURE__*/React.createElement("path", {
        className: "hf-ring-fill",
        d: d,
        pathLength: "100",
        style: {
          strokeDasharray: `${Math.max(0, progress * 100)} 100`,
          opacity: progress > 0 ? 1 : 0
        }
      }));
    })(), /*#__PURE__*/React.createElement("button", {
      className: "hf-primary",
      "data-ready": ready,
      style: {
        ...UI.btn('l', 'primary'),
        width: '100%',
        minHeight: 52
      },
      disabled: collecting,
      onClick: collect
    }, collecting ? 'РАССЧИТЫВАЕМ…' : 'ЗАБРАТЬ РЕЙКБЕК')));
  })(), /*#__PURE__*/React.createElement("button", {
    className: "hf-collection-entry",
    onClick: () => onCollection ? onCollection() : setCollection(true),
    "aria-label": "\u041E\u0442\u043A\u0440\u044B\u0442\u044C \u043A\u043E\u043B\u043B\u0435\u043A\u0446\u0438\u044E \u043A\u0430\u0440\u0442",
    "aria-haspopup": "dialog"
  }, /*#__PURE__*/React.createElement("span", {
    className: "hf-entry-body hf-restored-progress",
    style: {
      display: 'block',
      padding: '18px 16px'
    }
  }, /*#__PURE__*/React.createElement("span", {
    className: "hf-entry-title",
    style: {
      justifyContent: 'space-between',
      marginBottom: 18
    }
  }, "\u041C\u041E\u0418 \u041A\u0410\u0420\u0422\u042B ", /*#__PURE__*/React.createElement("span", {
    className: "hf-entry-count"
  }, window.cmPlayer53.level, " / 53")), /*#__PURE__*/React.createElement("span", {
    style: {
      display: 'flex',
      alignItems: 'center',
      gap: 12
    }
  }, /*#__PURE__*/React.createElement(window.LevelCard53, {
    level: window.cmPlayer53.level,
    w: 42
  }), /*#__PURE__*/React.createElement("span", {
    style: {
      flex: 1,
      minWidth: 0
    }
  }, /*#__PURE__*/React.createElement(RbCardProgress, {
    player: window.cmPlayer53,
    league: window.cmLeague53
  })), /*#__PURE__*/React.createElement(window.LevelCard53, {
    level: Math.min(53, window.cmPlayer53.level + 1),
    w: 42
  }))), /*#__PURE__*/React.createElement("span", {
    className: "hf-entry-action"
  }, "\u041E\u0422\u041A\u0420\u042B\u0422\u042C \u041A\u041E\u041B\u041B\u0415\u041A\u0426\u0418\u042E", /*#__PURE__*/React.createElement("svg", {
    width: "16",
    height: "16",
    viewBox: "0 0 24 24",
    fill: "none",
    stroke: "currentColor",
    strokeWidth: "1.8",
    strokeLinecap: "round",
    strokeLinejoin: "round"
  }, /*#__PURE__*/React.createElement("path", {
    d: "m9 5 7 7-7 7"
  })))), /*#__PURE__*/React.createElement("label", {
    className: "career-level-control",
    "data-i18n": "off"
  }, /*#__PURE__*/React.createElement("span", null, /*#__PURE__*/React.createElement("span", null, "\u041D\u0410\u041A\u041E\u041F\u041B\u0415\u041D\u0418\u0415 \u0420\u0415\u0419\u041A\u0411\u0415\u041A\u0410"), /*#__PURE__*/React.createElement("b", null, Math.round(progress * 100), "% ", /*#__PURE__*/React.createElement("small", null, "\xB7 ", hLevel, " / 13 \u044D\u0442\u0430\u043F\u043E\u0432"))), /*#__PURE__*/React.createElement("input", {
    type: "range",
    min: "0",
    max: "100",
    step: "1",
    value: Math.round(progress * 100),
    disabled: collecting || !!pay,
    "aria-label": "\u041D\u0430\u043A\u043E\u043F\u043B\u0435\u043D\u0438\u0435 \u0440\u0435\u0439\u043A\u0431\u0435\u043A\u0430",
    style: {
      '--progress': `${progress * 100}%`
    },
    onChange: e => {
      window.rbCycle.set(P, Number(e.target.value) / 100);
      notify();
    }
  }), /*#__PURE__*/React.createElement("span", {
    className: "career-level-marks"
  }, /*#__PURE__*/React.createElement("i", null, "0%"), /*#__PURE__*/React.createElement("i", null, "25%"), /*#__PURE__*/React.createElement("i", null, "50%"), /*#__PURE__*/React.createElement("i", null, "75%"), /*#__PURE__*/React.createElement("i", null, "100%")))), collection && /*#__PURE__*/React.createElement(RbCardCollection, {
    player: P,
    onClose: () => setCollection(false),
    onSelect: n => {
      setRevealed(null);
      setSelected(n);
    }
  }), selected != null && /*#__PURE__*/React.createElement("section", {
    className: "hf-card-modal",
    role: "dialog",
    "aria-modal": "true",
    "aria-label": "\u0421\u0442\u0430\u0442\u0443\u0441 \u043A\u0430\u0440\u0442\u044B"
  }, /*#__PURE__*/React.createElement("header", {
    className: "rb-detail-header"
  }, /*#__PURE__*/React.createElement(HfBack, {
    onClick: () => {
      if (!flipping) setSelected(null);
    }
  }), /*#__PURE__*/React.createElement("h2", null, rbRankName(selected).toUpperCase()), /*#__PURE__*/React.createElement("span", null, selected, " / 13")), /*#__PURE__*/React.createElement("div", {
    className: "hf-card-detail",
    "data-revealed": revealed === selected
  }, /*#__PURE__*/React.createElement("div", {
    className: "rb-detail-stage"
  }, /*#__PURE__*/React.createElement("div", {
    className: "hf-reveal-kicker"
  }, revealed === selected ? 'НОВАЯ КАРТА' : selected > P.level ? 'ЕЩЁ НЕ ОТКРЫТА' : selected < P.level ? 'В КОЛЛЕКЦИИ' : 'ВАША КАРТА'), /*#__PURE__*/React.createElement("div", {
    className: flipping ? 'hf-flip' : 'rb-detail-art'
  }, /*#__PURE__*/React.createElement(RbFlatStatusCard, {
    level: selected,
    locked: selected > P.level,
    width: 184
  }))), /*#__PURE__*/React.createElement("div", {
    className: "rb-detail-info"
  }, /*#__PURE__*/React.createElement("span", {
    className: "rb-detail-label"
  }, revealed === selected ? 'БОНУС ПОВЫШЕН' : 'БОНУС КАРТЫ'), /*#__PURE__*/React.createElement("div", {
    className: "rb-detail-value"
  }, revealed === selected && /*#__PURE__*/React.createElement("small", null, "+", rbBonusLabel(selected - 1), "% \u2192 "), "+", rbBonusLabel(selected), "%"), /*#__PURE__*/React.createElement("p", null, "\u043A \u0431\u0430\u0437\u043E\u0432\u043E\u043C\u0443 \u0440\u0435\u0439\u043A\u0431\u0435\u043A\u0443")), /*#__PURE__*/React.createElement("div", {
    className: "rb-detail-note"
  }, selected <= P.level ? selected === P.level ? 'Этот бонус действует сейчас.' : 'Карта открыта и остаётся в вашей коллекции.' : selected === P.level + 1 ? /*#__PURE__*/React.createElement(React.Fragment, null, /*#__PURE__*/React.createElement("span", null, P.xp, " / ", P.xpNext, " XP"), /*#__PURE__*/React.createElement("div", {
    className: "hf-track"
  }, /*#__PURE__*/React.createElement("i", {
    style: {
      width: Math.min(100, P.xp / P.xpNext * 100) + '%'
    }
  })), P.xp < P.xpNext ? `Ещё ${P.xpNext - P.xp} XP до открытия` : 'Карта готова к открытию') : 'Сначала откройте предыдущую карту.')), /*#__PURE__*/React.createElement("footer", {
    className: "rb-detail-footer"
  }, /*#__PURE__*/React.createElement("button", {
    className: "hf-primary",
    disabled: flipping,
    style: {
      ...UI.btn('l', 'primary'),
      width: '100%'
    },
    onClick: () => {
      if (revealed === selected) {
        setCardReward(selected);
        setSelected(null);
      } else if (selected === P.level + 1 && P.xp >= P.xpNext) {
        unlock();
      } else setSelected(null);
    }
  }, revealed === selected ? 'ЗАБРАТЬ НАГРАДУ' : selected === P.level + 1 && P.xp >= P.xpNext ? 'ОТКРЫТЬ КАРТУ' : 'К КОЛЛЕКЦИИ'))), notReady && /*#__PURE__*/React.createElement(MeInfoSheet, {
    open: true,
    title: "\u0420\u0415\u0419\u041A\u0411\u0415\u041A \u0415\u0429\u0401 \u041D\u0415 \u0413\u041E\u0422\u041E\u0412",
    value: `${Math.ceil(Math.max(0, P.rakeThreshold - P.rakeCycle) * (P.xpRate || 100)).toLocaleString('ru-RU')} XP`,
    valueColor: "#fff",
    onClose: () => setNotReady(false)
  }, /*#__PURE__*/React.createElement("p", {
    style: {
      fontSize: 14,
      lineHeight: 1.6,
      color: '#c9cdd5',
      margin: '16px 0 22px'
    }
  }, "\u041E\u0441\u0442\u0430\u043B\u043E\u0441\u044C \u043D\u0430\u043A\u043E\u043F\u0438\u0442\u044C \u0434\u043E \u043F\u043E\u043B\u0443\u0447\u0435\u043D\u0438\u044F \u0440\u0435\u0439\u043A\u0431\u0435\u043A\u0430. \u0418\u0433\u0440\u0430\u0439\u0442\u0435 \u0437\u0430 \u0441\u0442\u043E\u043B\u0430\u043C\u0438 \u2014 \u0434\u043E\u043C\u0438\u043A \u0434\u043E\u0441\u0442\u0440\u043E\u0438\u0442\u0441\u044F, \u0438 \u043D\u0430\u0433\u0440\u0430\u0434\u0443 \u043C\u043E\u0436\u043D\u043E \u0431\u0443\u0434\u0435\u0442 \u0437\u0430\u0431\u0440\u0430\u0442\u044C.")), baseInfo && /*#__PURE__*/React.createElement(MeInfoSheet, {
    open: true,
    title: "\u0411\u0410\u0417\u041E\u0412\u042B\u0419 \u0420\u0415\u0419\u041A\u0411\u0415\u041A",
    value: String(L.rbBase).replace('.', ',') + '%',
    valueColor: "#fff",
    onClose: () => setBaseInfo(false)
  }, /*#__PURE__*/React.createElement(MeBaseRbBody, {
    accent: "#d71921"
  })), cardInfo && /*#__PURE__*/React.createElement(MeInfoSheet, {
    open: true,
    title: "\u0411\u041E\u041D\u0423\u0421 \u041E\u0422 \u041A\u0410\u0420\u0422\u042B",
    value: L.rbExtra(P.level) ? '+' + rbBonusLabel(P.level) + '%' : '—',
    valueColor: "#e2bd72",
    onClose: () => setCardInfo(false)
  }, /*#__PURE__*/React.createElement(MeCardBonusBody, {
    accent: "#d71921",
    level: P.level,
    rbBase: L.rbBase,
    rbExtra: L.rbExtra(P.level)
  })), rules && /*#__PURE__*/React.createElement(MeInfoSheet, {
    open: true,
    title: "\u041F\u0420\u0410\u0412\u0418\u041B\u0410 \u0420\u0415\u0419\u041A\u0411\u0415\u041A\u0410",
    onClose: () => setRules(false)
  }, /*#__PURE__*/React.createElement("div", {
    style: {
      fontFamily: ME_SANS,
      fontSize: 14,
      lineHeight: 1.65,
      color: '#c9cdd5'
    }
  }, /*#__PURE__*/React.createElement("p", null, /*#__PURE__*/React.createElement("b", {
    style: {
      color: '#fff'
    }
  }, "\u0414\u043E\u043C\u0438\u043A \u2014 \u0432\u0430\u0448\u0430 \u043D\u0430\u0433\u0440\u0430\u0434\u0430 \u0437\u0430 \u0438\u0433\u0440\u0443."), /*#__PURE__*/React.createElement("br", null), "\u041D\u0430\u0431\u0435\u0440\u0438\u0442\u0435 $", P.rakeThreshold, " \u0440\u0435\u0439\u043A\u0430, \u0447\u0442\u043E\u0431\u044B \u043E\u0442\u043A\u0440\u044B\u0442\u044C \u0435\u0433\u043E. \u0421\u0443\u043C\u043C\u0430 \u0440\u0430\u0441\u0441\u0447\u0438\u0442\u044B\u0432\u0430\u0435\u0442\u0441\u044F \u043F\u0440\u0438 \u043F\u043E\u043B\u0443\u0447\u0435\u043D\u0438\u0438 \u0438 \u043F\u043E\u0441\u0442\u0443\u043F\u0430\u0435\u0442 \u043D\u0430 \u043E\u0441\u043D\u043E\u0432\u043D\u043E\u0439 \u0431\u0430\u043B\u0430\u043D\u0441."), /*#__PURE__*/React.createElement("p", null, /*#__PURE__*/React.createElement("b", {
    style: {
      color: '#fff'
    }
  }, "\u041A\u0430\u0440\u0442\u044B \u2014 \u0432\u0430\u0448 \u043F\u043E\u0441\u0442\u043E\u044F\u043D\u043D\u044B\u0439 \u0441\u0442\u0430\u0442\u0443\u0441."), /*#__PURE__*/React.createElement("br", null), "\u041F\u043E\u043B\u0443\u0447\u0435\u043D\u0438\u0435 \u0440\u0435\u0439\u043A\u0431\u0435\u043A\u0430 \u043D\u0435 \u043E\u0442\u043A\u0440\u044B\u0432\u0430\u0435\u0442 \u043D\u043E\u0432\u0443\u044E \u043A\u0430\u0440\u0442\u0443. \u041F\u0440\u043E\u0433\u0440\u0435\u0441\u0441 \u043A\u043E\u043B\u043B\u0435\u043A\u0446\u0438\u0438 \u0438 \u043D\u0430\u0433\u0440\u0430\u0434\u044B \u0437\u0430 \u043A\u0430\u0440\u0442\u044B \u0443\u0447\u0438\u0442\u044B\u0432\u0430\u044E\u0442\u0441\u044F \u043E\u0442\u0434\u0435\u043B\u044C\u043D\u043E."), /*#__PURE__*/React.createElement("p", null, "\u0414\u043E\u043C\u0438\u043A \u0440\u0430\u0441\u0442\u0451\u0442 \u0432\u043C\u0435\u0441\u0442\u0435 \u0441 \u043D\u0430\u043A\u043E\u043F\u043B\u0435\u043D\u0438\u0435\u043C \u0440\u0435\u0439\u043A\u0431\u0435\u043A\u0430. \u041F\u043E\u0441\u043B\u0435 \u043F\u043E\u043B\u0443\u0447\u0435\u043D\u0438\u044F \u043D\u0430\u0447\u0438\u043D\u0430\u0435\u0442\u0441\u044F \u043D\u043E\u0432\u043E\u0435 \u0441\u0442\u0440\u043E\u0438\u0442\u0435\u043B\u044C\u0441\u0442\u0432\u043E, \u0430 \u043E\u0442\u043A\u0440\u044B\u0442\u044B\u0435 \u043A\u0430\u0440\u0442\u044B \u043E\u0441\u0442\u0430\u044E\u0442\u0441\u044F \u0432 \u043A\u043E\u043B\u043B\u0435\u043A\u0446\u0438\u0438."), /*#__PURE__*/React.createElement("p", null, "\u041D\u0430\u0433\u0440\u0430\u0434\u044B \u0437\u0430 \u043A\u0430\u0440\u0442\u044B \u0437\u0430\u0447\u0438\u0441\u043B\u044F\u044E\u0442\u0441\u044F \u043E\u0442\u0434\u0435\u043B\u044C\u043D\u043E: C$ \u2014 \u0434\u043B\u044F \u043A\u0435\u0448-\u0438\u0433\u0440, T$ \u2014 \u0434\u043B\u044F \u0442\u0443\u0440\u043D\u0438\u0440\u043E\u0432."))), cardReward != null && /*#__PURE__*/React.createElement(RbWalletReward, {
    amount: L.cardReward(cardReward, 'cash').amount,
    coinVisual: true,
    title: 'НАГРАДА ЗА КАРТУ ' + L.rankForLevel(cardReward),
    dismissLabel: "\u0413\u041E\u0422\u041E\u0412\u041E",
    onCredited: (amount, currency) => {
      RB_HIST[0].ev.unshift({
        kind: 'card',
        amount,
        currency,
        label: L.rankForLevel(cardReward)
      });
    },
    onClose: () => {
      setCardReward(null);
      setRevealed(null);
    }
  }), pay && /*#__PURE__*/React.createElement(window.RbHousePayout, {
    amount: pay.amount,
    baseAmount: pay.base,
    bonusPercent: pay.bonus,
    cardLevel: pay.level,
    onCredited: amount => {
      if (!window.rbCycle.settle(P, pay)) return;
      notify();
      RB_HIST[0].ev.unshift({
        kind: 'house',
        amount,
        currency: 'main',
        label: 'Основной баланс'
      });
    },
    onClose: () => {
      setPay(null);
      guard.current = false;
    }
  }));
}
const ME_SUM = {
  cash: {
    l: "CASH",
    c: "#21C97B",
    rows: [["HANDS", "12 480"], ["SHOWDOWN WINS", "54%"], ["BIGGEST POT", "$1 240"]]
  },
  mtt: {
    l: "TOURNEYS",
    c: "#6FA8FF",
    rows: [["PLAYED", "86"], ["ITM", "19%"], ["PRIZES", "$3 420"]]
  },
  spin: {
    l: "SPINS",
    c: "#f0c75e",
    rows: [["PLAYED", "412"], ["WINS %", "41%"], ["BEST", "×100"]],
    mult: [2, 3, 2, 5, 25, 2, 3, 100, 2, 3]
  },
  lb: {
    l: "LEADERBOARDS",
    c: "#D71921",
    rows: [["ENTERED", "14"], ["PRIZE PLACES", "5"], ["PRIZES", "$860"]]
  }
};
function HfBack({
  onClick
}) {
  return /*#__PURE__*/React.createElement("button", {
    className: "me-back",
    "aria-label": "\u041D\u0430\u0437\u0430\u0434",
    onClick: onClick
  }, /*#__PURE__*/React.createElement("svg", {
    width: "16",
    height: "16",
    viewBox: "0 0 24 24",
    fill: "none",
    stroke: "#fff",
    strokeWidth: "2.2",
    strokeLinecap: "round",
    strokeLinejoin: "round"
  }, /*#__PURE__*/React.createElement("path", {
    d: "m15 6-6 6 6 6"
  })));
}
function CardHouseScreen({
  open,
  onClose,
  onHistory
}) {
  const [cards, setCards] = React.useState(false),
    [rbFullscreen, setRbFullscreen] = React.useState(false),
    [rbOverlay, setRbOverlay] = React.useState(false),
    [cardsOverlay, setCardsOverlay] = React.useState(false);
  React.useEffect(() => {
    if (!open) {
      setCards(false);
      return;
    }
    window.dispatchEvent(new CustomEvent('px-full', {
      detail: 1
    }));
    return () => window.dispatchEvent(new CustomEvent('px-full', {
      detail: -1
    }));
  }, [open]);
  return open ? /*#__PURE__*/React.createElement("div", {
    style: {
      position: 'absolute',
      inset: 0,
      zIndex: 20,
      background: '#101115',
      paddingTop: 52
    }
  }, !cards && /*#__PURE__*/React.createElement(RbHouseFirst, {
    compact: true,
    obscured: cards,
    onCollection: () => setCards(true),
    onBack: onClose,
    onHistory: onHistory
  }), cards && /*#__PURE__*/React.createElement(RbCardCollection, {
    player: window.cmPlayer,
    onClose: () => setCards(false)
  })) : null;
}
function MeScreen({
  open,
  directProfile = false,
  onOverlay,
  onClose
}) {
  // «Профиль»: дві вкладки зверху — Карʼєра (статистика гравця) і Рейкбек (домик). Сегмент — той самий, що в налаштуваннях.
  const [tab, setTab] = React.useState('career'),
    [history, setHistory] = React.useState(false),
    [avatar, setAvatar] = React.useState('assets/avatar.png');
  const [recentHistory, setRecentHistory] = React.useState(false),
    [recentHand, setRecentHand] = React.useState(null);
  // DOT: талісман стилю гри (ТЗ 22.09) — персона/heat-стан живуть тут, щоб переживати перемикання вкладок; крапка на вкладці до першого відкриття
  const [cards, setCards] = React.useState(false),
    [rbFullscreen, setRbFullscreen] = React.useState(false),
    [rbOverlay, setRbOverlay] = React.useState(false),
    [cardsOverlay, setCardsOverlay] = React.useState(false);
  const [persona, setPersona] = React.useState(3),
    [dotOverlay, setDotOverlay] = React.useState(false),
    [replay, setReplay] = React.useState(null),
    [stats, setStats] = React.useState(null),
    [luck, setLuck] = React.useState(false),
    [full, setFull] = React.useState(false);
  React.useEffect(() => {
    onOverlay?.(history || dotOverlay || !!replay || !!stats || luck || full || cardsOverlay || rbOverlay || recentHistory || !!recentHand);
  }, [history, dotOverlay, replay, stats, luck, full, cardsOverlay, rbOverlay, recentHistory, recentHand]);
  React.useEffect(() => {
    if (open && directProfile) setTab('career');
  }, [open, directProfile]);
  if (!open) return null;
  return /*#__PURE__*/React.createElement("div", {
    className: "pd-career",
    style: {
      position: 'absolute',
      inset: 0,
      background: '#0a0a0c',
      display: 'flex',
      flexDirection: 'column'
    }
  }, /*#__PURE__*/React.createElement("div", {
    className: "me-top",
    "aria-hidden": cards || rbFullscreen,
    style: {
      display: rbFullscreen ? "none" : undefined,
      flex: 'none',
      padding: '62px 16px 0 14px'
    }
  }, /*#__PURE__*/React.createElement("button", {
    className: "me-back",
    "aria-label": "Back",
    onClick: () => {
      if (window.playClick) window.playClick(900, .04);
      onClose?.();
    }
  }, /*#__PURE__*/React.createElement("svg", {
    width: "16",
    height: "16",
    viewBox: "0 0 24 24",
    fill: "none",
    stroke: "#fff",
    strokeWidth: "2.4",
    strokeLinecap: "round",
    strokeLinejoin: "round"
  }, /*#__PURE__*/React.createElement("path", {
    d: "M15 6l-6 6 6 6"
  }))), /*#__PURE__*/React.createElement("span", {
    className: "me-title",
    "data-i18n": "off"
  }, "DOT"), /*#__PURE__*/React.createElement("span", {
    style: {
      width: 36
    }
  })), /*#__PURE__*/React.createElement("div", {
    "aria-hidden": cards || rbFullscreen,
    style: {
      display: rbFullscreen ? "none" : undefined,
      flex: 'none',
      padding: '12px 16px 0',
      position: 'relative',
      zIndex: 3
    }
  }, window.SSegment && /*#__PURE__*/React.createElement(window.SSegment, {
    options: [{
      id: 'career',
      label: 'CAREER'
    }, {
      id: 'rakeback',
      label: 'RAKEBACK'
    }],
    value: tab,
    onChange: setTab,
    accent: "#D71921"
  })), /*#__PURE__*/React.createElement("div", {
    "aria-hidden": cards,
    style: {
      flex: 1,
      minHeight: 0,
      position: 'relative'
    }
  }, tab === 'rakeback' && !cards && /*#__PURE__*/React.createElement(RbHouseFirst, {
    noIdentity: true,
    obscured: cards,
    onCollection: () => setCards(true),
    onOverlay: setRbOverlay,
    onFullscreen: setRbFullscreen,
    onHistory: () => setHistory(true)
  }), tab === 'career' && (window.DotTab ? /*#__PURE__*/React.createElement(window.DotTab, {
    personaIdx: persona,
    setPersonaIdx: setPersona,
    onOverlay: setDotOverlay,
    onLuck: () => setLuck(true),
    after: window.MeStatsWidget ? /*#__PURE__*/React.createElement(window.MeStatsWidget, {
      onOpen: id => setStats(id),
      onFull: () => setFull(true),
      onHistory: () => setRecentHistory(true),
      onHand: setRecentHand
    }) : null
  }) : /*#__PURE__*/React.createElement(PlayerProfileScreen, {
    inline: true,
    open: true,
    avatar: avatar,
    onAvatar: setAvatar,
    onClose: () => {}
  }))), cards && /*#__PURE__*/React.createElement(RbCardCollection, {
    player: window.cmPlayer,
    onClose: () => setCards(false),
    onOverlay: setCardsOverlay
  }), /*#__PURE__*/React.createElement(RewardHistoryScreen, {
    open: history,
    onClose: () => setHistory(false)
  }), recentHistory && /*#__PURE__*/React.createElement("div", {
    style: {
      position: 'absolute',
      inset: 0,
      zIndex: 85
    }
  }, /*#__PURE__*/React.createElement(window.HandHistoryScreen, {
    open: true,
    onClose: () => setRecentHistory(false),
    accent: UI.accent
  })), recentHand && /*#__PURE__*/React.createElement("div", {
    style: {
      position: 'absolute',
      inset: 0,
      zIndex: 86
    }
  }, /*#__PURE__*/React.createElement(window.HandDetailScreen, {
    open: true,
    hand: recentHand,
    index: 0,
    total: 1,
    onClose: () => setRecentHand(null),
    onReplay: () => setReplay(recentHand),
    accent: UI.accent
  })), window.MsFullStatsSheet && /*#__PURE__*/React.createElement(window.MsFullStatsSheet, {
    open: full,
    onClose: () => setFull(false)
  }), window.HeatScreen && /*#__PURE__*/React.createElement(window.HeatScreen, {
    open: luck,
    level: persona,
    onClose: () => setLuck(false)
  }), window.CareerStatsScreen && /*#__PURE__*/React.createElement(window.CareerStatsScreen, {
    open: !!stats,
    section: stats || 'cash',
    onClose: () => setStats(null)
  }), replay && window.HandReplayV2 && /*#__PURE__*/React.createElement("div", {
    style: {
      position: "absolute",
      inset: 0,
      zIndex: 100
    }
  }, /*#__PURE__*/React.createElement(window.HandReplayV2, {
    open: true,
    hand: replay,
    onClose: () => setReplay(null),
    accent: "#D71921"
  })));
}
Object.assign(window, {
  MeInfoSheet,
  meRecordHand,
  PxIdentity,
  PxProfileHero,
  MeCardIcon,
  MeScreen,
  CardHouseScreen,
  RewardHistoryScreen,
  PlayerProfileScreen,
  HouseRing,
  RbHouseStages3D,
  meHouseStage
});