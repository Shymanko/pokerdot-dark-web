// Play entry — Version chooser + Version 2 (discipline tile picker).
// Tapping Play in the dock opens PlayVersionPicker (two tiles):
//   • Version 1 → the existing PlayFlow (mode/discipline/stakes).
//   • Version 2 → PlayV2: a black page with three red discipline tiles
//     (Quick Poker / Classic Poker / Other formats), each launching a real table.
const PV_MONO = UI.font;
const PV_SANS = UI.fontUI;
const PV_ARC = "#D71921";
const PV_GOLD = "#f0c75e";

// ── two-tile version chooser ──────────────────────────────────────────────
window.PlayVersionPicker = function PlayVersionPicker({
  open,
  onClose,
  onPick
}) {
  const [mounted, setMounted] = React.useState(false);
  React.useEffect(() => {
    if (!open) {
      setMounted(false);
      return;
    }
    const r = requestAnimationFrame(() => setMounted(true));
    return () => cancelAnimationFrame(r);
  }, [open]);
  if (!open) return null;
  const click = n => {
    if (window.playClick) window.playClick(n, 0.05);
  };
  const Tile = ({
    tag,
    title,
    sub,
    onTap
  }) => /*#__PURE__*/React.createElement("button", {
    onClick: () => {
      click(1150);
      onTap();
    },
    style: {
      position: "relative",
      overflow: "hidden",
      textAlign: "left",
      cursor: "pointer",
      flex: "none",
      minHeight: 250,
      borderRadius: 20,
      padding: "20px 18px",
      border: `1px solid ${PV_ARC}`,
      background: `linear-gradient(157deg, ${PV_ARC} 0%, #a3121b 48%, #5e0c12 100%)`,
      boxShadow: `0 12px 30px ${PV_ARC}55`,
      display: "flex",
      flexDirection: "column",
      justifyContent: "space-between"
    }
  }, /*#__PURE__*/React.createElement("div", {
    style: {
      position: "absolute",
      inset: 0,
      backgroundImage: "radial-gradient(circle, rgba(255,255,255,.18) .8px, transparent 1.2px)",
      backgroundSize: "13px 13px",
      maskImage: "linear-gradient(150deg, black, transparent 72%)",
      WebkitMaskImage: "linear-gradient(150deg, black, transparent 72%)",
      pointerEvents: "none"
    }
  }), /*#__PURE__*/React.createElement("span", {
    style: {
      position: "relative",
      alignSelf: "flex-start",
      fontFamily: PV_MONO,
      fontWeight: 700,
      fontSize: 10.5,
      letterSpacing: ".18em",
      color: "#fff",
      background: "rgba(0,0,0,.28)",
      border: "1px solid rgba(255,255,255,.55)",
      borderRadius: 6,
      padding: "3px 9px"
    }
  }, tag), /*#__PURE__*/React.createElement("div", {
    style: {
      position: "relative",
      marginTop: 26
    }
  }, /*#__PURE__*/React.createElement("div", {
    style: {
      fontFamily: PV_MONO,
      fontWeight: 700,
      fontSize: 26,
      color: "#fff",
      letterSpacing: ".02em",
      lineHeight: 1,
      textShadow: "0 1px 6px rgba(0,0,0,.4)"
    }
  }, title), /*#__PURE__*/React.createElement("div", {
    style: {
      fontFamily: PV_SANS,
      fontWeight: 500,
      fontSize: 12,
      color: "#D8D8DF",
      marginTop: 8,
      lineHeight: 1.35
    }
  }, sub)), /*#__PURE__*/React.createElement("span", {
    style: {
      position: "relative",
      marginTop: 16,
      alignSelf: "flex-start",
      display: "inline-flex",
      alignItems: "center",
      gap: 6,
      fontFamily: PV_MONO,
      fontWeight: 700,
      fontSize: 11,
      letterSpacing: ".1em",
      color: "#fff"
    }
  }, "CHOOSE ", /*#__PURE__*/React.createElement("svg", {
    width: "14",
    height: "14",
    viewBox: "0 0 24 24",
    fill: "none",
    stroke: "#fff",
    strokeWidth: "2.6",
    strokeLinecap: "round",
    strokeLinejoin: "round"
  }, /*#__PURE__*/React.createElement("path", {
    d: "M9 6l6 6-6 6"
  }))));
  return /*#__PURE__*/React.createElement("div", {
    style: {
      position: "absolute",
      inset: 0,
      zIndex: 80,
      background: "#000",
      opacity: mounted ? 1 : 0,
      transition: "opacity 240ms ease",
      display: "flex",
      flexDirection: "column",
      padding: "62px 18px 26px",
      boxSizing: "border-box"
    }
  }, /*#__PURE__*/React.createElement("div", {
    style: {
      position: "absolute",
      inset: 0,
      pointerEvents: "none",
      backgroundImage: "radial-gradient(circle, rgba(255,255,255,.065) .6px, transparent 1px)",
      backgroundSize: "11px 11px"
    }
  }), /*#__PURE__*/React.createElement("div", {
    style: {
      position: "relative",
      display: "flex",
      alignItems: "center",
      justifyContent: "space-between"
    }
  }, /*#__PURE__*/React.createElement("button", {
    onClick: () => {
      click(900);
      onClose();
    },
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
    d: "M18 6L6 18M6 6l12 12"
  }))), /*#__PURE__*/React.createElement("span", {
    style: {
      fontFamily: PV_MONO,
      fontSize: 13,
      color: "#fff",
      letterSpacing: ".22em"
    }
  }, "INSTANT PLAY"), /*#__PURE__*/React.createElement("span", {
    style: {
      width: 36
    }
  })), /*#__PURE__*/React.createElement("div", {
    style: {
      position: "relative",
      fontFamily: PV_SANS,
      fontWeight: 500,
      fontSize: 12,
      color: "#D8D8DF",
      margin: "14px 2px 16px",
      lineHeight: 1.5
    }
  }, "Choose how you want to jump in."), /*#__PURE__*/React.createElement("div", {
    style: {
      position: "relative",
      flex: 1,
      overflowY: "auto",
      overflowX: "hidden",
      WebkitOverflowScrolling: "touch",
      display: "flex",
      flexDirection: "column",
      gap: 14,
      minHeight: 0,
      paddingBottom: 4
    }
  }, /*#__PURE__*/React.createElement(Tile, {
    tag: "VERSION 1",
    title: "CLASSIC FLOW",
    sub: "Pick mode, discipline and stakes step by step.",
    onTap: () => onPick("v1")
  }), /*#__PURE__*/React.createElement(Tile, {
    tag: "VERSION 2",
    title: "QUICK TILES",
    sub: "Jump straight in by game type \u2014 Quick, Classic or other formats.",
    onTap: () => onPick("v2")
  }), /*#__PURE__*/React.createElement(Tile, {
    tag: "VERSION 3",
    title: "TILE WHEEL",
    sub: "Spin an iOS-style wheel of game tiles, then play the centered one.",
    onTap: () => onPick("v3")
  })));
};

// ── Version 2 — discipline tile picker + downstream table launch ──────────
const V2_DISCIPLINES = [{
  id: "quick",
  name: "QUICK POKER",
  sub: "SPIN & WIN · 3-MAX",
  img: "assets/comp/spin.png",
  buyIn: 10
}, {
  id: "classic",
  name: "CLASSIC POKER",
  sub: "TEXAS HOLD'EM · CASH",
  img: "assets/comp/holdem.png",
  imgY: -16,
  stakes: "$0.05/$0.10",
  buyIn: 20
}, {
  id: "other",
  name: "OTHER FORMATS",
  sub: "SHORT DECK · PLO5 · PLO6",
  img: "assets/comp/shortdeck.png",
  stakes: "$0.10/$0.25",
  buyIn: 25
}];

// formats shown inside the OTHER FORMATS sub-screen
const OTHER_FORMATS = [{
  id: "shortdeck",
  name: "SHORT DECK",
  sub: "6+ HOLD'EM · CASH",
  img: "assets/comp/shortdeck.png",
  disc: "SHORT DECK",
  moreIdx: 4,
  stakes: "$0.10/$0.25",
  buyIn: 25
}, {
  id: "plo5",
  name: "5-CARD PLO",
  sub: "POT-LIMIT OMAHA",
  img: "assets/comp/plo5.png",
  disc: "PLO5",
  moreIdx: 2,
  stakes: "$0.10/$0.25",
  buyIn: 30
}, {
  id: "plo6",
  name: "6-CARD PLO",
  sub: "POT-LIMIT OMAHA",
  img: "assets/comp/plo6.png",
  disc: "PLO6",
  moreIdx: 3,
  stakes: "$0.25/$0.50",
  buyIn: 50
}, {
  id: "flash",
  name: "FLASH & FLUSH",
  sub: "FAST-FOLD · CASH",
  img: "assets/comp/flash.png",
  disc: "FLASH",
  moreIdx: 0,
  stakes: "$0.05/$0.10",
  buyIn: 15
}];

// ── OTHER FORMATS sub-screen — tile list with competition illustrations ──
window.OtherFormats = function OtherFormats({
  open,
  onClose,
  onPick,
  accent = PV_ARC
}) {
  const [mounted, setMounted] = React.useState(false);
  React.useEffect(() => {
    if (!open) {
      setMounted(false);
      return;
    }
    const r = requestAnimationFrame(() => setMounted(true));
    return () => cancelAnimationFrame(r);
  }, [open]);
  if (!open) return null;
  const click = n => {
    if (window.playClick) window.playClick(n, 0.05);
  };
  return /*#__PURE__*/React.createElement("div", {
    style: {
      position: "absolute",
      inset: 0,
      zIndex: 90,
      background: `radial-gradient(ellipse 110% 70% at 50% 16%, ${accent} 0%, #a3121b 46%, #5e0c12 100%)`,
      transform: mounted ? "translateX(0)" : "translateX(100%)",
      transition: "transform 320ms cubic-bezier(0.2,0.8,0.2,1)",
      display: "flex",
      flexDirection: "column"
    }
  }, /*#__PURE__*/React.createElement("div", {
    style: {
      position: "absolute",
      inset: 0,
      pointerEvents: "none",
      backgroundImage: "radial-gradient(circle, rgba(255,255,255,.1) .8px, transparent 1.2px)",
      backgroundSize: "14px 14px",
      maskImage: "linear-gradient(160deg, black, transparent 72%)",
      WebkitMaskImage: "linear-gradient(160deg, black, transparent 72%)"
    }
  }), /*#__PURE__*/React.createElement("div", {
    style: {
      position: "relative",
      zIndex: 5,
      paddingTop: 62,
      paddingLeft: 18,
      paddingRight: 18,
      display: "flex",
      alignItems: "center",
      justifyContent: "space-between"
    }
  }, /*#__PURE__*/React.createElement("button", {
    onClick: () => {
      click(900);
      onClose();
    },
    style: {
      width: 40,
      height: 40,
      borderRadius: "50%",
      background: "rgba(0,0,0,.3)",
      border: "1px solid rgba(255,255,255,.35)",
      display: "flex",
      alignItems: "center",
      justifyContent: "center",
      cursor: "pointer",
      padding: 0
    }
  }, /*#__PURE__*/React.createElement("svg", {
    width: "14",
    height: "14",
    viewBox: "0 0 24 24",
    fill: "none",
    stroke: "#fff",
    strokeWidth: "2.5",
    strokeLinecap: "round",
    strokeLinejoin: "round"
  }, /*#__PURE__*/React.createElement("path", {
    d: "M15 18l-6-6 6-6"
  }))), /*#__PURE__*/React.createElement("div", {
    style: {
      textAlign: "center"
    }
  }, /*#__PURE__*/React.createElement("div", {
    style: {
      fontFamily: PV_SANS,
      fontWeight: 700,
      fontSize: 10.5,
      color: "#D8D8DF",
      letterSpacing: ".22em",
      textShadow: "0 1px 6px rgba(0,0,0,.4)"
    }
  }, "STEP 2 / 2"), /*#__PURE__*/React.createElement("div", {
    style: {
      fontFamily: PV_MONO,
      fontSize: 22,
      fontWeight: 700,
      color: "#fff",
      letterSpacing: ".04em",
      marginTop: 5,
      textShadow: "0 1px 6px rgba(0,0,0,.4)"
    }
  }, "OTHER FORMATS")), /*#__PURE__*/React.createElement("button", {
    onClick: () => {
      click(900);
      onClose();
    },
    style: {
      width: 40,
      height: 40,
      borderRadius: "50%",
      background: "rgba(0,0,0,.3)",
      border: "1px solid rgba(255,255,255,.35)",
      display: "flex",
      alignItems: "center",
      justifyContent: "center",
      cursor: "pointer",
      padding: 0
    }
  }, /*#__PURE__*/React.createElement("svg", {
    width: "14",
    height: "14",
    viewBox: "0 0 24 24",
    fill: "none",
    stroke: "#fff",
    strokeWidth: "2.5",
    strokeLinecap: "round",
    strokeLinejoin: "round"
  }, /*#__PURE__*/React.createElement("path", {
    d: "M6 6l12 12M18 6L6 18"
  })))), /*#__PURE__*/React.createElement("div", {
    style: {
      flex: 1,
      overflowY: "auto",
      overflowX: "hidden",
      WebkitOverflowScrolling: "touch",
      position: "relative",
      zIndex: 2,
      padding: "18px 16px 40px",
      display: "flex",
      flexDirection: "column",
      justifyContent: "center",
      gap: 13
    }
  }, OTHER_FORMATS.map(d => /*#__PURE__*/React.createElement("button", {
    key: d.id,
    onClick: () => {
      click(1200);
      onPick(d);
    },
    style: {
      position: "relative",
      overflow: "hidden",
      textAlign: "left",
      cursor: "pointer",
      borderRadius: 20,
      padding: "18px 18px",
      minHeight: 116,
      border: "1px solid rgba(255,255,255,.35)",
      background: `linear-gradient(155deg, ${accent} 0%, #a3121b 50%, #5e0c12 100%)`,
      boxShadow: `0 10px 26px ${accent}55`,
      display: "flex",
      flexDirection: "column",
      justifyContent: "center"
    }
  }, /*#__PURE__*/React.createElement("div", {
    style: {
      position: "absolute",
      inset: 0,
      backgroundImage: "radial-gradient(circle, rgba(255,255,255,.13) .9px, transparent 1.3px)",
      backgroundSize: "13px 13px",
      maskImage: "linear-gradient(150deg, black, transparent 72%)",
      WebkitMaskImage: "linear-gradient(150deg, black, transparent 72%)",
      pointerEvents: "none"
    }
  }), /*#__PURE__*/React.createElement("img", {
    src: d.img,
    alt: "",
    style: {
      position: "absolute",
      width: 116,
      height: 116,
      right: 6,
      top: "calc(50% - 58px)",
      objectFit: "contain",
      opacity: .96,
      pointerEvents: "none",
      filter: "drop-shadow(0 10px 18px rgba(0,0,0,.5))",
      animation: "comp-floatA 4.5s ease-in-out infinite",
      willChange: "transform"
    }
  }), /*#__PURE__*/React.createElement("div", {
    style: {
      position: "relative",
      paddingRight: 108
    }
  }, /*#__PURE__*/React.createElement("div", {
    style: {
      fontFamily: PV_MONO,
      fontWeight: 700,
      fontSize: 21,
      color: "#fff",
      letterSpacing: ".02em",
      lineHeight: 1.05,
      textShadow: "0 1px 6px rgba(0,0,0,.4)"
    }
  }, d.name), /*#__PURE__*/React.createElement("div", {
    style: {
      fontFamily: PV_SANS,
      fontWeight: 600,
      fontSize: 11,
      color: "#D8D8DF",
      letterSpacing: ".06em",
      marginTop: 7
    }
  }, d.sub), /*#__PURE__*/React.createElement("span", {
    style: {
      display: "inline-flex",
      alignItems: "center",
      gap: 5,
      marginTop: 11,
      fontFamily: PV_MONO,
      fontWeight: 700,
      fontSize: 10.5,
      letterSpacing: ".1em",
      color: "#fff"
    }
  }, "PLAY ", /*#__PURE__*/React.createElement("svg", {
    width: "13",
    height: "13",
    viewBox: "0 0 24 24",
    fill: "none",
    stroke: "#fff",
    strokeWidth: "2.6",
    strokeLinecap: "round",
    strokeLinejoin: "round"
  }, /*#__PURE__*/React.createElement("path", {
    d: "M9 6l6 6-6 6"
  }))))))));
};

// ── The play flow — one tile per cash format, no grouping ────────────────
// Every format is a tile shown at once (no Quick / Classic / Other buckets);
// tapping one hands straight to the table-limit step. Order MUST match
// play-flow.jsx CASH_FORMATS so the entry step resolves the right format.
const FORMATS = [{
  name: "SPIN & WIN",
  sub: "HYPER TURBO · 3-MAX",
  img: "assets/comp/spin.png",
  players: 8640,
  spin: true,
  buyIn: 10
}, {
  name: "HOLD'EM",
  sub: "TEXAS HOLD'EM · CASH",
  img: "assets/comp/holdem.png",
  players: 12480
}, {
  name: "PLO 5",
  sub: "5-CARD POT-LIMIT OMAHA",
  img: "assets/comp/plo5.png",
  players: 3120
}, {
  name: "PLO 6",
  sub: "6-CARD POT-LIMIT OMAHA",
  img: "assets/comp/plo6.png",
  players: 940
}, {
  name: "SHORT DECK",
  sub: "6+ HOLD'EM · CASH",
  img: "assets/comp/shortdeck.png",
  players: 1890
}, {
  name: "FLASH & FLUSH",
  sub: "FAST-FOLD · CASH",
  img: "assets/comp/flash.png",
  players: 4530
}];
window.PlayV2 = function PlayV2({
  open,
  onClose,
  accent = PV_ARC,
  tableTile = "7"
}) {
  const [mounted, setMounted] = React.useState(false);
  const [listFor, setListFor] = React.useState(null); // format whose tables are open
  const [tableSel, setTableSel] = React.useState(null);
  const [spinWin, setSpinWin] = React.useState(false);
  const [spinSeat, setSpinSeat] = React.useState(false);
  const [wheelDone, setWheelDone] = React.useState(false);
  const [spinBuyIn, setSpinBuyIn] = React.useState(10);
  const [page, setPage] = React.useState(0);
  const pagerRef = React.useRef(null);
  React.useEffect(() => {
    if (!open) {
      setMounted(false);
      setListFor(null);
      setTableSel(null);
      setSpinWin(false);
      setSpinSeat(false);
      setWheelDone(false);
      setPage(0);
      return;
    }
    const r = requestAnimationFrame(() => setMounted(true));
    return () => cancelAnimationFrame(r);
  }, [open]);
  if (!open) return null;
  const click = n => {
    if (window.playClick) window.playClick(n, 0.05);
  };

  // no table-limit step — PLAY opens the table list of the centered format
  // (Spin & Win instead routes into its own hyper-turbo lobby)
  const pick = i => {
    click(1200);
    const f = FORMATS[i];
    if (f.spin) {
      setSpinBuyIn(f.buyIn || 10);
      setSpinWin(true);
    } else setListFor(f);
  };
  const onPager = () => {
    const el = pagerRef.current;
    if (!el) return;
    const p = Math.max(0, Math.min(FORMATS.length - 1, Math.round(el.scrollLeft / el.clientWidth)));
    if (p !== page) {
      click(950);
      setPage(p);
    }
  };
  const g = FORMATS[page];
  const goTo = i => {
    const el = pagerRef.current;
    if (el) el.scrollTo({
      left: i * el.clientWidth,
      behavior: "smooth"
    });
  };
  const arrBtn = side => ({
    position: "absolute",
    top: "36%",
    [side]: 0,
    zIndex: 4,
    width: 44,
    height: 56,
    background: "transparent",
    border: 0,
    display: "flex",
    alignItems: "center",
    justifyContent: "center",
    cursor: "pointer",
    padding: 0,
    opacity: 0.5
  });
  return /*#__PURE__*/React.createElement("div", {
    style: {
      position: "absolute",
      inset: 0,
      zIndex: 82,
      background: "#070708",
      transform: mounted ? "translateY(0)" : "translateY(100%)",
      transition: "transform 340ms cubic-bezier(0.2,0.8,0.2,1)",
      display: "flex",
      flexDirection: "column"
    }
  }, /*#__PURE__*/React.createElement("style", null, `@keyframes pv2-float{0%,100%{transform:translateY(0) rotate(-2.5deg) scale(1)}50%{transform:translateY(-14px) rotate(2.5deg) scale(1.03)}}@keyframes pv2-shadow{0%,100%{transform:translateX(-50%) scaleX(1);opacity:.8}50%{transform:translateX(-50%) scaleX(.78);opacity:.45}}@keyframes pv2-pulse{0%,100%{opacity:1}50%{opacity:.35}}`), /*#__PURE__*/React.createElement("div", {
    style: {
      position: "absolute",
      inset: 0,
      pointerEvents: "none",
      backgroundImage: "radial-gradient(circle, rgba(255,255,255,.075) .6px, transparent 1px)",
      backgroundSize: "11px 11px"
    }
  }), /*#__PURE__*/React.createElement("div", {
    style: {
      position: "absolute",
      top: 0,
      left: 0,
      right: 0,
      height: 230,
      pointerEvents: "none",
      background: `radial-gradient(ellipse 95% 75% at 50% 0%, ${accent}26, transparent 62%)`
    }
  }), /*#__PURE__*/React.createElement("div", {
    style: {
      position: "relative",
      zIndex: 5,
      paddingTop: 62,
      paddingLeft: 18,
      paddingRight: 18,
      display: "flex",
      alignItems: "center",
      justifyContent: "space-between"
    }
  }, /*#__PURE__*/React.createElement("button", {
    onClick: () => {
      click(900);
      onClose();
    },
    style: {
      width: 40,
      height: 40,
      borderRadius: "50%",
      background: "rgba(255,255,255,.13)",
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
    strokeWidth: "2.5",
    strokeLinecap: "round",
    strokeLinejoin: "round"
  }, /*#__PURE__*/React.createElement("path", {
    d: "M15 18l-6-6 6-6"
  }))), /*#__PURE__*/React.createElement("div", {
    style: {
      textAlign: "center"
    }
  }, /*#__PURE__*/React.createElement("div", {
    style: {
      fontFamily: PV_SANS,
      fontWeight: 700,
      fontSize: 10.5,
      color: "#A9A9B2",
      letterSpacing: ".22em"
    }
  }, "STEP 1 / 2"), /*#__PURE__*/React.createElement("div", {
    style: {
      fontFamily: PV_MONO,
      fontSize: 22,
      fontWeight: 700,
      color: "#fff",
      letterSpacing: ".04em",
      marginTop: 5
    }
  }, "CHOOSE A GAME")), /*#__PURE__*/React.createElement("button", {
    onClick: () => {
      click(900);
      onClose();
    },
    style: {
      width: 40,
      height: 40,
      borderRadius: "50%",
      background: "rgba(255,255,255,.13)",
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
    strokeWidth: "2.5",
    strokeLinecap: "round",
    strokeLinejoin: "round"
  }, /*#__PURE__*/React.createElement("path", {
    d: "M6 6l12 12M18 6L6 18"
  })))), /*#__PURE__*/React.createElement("div", {
    style: {
      flex: 1,
      position: "relative",
      zIndex: 2,
      minHeight: 0
    }
  }, /*#__PURE__*/React.createElement("div", {
    ref: pagerRef,
    onScroll: onPager,
    style: {
      position: "absolute",
      inset: 0,
      display: "flex",
      overflowX: "auto",
      overflowY: "hidden",
      scrollSnapType: "x mandatory",
      scrollbarWidth: "none",
      WebkitOverflowScrolling: "touch"
    }
  }, FORMATS.map(it => /*#__PURE__*/React.createElement("div", {
    key: it.name,
    style: {
      flex: "none",
      width: "100%",
      scrollSnapAlign: "start",
      display: "flex",
      flexDirection: "column",
      alignItems: "center",
      justifyContent: "center",
      boxSizing: "border-box",
      padding: "0 30px"
    }
  }, /*#__PURE__*/React.createElement("div", {
    style: {
      position: "relative",
      width: 270,
      height: 280,
      display: "flex",
      alignItems: "center",
      justifyContent: "center"
    }
  }, /*#__PURE__*/React.createElement("img", {
    src: it.img,
    alt: "",
    style: {
      position: "relative",
      width: 238,
      height: 238,
      objectFit: "contain",
      filter: `drop-shadow(0 30px 44px rgba(0,0,0,.75)) drop-shadow(0 0 26px ${accent}55)`,
      animation: "pv2-float 4.2s ease-in-out infinite"
    }
  }), /*#__PURE__*/React.createElement("div", {
    style: {
      position: "absolute",
      left: "50%",
      bottom: -18,
      width: 170,
      height: 26,
      borderRadius: "50%",
      background: "radial-gradient(ellipse, rgba(0,0,0,.85) 0%, transparent 68%)",
      animation: "pv2-shadow 4.2s ease-in-out infinite"
    }
  })), /*#__PURE__*/React.createElement("div", {
    style: {
      fontFamily: PV_MONO,
      fontWeight: 700,
      fontSize: 30,
      color: "#fff",
      letterSpacing: ".03em",
      marginTop: 18,
      textAlign: "center"
    }
  }, it.name), /*#__PURE__*/React.createElement("div", {
    style: {
      fontFamily: PV_SANS,
      fontWeight: 600,
      fontSize: 10.5,
      color: "#A9A9B2",
      letterSpacing: ".14em",
      marginTop: 9
    }
  }, it.sub), /*#__PURE__*/React.createElement("div", {
    style: {
      display: "inline-flex",
      alignItems: "center",
      gap: 8,
      marginTop: 16,
      padding: "7px 14px",
      borderRadius: 125,
      background: "rgba(255,255,255,.085)",
      border: "1px solid rgba(255,255,255,.13)"
    }
  }, /*#__PURE__*/React.createElement("span", {
    style: {
      width: 5,
      height: 5,
      borderRadius: "50%",
      background: "#5BD96A",
      animation: "pv2-pulse 1.6s ease-in-out infinite"
    }
  }), /*#__PURE__*/React.createElement("span", {
    style: {
      fontFamily: PV_MONO,
      fontWeight: 700,
      fontSize: 11,
      color: "#D8D8DF",
      letterSpacing: ".04em"
    }
  }, it.players.toLocaleString("en-US")), /*#__PURE__*/React.createElement("span", {
    style: {
      fontFamily: PV_SANS,
      fontWeight: 700,
      fontSize: 10.5,
      letterSpacing: ".16em",
      color: "#A9A9B2"
    }
  }, "PLAYING"))))), page > 0 && /*#__PURE__*/React.createElement("button", {
    onClick: () => {
      click(950);
      goTo(page - 1);
    },
    style: arrBtn("left")
  }, /*#__PURE__*/React.createElement("svg", {
    width: "22",
    height: "22",
    viewBox: "0 0 24 24",
    fill: "none",
    stroke: "#fff",
    strokeWidth: "1.8",
    strokeLinecap: "round",
    strokeLinejoin: "round"
  }, /*#__PURE__*/React.createElement("path", {
    d: "M15 18l-6-6 6-6"
  }))), page < FORMATS.length - 1 && /*#__PURE__*/React.createElement("button", {
    onClick: () => {
      click(950);
      goTo(page + 1);
    },
    style: arrBtn("right")
  }, /*#__PURE__*/React.createElement("svg", {
    width: "22",
    height: "22",
    viewBox: "0 0 24 24",
    fill: "none",
    stroke: "#fff",
    strokeWidth: "1.8",
    strokeLinecap: "round",
    strokeLinejoin: "round"
  }, /*#__PURE__*/React.createElement("path", {
    d: "M9 6l6 6-6 6"
  })))), /*#__PURE__*/React.createElement("div", {
    style: {
      position: "relative",
      zIndex: 3,
      display: "flex",
      flexDirection: "column",
      alignItems: "center",
      gap: 16,
      paddingBottom: 42
    }
  }, /*#__PURE__*/React.createElement("div", {
    style: {
      display: "flex",
      gap: 6
    }
  }, FORMATS.map((_, i) => /*#__PURE__*/React.createElement("span", {
    key: i,
    onClick: () => {
      click(950);
      goTo(i);
    },
    style: {
      width: i === page ? 22 : 5,
      height: 5,
      borderRadius: 3,
      background: i === page ? "#fff" : "rgba(255,255,255,.28)",
      transition: "all .25s",
      cursor: "pointer"
    }
  }))), /*#__PURE__*/React.createElement("button", {
    onClick: () => pick(page),
    style: {
      width: 250,
      border: 0,
      cursor: "pointer",
      fontFamily: PV_MONO,
      fontWeight: 700,
      fontSize: 14,
      letterSpacing: ".14em",
      color: "#fff",
      padding: "16px 0",
      borderRadius: 125,
      background: accent,
      boxShadow: `0 12px 30px ${accent}5c, inset 0 0 0 1px rgba(255,255,255,.16)`
    }
  }, "PLAY ", g.name, " \u203A"), /*#__PURE__*/React.createElement("span", {
    style: {
      fontFamily: PV_SANS,
      fontWeight: 700,
      fontSize: 10.5,
      letterSpacing: ".24em",
      color: "#A9A9B2"
    }
  }, "SWIPE TO BROWSE")), window.TableListScreen && /*#__PURE__*/React.createElement(window.TableListScreen, {
    open: !!listFor && !tableSel,
    tile: tableTile,
    onClose: () => setListFor(null),
    onSit: t => setTableSel(t),
    accent: accent,
    discipline: listFor ? listFor.name : "HOLD'EM"
  }), window.SpinWinLobby && /*#__PURE__*/React.createElement(window.SpinWinLobby, {
    open: spinWin,
    onClose: () => setSpinWin(false),
    onStart: () => {
      setSpinWin(false);
      setSpinSeat(true);
    },
    accent: accent
  }), window.SpinGoLobby && /*#__PURE__*/React.createElement(window.SpinGoLobby, {
    open: spinSeat,
    buyIn: spinBuyIn,
    onClose: () => setSpinSeat(false),
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
    queue: !!(tableSel && !tableSel.spin && tableSel.taken >= tableSel.max),
    queuePos: tableSel ? tableSel.wait : 1,
    variant: "panel",
    tilt: !(tableSel && tableSel.spin),
    seatStyle: tableSel && tableSel.spin ? "default" : "pill",
    onBack: () => setTableSel(null),
    onClose: () => {
      setTableSel(null);
      setListFor(null);
      onClose();
    },
    accent: accent,
    discipline: tableSel && tableSel.spin ? "HOLD'EM" : listFor ? listFor.name : "HOLD'EM",
    stakes: tableSel ? tableSel.stake : "",
    buyIn: tableSel ? tableSel.buyIn : 0
  }), tableSel && tableSel.spin && !wheelDone && window.SpinGoWheelOverlay && /*#__PURE__*/React.createElement("div", {
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

// ── Version 3 — full-page scroll-snap carousel of tiles (scroll like V1) ──
window.PlayV3 = function PlayV3({
  open,
  onClose,
  accent = PV_ARC,
  onHandoff
}) {
  const [mounted, setMounted] = React.useState(false);
  const [active, setActive] = React.useState(0);
  const [spinWin, setSpinWin] = React.useState(false);
  const [spinSeat, setSpinSeat] = React.useState(false);
  const [wheelDone, setWheelDone] = React.useState(false);
  const [tableSel, setTableSel] = React.useState(null);
  const [otherOpen, setOtherOpen] = React.useState(false);
  const [flowInit, setFlowInit] = React.useState(null);
  const [entry, setEntry] = React.useState({
    buyIn: 10,
    stakes: "$0.05/$0.10",
    disc: "HOLD'EM"
  });
  const scrollRef = React.useRef(null);
  React.useEffect(() => {
    if (!open) {
      setMounted(false);
      setSpinWin(false);
      setSpinSeat(false);
      setWheelDone(false);
      setTableSel(null);
      setActive(0);
      setOtherOpen(false);
      setFlowInit(null);
      return;
    }
    const r = requestAnimationFrame(() => setMounted(true));
    return () => cancelAnimationFrame(r);
  }, [open]);
  if (!open) return null;
  const click = n => {
    if (window.playClick) window.playClick(n, 0.05);
  };
  const pick = d => {
    click(1200);
    if (d.id === "quick") {
      setEntry({
        buyIn: d.buyIn,
        stakes: "0.05/0.10",
        disc: "HOLD'EM"
      });
      setSpinWin(true);
      return;
    }
    if (d.id === "classic") {
      setFlowInit({
        cat: 1,
        format: 0
      });
      return;
    }
    setOtherOpen(true);
  };
  const playFormat = f => {
    setOtherOpen(false);
    setFlowInit({
      cat: 2,
      format: f.moreIdx
    });
  };

  // iOS-style wheel of tiles
  const ITEM_H = 132;
  const VIEW = 3; // visible rows
  const onScroll = () => {
    const sc = scrollRef.current;
    if (!sc) return;
    const idx = Math.max(0, Math.min(V2_DISCIPLINES.length - 1, Math.round(sc.scrollTop / ITEM_H)));
    if (idx !== active) {
      click(900);
      setActive(idx);
    }
  };
  const goTo = i => {
    const sc = scrollRef.current;
    if (sc) sc.scrollTo({
      top: i * ITEM_H,
      behavior: "smooth"
    });
  };
  const padY = (VIEW * ITEM_H - ITEM_H) / 2;
  return /*#__PURE__*/React.createElement("div", {
    style: {
      position: "absolute",
      inset: 0,
      zIndex: 82,
      background: `radial-gradient(ellipse 110% 70% at 50% 16%, ${accent} 0%, #a3121b 46%, #5e0c12 100%)`,
      transform: mounted ? "translateY(0)" : "translateY(100%)",
      transition: "transform 340ms cubic-bezier(0.2,0.8,0.2,1)",
      display: "flex",
      flexDirection: "column"
    }
  }, /*#__PURE__*/React.createElement("div", {
    style: {
      position: "absolute",
      inset: 0,
      pointerEvents: "none",
      backgroundImage: "radial-gradient(circle, rgba(255,255,255,.1) .8px, transparent 1.2px)",
      backgroundSize: "14px 14px",
      maskImage: "linear-gradient(160deg, black, transparent 72%)",
      WebkitMaskImage: "linear-gradient(160deg, black, transparent 72%)",
      zIndex: 1
    }
  }), /*#__PURE__*/React.createElement("div", {
    style: {
      position: "relative",
      zIndex: 8,
      paddingTop: 62,
      paddingLeft: 18,
      paddingRight: 18,
      paddingBottom: 4,
      display: "flex",
      alignItems: "center",
      justifyContent: "space-between"
    }
  }, /*#__PURE__*/React.createElement("button", {
    onClick: () => {
      click(900);
      onClose();
    },
    style: {
      width: 40,
      height: 40,
      borderRadius: "50%",
      background: "rgba(0,0,0,.3)",
      border: "1px solid rgba(255,255,255,.35)",
      display: "flex",
      alignItems: "center",
      justifyContent: "center",
      cursor: "pointer",
      padding: 0
    }
  }, /*#__PURE__*/React.createElement("svg", {
    width: "14",
    height: "14",
    viewBox: "0 0 24 24",
    fill: "none",
    stroke: "#fff",
    strokeWidth: "2.5",
    strokeLinecap: "round",
    strokeLinejoin: "round"
  }, /*#__PURE__*/React.createElement("path", {
    d: "M15 18l-6-6 6-6"
  }))), /*#__PURE__*/React.createElement("div", {
    style: {
      textAlign: "center"
    }
  }, /*#__PURE__*/React.createElement("div", {
    style: {
      fontFamily: PV_SANS,
      fontWeight: 700,
      fontSize: 10.5,
      color: "#D8D8DF",
      letterSpacing: ".22em",
      textShadow: "0 1px 6px rgba(0,0,0,.4)"
    }
  }, "STEP 1 / 2"), /*#__PURE__*/React.createElement("div", {
    style: {
      fontFamily: PV_MONO,
      fontSize: 22,
      fontWeight: 700,
      color: "#fff",
      letterSpacing: ".04em",
      marginTop: 5,
      textShadow: "0 1px 6px rgba(0,0,0,.4)"
    }
  }, "CHOOSE A GAME")), /*#__PURE__*/React.createElement("button", {
    onClick: () => {
      click(900);
      onClose();
    },
    style: {
      width: 40,
      height: 40,
      borderRadius: "50%",
      background: "rgba(0,0,0,.3)",
      border: "1px solid rgba(255,255,255,.35)",
      display: "flex",
      alignItems: "center",
      justifyContent: "center",
      cursor: "pointer",
      padding: 0
    }
  }, /*#__PURE__*/React.createElement("svg", {
    width: "14",
    height: "14",
    viewBox: "0 0 24 24",
    fill: "none",
    stroke: "#fff",
    strokeWidth: "2.5",
    strokeLinecap: "round",
    strokeLinejoin: "round"
  }, /*#__PURE__*/React.createElement("path", {
    d: "M6 6l12 12M18 6L6 18"
  })))), /*#__PURE__*/React.createElement("div", {
    style: {
      position: "relative",
      flex: 1,
      display: "flex",
      flexDirection: "column",
      alignItems: "center",
      justifyContent: "center",
      zIndex: 2
    }
  }, /*#__PURE__*/React.createElement("div", {
    style: {
      position: "relative",
      width: 320,
      height: VIEW * ITEM_H
    }
  }, /*#__PURE__*/React.createElement("div", {
    style: {
      position: "absolute",
      top: padY,
      left: 0,
      right: 0,
      height: ITEM_H,
      pointerEvents: "none",
      zIndex: 4
    }
  }), /*#__PURE__*/React.createElement("div", {
    ref: scrollRef,
    onScroll: onScroll,
    style: {
      width: "100%",
      height: "100%",
      overflowY: "auto",
      scrollSnapType: "y mandatory",
      scrollbarWidth: "none",
      WebkitOverflowScrolling: "touch",
      maskImage: "linear-gradient(180deg, transparent 0%, #000 26%, #000 74%, transparent 100%)",
      WebkitMaskImage: "linear-gradient(180deg, transparent 0%, #000 26%, #000 74%, transparent 100%)"
    }
  }, /*#__PURE__*/React.createElement("div", {
    style: {
      paddingTop: padY,
      paddingBottom: padY
    }
  }, V2_DISCIPLINES.map((d, i) => {
    const dist = Math.abs(i - active);
    const on = dist === 0;
    const scale = on ? 1 : dist === 1 ? 0.9 : 0.82;
    const op = on ? 1 : dist === 1 ? 0.6 : 0.4;
    return /*#__PURE__*/React.createElement("div", {
      key: d.id,
      style: {
        height: ITEM_H,
        scrollSnapAlign: "center",
        display: "flex",
        alignItems: "center",
        justifyContent: "center",
        padding: "0 2px"
      }
    }, /*#__PURE__*/React.createElement("button", {
      onClick: () => {
        if (on) pick(d);else goTo(i);
      },
      style: {
        position: "relative",
        overflow: "hidden",
        textAlign: "left",
        cursor: "pointer",
        width: "100%",
        height: ITEM_H - 16,
        borderRadius: 20,
        padding: "16px 18px",
        border: on ? "1px solid rgba(255,255,255,.6)" : "1px solid rgba(255,255,255,.18)",
        background: `linear-gradient(155deg, ${accent} 0%, #a3121b 50%, #5e0c12 100%)`,
        boxShadow: on ? `0 14px 30px ${accent}66` : "0 6px 14px rgba(0,0,0,.35)",
        transform: `scale(${scale})`,
        opacity: op,
        transition: "transform .18s, opacity .18s, border-color .18s",
        display: "flex",
        flexDirection: "column",
        justifyContent: "center"
      }
    }, /*#__PURE__*/React.createElement("div", {
      style: {
        position: "absolute",
        inset: 0,
        backgroundImage: "radial-gradient(circle, rgba(255,255,255,.13) .9px, transparent 1.3px)",
        backgroundSize: "13px 13px",
        maskImage: "linear-gradient(150deg, black, transparent 72%)",
        WebkitMaskImage: "linear-gradient(150deg, black, transparent 72%)",
        pointerEvents: "none"
      }
    }), /*#__PURE__*/React.createElement("img", {
      src: d.img,
      alt: "",
      style: {
        position: "absolute",
        width: 116,
        height: 116,
        right: -6,
        top: `${d.imgY || 0}px`,
        objectFit: "contain",
        opacity: .96,
        pointerEvents: "none",
        filter: "drop-shadow(0 8px 14px rgba(0,0,0,.5))",
        animation: on ? "comp-floatA 4.5s ease-in-out infinite" : "none",
        willChange: "transform"
      }
    }), /*#__PURE__*/React.createElement("div", {
      style: {
        position: "relative",
        paddingRight: 104
      }
    }, /*#__PURE__*/React.createElement("div", {
      style: {
        fontFamily: PV_MONO,
        fontWeight: 700,
        fontSize: 21,
        color: "#fff",
        letterSpacing: ".02em",
        lineHeight: 1.05,
        textShadow: "0 1px 5px rgba(0,0,0,.4)"
      }
    }, d.name), /*#__PURE__*/React.createElement("div", {
      style: {
        fontFamily: PV_SANS,
        fontWeight: 600,
        fontSize: 10.5,
        color: "#D8D8DF",
        letterSpacing: ".06em",
        marginTop: 6
      }
    }, d.sub))));
  }))))), /*#__PURE__*/React.createElement("div", {
    style: {
      position: "relative",
      zIndex: 6,
      padding: "0 18px 30px",
      display: "flex",
      flexDirection: "column",
      alignItems: "center",
      gap: 10
    }
  }, /*#__PURE__*/React.createElement("span", {
    style: {
      fontFamily: PV_MONO,
      fontWeight: 700,
      fontSize: 11,
      letterSpacing: ".14em",
      color: "#D8D8DF"
    }
  }, V2_DISCIPLINES[active].name), /*#__PURE__*/React.createElement("button", {
    onClick: () => pick(V2_DISCIPLINES[active]),
    style: {
      width: 68,
      height: 68,
      borderRadius: "50%",
      background: "#fff",
      color: accent,
      border: 0,
      cursor: "pointer",
      display: "flex",
      alignItems: "center",
      justifyContent: "center",
      padding: 0,
      boxShadow: "0 14px 34px rgba(0,0,0,.45), 0 0 0 6px rgba(255,255,255,.18)",
      animation: "pp-pulse-ring 2.4s ease-out infinite"
    }
  }, /*#__PURE__*/React.createElement("svg", {
    width: "26",
    height: "26",
    viewBox: "0 0 24 24",
    fill: "none",
    stroke: accent,
    strokeWidth: "2.6",
    strokeLinecap: "round",
    strokeLinejoin: "round"
  }, /*#__PURE__*/React.createElement("path", {
    d: "M5 12h14M13 5l7 7-7 7"
  })))), window.PlayFlow && flowInit && /*#__PURE__*/React.createElement("div", {
    style: {
      position: "absolute",
      inset: 0,
      zIndex: 200
    }
  }, /*#__PURE__*/React.createElement(window.PlayFlow, {
    open: true,
    onClose: () => setFlowInit(null),
    initialCat: flowInit.cat,
    initialFormat: flowInit.format,
    jumpEntry: true
  })), window.OtherFormats && /*#__PURE__*/React.createElement(window.OtherFormats, {
    open: otherOpen,
    onClose: () => setOtherOpen(false),
    onPick: playFormat,
    accent: accent
  }), window.SpinWinLobby && /*#__PURE__*/React.createElement(window.SpinWinLobby, {
    open: spinWin,
    onClose: () => setSpinWin(false),
    onStart: () => {
      setSpinWin(false);
      setSpinSeat(true);
    },
    accent: accent
  }), window.SpinGoLobby && /*#__PURE__*/React.createElement(window.SpinGoLobby, {
    open: spinSeat,
    buyIn: entry.buyIn,
    onClose: () => setSpinSeat(false),
    onReady: () => {
      setSpinSeat(false);
      setWheelDone(false);
      setTableSel({
        name: "SPIN & WIN",
        max: 3,
        auto: true,
        spin: true
      });
    }
  }), window.PokerTableScreen && /*#__PURE__*/React.createElement(window.PokerTableScreen, {
    open: !!tableSel,
    table: tableSel,
    autoSeat: !!(tableSel && tableSel.auto),
    variant: "panel",
    tilt: !(tableSel && tableSel.spin),
    seatStyle: tableSel && tableSel.spin ? "default" : "pill",
    onBack: () => {
      setTableSel(null);
      onClose();
    },
    onClose: () => {
      setTableSel(null);
      onClose();
    },
    accent: accent,
    discipline: entry.disc,
    stakes: entry.stakes,
    buyIn: entry.buyIn
  }), tableSel && tableSel.spin && !wheelDone && window.SpinGoWheelOverlay && /*#__PURE__*/React.createElement("div", {
    style: {
      position: "absolute",
      inset: 0,
      zIndex: 130
    }
  }, /*#__PURE__*/React.createElement(window.SpinGoWheelOverlay, {
    buyIn: entry.buyIn,
    onDone: () => setWheelDone(true)
  })));
};