function _extends() { return _extends = Object.assign ? Object.assign.bind() : function (n) { for (var e = 1; e < arguments.length; e++) { var t = arguments[e]; for (var r in t) ({}).hasOwnProperty.call(t, r) && (n[r] = t[r]); } return n; }, _extends.apply(null, arguments); }
// cash-lobby.jsx — the cash lobby behind the dock's red PLAY button.
// CashLobby (3 category tiles) → CLASSIC POKER (4 disciplines) → table list
//                              → FAST POKER (discipline → pooled limit) → felt
//                              → SPIN & WIN (existing buy-in → seating → wheel)
// blinds are money like any other figure — one helper, currency-aware
const clM = n => window.pxMoney ? window.pxMoney(n, n < 10) : "$" + n;
const CL_MONO = UI.font;
const CL_SANS = UI.fontUI;
const CL_ARC = "#D71921";
const clClick = (f, d) => {
  if (window.playClick) window.playClick(f || 1100, d || 0.04);
};
const clNum = n => Number(n).toLocaleString("en-US").split(",").join(" ");

// ── CLASSIC POKER disciplines ────────────────────────────────────────────
const CL_CLASSIC = [{
  id: "holdem",
  name: "HOLD'EM",
  color: "#21C97B",
  sub: "TEXAS HOLD'EM · THE CLASSIC",
  img: "assets/comp/holdem.png",
  imgY: -10,
  players: 12480
}, {
  id: "plo",
  name: "PLO",
  color: "#3B82F6",
  sub: "4-CARD POT-LIMIT OMAHA",
  img: "assets/comp/plo4.png",
  players: 2740
}, {
  id: "plo5",
  name: "PLO5",
  color: "#1FC8C8",
  sub: "5-CARD POT-LIMIT OMAHA",
  img: "assets/comp/plo5.png",
  players: 3120
}, {
  id: "shortdeck",
  name: "SHORT DECK",
  tag: "6+",
  color: "#F0A93C",
  sub: "36-CARD DECK · 6 TO ACE",
  img: "assets/comp/shortdeck.png",
  players: 1890
}];

// ── FAST POKER (fast fold, pooled limits) disciplines ────────────────────
// disciplines available in the fast-fold pool
const CL_BOMB_TILES = [{
  id: "holdem",
  name: "HOLD'EM",
  color: "#21C97B",
  sub: "TEXAS HOLD'EM · FAST FOLD",
  img: "assets/comp/holdem.png",
  imgY: -10,
  players: 1620
}, {
  id: "plo",
  name: "PLO",
  color: "#3B82F6",
  sub: "4-CARD OMAHA · FAST FOLD",
  img: "assets/comp/plo4.png",
  players: 1180
}, {
  id: "plo5",
  name: "PLO5",
  color: "#1FC8C8",
  sub: "5-CARD OMAHA · FAST FOLD",
  img: "assets/comp/plo5.png",
  players: 1050
}, {
  id: "plo6",
  name: "PLO6",
  color: "#8B7BF7",
  sub: "6-CARD OMAHA · FAST FOLD",
  img: "assets/comp/plo6.png",
  players: 680
}];

// per-discipline identity colour — every lobby is instantly recognisable
const CL_DISC_COLOR = {
  "HOLD'EM": "#21C97B",
  "PLO": "#3B82F6",
  "PLO5": "#1FC8C8",
  "PLO6": "#8B7BF7",
  "SHORT DECK": "#F0A93C"
};
window.CL_DISC_COLOR = CL_DISC_COLOR;
const CL_BOMB_DISC = ["ALL", "HOLD'EM", "PLO", "PLO5", "PLO6"];
const CL_CLASSIC_DISC = ["ALL", "HOLD'EM", "PLO5"];
// fast-fold pool tables (used only to seat the player after JOIN)
const CL_BOMB_GROUPS = [{
  disc: "PLO",
  stake: "1/2",
  sb: 1,
  bb: 2,
  buyIn: 200,
  cap: 400,
  tables: [{
    id: "b1",
    name: "12",
    max: 6,
    taken: 5,
    avg: "$210"
  }, {
    id: "b2",
    name: "27",
    max: 6,
    taken: 3,
    avg: "$164"
  }, {
    id: "b3",
    name: "41",
    max: 9,
    taken: 9,
    avg: "$248"
  }]
}, {
  disc: "HOLD'EM",
  stake: "1/2",
  sb: 1,
  bb: 2,
  buyIn: 200,
  cap: 400,
  tables: [{
    id: "b4",
    name: "08",
    max: 6,
    taken: 4,
    avg: "$126"
  }, {
    id: "b5",
    name: "19",
    max: 9,
    taken: 7,
    avg: "$188",
    dbl: true
  }]
}, {
  disc: "PLO",
  stake: "2/5",
  sb: 2,
  bb: 5,
  buyIn: 250,
  cap: 1000,
  tables: [{
    id: "b6",
    name: "33",
    max: 6,
    taken: 6,
    avg: "$540"
  }, {
    id: "b7",
    name: "52",
    max: 6,
    taken: 2,
    avg: "$395"
  }]
}, {
  disc: "PLO5",
  stake: "1/2",
  sb: 1,
  bb: 2,
  buyIn: 200,
  cap: 400,
  tables: [{
    id: "b8",
    name: "05",
    max: 6,
    taken: 3,
    avg: "$232"
  }, {
    id: "b9",
    name: "23",
    max: 9,
    taken: 5,
    avg: "$275",
    vpip: 30
  }]
}, {
  disc: "HOLD'EM",
  stake: "5/10",
  sb: 5,
  bb: 10,
  buyIn: 1000,
  cap: 2000,
  tables: [{
    id: "b10",
    name: "61",
    max: 6,
    taken: 6,
    avg: "$1 240"
  }, {
    id: "b11",
    name: "74",
    max: 9,
    taken: 4,
    avg: "$980"
  }]
}, {
  disc: "PLO6",
  stake: "1/2",
  sb: 1,
  bb: 2,
  buyIn: 200,
  cap: 400,
  tables: [{
    id: "b12",
    name: "16",
    max: 6,
    taken: 2,
    avg: "$198"
  }]
}, {
  disc: "PLO",
  stake: "1000/2000",
  sb: 1000,
  bb: 2000,
  buyIn: 200000,
  cap: 400000,
  tables: [{
    id: "b13",
    name: "01",
    max: 6,
    taken: 2,
    avg: "$186 400"
  }]
}];
const clStake = g => window.TS_MONEY ? window.TS_MONEY.stake(g.sb, g.bb) : clM(g.sb) + " / " + clM(g.bb);
// GAME INFO — describes the whole Bomb Rush game, not one table
const clBombGame = disc => [{
  k: "CURRENCY",
  v: "USDT · $"
}, {
  k: "GAME TYPE",
  v: "HOLD'EM"
}, {
  k: "BLINDS",
  v: "$1 / $2 — $1 000 / $2 000"
}, {
  k: "BUY-IN",
  v: "100 BB MIN · 200 BB MAX"
}, {
  k: "MIN PLAYERS",
  v: "3",
  note: "DEALING STARTS ONLY WITH ENOUGH PLAYERS SEATED"
}, {
  k: "MAX PLAYERS",
  v: "6",
  note: "EVERY HAND IS DEALT AT A FRESH 6-MAX TABLE"
}, {
  k: "ACTION TIME",
  v: "18 s"
}, {
  k: "TIME BANK",
  v: "30 s",
  note: "+5 s EVERY HAND · MAX 50 s"
}, {
  k: "DISCONNECT TIME",
  v: "30 s",
  note: "+10 s EVERY HAND · MAX 60 s"
}, {
  k: "SPEED",
  v: "UP TO 84 HANDS/HR",
  note: "FASTER ON LOWER LIMITS · SHOWN PER LIMIT"
}, {
  k: "SEATING",
  v: "POOLED",
  note: "YOU JOIN A LIMIT, NOT A TABLE — SEATS ARE DEALT AUTOMATICALLY"
}];
// п.2 (ревʼю 08.09): у швидкого покеру власний поріг джекпоту по кожній
// дисципліні — беремо його з таблиці правил, щоб цифри не розходились
const clFastJp = disc => {
  const T = window.BB_TRIGGERS_FAST || [];
  const key = String(disc || "").toUpperCase().replace("PLO5", "PLO-5").replace("PLO6", "PLO-6");
  const hit = T.find(t => t.game === key);
  if (hit) return ("LOSE WITH " + hit.cond + " OR BETTER").toUpperCase();
  return T.length ? "OWN TRIGGER PER GAME · SEE JACKPOT RULES" : "LOSE WITH QUAD ACES OR BETTER TO QUALIFY";
};
const clBombFeatures = disc => [{
  k: "JACKPOT",
  v: "BAD BEAT + HIGH HAND",
  note: clFastJp(disc)
}, {
  k: "INSURANCE",
  v: "ON",
  note: "POT FAVOURITE MAY INSURE AN ALL-IN"
}, {
  k: "MULTIPLE DEALING",
  v: "ON",
  note: "UNDERDOG MAY RUN IT TWICE OR THREE TIMES"
}, {
  k: "VIP REWARDS",
  v: "100 UPP / $1 RAKE",
  note: "RAKE PAID HERE EARNS UPP POINTS"
}];

// enter animations for every cash-lobby panel — self-contained so the panels
// never depend on a rAF that a hidden tab will not run
(function () {
  if (typeof document === "undefined" || document.getElementById("cl-anim")) return;
  const st = document.createElement("style");
  st.id = "cl-anim";
  st.textContent = "@keyframes cl-in-x{from{transform:translateX(100%)}to{transform:translateX(0)}}@keyframes cl-in-y{from{transform:translateY(100%)}to{transform:translateY(0)}}";
  document.head.appendChild(st);
})();

// ── shared chrome: header + black dotted canvas ──────────────────────────
function ClShell({
  title,
  sub,
  info,
  tabs,
  noAnim,
  onBack,
  onClose,
  accent,
  mounted,
  slide = "y",
  z = 82,
  children,
  balance = window.pxMoney && window.pxWallets ? window.pxMoney(window.pxWallets().usd) : "$4 827"
}) {
  // перемикання вкладок — не новий екран: анімацію входу тоді не програємо
  // усі ігрові екрани заходять однаково — знизу вгору, 360 мс
  const anim = noAnim ? "none" : "px-up 360ms cubic-bezier(0.2,0.8,0.2,1) both";
  return /*#__PURE__*/React.createElement("div", {
    style: {
      position: "absolute",
      inset: 0,
      zIndex: z,
      background: "#08080a",
      animation: anim,
      display: "flex",
      flexDirection: "column"
    }
  }, /*#__PURE__*/React.createElement("div", {
    style: {
      position: "absolute",
      top: 0,
      left: 0,
      right: 0,
      height: 230,
      pointerEvents: "none",
      background: `radial-gradient(ellipse 92% 72% at 50% 0%, ${accent}24, transparent 62%)`
    }
  }), /*#__PURE__*/React.createElement("div", {
    style: {
      position: "absolute",
      inset: 0,
      pointerEvents: "none",
      backgroundImage: "radial-gradient(circle, rgba(255,255,255,.055) .6px, transparent 1px)",
      backgroundSize: "11px 11px"
    }
  }), /*#__PURE__*/React.createElement("div", {
    style: {
      position: "relative",
      zIndex: 20,
      paddingTop: 62,
      paddingLeft: 14,
      paddingRight: 14,
      paddingBottom: 4,
      display: "flex",
      alignItems: "center",
      gap: 10
    }
  }, /*#__PURE__*/React.createElement("button", {
    onClick: () => {
      clClick(900);
      onBack();
    },
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
  }))), window.PxSectionTitle ? /*#__PURE__*/React.createElement(window.PxSectionTitle, {
    label: title,
    accent: accent,
    topInset: 104
  }) : /*#__PURE__*/React.createElement("span", {
    style: {
      flex: 1
    }
  }), window.PxBalance ? /*#__PURE__*/React.createElement(window.PxBalance, {
    value: balance,
    onTap: () => {
      clClick(1250);
      if (window.openDeposit) window.openDeposit();else if (window.__nav) window.__nav.dock("cashier");
    }
  }) : null), tabs ? /*#__PURE__*/React.createElement("div", {
    style: {
      position: "relative",
      zIndex: 5,
      padding: "12px 14px 12px"
    }
  }, tabs) : null, children);
}

// ── one category / discipline tile — uniform height, art on the right ────
const clInk = c => {
  const h = String(c || "").replace("#", "");
  if (h.length !== 6) return "#fff";
  const v = [0, 2, 4].map(i => parseInt(h.slice(i, i + 2), 16) / 255).map(x => x <= 0.03928 ? x / 12.92 : Math.pow((x + 0.055) / 1.055, 2.4));
  return 0.2126 * v[0] + 0.7152 * v[1] + 0.0722 * v[2] > 0.22 ? "#08080A" : "#fff";
};
function ClTile({
  it,
  accent,
  onTap,
  tall,
  h
}) {
  accent = it.color || accent;
  // per-item scale keeps the optical mass of each render equal — the source PNGs
  // crop their subjects differently, so a single size reads uneven
  const art = (tall ? 178 : 138) * (it.imgS || 1);
  const artX = it.imgX == null ? -8 : it.imgX;
  return /*#__PURE__*/React.createElement("div", {
    style: {
      position: "relative",
      flex: "none",
      width: "100%"
    }
  }, window.InfoDot ? /*#__PURE__*/React.createElement("span", {
    style: {
      position: "absolute",
      right: 12,
      top: 12,
      zIndex: 6
    }
  }, /*#__PURE__*/React.createElement(window.InfoDot, {
    title: it.name,
    accent: accent,
    size: 22
  })) : null, /*#__PURE__*/React.createElement("button", {
    onClick: () => {
      clClick(1200);
      onTap();
    },
    onMouseDown: e => {
      e.currentTarget.style.transform = "scale(.985)";
    },
    onMouseUp: e => {
      e.currentTarget.style.transform = "";
    },
    onMouseLeave: e => {
      e.currentTarget.style.transform = "";
    },
    style: {
      position: "relative",
      overflow: "hidden",
      textAlign: "left",
      cursor: "pointer",
      width: "100%",
      flex: "none",
      height: h,
      borderRadius: 20,
      padding: "16px 18px",
      border: `1px solid ${it.color ? accent + "99" : "rgba(255,255,255,.13)"}`,
      background: it.color ? `linear-gradient(152deg, ${accent}2E 0%, ${accent}12 40%, #0c0c0f 74%, #0a0a0c 100%)` : "linear-gradient(152deg, #17171c 0%, #0c0c0f 62%, #0a0a0c 100%)",
      boxShadow: it.color ? `0 10px 26px rgba(0,0,0,.5), inset 0 1px 0 ${accent}40` : "0 10px 26px rgba(0,0,0,.5)",
      transition: "transform 110ms",
      display: "flex",
      flexDirection: "column",
      justifyContent: "center"
    }
  }, /*#__PURE__*/React.createElement("div", {
    style: {
      position: "absolute",
      inset: 0,
      pointerEvents: "none",
      background: `radial-gradient(ellipse 70% 90% at 100% 50%, ${accent}3D, transparent 66%)`
    }
  }), it.color && /*#__PURE__*/React.createElement("div", {
    style: {
      position: "absolute",
      left: 0,
      top: 14,
      bottom: 14,
      width: 3,
      borderRadius: "0 3px 3px 0",
      background: accent,
      pointerEvents: "none"
    }
  }), /*#__PURE__*/React.createElement("div", {
    style: {
      position: "absolute",
      inset: 0,
      pointerEvents: "none",
      backgroundImage: "radial-gradient(circle, rgba(255,255,255,.07) .8px, transparent 1.2px)",
      backgroundSize: "13px 13px",
      maskImage: "linear-gradient(150deg, black, transparent 70%)",
      WebkitMaskImage: "linear-gradient(150deg, black, transparent 70%)"
    }
  }), it.glyph ? /*#__PURE__*/React.createElement("span", {
    style: {
      position: "absolute",
      width: art,
      right: artX,
      top: `calc(50% - ${art / 2}px)`,
      height: art,
      display: "flex",
      alignItems: "center",
      justifyContent: "center",
      pointerEvents: "none",
      zIndex: 3,
      fontFamily: CL_MONO,
      fontWeight: 700,
      fontSize: art * 0.76,
      lineHeight: 1,
      backgroundImage: "linear-gradient(150deg,#8f9298 0%,#f4f6f8 34%,#ffffff 46%,#c9ced4 60%,#7e8288 100%)",
      WebkitBackgroundClip: "text",
      backgroundClip: "text",
      color: "transparent",
      WebkitTextFillColor: "transparent",
      filter: "drop-shadow(0 10px 18px rgba(0,0,0,.6))",
      animation: "comp-floatA 4.6s ease-in-out infinite"
    }
  }, it.glyph) : /*#__PURE__*/React.createElement("img", {
    src: it.img,
    alt: "",
    style: {
      position: "absolute",
      width: art,
      height: art,
      right: artX,
      top: `calc(50% - ${art / 2 - (it.imgY || 0)}px)`,
      objectFit: "contain",
      opacity: .97,
      pointerEvents: "none",
      zIndex: 3,
      filter: "drop-shadow(0 12px 20px rgba(0,0,0,.6))",
      animation: "comp-floatA 4.6s ease-in-out infinite",
      willChange: "transform"
    }
  }), it.tag && /*#__PURE__*/React.createElement("span", {
    style: {
      position: "absolute",
      top: 12,
      right: 44,
      zIndex: 2,
      fontFamily: CL_SANS,
      fontWeight: 700,
      fontSize: 10.5,
      letterSpacing: ".1em",
      color: clInk(accent),
      padding: "4px 8px",
      borderRadius: 6,
      background: accent,
      whiteSpace: "nowrap",
      pointerEvents: "none"
    }
  }, it.tag), /*#__PURE__*/React.createElement("div", {
    style: {
      position: "relative",
      paddingRight: tall ? 150 : 118
    }
  }, /*#__PURE__*/React.createElement("div", {
    style: {
      fontFamily: CL_MONO,
      fontWeight: 700,
      fontSize: tall ? 23 : 20,
      color: "#fff",
      letterSpacing: ".02em",
      lineHeight: 1.05,
      whiteSpace: "nowrap"
    }
  }, it.name), /*#__PURE__*/React.createElement("div", {
    style: {
      fontFamily: CL_SANS,
      fontWeight: 600,
      fontSize: 11,
      color: "#A9A9B2",
      letterSpacing: ".11em",
      marginTop: 7,
      lineHeight: 1.4
    }
  }, it.sub), /*#__PURE__*/React.createElement("div", {
    style: {
      display: "flex",
      alignItems: "center",
      gap: 6,
      marginTop: tall ? 13 : 10
    }
  }, /*#__PURE__*/React.createElement("span", {
    style: {
      width: 5,
      height: 5,
      borderRadius: "50%",
      background: it.color || "#5BD96A",
      animation: "pp-pulse 1.8s ease-in-out infinite",
      flex: "none"
    }
  }), /*#__PURE__*/React.createElement("span", {
    style: {
      fontFamily: CL_MONO,
      fontWeight: 700,
      fontSize: 12,
      color: "#fff",
      letterSpacing: ".02em"
    }
  }, clNum(it.players)), /*#__PURE__*/React.createElement("span", {
    style: {
      fontFamily: CL_SANS,
      fontWeight: 700,
      fontSize: 10.5,
      letterSpacing: ".14em",
      color: "#A9A9B2"
    }
  }, "PLAYING"))), /*#__PURE__*/React.createElement("svg", {
    width: "16",
    height: "16",
    viewBox: "0 0 24 24",
    fill: "none",
    stroke: "rgba(255,255,255,.4)",
    strokeWidth: "2.4",
    strokeLinecap: "round",
    strokeLinejoin: "round",
    style: {
      position: "absolute",
      right: 14,
      bottom: 14
    }
  }, /*#__PURE__*/React.createElement("path", {
    d: "M9 6l6 6-6 6"
  }))));
}

// ── FAST POKER step 1 — pick a discipline (same pattern as CLASSIC) ───────
function ClBombPick({
  open,
  onClose,
  onPick,
  accent
}) {
  const [mounted, setMounted] = React.useState(false);
  React.useEffect(() => {
    if (!open) {
      setMounted(false);
      return;
    }
    const r = requestAnimationFrame(() => setMounted(true));
    const f = setTimeout(() => setMounted(true), 60);
    return () => {
      cancelAnimationFrame(r);
      clearTimeout(f);
    };
  }, [open]);
  if (!open) return null;
  return /*#__PURE__*/React.createElement(ClShell, {
    title: "FAST POKER",
    info: true,
    accent: accent,
    mounted: mounted,
    slide: "x",
    z: 96,
    onBack: onClose,
    onClose: onClose
  }, /*#__PURE__*/React.createElement("div", {
    style: {
      position: "relative",
      zIndex: 2,
      flex: 1,
      minHeight: 0,
      padding: "4px 16px 26px",
      display: "flex",
      flexDirection: "column",
      justifyContent: "center",
      gap: 12
    }
  }, CL_BOMB_TILES.map(d => /*#__PURE__*/React.createElement(ClTile, {
    key: d.id,
    it: d,
    accent: accent,
    h: 150,
    onTap: () => onPick(d)
  }))));
}

// ── FAST POKER step 2 — stake groups of the chosen discipline ─────────────
function ClSpecRow({
  k,
  v,
  note,
  vc
}) {
  return /*#__PURE__*/React.createElement("div", {
    style: {
      padding: "9px 0",
      borderBottom: "1px solid rgba(255,255,255,.07)"
    }
  }, /*#__PURE__*/React.createElement("div", {
    style: {
      display: "flex",
      alignItems: "baseline",
      gap: 12
    }
  }, /*#__PURE__*/React.createElement("span", {
    style: {
      flex: 1,
      fontFamily: CL_SANS,
      fontWeight: 700,
      fontSize: 10.5,
      letterSpacing: ".16em",
      color: "#A9A9B2"
    }
  }, window.Term && window.PX_TERMS && window.PX_TERMS[k] ? /*#__PURE__*/React.createElement(window.Term, {
    k: k
  }, k) : k), /*#__PURE__*/React.createElement("span", {
    style: {
      flex: "none",
      fontFamily: CL_MONO,
      fontWeight: 700,
      fontSize: 12,
      color: vc || "#fff",
      fontVariantNumeric: "tabular-nums"
    }
  }, v)), note && /*#__PURE__*/React.createElement("div", {
    style: {
      fontFamily: CL_SANS,
      fontWeight: 600,
      fontSize: 11,
      letterSpacing: ".1em",
      color: "#D8D8DF",
      marginTop: 4,
      lineHeight: 1.45
    }
  }, note));
}
function ClSheet({
  open,
  onClose,
  title,
  sub,
  children,
  cta,
  z = 40
}) {
  const [m, setM] = React.useState(false);
  React.useEffect(() => {
    if (!open) {
      setM(false);
      return;
    }
    const r = requestAnimationFrame(() => setM(true));
    return () => cancelAnimationFrame(r);
  }, [open]);
  if (!open) return null;
  return /*#__PURE__*/React.createElement("div", {
    style: {
      position: "absolute",
      inset: 0,
      zIndex: z,
      display: "flex",
      flexDirection: "column",
      justifyContent: "flex-end"
    }
  }, /*#__PURE__*/React.createElement("div", {
    onClick: onClose,
    style: {
      position: "absolute",
      inset: 0,
      background: "rgba(0,0,0,.66)",
      opacity: m ? 1 : 0,
      transition: "opacity 260ms ease"
    }
  }), /*#__PURE__*/React.createElement("div", {
    style: {
      position: "relative",
      maxHeight: "86%",
      display: "flex",
      flexDirection: "column",
      borderRadius: "20px 20px 0 0",
      border: "1px solid rgba(255,255,255,.14)",
      borderBottom: 0,
      background: "linear-gradient(180deg,#15151a,#0a0a0c 40%)",
      transform: m ? "translateY(0)" : "translateY(100%)",
      transition: "transform 300ms cubic-bezier(0.2,0.8,0.2,1)",
      boxShadow: "0 -20px 50px rgba(0,0,0,.7)"
    }
  }, /*#__PURE__*/React.createElement("div", {
    style: {
      flex: "none",
      padding: "9px 0 2px",
      display: "flex",
      justifyContent: "center"
    }
  }, /*#__PURE__*/React.createElement("span", {
    style: {
      width: 40,
      height: 4,
      borderRadius: 125,
      background: "rgba(255,255,255,.22)"
    }
  })), /*#__PURE__*/React.createElement("div", {
    style: {
      flex: "none",
      padding: "6px 18px 12px",
      display: "flex",
      alignItems: "center",
      gap: 12,
      borderBottom: "1px solid rgba(255,255,255,.1)"
    }
  }, /*#__PURE__*/React.createElement("span", {
    style: {
      flex: 1,
      minWidth: 0
    }
  }, /*#__PURE__*/React.createElement("span", {
    style: {
      display: "block",
      fontFamily: CL_MONO,
      fontWeight: 700,
      fontSize: 15,
      color: "#fff",
      letterSpacing: ".04em"
    }
  }, title)), /*#__PURE__*/React.createElement("button", {
    onClick: () => {
      clClick(900);
      onClose();
    },
    style: {
      flex: "none",
      width: 34,
      height: 34,
      borderRadius: 12,
      background: "rgba(255,255,255,.08)",
      border: "1px solid rgba(255,255,255,.16)",
      cursor: "pointer",
      display: "flex",
      alignItems: "center",
      justifyContent: "center",
      padding: 0
    }
  }, /*#__PURE__*/React.createElement("svg", {
    width: "14",
    height: "14",
    viewBox: "0 0 24 24",
    fill: "none",
    stroke: "#fff",
    strokeWidth: "2.4",
    strokeLinecap: "round"
  }, /*#__PURE__*/React.createElement("path", {
    d: "M6 6l12 12M18 6L6 18"
  })))), /*#__PURE__*/React.createElement("div", {
    style: {
      flex: 1,
      minHeight: 0,
      overflowY: "auto",
      WebkitOverflowScrolling: "touch",
      padding: "4px 18px 16px"
    }
  }, children), cta && /*#__PURE__*/React.createElement("div", {
    style: {
      flex: "none",
      padding: "12px 18px 24px",
      borderTop: "1px solid rgba(255,255,255,.1)",
      background: "linear-gradient(180deg,rgba(0,0,0,.3),#0a0a0c 50%)"
    }
  }, cta)));
}

// pooled-limit rows: players on the limit + speed, VPIP flag only
function ClLimitRow({
  L,
  accent,
  onJoin
}) {
  return /*#__PURE__*/React.createElement("button", {
    onClick: () => {
      clClick(1300);
      onJoin(L);
    },
    style: {
      width: "100%",
      boxSizing: "border-box",
      cursor: "pointer",
      textAlign: "left",
      height: 77,
      borderRadius: 12,
      padding: "0 13px",
      display: "flex",
      alignItems: "center",
      gap: 11,
      border: "1px solid rgba(255,255,255,.1)",
      background: "linear-gradient(152deg,#17171c 0%,#0c0c0f 62%,#0a0a0c 100%)",
      boxShadow: "0 10px 26px rgba(0,0,0,.5)"
    }
  }, /*#__PURE__*/React.createElement("span", {
    style: {
      flex: 1,
      minWidth: 0,
      display: "flex",
      flexDirection: "column",
      gap: 4
    }
  }, /*#__PURE__*/React.createElement("span", {
    style: {
      fontFamily: CL_MONO,
      fontWeight: 700,
      fontSize: 17,
      color: "#fff",
      letterSpacing: ".03em",
      whiteSpace: "nowrap"
    }
  }, clStake(L)), /*#__PURE__*/React.createElement("span", {
    style: {
      fontFamily: CL_SANS,
      fontWeight: 600,
      fontSize: 10.5,
      letterSpacing: ".04em",
      color: "#A9A9B2",
      whiteSpace: "nowrap"
    }
  }, /*#__PURE__*/React.createElement("span", {
    style: {
      fontFamily: CL_MONO,
      fontWeight: 700,
      color: accent
    }
  }, clNum(L.players)), " PLAYERS \xB7 ", /*#__PURE__*/React.createElement("span", {
    style: {
      fontFamily: CL_MONO,
      fontWeight: 700,
      color: "#D8D8DF"
    }
  }, L.hph), " HANDS/HR")), /*#__PURE__*/React.createElement("span", {
    style: {
      flex: "none",
      display: "flex",
      flexDirection: "column",
      alignItems: "flex-end",
      gap: 3,
      marginRight: 2
    }
  }, /*#__PURE__*/React.createElement("span", {
    style: {
      fontFamily: CL_SANS,
      fontWeight: 700,
      fontSize: 10.5,
      letterSpacing: ".18em",
      color: "#A9A9B2"
    }
  }, "BUY-IN"), /*#__PURE__*/React.createElement("span", {
    style: {
      fontFamily: CL_MONO,
      fontWeight: 700,
      fontSize: 12,
      color: "#fff",
      letterSpacing: ".02em",
      whiteSpace: "nowrap",
      fontVariantNumeric: "tabular-nums"
    }
  }, L.range)), /*#__PURE__*/React.createElement("span", {
    style: {
      flex: "none",
      display: "inline-flex",
      alignItems: "center",
      gap: 5,
      height: 38,
      padding: "0 17px",
      borderRadius: 125,
      background: accent,
      color: clInk(accent),
      fontFamily: CL_SANS,
      fontWeight: 700,
      fontSize: 11,
      letterSpacing: ".1em"
    }
  }, "JOIN \u203A"));
}

// ── Block 3 · cash entry ─────────────────────────────────────────────────
// Discipline tabs are a SWITCHER, not a filter: exactly one is active, there is
// no "ALL", and Hold'em is the default (3.2).
// Правка 19: рядок дисциплін ІДЕНТИЧНИЙ на обох вкладках — з «ВСЕ» на початку.
// Список береться з реальних столів: піґулка зʼявляється лише тоді, коли
// зʼявляється стіл цієї дисципліни (у першій версії — холдем і Омаха 5).
const clDiscs = () => window.PX_LIVE_DISCS || ["ALL", "HOLD'EM", "PLO5"];
// швидкий покер існує лише в холдемі — вкладок дисциплін тут немає
const CL_FAST_DISCS = ["HOLD'EM"];
const clBalanceNum = b => Number(String(b).replace(/[^0-9.]/g, "")) || 0;
// Правка 20 · памʼять вкладки кеш-лобі
const CL_TAB_KEY = "px_cash_tab";
const clSegment = () => {
  try {
    return window.__pxSegment || "nodep";
  } catch (e) {
    return "nodep";
  }
};
// true = «ВСЕ СТОЛЫ», false = «БЫСТРОЕ МЕНЮ»
const clStartTab = () => {
  try {
    const saved = localStorage.getItem(CL_TAB_KEY);
    if (saved === "all") return true;
    if (saved === "quick") return false;
  } catch (e) {}
  return clSegment() === "migrant";
};
const clSaveTab = all => {
  try {
    localStorage.setItem(CL_TAB_KEY, all ? "all" : "quick");
  } catch (e) {}
};
// how many of the room's tables run each discipline — feeds "SHOW ALL TABLES · N"
const CL_DISC_SHARE = {
  "HOLD'EM": .46,
  "PLO": .21,
  "PLO5": .18,
  "PLO6": .07,
  "SHORT DECK": .15
};

// Правка 11 (архітектура 09.09): дві вкладки виду стоять на місці заголовка
// «КЭШ-ИГРЫ» — під шапкою з «назад» і балансом. Кнопки «ТУРНИРЫ» тут більше
// немає: турніри — окремий розділ, а не третій режим цього екрана.
// «ВСЕ СТОЛЫ» — вкладка за замовчуванням.
function ClViewTabs({
  value,
  onChange
}) {
  const accent = CL_ARC;
  const tab = (id, label) => {
    const on = value === id;
    return /*#__PURE__*/React.createElement("button", {
      key: id,
      onClick: () => {
        if (on) return;
        clClick(1150);
        onChange(id);
      },
      style: {
        flex: 1,
        minWidth: 0,
        borderRadius: 9,
        border: 0,
        cursor: on ? "default" : "pointer",
        display: "flex",
        alignItems: "center",
        justifyContent: "center",
        whiteSpace: "nowrap",
        background: on ? accent : "transparent",
        color: on ? clInk(accent) : "rgba(255,255,255,.55)",
        fontFamily: CL_MONO,
        fontWeight: 700,
        fontSize: 10.5,
        letterSpacing: ".1em",
        transition: "all 160ms",
        boxShadow: on ? "0 4px 12px rgba(0,0,0,.45)" : "none"
      }
    }, label);
  };
  return /*#__PURE__*/React.createElement("div", {
    style: {
      display: "flex",
      gap: 3,
      height: 40,
      boxSizing: "border-box",
      padding: 3,
      borderRadius: 12,
      background: "rgba(255,255,255,.075)",
      border: "1px solid rgba(255,255,255,.13)"
    }
  }, tab("all", "ALL TABLES"), tab("quick", "QUICK PICK"));
}

// Рядок дисциплін мусить бути ОДНАКОВИЙ на обох вкладках — ті самі розміри,
// шрифт і відступи, що й на «ВСЕ СТОЛЫ». Інакше при перемиканні вкладок
// піґулки «стрибають».
function ClDiscTabs({
  discs,
  value,
  onChange
}) {
  return /*#__PURE__*/React.createElement("div", {
    style: {
      display: "flex",
      gap: 7,
      padding: "0 14px 10px",
      overflowX: "auto",
      scrollbarWidth: "none"
    }
  }, discs.map(d => {
    const on = d === value;
    const c = d === "ALL" ? CL_ARC : CL_DISC_COLOR[d] || CL_ARC;
    return /*#__PURE__*/React.createElement("button", {
      key: d,
      onClick: () => {
        clClick(1150);
        onChange(d);
      },
      style: {
        flex: "none",
        height: 38,
        padding: "0 16px",
        display: "inline-flex",
        alignItems: "center",
        borderRadius: 125,
        cursor: "pointer",
        boxSizing: "border-box",
        background: on ? c : "rgba(255,255,255,.065)",
        border: `1px solid ${on ? c : "rgba(255,255,255,.18)"}`,
        color: on ? clInk(c) : "rgba(255,255,255,.72)",
        fontFamily: CL_MONO,
        fontWeight: 700,
        fontSize: 12,
        letterSpacing: ".02em",
        whiteSpace: "nowrap",
        boxShadow: on ? `0 6px 16px ${CL_ARC}44` : "none",
        transition: "background .15s, border-color .15s"
      }
    }, d);
  }));
}

// limit card — entry range is the headline, blinds and players are secondary,
// PLAY sits on the card itself and auto-seats (3.3 / 3.4 / 3.10)
function ClLimitCard({
  L,
  accent,
  locked,
  onPlay,
  onLocked
}) {
  const range = window.TS_MONEY ? window.TS_MONEY.money(L.bb * 40, 1) : "$" + L.bb * 40;
  return /*#__PURE__*/React.createElement("div", {
    style: {
      position: "relative",
      overflow: "hidden",
      borderRadius: 16,
      padding: "12px 12px",
      display: "flex",
      alignItems: "center",
      gap: 10,
      border: `1px solid ${accent}3d`,
      background: `linear-gradient(152deg,${accent}1f 0%,#141419 46%,#0d0d10 100%)`,
      boxShadow: "0 8px 22px rgba(0,0,0,.55)"
    }
  }, (() => {
    const lab = {
      display: "block",
      fontFamily: CL_SANS,
      fontWeight: 700,
      fontSize: 8.5,
      letterSpacing: ".12em",
      lineHeight: 1,
      color: "#8A8A93",
      whiteSpace: "nowrap"
    };
    const val = {
      display: "flex",
      alignItems: "flex-end",
      height: 22,
      marginTop: 8,
      whiteSpace: "nowrap"
    };
    const rule = /*#__PURE__*/React.createElement("span", {
      style: {
        flex: "none",
        width: 1,
        alignSelf: "stretch",
        background: "rgba(255,255,255,.1)"
      }
    });
    return /*#__PURE__*/React.createElement("span", {
      style: {
        flex: 1,
        minWidth: 0,
        display: "flex",
        alignItems: "stretch",
        gap: 9
      }
    }, /*#__PURE__*/React.createElement("span", {
      style: {
        flex: 1,
        minWidth: 0
      }
    }, /*#__PURE__*/React.createElement("span", {
      style: lab
    }, /*#__PURE__*/React.createElement(window.Term, {
      k: "ENTRY FROM"
    }, "ENTRY FROM")), /*#__PURE__*/React.createElement("span", {
      style: val
    }, /*#__PURE__*/React.createElement("span", {
      style: {
        fontFamily: CL_MONO,
        fontWeight: 700,
        fontSize: 18,
        lineHeight: 1,
        color: "#fff",
        letterSpacing: "0",
        fontVariantNumeric: "tabular-nums"
      }
    }, range))), rule, /*#__PURE__*/React.createElement("span", {
      style: {
        flex: "none",
        width: 84
      }
    }, /*#__PURE__*/React.createElement("span", {
      style: lab
    }, /*#__PURE__*/React.createElement(window.Term, {
      k: "BLINDS"
    }, "BLINDS")), /*#__PURE__*/React.createElement("span", {
      style: val
    }, /*#__PURE__*/React.createElement("span", {
      style: {
        fontFamily: CL_MONO,
        fontWeight: 700,
        fontSize: 12,
        lineHeight: 1.05,
        color: "#D8D8DF",
        fontVariantNumeric: "tabular-nums"
      }
    }, clStake(L)))), rule, /*#__PURE__*/React.createElement("span", {
      style: {
        flex: "none",
        width: 54
      }
    }, /*#__PURE__*/React.createElement("span", {
      style: lab
    }, "PLAYERS"), /*#__PURE__*/React.createElement("span", {
      style: Object.assign({
        gap: 5
      }, val)
    }, /*#__PURE__*/React.createElement("span", {
      style: {
        flex: "none",
        width: 5,
        height: 5,
        borderRadius: "50%",
        background: "#5BD96A",
        marginBottom: 3
      }
    }), /*#__PURE__*/React.createElement("span", {
      style: {
        fontFamily: CL_MONO,
        fontWeight: 700,
        fontSize: 12,
        lineHeight: 1.05,
        color: "#fff",
        fontVariantNumeric: "tabular-nums"
      }
    }, clNum(L.players)))));
  })(), /*#__PURE__*/React.createElement("button", {
    onClick: () => {
      if (locked) {
        clClick(700);
        onLocked(L);
        return;
      }
      clClick(1350);
      onPlay(L);
    },
    style: {
      flex: "none",
      height: 36,
      padding: "0 14px",
      borderRadius: 125,
      cursor: "pointer",
      border: 0,
      background: accent,
      color: clInk(accent),
      fontFamily: CL_SANS,
      fontWeight: 700,
      fontSize: 10.5,
      letterSpacing: ".08em",
      boxShadow: `0 6px 16px ${accent}55`
    }
  }, "PLAY"));
}

// the cash entry screen itself
function ClCashEntry({
  open,
  disc,
  onDisc,
  onPlay,
  onAllTables,
  noAnim,
  accent,
  balance = window.pxMoney && window.pxWallets ? window.pxMoney(window.pxWallets().usd) : "$4 827"
}) {
  const [warn, setWarn] = React.useState(null);
  React.useEffect(() => {
    if (!open) setWarn(null);
  }, [open]);
  // one-time nudge towards the secondary path (3.11)
  const [hint, setHint] = React.useState(false);
  React.useEffect(() => {
    if (!open) return;
    let seen = false;
    try {
      seen = localStorage.getItem("px_all_tables_seen") === "1";
    } catch (e) {}
    if (seen) return;
    setHint(true);
    const t = setTimeout(() => {
      setHint(false);
      try {
        localStorage.setItem("px_all_tables_seen", "1");
      } catch (e) {}
    }, 3200);
    return () => clearTimeout(t);
  }, [open]);
  React.useEffect(() => {
    if (!warn) return;
    const t = setTimeout(() => setWarn(null), 2600);
    return () => clearTimeout(t);
  }, [warn]);
  if (!open) return null;
  const dc = disc === "ALL" ? CL_ARC : CL_DISC_COLOR[disc] || accent;
  const bal = clBalanceNum(balance);
  // ліміти однієї дисципліни: кількість гравців — її частка від пулу
  const limitsOf = d => {
    const share = CL_DISC_SHARE[d] || .2;
    return CL_CASH_LIMITS.map(L => ({
      ...L,
      players: Math.max(4, Math.round(L.players * share))
    }));
  };
  const DISCS = clDiscs().filter(d => d !== "ALL");
  const limits = disc === "ALL" ? [] : limitsOf(disc);
  // count exactly what the browser will list: every tier's tables, minus the
  // empty ones it hides by default
  const tables = (window.TS_TIERS || []).reduce((n, g) => n + g.tables.filter(t => t.taken > 0).length, 0);
  return /*#__PURE__*/React.createElement(ClShell, {
    title: "CASH GAMES",
    info: "CASH GAMES",
    accent: dc,
    slide: "x",
    z: 90,
    noAnim: noAnim,
    balance: balance,
    onBack: onAllTables ? () => onDisc(null) : null,
    onClose: () => onDisc(null),
    tabs: /*#__PURE__*/React.createElement(ClViewTabs, {
      value: "quick",
      onChange: v => {
        if (v === "all") {
          try {
            localStorage.setItem("px_all_tables_seen", "1");
          } catch (e) {}
          onAllTables();
        }
      }
    })
  }, /*#__PURE__*/React.createElement(ClDiscTabs, {
    discs: clDiscs(),
    value: disc,
    onChange: onDisc
  }), /*#__PURE__*/React.createElement("div", {
    style: {
      position: "relative",
      zIndex: 2,
      flex: 1,
      minHeight: 0,
      overflowY: "auto",
      WebkitOverflowScrolling: "touch",
      padding: "0 14px 16px"
    }
  }, disc === "ALL" ? DISCS.map((d, i) => /*#__PURE__*/React.createElement(React.Fragment, {
    key: d
  }, /*#__PURE__*/React.createElement("div", {
    style: {
      display: "flex",
      flexDirection: "column",
      gap: 9,
      marginTop: i === 0 ? 0 : 9
    }
  }, limitsOf(d).map(L => /*#__PURE__*/React.createElement(ClLimitCard, {
    key: d + clStake(L),
    L: L,
    accent: CL_DISC_COLOR[d] || CL_ARC,
    locked: bal < L.bb * 40,
    onPlay: x => onPlay(x, d),
    onLocked: x => setWarn(x)
  }))))) : /*#__PURE__*/React.createElement("div", {
    style: {
      display: "flex",
      flexDirection: "column",
      gap: 9
    }
  }, limits.map(L => /*#__PURE__*/React.createElement(ClLimitCard, {
    key: clStake(L),
    L: L,
    accent: dc,
    locked: bal < L.bb * 40,
    onPlay: x => onPlay(x, disc),
    onLocked: x => setWarn(x)
  })))), warn && /*#__PURE__*/React.createElement("div", {
    style: {
      flex: "none",
      position: "relative",
      padding: "10px 14px 26px"
    }
  }, /*#__PURE__*/React.createElement("div", {
    style: {
      padding: "10px 13px",
      borderRadius: 12,
      background: "#1b1114",
      border: `1px solid ${CL_ARC}66`,
      boxShadow: "0 10px 26px rgba(0,0,0,.6)"
    }
  }, /*#__PURE__*/React.createElement("div", {
    style: {
      fontFamily: CL_SANS,
      fontWeight: 700,
      fontSize: 11,
      letterSpacing: ".1em",
      color: CL_ARC
    }
  }, "NOT ENOUGH FUNDS"), /*#__PURE__*/React.createElement("div", {
    style: {
      fontFamily: CL_SANS,
      fontWeight: 600,
      fontSize: 10.5,
      letterSpacing: ".04em",
      color: "#A9A9B2",
      marginTop: 3
    }
  }, clStake(warn), " needs ", window.TS_MONEY ? window.TS_MONEY.money(warn.bb * 40, 1) : "", " \xB7 your balance ", balance))));
}

// ── CASH GAMES · step 1: pick a limit (no discipline yet) ─────────────────
// same row shape as fast poker, neutral chrome — the limit is not tied to a game.
// ONE rule for limits app-wide: they ascend — cheap first, top to bottom and
// left to right.
const CL_CASH_LIMITS = [{
  sb: 0.5,
  bb: 1,
  players: 4820,
  tables: 214,
  tier: "MICRO"
}, {
  sb: 1,
  bb: 2,
  players: 6310,
  tables: 288,
  tier: "MICRO"
}, {
  sb: 2,
  bb: 5,
  players: 3940,
  tables: 176,
  tier: "LOW"
}, {
  sb: 5,
  bb: 10,
  players: 2180,
  tables: 98,
  tier: "LOW"
}, {
  sb: 10,
  bb: 20,
  players: 1240,
  tables: 56,
  tier: "MID"
}, {
  sb: 25,
  bb: 50,
  players: 610,
  tables: 27,
  tier: "MID"
}, {
  sb: 50,
  bb: 100,
  players: 240,
  tables: 11,
  tier: "HIGH"
}, {
  sb: 100,
  bb: 200,
  players: 96,
  tables: 5,
  tier: "HIGH"
}];
function ClCashLimits({
  open,
  onClose,
  onPick,
  accent
}) {
  const [mounted, setMounted] = React.useState(false);
  React.useEffect(() => {
    if (!open) {
      setMounted(false);
      return;
    }
    const r = requestAnimationFrame(() => setMounted(true));
    const f = setTimeout(() => setMounted(true), 60);
    return () => {
      cancelAnimationFrame(r);
      clearTimeout(f);
    };
  }, [open]);
  if (!open) return null;
  const online = CL_CASH_LIMITS.reduce((s, L) => s + L.players, 0);
  return /*#__PURE__*/React.createElement(ClShell, {
    title: "CASH GAMES",
    info: "CASH GAMES",
    accent: accent,
    mounted: mounted,
    slide: "x",
    z: 90,
    onBack: onClose,
    onClose: onClose
  }, /*#__PURE__*/React.createElement("div", {
    style: {
      position: "relative",
      zIndex: 2,
      flex: 1,
      minHeight: 0,
      overflowY: "auto",
      WebkitOverflowScrolling: "touch",
      padding: "0 14px 40px"
    }
  }, /*#__PURE__*/React.createElement("div", {
    style: {
      display: "flex",
      alignItems: "center",
      gap: 8,
      padding: "0 3px 10px"
    }
  }, /*#__PURE__*/React.createElement("span", {
    style: {
      fontFamily: CL_SANS,
      fontWeight: 700,
      fontSize: 10.5,
      letterSpacing: ".2em",
      color: "#A9A9B2"
    }
  }, "LIMITS"), /*#__PURE__*/React.createElement("span", {
    style: {
      flex: 1,
      height: 1,
      background: "rgba(255,255,255,.13)"
    }
  }), /*#__PURE__*/React.createElement("span", {
    style: {
      fontFamily: CL_MONO,
      fontWeight: 700,
      fontSize: 10.5,
      color: "#A9A9B2"
    }
  }, clNum(online), " ONLINE")), /*#__PURE__*/React.createElement("div", {
    style: {
      display: "flex",
      flexDirection: "column",
      gap: 9
    }
  }, CL_CASH_LIMITS.map(L => /*#__PURE__*/React.createElement("button", {
    key: clStake(L),
    onClick: () => {
      clClick(1300);
      onPick(L);
    },
    style: {
      width: "100%",
      boxSizing: "border-box",
      cursor: "pointer",
      textAlign: "left",
      height: 77,
      borderRadius: 12,
      padding: "0 13px",
      display: "flex",
      alignItems: "center",
      gap: 11,
      border: "1px solid rgba(255,255,255,.1)",
      background: "linear-gradient(152deg,#17171c 0%,#0c0c0f 62%,#0a0a0c 100%)",
      boxShadow: "0 10px 26px rgba(0,0,0,.5)"
    }
  }, /*#__PURE__*/React.createElement("span", {
    style: {
      flex: 1,
      minWidth: 0,
      display: "flex",
      flexDirection: "column",
      gap: 5
    }
  }, /*#__PURE__*/React.createElement("span", {
    style: {
      display: "flex",
      alignItems: "center",
      gap: 8
    }
  }, /*#__PURE__*/React.createElement("span", {
    style: {
      fontFamily: CL_MONO,
      fontWeight: 700,
      fontSize: 19,
      color: "#fff",
      letterSpacing: ".02em",
      whiteSpace: "nowrap"
    }
  }, clStake(L)), /*#__PURE__*/React.createElement("span", {
    style: {
      flex: "none",
      padding: "2px 6px",
      borderRadius: 5,
      background: "rgba(255,255,255,.07)",
      border: "1px solid rgba(255,255,255,.14)",
      fontFamily: CL_SANS,
      fontWeight: 700,
      fontSize: 9.5,
      letterSpacing: ".14em",
      color: "#A9A9B2"
    }
  }, L.tier)), /*#__PURE__*/React.createElement("span", {
    style: {
      display: "flex",
      alignItems: "center",
      gap: 7,
      whiteSpace: "nowrap"
    }
  }, /*#__PURE__*/React.createElement("span", {
    style: {
      width: 5,
      height: 5,
      borderRadius: "50%",
      background: "#5BD96A",
      flex: "none"
    }
  }), /*#__PURE__*/React.createElement("span", {
    style: {
      fontFamily: CL_MONO,
      fontWeight: 700,
      fontSize: 11,
      color: "#fff",
      fontVariantNumeric: "tabular-nums"
    }
  }, clNum(L.players)), /*#__PURE__*/React.createElement("span", {
    style: {
      fontFamily: CL_SANS,
      fontWeight: 700,
      fontSize: 9.5,
      letterSpacing: ".14em",
      color: "#8A8A93"
    }
  }, "ONLINE"), /*#__PURE__*/React.createElement("span", {
    style: {
      width: 1,
      height: 10,
      background: "rgba(255,255,255,.16)"
    }
  }), /*#__PURE__*/React.createElement("span", {
    style: {
      fontFamily: CL_MONO,
      fontWeight: 700,
      fontSize: 11,
      color: "#D8D8DF",
      fontVariantNumeric: "tabular-nums"
    }
  }, L.tables), /*#__PURE__*/React.createElement("span", {
    style: {
      fontFamily: CL_SANS,
      fontWeight: 700,
      fontSize: 9.5,
      letterSpacing: ".14em",
      color: "#8A8A93"
    }
  }, "TABLES"))), /*#__PURE__*/React.createElement("span", {
    style: {
      flex: "none",
      display: "flex",
      flexDirection: "column",
      alignItems: "flex-end",
      gap: 4
    }
  }, /*#__PURE__*/React.createElement("span", {
    style: {
      fontFamily: CL_SANS,
      fontWeight: 700,
      fontSize: 9.5,
      letterSpacing: ".16em",
      color: "#8A8A93"
    }
  }, "BUY-IN"), /*#__PURE__*/React.createElement("span", {
    style: {
      fontFamily: CL_MONO,
      fontWeight: 700,
      fontSize: 12,
      color: "#fff",
      whiteSpace: "nowrap",
      fontVariantNumeric: "tabular-nums"
    }
  }, window.TS_MONEY.money(L.bb * 40, 1))), /*#__PURE__*/React.createElement("svg", {
    width: "15",
    height: "15",
    viewBox: "0 0 24 24",
    fill: "none",
    stroke: "rgba(255,255,255,.4)",
    strokeWidth: "2.4",
    strokeLinecap: "round",
    strokeLinejoin: "round",
    style: {
      flex: "none"
    }
  }, /*#__PURE__*/React.createElement("path", {
    d: "M9 6l6 6-6 6"
  })))))));
}
function ClBombRush({
  open,
  onClose,
  onPlay,
  accent,
  tableTile,
  disc = null,
  onDisc = null,
  balance = window.pxMoney && window.pxWallets ? window.pxMoney(window.pxWallets().usd) : "$4 827"
}) {
  const filter = "HOLD'EM"; // швидкий покер — тільки холдем
  const [info, setInfo] = React.useState(false);
  const [mounted, setMounted] = React.useState(false);
  React.useEffect(() => {
    if (!open) {
      setInfo(false);
      setMounted(false);
      return;
    }
    const r = requestAnimationFrame(() => setMounted(true));
    const f = setTimeout(() => setMounted(true), 60);
    return () => {
      cancelAnimationFrame(r);
      clearTimeout(f);
    };
  }, [open]);
  if (!open) return null;
  const bRange = (a, b) => window.TS_MONEY.range(a, b);
  const dc = (window.CL_DISC_COLOR || {})[filter] || accent;
  const label = st => ({
    fontFamily: CL_SANS,
    fontWeight: 700,
    fontSize: 10.5,
    letterSpacing: ".22em",
    color: "#A9A9B2",
    padding: "0 3px",
    marginBottom: 9,
    ...st
  });
  const infoCard = /*#__PURE__*/React.createElement("button", {
    onClick: () => {
      clClick(1100);
      setInfo(true);
    },
    style: {
      width: "100%",
      margin: "0 0 16px",
      padding: "12px 14px",
      borderRadius: 14,
      cursor: "pointer",
      textAlign: "left",
      border: `1px solid ${dc}55`,
      background: `linear-gradient(155deg,${dc}1f,#0a0a0c 70%)`,
      display: "flex",
      alignItems: "center",
      gap: 11
    }
  }, /*#__PURE__*/React.createElement("span", {
    style: {
      flex: 1,
      minWidth: 0
    }
  }, /*#__PURE__*/React.createElement("span", {
    style: {
      display: "block",
      fontFamily: CL_MONO,
      fontWeight: 700,
      fontSize: 12,
      color: "#fff",
      letterSpacing: ".06em"
    }
  }, "GAME INFO & RULES"), /*#__PURE__*/React.createElement("span", {
    style: {
      display: "block",
      fontFamily: CL_SANS,
      fontWeight: 600,
      fontSize: 10.5,
      letterSpacing: ".14em",
      color: "#A9A9B2",
      marginTop: 3
    }
  }, "FOLD & MOVE \xB7 UP TO 84 HANDS/HR")), /*#__PURE__*/React.createElement("svg", {
    width: "15",
    height: "15",
    viewBox: "0 0 24 24",
    fill: "none",
    stroke: dc,
    strokeWidth: "2.4",
    strokeLinecap: "round",
    strokeLinejoin: "round"
  }, /*#__PURE__*/React.createElement("path", {
    d: "M9 6l6 6-6 6"
  })));
  // one row per LIMIT — Bomb Rush is a pooled mode, players are not tied to a table
  const limits = (() => {
    const w = {
      "HOLD'EM": 1,
      "PLO": .72,
      "PLO5": .64,
      "PLO6": .41
    }[filter] || 1;
    const ladder = [[.5, 1], [1, 2], [2, 5], [5, 10], [10, 20], [25, 50]];
    const pool = {
      50: 34,
      20: 78,
      10: 138,
      5: 214,
      2: 326,
      1: 402
    };
    return ladder.map(([sb, bb]) => ({
      stake: sb + "/" + bb,
      sb,
      bb,
      label: clStake({
        sb,
        bb
      }),
      players: Math.max(6, Math.round(pool[bb] * w)),
      hph: bb <= 1 ? 84 : bb <= 2 ? 82 : bb <= 5 ? 76 : bb <= 10 ? 68 : bb <= 20 ? 62 : 54,
      range: window.TS_MONEY.money(bb * 40, 1)
    }));
  })();
  const joinLimit = L => {
    const pick = CL_BOMB_GROUPS.filter(g => filter === "ALL" || g.disc === filter);
    const g0 = pick[0] || CL_BOMB_GROUPS[0];
    const t = g0.tables.find(x => x.taken < x.max) || g0.tables[0];
    onPlay({
      ...g0,
      disc: filter === "ALL" ? g0.disc : filter,
      sb: L.sb,
      bb: L.bb,
      stake: L.stake,
      buyIn: L.bb * 100
    }, t);
  };
  return /*#__PURE__*/React.createElement(React.Fragment, null, /*#__PURE__*/React.createElement(ClShell, {
    title: "FAST POKER",
    info: "FAST POKER",
    accent: dc,
    mounted: mounted,
    slide: "x",
    z: 96,
    balance: balance,
    onBack: onClose,
    onClose: onClose
  }, /*#__PURE__*/React.createElement("div", {
    style: {
      position: "relative",
      zIndex: 2,
      flex: 1,
      minHeight: 0,
      overflowY: "auto",
      WebkitOverflowScrolling: "touch",
      padding: "0 14px 40px"
    }
  }, infoCard, /*#__PURE__*/React.createElement("div", {
    style: {
      display: "flex",
      flexDirection: "column",
      gap: 9
    }
  }, limits.map(L => /*#__PURE__*/React.createElement(ClLimitCard, {
    key: L.stake,
    L: L,
    accent: dc,
    onPlay: joinLimit,
    onLocked: () => {}
  }))))), /*#__PURE__*/React.createElement(ClSheet, {
    z: 130,
    open: info,
    onClose: () => setInfo(false),
    title: "FAST POKER",
    sub: "GAME INFO & RULES"
  }, /*#__PURE__*/React.createElement("div", {
    style: {
      ...label({
        marginTop: 12
      })
    }
  }, "GAME SETTINGS"), /*#__PURE__*/React.createElement("div", null, clBombGame(filter).map(r => /*#__PURE__*/React.createElement(ClSpecRow, _extends({
    key: r.k
  }, r)))), /*#__PURE__*/React.createElement("div", {
    style: {
      ...label({
        marginTop: 18
      })
    }
  }, "ON EVERY LIMIT"), /*#__PURE__*/React.createElement("div", null, clBombFeatures(filter).map(r => /*#__PURE__*/React.createElement(ClSpecRow, _extends({
    key: r.k
  }, r, {
    vc: r.v === "ON" ? "#5BD96A" : "#E0A84A"
  })))), /*#__PURE__*/React.createElement("div", {
    style: {
      ...label({
        marginTop: 18
      })
    }
  }, "FAST POKER RULES"), /*#__PURE__*/React.createElement("div", {
    style: {
      display: "flex",
      flexDirection: "column",
      gap: 9
    }
  }, [["FOLD AND YOU ARE MOVED", "Fold your hand and you are dealt in again immediately at a new table — no waiting for the round to finish."], ["YOU JOIN A LIMIT, NOT A TABLE", "Everyone playing a limit sits in one pool. The seat is picked for you, so there is never a waiting list and never an empty table."], ["THE FASTEST CASH GAME", "Up to 84 hands per hour — roughly three times a regular cash table, because you never wait for a hand you are not in."]].map(([h, b]) => /*#__PURE__*/React.createElement("div", {
    key: h,
    style: {
      padding: "12px 14px",
      borderRadius: 12,
      border: "1px solid rgba(255,255,255,.11)",
      background: "linear-gradient(155deg,#131317,#0a0a0c)"
    }
  }, /*#__PURE__*/React.createElement("div", {
    style: {
      fontFamily: CL_MONO,
      fontWeight: 700,
      fontSize: 11,
      color: "#fff",
      letterSpacing: ".08em"
    }
  }, h), /*#__PURE__*/React.createElement("div", {
    style: {
      fontFamily: CL_SANS,
      fontWeight: 500,
      fontSize: 11,
      lineHeight: 1.5,
      color: "#A9A9B2",
      marginTop: 6
    }
  }, b))))));
}

// ── the cash lobby itself ────────────────────────────────────────────────
Object.assign(window, {
  ClSheet,
  ClSpecRow
});
window.CashLobby = function CashLobby({
  open,
  onClose,
  onTourn,
  onSeated,
  onLeft,
  accent = CL_ARC,
  tableTile = "7",
  initialCat = null,
  initialDisc = null,
  initialSeat = null,
  balance = window.pxMoney && window.pxWallets ? window.pxMoney(window.pxWallets().usd) : "$4 827"
}) {
  const [mounted, setMounted] = React.useState(false);
  const [screen, setScreen] = React.useState(null); // "classic" | "bomb"
  const [cashLimit, setCashLimit] = React.useState(null); // chosen limit → all-discipline table list
  const [listFor, setListFor] = React.useState(null); // null = discipline tiles, else the chosen discipline
  const [bombFor, setBombFor] = React.useState(null); // same, for the bomb-rush path
  const [tableSel, setTableSel] = React.useState(null);
  const [spinWin, setSpinWin] = React.useState(false);
  const [spinSeat, setSpinSeat] = React.useState(false);
  const [wheelDone, setWheelDone] = React.useState(false);
  const [spinBuyIn, setSpinBuyIn] = React.useState(10);
  // одна дисципліна на обидві вкладки: перемикання вкладок нічого не міняє
  const [cashTab, setCashTab] = React.useState("ALL");
  // Правка 20: вибір вкладки запамʼятовується; стартовий дефолт (до першого
  // ручного перемикання) залежить від сегмента — мігрант з ClubGG бачить
  // «ВСЕ СТОЛЫ», новий унікальний гравець — «БЫСТРОЕ МЕНЮ».
  const [allTables, setAllTables] = React.useState(() => clStartTab());
  const [tabbed, setTabbed] = React.useState(false); // перемикали вкладки → без анімації екрана
  const [buyInFor, setBuyInFor] = React.useState(null); // buy-in sheet at the table
  if (typeof window !== "undefined") window.__cashNav = {
    screen: setScreen,
    list: setListFor,
    spin: setSpinWin
  };
  React.useEffect(() => {
    if (!open) {
      setMounted(false);
      setScreen(null);
      setListFor(null);
      setBombFor(null);
      setTableSel(null);
      setSpinWin(false);
      setSpinSeat(false);
      setWheelDone(false);
      setCashLimit(null);
      setCashTab("ALL");
      setAllTables(clStartTab());
      setTabbed(false);
      setBuyInFor(null);
      return;
    }
    setListFor(null);
    setBombFor(null);
    setTableSel(null);
    setSpinWin(false);
    setSpinSeat(false);
    setWheelDone(false);
    setBuyInFor(null);
    setTabbed(false);
    // повернення до «останньої гри» веде у швидке меню тієї дисципліни
    setAllTables(initialDisc && initialCat !== "fast" ? false : clStartTab());
    // opened from the centre menu: land on that game straight away
    if (initialCat === "spin") setSpinWin(true);else if (initialCat === "fast") {
      setScreen("bomb");
      setBombFor("HOLD'EM");
    } else {
      setScreen("cash");
      setCashLimit(null);
    }
    // resumed from HOME's "last game": land on that discipline's limits, never the felt
    if (initialDisc) {
      if (initialCat === "fast") setBombFor(initialDisc);else setCashTab(initialDisc);
    }
    const r = requestAnimationFrame(() => setMounted(true));
    const f = setTimeout(() => setMounted(true), 60);
    return () => {
      cancelAnimationFrame(r);
      clearTimeout(f);
    };
  }, [open, initialCat, initialDisc]);
  // Правка 15 · «ПОСЛЕДНЯЯ ИГРА»: садимо ГРАВЦЯ ОДРАЗУ за стіл тієї самої
  // дисципліни й ліміту — без проміжних екранів вибору. Точного живого стола
  // немає — беремо найближчий стіл тієї ж дисципліни й ліміту.
  React.useEffect(() => {
    if (!open || !initialSeat) return;
    const disc = initialSeat.disc || "HOLD'EM";
    const bb = Number(initialSeat.bb) || 2;
    const sb = Number(initialSeat.sb) || bb / 2;
    // найближчий ліміт із сітки кеш-столів
    const L = CL_CASH_LIMITS.slice().sort((a, b) => Math.abs(a.bb - bb) - Math.abs(b.bb - bb))[0] || {
      sb: sb,
      bb: bb
    };
    const seats = disc === "PLO6" ? 5 : 6;
    const t = setTimeout(() => {
      setTableSel({
        name: "TABLE " + String(10 + L.bb * 13 % 80).padStart(2, "0"),
        disc: disc,
        max: seats,
        taken: 2 + L.bb * 7 % (seats - 2),
        auto: true,
        stake: clStake(L),
        buyIn: L.bb * 100,
        fastFold: !!initialSeat.fast
      });
      setBuyInFor({
        stakes: L.sb + "/" + L.bb,
        def: L.bb * 100
      });
    }, 0);
    return () => clearTimeout(t);
  }, [open, initialSeat]);

  // routing happens in an effect, so a fresh open paints once with nothing set;
  // once routed, an empty lobby means the player backed all the way out — hand
  // control to the parent so cashOpen/cashCat reset instead of wedging.
  // NOTE: every hook must run before the `!open` bail-out below, or the hook
  // order changes the moment the lobby opens and React tears the tree down.
  const empty = !screen && !spinWin && !spinSeat && !tableSel;
  React.useEffect(() => {
    if (!open || !empty || !mounted) return;
    const t = setTimeout(() => onClose(), 0);
    return () => clearTimeout(t);
  }, [open, empty, mounted]);
  if (!open) return null;

  // one place that decides the buy-in defaults for a seated table
  const seatAt = t => {
    const bb = Number(String(t.stake || "").split("/").pop().replace(/[^0-9.]/g, "")) || 0;
    const sb = Number(String(t.stake || "").split("/")[0].replace(/[^0-9.]/g, "")) || bb / 2;
    setTableSel(t);
    if (bb > 0) setBuyInFor({
      stakes: sb + "/" + bb,
      def: t.buyIn || bb * 100
    });
  };

  // 3.5 — the app picks a free table for the limit; bomb-pot is never offered
  const autoSeat = (disc, L) => {
    const seats = disc === "PLO6" ? 5 : 6;
    const taken = 2 + L.bb * 7 % (seats - 2);
    const t = {
      name: "TABLE " + String(10 + L.bb * 13 % 80).padStart(2, "0"),
      disc,
      max: seats,
      taken,
      auto: true,
      stake: clStake(L),
      buyIn: L.bb * 100
    };
    setTableSel(t);
    setBuyInFor({
      stakes: L.sb + "/" + L.bb,
      def: L.bb * 100
    });
  };
  const playBomb = (g, t) => {
    const seated = {
      name: "TABLE " + t.name,
      max: t.max,
      auto: true,
      fastFold: true,
      stake: clStake(g),
      buyIn: g.buyIn,
      disc: g.disc
    };
    onSeated?.(seated);
    setTableSel(seated);
  };
  return /*#__PURE__*/React.createElement(React.Fragment, null, /*#__PURE__*/React.createElement(ClBombRush, {
    tableTile: tableTile,
    open: screen === "bomb",
    disc: bombFor || "HOLD'EM",
    accent: accent,
    balance: balance,
    onDisc: setBombFor,
    onClose: () => {
      setBombFor(null);
      setScreen(null);
      onClose();
    },
    onPlay: playBomb
  }), /*#__PURE__*/React.createElement(ClCashEntry, {
    open: screen === "cash" && !allTables,
    accent: accent,
    disc: cashTab,
    balance: balance,
    noAnim: tabbed,
    onDisc: d => {
      if (d) setCashTab(d);else {
        setScreen(null);
        onClose();
      }
    },
    onAllTables: () => {
      setTabbed(true);
      setAllTables(true);
      clSaveTab(true);
    },
    onPlay: (L, d) => autoSeat(d || (cashTab === "ALL" ? "HOLD'EM" : cashTab), L)
  }), window.TableListScreen && /*#__PURE__*/React.createElement(window.TableListScreen, {
    open: screen === "cash" && allTables && !tableSel,
    tile: tableTile,
    accent: cashTab === "ALL" ? CL_ARC : (window.CL_DISC_COLOR || {})[cashTab] || accent,
    title: "ALL TABLES",
    balance: balance,
    noAnim: tabbed,
    viewTabs: true,
    onQuickPick: () => {
      setTabbed(true);
      setAllTables(false);
      clSaveTab(false);
    },
    discRail: clDiscs(),
    discVal: cashTab,
    onDisc: setCashTab,
    onClose: () => {
      setScreen(null);
      onClose();
    },
    onSit: t => seatAt(t)
  }), window.SpinWinLobby && /*#__PURE__*/React.createElement(window.SpinWinLobby, {
    open: spinWin,
    accent: accent,
    balance: balance,
    onClose: () => {
      setSpinWin(false);
      onClose();
    },
    onStart: cfg => {
      const b = cfg && cfg.tier ? parseFloat(String(cfg.tier.buyIn).replace(/[^0-9.]/g, "")) : 10;
      setSpinBuyIn(b || 10);
      setSpinWin(false);
      setSpinSeat(true);
    }
  }), window.SpinGoLobby && /*#__PURE__*/React.createElement(window.SpinGoLobby, {
    open: spinSeat,
    buyIn: spinBuyIn,
    onClose: () => {
      setSpinSeat(false);
      onClose();
    },
    onReady: () => {
      setSpinSeat(false);
      setWheelDone(false);
      setTableSel({
        name: "SPIN & WIN",
        max: 3,
        auto: true,
        spin: true,
        stake: "",
        buyIn: spinBuyIn
      });
    }
  }), window.PokerTableScreen && /*#__PURE__*/React.createElement(window.PokerTableScreen, {
    open: !!tableSel,
    table: tableSel,
    autoSeat: !!(tableSel && tableSel.auto),
    queue: !!(tableSel && !tableSel.spin && !tableSel.auto && tableSel.taken >= tableSel.max),
    queuePos: tableSel ? tableSel.wait : 1,
    variant: "panel",
    tilt: !(tableSel && tableSel.spin),
    seatStyle: tableSel && tableSel.spin ? "default" : "pill",
    onBack: () => {
      if (tableSel && tableSel.auto) {
        setTableSel(null);
        setScreen(null);
        onClose();
      } else setTableSel(null);
    },
    onClose: () => {
      onLeft?.(tableSel);
      setTableSel(null);
      setScreen(null);
      onClose();
    },
    accent: accent,
    discipline: tableSel && tableSel.spin ? "HOLD'EM" : tableSel && (tableSel.disc || tableSel.discTag) || cashTab,
    stakes: tableSel ? tableSel.stake : "",
    buyIn: tableSel ? tableSel.buyIn : 0
  }), buyInFor && tableSel && window.TbBuyInSheet && /*#__PURE__*/React.createElement("div", {
    style: {
      position: "absolute",
      inset: 0,
      zIndex: 210
    }
  }, /*#__PURE__*/React.createElement(window.TbBuyInSheet, {
    stakes: buyInFor.stakes,
    defAmount: buyInFor.def,
    accent: CL_DISC_COLOR[tableSel.disc] || accent,
    onCancel: () => {
      setBuyInFor(null);
      setTableSel(null);
    },
    onConfirm: () => {
      onSeated?.(tableSel);
      setBuyInFor(null);
    }
  })), tableSel && tableSel.spin && !wheelDone && window.SpinGoWheelOverlay && /*#__PURE__*/React.createElement("div", {
    style: {
      position: "absolute",
      inset: 0,
      zIndex: 130
    }
  }, /*#__PURE__*/React.createElement(window.SpinGoWheelOverlay, {
    buyIn: spinBuyIn,
    onDone: () => setWheelDone(true)
  })));
};

// ── standalone host: FAST POKER as its own module ─────────────────────────
window.BombRushGame = function BombRushGame({
  open,
  onClose,
  accent = "#D71921",
  tableTile = "7"
}) {
  const [tableSel, setTableSel] = React.useState(null);
  React.useEffect(() => {
    if (!open) setTableSel(null);
  }, [open]);
  if (!open) return null;
  return /*#__PURE__*/React.createElement(React.Fragment, null, /*#__PURE__*/React.createElement(ClBombRush, {
    open: !tableSel,
    accent: accent,
    tableTile: tableTile,
    onClose: onClose,
    onPlay: (g, t) => setTableSel({
      name: "TABLE " + t.name,
      max: t.max,
      auto: true,
      fastFold: true,
      stake: clStake(g),
      buyIn: g.buyIn,
      disc: g.disc
    })
  }), window.PokerTableScreen && /*#__PURE__*/React.createElement(window.PokerTableScreen, {
    open: !!tableSel,
    table: tableSel,
    autoSeat: true,
    variant: "panel",
    tilt: true,
    seatStyle: "pill",
    onBack: () => setTableSel(null),
    onClose: () => setTableSel(null),
    accent: accent,
    discipline: tableSel && tableSel.disc || "HOLD'EM",
    stakes: tableSel ? tableSel.stake : "",
    buyIn: tableSel ? tableSel.buyIn : 0
  }));
};