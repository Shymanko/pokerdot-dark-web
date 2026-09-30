// table-win.jsx — the hand-won takeover at the felt.
// Fires when the hero takes the pot: pot size, the winning hand, the cards, and
// SHARE shares THIS screen as-is — the logo and the referral link are on it, so
// a screenshot of the takeover is itself the invite.
//   window.showTableWin({ pot, hand, cards, disc, stake, table, accent })

const TW_MONO = UI.font;
const TW_SANS = UI.fontUI;
const twNum = n => Number(n).toLocaleString("en-US").split(",").join(" ");

// a card face in the reference's proportions, sized by height
function TwCard({
  rank,
  suit,
  h = 88,
  delay = 0
}) {
  const red = suit === "\u2665" || suit === "\u2666";
  const w = Math.round(h * 0.7);
  return /*#__PURE__*/React.createElement("span", {
    style: {
      position: "relative",
      flex: "none",
      width: w,
      height: h,
      borderRadius: h * 0.09,
      background: "#fff",
      boxShadow: `0 ${h * 0.06}px ${h * 0.11}px rgba(0,0,0,.45)`,
      display: "flex",
      flexDirection: "column",
      alignItems: "center",
      justifyContent: "center",
      animation: `pp-rise 420ms ${delay}ms cubic-bezier(.2,.8,.2,1) both`
    }
  }, /*#__PURE__*/React.createElement("span", {
    style: {
      fontFamily: TW_MONO,
      fontWeight: 700,
      fontSize: h * 0.34,
      lineHeight: 1,
      color: red ? "#D71921" : "#0a0a0c"
    }
  }, rank), /*#__PURE__*/React.createElement("span", {
    style: {
      fontSize: h * 0.26,
      lineHeight: 1,
      color: red ? "#D71921" : "#0a0a0c"
    }
  }, suit));
}
function TableWinScreen({
  data,
  onClose,
  onShare
}) {
  const [up, setUp] = React.useState(false);
  React.useEffect(() => {
    if (!data) {
      setUp(false);
      return;
    }
    const r = requestAnimationFrame(() => setUp(true));
    return () => cancelAnimationFrame(r);
  }, [data]);
  if (!data) return null;
  const c = data.accent || "#17925a";
  const click = f => {
    if (window.playClick) window.playClick(f, .05);
  };
  return /*#__PURE__*/React.createElement("div", {
    style: {
      position: "absolute",
      inset: 0,
      zIndex: 220,
      display: "flex",
      flexDirection: "column",
      alignItems: "center",
      justifyContent: "center",
      padding: "0 20px",
      background: `radial-gradient(120% 80% at 50% 22%, ${c}3d, rgba(3,3,4,.93) 58%, #030304)`,
      backdropFilter: "blur(7px)",
      WebkitBackdropFilter: "blur(7px)",
      opacity: up ? 1 : 0,
      transition: "opacity 200ms cubic-bezier(.2,.8,.2,1)"
    }
  }, /*#__PURE__*/React.createElement("div", {
    "data-result-card": "1",
    style: {
      display: "flex",
      flexDirection: "column",
      alignItems: "center",
      width: "100%",
      maxWidth: 330
    }
  }, /*#__PURE__*/React.createElement("img", {
    src: "assets/logo-pokerdot.svg",
    alt: "Pokerdot",
    style: {
      height: 24,
      width: "auto",
      display: "block",
      marginBottom: 18,
      filter: "drop-shadow(0 3px 10px rgba(0,0,0,.6))"
    }
  }), /*#__PURE__*/React.createElement("div", {
    style: {
      textAlign: "center",
      transform: up ? "scale(1)" : "scale(.9)",
      transition: "transform 320ms cubic-bezier(.2,.8,.2,1)"
    }
  }, /*#__PURE__*/React.createElement("div", {
    style: {
      fontFamily: TW_SANS,
      fontWeight: 700,
      fontSize: 10.5,
      letterSpacing: ".28em",
      color: c
    }
  }, "YOU WIN THE POT"), /*#__PURE__*/React.createElement("div", {
    style: {
      marginTop: 10,
      fontFamily: TW_MONO,
      fontWeight: 700,
      fontSize: 46,
      lineHeight: 1,
      color: "#fff",
      letterSpacing: "-.01em"
    }
  }, data.pot), /*#__PURE__*/React.createElement("div", {
    style: {
      marginTop: 9,
      fontFamily: TW_MONO,
      fontWeight: 700,
      fontSize: 14,
      letterSpacing: ".16em",
      color: "#fff"
    }
  }, data.hand), /*#__PURE__*/React.createElement("div", {
    style: {
      marginTop: 5,
      fontFamily: TW_SANS,
      fontWeight: 700,
      fontSize: 10.5,
      letterSpacing: ".16em",
      color: "#A9A9B2"
    }
  }, data.disc, " \xB7 ", data.stake, " \xB7 ", data.table)), /*#__PURE__*/React.createElement("div", {
    style: {
      display: "flex",
      gap: 7,
      marginTop: 22
    }
  }, (data.cards || []).map(([r, s], i) => /*#__PURE__*/React.createElement(TwCard, {
    key: i,
    rank: r,
    suit: s,
    h: i < 2 ? 92 : 74,
    delay: 90 * i
  }))), /*#__PURE__*/React.createElement("div", {
    style: {
      display: "flex",
      width: "100%",
      maxWidth: 330,
      marginTop: 22,
      borderRadius: 14,
      background: "rgba(255,255,255,.05)",
      border: "1px solid rgba(255,255,255,.1)"
    }
  }, [["POT", data.pot], ["PROFIT", data.profit || data.pot], ["PLAYERS", data.players || "6"]].map(([k, v], i) => /*#__PURE__*/React.createElement("span", {
    key: k,
    style: {
      flex: 1,
      minWidth: 0,
      padding: "11px 12px",
      borderLeft: i ? "1px solid rgba(255,255,255,.08)" : "none"
    }
  }, /*#__PURE__*/React.createElement("span", {
    style: {
      display: "block",
      fontFamily: TW_SANS,
      fontWeight: 700,
      fontSize: 8.5,
      letterSpacing: ".14em",
      color: "#8A8A93"
    }
  }, k), /*#__PURE__*/React.createElement("span", {
    style: {
      display: "block",
      marginTop: 4,
      fontFamily: TW_MONO,
      fontWeight: 700,
      fontSize: 13,
      color: "#fff",
      whiteSpace: "nowrap"
    }
  }, v)))), /*#__PURE__*/React.createElement("div", {
    style: {
      display: "flex",
      alignItems: "center",
      gap: 9,
      width: "100%",
      maxWidth: 330,
      marginTop: 13
    }
  }, /*#__PURE__*/React.createElement("span", {
    style: {
      fontFamily: TW_SANS,
      fontWeight: 700,
      fontSize: 9.5,
      letterSpacing: ".18em",
      color: "#8A8A93"
    }
  }, "JOIN ME"), /*#__PURE__*/React.createElement("span", {
    style: {
      flex: 1,
      height: 1,
      background: "linear-gradient(90deg, rgba(255,255,255,.14), transparent)"
    }
  }), /*#__PURE__*/React.createElement("span", {
    style: {
      fontFamily: TW_MONO,
      fontWeight: 700,
      fontSize: 11,
      color: c,
      whiteSpace: "nowrap"
    }
  }, window.AV_REF || "pokerdot.com/i/CARD-4821"))), /*#__PURE__*/React.createElement("div", {
    style: {
      display: "flex",
      gap: 9,
      width: "100%",
      maxWidth: 330,
      marginTop: 16
    }
  }, /*#__PURE__*/React.createElement("button", {
    onClick: () => {
      click(900);
      onClose();
    },
    style: {
      flex: 1,
      padding: "14px 0",
      borderRadius: 125,
      cursor: "pointer",
      background: "rgba(255,255,255,.06)",
      border: "1px solid rgba(255,255,255,.16)",
      color: "#D8D8DF",
      fontFamily: TW_MONO,
      fontWeight: 700,
      fontSize: 12,
      letterSpacing: ".14em"
    }
  }, "NEXT HAND"), /*#__PURE__*/React.createElement("button", {
    onClick: () => {
      click(1400);
      onShare();
    },
    style: {
      flex: 1,
      padding: "14px 0",
      borderRadius: 125,
      border: 0,
      cursor: "pointer",
      background: c,
      color: "#fff",
      boxShadow: `0 12px 26px ${c}66`,
      display: "flex",
      alignItems: "center",
      justifyContent: "center",
      gap: 8,
      fontFamily: TW_MONO,
      fontWeight: 700,
      fontSize: 12,
      letterSpacing: ".14em"
    }
  }, /*#__PURE__*/React.createElement("svg", {
    width: "16",
    height: "16",
    viewBox: "0 0 24 24",
    fill: "none",
    stroke: "#fff",
    strokeWidth: "2",
    strokeLinecap: "round",
    strokeLinejoin: "round"
  }, /*#__PURE__*/React.createElement("circle", {
    cx: "17.5",
    cy: "5.5",
    r: "2.6"
  }), /*#__PURE__*/React.createElement("circle", {
    cx: "6.5",
    cy: "12",
    r: "2.6"
  }), /*#__PURE__*/React.createElement("circle", {
    cx: "17.5",
    cy: "18.5",
    r: "2.6"
  }), /*#__PURE__*/React.createElement("path", {
    d: "M9 10.8l6-4M9 13.2l6 4"
  })), "SHARE")));
}

// host — drives from window.showTableWin(); SHARE shares this screen directly
function TableWinHost() {
  const [data, setData] = React.useState(null);
  React.useEffect(() => {
    window.showTableWin = p => setData(Object.assign({
      pot: "$1 128",
      hand: "FULL HOUSE, ACES OVER NINES",
      disc: "HOLD'EM",
      stake: "$5/$10",
      table: "TABLE 271",
      players: "6",
      profit: "+$742",
      cards: [["A", "\u2660"], ["A", "\u2665"], ["9", "\u2666"], ["A", "\u2663"], ["9", "\u2660"]]
    }, p || {}));
    return () => {
      delete window.showTableWin;
    };
  }, []);
  const share = () => {
    const d = data;
    if (!d || !window.showShareImage) return;
    window.showShareImage({
      selector: "[data-result-card]",
      accent: d.accent || "#17925a",
      foot: d.disc,
      text: "Just took " + d.pot + " with " + d.hand + "."
    });
  };
  return /*#__PURE__*/React.createElement(TableWinScreen, {
    data: data,
    onClose: () => setData(null),
    onShare: share
  });
}
Object.assign(window, {
  TableWinScreen,
  TableWinHost,
  TwCard
});