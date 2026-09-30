// hand-ranks.jsx — Правка 6 (архітектура 09.09).
// Тап по дошці за столом відкриває довідку комбінацій за старшинством.
// Та, що зараз зібрана у гравця, підсвічена і позначена «МОЯ КОМБИНАЦИЯ»;
// окремим рядком показано, з чого саме вона складена: на префлопі — дві
// кишенькові карти, з флопу — п'ять карт, де кишенькові виділені.

const HRANK_MONO = UI.font;
const HRANK_SANS = UI.fontUI;

// від найстаршої до найменшої — порядок довідки
const HR_LIST = [{
  id: "rf",
  name: "ROYAL FLUSH",
  note: "A-K-Q-J-10 of one suit"
}, {
  id: "sf",
  name: "STRAIGHT FLUSH",
  note: "Five in a row, one suit"
}, {
  id: "4k",
  name: "FOUR OF A KIND",
  note: "Four cards of the same rank"
}, {
  id: "fh",
  name: "FULL HOUSE",
  note: "Three of a kind plus a pair"
}, {
  id: "fl",
  name: "FLUSH",
  note: "Five cards of one suit"
}, {
  id: "st",
  name: "STRAIGHT",
  note: "Five in a row, any suits"
}, {
  id: "3k",
  name: "THREE OF A KIND",
  note: "Three cards of the same rank"
}, {
  id: "2p",
  name: "TWO PAIR",
  note: "Two different pairs"
}, {
  id: "1p",
  name: "ONE PAIR",
  note: "Two cards of the same rank"
}, {
  id: "hc",
  name: "HIGH CARD",
  note: "Nothing made — the top card plays"
}];
const HR_ORDER = {
  A: 14,
  K: 13,
  Q: 12,
  J: 11,
  "10": 10,
  T: 10,
  9: 9,
  8: 8,
  7: 7,
  6: 6,
  5: 5,
  4: 4,
  3: 3,
  2: 2
};

// що зібрано з семи карт — рахуємо чесно, без заглушок
function hrEvaluate(hole, board) {
  const all = hole.concat(board).map(c => ({
    r: String(c.r),
    s: c.s,
    v: HR_ORDER[String(c.r)] || 0
  }));
  if (all.length < 5) return {
    id: "hc",
    cards: hole.slice()
  };
  const bySuit = {};
  all.forEach(c => {
    (bySuit[c.s] = bySuit[c.s] || []).push(c);
  });
  const byRank = {};
  all.forEach(c => {
    (byRank[c.v] = byRank[c.v] || []).push(c);
  });
  const counts = Object.keys(byRank).map(v => ({
    v: +v,
    cards: byRank[v]
  })).sort((a, b) => b.cards.length - a.cards.length || b.v - a.v);
  const flushSuit = Object.keys(bySuit).find(s => bySuit[s].length >= 5);
  const runOf = cards => {
    const vs = [...new Set(cards.map(c => c.v))].sort((a, b) => b - a);
    if (vs.includes(14)) vs.push(1); // туз знизу стрейта
    let run = [];
    for (let i = 0; i < vs.length; i++) {
      if (!run.length || vs[i] === run[run.length - 1] - 1) run.push(vs[i]);else run = [vs[i]];
      if (run.length === 5) return run;
    }
    return null;
  };
  const pick = (vals, pool) => vals.map(v => pool.find(c => c.v === v || v === 1 && c.v === 14)).filter(Boolean);
  if (flushSuit) {
    const fc = bySuit[flushSuit];
    const sr = runOf(fc);
    if (sr) return {
      id: sr[0] === 14 ? "rf" : "sf",
      cards: pick(sr, fc)
    };
  }
  if (counts[0].cards.length === 4) return {
    id: "4k",
    cards: counts[0].cards.concat(all.filter(c => c.v !== counts[0].v).sort((a, b) => b.v - a.v).slice(0, 1))
  };
  if (counts[0].cards.length === 3 && counts[1] && counts[1].cards.length >= 2) return {
    id: "fh",
    cards: counts[0].cards.concat(counts[1].cards.slice(0, 2))
  };
  if (flushSuit) return {
    id: "fl",
    cards: bySuit[flushSuit].sort((a, b) => b.v - a.v).slice(0, 5)
  };
  const sr = runOf(all);
  if (sr) return {
    id: "st",
    cards: pick(sr, all)
  };
  if (counts[0].cards.length === 3) return {
    id: "3k",
    cards: counts[0].cards.concat(all.filter(c => c.v !== counts[0].v).sort((a, b) => b.v - a.v).slice(0, 2))
  };
  if (counts[0].cards.length === 2 && counts[1] && counts[1].cards.length === 2) return {
    id: "2p",
    cards: counts[0].cards.concat(counts[1].cards).concat(all.filter(c => c.v !== counts[0].v && c.v !== counts[1].v).sort((a, b) => b.v - a.v).slice(0, 1))
  };
  if (counts[0].cards.length === 2) return {
    id: "1p",
    cards: counts[0].cards.concat(all.filter(c => c.v !== counts[0].v).sort((a, b) => b.v - a.v).slice(0, 3))
  };
  return {
    id: "hc",
    cards: all.sort((a, b) => b.v - a.v).slice(0, 5)
  };
}
function HrCard({
  c,
  mine,
  size = 1
}) {
  const red = c.s === "heart" || c.s === "diamond";
  const pip = {
    spade: "♠",
    heart: "♥",
    diamond: "♦",
    club: "♣"
  }[c.s] || "♠";
  return /*#__PURE__*/React.createElement("span", {
    "data-i18n": "off",
    style: {
      display: "inline-flex",
      flexDirection: "column",
      alignItems: "center",
      justifyContent: "center",
      width: 30 * size,
      height: 42 * size,
      borderRadius: 6 * size,
      flex: "none",
      background: "#f4f4f6",
      color: red ? "#D0021B" : "#111",
      border: mine ? "2px solid #5BD96A" : "1px solid rgba(0,0,0,.25)",
      boxShadow: mine ? "0 0 0 2px rgba(91,217,106,.28), 0 4px 10px rgba(0,0,0,.5)" : "0 3px 8px rgba(0,0,0,.45)"
    }
  }, /*#__PURE__*/React.createElement("span", {
    style: {
      fontFamily: HRANK_MONO,
      fontWeight: 700,
      fontSize: 14 * size,
      lineHeight: 1
    }
  }, c.r), /*#__PURE__*/React.createElement("span", {
    style: {
      fontSize: 12 * size,
      lineHeight: 1
    }
  }, pip));
}
function HandRanksSheet({
  open,
  accent = "#D71921",
  hole = [],
  board = [],
  onClose
}) {
  const [up, setUp] = React.useState(false);
  React.useEffect(() => {
    if (!open) {
      setUp(false);
      return;
    }
    const r = requestAnimationFrame(() => setUp(true));
    return () => cancelAnimationFrame(r);
  }, [open]);
  if (!open) return null;
  const preflop = !board.length;
  const made = preflop ? null : hrEvaluate(hole, board);
  const mineId = made ? made.id : null;
  const holeKey = hole.map(c => String(c.r) + c.s);
  const shown = preflop ? hole : made.cards;
  return /*#__PURE__*/React.createElement("div", {
    onClick: onClose,
    style: {
      position: "absolute",
      inset: 0,
      zIndex: 230,
      display: "flex",
      flexDirection: "column",
      justifyContent: "flex-end",
      background: "rgba(0,0,0,.68)",
      backdropFilter: "blur(5px)",
      WebkitBackdropFilter: "blur(5px)",
      opacity: up ? 1 : 0,
      transition: "opacity 200ms ease"
    }
  }, /*#__PURE__*/React.createElement("div", {
    onClick: e => e.stopPropagation(),
    style: {
      maxHeight: "88%",
      display: "flex",
      flexDirection: "column",
      borderTopLeftRadius: 22,
      borderTopRightRadius: 22,
      background: "linear-gradient(180deg,#131317,#0a0a0c)",
      borderTop: `1px solid ${accent}55`,
      boxShadow: "0 -16px 44px rgba(0,0,0,.7)",
      transform: up ? "translateY(0)" : "translateY(24px)",
      transition: "transform 220ms cubic-bezier(.2,.8,.2,1)"
    }
  }, /*#__PURE__*/React.createElement("div", {
    style: {
      flex: "none",
      padding: "10px 16px 14px"
    }
  }, /*#__PURE__*/React.createElement("div", {
    style: {
      width: 46,
      height: 4,
      borderRadius: 3,
      background: "rgba(255,255,255,.26)",
      margin: "0 auto 12px"
    }
  }), /*#__PURE__*/React.createElement("div", {
    style: {
      display: "flex",
      alignItems: "center",
      gap: 10
    }
  }, /*#__PURE__*/React.createElement("span", {
    style: {
      flex: 1,
      fontFamily: HRANK_MONO,
      fontWeight: 700,
      fontSize: 13,
      letterSpacing: ".16em",
      color: "#fff"
    }
  }, "HAND RANKINGS"), /*#__PURE__*/React.createElement("button", {
    onClick: onClose,
    "aria-label": "Close",
    style: {
      flex: "none",
      width: 32,
      height: 32,
      borderRadius: 12,
      cursor: "pointer",
      padding: 0,
      background: "rgba(255,255,255,.07)",
      border: "1px solid rgba(255,255,255,.16)",
      display: "flex",
      alignItems: "center",
      justifyContent: "center"
    }
  }, /*#__PURE__*/React.createElement("svg", {
    width: "13",
    height: "13",
    viewBox: "0 0 24 24",
    fill: "none",
    stroke: "#fff",
    strokeWidth: "2.4",
    strokeLinecap: "round"
  }, /*#__PURE__*/React.createElement("path", {
    d: "M18 6L6 18M6 6l12 12"
  })))), /*#__PURE__*/React.createElement("div", {
    style: {
      marginTop: 12,
      padding: "12px 13px",
      borderRadius: 14,
      background: "rgba(91,217,106,.08)",
      border: "1px solid rgba(91,217,106,.34)"
    }
  }, /*#__PURE__*/React.createElement("div", {
    style: {
      fontFamily: HRANK_SANS,
      fontWeight: 700,
      fontSize: 9.5,
      letterSpacing: ".2em",
      color: "#5BD96A"
    }
  }, preflop ? "YOUR HOLE CARDS" : "YOU HAVE NOW"), /*#__PURE__*/React.createElement("div", {
    style: {
      display: "flex",
      alignItems: "center",
      gap: 6,
      marginTop: 9,
      flexWrap: "wrap"
    }
  }, shown.map((c, i) => /*#__PURE__*/React.createElement(HrCard, {
    key: i,
    c: c,
    mine: holeKey.indexOf(String(c.r) + c.s) >= 0
  })), !preflop && /*#__PURE__*/React.createElement("span", {
    style: {
      marginLeft: 4,
      fontFamily: HRANK_MONO,
      fontWeight: 700,
      fontSize: 12,
      letterSpacing: ".1em",
      color: "#fff"
    }
  }, (HR_LIST.find(h => h.id === mineId) || {}).name)), !preflop && shown.some(c => holeKey.indexOf(String(c.r) + c.s) >= 0) && /*#__PURE__*/React.createElement("div", {
    style: {
      marginTop: 8,
      fontFamily: HRANK_SANS,
      fontWeight: 600,
      fontSize: 10.5,
      color: "#8A8A93"
    }
  }, "Your two cards are outlined in green"), !preflop && !shown.some(c => holeKey.indexOf(String(c.r) + c.s) >= 0) && /*#__PURE__*/React.createElement("div", {
    style: {
      marginTop: 8,
      fontFamily: HRANK_SANS,
      fontWeight: 600,
      fontSize: 10.5,
      color: "#8A8A93"
    }
  }, "The board plays \u2014 none of your cards are in this hand"))), /*#__PURE__*/React.createElement("div", {
    style: {
      flex: 1,
      minHeight: 0,
      overflowY: "auto",
      WebkitOverflowScrolling: "touch",
      padding: "0 16px calc(24px + env(safe-area-inset-bottom))",
      display: "flex",
      flexDirection: "column",
      gap: 7
    }
  }, HR_LIST.map((h, i) => {
    const on = h.id === mineId;
    return /*#__PURE__*/React.createElement("div", {
      key: h.id,
      style: {
        display: "flex",
        alignItems: "center",
        gap: 11,
        padding: "11px 13px",
        borderRadius: 14,
        background: on ? "linear-gradient(150deg, rgba(91,217,106,.22), rgba(91,217,106,.06) 52%, #0c0c0f 92%)" : "rgba(255,255,255,.045)",
        border: on ? "1px solid rgba(91,217,106,.6)" : "1px solid rgba(255,255,255,.09)"
      }
    }, /*#__PURE__*/React.createElement("span", {
      style: {
        flex: "none",
        width: 22,
        textAlign: "center",
        fontFamily: HRANK_MONO,
        fontWeight: 700,
        fontSize: 11,
        color: on ? "#5BD96A" : "#6A6A72"
      }
    }, i + 1), /*#__PURE__*/React.createElement("span", {
      style: {
        flex: 1,
        minWidth: 0
      }
    }, /*#__PURE__*/React.createElement("span", {
      style: {
        display: "block",
        fontFamily: HRANK_MONO,
        fontWeight: 700,
        fontSize: 12,
        letterSpacing: ".08em",
        color: on ? "#fff" : "#D8D8DF"
      }
    }, h.name), /*#__PURE__*/React.createElement("span", {
      style: {
        display: "block",
        fontFamily: HRANK_SANS,
        fontWeight: 500,
        fontSize: 10.5,
        color: "#8A8A93",
        marginTop: 3
      }
    }, h.note)), on && /*#__PURE__*/React.createElement("span", {
      style: {
        flex: "none",
        padding: "4px 9px",
        borderRadius: 125,
        background: "rgba(91,217,106,.2)",
        border: "1px solid rgba(91,217,106,.7)",
        fontFamily: HRANK_SANS,
        fontWeight: 700,
        fontSize: 9,
        letterSpacing: ".12em",
        color: "#5BD96A",
        whiteSpace: "nowrap"
      }
    }, "MY HAND"));
  }))));
}
Object.assign(window, {
  HandRanksSheet,
  hrEvaluate
});