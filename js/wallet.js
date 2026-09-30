// Wallet — the dock's WALLET tab. Balance breakdown, tickets as their own
// entity, deposit into the cashier, transaction history and responsible gaming.
const MONO_WL = UI.font;
const SANS_WL = UI.fontUI;
const wMoney = n => "$" + Math.round(n).toLocaleString("en-US").split(",").join("\u00A0");
const wClick = f => {
  if (window.playClick) window.playClick(f || 1100, 0.04);
};
function WCard({
  accent,
  style,
  children,
  onClick
}) {
  return /*#__PURE__*/React.createElement("div", {
    onClick: onClick,
    style: {
      position: "relative",
      overflow: "hidden",
      borderRadius: 16,
      background: `linear-gradient(152deg, ${accent}1f 0%, #0c0c0f 62%, #0a0a0c 100%)`,
      border: `1px solid ${accent}33`,
      cursor: onClick ? "pointer" : "default",
      ...style
    }
  }, /*#__PURE__*/React.createElement("span", {
    style: {
      position: "absolute",
      inset: 0,
      pointerEvents: "none",
      background: `radial-gradient(ellipse 70% 90% at 100% 0%, ${accent}26, transparent 62%)`
    }
  }), /*#__PURE__*/React.createElement("span", {
    style: {
      position: "absolute",
      inset: 0,
      pointerEvents: "none",
      backgroundImage: "radial-gradient(circle, rgba(255,255,255,.055) .8px, transparent 1.2px)",
      backgroundSize: "13px 13px",
      maskImage: "linear-gradient(152deg, black, transparent 68%)",
      WebkitMaskImage: "linear-gradient(152deg, black, transparent 68%)"
    }
  }), children);
}
function WRow({
  icon,
  label,
  note,
  value,
  accent,
  onClick,
  tone
}) {
  return /*#__PURE__*/React.createElement("button", {
    onClick: () => {
      wClick(1100);
      onClick && onClick();
    },
    style: {
      width: "100%",
      display: "flex",
      alignItems: "center",
      gap: 12,
      padding: "13px 14px",
      background: "transparent",
      border: 0,
      borderTop: "1px solid rgba(255,255,255,.075)",
      cursor: "pointer",
      textAlign: "left"
    }
  }, /*#__PURE__*/React.createElement("span", {
    style: {
      flex: "none",
      width: 34,
      height: 34,
      borderRadius: 12,
      background: tone ? `${tone}1f` : "rgba(255,255,255,.07)",
      border: `1px solid ${tone ? tone + "4d" : "rgba(255,255,255,.14)"}`,
      display: "flex",
      alignItems: "center",
      justifyContent: "center"
    }
  }, icon), /*#__PURE__*/React.createElement("span", {
    style: {
      flex: 1,
      minWidth: 0
    }
  }, /*#__PURE__*/React.createElement("span", {
    style: {
      display: "block",
      fontFamily: MONO_WL,
      fontSize: 14,
      letterSpacing: ".03em",
      color: tone || "#fff"
    }
  }, label), note ? /*#__PURE__*/React.createElement("span", {
    style: {
      display: "block",
      marginTop: 3,
      fontFamily: SANS_WL,
      fontWeight: 600,
      fontSize: 11,
      letterSpacing: ".03em",
      color: "#A9A9B2"
    }
  }, note) : null), value ? /*#__PURE__*/React.createElement("span", {
    style: {
      flex: "none",
      fontFamily: MONO_WL,
      fontWeight: 700,
      fontSize: 12,
      color: "#D8D8DF",
      fontVariantNumeric: "tabular-nums"
    }
  }, value) : null, /*#__PURE__*/React.createElement("svg", {
    width: "15",
    height: "15",
    viewBox: "0 0 24 24",
    fill: "none",
    stroke: "rgba(255,255,255,.32)",
    strokeWidth: "2.4",
    strokeLinecap: "round",
    strokeLinejoin: "round",
    style: {
      flex: "none"
    }
  }, /*#__PURE__*/React.createElement("path", {
    d: "M9 6l6 6-6 6"
  })));
}

// 6.1–6.3 — total on top, the three sub-balances under it, tickets on their own
function WalletScreen({
  open,
  onClose,
  accent = "#D71921",
  nested = false,
  topInset = 0,
  usd = 2500000,
  cash = 89230,
  tourney = 412000,
  tickets = 4,
  onCashier,
  onWithdraw,
  onTickets
}) {
  const [mounted, setMounted] = React.useState(false);
  const [txOpen, setTxOpen] = React.useState(false);
  const [rgOpen, setRgOpen] = React.useState(false);
  React.useEffect(() => {
    if (!open) {
      setMounted(false);
      setTxOpen(false);
      setRgOpen(false);
      return;
    }
    const r = requestAnimationFrame(() => setMounted(true));
    return () => cancelAnimationFrame(r);
  }, [open]);
  if (!open) return null;
  const total = usd + cash + tourney;
  const grp = n => Math.floor(Math.round(n * 100) / 100).toLocaleString("en-US").split(",").join("\u00A0");
  const sub = [{
    id: "usd",
    c: "#5BD96A",
    label: "USD ($)",
    v: usd
  }, {
    id: "cash",
    c: accent,
    label: "CASH$ (C$)",
    v: cash,
    locked: true
  }, {
    id: "tourney",
    c: "#f0c75e",
    label: "TOURNEY$ (T$)",
    v: tourney,
    locked: true
  }];
  return /*#__PURE__*/React.createElement("div", {
    style: {
      position: "absolute",
      inset: 0,
      zIndex: 36,
      background: "#000",
      display: "flex",
      flexDirection: "column",
      transform: nested ? "none" : mounted ? "translateY(0)" : "translateY(100%)",
      transition: "transform 360ms cubic-bezier(0.2,0.8,0.2,1)"
    }
  }, /*#__PURE__*/React.createElement("div", {
    style: {
      position: "absolute",
      top: 0,
      left: 0,
      right: 0,
      height: 300,
      pointerEvents: "none",
      background: `radial-gradient(ellipse 84% 70% at 50% 0%, ${accent}2b 0%, transparent 62%)`
    }
  }), /*#__PURE__*/React.createElement("div", {
    className: "pd-screen-header",
    style: {
      position: "relative",
      zIndex: 5,
      paddingTop: nested ? topInset + 14 : 62,
      paddingLeft: 14,
      paddingRight: 16,
      paddingBottom: 8,
      display: "flex",
      alignItems: "center",
      gap: 10
    }
  }, /*#__PURE__*/React.createElement("button", {
    onClick: () => {
      wClick(900);
      onClose && onClose();
    },
    "aria-label": "Back",
    style: {
      flex: "none",
      width: 36,
      height: 36,
      borderRadius: 12,
      background: "rgba(255,255,255,.085)",
      border: "1px solid rgba(255,255,255,.18)",
      display: "flex",
      alignItems: "center",
      justifyContent: "center",
      cursor: "pointer",
      padding: 0
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
    style: {
      flex: 1,
      textAlign: "center",
      marginRight: 36,
      fontFamily: MONO_WL,
      fontWeight: 700,
      fontSize: 15,
      letterSpacing: ".16em",
      color: "#fff"
    }
  }, "WALLET")), /*#__PURE__*/React.createElement("div", {
    style: {
      position: "relative",
      zIndex: 2,
      flex: 1,
      minHeight: 0,
      overflowY: "auto",
      WebkitOverflowScrolling: "touch",
      paddingBottom: 120
    }
  }, /*#__PURE__*/React.createElement(WCard, {
    accent: accent,
    style: {
      margin: "14px 16px 0",
      padding: 16,
      boxShadow: "0 12px 30px rgba(0,0,0,.5)"
    }
  }, /*#__PURE__*/React.createElement("div", {
    style: {
      position: "relative",
      display: "flex",
      alignItems: "center",
      justifyContent: "space-between"
    }
  }, /*#__PURE__*/React.createElement("div", {
    style: {
      fontFamily: SANS_WL,
      fontWeight: 700,
      fontSize: 10.5,
      letterSpacing: ".2em",
      color: "#A9A9B2"
    }
  }, "BALANCES"), /*#__PURE__*/React.createElement("button", {
    "aria-label": "About balances",
    onClick: () => {
      wClick(1100);
      if (window.showScreenInfo) window.showScreenInfo({
        title: "BALANCES",
        kicker: "HOW BALANCES WORK",
        accent,
        body: "USD ($) is your withdrawable money — deposits and payouts. Cash$ (C$) only sits at cash tables, Tourney$ (T$) only buys into tournaments. Neither can be withdrawn: both turn into withdrawable USD as cashback while you play."
      });
    },
    style: {
      width: 22,
      height: 22,
      borderRadius: "50%",
      flex: "none",
      background: "rgba(0,0,0,.34)",
      border: "1px solid rgba(255,255,255,.16)",
      display: "flex",
      alignItems: "center",
      justifyContent: "center",
      cursor: "pointer",
      padding: 0
    }
  }, /*#__PURE__*/React.createElement("svg", {
    width: "12",
    height: "12",
    viewBox: "0 0 24 24",
    fill: "none",
    stroke: "rgba(255,255,255,.8)",
    strokeWidth: "2.4",
    strokeLinecap: "round",
    strokeLinejoin: "round"
  }, /*#__PURE__*/React.createElement("circle", {
    cx: "12",
    cy: "12",
    r: "10"
  }), /*#__PURE__*/React.createElement("path", {
    d: "M12 16v-4M12 8h.01"
  })))), /*#__PURE__*/React.createElement("div", {
    style: {
      position: "relative",
      display: "flex",
      flexDirection: "column",
      gap: 8,
      marginTop: 14
    }
  }, sub.map(r => /*#__PURE__*/React.createElement("div", {
    key: r.id,
    style: {
      display: "flex",
      alignItems: "center",
      gap: 11,
      padding: "12px 13px",
      borderRadius: 12,
      background: "rgba(0,0,0,.34)",
      border: "1px solid rgba(255,255,255,.14)"
    }
  }, /*#__PURE__*/React.createElement("span", {
    style: {
      width: 7,
      height: 7,
      borderRadius: "50%",
      background: r.c,
      flex: "none"
    }
  }), /*#__PURE__*/React.createElement("div", {
    style: {
      flex: 1,
      minWidth: 0,
      display: "flex",
      alignItems: "center",
      gap: 7
    }
  }, /*#__PURE__*/React.createElement("span", {
    style: {
      fontFamily: SANS_WL,
      fontWeight: 700,
      fontSize: 10.5,
      letterSpacing: ".06em",
      color: r.c
    }
  }, r.label), r.locked && /*#__PURE__*/React.createElement("span", {
    style: {
      fontFamily: SANS_WL,
      fontWeight: 700,
      fontSize: 10.5,
      letterSpacing: ".04em",
      color: "#A9A9B2",
      background: "rgba(255,255,255,.08)",
      border: "1px solid rgba(255,255,255,.16)",
      padding: "2px 7px",
      borderRadius: 5,
      whiteSpace: "nowrap"
    }
  }, "NO WITHDRAW"), window.InfoDot ? /*#__PURE__*/React.createElement(window.InfoDot, {
    title: r.id === "usd" ? "USD BALANCE" : r.id === "cash" ? "CASH$ BALANCE" : "TOURNEY$ BALANCE",
    size: 15,
    accent: accent
  }) : null), /*#__PURE__*/React.createElement("div", {
    style: {
      fontFamily: MONO_WL,
      fontWeight: 700,
      fontSize: 17,
      color: "#fff",
      fontVariantNumeric: "tabular-nums",
      letterSpacing: "-.01em",
      whiteSpace: "nowrap"
    }
  }, grp(r.v), /*#__PURE__*/React.createElement("span", {
    style: {
      fontSize: 11,
      color: "#8A8A93"
    }
  }, ".", String(Math.round(r.v * 100) % 100).padStart(2, "0")))))), /*#__PURE__*/React.createElement("div", {
    style: {
      position: "relative",
      marginTop: 12,
      fontFamily: SANS_WL,
      fontWeight: 600,
      fontSize: 11,
      color: "#D8D8DF",
      letterSpacing: ".02em",
      lineHeight: 1.55
    }
  }, "Cash$ sits at cash tables; Tourney$ buys into tournaments. Neither can be withdrawn \u2014 both convert to cashback as you play."), /*#__PURE__*/React.createElement("div", {
    style: {
      position: "relative",
      marginTop: 14,
      display: "grid",
      gridTemplateColumns: "1fr 1fr",
      gap: 9
    }
  }, /*#__PURE__*/React.createElement("button", {
    onClick: () => {
      wClick(1350);
      onCashier && onCashier();
    },
    style: {
      height: 46,
      borderRadius: 12,
      cursor: "pointer",
      border: 0,
      background: accent,
      color: "#fff",
      boxShadow: `0 10px 24px ${accent}4d`,
      display: "flex",
      alignItems: "center",
      justifyContent: "center",
      gap: 8,
      fontFamily: MONO_WL,
      fontWeight: 700,
      fontSize: 13,
      letterSpacing: ".1em"
    }
  }, "DEPOSIT"), /*#__PURE__*/React.createElement("button", {
    onClick: () => {
      wClick(1250);
      (onWithdraw || onCashier) && (onWithdraw || onCashier)();
    },
    style: {
      height: 46,
      borderRadius: 12,
      cursor: "pointer",
      background: "rgba(255,255,255,.07)",
      color: "#fff",
      border: "1px solid rgba(255,255,255,.22)",
      display: "flex",
      alignItems: "center",
      justifyContent: "center",
      gap: 8,
      fontFamily: MONO_WL,
      fontWeight: 700,
      fontSize: 13,
      letterSpacing: ".1em"
    }
  }, "WITHDRAW"))), /*#__PURE__*/React.createElement(WCard, {
    accent: accent,
    style: {
      margin: "10px 16px 0",
      padding: "13px 14px"
    },
    onClick: () => {
      wClick(1200);
      onTickets && onTickets();
    }
  }, /*#__PURE__*/React.createElement("div", {
    style: {
      position: "relative",
      display: "flex",
      alignItems: "center",
      gap: 12
    }
  }, /*#__PURE__*/React.createElement("span", {
    style: {
      flex: "none",
      width: 38,
      height: 38,
      borderRadius: 12,
      background: `${accent}1f`,
      border: `1px solid ${accent}4d`,
      display: "flex",
      alignItems: "center",
      justifyContent: "center"
    }
  }, /*#__PURE__*/React.createElement("svg", {
    width: "19",
    height: "19",
    viewBox: "0 0 24 24",
    fill: "none",
    stroke: accent,
    strokeWidth: "1.9",
    strokeLinejoin: "round"
  }, /*#__PURE__*/React.createElement("path", {
    d: "M3 8.5A2 2 0 015 6.5h14a2 2 0 012 2v1.2a2.3 2.3 0 000 4.6v1.2a2 2 0 01-2 2H5a2 2 0 01-2-2v-1.2a2.3 2.3 0 000-4.6z"
  }), /*#__PURE__*/React.createElement("path", {
    d: "M14 7v10",
    strokeDasharray: "2 2.4"
  }))), /*#__PURE__*/React.createElement("span", {
    style: {
      flex: 1,
      minWidth: 0
    }
  }, /*#__PURE__*/React.createElement("span", {
    style: {
      display: "block",
      fontFamily: MONO_WL,
      fontSize: 14,
      letterSpacing: ".03em",
      color: "#fff"
    }
  }, "TICKETS"), /*#__PURE__*/React.createElement("span", {
    style: {
      display: "block",
      marginTop: 3,
      fontFamily: SANS_WL,
      fontWeight: 600,
      fontSize: 11,
      letterSpacing: ".03em",
      color: "#A9A9B2"
    }
  }, "Tournament entries you hold")), /*#__PURE__*/React.createElement("span", {
    style: {
      flex: "none",
      minWidth: 26,
      height: 26,
      padding: "0 8px",
      borderRadius: 8,
      background: accent,
      color: "#fff",
      display: "flex",
      alignItems: "center",
      justifyContent: "center",
      fontFamily: MONO_WL,
      fontWeight: 700,
      fontSize: 13
    }
  }, tickets))), /*#__PURE__*/React.createElement("div", {
    style: {
      margin: "14px 16px 0",
      borderRadius: 16,
      overflow: "hidden",
      background: "linear-gradient(150deg,#141419 0%,#0c0c0f 62%,#0a0a0c 100%)",
      border: "1px solid rgba(255,255,255,.1)"
    }
  }, /*#__PURE__*/React.createElement(WRow, {
    accent: accent,
    onClick: () => setTxOpen(true),
    label: "TRANSACTION HISTORY",
    note: "Deposits, withdrawals, transfers",
    icon: /*#__PURE__*/React.createElement("svg", {
      width: "16",
      height: "16",
      viewBox: "0 0 24 24",
      fill: "none",
      stroke: "#fff",
      strokeWidth: "2",
      strokeLinecap: "round",
      strokeLinejoin: "round"
    }, /*#__PURE__*/React.createElement("path", {
      d: "M3 12a9 9 0 1 0 3-6.7L3 8"
    }), /*#__PURE__*/React.createElement("path", {
      d: "M3 4v4h4"
    }), /*#__PURE__*/React.createElement("path", {
      d: "M12 8v4l3 2"
    }))
  }), /*#__PURE__*/React.createElement(WRow, {
    accent: accent,
    onClick: () => setRgOpen(true),
    label: "RESPONSIBLE GAMING",
    note: "Take a break \xB7 freeze up to 24 hours",
    icon: /*#__PURE__*/React.createElement("svg", {
      width: "16",
      height: "16",
      viewBox: "0 0 24 24",
      fill: "none",
      stroke: "#fff",
      strokeWidth: "2",
      strokeLinecap: "round",
      strokeLinejoin: "round"
    }, /*#__PURE__*/React.createElement("path", {
      d: "M12 3l7.5 3v5.4c0 4.5-3 8.2-7.5 9.6-4.5-1.4-7.5-5.1-7.5-9.6V6z"
    }), /*#__PURE__*/React.createElement("path", {
      d: "M12 9.2v3.4"
    }), /*#__PURE__*/React.createElement("path", {
      d: "M12 15.6h.01"
    }))
  }))), window.TransactionHistory && /*#__PURE__*/React.createElement(window.TransactionHistory, {
    open: txOpen,
    onClose: () => setTxOpen(false),
    accent: accent
  }), /*#__PURE__*/React.createElement(ResponsibleGaming, {
    open: rgOpen,
    onClose: () => setRgOpen(false),
    accent: accent
  }));
}

// ── 6.4 · Responsible gaming: tools, tips, FAQ ───────────────────────────
const RG_TIPS = [{
  id: "bankroll",
  t: "BANKROLL MANAGEMENT",
  d: "Managing your bankroll well is what keeps you in the game long term."
}, {
  id: "choice",
  t: "GAME SELECTION",
  d: "Pick the stakes and formats your bankroll can actually carry."
}, {
  id: "review",
  t: "REVIEW YOUR PLAY",
  d: "Go through hands from your history and learn from the spots you lost."
}, {
  id: "care",
  t: "PLAY RESPONSIBLY",
  d: "Keep a healthy relationship with the game — at the tables and away from them."
}];
const RG_FAQ = [{
  q: "What is a game limit?",
  a: "A game limit lets you take a break of up to 24 hours from real-money play. You can still sign in, deposit and withdraw during that time."
}, {
  q: "I turned the limit on by mistake. How do I cancel it?",
  a: "Contact support at support@pokerdot.com and the team will walk you through what happens next."
}, {
  q: "Why play responsibly?",
  a: "Playing deliberately keeps you in control and keeps real-money games enjoyable over the long run. Taking breaks when you need them leads to better decisions."
}, {
  q: "Still have questions?",
  a: "Our support team is always around. Write to support@pokerdot.com."
}];
function RgIcon({
  kind,
  size = 26,
  accent
}) {
  const c = accent;
  const p = {
    fill: "none",
    stroke: c,
    strokeWidth: 1.8,
    strokeLinecap: "round",
    strokeLinejoin: "round"
  };
  const g = {
    bankroll: /*#__PURE__*/React.createElement("g", p, /*#__PURE__*/React.createElement("path", {
      d: "M20 8H5a2 2 0 0 1 0-4h13v4M4 6v12a2 2 0 0 0 2 2h14V8"
    }), /*#__PURE__*/React.createElement("path", {
      d: "M20 12h-5a2 2 0 0 0 0 4h5"
    }), /*#__PURE__*/React.createElement("path", {
      d: "M15.5 14h.01"
    })),
    choice: /*#__PURE__*/React.createElement("g", p, /*#__PURE__*/React.createElement("circle", {
      cx: "6.6",
      cy: "9",
      r: "2.6"
    }), /*#__PURE__*/React.createElement("circle", {
      cx: "12",
      cy: "9",
      r: "2.6"
    }), /*#__PURE__*/React.createElement("circle", {
      cx: "17.4",
      cy: "9",
      r: "2.6"
    }), /*#__PURE__*/React.createElement("path", {
      d: "M8.4 15.6h7.2M11 19.2h5.2"
    })),
    review: /*#__PURE__*/React.createElement("g", p, /*#__PURE__*/React.createElement("circle", {
      cx: "10.6",
      cy: "10.6",
      r: "5.4"
    }), /*#__PURE__*/React.createElement("path", {
      d: "M14.6 14.6L20 20"
    }), /*#__PURE__*/React.createElement("path", {
      d: "M8.6 10.6h4"
    })),
    care: /*#__PURE__*/React.createElement("g", p, /*#__PURE__*/React.createElement("path", {
      d: "M4 14.2c1.6-1.8 3.4-1.4 4.8-.4l2 1.4h3.4a1.4 1.4 0 010 2.8H10"
    }), /*#__PURE__*/React.createElement("path", {
      d: "M20 13.4c-1.4-1.2-3-.9-4.2.2"
    }), /*#__PURE__*/React.createElement("circle", {
      cx: "12",
      cy: "7.4",
      r: "2.8"
    }))
  };
  return /*#__PURE__*/React.createElement("svg", {
    width: size,
    height: size,
    viewBox: "0 0 24 24"
  }, g[kind] || g.care);
}
function ResponsibleShield3D() {
  const canvas = React.useRef(null);
  const [ready, setReady] = React.useState(false);
  React.useEffect(() => {
    let stopped = false,
      raf,
      renderer,
      observer,
      model;
    const T = window.THREE,
      cv = canvas.current;
    try {
      renderer = new T.WebGLRenderer({
        canvas: cv,
        alpha: true,
        antialias: true
      });
      renderer.setPixelRatio(Math.min(window.devicePixelRatio || 1, 2));
      renderer.setClearColor(0, 0);
      renderer.outputColorSpace = T.SRGBColorSpace;
      renderer.toneMapping = T.ACESFilmicToneMapping;
      renderer.toneMappingExposure = 1.15;
      const scene = new T.Scene();
      scene.environment = CH.envFor(renderer);
      const camera = new T.PerspectiveCamera(34, 1, .1, 20);
      camera.position.set(0, 0, 4.5);
      const key = new T.DirectionalLight(0xffffff, 2.3);
      key.position.set(-3, 4, 5);
      scene.add(key);
      const rim = new T.DirectionalLight(0xdce6ff, 2);
      rim.position.set(3, 2, -1);
      scene.add(rim);
      scene.add(new T.HemisphereLight(0xffffff, 0x20212a, .6));
      const resize = () => {
        const r = cv.getBoundingClientRect();
        renderer.setSize(Math.max(1, r.width), Math.max(1, r.height), false);
        camera.aspect = r.width / Math.max(1, r.height);
        camera.updateProjectionMatrix();
      };
      observer = new ResizeObserver(resize);
      observer.observe(cv);
      resize();
      const reduced = matchMedia('(prefers-reduced-motion: reduce)').matches;
      dtLoadModel('dot-shield').then(gltf => {
        if (stopped) return;
        model = gltf.scene.clone(true);
        model.traverse(o => {
          if (o.isMesh) {
            o.material = o.material.clone();
            o.material.envMapIntensity = 1.15;
          }
        });
        scene.add(model);
        const draw = t => {
          if (stopped) return;
          model.rotation.set(.06, reduced ? -.25 : -.25 + Math.sin(t / 3500) * .18, -.04);
          model.position.y = reduced ? 0 : Math.sin(t / 2300) * .035;
          if (!document.hidden) renderer.render(scene, camera);
          raf = requestAnimationFrame(draw);
        };
        draw(performance.now());
        setReady(true);
      }).catch(() => {});
    } catch (_) {/* The Blender render remains available without WebGL. */}
    return () => {
      stopped = true;
      cancelAnimationFrame(raf);
      observer?.disconnect();
      model?.traverse(o => {
        if (o.isMesh) o.material.dispose();
      });
      if (renderer) {
        CH.envs.get(renderer)?.dispose();
        CH.envs.delete(renderer);
        renderer.dispose();
        renderer.forceContextLoss();
      }
    };
  }, []);
  return /*#__PURE__*/React.createElement("div", {
    className: "ps-rg-shield",
    "data-ready": ready
  }, /*#__PURE__*/React.createElement("img", {
    src: "assets/talismans3d/dot-shield.png?v=112",
    alt: ""
  }), /*#__PURE__*/React.createElement("canvas", {
    ref: canvas,
    role: "img",
    "aria-label": "3D \u0449\u0438\u0442 PokerDot"
  }));
}
function ResponsibleGaming({
  open,
  onClose,
  accent = "#D71921"
}) {
  // повноекранний під-екран — ховаємо верхню смугу активних столів,
  // інакше вона малюється поверх власної шапки екрана
  React.useEffect(() => {
    if (!open) return;
    window.dispatchEvent(new CustomEvent("px-full", {
      detail: 1
    }));
    return () => window.dispatchEvent(new CustomEvent("px-full", {
      detail: -1
    }));
  }, [open]);
  const [mounted, setMounted] = React.useState(false);
  const [faq, setFaq] = React.useState(null);
  const [limitOpen, setLimitOpen] = React.useState(false);
  React.useEffect(() => {
    if (!open) {
      setMounted(false);
      setFaq(null);
      setLimitOpen(false);
      return;
    }
    const r = requestAnimationFrame(() => setMounted(true));
    return () => cancelAnimationFrame(r);
  }, [open]);
  if (!open) return null;
  return /*#__PURE__*/React.createElement("div", {
    className: "ps-detail ps-responsible",
    style: {
      position: "absolute",
      inset: 0,
      zIndex: 70,
      background: "#08080a",
      display: "flex",
      flexDirection: "column",
      transform: mounted ? "translateX(0)" : "translateX(100%)",
      transition: "transform 320ms cubic-bezier(0.2,0.8,0.2,1)"
    }
  }, /*#__PURE__*/React.createElement("div", {
    className: "pd-screen-header",
    style: {
      position: "relative",
      zIndex: 5,
      paddingTop: 62,
      paddingLeft: 14,
      paddingRight: 14,
      paddingBottom: 6,
      display: "flex",
      alignItems: "center",
      gap: 10
    }
  }, /*#__PURE__*/React.createElement("button", {
    onClick: () => {
      wClick(900);
      onClose();
    },
    "aria-label": "Back",
    style: {
      width: 36,
      height: 36,
      borderRadius: 12,
      background: "rgba(255,255,255,.085)",
      border: "1px solid rgba(255,255,255,.18)",
      display: "flex",
      alignItems: "center",
      justifyContent: "center",
      cursor: "pointer",
      padding: 0
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
    style: {
      flex: 1,
      textAlign: "center",
      marginRight: 36,
      fontFamily: MONO_WL,
      fontSize: 15,
      letterSpacing: ".16em",
      color: "#fff"
    }
  }, "RESPONSIBLE GAMING")), /*#__PURE__*/React.createElement("div", {
    className: "ps-content ps-rg-content"
  }, /*#__PURE__*/React.createElement("section", {
    className: "ps-rg-intro"
  }, /*#__PURE__*/React.createElement(ResponsibleShield3D, null), /*#__PURE__*/React.createElement("h2", null, "RESPONSIBLE GAMING"), /*#__PURE__*/React.createElement("p", null, "Keep your game in balance \u2014 set your own limits and take breaks when you need them.")), /*#__PURE__*/React.createElement("h3", {
    className: "ps-section-label"
  }, "TOOLS"), /*#__PURE__*/React.createElement("button", {
    className: "ps-rg-break",
    onClick: () => {
      wClick(1200);
      setLimitOpen(true);
    }
  }, /*#__PURE__*/React.createElement("span", {
    className: "ps-icon"
  }, /*#__PURE__*/React.createElement("svg", {
    width: "23",
    height: "23",
    viewBox: "0 0 24 24",
    fill: "none",
    stroke: "currentColor",
    strokeWidth: "1.7"
  }, /*#__PURE__*/React.createElement("circle", {
    cx: "12",
    cy: "12",
    r: "9"
  }), /*#__PURE__*/React.createElement("path", {
    d: "M12 7v5l3 2"
  }))), /*#__PURE__*/React.createElement("span", {
    className: "ps-row-copy"
  }, /*#__PURE__*/React.createElement("strong", null, "GAME LIMIT"), /*#__PURE__*/React.createElement("small", null, "Take a break from real-money play")), /*#__PURE__*/React.createElement("svg", {
    width: "16",
    height: "16",
    viewBox: "0 0 24 24",
    fill: "none",
    stroke: "currentColor",
    strokeWidth: "1.6"
  }, /*#__PURE__*/React.createElement("path", {
    d: "m9 5 7 7-7 7"
  }))), /*#__PURE__*/React.createElement("h3", {
    className: "ps-section-label"
  }, "TIPS"), /*#__PURE__*/React.createElement("section", {
    className: "ps-rg-tips"
  }, RG_TIPS.map(t => /*#__PURE__*/React.createElement("div", {
    className: "ps-rg-tip",
    key: t.id
  }, /*#__PURE__*/React.createElement(RgIcon, {
    kind: t.id,
    size: 23,
    accent: "#a7b3c4"
  }), /*#__PURE__*/React.createElement("div", null, /*#__PURE__*/React.createElement("h3", null, t.t), /*#__PURE__*/React.createElement("p", null, t.d))))), /*#__PURE__*/React.createElement("h3", {
    className: "ps-section-label"
  }, "FAQ"), /*#__PURE__*/React.createElement("section", {
    className: "ps-rg-faq"
  }, RG_FAQ.map((f, i) => /*#__PURE__*/React.createElement("div", {
    key: f.q
  }, /*#__PURE__*/React.createElement("button", {
    "aria-expanded": faq === i,
    onClick: () => {
      wClick(faq === i ? 900 : 1200);
      setFaq(faq === i ? null : i);
    }
  }, /*#__PURE__*/React.createElement("span", null, f.q), /*#__PURE__*/React.createElement("svg", {
    width: "16",
    height: "16",
    viewBox: "0 0 24 24",
    fill: "none",
    stroke: "currentColor",
    strokeWidth: "1.6",
    style: {
      transform: faq === i ? 'rotate(180deg)' : undefined
    }
  }, /*#__PURE__*/React.createElement("path", {
    d: "m6 9 6 6 6-6"
  }))), faq === i && /*#__PURE__*/React.createElement("p", null, f.a)))), /*#__PURE__*/React.createElement("div", {
    className: "ps-rg-protected"
  }, /*#__PURE__*/React.createElement("span", null, "Protected by"), /*#__PURE__*/React.createElement("img", {
    src: "assets/logo-pokerdot.svg",
    alt: "PokerDot"
  }))), /*#__PURE__*/React.createElement(GameLimit, {
    open: limitOpen,
    onClose: () => setLimitOpen(false),
    accent: accent
  }));
}

// ── the freeze itself: up to 24 hours ────────────────────────────────────
const GL_SPANS = ["1 HOUR", "6 HOURS", "12 HOURS", "24 HOURS"];
function GameLimit({
  open,
  onClose,
  accent = "#D71921"
}) {
  const [mounted, setMounted] = React.useState(false);
  const [span, setSpan] = React.useState("24 HOURS");
  const [pick, setPick] = React.useState(false);
  const [done, setDone] = React.useState(false);
  const trigger = React.useRef(null);
  React.useEffect(() => {
    if (!open) {
      setMounted(false);
      setPick(false);
      setDone(false);
      setSpan("24 HOURS");
      return;
    }
    const r = requestAnimationFrame(() => setMounted(true));
    return () => cancelAnimationFrame(r);
  }, [open]);
  const choose = value => {
    wClick(1100);
    setSpan(value);
    setPick(false);
    trigger.current?.focus();
  };
  if (!open) return null;
  return /*#__PURE__*/React.createElement("div", {
    className: "ps-detail ps-game-limit",
    style: {
      position: "absolute",
      inset: 0,
      zIndex: 80,
      display: "flex",
      flexDirection: "column",
      transform: mounted ? "translateX(0)" : "translateX(100%)",
      transition: "transform 320ms cubic-bezier(.2,.8,.2,1)"
    },
    onKeyDown: e => {
      if (e.key === 'Escape' && pick) {
        e.stopPropagation();
        setPick(false);
        trigger.current?.focus();
      }
    }
  }, /*#__PURE__*/React.createElement("div", {
    className: "pd-screen-header",
    style: {
      position: "relative",
      zIndex: 5,
      display: "flex",
      alignItems: "center"
    }
  }, /*#__PURE__*/React.createElement("button", {
    className: "ps-limit-back",
    onClick: () => {
      wClick(900);
      onClose();
    },
    "aria-label": "\u041D\u0430\u0437\u0430\u0434 \u043A \u043E\u0442\u0432\u0435\u0442\u0441\u0442\u0432\u0435\u043D\u043D\u043E\u0439 \u0438\u0433\u0440\u0435"
  }, /*#__PURE__*/React.createElement("svg", {
    width: "16",
    height: "16",
    viewBox: "0 0 24 24",
    fill: "none",
    stroke: "currentColor",
    strokeWidth: "2"
  }, /*#__PURE__*/React.createElement("path", {
    d: "m15 6-6 6 6 6"
  }))), /*#__PURE__*/React.createElement("span", {
    style: {
      flex: 1,
      textAlign: "center",
      marginRight: 36
    }
  }, "GAME LIMIT")), /*#__PURE__*/React.createElement("div", {
    className: "ps-content ps-limit-content"
  }, done ? /*#__PURE__*/React.createElement("section", {
    className: "ps-limit-result"
  }, /*#__PURE__*/React.createElement("svg", {
    width: "44",
    height: "44",
    viewBox: "0 0 24 24",
    fill: "none",
    stroke: "currentColor",
    strokeWidth: "1.5"
  }, /*#__PURE__*/React.createElement("circle", {
    cx: "12",
    cy: "12",
    r: "9"
  }), /*#__PURE__*/React.createElement("path", {
    d: "M12 7v5l3 2"
  })), /*#__PURE__*/React.createElement("h2", null, "BREAK STARTED"), /*#__PURE__*/React.createElement("p", null, "Real-money play is paused for:"), /*#__PURE__*/React.createElement("strong", null, span), /*#__PURE__*/React.createElement("p", null, "Deposits, withdrawals and play-money tables stay open.")) : /*#__PURE__*/React.createElement(React.Fragment, null, pick && /*#__PURE__*/React.createElement("div", {
    className: "ps-limit-dismiss",
    "aria-hidden": "true",
    onClick: () => setPick(false)
  }), /*#__PURE__*/React.createElement("div", {
    className: "ps-limit-picker"
  }, /*#__PURE__*/React.createElement("label", {
    id: "ps-limit-duration"
  }, "Break duration"), /*#__PURE__*/React.createElement("button", {
    ref: trigger,
    className: "ps-limit-select",
    "aria-labelledby": "ps-limit-duration ps-limit-value",
    "aria-haspopup": "listbox",
    "aria-expanded": pick,
    "aria-controls": "ps-limit-options",
    onClick: () => {
      wClick(1150);
      setPick(!pick);
    },
    onKeyDown: e => {
      if (e.key === 'ArrowDown') {
        e.preventDefault();
        setPick(true);
        requestAnimationFrame(() => document.querySelector('#ps-limit-options [aria-selected="true"]')?.focus());
      }
    }
  }, /*#__PURE__*/React.createElement("span", {
    id: "ps-limit-value"
  }, span), /*#__PURE__*/React.createElement("svg", {
    width: "18",
    height: "18",
    viewBox: "0 0 24 24",
    fill: "none",
    stroke: "currentColor",
    strokeWidth: "1.7",
    style: {
      transform: pick ? 'rotate(180deg)' : undefined
    }
  }, /*#__PURE__*/React.createElement("path", {
    d: "m6 9 6 6 6-6"
  }))), pick && /*#__PURE__*/React.createElement("div", {
    className: "ps-limit-options",
    role: "listbox",
    id: "ps-limit-options",
    "aria-labelledby": "ps-limit-duration",
    onKeyDown: e => {
      if (['ArrowDown', 'ArrowUp', 'Home', 'End'].includes(e.key)) {
        e.preventDefault();
        const items = Array.from(e.currentTarget.querySelectorAll('[role="option"]'));
        const i = items.indexOf(document.activeElement);
        const next = e.key === 'Home' ? 0 : e.key === 'End' ? items.length - 1 : (i + (e.key === 'ArrowDown' ? 1 : -1) + items.length) % items.length;
        items[next]?.focus();
      }
    }
  }, GL_SPANS.map(value => /*#__PURE__*/React.createElement("button", {
    key: value,
    role: "option",
    "aria-selected": span === value,
    onClick: () => choose(value)
  }, /*#__PURE__*/React.createElement("span", null, value), span === value && /*#__PURE__*/React.createElement("svg", {
    width: "18",
    height: "18",
    viewBox: "0 0 24 24",
    fill: "none",
    stroke: "currentColor",
    strokeWidth: "2"
  }, /*#__PURE__*/React.createElement("path", {
    d: "m5 12 4 4L19 6"
  })))))), /*#__PURE__*/React.createElement("section", {
    className: "ps-limit-info"
  }, /*#__PURE__*/React.createElement("h2", null, /*#__PURE__*/React.createElement("svg", {
    width: "20",
    height: "20",
    viewBox: "0 0 24 24",
    fill: "none",
    stroke: "currentColor",
    strokeWidth: "1.6"
  }, /*#__PURE__*/React.createElement("circle", {
    cx: "12",
    cy: "12",
    r: "9"
  }), /*#__PURE__*/React.createElement("path", {
    d: "M12 11v6M12 7v1"
  })), /*#__PURE__*/React.createElement("span", null, "WHAT A BREAK DOES")), /*#__PURE__*/React.createElement("ul", null, ["You are shut out of every real-money game.", "Deposits, withdrawals and P2P keep working.", "Play-money tables stay open the whole time."].map(text => /*#__PURE__*/React.createElement("li", {
    key: text
  }, text)))), /*#__PURE__*/React.createElement("button", {
    className: "ps-limit-start",
    onClick: () => {
      wClick(700);
      setDone(true);
    }
  }, "START THE BREAK"), /*#__PURE__*/React.createElement("p", {
    className: "ps-limit-terms"
  }, "By starting a break I confirm I am over 18 and accept the PokerDot responsible gaming terms."))));
}
Object.assign(window, {
  WalletScreen,
  ResponsibleGaming,
  GameLimit
});