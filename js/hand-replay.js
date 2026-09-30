// Hand replay — reproduces the reference hand-history screen using the app's
// own table elements (dark felt, gold-balance pill seats, white cards). Layout:
//  • top: mini felt with final board + seated players + winner + dealer
//  • middle: 5 equal columns FILLING the width (BLINDS · PREFLOP · FLOP · TURN ·
//    RIVER), each a vertical action/equity ledger; the page scrolls vertically
//  • bottom: a step scrubber (n / total) with prev / next
// Sizing/structure mirror the reference; styling stays on-brand (Arcanium).

const HR_MONO = UI.font;
const HR_SANS = UI.fontUI;
const HR_GREEN = "#5BD96A";
const HR_GOLD = "#f0c75e";

// hands (exact to reference)
const JT = [{
  r: "J",
  s: "diamond"
}, {
  r: "10",
  s: "diamond"
}]; // Shymanko (hero)
const A9 = [{
  r: "A",
  s: "spade"
}, {
  r: "9",
  s: "spade"
}]; // Artmydr10 (winner)
const T9 = [{
  r: "10",
  s: "diamond"
}, {
  r: "9",
  s: "diamond"
}]; // Panda11-11
const HR_BOARD = [{
  r: "5",
  s: "heart"
}, {
  r: "9",
  s: "diamond"
}, {
  r: "Q",
  s: "heart"
}, {
  r: "10",
  s: "heart"
}, {
  r: "A",
  s: "club"
}];
const HR_SEATS = [{
  name: "Artmydr10",
  bal: "175.42",
  cards: A9,
  win: true,
  pos: {
    top: "4%",
    left: "6%"
  }
}, {
  name: "leprekon71",
  bal: "66.77",
  fold: true,
  pos: {
    top: "4%",
    right: "6%"
  }
}, {
  name: "David Nosulich",
  bal: "69.26",
  fold: true,
  pos: {
    top: "46%",
    left: "1%"
  }
}, {
  name: "Panda11-11",
  bal: "86",
  cards: T9,
  dealer: true,
  pos: {
    top: "46%",
    right: "1%"
  }
}];

// the five street columns (action ledger + all-in equity), exact to reference
const HR_COLS = [{
  name: "BLINDS",
  sub: "(ANTE)",
  pot: null,
  items: [{
    t: "act",
    who: "David Nosulich",
    pos: "SB",
    act: "SB",
    amt: "0.50"
  }, {
    t: "act",
    who: "Artmydr10",
    pos: "BB",
    act: "BB",
    amt: "1"
  }]
}, {
  name: "PREFLOP",
  pot: "1.50",
  items: [{
    t: "act",
    who: "leprekon71",
    pos: "UTG",
    act: "Fold",
    fold: true
  }, {
    t: "act",
    who: "Panda11-11",
    pos: "CO",
    act: "Call",
    amt: "1"
  }, {
    t: "act",
    who: "Shymanko",
    pos: "BTN",
    act: "Raise · All-in",
    amt: "89.33",
    raise: true,
    you: true
  }, {
    t: "act",
    who: "David Nosulich",
    pos: "SB",
    act: "Fold",
    fold: true
  }, {
    t: "act",
    who: "Artmydr10",
    pos: "BB",
    act: "Call",
    amt: "88.33",
    call: true
  }, {
    t: "act",
    who: "Panda11-11",
    pos: "CO",
    act: "Fold",
    fold: true
  }, {
    t: "eq",
    who: "Shymanko",
    cards: JT,
    pct: "44.42%",
    you: true
  }, {
    t: "eq",
    who: "Artmydr10",
    cards: A9,
    pct: "55.56%"
  }]
}, {
  name: "FLOP",
  pot: "180.16",
  board: [0, 1, 2],
  items: [{
    t: "eq",
    who: "Shymanko",
    cards: JT,
    pct: "50%",
    you: true
  }, {
    t: "eq",
    who: "Artmydr10",
    cards: A9,
    pct: "50%"
  }]
}, {
  name: "TURN",
  pot: "180.16",
  board: [3],
  items: [{
    t: "eq",
    who: "Shymanko",
    cards: JT,
    pct: "88.63%",
    you: true,
    lead: true
  }, {
    t: "eq",
    who: "Artmydr10",
    cards: A9,
    pct: "11.36%"
  }]
}, {
  name: "RIVER",
  pot: "180.16",
  board: [4],
  items: [{
    t: "eq",
    who: "Shymanko",
    cards: JT,
    pct: "0%",
    you: true
  }, {
    t: "eq",
    who: "Artmydr10",
    cards: A9,
    pct: "100%",
    win: "WINS 180.16"
  }]
}];
function hrColor(name) {
  return `hsl(${(name.length * 53 + name.charCodeAt(0) * 3) % 360} 42% 32%)`;
}
function HrAv({
  name,
  size = 20,
  ring
}) {
  return /*#__PURE__*/React.createElement("span", {
    style: {
      width: size,
      height: size,
      borderRadius: "50%",
      flex: "none",
      background: hrColor(name),
      border: ring ? `1.5px solid ${ring}` : "1px solid rgba(255,255,255,.2)",
      display: "flex",
      alignItems: "center",
      justifyContent: "center",
      fontFamily: HR_MONO,
      fontWeight: 700,
      fontSize: size * 0.44,
      color: "#fff"
    }
  }, name[0].toUpperCase());
}
// white playing-card face, matching the table's TbCard look (corner rank + centre pip)
function HrCard({
  r,
  s,
  w = 26,
  blank
}) {
  const Suit = window.Suit;
  const h = Math.round(w * 1.4);
  if (blank) {
    return /*#__PURE__*/React.createElement("span", {
      style: {
        width: w,
        height: h,
        borderRadius: Math.max(2.5, w * 0.12),
        background: "rgba(255,255,255,.07)",
        border: "1px solid rgba(255,255,255,.1)",
        display: "inline-flex",
        flex: "none"
      }
    });
  }
  const red = s === "heart" || s === "diamond";
  const col = red ? "#D71921" : "#0a0a0c";
  return /*#__PURE__*/React.createElement("span", {
    style: {
      position: "relative",
      width: w,
      height: h,
      borderRadius: Math.max(2.5, w * 0.12),
      background: "#fff",
      boxShadow: "0 1px 3px rgba(0,0,0,.5)",
      display: "inline-flex",
      flex: "none",
      overflow: "hidden"
    }
  }, /*#__PURE__*/React.createElement("span", {
    style: {
      position: "absolute",
      top: h * 0.04,
      left: w * 0.12,
      fontFamily: HR_MONO,
      fontWeight: 700,
      fontSize: w * 0.42,
      color: col,
      lineHeight: 1
    }
  }, r), Suit && /*#__PURE__*/React.createElement("span", {
    style: {
      position: "absolute",
      bottom: h * 0.05,
      right: w * 0.1
    }
  }, /*#__PURE__*/React.createElement(Suit, {
    kind: s,
    size: w * 0.4,
    color: col
  })));
}
function HrBacks({
  w = 15
}) {
  const h = Math.round(w * 1.45);
  return /*#__PURE__*/React.createElement("span", {
    style: {
      display: "inline-flex"
    }
  }, [0, 1].map(i => /*#__PURE__*/React.createElement("span", {
    key: i,
    style: {
      marginLeft: i ? -w * 0.45 : 0,
      width: w,
      height: h,
      borderRadius: 3,
      background: "repeating-linear-gradient(45deg,#3a3a42 0 3px,#2a2a30 3px 6px)",
      border: "1px solid rgba(0,0,0,.5)"
    }
  })));
}
function HandReplay({
  open,
  onClose,
  accent = "#D71921",
  discipline = "NLH HOLD'EM",
  stakes = "20-100 0.50/1"
}) {
  const TOTAL = 19;
  const [step, setStep] = React.useState(TOTAL);
  React.useEffect(() => {
    if (open) setStep(TOTAL);
  }, [open]);
  if (!open) return null;
  const click = f => {
    if (window.playClick) window.playClick(f || 1000, 0.04);
  };

  // app-style pill seat plate
  const Seat = s => /*#__PURE__*/React.createElement("div", {
    key: s.name,
    style: {
      position: "absolute",
      ...s.pos,
      width: 104,
      display: "flex",
      flexDirection: "column",
      alignItems: "center",
      gap: 4,
      opacity: s.fold ? 0.5 : 1
    }
  }, /*#__PURE__*/React.createElement("div", {
    style: {
      display: "flex",
      gap: 2,
      height: 22,
      alignItems: "flex-end"
    }
  }, s.cards ? s.cards.map((c, i) => /*#__PURE__*/React.createElement(HrCard, {
    key: i,
    r: c.r,
    s: c.s,
    w: 15
  })) : /*#__PURE__*/React.createElement(HrBacks, {
    w: 14
  })), /*#__PURE__*/React.createElement("div", {
    style: {
      position: "relative",
      borderRadius: 8,
      background: "rgba(8,8,10,.92)",
      border: `1px solid ${s.win ? HR_GREEN : "rgba(255,255,255,.2)"}`,
      boxShadow: s.win ? `0 0 14px ${HR_GREEN}55` : "0 3px 9px rgba(0,0,0,.5)",
      padding: "5px 9px",
      display: "flex",
      flexDirection: "column",
      alignItems: "center",
      minWidth: 78
    }
  }, s.win && /*#__PURE__*/React.createElement("span", {
    style: {
      position: "absolute",
      top: -8,
      left: "50%",
      transform: "translateX(-50%)",
      fontFamily: HR_SANS,
      fontWeight: 700,
      fontSize: 10.5,
      letterSpacing: ".12em",
      color: "#0a0a0c",
      background: HR_GREEN,
      padding: "2px 7px",
      borderRadius: 4
    }
  }, "WIN"), s.dealer && /*#__PURE__*/React.createElement("span", {
    style: {
      position: "absolute",
      top: -7,
      right: -7,
      width: 18,
      height: 18,
      borderRadius: "50%",
      background: "radial-gradient(circle at 36% 30%, #fff, #d9c27a)",
      color: "#241c00",
      fontFamily: HR_MONO,
      fontWeight: 700,
      fontSize: 10.5,
      display: "flex",
      alignItems: "center",
      justifyContent: "center",
      border: "1px solid rgba(0,0,0,.4)"
    }
  }, "D"), /*#__PURE__*/React.createElement("span", {
    style: {
      fontFamily: HR_SANS,
      fontWeight: 700,
      fontSize: 11,
      color: "#fff",
      whiteSpace: "nowrap",
      maxWidth: 86,
      overflow: "hidden",
      textOverflow: "ellipsis"
    }
  }, s.name), /*#__PURE__*/React.createElement("span", {
    style: {
      fontFamily: HR_MONO,
      fontWeight: 700,
      fontSize: 11,
      color: s.bal === "0" ? "rgba(255,255,255,.4)" : HR_GOLD,
      fontVariantNumeric: "tabular-nums"
    }
  }, s.bal)));
  return /*#__PURE__*/React.createElement("div", {
    style: {
      position: "absolute",
      inset: 0,
      zIndex: 135,
      background: "#0a0a0c",
      display: "flex",
      flexDirection: "column"
    }
  }, /*#__PURE__*/React.createElement("div", {
    style: {
      flex: "none",
      paddingTop: 62,
      paddingLeft: 12,
      paddingRight: 14,
      paddingBottom: 12,
      display: "flex",
      alignItems: "center",
      gap: 10,
      background: "linear-gradient(180deg, #111116, #0c0c0f)"
    }
  }, /*#__PURE__*/React.createElement("button", {
    onClick: () => {
      click(800);
      onClose && onClose();
    },
    style: {
      flex: "none",
      width: 34,
      height: 34,
      borderRadius: 12,
      background: "rgba(255,255,255,.085)",
      border: "1px solid rgba(255,255,255,.16)",
      display: "flex",
      alignItems: "center",
      justifyContent: "center",
      cursor: "pointer",
      padding: 0
    }
  }, /*#__PURE__*/React.createElement("svg", {
    width: "15",
    height: "15",
    viewBox: "0 0 24 24",
    fill: "none",
    stroke: "#fff",
    strokeWidth: "2.4",
    strokeLinecap: "round",
    strokeLinejoin: "round"
  }, /*#__PURE__*/React.createElement("path", {
    d: "M15 6l-6 6 6 6"
  }))), /*#__PURE__*/React.createElement("div", {
    style: {
      flex: 1,
      textAlign: "center"
    }
  }, /*#__PURE__*/React.createElement("div", {
    style: {
      fontFamily: HR_MONO,
      fontWeight: 700,
      fontSize: 15,
      color: "#fff",
      letterSpacing: ".16em",
      whiteSpace: "nowrap",
      overflow: "hidden",
      textOverflow: "ellipsis"
    }
  }, discipline, " ", stakes), /*#__PURE__*/React.createElement("div", {
    style: {
      fontFamily: HR_MONO,
      fontSize: 10.5,
      color: "#A9A9B2",
      letterSpacing: ".1em",
      marginTop: 2
    }
  }, "#1648731740")), /*#__PURE__*/React.createElement("span", {
    style: {
      width: 34
    }
  })), /*#__PURE__*/React.createElement("div", {
    style: {
      flex: 1,
      overflowY: "auto",
      overflowX: "hidden",
      WebkitOverflowScrolling: "touch",
      paddingBottom: 8
    }
  }, /*#__PURE__*/React.createElement("div", {
    style: {
      position: "relative",
      height: 214,
      margin: "10px 14px 0"
    }
  }, /*#__PURE__*/React.createElement("div", {
    style: {
      position: "absolute",
      inset: "4px 0",
      borderRadius: 125,
      background: "radial-gradient(ellipse 72% 84% at 50% 45%, #20242a 0%, #0d0f12 72%)",
      border: "1px solid rgba(255,255,255,.13)",
      boxShadow: "inset 0 0 50px rgba(0,0,0,.55)"
    }
  }), /*#__PURE__*/React.createElement("div", {
    style: {
      position: "absolute",
      top: "42%",
      left: 0,
      right: 0,
      transform: "translateY(-50%)",
      display: "flex",
      flexDirection: "column",
      alignItems: "center",
      gap: 7
    }
  }, /*#__PURE__*/React.createElement("div", {
    style: {
      display: "flex",
      gap: 3
    }
  }, HR_BOARD.map((c, i) => /*#__PURE__*/React.createElement(HrCard, {
    key: i,
    r: c.r,
    s: c.s,
    w: 26
  }))), /*#__PURE__*/React.createElement("span", {
    style: {
      display: "inline-flex",
      alignItems: "center",
      gap: 6,
      padding: "3px 11px",
      borderRadius: 125,
      background: "rgba(0,0,0,.5)",
      border: "1px solid rgba(255,255,255,.18)"
    }
  }, /*#__PURE__*/React.createElement("span", {
    style: {
      width: 8,
      height: 8,
      borderRadius: "50%",
      background: HR_GOLD,
      boxShadow: `0 0 6px ${HR_GOLD}`
    }
  }), /*#__PURE__*/React.createElement("span", {
    style: {
      fontFamily: HR_MONO,
      fontWeight: 700,
      fontSize: 12,
      color: "#fff"
    }
  }, "180.16"))), HR_SEATS.map(Seat), /*#__PURE__*/React.createElement("div", {
    style: {
      position: "absolute",
      bottom: -4,
      left: "50%",
      transform: "translateX(-50%)",
      width: 110,
      display: "flex",
      flexDirection: "column",
      alignItems: "center",
      gap: 3
    }
  }, /*#__PURE__*/React.createElement("div", {
    style: {
      display: "flex",
      gap: 3
    }
  }, JT.map((c, i) => /*#__PURE__*/React.createElement(HrCard, {
    key: i,
    r: c.r,
    s: c.s,
    w: 24
  }))), /*#__PURE__*/React.createElement("div", {
    style: {
      borderRadius: 8,
      background: "rgba(8,8,10,.92)",
      border: `1px solid ${accent}`,
      padding: "4px 11px",
      display: "flex",
      flexDirection: "column",
      alignItems: "center"
    }
  }, /*#__PURE__*/React.createElement("span", {
    style: {
      fontFamily: HR_SANS,
      fontWeight: 700,
      fontSize: 11,
      color: "#fff"
    }
  }, "Shymanko"), /*#__PURE__*/React.createElement("span", {
    style: {
      fontFamily: HR_MONO,
      fontWeight: 700,
      fontSize: 10.5,
      color: "#A9A9B2"
    }
  }, "0")))), /*#__PURE__*/React.createElement("div", {
    style: {
      display: "flex",
      gap: 6,
      padding: "16px 12px 8px",
      alignItems: "flex-start"
    }
  }, HR_COLS.map((col, i) => /*#__PURE__*/React.createElement("div", {
    key: i,
    style: {
      flex: 1,
      minWidth: 0,
      display: "flex",
      flexDirection: "column",
      gap: 7
    }
  }, /*#__PURE__*/React.createElement("div", {
    style: {
      borderRadius: 8,
      padding: "7px 4px",
      background: "rgba(255,255,255,.075)",
      border: "1px solid rgba(255,255,255,.1)",
      textAlign: "center"
    }
  }, /*#__PURE__*/React.createElement("div", {
    style: {
      fontFamily: HR_SANS,
      fontWeight: 700,
      fontSize: 10.5,
      letterSpacing: ".04em",
      color: "#fff",
      whiteSpace: "nowrap",
      overflow: "hidden",
      textOverflow: "ellipsis"
    }
  }, col.name), col.sub && /*#__PURE__*/React.createElement("div", {
    style: {
      fontFamily: HR_SANS,
      fontWeight: 600,
      fontSize: 10.5,
      color: "#A9A9B2"
    }
  }, col.sub), col.pot && /*#__PURE__*/React.createElement("div", {
    style: {
      fontFamily: HR_MONO,
      fontWeight: 700,
      fontSize: 10.5,
      color: HR_GOLD,
      marginTop: 2
    }
  }, col.pot)), col.board && /*#__PURE__*/React.createElement("div", {
    style: {
      display: "flex",
      justifyContent: "center",
      gap: 2,
      padding: "6px 2px",
      borderRadius: 8,
      background: "rgba(255,255,255,.06)",
      border: "1px solid rgba(255,255,255,.13)"
    }
  }, HR_BOARD.map((c, j) => /*#__PURE__*/React.createElement(HrCard, {
    key: j,
    r: c.r,
    s: c.s,
    w: 13,
    blank: !col.board.includes(j)
  }))), col.items.map((it, j) => it.t === "act" ? /*#__PURE__*/React.createElement("div", {
    key: j,
    style: {
      padding: "7px 6px",
      borderRadius: 8,
      background: it.raise ? `${HR_GOLD}1c` : it.you ? `${accent}10` : "rgba(255,255,255,.06)",
      border: `1px solid ${it.raise ? HR_GOLD + "66" : it.you ? accent + "33" : "rgba(255,255,255,.13)"}`,
      opacity: it.fold ? 0.5 : 1
    }
  }, /*#__PURE__*/React.createElement("div", {
    style: {
      display: "flex",
      alignItems: "center",
      gap: 4
    }
  }, /*#__PURE__*/React.createElement(HrAv, {
    name: it.who,
    size: 15,
    ring: it.you ? accent : null
  }), /*#__PURE__*/React.createElement("span", {
    style: {
      flex: 1,
      minWidth: 0,
      fontFamily: HR_SANS,
      fontWeight: 700,
      fontSize: 10.5,
      color: "#fff",
      whiteSpace: "nowrap",
      overflow: "hidden",
      textOverflow: "ellipsis"
    }
  }, it.who)), /*#__PURE__*/React.createElement("div", {
    style: {
      display: "flex",
      alignItems: "center",
      justifyContent: "space-between",
      gap: 3,
      marginTop: 4
    }
  }, /*#__PURE__*/React.createElement("span", {
    style: {
      fontFamily: HR_SANS,
      fontWeight: 700,
      fontSize: 10.5,
      letterSpacing: ".04em",
      color: it.pos === "SB" || it.pos === "BB" ? HR_GREEN : "rgba(255,255,255,.5)",
      padding: "1px 4px",
      borderRadius: 3,
      background: "rgba(255,255,255,.085)",
      border: "1px solid rgba(255,255,255,.16)"
    }
  }, it.pos)), /*#__PURE__*/React.createElement("div", {
    style: {
      marginTop: 4,
      fontFamily: HR_SANS,
      fontWeight: 700,
      fontSize: 10.5,
      lineHeight: 1.2,
      color: it.fold ? "rgba(255,255,255,.55)" : it.raise ? HR_GOLD : it.call ? "#8fb8ff" : "#fff"
    }
  }, it.act, it.amt ? /*#__PURE__*/React.createElement("span", {
    style: {
      display: "block",
      fontFamily: HR_MONO,
      color: "#fff",
      fontSize: 10.5
    }
  }, it.amt) : "")) : /*#__PURE__*/React.createElement("div", {
    key: j,
    style: {
      padding: "7px 5px",
      borderRadius: 8,
      background: it.win ? "rgba(70,194,117,.14)" : it.you ? `${HR_GOLD}16` : "rgba(255,255,255,.06)",
      border: `1px solid ${it.win ? "rgba(70,194,117,.5)" : it.you ? HR_GOLD + "55" : "rgba(255,255,255,.1)"}`
    }
  }, /*#__PURE__*/React.createElement("div", {
    style: {
      display: "flex",
      alignItems: "center",
      gap: 4,
      marginBottom: 5
    }
  }, /*#__PURE__*/React.createElement(HrAv, {
    name: it.who,
    size: 14,
    ring: it.you ? accent : null
  }), /*#__PURE__*/React.createElement("span", {
    style: {
      flex: 1,
      minWidth: 0,
      fontFamily: HR_SANS,
      fontWeight: 700,
      fontSize: 10.5,
      color: "#fff",
      whiteSpace: "nowrap",
      overflow: "hidden",
      textOverflow: "ellipsis"
    }
  }, it.who)), /*#__PURE__*/React.createElement("div", {
    style: {
      display: "flex",
      justifyContent: "center",
      gap: 2,
      marginBottom: 5
    }
  }, it.cards.map((c, k) => /*#__PURE__*/React.createElement(HrCard, {
    key: k,
    r: c.r,
    s: c.s,
    w: 16
  }))), /*#__PURE__*/React.createElement("div", {
    style: {
      textAlign: "center",
      fontFamily: HR_MONO,
      fontWeight: 700,
      fontSize: 12,
      color: it.win ? HR_GREEN : it.lead ? HR_GREEN : it.pct === "0%" ? "rgba(255,255,255,.4)" : "#fff",
      fontVariantNumeric: "tabular-nums"
    }
  }, it.pct), it.win && /*#__PURE__*/React.createElement("div", {
    style: {
      textAlign: "center",
      fontFamily: HR_SANS,
      fontWeight: 700,
      fontSize: 10.5,
      letterSpacing: ".06em",
      color: HR_GREEN,
      marginTop: 2
    }
  }, it.win))))))), /*#__PURE__*/React.createElement("div", {
    style: {
      flex: "none",
      padding: "12px 16px 24px",
      borderTop: "1px solid rgba(255,255,255,.13)",
      background: "#0c0c0f",
      display: "flex",
      alignItems: "center",
      gap: 12
    }
  }, /*#__PURE__*/React.createElement("button", {
    onClick: () => {
      click(900);
      setStep(s => Math.max(1, s - 1));
    },
    style: {
      flex: "none",
      width: 34,
      height: 34,
      borderRadius: "50%",
      background: "rgba(255,255,255,.085)",
      border: "1px solid rgba(255,255,255,.18)",
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
    strokeWidth: "2.4",
    strokeLinecap: "round",
    strokeLinejoin: "round"
  }, /*#__PURE__*/React.createElement("path", {
    d: "M15 6l-6 6 6 6"
  }))), /*#__PURE__*/React.createElement("div", {
    style: {
      flex: 1,
      position: "relative",
      height: 6,
      borderRadius: 125,
      background: "rgba(255,255,255,.1)"
    }
  }, /*#__PURE__*/React.createElement("div", {
    style: {
      position: "absolute",
      left: 0,
      top: 0,
      bottom: 0,
      width: `${step / TOTAL * 100}%`,
      borderRadius: 125,
      background: HR_GREEN,
      boxShadow: `0 0 8px ${HR_GREEN}88`
    }
  }), /*#__PURE__*/React.createElement("div", {
    style: {
      position: "absolute",
      top: "50%",
      left: `${step / TOTAL * 100}%`,
      transform: "translate(-50%,-50%)",
      width: 16,
      height: 16,
      borderRadius: "50%",
      background: "#fff",
      boxShadow: "0 2px 6px rgba(0,0,0,.5)"
    }
  })), /*#__PURE__*/React.createElement("span", {
    style: {
      flex: "none",
      fontFamily: HR_MONO,
      fontWeight: 700,
      fontSize: 12,
      color: "#fff",
      fontVariantNumeric: "tabular-nums",
      minWidth: 44,
      textAlign: "center"
    }
  }, step, " / ", TOTAL), /*#__PURE__*/React.createElement("button", {
    onClick: () => {
      click(900);
      setStep(s => Math.min(TOTAL, s + 1));
    },
    style: {
      flex: "none",
      width: 34,
      height: 34,
      borderRadius: "50%",
      background: accent,
      border: 0,
      display: "flex",
      alignItems: "center",
      justifyContent: "center",
      cursor: "pointer",
      padding: 0,
      boxShadow: `0 3px 10px ${accent}66`
    }
  }, /*#__PURE__*/React.createElement("svg", {
    width: "14",
    height: "14",
    viewBox: "0 0 24 24",
    fill: "none",
    stroke: "#fff",
    strokeWidth: "2.4",
    strokeLinecap: "round",
    strokeLinejoin: "round"
  }, /*#__PURE__*/React.createElement("path", {
    d: "M9 6l6 6-6 6"
  })))));
}
Object.assign(window, {
  HandReplay
});