// table-ref.jsx — the felt, on OUR table theme, switchable across disciplines.
// Geometry is authored in the reference's 640×1280 space and scaled by K, so
// everything stays exact at any width. The felt itself is our own art
// (assets/felts/*.png, 1080×2160 = the same 1:2 box), one colour per discipline.

const TRF_MONO = UI.fontUI;
const TR_NUM = "Roboto, system-ui, sans-serif";
const TR_AVATAR = "assets/avatar.png";
const TR_CHIP = "assets/chip-stack.png"; // cut straight out of the reference
const TR_W = 640,
  TR_H = 1280;

// ── disciplines: felt colour · cards in hand · confirmed table sizes ────────
const TR_DISC = {
  "HOLD'EM": {
    felt: "assets/felts/green.png",
    accent: "#17925a",
    hand: 2,
    sizes: [6, 8, 9],
    blinds: "$0.01 / $0.02"
  },
  "SHORT DECK": {
    felt: "assets/felts/gold.png",
    accent: "#c2872a",
    hand: 2,
    sizes: [6, 9],
    blinds: "ANTE $0.02"
  },
  "PLO4": {
    felt: "assets/felts/blue.png",
    accent: "#2f6fd0",
    hand: 4,
    sizes: [6, 9],
    blinds: "$0.01 / $0.02"
  },
  "PLO5": {
    felt: "assets/felts/teal.png",
    accent: "#16948b",
    hand: 5,
    sizes: [6],
    blinds: "$0.01 / $0.02"
  },
  "PLO6": {
    felt: "assets/felts/purple.png",
    accent: "#6b53c9",
    hand: 6,
    sizes: [5],
    blinds: "$0.01 / $0.02"
  },
  "SPIN & WIN": {
    felt: "assets/felts/red.png",
    accent: "#D71921",
    hand: 2,
    sizes: [3],
    blinds: "$0.05 / $0.10"
  }
};
const TR_ORDER = ["HOLD'EM", "SHORT DECK", "PLO4", "PLO5", "PLO6", "SPIN & WIN"];

// seat rings — authored per confirmed table size, hero always bottom-left.
// Each seat carries its own bet spot (b), taken straight from the reference, so
// chips never wander into the readouts, the pot or the board.
const TR_SEATS = {
  5: [{
    x: 207,
    y: 208,
    b: {
      x: 240,
      y: 292
    }
  }, {
    x: 437,
    y: 208,
    b: {
      x: 406,
      y: 292
    }
  }, {
    x: 70,
    y: 470,
    b: {
      x: 171,
      y: 380
    }
  }, {
    x: 570,
    y: 470,
    b: {
      x: 466,
      y: 380
    }
  }],
  6: [{
    x: 207,
    y: 208,
    b: {
      x: 240,
      y: 292
    }
  }, {
    x: 437,
    y: 208,
    b: {
      x: 406,
      y: 292
    }
  }, {
    x: 70,
    y: 440,
    b: {
      x: 171,
      y: 372
    }
  }, {
    x: 570,
    y: 440,
    b: {
      x: 466,
      y: 372
    }
  }, {
    x: 560,
    y: 830,
    b: {
      x: 457,
      y: 780
    }
  }],
  8: [{
    x: 207,
    y: 208,
    b: {
      x: 240,
      y: 292
    }
  }, {
    x: 437,
    y: 208,
    b: {
      x: 406,
      y: 292
    }
  }, {
    x: 70,
    y: 372,
    b: {
      x: 171,
      y: 378
    }
  }, {
    x: 570,
    y: 372,
    b: {
      x: 466,
      y: 378
    }
  }, {
    x: 70,
    y: 540,
    b: {
      x: 171,
      y: 528
    }
  }, {
    x: 570,
    y: 540,
    b: {
      x: 466,
      y: 528
    }
  }, {
    x: 566,
    y: 832,
    b: {
      x: 457,
      y: 780
    }
  }],
  9: [{
    x: 207,
    y: 208,
    b: {
      x: 240,
      y: 292
    }
  }, {
    x: 437,
    y: 208,
    b: {
      x: 406,
      y: 292
    }
  }, {
    x: 70,
    y: 362,
    b: {
      x: 171,
      y: 372
    }
  }, {
    x: 570,
    y: 362,
    b: {
      x: 466,
      y: 372
    }
  }, {
    x: 70,
    y: 520,
    b: {
      x: 171,
      y: 530
    }
  }, {
    x: 570,
    y: 520,
    b: {
      x: 466,
      y: 530
    }
  }, {
    x: 72,
    y: 832,
    b: {
      x: 183,
      y: 780
    }
  }, {
    x: 566,
    y: 832,
    b: {
      x: 457,
      y: 780
    }
  }]
};
const TR_HERO = {
  x: 112,
  y: 1050
};
const TR_RANKS = ["A", "K", "Q", "J", "10", "9", "8", "7", "6", "5", "4", "3", "2"];
const TR_SUITS = ["spade", "heart", "diamond", "club"];
const trPip = {
  spade: "♠",
  heart: "♥",
  diamond: "♦",
  club: "♣"
};
function trHand(n, seed) {
  const out = [];
  for (let i = 0; i < n; i++) {
    const r = TR_RANKS[(seed * 7 + i * 5) % TR_RANKS.length];
    const s = TR_SUITS[(seed * 3 + i * 2) % 4];
    out.push({
      r,
      s
    });
  }
  return out;
}

// ── card back ──────────────────────────────────────────────────────────────
function TrBack({
  w,
  h,
  tone,
  style
}) {
  return /*#__PURE__*/React.createElement("span", {
    style: Object.assign({
      display: "block",
      width: w,
      height: h,
      borderRadius: h * 0.09,
      boxSizing: "border-box",
      border: `${Math.max(1.2, h * 0.032)}px solid #f4f4f4`,
      background: `repeating-linear-gradient(48deg, ${tone[0]} 0 ${h * 0.07}px, ${tone[1]} ${h * 0.07}px ${h * 0.14}px)`,
      boxShadow: "0 3px 7px rgba(0,0,0,.55)"
    }, style || {})
  });
}
// n backs, overlapped so the fan always fits the plate width
function TrBackFan({
  n,
  w,
  h,
  tone,
  style
}) {
  const step = n <= 2 ? w * 0.66 : w * 1.55 / (n - 1);
  return /*#__PURE__*/React.createElement("span", {
    style: Object.assign({
      position: "relative",
      display: "block",
      width: w + step * (n - 1),
      height: h
    }, style || {})
  }, Array.from({
    length: n
  }, (_, i) => /*#__PURE__*/React.createElement(TrBack, {
    key: i,
    w: w,
    h: h,
    tone: tone,
    style: {
      position: "absolute",
      left: i * step,
      top: 0
    }
  })));
}

// ── face-up card ───────────────────────────────────────────────────────────
function TrCard({
  r,
  s,
  w,
  h
}) {
  const red = s === "heart" || s === "diamond";
  return /*#__PURE__*/React.createElement("span", {
    style: {
      position: "relative",
      display: "block",
      width: w,
      height: h,
      borderRadius: h * 0.06,
      background: "#f4f4f4",
      boxShadow: "0 4px 8px rgba(0,0,0,.45)",
      overflow: "hidden",
      flex: "none"
    }
  }, /*#__PURE__*/React.createElement("span", {
    style: {
      position: "absolute",
      left: w * 0.09,
      top: h * 0.02,
      fontFamily: TR_NUM,
      fontWeight: 700,
      fontSize: h * 0.33,
      lineHeight: 1.15,
      color: red ? "#c9161f" : "#0a0a0a"
    }
  }, r), /*#__PURE__*/React.createElement("span", {
    style: {
      position: "absolute",
      left: 0,
      right: 0,
      bottom: h * 0.04,
      textAlign: "center",
      fontSize: h * 0.42,
      lineHeight: 1,
      color: red ? "#c9161f" : "#0a0a0a"
    }
  }, trPip[s]));
}

// ── chip stack + bet value ─────────────────────────────────────────────────
function TrBet({
  x,
  y,
  amount,
  K
}) {
  return /*#__PURE__*/React.createElement("span", {
    style: {
      position: "absolute",
      left: x * K,
      top: y * K,
      transform: "translate(-50%,-50%)",
      display: "flex",
      flexDirection: "column",
      alignItems: "center",
      gap: 2 * K
    }
  }, /*#__PURE__*/React.createElement("img", {
    src: TR_CHIP,
    alt: "",
    style: {
      display: "block",
      width: 34 * K,
      height: 35 * K,
      filter: "drop-shadow(0 2px 3px rgba(0,0,0,.55))"
    }
  }), /*#__PURE__*/React.createElement("span", {
    style: {
      padding: `${3.5 * K}px ${13 * K}px`,
      borderRadius: 125,
      background: "rgba(6,8,8,.66)",
      fontFamily: TR_NUM,
      fontWeight: 700,
      fontSize: 26 * K,
      lineHeight: 1.15,
      color: "#fff"
    }
  }, amount));
}

// ── flag (UAE placeholder — swap per player later) ─────────────────────────
function TrFlag({
  w,
  h,
  K
}) {
  return /*#__PURE__*/React.createElement("span", {
    style: {
      position: "relative",
      width: w,
      height: h,
      borderRadius: 3 * K,
      overflow: "hidden",
      border: `${2 * K}px solid #0c0c0e`
    }
  }, /*#__PURE__*/React.createElement("span", {
    style: {
      position: "absolute",
      inset: 0,
      display: "flex",
      flexDirection: "column"
    }
  }, /*#__PURE__*/React.createElement("span", {
    style: {
      flex: 1,
      background: "#00732f"
    }
  }), /*#__PURE__*/React.createElement("span", {
    style: {
      flex: 1,
      background: "#fff"
    }
  }), /*#__PURE__*/React.createElement("span", {
    style: {
      flex: 1,
      background: "#000"
    }
  })), /*#__PURE__*/React.createElement("span", {
    style: {
      position: "absolute",
      left: 0,
      top: 0,
      bottom: 0,
      width: "28%",
      background: "#ce1126"
    }
  }));
}

// ── opponent seat ──────────────────────────────────────────────────────────
function TrSeat({
  x,
  y,
  p,
  hand,
  tone,
  K,
  onTap
}) {
  const pw = 132,
    ph = 56;
  const cardW = hand <= 2 ? 62 : hand <= 4 ? 46 : 38;
  return /*#__PURE__*/React.createElement("span", {
    onClick: e => {
      e.stopPropagation();
      if (onTap) {
        if (window.playClick) window.playClick(1150, .035);
        onTap(p);
      }
    },
    style: {
      position: "absolute",
      left: x * K,
      top: y * K,
      transform: "translate(-50%,-50%)",
      width: pw * K,
      cursor: onTap ? "pointer" : "default"
    }
  }, /*#__PURE__*/React.createElement(TrBackFan, {
    n: hand,
    w: cardW * K,
    h: 84 * K,
    tone: tone,
    style: {
      position: "absolute",
      left: "50%",
      bottom: ph * K * 0.62,
      transform: "translateX(-50%)"
    }
  }), /*#__PURE__*/React.createElement("span", {
    style: {
      position: "relative",
      display: "block",
      width: "100%",
      boxSizing: "border-box",
      borderRadius: 12 * K,
      padding: `${7 * K}px ${8 * K}px ${9 * K}px`,
      background: "linear-gradient(180deg,#26262b,#16161a)",
      boxShadow: "0 4px 10px rgba(0,0,0,.55)",
      textAlign: "center"
    }
  }, /*#__PURE__*/React.createElement("span", {
    style: {
      display: "block",
      fontFamily: TRF_MONO,
      fontWeight: 600,
      fontSize: 23 * K,
      lineHeight: 1.2,
      color: "#fff",
      whiteSpace: "nowrap",
      overflow: "hidden",
      textOverflow: "ellipsis"
    }
  }, p.nick), /*#__PURE__*/React.createElement("span", {
    style: {
      display: "block",
      fontFamily: TR_NUM,
      fontWeight: 700,
      fontSize: 26 * K,
      lineHeight: 1.2,
      color: "#f0c75e",
      whiteSpace: "nowrap"
    }
  }, "$ ", p.stack), /*#__PURE__*/React.createElement("span", {
    style: {
      position: "absolute",
      left: 8 * K,
      right: 8 * K,
      bottom: -1 * K,
      height: 5 * K,
      borderRadius: 125,
      background: "rgba(255,255,255,.14)",
      overflow: "hidden"
    }
  }, /*#__PURE__*/React.createElement("span", {
    style: {
      display: "block",
      height: "100%",
      width: (p.bar || 78) + "%",
      background: "#43c65a"
    }
  })), /*#__PURE__*/React.createElement("span", {
    style: {
      position: "absolute",
      left: -6 * K,
      top: -18 * K,
      width: 34 * K,
      height: 34 * K,
      borderRadius: "50%",
      background: "#1b1b1f",
      border: `${2 * K}px solid #3a3a40`,
      display: "flex",
      alignItems: "center",
      justifyContent: "center",
      fontFamily: TR_NUM,
      fontWeight: 700,
      fontSize: 19 * K,
      color: "#fff"
    }
  }, p.vpip), /*#__PURE__*/React.createElement("span", {
    style: {
      position: "absolute",
      right: -2 * K,
      top: -14 * K
    }
  }, /*#__PURE__*/React.createElement(TrFlag, {
    w: 30 * K,
    h: 21 * K,
    K: K
  }))));
}

// ── top chrome — the reference strip itself; only the hand pill is live so the
// cards match the discipline (the strip's own pill sits underneath it).
const TR_BAR = "assets/table-topbar.png";
function TrChrome({
  hand,
  accent,
  K
}) {
  const many = hand.length > 4;
  const fs = many ? 16 : 19; // rank
  const ps = many ? 14 : 17; // pip
  return /*#__PURE__*/React.createElement(React.Fragment, null, null);
}

// ── the felt screen ────────────────────────────────────────────────────────
function PokerTableRef({
  width = 430,
  disc = "HOLD'EM",
  max,
  stakes,
  tourney = null,
  onSeatTap = null,
  onBoardTap = null
}) {
  const cfg = TR_DISC[disc] || TR_DISC["HOLD'EM"];
  const seatMax = cfg.sizes.indexOf(max) >= 0 ? max : cfg.sizes[cfg.sizes.length - 1];
  const K = width / TR_W;
  const H = TR_H * K;
  const accent = cfg.accent;
  const seats = TR_SEATS[seatMax] || TR_SEATS[6];
  const board = [["A", "club"], ["2", "club"], ["3", "club"], ["4", "club"], ["5", "club"]];
  const P = {
    nick: "ripe_sna",
    stack: "9,999",
    vpip: 32,
    bar: 78
  }; // шаблон опонента
  const heroHand = trHand(cfg.hand, 4);
  const backTone = ["#3a3a44", "#232329"];

  // one button shape for the whole bar: same box, same two-line grid, so the
  // labels sit on one baseline whether or not the button carries an amount
  const actBtn = (label, sub, tone, onTap) => /*#__PURE__*/React.createElement("span", {
    onClick: onTap,
    style: {
      flex: 1,
      height: 72 * K,
      borderRadius: 125,
      boxSizing: "border-box",
      cursor: "pointer",
      background: tone === "hot" ? accent : "#191a1d",
      border: `${1.4 * K}px solid ${tone === "hot" ? "rgba(255,255,255,.5)" : "#33333a"}`,
      boxShadow: tone === "hot" ? `0 ${6 * K}px ${18 * K}px ${accent}66` : "none",
      display: "grid",
      gridTemplateRows: "1fr 1fr",
      alignItems: "center",
      justifyItems: "center",
      padding: `${6 * K}px 0`
    }
  }, /*#__PURE__*/React.createElement("span", {
    style: {
      fontFamily: TRF_MONO,
      fontWeight: 700,
      fontSize: 25 * K,
      letterSpacing: ".06em",
      color: "#fff",
      lineHeight: 1
    }
  }, label), /*#__PURE__*/React.createElement("span", {
    style: {
      fontFamily: TR_NUM,
      fontWeight: 700,
      fontSize: 25 * K,
      lineHeight: 1,
      color: tone === "hot" ? "#fff" : "#f0c75e",
      opacity: sub ? 1 : 0
    }
  }, sub || "0"));
  return /*#__PURE__*/React.createElement("div", {
    "data-table-shot": "1",
    style: {
      position: "relative",
      width: width,
      height: H,
      background: "#050506",
      overflow: "hidden",
      fontFamily: TRF_MONO,
      userSelect: "none"
    }
  }, /*#__PURE__*/React.createElement("img", {
    src: cfg.felt,
    alt: "",
    style: {
      position: "absolute",
      left: -88 * K,
      top: -78 * K,
      width: 815 * K,
      height: 1348 * K,
      pointerEvents: "none"
    }
  }), /*#__PURE__*/React.createElement(TrChrome, {
    hand: heroHand,
    accent: accent,
    K: K
  }), /*#__PURE__*/React.createElement("span", {
    style: {
      position: "absolute",
      left: "50%",
      top: 436 * K,
      transform: "translateX(-50%)",
      whiteSpace: "nowrap",
      fontFamily: TRF_MONO,
      fontWeight: 600,
      fontSize: 25 * K,
      lineHeight: 1,
      letterSpacing: ".02em",
      color: "#D8D8DF",
      textShadow: "0 2px 6px rgba(0,0,0,.5)"
    }
  }, disc, " ", stakes || cfg.blinds), /*#__PURE__*/React.createElement("span", {
    style: {
      position: "absolute",
      left: "50%",
      top: 480 * K,
      transform: "translateX(-50%)",
      whiteSpace: "nowrap",
      fontFamily: TRF_MONO,
      fontWeight: 600,
      fontSize: 21 * K,
      lineHeight: 1,
      color: "#A9A9B2"
    }
  }, seatMax, "-MAX"), /*#__PURE__*/React.createElement("span", {
    style: {
      position: "absolute",
      left: "50%",
      top: 522 * K,
      transform: "translateX(-50%)",
      width: 162 * K,
      borderRadius: 125,
      padding: `${6 * K}px 0 ${9 * K}px`,
      background: "rgba(0,0,0,.34)",
      textAlign: "center"
    }
  }, /*#__PURE__*/React.createElement("span", {
    style: {
      display: "block",
      fontFamily: TRF_MONO,
      fontWeight: 600,
      fontSize: 19 * K,
      letterSpacing: ".12em",
      color: "#D8D8DF"
    }
  }, "POT"), /*#__PURE__*/React.createElement("span", {
    style: {
      display: "block",
      fontFamily: TR_NUM,
      fontWeight: 700,
      fontSize: 32 * K,
      lineHeight: 1.05,
      color: "#fff"
    }
  }, "564")), /*#__PURE__*/React.createElement("span", {
    onClick: () => {
      if (!onBoardTap) return;
      if (window.playClick) window.playClick(1150, .035);
      onBoardTap({
        board: board.map(([r, s2]) => ({
          r,
          s: s2
        })),
        hole: heroHand
      });
    },
    style: {
      position: "absolute",
      left: "50%",
      top: 600 * K,
      transform: "translateX(-50%)",
      display: "flex",
      gap: 8 * K,
      cursor: onBoardTap ? "pointer" : "default",
      padding: 6 * K,
      margin: -6 * K
    }
  }, board.map(([r, s2], i) => /*#__PURE__*/React.createElement(TrCard, {
    key: i,
    r: r,
    s: s2,
    w: 84 * K,
    h: 124 * K
  }))), seats.map((s, i) => /*#__PURE__*/React.createElement(TrSeat, {
    key: i,
    x: s.x,
    y: s.y,
    p: Object.assign({}, P, {
      seat: i + 1
    }),
    hand: cfg.hand,
    tone: backTone,
    K: K,
    onSeatTap: onSeatTap,
    onTap: onSeatTap
  })), seats.map((s, i) => /*#__PURE__*/React.createElement(TrBet, {
    key: "b" + i,
    x: s.b.x,
    y: s.b.y,
    amount: "30",
    K: K
  })), /*#__PURE__*/React.createElement(TrBet, {
    x: 222,
    y: 958,
    amount: "30",
    K: K
  }), /*#__PURE__*/React.createElement("span", {
    onClick: () => {
      if (onSeatTap) {
        if (window.playClick) window.playClick(1150, .035);
        onSeatTap({
          nick: "SASHA02",
          stack: "9,999",
          vpip: 32,
          you: true
        });
      }
    },
    style: {
      position: "absolute",
      left: TR_HERO.x * K,
      top: TR_HERO.y * K,
      transform: "translate(-50%,-50%)",
      width: 160 * K,
      cursor: onSeatTap ? "pointer" : "default"
    }
  }, /*#__PURE__*/React.createElement("span", {
    style: {
      position: "absolute",
      left: "50%",
      bottom: 44 * K,
      transform: "translateX(-50%)",
      width: 148 * K,
      height: 148 * K,
      borderRadius: "50%",
      overflow: "visible",
      border: `${3 * K}px solid #45454c`,
      background: "radial-gradient(circle at 50% 35%, #3a3a44, #14141a)"
    }
  }, /*#__PURE__*/React.createElement("img", {
    src: TR_AVATAR,
    alt: "",
    style: {
      width: "100%",
      height: "100%",
      objectFit: "cover",
      filter: "brightness(1.45) contrast(1.05)",
      borderRadius: "50%"
    }
  }), window.LegendFrameOverlay && /*#__PURE__*/React.createElement(window.LegendFrameOverlay, null)), /*#__PURE__*/React.createElement("span", {
    style: {
      position: "relative",
      display: "block",
      width: "100%",
      boxSizing: "border-box",
      borderRadius: 12 * K,
      padding: `${7 * K}px ${8 * K}px ${9 * K}px`,
      background: "linear-gradient(180deg,#26262b,#16161a)",
      boxShadow: "0 4px 10px rgba(0,0,0,.55)",
      textAlign: "center"
    }
  }, /*#__PURE__*/React.createElement("span", {
    style: {
      display: "block",
      fontFamily: TRF_MONO,
      fontWeight: 600,
      fontSize: 25 * K,
      lineHeight: 1.2,
      color: "#fff"
    }
  }, "SASHA02"), /*#__PURE__*/React.createElement("span", {
    style: {
      display: "block",
      fontFamily: TR_NUM,
      fontWeight: 700,
      fontSize: 28 * K,
      lineHeight: 1.2,
      color: "#f0c75e"
    }
  }, "$ 9,999"), /*#__PURE__*/React.createElement("span", {
    style: {
      position: "absolute",
      left: 8 * K,
      right: 8 * K,
      bottom: -6 * K,
      height: 6 * K,
      borderRadius: 125,
      background: "rgba(255,255,255,.14)",
      overflow: "hidden"
    }
  }, /*#__PURE__*/React.createElement("span", {
    style: {
      display: "block",
      height: "100%",
      width: "78%",
      background: "#43c65a"
    }
  })), /*#__PURE__*/React.createElement("span", {
    style: {
      position: "absolute",
      left: -10 * K,
      top: -22 * K,
      width: 40 * K,
      height: 40 * K,
      borderRadius: "50%",
      background: "#1b1b1f",
      border: `${2 * K}px solid #3a3a40`,
      display: "flex",
      alignItems: "center",
      justifyContent: "center",
      fontFamily: TR_NUM,
      fontWeight: 700,
      fontSize: 21 * K,
      color: "#fff"
    }
  }, "32"), /*#__PURE__*/React.createElement("span", {
    style: {
      position: "absolute",
      right: 2 * K,
      top: -18 * K
    }
  }, /*#__PURE__*/React.createElement(TrFlag, {
    w: 32 * K,
    h: 22 * K,
    K: K
  })))), /*#__PURE__*/React.createElement("span", {
    style: {
      position: "absolute",
      right: 20 * K,
      top: 902 * K,
      width: 200 * K,
      display: "flex",
      flexDirection: "column",
      gap: 12 * K
    }
  }, ["33%", "50%", "POT"].map((lab, i) => /*#__PURE__*/React.createElement("span", {
    key: i,
    style: {
      height: 66 * K,
      borderRadius: 125,
      background: "#191a1d",
      border: `${1.4 * K}px solid #33333a`,
      display: "grid",
      gridTemplateRows: "1fr 1fr",
      alignItems: "center",
      justifyItems: "center",
      padding: `${5 * K}px 0`,
      cursor: "pointer"
    }
  }, /*#__PURE__*/React.createElement("span", {
    style: {
      fontFamily: TRF_MONO,
      fontWeight: 600,
      fontSize: 21 * K,
      color: "#A9A9B2",
      lineHeight: 1
    }
  }, lab), /*#__PURE__*/React.createElement("span", {
    style: {
      fontFamily: TR_NUM,
      fontWeight: 700,
      fontSize: 27 * K,
      lineHeight: 1,
      color: "#f0c75e"
    }
  }, [416, 630, 1128][i])))), /*#__PURE__*/React.createElement("span", {
    style: {
      position: "absolute",
      left: 258 * K,
      top: 1108 * K,
      width: 50 * K,
      height: 50 * K,
      borderRadius: "50%",
      background: "#191a1d",
      border: `${1.4 * K}px solid #33333a`,
      display: "flex",
      alignItems: "center",
      justifyContent: "center",
      cursor: "pointer"
    }
  }, /*#__PURE__*/React.createElement("span", {
    style: {
      display: "grid",
      gridTemplateColumns: "repeat(3, 1fr)",
      gap: 2.6 * K
    }
  }, Array.from({
    length: 9
  }, (_, i) => /*#__PURE__*/React.createElement("span", {
    key: i,
    style: {
      width: 4.6 * K,
      height: 4.6 * K,
      borderRadius: 1,
      background: "#fff"
    }
  })))), /*#__PURE__*/React.createElement("span", {
    style: {
      position: "absolute",
      left: 336 * K,
      top: 1108 * K,
      width: 50 * K,
      height: 50 * K,
      borderRadius: "50%",
      background: "#191a1d",
      border: `${1.4 * K}px solid #33333a`,
      display: "flex",
      alignItems: "center",
      justifyContent: "center",
      cursor: "pointer"
    }
  }, /*#__PURE__*/React.createElement("svg", {
    width: 24 * K,
    height: 24 * K,
    viewBox: "0 0 24 24",
    fill: "none",
    stroke: "#f0c75e",
    strokeWidth: "2.6",
    strokeLinecap: "round",
    strokeLinejoin: "round"
  }, /*#__PURE__*/React.createElement("path", {
    d: "M6 15l6-6 6 6"
  }))), /*#__PURE__*/React.createElement("span", {
    style: {
      position: "absolute",
      left: 12 * K,
      right: 12 * K,
      top: 1182 * K,
      display: "flex",
      gap: 10 * K
    }
  }, actBtn("FOLD", null), actBtn("CALL", "150"), actBtn("RAISE", "416", "hot", () => {
    if (window.playClick) window.playClick(1500, .05);
    // a tournament table pays out the whole run; a cash table pays the pot
    if (tourney && window.showTourneyResult) {
      window.showTourneyResult(tourney);
      return;
    }
    if (window.showTableWin) window.showTableWin({
      pot: "$1 128",
      profit: "+$742",
      hand: "FULL HOUSE, ACES OVER NINES",
      disc: disc,
      stake: cfg.blinds.replace(/\s*\/\s*/, " / "),
      table: "TABLE 271",
      players: String(seatMax),
      accent: accent
    });
  })));
}
Object.assign(window, {
  PokerTableRef,
  TR_DISC,
  TR_ORDER,
  TR_SEATS,
  TrCard,
  TrBack,
  TrBackFan,
  TrSeat,
  TrBet
});