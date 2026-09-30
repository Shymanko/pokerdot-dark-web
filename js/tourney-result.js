// tourney-result.jsx — the end-of-tournament takeover.
// Structure: CONGRATULATIONS · rank · total prize · regular + bounty split ·
// event plate · knocked-out players · Bad Beat / Best / Last hand · Close+Share.
// Tournament money is plain dollars ($), not the cash-game C$ currency.
//   window.showTourneyResult({ ... })  → opens it

const TR_MONO = UI.font;
const TR_SANS = UI.fontUI;
const TR_GOLD = "#f0c75e";
const trUsd = n => "$" + Number(n).toLocaleString("en-US", {
  minimumFractionDigits: 2,
  maximumFractionDigits: 2
});
function TrHandCards({
  cards,
  h = 46
}) {
  const w = Math.round(h * 0.7);
  return /*#__PURE__*/React.createElement("span", {
    style: {
      display: "flex",
      gap: 4
    }
  }, cards.map(([r, s], i) => {
    const red = s === "\u2665" || s === "\u2666";
    return /*#__PURE__*/React.createElement("span", {
      key: i,
      style: {
        flex: "none",
        width: w,
        height: h,
        borderRadius: h * 0.11,
        background: "#fff",
        boxShadow: "0 3px 7px rgba(0,0,0,.5)",
        display: "flex",
        flexDirection: "column",
        alignItems: "center",
        justifyContent: "center"
      }
    }, /*#__PURE__*/React.createElement("span", {
      style: {
        fontFamily: TR_MONO,
        fontWeight: 700,
        fontSize: h * 0.36,
        lineHeight: 1,
        color: red ? "#D71921" : "#0a0a0c"
      }
    }, r), /*#__PURE__*/React.createElement("span", {
      style: {
        fontSize: h * 0.28,
        lineHeight: 1,
        color: red ? "#D71921" : "#0a0a0c"
      }
    }, s));
  }));
}
function TourneyResultScreen({
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
  const c = TR_GOLD;
  const click = f => {
    if (window.playClick) window.playClick(f, .05);
  };
  const av = k => (window.CHAT_AV || {})[k] || "assets/chat/" + k + ".webp";
  const won = data.rank === 1;
  return /*#__PURE__*/React.createElement("div", {
    style: {
      position: "absolute",
      inset: 0,
      zIndex: 230,
      display: "flex",
      flexDirection: "column",
      background: "rgba(3,3,4,.9)",
      backdropFilter: "blur(7px)",
      WebkitBackdropFilter: "blur(7px)",
      opacity: up ? 1 : 0,
      transition: "opacity 200ms cubic-bezier(.2,.8,.2,1)"
    }
  }, /*#__PURE__*/React.createElement("div", {
    "data-share-src": "1",
    style: {
      flex: 1,
      minHeight: 0,
      overflowY: "auto",
      WebkitOverflowScrolling: "touch",
      padding: "62px 16px 16px",
      display: "flex",
      flexDirection: "column",
      transform: up ? "translateY(0)" : "translateY(18px)",
      transition: "transform 300ms cubic-bezier(.2,.8,.2,1)"
    }
  }, /*#__PURE__*/React.createElement("div", {
    "data-result-card": "1",
    style: {
      position: "relative",
      borderRadius: 20,
      padding: "14px 16px 16px",
      border: `1px solid ${c}59`,
      background: `radial-gradient(120% 130% at 82% 20%, ${c}33 0%, ${c}0f 40%, #0c0b08 74%, #08080a 100%)`,
      boxShadow: `0 22px 50px rgba(0,0,0,.7), inset 0 1px 0 ${c}33`
    }
  }, /*#__PURE__*/React.createElement("span", {
    style: {
      position: "absolute",
      inset: 0,
      borderRadius: 20,
      overflow: "hidden",
      pointerEvents: "none",
      backgroundImage: "radial-gradient(circle, rgba(255,255,255,.06) .8px, transparent 1.2px)",
      backgroundSize: "12px 12px",
      maskImage: "linear-gradient(150deg, black, transparent 72%)",
      WebkitMaskImage: "linear-gradient(150deg, black, transparent 72%)"
    }
  }), /*#__PURE__*/React.createElement("img", {
    src: "assets/comp-grand.png",
    alt: "",
    style: {
      position: "absolute",
      right: -14,
      top: 78,
      width: 134,
      height: 134,
      objectFit: "contain",
      pointerEvents: "none",
      zIndex: 3,
      filter: `drop-shadow(0 16px 30px rgba(0,0,0,.75)) drop-shadow(0 0 30px ${c}66)`
    }
  }), /*#__PURE__*/React.createElement("div", {
    style: {
      position: "relative",
      display: "flex",
      justifyContent: "center"
    }
  }, /*#__PURE__*/React.createElement("img", {
    src: "assets/logo-pokerdot.svg",
    alt: "Pokerdot",
    style: {
      height: 26,
      width: "auto",
      display: "block",
      marginTop: -2,
      filter: "drop-shadow(0 3px 10px rgba(0,0,0,.6))"
    }
  })), /*#__PURE__*/React.createElement("div", {
    style: {
      position: "relative",
      marginTop: 10,
      textAlign: "center",
      fontFamily: TR_MONO,
      fontWeight: 700,
      fontSize: 30,
      letterSpacing: ".02em",
      lineHeight: 1,
      color: c,
      textShadow: `0 0 22px ${c}66`
    }
  }, won ? "CONGRATULATIONS!" : "TOURNAMENT OVER"), /*#__PURE__*/React.createElement("div", {
    style: {
      position: "relative",
      display: "flex",
      alignItems: "center",
      gap: 12,
      marginTop: 16,
      paddingRight: 108
    }
  }, /*#__PURE__*/React.createElement("img", {
    src: av("drebin"),
    alt: "",
    style: {
      flex: "none",
      width: 52,
      height: 52,
      borderRadius: "50%",
      objectFit: "cover",
      border: `1.5px solid ${c}`
    }
  }), /*#__PURE__*/React.createElement("div", {
    style: {
      flex: 1,
      minWidth: 0
    }
  }, /*#__PURE__*/React.createElement("div", {
    style: {
      fontFamily: TR_MONO,
      fontWeight: 700,
      fontSize: 15,
      color: "#fff",
      whiteSpace: "nowrap",
      overflow: "hidden",
      textOverflow: "ellipsis"
    }
  }, data.user), /*#__PURE__*/React.createElement("div", {
    style: {
      display: "flex",
      alignItems: "center",
      gap: 8,
      marginTop: 6
    }
  }, /*#__PURE__*/React.createElement("span", {
    style: {
      padding: "3px 9px",
      borderRadius: 125,
      background: "rgba(255,255,255,.07)",
      border: "1px solid rgba(255,255,255,.16)",
      fontFamily: TR_SANS,
      fontWeight: 700,
      fontSize: 9.5,
      letterSpacing: ".14em",
      color: "#D8D8DF"
    }
  }, "RANK"), /*#__PURE__*/React.createElement("span", {
    style: {
      fontFamily: TR_MONO,
      fontWeight: 700,
      fontSize: 19,
      color: c,
      lineHeight: 1
    }
  }, data.rank), /*#__PURE__*/React.createElement("span", {
    style: {
      fontFamily: TR_MONO,
      fontWeight: 700,
      fontSize: 13,
      color: "#A9A9B2"
    }
  }, "/ ", data.field)))), /*#__PURE__*/React.createElement("div", {
    style: {
      position: "relative",
      marginTop: 14
    }
  }, /*#__PURE__*/React.createElement("div", {
    style: {
      fontFamily: TR_SANS,
      fontWeight: 700,
      fontSize: 10.5,
      letterSpacing: ".2em",
      color: "#A9A9B2"
    }
  }, "TOTAL PRIZE"), /*#__PURE__*/React.createElement("div", {
    style: {
      marginTop: 6,
      fontFamily: TR_MONO,
      fontWeight: 700,
      fontSize: 38,
      lineHeight: 1,
      color: c,
      textShadow: `0 0 26px ${c}59`,
      whiteSpace: "nowrap"
    }
  }, trUsd(data.total))), /*#__PURE__*/React.createElement("div", {
    style: {
      position: "relative",
      display: "flex",
      gap: 10,
      marginTop: 14
    }
  }, [["REGULAR PRIZE", data.regular], ["BOUNTY PRIZE", data.bounty]].map(([k, v]) => /*#__PURE__*/React.createElement("div", {
    key: k,
    style: {
      flex: 1,
      minWidth: 0
    }
  }, /*#__PURE__*/React.createElement("div", {
    style: {
      fontFamily: TR_SANS,
      fontWeight: 700,
      fontSize: 9.5,
      letterSpacing: ".16em",
      color: "#A9A9B2"
    }
  }, k), /*#__PURE__*/React.createElement("div", {
    style: {
      marginTop: 5,
      fontFamily: TR_MONO,
      fontWeight: 700,
      fontSize: 17,
      color: "#fff",
      whiteSpace: "nowrap"
    }
  }, trUsd(v))))), /*#__PURE__*/React.createElement("div", {
    style: {
      position: "relative",
      marginTop: 15,
      padding: "11px 13px",
      borderRadius: 12,
      background: "rgba(0,0,0,.4)",
      border: `1px solid ${c}40`
    }
  }, /*#__PURE__*/React.createElement("div", {
    style: {
      fontFamily: TR_MONO,
      fontWeight: 700,
      fontSize: 12,
      color: c,
      whiteSpace: "nowrap",
      overflow: "hidden",
      textOverflow: "ellipsis"
    }
  }, data.event), /*#__PURE__*/React.createElement("div", {
    style: {
      display: "flex",
      gap: 14,
      marginTop: 6,
      fontFamily: TR_SANS,
      fontWeight: 700,
      fontSize: 10.5,
      letterSpacing: ".1em",
      color: "#A9A9B2"
    }
  }, /*#__PURE__*/React.createElement("span", null, "PLAY TIME ", data.playTime), /*#__PURE__*/React.createElement("span", null, data.date))), /*#__PURE__*/React.createElement("div", {
    style: {
      position: "relative",
      display: "flex",
      alignItems: "center",
      gap: 9,
      marginTop: 12,
      paddingTop: 11,
      borderTop: "1px solid rgba(255,255,255,.1)"
    }
  }, /*#__PURE__*/React.createElement("span", {
    style: {
      fontFamily: TR_SANS,
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
      fontFamily: TR_MONO,
      fontWeight: 700,
      fontSize: 11,
      color: c,
      whiteSpace: "nowrap"
    }
  }, window.AV_REF || "pokerdot.com/i/CARD-4821"))), data.ko && data.ko.length ? /*#__PURE__*/React.createElement("div", {
    style: {
      marginTop: 16
    }
  }, /*#__PURE__*/React.createElement("div", {
    style: {
      textAlign: "center",
      fontFamily: TR_SANS,
      fontWeight: 700,
      fontSize: 11,
      color: "#A9A9B2"
    }
  }, "You knocked out ", /*#__PURE__*/React.createElement("b", {
    style: {
      color: "#5BD96A",
      fontWeight: 700
    }
  }, data.ko.length), " player", data.ko.length === 1 ? "" : "s"), /*#__PURE__*/React.createElement("div", {
    style: {
      display: "flex",
      gap: 10,
      marginTop: 11,
      overflowX: "auto",
      WebkitOverflowScrolling: "touch",
      scrollbarWidth: "none",
      padding: "0 2px 2px"
    }
  }, data.ko.map((n, i) => /*#__PURE__*/React.createElement("span", {
    key: n,
    style: {
      flex: "none",
      width: 62,
      display: "flex",
      flexDirection: "column",
      alignItems: "center",
      gap: 6
    }
  }, /*#__PURE__*/React.createElement("img", {
    src: av(["drebin", "sponge", "yanu", "girl"][i % 4]),
    alt: "",
    style: {
      width: 46,
      height: 46,
      borderRadius: "50%",
      objectFit: "cover",
      border: "1px solid rgba(255,255,255,.2)"
    }
  }), /*#__PURE__*/React.createElement("span", {
    style: {
      fontFamily: TR_SANS,
      fontWeight: 700,
      fontSize: 9.5,
      letterSpacing: ".04em",
      color: "#A9A9B2",
      whiteSpace: "nowrap",
      overflow: "hidden",
      textOverflow: "ellipsis",
      maxWidth: 62
    }
  }, n))))) : null, /*#__PURE__*/React.createElement("div", {
    style: {
      display: "grid",
      gridTemplateColumns: "repeat(3, 1fr)",
      gap: 8,
      marginTop: 16
    }
  }, [["BAD BEAT", data.badBeat], ["BEST HAND", data.bestHand], ["LAST HAND", data.lastHand]].map(([k, cards]) => /*#__PURE__*/React.createElement("div", {
    key: k,
    style: {
      borderRadius: 14,
      padding: "11px 8px 12px",
      background: "rgba(255,255,255,.05)",
      border: "1px solid rgba(255,255,255,.1)",
      display: "flex",
      flexDirection: "column",
      alignItems: "center",
      gap: 9
    }
  }, /*#__PURE__*/React.createElement("span", {
    style: {
      fontFamily: TR_SANS,
      fontWeight: 700,
      fontSize: 8.5,
      letterSpacing: ".1em",
      color: "#A9A9B2",
      whiteSpace: "nowrap"
    }
  }, k), /*#__PURE__*/React.createElement(TrHandCards, {
    cards: cards
  }))))), /*#__PURE__*/React.createElement("div", {
    style: {
      flex: "none",
      padding: "12px 16px 24px",
      display: "flex",
      gap: 9,
      background: "linear-gradient(180deg, transparent, rgba(0,0,0,.9) 40%, #030304)"
    }
  }, /*#__PURE__*/React.createElement("button", {
    onClick: () => {
      click(900);
      onClose();
    },
    style: {
      flex: 1,
      padding: "15px 0",
      borderRadius: 125,
      cursor: "pointer",
      background: "rgba(255,255,255,.06)",
      border: "1px solid rgba(255,255,255,.16)",
      color: "#D8D8DF",
      fontFamily: TR_MONO,
      fontWeight: 700,
      fontSize: 12,
      letterSpacing: ".14em"
    }
  }, "CLOSE"), /*#__PURE__*/React.createElement("button", {
    onClick: () => {
      click(1400);
      onShare();
    },
    style: {
      flex: 1,
      padding: "15px 0",
      borderRadius: 125,
      border: 0,
      cursor: "pointer",
      background: c,
      color: "#241c00",
      boxShadow: `0 12px 26px ${c}55`,
      display: "flex",
      alignItems: "center",
      justifyContent: "center",
      gap: 8,
      fontFamily: TR_MONO,
      fontWeight: 700,
      fontSize: 12,
      letterSpacing: ".14em"
    }
  }, /*#__PURE__*/React.createElement("svg", {
    width: "16",
    height: "16",
    viewBox: "0 0 24 24",
    fill: "none",
    stroke: "#241c00",
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
function TourneyResultHost() {
  const [data, setData] = React.useState(null);
  React.useEffect(() => {
    window.showTourneyResult = p => setData(Object.assign({
      user: "Cardomancer",
      rank: 1,
      field: 251,
      total: 84842.62,
      regular: 33802.87,
      bounty: 51039.75,
      event: "ARCANIUM WINTER BOUNTY STORM \u00b7 $400 000 GTD",
      playTime: "05:28:11",
      date: "AUG 26, 2026 00:53",
      ko: ["LoveOly@", "Anvisck", "vadymzmailo", "samadhi!", "Medvid11", "gtoWizard", "snapcall"],
      badBeat: [["Q", "\u2660"], ["K", "\u2663"]],
      bestHand: [["J", "\u2666"], ["A", "\u2666"]],
      lastHand: [["Q", "\u2660"], ["Q", "\u2666"]]
    }, p || {}));
    return () => {
      delete window.showTourneyResult;
    };
  }, []);
  // SHARE builds the picture out of this very card
  const share = () => {
    const d = data;
    if (!d || !window.showShareImage) return;
    window.showShareImage({
      selector: "[data-share-src]",
      accent: "#f0c75e",
      foot: d.rank === 1 ? "CHAMPION" : "RANK #" + d.rank,
      text: (d.rank === 1 ? "Won " : "Finished #" + d.rank + " in ") + d.event + " for " + trUsd(d.total) + "."
    });
  };
  return /*#__PURE__*/React.createElement(TourneyResultScreen, {
    data: data,
    onClose: () => setData(null),
    onShare: share
  });
}
Object.assign(window, {
  TourneyResultScreen,
  TourneyResultHost,
  trUsd
});