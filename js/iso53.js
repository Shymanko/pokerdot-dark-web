// iso53.jsx — DEV-режим «53 карти в ізометрії»: стара структура v3 (дорога хвилями, камера від карти до карти, легендарні
// карти з історіями, нагороди-рамки). Компоненти RbIsoPath / RbCardReveal / RbKingUnlock уже є в rakeback.jsx — їм лише
// підміняємо глобальну лігу на 53-рівневу (leagues53.jsx), поки екран відкритий.
const ISO_RULER_SP = 14;
if (!document.getElementById("iso53-style")) {
  const st = document.createElement("style");
  st.id = "iso53-style";
  st.textContent = `
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
    .iso53.me-screen{isolation:isolate;overflow:hidden;animation:me-arrival-screen 260ms ease-out both}
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
    .me-screen .rb-iso-viewport{inset:0 0 0}
    .rb-iso-ruler{position:absolute;right:10px;top:36px;bottom:104px;width:74px;z-index:6;pointer-events:auto;touch-action:none;cursor:ns-resize;overflow:hidden;mask-image:linear-gradient(transparent,#000 18%,#000 82%,transparent);-webkit-mask-image:linear-gradient(transparent,#000 18%,#000 82%,transparent)}
    .rb-iso-ruler-track{position:absolute;left:0;right:0;top:0;will-change:transform}
    .rb-iso-tick{position:absolute;right:0;height:${ISO_RULER_SP}px;width:100%;display:flex;align-items:center;justify-content:flex-end;gap:6px}
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

    .iso53 .rb-iso-ruler:after,.rb-collection-3d .rb-iso-ruler:after{content:'';position:absolute;right:0;top:50%;width:34px;height:1px;margin-top:-.5px;background:linear-gradient(90deg,transparent,#ffffff55);pointer-events:none}
    .iso53-top{position:relative;z-index:5;display:flex;align-items:center;justify-content:space-between;gap:10px;padding:62px 16px 8px 14px}
    .iso53-title{font:700 15px ${ME_MONO};letter-spacing:.16em;color:#fff}
    .iso53-frames{width:36px;height:36px;border-radius:12px;background:rgba(255,255,255,.085);border:1px solid rgba(255,255,255,.18);display:flex;align-items:center;justify-content:center;padding:0;cursor:pointer}
  `;
  document.head.appendChild(st);
}
// підміна глобалів: 13-рівнева ліга ↔ 53-рівнева
(function () {
  const KEYS = ["cmLeague", "cmLegends", "cmLegendHands", "cmSpecials", "cmCollectibles", "cmPlayer", "cmRewardPicks", "LeagueFrame", "LevelCard"];
  const saved = {};
  window.__iso53 = {
    active: false,
    on() {
      if (this.active) return;
      KEYS.forEach(k => {
        saved[k] = window[k];
        window[k] = window[k + "53"];
      });
      this.active = true;
    },
    off() {
      if (!this.active) return;
      KEYS.forEach(k => {
        window[k] = saved[k];
      });
      this.active = false;
    }
  };
})();
function RbIso53Screen({
  onClose,
  onOverlay,
  accent = "#D71921"
}) {
  const [, tick] = React.useState(0);
  const [lockedLevel, setLockedLevel] = React.useState(null),
    [flipLvl, setFlipLvl] = React.useState(null),
    [unlockLevel, setUnlockLevel] = React.useState(null);
  const unlockGuard = React.useRef(false);
  const [arrival, setArrival] = React.useState("preparing");
  const entrance = React.useRef({
    start: null,
    cancelled: false
  });
  const sceneReady = React.useCallback(() => setArrival(s => s === "preparing" ? "playing" : s), []);
  const settleArrival = () => {
    entrance.current.cancelled = true;
    setArrival("settled");
  };
  React.useEffect(() => {
    if (arrival === "settled") return;
    const t = setTimeout(() => setArrival(arrival === "preparing" ? "playing" : "settled"), arrival === "preparing" ? 1100 : 1220);
    return () => clearTimeout(t);
  }, [arrival]);
  React.useEffect(() => {
    const f = () => tick(v => v + 1);
    window.addEventListener("me-refresh", f);
    return () => window.removeEventListener("me-refresh", f);
  }, []);
  React.useEffect(() => {
    window.dispatchEvent(new CustomEvent("px-full", {
      detail: 1
    }));
    return () => window.dispatchEvent(new CustomEvent("px-full", {
      detail: -1
    }));
  }, []);
  const L = window.cmLeague,
    P = window.cmPlayer || {
      level: 24,
      xp: 0,
      xpNext: 1000
    };
  const TOTAL = L.TOTAL || 53,
    lg = L.forLevel(P.level);
  const next = Math.min(TOTAL, P.level + 1),
    ready = !!P.pendingLevel && P.xp >= P.xpNext,
    left = Math.max(0, P.xpNext - P.xp);
  const overlay = flipLvl != null || unlockLevel != null || lockedLevel != null;
  const openKing = () => {
    if (unlockGuard.current || !P.pendingLevel || P.xp < P.xpNext) return;
    unlockGuard.current = true;
    setUnlockLevel(P.pendingLevel);
  };
  const earnKing = n => {
    const pl = window.cmPlayer;
    if (pl?.pendingLevel !== n) return;
    pl.level = n;
    pl.xp = Math.max(0, pl.xp - pl.xpNext);
    pl.pendingLevel = null;
    tick(v => v + 1);
  };
  const pickReward = (n, kind) => {
    const rw = L.cardReward(n, kind);
    if (window.RB_HIST_PUSH) window.RB_HIST_PUSH({
      kind: "card",
      amount: rw.amount,
      currency: rw.kind,
      label: rw.text
    });
    tick(v => v + 1);
  };
  const closeKing = () => {
    setUnlockLevel(null);
    unlockGuard.current = false;
  };
  React.useEffect(() => {
    onOverlay?.(overlay);
  }, [overlay, onOverlay]);
  return /*#__PURE__*/React.createElement("div", {
    className: "me-screen iso53",
    "data-arrival": arrival,
    "data-i18n": "off",
    onPointerDownCapture: settleArrival,
    onWheelCapture: settleArrival,
    onKeyDownCapture: settleArrival,
    style: {
      position: "absolute",
      inset: 0,
      zIndex: 82,
      background: "#101115",
      display: "flex",
      flexDirection: "column"
    }
  }, arrival !== "settled" && /*#__PURE__*/React.createElement(React.Fragment, null, /*#__PURE__*/React.createElement("div", {
    className: "me-arrival-scrim",
    "aria-hidden": "true"
  }), /*#__PURE__*/React.createElement("div", {
    className: "me-arrival-orbit",
    "aria-hidden": "true"
  }), /*#__PURE__*/React.createElement("div", {
    className: "me-arrival-atmosphere",
    "aria-hidden": "true"
  })), /*#__PURE__*/React.createElement("div", {
    style: {
      position: "absolute",
      top: 0,
      left: 0,
      right: 0,
      height: 300,
      pointerEvents: "none",
      background: `radial-gradient(ellipse 80% 70% at 50% 0%, ${lg.color}30 0%, transparent 60%)`
    }
  }), /*#__PURE__*/React.createElement("div", {
    className: "iso53-top me-identity"
  }, /*#__PURE__*/React.createElement("button", {
    className: "me-back",
    "aria-label": "\u041D\u0430\u0437\u0430\u0434",
    onClick: () => {
      if (window.playClick) window.playClick(900, .04);
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
    className: "iso53-title"
  }, "\u041C\u041E\u0418 \u041A\u0410\u0420\u0422\u042B \xB7 ", P.level, " / ", TOTAL), /*#__PURE__*/React.createElement("span", {
    "aria-hidden": "true",
    style: {
      width: 36,
      height: 36,
      flex: "none"
    }
  })), /*#__PURE__*/React.createElement("div", {
    style: {
      position: "relative",
      flex: 1,
      minHeight: 0,
      margin: "6px 0 88px"
    }
  }, /*#__PURE__*/React.createElement(window.RbIsoPath, {
    level: P.level,
    xp: P.xp,
    xpNext: P.xpNext,
    pendingLevel: P.pendingLevel,
    onUnlock: openKing,
    onFlip: setFlipLvl,
    onLocked: setLockedLevel,
    active: !overlay,
    entrance: entrance,
    onSceneReady: sceneReady
  })), window.MeInfoSheet && /*#__PURE__*/React.createElement(window.MeInfoSheet, {
    open: lockedLevel != null,
    title: "\u041A\u0410\u0420\u0422\u0410 \u0417\u0410\u0411\u041B\u041E\u041A\u0418\u0420\u041E\u0412\u0410\u041D\u0410",
    value: lockedLevel != null ? L.cardForLevel(lockedLevel) : "",
    valueColor: "#fff",
    accent: accent,
    onClose: () => setLockedLevel(null)
  }, /*#__PURE__*/React.createElement("p", {
    style: {
      fontFamily: ME_SANS,
      fontSize: 14,
      lineHeight: 1.55,
      color: UI.textMute,
      margin: "16px 0 20px"
    }
  }, "\u041A\u0430\u0440\u0442\u044B \u043E\u0442\u043A\u0440\u044B\u0432\u0430\u044E\u0442\u0441\u044F \u043F\u043E \u043F\u043E\u0440\u044F\u0434\u043A\u0443. \u0412\u0430\u0448\u0430 \u0441\u043B\u0435\u0434\u0443\u044E\u0449\u0430\u044F \u043A\u0430\u0440\u0442\u0430 \u2014 ", /*#__PURE__*/React.createElement("strong", {
    style: {
      color: "#fff",
      whiteSpace: "nowrap"
    }
  }, L.cardForLevel(next)), "."), /*#__PURE__*/React.createElement("div", {
    style: {
      display: "flex",
      alignItems: "baseline",
      justifyContent: "space-between",
      gap: 12,
      fontFamily: ME_SANS
    }
  }, /*#__PURE__*/React.createElement("span", {
    style: {
      fontSize: 13,
      color: UI.textMute
    }
  }, "\u0414\u043E \u043A\u0430\u0440\u0442\u044B ", /*#__PURE__*/React.createElement("b", {
    style: {
      color: "#fff"
    }
  }, L.cardForLevel(next))), /*#__PURE__*/React.createElement("strong", {
    style: {
      fontSize: 25,
      color: "#fff",
      fontVariantNumeric: "tabular-nums"
    }
  }, meFmt(left), " ", /*#__PURE__*/React.createElement("span", {
    style: {
      fontSize: 13
    }
  }, "XP"))), /*#__PURE__*/React.createElement("div", {
    style: {
      height: 5,
      background: "#ffffff10",
      borderRadius: 3,
      marginTop: 12,
      overflow: "hidden"
    }
  }, /*#__PURE__*/React.createElement("div", {
    style: {
      height: "100%",
      width: `${Math.min(100, Math.max(0, P.xp / Math.max(1, P.xpNext) * 100))}%`,
      background: "linear-gradient(90deg,#780b2b,#d71921)"
    }
  })), /*#__PURE__*/React.createElement("p", {
    style: {
      fontFamily: ME_SANS,
      fontSize: 13,
      lineHeight: 1.5,
      color: ready ? UI.gold : UI.textMute,
      margin: "12px 0 0"
    }
  }, ready ? `Очки уже набраны. Разблокируйте ${L.cardForLevel(next)}, чтобы продолжить путь.` : "Прогресс следующей карты накапливается отдельно от получения рейкбека.")), flipLvl != null && window.RbCardReveal && /*#__PURE__*/React.createElement(window.RbCardReveal, {
    level: flipLvl,
    onClose: () => setFlipLvl(null)
  }), unlockLevel != null && window.RbKingUnlock && /*#__PURE__*/React.createElement(window.RbKingUnlock, {
    level: unlockLevel,
    onEarned: earnKing,
    onPick: pickReward,
    onClose: closeKing
  }));
}
Object.assign(window, {
  RbIso53Screen
});