// Hand detail — one hand, street by street, opened from HAND HISTORY.
// Structure follows the room's vertical layout: meta strip, street jump tabs,
// a card per street (board on the right, action rows under it) and a SUMMARY
// card with the total pot and every player's result. Design is ours.

const MONO_HD = UI.font;
const SANS_HD = UI.fontUI;
const HD_POS = ["UTG", "UTG+1", "CO", "BTN", "SB", "BB"];
const HD_NAMES = ["mokuoha", "TRAMOLLERO", "aegbtc", "ShabbaMatty", "slanting99", "sweltering125"];
const HD_RANKS = ["A", "K", "Q", "J", "T", "9", "8", "7", "6", "5", "4", "3", "2"];
const HD_SUITS = ["spade", "heart", "diamond", "club"];
const hdRand = seed => {
  const x = Math.sin(seed) * 10000;
  return x - Math.floor(x);
};
const hdClick = f => {
  if (window.playClick) window.playClick(f || 1100, 0.04);
};
const hdMoney = n => "$" + (Math.round(n * 100) / 100).toFixed(2);

// action vocabulary — one colour per verb, shared by rows and the summary
const HD_ACT = {
  CHECK: {
    c: "#21C97B",
    solid: false
  },
  CALL: {
    c: "#3B82F6",
    solid: false
  },
  BET: {
    c: "#f0c75e",
    solid: false
  },
  RAISE: {
    c: "#f0c75e",
    solid: true
  },
  FOLD: {
    c: "rgba(255,255,255,.42)",
    solid: false
  },
  "ALL-IN": {
    c: "#D71921",
    solid: true
  }
};

// a hand is generated once from its seed so replays and rows always agree
function hdBuild(hand, seedIdx) {
  const r = k => hdRand(seedIdx * 3.77 + k);
  const bb = Number(String(hand.stakes).split("/").pop().replace(/[^0-9.]/g, "")) || 1;
  const sb = bb / 2;
  const nCards = hand.disc === "PLO6" ? 6 : hand.disc === "PLO" ? 4 : 2;
  const used = {};
  const draw = k => {
    for (let a = 0; a < 40; a++) {
      const c = {
        r: HD_RANKS[Math.floor(r(k + a * 1.31) * HD_RANKS.length)],
        s: HD_SUITS[Math.floor(r(k + 50 + a * 0.77) * 4)]
      };
      const key = c.r + c.s;
      if (!used[key]) {
        used[key] = 1;
        return c;
      }
    }
    return {
      r: "A",
      s: "spade"
    };
  };
  const heroSeat = Math.floor(r(1) * 6);
  const players = HD_POS.map((pos, i) => ({
    pos,
    name: i === heroSeat ? "SASHA02" : HD_NAMES[i],
    hero: i === heroSeat,
    cards: i === heroSeat ? hand.cards : Array.from({
      length: nCards
    }, (_, c) => draw(200 + i * 13 + c)),
    put: 0,
    live: true,
    shown: i === heroSeat
  }));
  const board = Array.from({
    length: 5
  }, (_, i) => draw(700 + i * 9));

  // preflop: blinds, one raiser, a caller or two, the rest fold
  players[4].put = sb;
  players[5].put = bb;
  let pot = sb + bb;
  const order = [0, 1, 2, 3, 4, 5];
  const raiseTo = Math.round(bb * (2.2 + r(2) * 1.6) * 100) / 100;
  const commit = (p, to) => {
    pot = Math.round((pot + (to - p.put)) * 100) / 100;
    p.put = to;
  };
  const raiser = Math.floor(r(3) * 4);
  const streets = [];
  const pre = [];
  order.forEach(i => {
    const p = players[i];
    if (i === raiser) {
      pre.push({
        p,
        act: "RAISE",
        amt: raiseTo
      });
      commit(p, raiseTo);
      return;
    }
    const call = p.hero || r(10 + i) > 0.58;
    if (call && i !== raiser) {
      pre.push({
        p,
        act: "CALL",
        amt: raiseTo
      });
      commit(p, raiseTo);
      return;
    }
    if (i === 5 && !call) {
      pre.push({
        p,
        act: "FOLD"
      });
      p.live = false;
      return;
    }
    pre.push({
      p,
      act: "FOLD"
    });
    p.live = false;
  });
  if (players.filter(p => p.live).length < 2) {
    players[raiser].live = true;
    players[5].live = true;
  }
  streets.push({
    name: "PREFLOP",
    cards: 0,
    rows: pre,
    pot
  });

  // postflop: acting order starts at the SB, checks and one bettor per street
  const post = [4, 5, 0, 1, 2, 3];
  ["FLOP", "TURN", "RIVER"].forEach((name, si) => {
    const live = post.map(i => players[i]).filter(p => p.live);
    if (live.length < 2) return;
    const rows = [],
      street = {};
    const bettorIdx = r(20 + si) > 0.35 ? Math.floor(r(30 + si) * live.length) : -1;
    const bet = Math.round(pot * (0.4 + r(40 + si) * 0.5) * 100) / 100;
    let raised = false;
    live.forEach((p, k) => {
      if (!raised && k === bettorIdx) {
        const allIn = si === 2 && r(60) > 0.72;
        const size = allIn ? Math.round(pot * 1.6 * 100) / 100 : bet;
        rows.push({
          p,
          act: allIn ? "ALL-IN" : "BET",
          amt: size
        });
        commit(p, Math.round((p.put + size) * 100) / 100);
        street.size = size;
        raised = true;
        return;
      }
      if (!raised) {
        rows.push({
          p,
          act: "CHECK"
        });
        return;
      }
      const owed = street.size || bet;
      if (r(70 + si * 7 + k) > 0.45) {
        rows.push({
          p,
          act: "CALL",
          amt: owed
        });
        commit(p, Math.round((p.put + owed) * 100) / 100);
      } else {
        rows.push({
          p,
          act: "FOLD"
        });
        p.live = false;
      }
    });
    streets.push({
      name,
      cards: si + 3,
      rows,
      pot: Math.round(pot * 100) / 100
    });
  });

  // results: the hero's row matches the list, everyone else splits the rest
  const live = players.filter(p => p.live);
  const hero = players.find(p => p.hero);
  const heroWins = hand.won && hero.live;
  const winner = heroWins ? hero : live.find(p => !p.hero) || live[0];
  pot = Math.round(pot * 100) / 100;
  const results = players.map(p => {
    const put = Math.round(p.put * 100) / 100;
    if (p === winner) return {
      p,
      delta: Math.round((pot - put) * 100) / 100,
      won: true,
      shown: true
    };
    return {
      p,
      delta: put ? -put : 0,
      won: false,
      shown: p.hero || p.live && r(90) > 0.5
    };
  });
  return {
    players,
    board,
    streets,
    pot,
    results,
    bb,
    sb,
    winner,
    hero,
    heroDelta: (results.find(x => x.p.hero) || {}).delta || 0,
    heroWon: winner === hero
  };
}
const HD_CACHE = {};
function hdSim(hand) {
  if (!hand) return null;
  if (hand.replayData) return hand.replayData;
  const key = String(hand.id);
  if (!HD_CACHE[key]) HD_CACHE[key] = hdBuild(hand, Number(key.replace(/\D/g, "")) || 1);
  return HD_CACHE[key];
}
function HdCard({
  c,
  w = 26,
  hidden = false,
  glow = null
}) {
  if (hidden) {
    return /*#__PURE__*/React.createElement("span", {
      style: {
        display: "inline-block",
        width: w,
        height: Math.round(w * 1.4),
        borderRadius: 4,
        background: "linear-gradient(150deg,#3a1015,#1b0a0c)",
        border: "1px solid rgba(215,25,33,.5)"
      }
    });
  }
  const red = c.s === "heart" || c.s === "diamond";
  return /*#__PURE__*/React.createElement("span", {
    style: {
      display: "inline-flex",
      flexDirection: "column",
      alignItems: "center",
      justifyContent: "center",
      gap: 1,
      width: w,
      height: Math.round(w * 1.4),
      borderRadius: 4,
      background: "#fff",
      flex: "none",
      boxShadow: glow ? `0 0 0 1.5px ${glow}, 0 2px 6px rgba(0,0,0,.5)` : "0 2px 6px rgba(0,0,0,.5)"
    }
  }, /*#__PURE__*/React.createElement("span", {
    style: {
      fontFamily: MONO_HD,
      fontWeight: 700,
      fontSize: Math.round(w * 0.5),
      lineHeight: 1,
      color: red ? "#D71921" : "#111"
    }
  }, c.r), window.Suit ? /*#__PURE__*/React.createElement(window.Suit, {
    kind: c.s,
    size: Math.round(w * 0.38),
    color: red ? "#D71921" : "#111"
  }) : null);
}
function HdActionChip({
  act,
  amt
}) {
  const A = HD_ACT[act] || HD_ACT.FOLD;
  return /*#__PURE__*/React.createElement("span", {
    style: {
      display: "flex",
      flexDirection: "column",
      alignItems: "flex-end",
      gap: 3,
      flex: "none"
    }
  }, /*#__PURE__*/React.createElement("span", {
    style: {
      padding: "4px 10px",
      borderRadius: 8,
      background: A.solid ? A.c : `${A.c === "rgba(255,255,255,.42)" ? "rgba(255,255,255,.09)" : A.c + "26"}`,
      border: `1px solid ${A.solid ? A.c : A.c === "rgba(255,255,255,.42)" ? "rgba(255,255,255,.16)" : A.c + "59"}`,
      fontFamily: SANS_HD,
      fontWeight: 700,
      fontSize: 12,
      letterSpacing: ".12em",
      color: A.solid ? "#fff" : A.c
    }
  }, act), amt != null && /*#__PURE__*/React.createElement("span", {
    style: {
      fontFamily: MONO_HD,
      fontWeight: 700,
      fontSize: 12,
      color: "#D8D8DF",
      fontVariantNumeric: "tabular-nums"
    }
  }, hdMoney(amt)));
}
function HdRow({
  row,
  accent,
  last
}) {
  const p = row.p;
  return /*#__PURE__*/React.createElement("div", {
    style: {
      display: "flex",
      alignItems: "center",
      gap: 10,
      padding: "9px 12px",
      borderTop: last ? 0 : "1px solid rgba(255,255,255,.06)"
    }
  }, /*#__PURE__*/React.createElement("span", {
    style: {
      flex: 1,
      minWidth: 0
    }
  }, /*#__PURE__*/React.createElement("span", {
    style: {
      display: "inline-block",
      padding: "2px 7px",
      borderRadius: 6,
      marginBottom: 4,
      background: p.hero ? `${accent}2b` : "rgba(255,255,255,.08)",
      border: `1px solid ${p.hero ? accent + "66" : "rgba(255,255,255,.13)"}`,
      fontFamily: MONO_HD,
      fontWeight: 700,
      fontSize: 12,
      letterSpacing: ".1em",
      color: p.hero ? accent : "rgba(255,255,255,.6)"
    }
  }, p.pos), /*#__PURE__*/React.createElement("span", {
    style: {
      display: "block",
      fontFamily: SANS_HD,
      fontWeight: p.hero ? 700 : 600,
      fontSize: 12,
      color: p.hero ? "#fff" : "rgba(255,255,255,.78)",
      whiteSpace: "nowrap",
      overflow: "hidden",
      textOverflow: "ellipsis"
    }
  }, p.name, p.hero ? " · YOU" : "")), /*#__PURE__*/React.createElement(HdActionChip, {
    act: row.act,
    amt: row.amt
  }));
}
function HdStreet({
  st,
  board,
  hero,
  accent,
  refFn
}) {
  const shown = board.slice(0, st.cards);
  return /*#__PURE__*/React.createElement("div", {
    ref: refFn,
    style: {
      borderRadius: 16,
      overflow: "hidden",
      background: "linear-gradient(150deg,#141419 0%,#0c0c0f 62%,#0a0a0c 100%)",
      border: "1px solid rgba(255,255,255,.08)",
      marginBottom: 12
    }
  }, /*#__PURE__*/React.createElement("div", {
    style: {
      display: "flex",
      alignItems: "center",
      gap: 12,
      padding: "13px 12px 12px"
    }
  }, /*#__PURE__*/React.createElement("span", {
    style: {
      flex: 1,
      fontFamily: MONO_HD,
      fontSize: 12,
      letterSpacing: ".2em",
      color: "#fff"
    }
  }, st.name), /*#__PURE__*/React.createElement("span", {
    style: {
      display: "flex",
      flexDirection: "column",
      alignItems: "flex-end",
      gap: 5
    }
  }, shown.length > 0 && /*#__PURE__*/React.createElement("span", {
    style: {
      display: "flex",
      gap: 4
    }
  }, shown.map((c, i) => /*#__PURE__*/React.createElement(HdCard, {
    key: i,
    c: c
  }))), hero && /*#__PURE__*/React.createElement("span", {
    style: {
      display: "flex",
      gap: 4
    }
  }, hero.cards.map((c, i) => /*#__PURE__*/React.createElement(HdCard, {
    key: i,
    c: c,
    w: hero.cards.length > 4 ? 21 : 26,
    glow: accent
  }))))), /*#__PURE__*/React.createElement("div", {
    style: {
      padding: "0 0 4px",
      background: "rgba(0,0,0,.28)"
    }
  }, st.rows.map((row, i) => /*#__PURE__*/React.createElement(HdRow, {
    key: i,
    row: row,
    accent: accent,
    last: i === 0
  }))), /*#__PURE__*/React.createElement("div", {
    style: {
      display: "flex",
      alignItems: "center",
      justifyContent: "space-between",
      padding: "9px 12px",
      borderTop: "1px solid rgba(255,255,255,.07)"
    }
  }, /*#__PURE__*/React.createElement("span", {
    style: {
      fontFamily: SANS_HD,
      fontWeight: 700,
      fontSize: 12,
      letterSpacing: ".18em",
      color: "#8A8A93"
    }
  }, "POT AFTER " + st.name), /*#__PURE__*/React.createElement("span", {
    style: {
      fontFamily: MONO_HD,
      fontWeight: 700,
      fontSize: 12,
      color: "#fff",
      fontVariantNumeric: "tabular-nums"
    }
  }, hdMoney(st.pot))));
}
function HandDetailScreen({
  open,
  hand,
  index = 0,
  total = 0,
  onClose,
  onPrev,
  onNext,
  onReplay,
  accent = "#D71921"
}) {
  const [mounted, setMounted] = React.useState(false);
  const [tab, setTab] = React.useState("PREFLOP");
  const [saved, setSaved] = React.useState(false);
  const scroller = React.useRef(null);
  const marks = React.useRef({});
  const spy = React.useRef(0);
  React.useEffect(() => {
    if (!open) {
      setMounted(false);
      return;
    }
    setTab("PREFLOP");
    setSaved(false);
    if (scroller.current) scroller.current.scrollTop = 0;
    const r = requestAnimationFrame(() => setMounted(true));
    return () => cancelAnimationFrame(r);
  }, [open, hand && hand.id]);
  React.useEffect(() => () => {
    if (spy.current) cancelAnimationFrame(spy.current);
  }, []);
  if (!open || !hand) return null;
  const H = hdSim(hand);
  const hero = H.hero;
  const tabs = H.streets.map(s => s.name).concat("SUMMARY");
  const jump = name => {
    hdClick(1150);
    setTab(name);
    const el = marks.current[name],
      sc = scroller.current;
    if (el && sc) sc.scrollTo({
      top: Math.max(0, el.offsetTop - 8),
      behavior: "smooth"
    });
  };
  const onScroll = () => {
    if (spy.current) return;
    spy.current = requestAnimationFrame(() => {
      spy.current = 0;
      const sc = scroller.current;
      if (!sc) return;
      let cur = tabs[0];
      tabs.forEach(n => {
        const el = marks.current[n];
        if (el && el.offsetTop - 40 <= sc.scrollTop) cur = n;
      });
      setTab(prev => prev === cur ? prev : cur);
    });
  };
  return /*#__PURE__*/React.createElement("div", {
    "data-hand-detail": "true",
    role: "dialog",
    "aria-label": "\u0414\u0435\u0442\u0430\u043B\u0438 \u0440\u0430\u0437\u0434\u0430\u0447\u0438",
    style: {
      position: "absolute",
      inset: 0,
      zIndex: 66,
      background: "#000",
      display: "flex",
      flexDirection: "column",
      transform: mounted ? "translateX(0)" : "translateX(100%)",
      transition: "transform 320ms cubic-bezier(0.2,0.8,0.2,1)"
    }
  }, /*#__PURE__*/React.createElement("div", {
    style: {
      position: "absolute",
      top: 0,
      left: 0,
      right: 0,
      height: 200,
      pointerEvents: "none",
      background: `radial-gradient(ellipse 90% 70% at 50% 0%, ${accent}22, transparent 62%)`
    }
  }), /*#__PURE__*/React.createElement("div", {
    className: "pd-screen-header",
    style: {
      position: "relative",
      zIndex: 5,
      paddingTop: 62,
      paddingLeft: 14,
      paddingRight: 14,
      paddingBottom: 8,
      display: "flex",
      alignItems: "center",
      gap: 10
    }
  }, /*#__PURE__*/React.createElement("button", {
    onClick: () => {
      hdClick(900);
      onClose();
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
      fontFamily: MONO_HD,
      fontWeight: 700,
      fontSize: 15,
      color: "#fff",
      letterSpacing: ".16em"
    }
  }, "HAND DETAIL"), /*#__PURE__*/React.createElement("button", {
    onClick: () => {
      hdClick(1200);
      if (window.showShareImage) window.showShareImage({
        selector: "[data-hand-card]",
        accent,
        foot: hand.disc + " · " + hand.stakes,
        text: "Think you can beat that? Take a seat."
      });
    },
    "aria-label": "Share hand",
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
    width: "15",
    height: "15",
    viewBox: "0 0 24 24",
    fill: "none",
    stroke: "#fff",
    strokeWidth: "2",
    strokeLinecap: "round",
    strokeLinejoin: "round"
  }, /*#__PURE__*/React.createElement("path", {
    d: "M4 12v7a1 1 0 0 0 1 1h14a1 1 0 0 0 1-1v-7"
  }), /*#__PURE__*/React.createElement("path", {
    d: "M16 6l-4-4-4 4"
  }), /*#__PURE__*/React.createElement("path", {
    d: "M12 2v13"
  }))), /*#__PURE__*/React.createElement("button", {
    onClick: () => {
      hdClick(1250);
      setSaved(!saved);
    },
    "aria-label": "Save hand",
    style: {
      flex: "none",
      width: 36,
      height: 36,
      borderRadius: 12,
      background: saved ? `${accent}2b` : "rgba(255,255,255,.085)",
      border: `1px solid ${saved ? accent + "88" : "rgba(255,255,255,.18)"}`,
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
    fill: saved ? accent : "none",
    stroke: saved ? accent : "#fff",
    strokeWidth: "2.2",
    strokeLinecap: "round",
    strokeLinejoin: "round"
  }, /*#__PURE__*/React.createElement("path", {
    d: "M19 21l-7-5-7 5V5a2 2 0 012-2h10a2 2 0 012 2z"
  })))), /*#__PURE__*/React.createElement("div", {
    style: {
      position: "relative",
      zIndex: 4,
      display: "flex",
      alignItems: "center",
      gap: 10,
      padding: "2px 16px 10px"
    }
  }, /*#__PURE__*/React.createElement("span", {
    style: {
      flex: 1,
      minWidth: 0,
      fontFamily: SANS_HD,
      fontWeight: 700,
      fontSize: 12,
      letterSpacing: ".1em",
      color: "#D8D8DF",
      whiteSpace: "nowrap",
      overflow: "hidden",
      textOverflow: "ellipsis"
    }
  }, hand.disc, " \xB7 ", hand.stakes), /*#__PURE__*/React.createElement("span", {
    style: {
      flex: "none",
      fontFamily: MONO_HD,
      fontSize: 12,
      color: "#8A8A93",
      fontVariantNumeric: "tabular-nums"
    }
  }, "#", 1214933000 + (Number(String(hand.id).replace(/\D/g, "")) || 0) * 37)), /*#__PURE__*/React.createElement("div", {
    style: {
      position: "relative",
      zIndex: 4,
      display: "flex",
      gap: 6,
      padding: "0 16px 10px",
      overflowX: "auto",
      scrollbarWidth: "none"
    }
  }, tabs.map(n => {
    const on = n === tab;
    return /*#__PURE__*/React.createElement("button", {
      key: n,
      onClick: () => jump(n),
      style: {
        flex: "none",
        height: 30,
        padding: "0 12px",
        borderRadius: 125,
        cursor: "pointer",
        background: on ? accent : "rgba(255,255,255,.055)",
        border: `1px solid ${on ? accent : "rgba(255,255,255,.14)"}`,
        fontFamily: SANS_HD,
        fontWeight: 700,
        fontSize: 12,
        letterSpacing: ".14em",
        color: on ? "#fff" : "rgba(255,255,255,.58)"
      }
    }, n);
  })), /*#__PURE__*/React.createElement("div", {
    ref: scroller,
    onScroll: onScroll,
    style: {
      flex: 1,
      minHeight: 0,
      overflowY: "auto",
      WebkitOverflowScrolling: "touch",
      position: "relative",
      zIndex: 2,
      padding: "0 16px 96px"
    }
  }, H.streets.map(st => /*#__PURE__*/React.createElement(HdStreet, {
    key: st.name,
    st: st,
    board: H.board,
    accent: accent,
    hero: st.name === "PREFLOP" ? hero : null,
    refFn: el => {
      marks.current[st.name] = el;
    }
  })), /*#__PURE__*/React.createElement("div", {
    "data-hand-card": "1",
    ref: el => {
      marks.current.SUMMARY = el;
    },
    style: {
      borderRadius: 16,
      overflow: "hidden",
      background: "linear-gradient(150deg,#141419 0%,#0c0c0f 62%,#0a0a0c 100%)",
      border: "1px solid rgba(255,255,255,.08)"
    }
  }, /*#__PURE__*/React.createElement("div", {
    style: {
      display: "flex",
      alignItems: "center",
      gap: 12,
      padding: "13px 12px 12px"
    }
  }, /*#__PURE__*/React.createElement("span", {
    style: {
      flex: 1,
      fontFamily: MONO_HD,
      fontSize: 12,
      letterSpacing: ".2em",
      color: "#fff"
    }
  }, "SUMMARY"), /*#__PURE__*/React.createElement("span", {
    style: {
      display: "flex",
      gap: 4
    }
  }, H.board.map((c, i) => /*#__PURE__*/React.createElement(HdCard, {
    key: i,
    c: c,
    w: 24
  })))), /*#__PURE__*/React.createElement("div", {
    style: {
      display: "flex",
      alignItems: "center",
      justifyContent: "space-between",
      padding: "10px 12px",
      background: "rgba(0,0,0,.3)",
      borderTop: "1px solid rgba(255,255,255,.07)"
    }
  }, /*#__PURE__*/React.createElement("span", {
    style: {
      fontFamily: SANS_HD,
      fontWeight: 700,
      fontSize: 12,
      letterSpacing: ".18em",
      color: "#A9A9B2"
    }
  }, "TOTAL POT"), /*#__PURE__*/React.createElement("span", {
    style: {
      fontFamily: MONO_HD,
      fontWeight: 700,
      fontSize: 15,
      color: "#fff",
      fontVariantNumeric: "tabular-nums"
    }
  }, hdMoney(H.pot))), H.results.map((rs, i) => {
    const p = rs.p;
    return /*#__PURE__*/React.createElement("div", {
      key: p.pos,
      style: {
        display: "flex",
        alignItems: "center",
        gap: 10,
        padding: "10px 12px",
        borderTop: "1px solid rgba(255,255,255,.06)",
        background: p.hero ? `${accent}0f` : "transparent"
      }
    }, /*#__PURE__*/React.createElement("span", {
      style: {
        flex: 1,
        minWidth: 0
      }
    }, /*#__PURE__*/React.createElement("span", {
      style: {
        display: "inline-block",
        padding: "2px 7px",
        borderRadius: 6,
        marginBottom: 4,
        background: p.hero ? `${accent}2b` : "rgba(255,255,255,.08)",
        border: `1px solid ${p.hero ? accent + "66" : "rgba(255,255,255,.13)"}`,
        fontFamily: MONO_HD,
        fontWeight: 700,
        fontSize: 12,
        letterSpacing: ".1em",
        color: p.hero ? accent : "rgba(255,255,255,.6)"
      }
    }, p.pos), /*#__PURE__*/React.createElement("span", {
      style: {
        display: "block",
        fontFamily: SANS_HD,
        fontWeight: p.hero ? 700 : 600,
        fontSize: 12,
        color: p.hero ? "#fff" : "rgba(255,255,255,.78)",
        whiteSpace: "nowrap",
        overflow: "hidden",
        textOverflow: "ellipsis"
      }
    }, p.name, p.hero ? " · YOU" : ""), /*#__PURE__*/React.createElement("span", {
      style: {
        display: "flex",
        gap: 3,
        marginTop: 6
      }
    }, p.cards.map((c, k) => /*#__PURE__*/React.createElement(HdCard, {
      key: k,
      c: c,
      w: p.cards.length > 4 ? 19 : 22,
      hidden: !rs.shown,
      glow: p.hero ? accent : null
    })))), /*#__PURE__*/React.createElement("span", {
      style: {
        flex: "none",
        display: "flex",
        flexDirection: "column",
        alignItems: "flex-end",
        gap: 5
      }
    }, /*#__PURE__*/React.createElement("span", {
      style: {
        fontFamily: MONO_HD,
        fontWeight: 700,
        fontSize: 13,
        fontVariantNumeric: "tabular-nums",
        color: rs.delta > 0 ? "#5BD96A" : rs.delta < 0 ? "rgba(255,255,255,.55)" : "rgba(255,255,255,.32)"
      }
    }, (rs.delta > 0 ? "+" : rs.delta < 0 ? "\u2212" : "") + hdMoney(Math.abs(rs.delta))), rs.won && /*#__PURE__*/React.createElement("span", {
      style: {
        padding: "3px 8px",
        borderRadius: 6,
        background: "#5BD96A22",
        border: "1px solid #5BD96A59",
        fontFamily: SANS_HD,
        fontWeight: 700,
        fontSize: 12,
        letterSpacing: ".12em",
        color: "#5BD96A"
      }
    }, "WON"), !rs.won && !p.live && /*#__PURE__*/React.createElement("span", {
      style: {
        padding: "3px 8px",
        borderRadius: 6,
        background: "rgba(255,255,255,.07)",
        border: "1px solid rgba(255,255,255,.14)",
        fontFamily: SANS_HD,
        fontWeight: 700,
        fontSize: 12,
        letterSpacing: ".12em",
        color: "#8A8A93"
      }
    }, "FOLD")));
  }))), /*#__PURE__*/React.createElement("div", {
    style: {
      position: "absolute",
      left: 0,
      right: 0,
      bottom: 0,
      zIndex: 8,
      padding: "10px 16px 22px",
      background: "linear-gradient(180deg, rgba(0,0,0,0) 0%, #000 42%)",
      display: "flex",
      alignItems: "center",
      gap: 10
    }
  }, /*#__PURE__*/React.createElement("button", {
    onClick: () => {
      hdClick(950);
      onPrev && onPrev();
    },
    disabled: index <= 0,
    "aria-label": "Previous hand",
    style: {
      flex: "none",
      width: 40,
      height: 40,
      borderRadius: 12,
      cursor: index <= 0 ? "default" : "pointer",
      padding: 0,
      opacity: index <= 0 ? .35 : 1,
      background: "rgba(255,255,255,.07)",
      border: "1px solid rgba(255,255,255,.15)",
      display: "flex",
      alignItems: "center",
      justifyContent: "center"
    }
  }, /*#__PURE__*/React.createElement("svg", {
    width: "15",
    height: "15",
    viewBox: "0 0 24 24",
    fill: "none",
    stroke: "#fff",
    strokeWidth: "2.6",
    strokeLinecap: "round",
    strokeLinejoin: "round"
  }, /*#__PURE__*/React.createElement("path", {
    d: "M15 6l-6 6 6 6"
  }))), /*#__PURE__*/React.createElement("button", {
    onClick: () => {
      hdClick(1300);
      onReplay && onReplay();
    },
    style: {
      flex: 1,
      height: 44,
      borderRadius: 14,
      cursor: "pointer",
      border: 0,
      background: accent,
      color: "#fff",
      boxShadow: `0 8px 22px ${accent}55`,
      display: "flex",
      alignItems: "center",
      justifyContent: "center",
      gap: 8,
      fontFamily: SANS_HD,
      fontWeight: 700,
      fontSize: 12,
      letterSpacing: ".16em"
    }
  }, /*#__PURE__*/React.createElement("svg", {
    width: "14",
    height: "14",
    viewBox: "0 0 24 24",
    fill: "#fff"
  }, /*#__PURE__*/React.createElement("path", {
    d: "M8 5l11 7-11 7z"
  })), "REPLAY HAND"), /*#__PURE__*/React.createElement("button", {
    onClick: () => {
      hdClick(950);
      onNext && onNext();
    },
    disabled: index >= total - 1,
    "aria-label": "Next hand",
    style: {
      flex: "none",
      width: 40,
      height: 40,
      borderRadius: 12,
      cursor: index >= total - 1 ? "default" : "pointer",
      padding: 0,
      opacity: index >= total - 1 ? .35 : 1,
      background: "rgba(255,255,255,.07)",
      border: "1px solid rgba(255,255,255,.15)",
      display: "flex",
      alignItems: "center",
      justifyContent: "center"
    }
  }, /*#__PURE__*/React.createElement("svg", {
    width: "15",
    height: "15",
    viewBox: "0 0 24 24",
    fill: "none",
    stroke: "#fff",
    strokeWidth: "2.6",
    strokeLinecap: "round",
    strokeLinejoin: "round"
  }, /*#__PURE__*/React.createElement("path", {
    d: "M9 6l6 6-6 6"
  })))));
}
Object.assign(window, {
  HandDetailScreen,
  HdCard,
  hdSim
});