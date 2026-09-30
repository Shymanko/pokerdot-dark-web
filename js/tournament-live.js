// tournament-live.jsx — RUNNING-event layer for TournamentDetail.
// Everything derives from ONE clock (LIVE_T0): elapsed, level, blinds, level
// countdown, next break, late-reg end — all consistent with the 6-min structure.
const MONO_L = UI.font;
const SANS_L = UI.fontUI;
const fN = n => Math.round(n).toLocaleString("en-US").split(",").join("\u00A0");
const LIVE_T0 = Date.now() - (31 * 60 + 17) * 1000; // started 00:31:17 ago
const L_SB = [50, 60, 70, 80, 100, 125, 150, 175, 200, 225, 250, 300, 350, 400, 500, 600, 800, 1000, 1250, 1500, 1750, 2000, 2500, 3000];
const L_LEVEL_S = 360,
  L_BREAK_S = 3300,
  L_LATE_S = 3600;

// static field state (one snapshot, self-consistent):
// 66 entries = 37 buy-ins + 29 re-entries → 660 000 chips; 22 alive
const MTT_LIVE = {
  entries: 66,
  buyIns: 37,
  reEntries: 29,
  left: 22,
  minStack: 5425,
  avgStack: 30000,
  maxStack: 87250,
  seats: 7,
  remainder: 2500000,
  // satellite prize split when the event feeds a target
  players: [{
    r: 1,
    nick: "DiDikiy",
    re: 0,
    chips: 87250,
    tb: 3
  }, {
    r: 2,
    nick: "Adikus",
    re: 0,
    chips: 64120,
    tb: 19
  }, {
    r: 3,
    nick: "i_sho",
    re: 1,
    chips: 51800,
    tb: 21
  }, {
    r: 4,
    nick: "Shampur7777",
    re: 3,
    chips: 44834,
    tb: 3
  }, {
    r: 5,
    nick: "Igor44444",
    re: 0,
    chips: 38626,
    tb: 19
  }, {
    r: 6,
    nick: "vovan_141",
    re: 3,
    chips: 35562,
    tb: 21
  }, {
    r: 7,
    nick: "VEZUJIU777",
    re: 0,
    chips: 31042,
    tb: 3
  }, {
    r: 8,
    nick: "DIPLOMAT777",
    re: 2,
    chips: 29196,
    tb: 19
  }, {
    r: 9,
    nick: "HellYep",
    re: 7,
    chips: 24060,
    tb: 21
  }, {
    r: 10,
    nick: "dementor8",
    re: 3,
    chips: 21010,
    tb: 3
  }],
  moreAlive: 12,
  busted: [{
    r: 23,
    nick: "Fishman8603",
    re: 0
  }, {
    r: 24,
    nick: "P3213-8150",
    re: 0
  }, {
    r: 25,
    nick: "Barik17",
    re: 4
  }, {
    r: 26,
    nick: "Vakho7878",
    re: 0
  }, {
    r: 27,
    nick: "mrzver97s",
    re: 0
  }, {
    r: 28,
    nick: "IraShkira",
    re: 2
  }],
  tables: [{
    id: 3,
    seats: 8,
    big: 87250,
    small: 5425
  }, {
    id: 19,
    seats: 7,
    big: 64120,
    small: 8950
  }, {
    id: 21,
    seats: 7,
    big: 51800,
    small: 6240
  }]
};
const liveBB = () => L_SB[Math.min(L_SB.length - 1, Math.floor((Date.now() - LIVE_T0) / 1000 / L_LEVEL_S))] * 2;
const inBB = chips => (chips / liveBB()).toFixed(chips / liveBB() >= 100 ? 0 : 1);
function useLiveClock() {
  const calc = () => Math.floor((Date.now() - LIVE_T0) / 1000);
  const [el, setEl] = React.useState(calc);
  React.useEffect(() => {
    const t = setInterval(() => setEl(calc()), 1000);
    return () => clearInterval(t);
  }, []);
  const pad = n => String(n).padStart(2, "0");
  const hms = s => `${pad(Math.floor(s / 3600))}:${pad(Math.floor(s % 3600 / 60))}:${pad(s % 60)}`;
  const ms = s => `${pad(Math.floor(s / 60))}:${pad(s % 60)}`;
  const lvl = Math.min(L_SB.length, Math.floor(el / L_LEVEL_S) + 1);
  const sb = L_SB[lvl - 1],
    nsb = L_SB[Math.min(L_SB.length - 1, lvl)];
  return {
    elapsed: hms(el),
    level: lvl,
    blinds: `${fN(sb)} / ${fN(sb * 2)}`,
    ante: fN(Math.round(sb * 0.3)),
    nextBlinds: `${fN(nsb)} / ${fN(nsb * 2)}`,
    nextAnte: fN(Math.round(nsb * 0.3)),
    levelLeft: ms(L_LEVEL_S - el % L_LEVEL_S),
    breakIn: ms(Math.max(0, L_BREAK_S - el % L_BREAK_S)),
    lateLeft: Math.max(0, L_LATE_S - el),
    lateStr: ms(Math.max(0, L_LATE_S - el))
  };
}
const LK = {
  fontFamily: SANS_L,
  fontWeight: 700,
  fontSize: 10.5,
  letterSpacing: ".14em",
  color: "#A9A9B2"
};
const LV = {
  fontFamily: MONO_L,
  fontSize: 13,
  color: "#fff",
  fontVariantNumeric: "tabular-nums"
};

// ── card 1+2: RUNNING status · level clock · entries · stacks ──
function LiveStatusCards({
  accent,
  entries
}) {
  const c = useLiveClock();
  const M = MTT_LIVE;
  const tot = entries || M.entries;
  const Cell = ({
    k,
    v,
    sub,
    cv
  }) => /*#__PURE__*/React.createElement("div", {
    style: {
      minWidth: 0
    }
  }, /*#__PURE__*/React.createElement("div", {
    style: LK
  }, k), /*#__PURE__*/React.createElement("div", {
    style: {
      ...LV,
      fontSize: 14,
      marginTop: 4,
      color: cv || "#fff",
      whiteSpace: "nowrap"
    }
  }, v), sub ? /*#__PURE__*/React.createElement("div", {
    style: {
      ...LK,
      fontSize: 10.5,
      marginTop: 3,
      letterSpacing: ".1em"
    }
  }, sub) : null);
  return /*#__PURE__*/React.createElement("div", {
    style: {
      marginBottom: 14
    }
  }, /*#__PURE__*/React.createElement("div", {
    style: {
      display: "flex",
      alignItems: "center",
      gap: 10,
      padding: "11px 14px",
      borderRadius: 14,
      background: `${accent}14`,
      border: `1px solid ${accent}55`
    }
  }, /*#__PURE__*/React.createElement("span", {
    style: {
      display: "inline-flex",
      alignItems: "center",
      gap: 6,
      padding: "4px 10px",
      borderRadius: 6,
      background: accent,
      fontFamily: SANS_L,
      fontWeight: 700,
      fontSize: 10.5,
      letterSpacing: ".16em",
      color: "#fff",
      flex: "none"
    }
  }, /*#__PURE__*/React.createElement("span", {
    style: {
      width: 5,
      height: 5,
      borderRadius: "50%",
      background: "#fff",
      animation: "pp-pulse 1.4s ease-in-out infinite"
    }
  }), "RUNNING"), /*#__PURE__*/React.createElement("span", {
    style: {
      fontFamily: MONO_L,
      fontSize: 16,
      color: "#fff",
      fontVariantNumeric: "tabular-nums",
      letterSpacing: ".04em"
    }
  }, c.elapsed), /*#__PURE__*/React.createElement("span", {
    style: {
      marginLeft: "auto",
      textAlign: "right"
    }
  }, /*#__PURE__*/React.createElement("span", {
    style: {
      ...LK,
      display: "block"
    }
  }, "PLAYERS LEFT"), /*#__PURE__*/React.createElement("span", {
    style: {
      fontFamily: MONO_L,
      fontSize: 15,
      color: "#5BD96A",
      fontVariantNumeric: "tabular-nums"
    }
  }, M.left, /*#__PURE__*/React.createElement("span", {
    style: {
      color: "#8A8A93",
      fontSize: 12
    }
  }, " / ", tot)))), /*#__PURE__*/React.createElement("div", {
    style: {
      marginTop: 10,
      borderRadius: 14,
      background: "rgba(255,255,255,.05)",
      border: "1px solid rgba(255,255,255,.09)",
      overflow: "hidden"
    }
  }, /*#__PURE__*/React.createElement("div", {
    style: {
      display: "grid",
      gridTemplateColumns: "1fr auto 1fr",
      gap: 10,
      padding: "13px 14px",
      alignItems: "center"
    }
  }, /*#__PURE__*/React.createElement("div", null, /*#__PURE__*/React.createElement("div", {
    style: LK
  }, "CURRENT BLINDS"), /*#__PURE__*/React.createElement("div", {
    style: {
      ...LV,
      fontSize: 16,
      marginTop: 4
    }
  }, c.blinds), /*#__PURE__*/React.createElement("div", {
    style: {
      ...LK,
      fontSize: 10.5,
      marginTop: 3
    }
  }, "ANTE ", c.ante)), /*#__PURE__*/React.createElement("div", {
    style: {
      textAlign: "center",
      padding: "8px 14px",
      borderRadius: 12,
      background: "rgba(0,0,0,.45)",
      border: "1px solid rgba(255,255,255,.12)"
    }
  }, /*#__PURE__*/React.createElement("div", {
    style: {
      ...LK,
      letterSpacing: ".2em"
    }
  }, "LEVEL ", c.level), /*#__PURE__*/React.createElement("div", {
    style: {
      fontFamily: MONO_L,
      fontSize: 21,
      color: "#5BD96A",
      fontVariantNumeric: "tabular-nums",
      marginTop: 3
    }
  }, c.levelLeft)), /*#__PURE__*/React.createElement("div", {
    style: {
      textAlign: "right"
    }
  }, /*#__PURE__*/React.createElement("div", {
    style: LK
  }, "NEXT BLINDS"), /*#__PURE__*/React.createElement("div", {
    style: {
      ...LV,
      fontSize: 13,
      marginTop: 4,
      color: "#D8D8DF"
    }
  }, c.nextBlinds), /*#__PURE__*/React.createElement("div", {
    style: {
      ...LK,
      fontSize: 10.5,
      marginTop: 3
    }
  }, "ANTE ", c.nextAnte))), /*#__PURE__*/React.createElement("div", {
    style: {
      display: "flex",
      alignItems: "center",
      justifyContent: "space-between",
      padding: "8px 14px",
      borderTop: "1px solid rgba(255,255,255,.07)"
    }
  }, /*#__PURE__*/React.createElement("span", {
    style: LK
  }, "NEXT BREAK"), /*#__PURE__*/React.createElement("span", {
    style: {
      ...LV,
      fontSize: 12
    }
  }, c.breakIn)), /*#__PURE__*/React.createElement("div", {
    style: {
      display: "grid",
      gridTemplateColumns: "1fr 1fr 1fr",
      borderTop: "1px solid rgba(255,255,255,.07)"
    }
  }, [["BUY-INS", fN(MTT_LIVE.buyIns)], ["RE-ENTRIES", fN(MTT_LIVE.reEntries)], ["TOTAL ENTRIES", fN(tot)]].map(([k, v], i) => /*#__PURE__*/React.createElement("div", {
    key: k,
    style: {
      padding: "10px 14px",
      borderLeft: i ? "1px solid rgba(255,255,255,.07)" : "none"
    }
  }, /*#__PURE__*/React.createElement(Cell, {
    k: k,
    v: v
  })))), /*#__PURE__*/React.createElement("div", {
    style: {
      display: "grid",
      gridTemplateColumns: "1fr 1fr",
      borderTop: "1px solid rgba(255,255,255,.07)",
      background: "rgba(255,255,255,.02)"
    }
  }, [["MIN STACK", M.minStack], ["AVG STACK", M.avgStack]].map(([k, v], i) => /*#__PURE__*/React.createElement("div", {
    key: k,
    style: {
      padding: "10px 14px",
      borderLeft: i ? "1px solid rgba(255,255,255,.07)" : "none"
    }
  }, /*#__PURE__*/React.createElement(Cell, {
    k: k,
    v: fN(v),
    sub: `${inBB(v)} BB`,
    cv: "#6FA8FF"
  }))))));
}

// ── target-event note (satellites) ──
function TargetEventNote({
  accent,
  name
}) {
  return /*#__PURE__*/React.createElement("div", {
    style: {
      marginTop: 12,
      padding: "13px 14px",
      borderRadius: 14,
      background: "rgba(111,168,255,.08)",
      border: "1px solid rgba(111,168,255,.35)"
    }
  }, /*#__PURE__*/React.createElement("div", {
    style: {
      ...LK,
      color: "#6FA8FF"
    }
  }, "TARGET EVENT"), /*#__PURE__*/React.createElement("div", {
    style: {
      fontFamily: MONO_L,
      fontWeight: 700,
      fontSize: 14,
      color: "#fff",
      marginTop: 5
    }
  }, name), /*#__PURE__*/React.createElement("p", {
    style: {
      margin: "7px 0 0",
      fontFamily: SANS_L,
      fontWeight: 600,
      fontSize: 11,
      lineHeight: 1.55,
      color: "#D8D8DF",
      textWrap: "pretty"
    }
  }, "Players who win a seat are registered into the target event automatically and cannot unregister. If you already hold a seat, further wins pay the ticket value instead."));
}

// ── PLAYERS (live) — Players / Tables toggle, expandable rows, OPEN TABLE ──
function LivePlayersTab({
  accent
}) {
  const [view, setView] = React.useState("players");
  const [openRow, setOpenRow] = React.useState(null);
  const M = MTT_LIVE;
  const Head = ({
    cols
  }) => /*#__PURE__*/React.createElement("div", {
    style: {
      display: "flex",
      padding: "8px 12px 6px",
      gap: 10
    }
  }, cols.map(([lb, st], i) => /*#__PURE__*/React.createElement("span", {
    key: i,
    style: {
      ...LK,
      ...st
    }
  }, lb)));
  const chipsStr = ch => /*#__PURE__*/React.createElement("span", {
    style: {
      ...LV,
      fontSize: 12
    }
  }, fN(ch), /*#__PURE__*/React.createElement("span", {
    style: {
      color: "#8A8A93",
      fontSize: 10.5
    }
  }, " (", inBB(ch), " BB)"));
  const TableRoster = ({
    tb
  }) => {
    const seatmates = M.players.filter(p => p.tb === tb);
    return /*#__PURE__*/React.createElement("div", {
      style: {
        margin: "2px 10px 10px",
        padding: "4px 12px 12px",
        borderRadius: 12,
        background: "rgba(0,0,0,.4)",
        border: "1px solid rgba(255,255,255,.1)"
      }
    }, /*#__PURE__*/React.createElement(Head, {
      cols: [["POS", {
        width: 30,
        flex: "none"
      }], ["TABLE " + tb, {
        flex: 1
      }], ["CHIPS", {
        marginLeft: "auto"
      }]]
    }), seatmates.map(p => /*#__PURE__*/React.createElement("div", {
      key: p.r,
      style: {
        display: "flex",
        alignItems: "center",
        gap: 10,
        padding: "6px 0",
        borderTop: "1px solid rgba(255,255,255,.06)"
      }
    }, /*#__PURE__*/React.createElement("span", {
      style: {
        ...LV,
        fontSize: 11,
        width: 30,
        flex: "none",
        color: "#A9A9B2"
      }
    }, p.r), /*#__PURE__*/React.createElement("span", {
      style: {
        fontFamily: MONO_L,
        fontWeight: 700,
        fontSize: 11,
        color: "#fff",
        flex: 1,
        minWidth: 0,
        overflow: "hidden",
        textOverflow: "ellipsis",
        whiteSpace: "nowrap"
      }
    }, p.nick, p.re ? /*#__PURE__*/React.createElement("span", {
      style: {
        color: "#8A8A93"
      }
    }, " [", p.re, "]") : null), chipsStr(p.chips))), /*#__PURE__*/React.createElement("button", {
      onClick: () => {
        if (window.playClick) window.playClick(1300, 0.05);
      },
      style: {
        marginTop: 10,
        width: "100%",
        padding: "10px 0",
        borderRadius: 125,
        background: accent,
        border: 0,
        cursor: "pointer",
        fontFamily: MONO_L,
        fontWeight: 700,
        fontSize: 11,
        letterSpacing: ".12em",
        color: "#fff"
      }
    }, "OPEN TABLE \u203A"));
  };
  return /*#__PURE__*/React.createElement("div", {
    style: {
      padding: "14px 16px 170px"
    }
  }, /*#__PURE__*/React.createElement("div", {
    style: {
      display: "flex",
      padding: 3,
      borderRadius: 125,
      background: "rgba(255,255,255,.07)",
      border: "1px solid rgba(255,255,255,.1)"
    }
  }, [["players", "PLAYERS"], ["tables", "TABLES"]].map(([id, lb]) => {
    const on = view === id;
    return /*#__PURE__*/React.createElement("button", {
      key: id,
      onClick: () => {
        if (window.playClick) window.playClick(1100, 0.04);
        setView(id);
        setOpenRow(null);
      },
      style: {
        flex: 1,
        padding: "9px 0",
        borderRadius: 125,
        background: on ? accent : "transparent",
        border: 0,
        cursor: "pointer",
        fontFamily: SANS_L,
        fontWeight: 700,
        fontSize: 10.5,
        letterSpacing: ".16em",
        color: on ? "#fff" : "rgba(255,255,255,.55)",
        transition: "background 140ms"
      }
    }, lb);
  })), view === "players" ? /*#__PURE__*/React.createElement("div", {
    style: {
      marginTop: 12,
      borderRadius: 14,
      background: "rgba(255,255,255,.04)",
      border: "1px solid rgba(255,255,255,.08)",
      overflow: "hidden"
    }
  }, /*#__PURE__*/React.createElement(Head, {
    cols: [["POS", {
      width: 30,
      flex: "none"
    }], ["PLAYER · [RE-ENTRIES]", {
      flex: 1
    }], ["CHIPS", {
      marginLeft: "auto"
    }]]
  }), M.players.map(p => /*#__PURE__*/React.createElement(React.Fragment, {
    key: p.r
  }, /*#__PURE__*/React.createElement("button", {
    onClick: () => {
      if (window.playClick) window.playClick(1050, 0.04);
      setOpenRow(openRow === p.r ? null : p.r);
    },
    style: {
      width: "100%",
      display: "flex",
      alignItems: "center",
      gap: 10,
      padding: "9.5px 12px",
      background: openRow === p.r ? "rgba(255,255,255,.05)" : "transparent",
      border: 0,
      borderTop: "1px solid rgba(255,255,255,.06)",
      cursor: "pointer",
      textAlign: "left"
    }
  }, /*#__PURE__*/React.createElement("span", {
    style: {
      ...LV,
      fontSize: 11,
      width: 30,
      flex: "none",
      color: "#A9A9B2"
    }
  }, p.r), /*#__PURE__*/React.createElement("span", {
    style: {
      fontFamily: MONO_L,
      fontWeight: 700,
      fontSize: 12,
      color: "#fff",
      flex: 1,
      minWidth: 0,
      overflow: "hidden",
      textOverflow: "ellipsis",
      whiteSpace: "nowrap"
    }
  }, p.nick, p.re ? /*#__PURE__*/React.createElement("span", {
    style: {
      color: "#8A8A93"
    }
  }, " [", p.re, "]") : null), chipsStr(p.chips), /*#__PURE__*/React.createElement("svg", {
    width: "11",
    height: "11",
    viewBox: "0 0 24 24",
    fill: "none",
    stroke: "rgba(255,255,255,.45)",
    strokeWidth: "2.6",
    strokeLinecap: "round",
    strokeLinejoin: "round",
    style: {
      flex: "none",
      transform: openRow === p.r ? "rotate(180deg)" : "none",
      transition: "transform 160ms"
    }
  }, /*#__PURE__*/React.createElement("path", {
    d: "M6 9l6 6 6-6"
  }))), openRow === p.r ? /*#__PURE__*/React.createElement(TableRoster, {
    tb: p.tb
  }) : null)), /*#__PURE__*/React.createElement("div", {
    style: {
      padding: "9px 12px",
      borderTop: "1px solid rgba(255,255,255,.06)",
      textAlign: "center",
      fontFamily: SANS_L,
      fontWeight: 700,
      fontSize: 10.5,
      letterSpacing: ".14em",
      color: "#A9A9B2"
    }
  }, "+ ", MTT_LIVE.moreAlive, " MORE IN PLAY"), M.busted.map(p => /*#__PURE__*/React.createElement("div", {
    key: p.r,
    style: {
      display: "flex",
      alignItems: "center",
      gap: 10,
      padding: "8.5px 12px",
      borderTop: "1px solid rgba(255,255,255,.05)",
      opacity: .45
    }
  }, /*#__PURE__*/React.createElement("span", {
    style: {
      ...LV,
      fontSize: 11,
      width: 30,
      flex: "none"
    }
  }, p.r), /*#__PURE__*/React.createElement("span", {
    style: {
      fontFamily: MONO_L,
      fontWeight: 700,
      fontSize: 12,
      color: "#fff",
      flex: 1,
      minWidth: 0,
      overflow: "hidden",
      textOverflow: "ellipsis",
      whiteSpace: "nowrap"
    }
  }, p.nick, p.re ? /*#__PURE__*/React.createElement("span", {
    style: {
      color: "#A9A9B2"
    }
  }, " [", p.re, "]") : null), /*#__PURE__*/React.createElement("span", {
    style: {
      fontFamily: SANS_L,
      fontWeight: 700,
      fontSize: 10.5,
      letterSpacing: ".14em",
      color: "#A9A9B2"
    }
  }, "OUT")))) : /*#__PURE__*/React.createElement("div", {
    style: {
      marginTop: 12,
      borderRadius: 14,
      background: "rgba(255,255,255,.04)",
      border: "1px solid rgba(255,255,255,.08)",
      overflow: "hidden"
    }
  }, /*#__PURE__*/React.createElement(Head, {
    cols: [["TABLE", {
      width: 52,
      flex: "none"
    }], ["PLAYERS", {
      width: 64,
      flex: "none"
    }], ["BIG STACK", {
      flex: 1,
      textAlign: "right"
    }], ["SMALL STACK", {
      marginLeft: "auto",
      textAlign: "right"
    }]]
  }), M.tables.map(tb => /*#__PURE__*/React.createElement("button", {
    key: tb.id,
    onClick: () => {
      if (window.playClick) window.playClick(1050, 0.04);
      setOpenRow(openRow === "t" + tb.id ? null : "t" + tb.id);
    },
    style: {
      width: "100%",
      background: "transparent",
      border: 0,
      borderTop: "1px solid rgba(255,255,255,.06)",
      cursor: "pointer",
      textAlign: "left",
      padding: 0
    }
  }, /*#__PURE__*/React.createElement("div", {
    style: {
      display: "flex",
      alignItems: "center",
      gap: 10,
      padding: "10px 12px"
    }
  }, /*#__PURE__*/React.createElement("span", {
    style: {
      ...LV,
      fontSize: 12,
      width: 52,
      flex: "none"
    }
  }, "#", tb.id), /*#__PURE__*/React.createElement("span", {
    style: {
      width: 64,
      flex: "none",
      display: "inline-flex",
      alignItems: "center",
      gap: 5
    }
  }, /*#__PURE__*/React.createElement("svg", {
    width: "12",
    height: "12",
    viewBox: "0 0 24 24",
    fill: "rgba(255,255,255,.7)"
  }, /*#__PURE__*/React.createElement("circle", {
    cx: "9",
    cy: "7.6",
    r: "3.4"
  }), /*#__PURE__*/React.createElement("path", {
    d: "M2.8 19a6.2 6.2 0 0 1 12.4 0z"
  }), /*#__PURE__*/React.createElement("circle", {
    cx: "17",
    cy: "8.4",
    r: "2.7"
  }), /*#__PURE__*/React.createElement("path", {
    d: "M14.6 19a4.9 4.9 0 0 1 6.6-4.5"
  })), /*#__PURE__*/React.createElement("span", {
    style: {
      ...LV,
      fontSize: 12
    }
  }, tb.seats)), /*#__PURE__*/React.createElement("span", {
    style: {
      flex: 1,
      textAlign: "right"
    }
  }, /*#__PURE__*/React.createElement("span", {
    style: {
      ...LV,
      fontSize: 12
    }
  }, fN(tb.big), /*#__PURE__*/React.createElement("span", {
    style: {
      color: "#8A8A93",
      fontSize: 10.5
    }
  }, " (", inBB(tb.big), " BB)"))), /*#__PURE__*/React.createElement("span", {
    style: {
      marginLeft: 6,
      textAlign: "right"
    }
  }, /*#__PURE__*/React.createElement("span", {
    style: {
      ...LV,
      fontSize: 12,
      color: "#D8D8DF"
    }
  }, fN(tb.small), /*#__PURE__*/React.createElement("span", {
    style: {
      color: "#8A8A93",
      fontSize: 10.5
    }
  }, " (", inBB(tb.small), " BB)")))), openRow === "t" + tb.id ? /*#__PURE__*/React.createElement(TableRoster, {
    tb: tb.id
  }) : null))));
}

// ── PRIZE (live extras) — paid places + next prize; seats table for satellites ──
function PrizeLiveCallout({
  accent,
  eff,
  sat,
  feeds
}) {
  const M = MTT_LIVE;
  if (sat) {
    return /*#__PURE__*/React.createElement("div", {
      style: {
        marginBottom: 12
      }
    }, /*#__PURE__*/React.createElement("div", {
      style: {
        padding: "13px 14px",
        borderRadius: 14,
        background: "rgba(255,255,255,.05)",
        border: "1px solid rgba(255,255,255,.09)",
        textAlign: "center"
      }
    }, /*#__PURE__*/React.createElement("div", {
      style: LK
    }, "TOTAL PRIZE FUND"), /*#__PURE__*/React.createElement("div", {
      style: {
        fontFamily: MONO_L,
        fontWeight: 700,
        fontSize: 17,
        color: "#f0c75e",
        marginTop: 6
      }
    }, M.seats, "\xD7 ENTRY TO ", feeds, " + \u20B8", fN(M.remainder))), /*#__PURE__*/React.createElement("div", {
      style: {
        marginTop: 10,
        padding: "11px 14px",
        borderRadius: 14,
        background: "rgba(91,217,106,.07)",
        border: "1px solid rgba(91,217,106,.3)",
        textAlign: "center"
      }
    }, /*#__PURE__*/React.createElement("span", {
      style: {
        ...LK,
        color: "#A9A9B2"
      }
    }, M.seats + 1, " PLACES PAID \xB7 NEXT PRIZE: "), /*#__PURE__*/React.createElement("span", {
      style: {
        fontFamily: MONO_L,
        fontWeight: 700,
        fontSize: 12,
        color: "#f0c75e"
      }
    }, M.seats + 1, "TH \u2014 \u20B8", fN(M.remainder))), /*#__PURE__*/React.createElement("div", {
      style: {
        marginTop: 10,
        borderRadius: 14,
        background: "rgba(255,255,255,.05)",
        border: "1px solid rgba(255,255,255,.09)",
        padding: "2px 14px"
      }
    }, [["1 ~ " + M.seats, "ENTRY TO " + feeds, true], [String(M.seats + 1), "₸" + fN(M.remainder), false]].map(([pos, prize, hot], i) => /*#__PURE__*/React.createElement("div", {
      key: pos,
      style: {
        display: "flex",
        alignItems: "baseline",
        gap: 10,
        padding: "10px 0",
        borderBottom: i === 0 ? "1px solid rgba(255,255,255,.06)" : "none"
      }
    }, /*#__PURE__*/React.createElement("span", {
      style: {
        flex: "none",
        width: 52,
        fontFamily: SANS_L,
        fontWeight: 700,
        fontSize: 10.5,
        letterSpacing: ".1em",
        color: "#A9A9B2"
      }
    }, pos), /*#__PURE__*/React.createElement("span", {
      style: {
        marginLeft: "auto",
        fontFamily: MONO_L,
        fontWeight: 700,
        fontSize: 12,
        color: hot ? "#f0c75e" : "#fff",
        textAlign: "right"
      }
    }, prize)))));
  }
  const paid = 9;
  const nextPrize = Math.round(eff * 0.0225);
  return /*#__PURE__*/React.createElement("div", {
    style: {
      margin: "12px 0",
      padding: "11px 14px",
      borderRadius: 14,
      background: "rgba(91,217,106,.07)",
      border: "1px solid rgba(91,217,106,.3)",
      display: "flex",
      alignItems: "center",
      gap: 8,
      flexWrap: "wrap"
    }
  }, /*#__PURE__*/React.createElement("span", {
    style: {
      ...LK,
      color: "#A9A9B2"
    }
  }, paid, " PLACES PAID \xB7 ", MTT_LIVE.left, " LEFT"), /*#__PURE__*/React.createElement("span", {
    style: {
      marginLeft: "auto",
      fontFamily: MONO_L,
      fontWeight: 700,
      fontSize: 12,
      color: "#f0c75e"
    }
  }, "NEXT PRIZE \xB7 9TH \u2014 \u20B8", fN(nextPrize)));
}

// ── sticky CTA (live): late-reg countdown + OBSERVE / ENTER TABLE ──
function LiveCtaDock({
  accent,
  t,
  registered,
  onRegister,
  onUnregister
}) {
  const c = useLiveClock();
  const lateOpen = c.lateLeft > 0;
  if (registered) {
    return /*#__PURE__*/React.createElement("div", {
      style: {
        display: "flex",
        flexDirection: "column",
        gap: 10
      }
    }, /*#__PURE__*/React.createElement("div", {
      style: {
        display: "flex",
        alignItems: "center",
        gap: 10,
        padding: "10px 14px",
        borderRadius: 12,
        background: "rgba(91,217,106,.1)",
        border: "1px solid rgba(91,217,106,.4)"
      }
    }, /*#__PURE__*/React.createElement("span", {
      style: {
        width: 20,
        height: 20,
        borderRadius: "50%",
        flex: "none",
        background: "#5BD96A",
        display: "flex",
        alignItems: "center",
        justifyContent: "center"
      }
    }, /*#__PURE__*/React.createElement("svg", {
      width: "11",
      height: "11",
      viewBox: "0 0 24 24",
      fill: "none",
      stroke: "#000",
      strokeWidth: "3.4",
      strokeLinecap: "round",
      strokeLinejoin: "round"
    }, /*#__PURE__*/React.createElement("path", {
      d: "M5 12l5 5L20 6"
    }))), /*#__PURE__*/React.createElement("span", {
      style: {
        fontFamily: MONO_L,
        fontSize: 12,
        color: "#fff",
        letterSpacing: ".06em"
      }
    }, "YOU'RE IN \xB7 TABLE 14 \xB7 SEAT 3")), /*#__PURE__*/React.createElement("div", {
      style: {
        display: "flex",
        gap: 9
      }
    }, /*#__PURE__*/React.createElement("button", {
      onClick: () => {
        if (window.playClick) window.playClick(1500, 0.05);
        // seat the player at the tournament's own felt — RAISE there ends the run
        if (window.openTourneyTable) window.openTourneyTable(t);
      },
      style: {
        flex: 1,
        padding: "16px 0",
        borderRadius: 125,
        background: accent,
        color: "#fff",
        border: 0,
        cursor: "pointer",
        boxShadow: `0 14px 30px ${accent}66`,
        fontFamily: MONO_L,
        fontSize: 16,
        letterSpacing: ".12em"
      }
    }, "ENTER TABLE \u203A")));
  }
  return /*#__PURE__*/React.createElement("div", {
    style: {
      display: "flex",
      flexDirection: "column",
      gap: 10
    }
  }, /*#__PURE__*/React.createElement("div", {
    style: {
      display: "flex",
      alignItems: "center",
      justifyContent: "center",
      gap: 7,
      fontFamily: SANS_L,
      fontWeight: 700,
      fontSize: 10.5,
      letterSpacing: ".14em",
      color: lateOpen ? "#f0c75e" : "rgba(255,255,255,.5)"
    }
  }, /*#__PURE__*/React.createElement("span", {
    style: {
      width: 5,
      height: 5,
      borderRadius: "50%",
      background: lateOpen ? "#f0c75e" : "rgba(255,255,255,.4)",
      animation: lateOpen ? "pp-pulse 1.4s ease-in-out infinite" : "none"
    }
  }), lateOpen ? `LATE REGISTRATION ENDS IN ${c.lateStr}` : "REGISTRATION CLOSED"), /*#__PURE__*/React.createElement("div", {
    style: {
      display: "flex",
      gap: 10
    }
  }, /*#__PURE__*/React.createElement("button", {
    onClick: () => {
      if (window.playClick) window.playClick(950, 0.04);
    },
    style: {
      flex: "0 0 34%",
      padding: "15px 0",
      borderRadius: 125,
      background: "transparent",
      border: "1px solid rgba(255,255,255,.25)",
      cursor: "pointer",
      fontFamily: MONO_L,
      fontSize: 13,
      letterSpacing: ".1em",
      color: "#D8D8DF"
    }
  }, "OBSERVE"), lateOpen ? /*#__PURE__*/React.createElement("button", {
    onClick: onRegister,
    style: {
      flex: 1,
      padding: "15px 0",
      borderRadius: 125,
      background: accent,
      color: "#fff",
      border: 0,
      cursor: "pointer",
      boxShadow: `0 14px 30px ${accent}66`,
      fontFamily: MONO_L,
      fontSize: 14,
      letterSpacing: ".08em"
    }
  }, "LATE REG \xB7 ", t.buyIn) : /*#__PURE__*/React.createElement("button", {
    disabled: true,
    style: {
      flex: 1,
      padding: "15px 0",
      borderRadius: 125,
      background: "rgba(255,255,255,.09)",
      color: "#A9A9B2",
      border: 0,
      fontFamily: MONO_L,
      fontSize: 14,
      letterSpacing: ".08em"
    }
  }, "REG CLOSED")));
}
MTT_LIVE.levelNow = () => Math.min(L_SB.length, Math.floor((Date.now() - LIVE_T0) / 1000 / L_LEVEL_S) + 1);
MTT_LIVE.elapsedStr = () => {
  const s = Math.floor((Date.now() - LIVE_T0) / 1000);
  const p = n => String(n).padStart(2, "0");
  return `${p(Math.floor(s / 3600))}:${p(Math.floor(s % 3600 / 60))}:${p(s % 60)}`;
};
Object.assign(window, {
  MTT_LIVE,
  LiveStatusCards,
  LivePlayersTab,
  TargetEventNote,
  PrizeLiveCallout,
  LiveCtaDock
});