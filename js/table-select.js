// table-select.jsx — "choose your table" screen (V1 CARDS layout).
// Overrides window.TableListScreen from table.jsx (this file loads after it).
// Stake rail starts with ALL (default): every tier listed with section
// headers. 6 tile designs (tile prop, Tweaks → Play Flow → Table tile).

const TS_MONO = UI.font;
const TS_SANS = UI.fontUI;
const tsClick = (f, d) => {
  if (window.playClick) window.playClick(f || 1100, d || 0.04);
};

// ── data: 11 tiers, deterministic table sets ─────────────────────────────
// Дисципліни, столи яких реально існують у цій версії. Піґулка дисципліни
// зʼявляється лише тоді, коли зʼявляється стіл цієї дисципліни.
const TS_DISC = ["HOLD'EM", "PLO5"];
// one money vocabulary for every cash screen (Classic + Bomb Rush)
const TS_MONEY = (() => {
  const SYM = () => window.pxSym ? window.pxSym() : "$";
  const RATE = () => window.pxRate ? window.pxRate() : 1;
  const unitOf = v => v >= 1000000 ? 1000000 : v >= 1000 ? 1000 : 1;
  const money = (v0, u) => {
    const v = v0 * RATE();
    const unit = u || unitOf(v);
    if (unit === 1) return v < 1 ? SYM() + v.toFixed(2) : v < 10 ? SYM() + v.toFixed(2).replace(/\.?0+$/, "") : SYM() + Math.round(v).toLocaleString("en-US").split(",").join("\u2009");
    return SYM() + (v / unit).toFixed(1).replace(".0", "") + (unit === 1000000 ? "M" : "K");
  };
  const short = v0 => {
    const v = v0 * RATE();
    return v >= 1000000 ? SYM() + (v / 1000000).toFixed(1).replace(".0", "") + "M" : SYM() + (v / 1000).toFixed(1).replace(".0", "") + "K";
  };
  // a range never mixes formats: if the top end reads in K, so does the bottom
  const range = (a, b) => b >= 1000 ? money(a) + "\u2013" + money(b) : money(a, 1) + "\u2013" + money(b, 1);
  const stake = (sb, bb) => money(sb, 1) + "/" + money(bb, 1);
  return {
    money,
    short,
    range,
    stake
  };
})();
const TS_TIERS = (() => {
  // Від найбільших лімітів до найменших: і смуга фільтрів, і секції столів
  // читаються згори вниз як «дорожче → дешевше». Раніше було навпаки, і
  // найцікавіші високі ліміти лежали в самому кінці списку.
  const defs = [[2500, 5000], [25, 50], [10, 20], [5, 10], [2, 4], [1, 2], [0.50, 1], [0.25, 0.50], [0.10, 0.20], [0.05, 0.10], [0.02, 0.05], [0.01, 0.02]];
  const fmt = n => n < 1 ? n.toFixed(2) : String(n);
  const {
    money,
    range
  } = TS_MONEY;
  return defs.map((d, ti) => {
    let s = ti * 7919 + 13;
    const r = () => {
      s = (s * 16807 + 11) % 2147483647;
      return s / 2147483647;
    };
    const count = ti < 4 ? 15 : ti < 8 ? 15 : 15;
    const tables = Array.from({
      length: count
    }, (_, i) => {
      const max = r() > 0.45 ? 6 : 9;
      const taken = r() < 0.14 ? 0 : Math.min(max, 1 + Math.floor(r() * max));
      return {
        id: ti + "-" + i,
        name: String(101 + ti * 15 + i),
        max,
        taken,
        avg: money(d[1] * (14 + r() * 46)),
        vpip: r() > 0.72 ? r() > 0.5 ? 30 : 20 : null,
        bomb: r() > 0.74 ? r() > 0.5 ? 7 : 5 : null,
        dbl: r() > 0.8,
        squid: r() > 0.8,
        wait: 1 + Math.floor(r() * 5),
        disc: TS_DISC[(i + ti) % TS_DISC.length]
      };
    });
    const bbMin = d[1] * 40,
      bbMax = d[1] * 200;
    return {
      stake: fmt(d[0]) + "/" + fmt(d[1]),
      sb: d[0],
      bb: d[1],
      buyIn: d[1] * 100,
      buyInMin: bbMin,
      buyInMax: bbMax,
      buyInRange: range(bbMin, bbMax),
      buyInFrom: money(bbMin, 1),
      tables
    };
  });
})();
window.TS_TIERS = TS_TIERS;
// ["ALL", ...ті дисципліни, у яких є хоч один стіл] — у канонічному порядку
window.PX_LIVE_DISCS = (() => {
  const ORDER = ["HOLD'EM", "PLO", "PLO5", "PLO6", "SHORT DECK"];
  const has = {};
  TS_TIERS.forEach(g => g.tables.forEach(t => {
    has[t.disc] = true;
  }));
  return ["ALL"].concat(ORDER.filter(d => has[d]));
})();
const TS_ABBR = {
  "HOLD'EM": "NLH",
  "PLO": "PLO",
  "PLO5": "OMAHA5",
  "PLO6": "PLO6",
  "SHORT DECK": "SD"
};
const tsName = t => (TS_ABBR[t.disc] || "NLH") + (t.bomb ? " Bomb" : "") + " " + t.name;
const tsSpace = n => String(n).replace(/\B(?=(\d{3})+(?!\d))/g, "\u2009");
const tsStake = g => TS_MONEY.stake(g.sb, g.bb);
function TsChip({
  children,
  hot,
  squid
}) {
  if (squid) return /*#__PURE__*/React.createElement("span", {
    style: {
      fontFamily: TS_SANS,
      fontWeight: 700,
      fontSize: 10.5,
      letterSpacing: ".1em",
      color: "#fff",
      padding: "3px 8px",
      borderRadius: 5,
      background: "#D71921",
      border: "1px solid #D71921",
      whiteSpace: "nowrap",
      boxShadow: "0 2px 8px rgba(215,25,33,.45)"
    }
  }, children);
  return /*#__PURE__*/React.createElement("span", {
    style: {
      fontFamily: TS_SANS,
      fontWeight: 700,
      fontSize: 10.5,
      letterSpacing: ".1em",
      color: hot ? "#FF8A93" : "rgba(255,255,255,.55)",
      padding: "3px 8px",
      borderRadius: 5,
      background: hot ? "rgba(215,25,33,.13)" : "rgba(255,255,255,.075)",
      border: `1px solid ${hot ? "rgba(215,25,33,.45)" : "rgba(255,255,255,.13)"}`,
      whiteSpace: "nowrap"
    }
  }, children);
}
// Спільна коробка для дій у рядку столу: SIT, VIEW, FULL. Раніше кожна
// мала свій кегль, відступи й рамку, тож висота й положення різнилися.
// boxSizing: border-box — щоб рамка у VIEW не робила кнопку вищою.
const TS_BTN = {
  boxSizing: "border-box",
  height: 34,
  display: "inline-flex",
  alignItems: "center",
  justifyContent: "center",
  padding: "0 17px",
  borderRadius: 125,
  whiteSpace: "nowrap",
  fontFamily: TS_MONO,
  fontWeight: 700,
  fontSize: 12,
  letterSpacing: ".08em",
  flex: "none"
};
function TsSit({
  accent,
  full
}) {
  if (full) return /*#__PURE__*/React.createElement("span", {
    style: {
      ...TS_BTN,
      color: "#A9A9B2"
    }
  }, "FULL");
  return /*#__PURE__*/React.createElement("span", {
    style: {
      ...TS_BTN,
      color: tsInk(accent),
      background: accent,
      boxShadow: `0 5px 14px ${accent}55`
    }
  }, "SIT \u203A");
}
// thin segmented capacity bar — one segment per seat
function TsSegBar({
  t,
  accent,
  w = 96
}) {
  const full = t.taken >= t.max;
  return /*#__PURE__*/React.createElement("span", {
    style: {
      display: "flex",
      gap: 2,
      width: w
    }
  }, Array.from({
    length: t.max
  }, (_, i) => /*#__PURE__*/React.createElement("span", {
    key: i,
    style: {
      flex: 1,
      height: 4,
      borderRadius: 2,
      background: i < t.taken ? full ? accent : "#fff" : "rgba(255,255,255,.18)"
    }
  })));
}
// dark label on light accents — white on a mint/amber fill fails AA
const tsInk = c => {
  const h = String(c || "").replace("#", "");
  if (h.length !== 6) return "#fff";
  const v = [0, 2, 4].map(i => parseInt(h.slice(i, i + 2), 16) / 255).map(x => x <= 0.03928 ? x / 12.92 : Math.pow((x + 0.055) / 1.055, 2.4));
  return 0.2126 * v[0] + 0.7152 * v[1] + 0.0722 * v[2] > 0.22 ? "#08080A" : "#fff";
};
const tsCardBase = (full, accent) => ({
  position: "relative",
  overflow: "hidden",
  textAlign: "left",
  width: "100%",
  cursor: full ? "default" : "pointer",
  border: "1px solid " + (full ? "rgba(255,255,255,.10)" : accent ? accent + "80" : "rgba(255,255,255,.14)"),
  background: full ? "linear-gradient(155deg,#1e1e26,#0b0b0d)" : `linear-gradient(150deg, ${accent}22 0%, #0c0c0f 58%, #0a0a0c 100%)`,
  opacity: full ? 0.5 : 1
});

// ── 6 tile designs ───────────────────────────────────────────────────────
// T1 · BAR — classic card, seats as a segmented bar (no dots)
function TsTile1({
  t,
  g,
  accent,
  sit
}) {
  const full = t.taken >= t.max;
  return /*#__PURE__*/React.createElement("button", {
    onClick: () => {
      if (!full) {
        tsClick(1300);
        sit(t, g);
      }
    },
    style: {
      ...tsCardBase(full, accent),
      borderRadius: 16,
      padding: "14px 15px",
      display: "flex",
      flexDirection: "column",
      gap: 12
    }
  }, !full && /*#__PURE__*/React.createElement("div", {
    style: {
      position: "absolute",
      inset: 0,
      pointerEvents: "none",
      background: `radial-gradient(circle at 97% 0%, ${accent}14, transparent 50%)`
    }
  }), /*#__PURE__*/React.createElement("div", {
    style: {
      position: "relative",
      display: "flex",
      alignItems: "center",
      gap: 8
    }
  }, /*#__PURE__*/React.createElement("span", {
    style: {
      fontFamily: TS_MONO,
      fontWeight: 700,
      fontSize: 16,
      color: "#fff",
      letterSpacing: ".04em"
    }
  }, tsName(t)), null, t.dbl && /*#__PURE__*/React.createElement(TsChip, null, "2 BOARDS"), /*#__PURE__*/React.createElement("span", {
    style: {
      marginLeft: "auto",
      textAlign: "right"
    }
  }, /*#__PURE__*/React.createElement("span", {
    style: {
      display: "block",
      fontFamily: TS_SANS,
      fontWeight: 700,
      fontSize: 10.5,
      letterSpacing: ".18em",
      color: "#A9A9B2"
    }
  }, "AVG POT"), /*#__PURE__*/React.createElement("span", {
    style: {
      display: "block",
      fontFamily: TS_MONO,
      fontWeight: 700,
      fontSize: 13,
      color: "#f0c75e",
      marginTop: 2
    }
  }, t.avg))), /*#__PURE__*/React.createElement("div", {
    style: {
      position: "relative",
      display: "flex",
      alignItems: "center",
      gap: 9
    }
  }, /*#__PURE__*/React.createElement(TsSegBar, {
    t: t,
    accent: accent
  }), /*#__PURE__*/React.createElement("span", {
    style: {
      fontFamily: TS_MONO,
      fontWeight: 700,
      fontSize: 11,
      color: "#A9A9B2"
    }
  }, t.taken, "/", t.max), /*#__PURE__*/React.createElement("span", {
    style: {
      marginLeft: "auto"
    }
  }, /*#__PURE__*/React.createElement(TsSit, {
    accent: accent,
    full: full
  }))));
}
// T2 · FRACTION — uniform-height tile; badges live in a reserved bottom shelf
// so every card is the same height regardless of how many badges it has.
// (один блок на ліміт; кількість місць — на іконці стола)
function TsTile2({
  t,
  g,
  accent,
  sit
}) {
  const full = t.taken >= t.max;
  const onClick = () => {
    tsClick(1300);
    sit(t, g);
  };
  return /*#__PURE__*/React.createElement("button", {
    onClick: onClick,
    style: {
      ...tsCardBase(full, accent),
      opacity: full ? 0.82 : 1,
      cursor: "pointer",
      borderRadius: 12,
      padding: "0 13px",
      height: 77,
      display: "flex",
      alignItems: "center",
      gap: 12
    }
  }, /*#__PURE__*/React.createElement("span", {
    style: {
      flex: "none",
      width: 46,
      display: "flex",
      flexDirection: "column",
      alignItems: "center"
    }
  }, /*#__PURE__*/React.createElement("span", {
    style: {
      fontFamily: TS_MONO,
      fontWeight: 700,
      fontSize: 19,
      color: accent,
      lineHeight: 1
    }
  }, t.taken, /*#__PURE__*/React.createElement("span", {
    style: {
      color: "#8A8A93",
      fontSize: 14
    }
  }, "/", t.max)), full && /*#__PURE__*/React.createElement("span", {
    style: {
      fontFamily: TS_SANS,
      fontWeight: 700,
      fontSize: 10.5,
      letterSpacing: ".18em",
      color: accent,
      marginTop: 4,
      marginLeft: ".18em"
    }
  }, "FULL")), /*#__PURE__*/React.createElement("span", {
    style: {
      flex: 1,
      minWidth: 0,
      display: "flex",
      flexDirection: "column",
      gap: 3
    }
  }, /*#__PURE__*/React.createElement("span", {
    style: {
      fontFamily: TS_MONO,
      fontWeight: 700,
      fontSize: 15,
      color: "#fff",
      letterSpacing: ".03em"
    }
  }, tsName(t)), /*#__PURE__*/React.createElement("span", {
    style: {
      fontFamily: TS_SANS,
      fontWeight: 600,
      fontSize: 10.5,
      letterSpacing: ".05em",
      color: "#A9A9B2"
    }
  }, "AVG POT ", /*#__PURE__*/React.createElement("span", {
    style: {
      color: "#f0c75e"
    }
  }, t.avg)), /*#__PURE__*/React.createElement("span", {
    style: {
      display: "flex",
      alignItems: "center",
      gap: 5,
      minHeight: 17,
      overflow: "hidden",
      flexWrap: "nowrap"
    }
  }, (() => {
    const badges = [];
    if (t.discTag) {
      const dc = (window.CL_DISC_COLOR || {})[t.discTag];
      badges.push(/*#__PURE__*/React.createElement("span", {
        key: "dc",
        style: {
          fontFamily: TS_SANS,
          fontWeight: 700,
          fontSize: 10.5,
          letterSpacing: ".1em",
          color: dc || "rgba(255,255,255,.55)",
          padding: "3px 8px",
          borderRadius: 5,
          background: dc ? dc + "1f" : "rgba(255,255,255,.07)",
          border: "1px solid " + (dc ? dc + "4d" : "rgba(255,255,255,.1)"),
          whiteSpace: "nowrap"
        }
      }, t.discTag));
    }
    if (t.squid) badges.push(/*#__PURE__*/React.createElement(TsChip, {
      key: "s",
      squid: true
    }, "SQUID GAME"));
    if (t.vpip) badges.push(/*#__PURE__*/React.createElement(TsChip, {
      key: "v",
      hot: true
    }, "VPIP ", t.vpip, "+"));
    if (t.bomb) badges.push(/*#__PURE__*/React.createElement(TsChip, {
      key: "b"
    }, "BOMB \xB7 ", t.bomb));
    if (t.dbl) badges.push(/*#__PURE__*/React.createElement(TsChip, {
      key: "d"
    }, "2 BOARDS"));
    const shown = badges.slice(0, 2);
    if (badges.length > 2) shown.push(/*#__PURE__*/React.createElement(TsChip, {
      key: "more"
    }, "+", badges.length - 2));
    return shown;
  })())), full ? /*#__PURE__*/React.createElement("span", {
    style: {
      ...TS_BTN,
      color: "#fff",
      background: "rgba(255,255,255,.07)",
      border: "1px solid rgba(255,255,255,.2)"
    }
  }, "VIEW \u203A") : /*#__PURE__*/React.createElement(TsSit, {
    accent: accent,
    full: false
  }));
}
// T3 · FREE SEATS — urgency-first: how many seats are left, in words
function TsTile3({
  t,
  g,
  accent,
  sit
}) {
  const full = t.taken >= t.max;
  const left = t.max - t.taken;
  const hot = !full && left === 1;
  return /*#__PURE__*/React.createElement("button", {
    onClick: () => {
      if (!full) {
        tsClick(1300);
        sit(t, g);
      }
    },
    style: {
      ...tsCardBase(full, accent),
      borderRadius: 14,
      padding: "13px 14px",
      display: "flex",
      alignItems: "center",
      gap: 12
    }
  }, /*#__PURE__*/React.createElement("span", {
    style: {
      flex: 1,
      minWidth: 0
    }
  }, /*#__PURE__*/React.createElement("span", {
    style: {
      display: "flex",
      alignItems: "center",
      gap: 7
    }
  }, /*#__PURE__*/React.createElement("span", {
    style: {
      fontFamily: TS_MONO,
      fontWeight: 700,
      fontSize: 15,
      color: "#fff",
      letterSpacing: ".03em"
    }
  }, tsName(t)), /*#__PURE__*/React.createElement("span", {
    style: {
      fontFamily: TS_SANS,
      fontWeight: 700,
      fontSize: 10.5,
      letterSpacing: ".1em",
      color: "#A9A9B2"
    }
  }, t.max, "-MAX")), /*#__PURE__*/React.createElement("span", {
    style: {
      display: "block",
      fontFamily: TS_SANS,
      fontWeight: 600,
      fontSize: 10.5,
      letterSpacing: ".06em",
      color: "#A9A9B2",
      marginTop: 5
    }
  }, "AVG POT ", /*#__PURE__*/React.createElement("span", {
    style: {
      color: "#f0c75e"
    }
  }, t.avg))), /*#__PURE__*/React.createElement("span", {
    style: {
      flex: "none",
      fontFamily: TS_SANS,
      fontWeight: 700,
      fontSize: 10.5,
      letterSpacing: ".12em",
      padding: "5px 9px",
      borderRadius: 125,
      color: full ? "rgba(255,255,255,.55)" : hot ? "#fff" : "rgba(255,255,255,.8)",
      background: full ? "rgba(255,255,255,.075)" : hot ? accent : "rgba(255,255,255,.07)",
      border: `1px solid ${full ? "rgba(255,255,255,.16)" : hot ? accent : "rgba(255,255,255,.16)"}`,
      boxShadow: hot ? `0 0 14px ${accent}66` : "none",
      whiteSpace: "nowrap"
    }
  }, full ? "FULL" : left === 1 ? "1 SEAT LEFT" : left + " SEATS FREE"), !full && /*#__PURE__*/React.createElement(TsSit, {
    accent: accent,
    full: false
  }));
}
// T4 · RING — occupancy ring around the table number
function TsTile4({
  t,
  g,
  accent,
  sit
}) {
  const full = t.taken >= t.max;
  const frac = t.taken / t.max;
  const C = 2 * Math.PI * 16;
  return /*#__PURE__*/React.createElement("button", {
    onClick: () => {
      if (!full) {
        tsClick(1300);
        sit(t, g);
      }
    },
    style: {
      ...tsCardBase(full, accent),
      borderRadius: 14,
      padding: "11px 14px 11px 11px",
      display: "flex",
      alignItems: "center",
      gap: 13
    }
  }, /*#__PURE__*/React.createElement("span", {
    style: {
      flex: "none",
      position: "relative",
      width: 44,
      height: 44
    }
  }, /*#__PURE__*/React.createElement("svg", {
    width: "44",
    height: "44",
    viewBox: "0 0 44 44",
    style: {
      transform: "rotate(-90deg)"
    }
  }, /*#__PURE__*/React.createElement("circle", {
    cx: "22",
    cy: "22",
    r: "16",
    fill: "none",
    stroke: "rgba(255,255,255,.16)",
    strokeWidth: "3"
  }), /*#__PURE__*/React.createElement("circle", {
    cx: "22",
    cy: "22",
    r: "16",
    fill: "none",
    stroke: full ? accent : "#fff",
    strokeWidth: "3",
    strokeLinecap: "round",
    strokeDasharray: `${frac * C} ${C}`
  })), /*#__PURE__*/React.createElement("span", {
    style: {
      position: "absolute",
      inset: 0,
      display: "flex",
      alignItems: "center",
      justifyContent: "center",
      fontFamily: TS_MONO,
      fontWeight: 700,
      fontSize: 12,
      color: "#fff"
    }
  }, t.name)), /*#__PURE__*/React.createElement("span", {
    style: {
      flex: 1,
      minWidth: 0
    }
  }, /*#__PURE__*/React.createElement("span", {
    style: {
      display: "flex",
      alignItems: "center",
      gap: 7
    }
  }, /*#__PURE__*/React.createElement("span", {
    style: {
      fontFamily: TS_MONO,
      fontWeight: 700,
      fontSize: 14,
      color: "#fff",
      letterSpacing: ".03em"
    }
  }, t.taken, "/", t.max), /*#__PURE__*/React.createElement("span", {
    style: {
      fontFamily: TS_SANS,
      fontWeight: 700,
      fontSize: 10.5,
      letterSpacing: ".14em",
      color: "#A9A9B2"
    }
  }, "SEATED"), t.bomb && /*#__PURE__*/React.createElement(TsChip, null, "BOMB \xB7 ", t.bomb)), /*#__PURE__*/React.createElement("span", {
    style: {
      display: "block",
      fontFamily: TS_SANS,
      fontWeight: 600,
      fontSize: 10.5,
      letterSpacing: ".06em",
      color: "#A9A9B2",
      marginTop: 5
    }
  }, "AVG POT ", /*#__PURE__*/React.createElement("span", {
    style: {
      color: "#f0c75e"
    }
  }, t.avg))), /*#__PURE__*/React.createElement(TsSit, {
    accent: accent,
    full: full
  }));
}
// T5 · SIT RAIL — red action column docked to the right edge (kept)
function TsTile5({
  t,
  g,
  accent,
  sit
}) {
  const full = t.taken >= t.max;
  return /*#__PURE__*/React.createElement("button", {
    onClick: () => {
      if (!full) {
        tsClick(1300);
        sit(t, g);
      }
    },
    style: {
      ...tsCardBase(full, accent),
      borderRadius: 16,
      padding: 0,
      display: "flex",
      alignItems: "stretch"
    }
  }, /*#__PURE__*/React.createElement("span", {
    style: {
      flex: 1,
      minWidth: 0,
      padding: "13px 14px",
      display: "flex",
      flexDirection: "column",
      gap: 10
    }
  }, /*#__PURE__*/React.createElement("span", {
    style: {
      display: "flex",
      alignItems: "center",
      gap: 8
    }
  }, /*#__PURE__*/React.createElement("span", {
    style: {
      fontFamily: TS_MONO,
      fontWeight: 700,
      fontSize: 15,
      color: "#fff",
      letterSpacing: ".04em"
    }
  }, tsName(t)), null, t.dbl && /*#__PURE__*/React.createElement(TsChip, null, "2 BOARDS")), /*#__PURE__*/React.createElement("span", {
    style: {
      display: "flex",
      alignItems: "center",
      gap: 9
    }
  }, /*#__PURE__*/React.createElement(TsSegBar, {
    t: t,
    accent: accent,
    w: 84
  }), /*#__PURE__*/React.createElement("span", {
    style: {
      fontFamily: TS_MONO,
      fontWeight: 700,
      fontSize: 10.5,
      color: "#A9A9B2"
    }
  }, t.taken, "/", t.max), /*#__PURE__*/React.createElement("span", {
    style: {
      fontFamily: TS_SANS,
      fontWeight: 700,
      fontSize: 10.5,
      letterSpacing: ".1em",
      color: "#A9A9B2",
      marginLeft: 4
    }
  }, "AVG ", /*#__PURE__*/React.createElement("span", {
    style: {
      color: "#f0c75e"
    }
  }, t.avg)))), /*#__PURE__*/React.createElement("span", {
    style: {
      flex: "none",
      width: 62,
      display: "flex",
      alignItems: "center",
      justifyContent: "center",
      background: full ? "rgba(255,255,255,.065)" : accent,
      borderLeft: "1px solid rgba(0,0,0,.35)",
      fontFamily: TS_MONO,
      fontWeight: 700,
      fontSize: 11,
      letterSpacing: ".08em",
      color: full ? "rgba(255,255,255,.6)" : tsInk(accent)
    }
  }, full ? "FULL" : "SIT ›"));
}
// T6 · RAIL II — evolved rail: seats live inside the action column
function TsTile6({
  t,
  g,
  accent,
  sit
}) {
  const full = t.taken >= t.max;
  const left = t.max - t.taken;
  return /*#__PURE__*/React.createElement("button", {
    onClick: () => {
      if (!full) {
        tsClick(1300);
        sit(t, g);
      }
    },
    style: {
      ...tsCardBase(full, accent),
      borderRadius: 16,
      padding: 0,
      display: "flex",
      alignItems: "stretch"
    }
  }, /*#__PURE__*/React.createElement("span", {
    style: {
      flex: "none",
      width: 4,
      background: full ? "rgba(255,255,255,.1)" : accent,
      opacity: full ? 1 : 0.85
    }
  }), /*#__PURE__*/React.createElement("span", {
    style: {
      flex: 1,
      minWidth: 0,
      padding: "13px 14px",
      display: "flex",
      flexDirection: "column",
      gap: 8
    }
  }, /*#__PURE__*/React.createElement("span", {
    style: {
      display: "flex",
      alignItems: "center",
      gap: 8
    }
  }, /*#__PURE__*/React.createElement("span", {
    style: {
      fontFamily: TS_MONO,
      fontWeight: 700,
      fontSize: 15,
      color: "#fff",
      letterSpacing: ".04em"
    }
  }, tsName(t)), /*#__PURE__*/React.createElement("span", {
    style: {
      fontFamily: TS_SANS,
      fontWeight: 700,
      fontSize: 10.5,
      letterSpacing: ".1em",
      color: "#A9A9B2"
    }
  }, t.max, "-MAX")), /*#__PURE__*/React.createElement("span", {
    style: {
      display: "flex",
      alignItems: "center",
      gap: 6
    }
  }, /*#__PURE__*/React.createElement("span", {
    style: {
      fontFamily: TS_SANS,
      fontWeight: 700,
      fontSize: 10.5,
      letterSpacing: ".1em",
      color: "#A9A9B2"
    }
  }, "AVG POT ", /*#__PURE__*/React.createElement("span", {
    style: {
      color: "#f0c75e"
    }
  }, t.avg)), t.bomb && /*#__PURE__*/React.createElement(TsChip, null, "BOMB \xB7 ", t.bomb), t.dbl && /*#__PURE__*/React.createElement(TsChip, null, "2 BOARDS"))), /*#__PURE__*/React.createElement("span", {
    style: {
      flex: "none",
      width: 84,
      display: "flex",
      flexDirection: "column",
      alignItems: "center",
      justifyContent: "center",
      gap: 3,
      background: full ? "rgba(255,255,255,.065)" : accent,
      borderLeft: "1px solid rgba(0,0,0,.35)"
    }
  }, /*#__PURE__*/React.createElement("span", {
    style: {
      fontFamily: TS_MONO,
      fontWeight: 700,
      fontSize: 12,
      letterSpacing: ".06em",
      color: full ? "rgba(255,255,255,.6)" : tsInk(accent)
    }
  }, full ? "FULL" : "SIT ›"), /*#__PURE__*/React.createElement("span", {
    style: {
      fontFamily: TS_SANS,
      fontWeight: 700,
      fontSize: 10.5,
      letterSpacing: ".12em",
      color: full ? "rgba(255,255,255,.55)" : "rgba(255,255,255,.85)"
    }
  }, full ? t.taken + "/" + t.max : left === 1 ? "1 SEAT LEFT" : left + " FREE")));
}

// ── V7 tag icons — Tabler outline (MIT), 24x24 grid, currentColor ─────────
const TS_TAG_SVG = {
  // all four are stroke-only on the same 24 grid, weight 2.1 — one family
  bomb: /*#__PURE__*/React.createElement("g", null, /*#__PURE__*/React.createElement("circle", {
    cx: "9.8",
    cy: "15.2",
    r: "6.9",
    fill: "currentColor",
    stroke: "none"
  }), /*#__PURE__*/React.createElement("rect", {
    x: "13.1",
    y: "8.2",
    width: "4.4",
    height: "3.4",
    rx: "1.1",
    transform: "rotate(-45 15.3 9.9)",
    fill: "currentColor",
    stroke: "none"
  }), /*#__PURE__*/React.createElement("path", {
    d: "M16.9 8.1c1.9 -1.5 2.6 -3 2.4 -4.6"
  }), /*#__PURE__*/React.createElement("path", {
    d: "M21.6 3.4h1.6M19.8 6.9l1.5 1.1M22.6 6.2l-.9 .5"
  })),
  dbl: /*#__PURE__*/React.createElement("g", null, /*#__PURE__*/React.createElement("rect", {
    x: "3.2",
    y: "7.4",
    width: "9.4",
    height: "12.8",
    rx: "2"
  }), /*#__PURE__*/React.createElement("rect", {
    x: "11.4",
    y: "3.8",
    width: "9.4",
    height: "12.8",
    rx: "2"
  })),
  vpip: /*#__PURE__*/React.createElement("path", {
    d: "M4 4.5h16v1.9a2 2 0 0 1 -.6 1.4l-4.4 4.4v6.9l-6 -2v-4.9l-4.4 -4.4a2 2 0 0 1 -.6 -1.4z"
  }),
  squid: /*#__PURE__*/React.createElement("g", null, /*#__PURE__*/React.createElement("path", {
    d: "M12 3.4l-4 6.9h8z"
  }), /*#__PURE__*/React.createElement("circle", {
    cx: "16.8",
    cy: "16.8",
    r: "3.1"
  }), /*#__PURE__*/React.createElement("rect", {
    x: "4",
    y: "13.7",
    width: "6.2",
    height: "6.2",
    rx: "1"
  }))
};
const TS_TAG_META = {
  bomb: {
    c: "#D71921",
    ink: "#fff",
    label: "BOMB POT",
    short: "BOMB"
  },
  dbl: {
    c: "#3B82F6",
    ink: "#fff",
    label: "DOUBLE BOARD",
    short: "2 BOARDS"
  },
  vpip: {
    c: "#E08A1E",
    ink: "#fff",
    label: "VPIP 30+",
    short: "VPIP 30+"
  },
  squid: {
    c: "#1FA97F",
    ink: "#fff",
    label: "SQUID GAME",
    short: "SQUID"
  }
};
function TsTagIcon({
  k,
  size = 26
}) {
  const m = TS_TAG_META[k];
  return /*#__PURE__*/React.createElement("span", {
    style: {
      flex: "none",
      boxSizing: "border-box",
      width: size,
      height: size,
      borderRadius: 8,
      background: m.c,
      color: m.ink,
      display: "flex",
      alignItems: "center",
      justifyContent: "center"
    }
  }, /*#__PURE__*/React.createElement("svg", {
    width: Math.round(size * .62),
    height: Math.round(size * .62),
    viewBox: "0 0 24 24",
    fill: "none",
    stroke: "currentColor",
    strokeWidth: "2.2",
    strokeLinecap: "round",
    strokeLinejoin: "round"
  }, TS_TAG_SVG[k]));
}
const tsTagKeys = t => ["bomb", "dbl", "vpip", "squid"].filter(k => t[k]);
// occupancy as a real table seen from above — flat, no gradients:
// felt filled in the discipline colour, chunky chair pads on the rim
// (white = taken, dim grey = free), seat count straight on the felt.
function TsSeatTable({
  taken,
  max,
  accent,
  full
}) {
  // Seats at EQUAL ARC LENGTH around an offset ring, starting at the bottom centre.
  // Each back is rotated by the OUTWARD NORMAL, so the chair always faces the felt
  // and its curve bows away from the table — like real chairs around a table.
  const W = 62,
    H = 44,
    cx = W / 2,
    cy = H / 2;
  const tw = 40,
    th = 22,
    tr = 10;
  const g = 4.2,
    R = tr + g;
  const runX = tw - 2 * tr,
    runY = th - 2 * tr;
  const per = 2 * runX + 2 * runY + 2 * Math.PI * R,
    qq = Math.PI / 2 * R;
  // walk clockwise from the bottom centre → [x, y, nx, ny] with (nx,ny) pointing OUT
  const at = t => {
    t = (t % per + per) % per;
    const xR = cx + runX / 2,
      xL = cx - runX / 2,
      yB = cy + runY / 2,
      yT = cy - runY / 2;
    if (t < runX / 2) return [cx + t, yB + R, 0, 1];
    t -= runX / 2;
    if (t < qq) {
      const a = t / R;
      return [xR + R * Math.sin(a), yB + R * Math.cos(a), Math.sin(a), Math.cos(a)];
    }
    t -= qq;
    if (t < runY) return [xR + R, yB - t, 1, 0];
    t -= runY;
    if (t < qq) {
      const a = t / R;
      return [xR + R * Math.cos(a), yT - R * Math.sin(a), Math.cos(a), -Math.sin(a)];
    }
    t -= qq;
    if (t < runX) return [xR - t, yT - R, 0, -1];
    t -= runX;
    if (t < qq) {
      const a = t / R;
      return [xL - R * Math.sin(a), yT - R * Math.cos(a), -Math.sin(a), -Math.cos(a)];
    }
    t -= qq;
    if (t < runY) return [xL - R, yT + t, -1, 0];
    t -= runY;
    if (t < qq) {
      const a = t / R;
      return [xL - R * Math.cos(a), yB + R * Math.sin(a), -Math.cos(a), Math.sin(a)];
    }
    return [xL + (t - qq), yB + R, 0, 1];
  };
  // місця заповнюються ЗА годинниковою стрілкою від низу столу
  const seats = Array.from({
    length: max
  }, (_, k) => at(-per / max * k));
  const felt = full ? "#242427" : accent;
  const pad = {
    w: 9.2,
    h: 6.8,
    r: 2.6
  };
  return /*#__PURE__*/React.createElement("svg", {
    width: W,
    height: H,
    style: {
      display: "block",
      overflow: "visible"
    }
  }, seats.map(([x, y, nx, ny], i) => {
    // rotate(θ) sends local +Y to (-sinθ, cosθ); match that to the outward normal
    const rot = Math.atan2(-nx, ny) * 180 / Math.PI;
    return /*#__PURE__*/React.createElement("rect", {
      key: i,
      x: -pad.w / 2,
      y: -pad.h / 2,
      width: pad.w,
      height: pad.h,
      rx: pad.r,
      fill: i < taken ? "#fff" : "#4a4a50",
      transform: "translate(" + x.toFixed(2) + " " + y.toFixed(2) + ") rotate(" + rot.toFixed(1) + ")"
    });
  }), /*#__PURE__*/React.createElement("rect", {
    x: cx - tw / 2,
    y: cy - th / 2,
    width: tw,
    height: th,
    rx: tr,
    fill: felt
  }), /*#__PURE__*/React.createElement("text", {
    x: cx,
    y: cy + 3.8,
    textAnchor: "middle",
    fontFamily: TS_MONO,
    fontWeight: "700",
    fontSize: "11",
    fill: full ? "rgba(255,255,255,.6)" : tsInk(accent)
  }, taken, "/", max));
}

// T7 · ICON TAGS — no discipline rail on the card, seats as a big fraction,
// blinds lead, buy-in in its own column, table features as icons only.
// ── Превʼю столу (референс ClubGG) ──────────────────────────────────────
// Тап по рядку розкриває під ним мініатюру столу: хто сидить, зі скільки,
// де дилер і блайнди. Сісти можна вже звідти.
const TS_AVA = ["assets/chat/drebin.webp", "assets/chat/girl.webp", "assets/chat/yanu.webp", "assets/chat/sponge.webp"];
const TS_NICKS = ["AceHunter", "bluffKing", "rivr_rat", "MingTilt", "donk_99", "TheNit", "calling_stn", "gtoWizard", "shovemonkey", "felt_lord", "checkraise", "snapcall", "tightAgro", "limpKing", "coolerz"];
// детермінований набір гравців для конкретного стола
const tsSeatData = (t, g) => {
  let s = 0;
  String(t.id + t.name).split("").forEach(c => {
    s = (s * 31 + c.charCodeAt(0)) % 2147483647;
  });
  const r = () => {
    s = (s * 16807 + 11) % 2147483647;
    return s / 2147483647;
  };
  return Array.from({
    length: t.max
  }, (_, i) => i < t.taken ? {
    nick: TS_NICKS[Math.floor(r() * TS_NICKS.length)],
    ava: TS_AVA[Math.floor(r() * TS_AVA.length)],
    stack: Math.round(g.bb * (28 + r() * 140) * 100) / 100
  } : null);
};

// Розкладки місць підібрані вручну під 6- і 9-макс: рівні проміжки, ніхто
// ні на кого не налазить. Порядок — за годинниковою стрілкою від низу.
const TS_SEATMAP = {
  6: [[50, 90], [17, 72], [17, 26], [50, 8], [83, 26], [83, 72]],
  9: [[50, 90], [25, 85], [12, 59], [14, 27], [34, 8], [66, 8], [86, 27], [88, 59], [75, 85]]
};
const tsSeatMap = max => TS_SEATMAP[max] || TS_SEATMAP[6];
function TsPreview({
  t,
  g,
  accent,
  onSit,
  onQueue
}) {
  const seats = tsSeatData(t, g);
  const full = t.taken >= t.max;
  const map = tsSeatMap(t.max);
  const money = v => window.TS_MONEY ? window.TS_MONEY.money(v, 1) : "$" + v;
  // бейдж дилера/блайндів — між центром столу і місцем, на сукні
  const badge = (label, i, bg, fg) => {
    const [sx, sy] = map[i % map.length],
      k = 0.5;
    const x = 50 + (sx - 50) * k,
      y = 50 + (sy - 50) * k;
    return /*#__PURE__*/React.createElement("span", {
      key: label,
      style: {
        position: "absolute",
        left: `calc(${x}% - 10px)`,
        top: `calc(${y}% - 10px)`,
        width: 20,
        height: 20,
        borderRadius: "50%",
        background: bg,
        color: fg,
        display: "flex",
        alignItems: "center",
        justifyContent: "center",
        fontFamily: TS_MONO,
        fontWeight: 700,
        fontSize: 8.5,
        boxShadow: "0 2px 7px rgba(0,0,0,.6)",
        zIndex: 4
      }
    }, label);
  };
  // приглушена кнопка: градієнт замість плаского кислотного кольору
  const cta = primary => ({
    flex: 1,
    boxSizing: "border-box",
    height: 44,
    borderRadius: 125,
    cursor: "pointer",
    display: "flex",
    alignItems: "center",
    justifyContent: "center",
    fontFamily: TS_SANS,
    fontWeight: 700,
    fontSize: 11.5,
    letterSpacing: ".14em",
    border: `1px solid ${accent}${primary ? "" : "59"}`,
    background: primary ? `linear-gradient(180deg, ${accent}D9 0%, ${accent}8C 100%)` : "rgba(255,255,255,.045)",
    color: "#fff",
    boxShadow: primary ? `0 6px 18px ${accent}33, inset 0 1px 0 rgba(255,255,255,.16)` : "none"
  });
  return /*#__PURE__*/React.createElement("div", {
    style: {
      marginTop: -4,
      borderRadius: "0 0 16px 16px",
      overflow: "hidden",
      border: `1px solid ${accent}33`,
      borderTop: 0,
      background: "linear-gradient(180deg, rgba(255,255,255,.035), rgba(10,10,12,.94))",
      padding: "12px 12px 14px",
      animation: "px-drop .22s cubic-bezier(.2,.8,.2,1) both"
    }
  }, /*#__PURE__*/React.createElement("div", {
    style: {
      position: "relative",
      width: "100%",
      height: 198
    }
  }, /*#__PURE__*/React.createElement("div", {
    style: {
      position: "absolute",
      left: "50%",
      top: "50%",
      transform: "translate(-50%,-50%)",
      width: "64%",
      height: "52%",
      borderRadius: 999,
      background: `radial-gradient(ellipse at 50% 30%, ${accent}4d 0%, ${accent}1f 52%, rgba(8,8,10,.94) 100%)`,
      border: `1px solid ${accent}47`,
      boxShadow: `inset 0 2px 18px rgba(0,0,0,.7), 0 0 0 6px rgba(255,255,255,.02), 0 10px 26px rgba(0,0,0,.55)`
    }
  }), t.taken > 0 && badge("D", 0, "#fff", "#08080A"), t.taken > 1 && badge("SB", 1 % t.max, "#f0c75e", "#08080A"), t.taken > 2 && badge("BB", 2 % t.max, accent, tsInk(accent)), seats.map((pl, i) => {
    const [x, y] = map[i % map.length];
    if (!pl) return /*#__PURE__*/React.createElement("span", {
      key: i,
      style: {
        position: "absolute",
        left: `calc(${x}% - 13px)`,
        top: `calc(${y}% - 13px)`,
        width: 26,
        height: 26,
        borderRadius: "50%",
        border: "1px dashed rgba(255,255,255,.22)",
        background: "rgba(255,255,255,.025)"
      }
    });
    return /*#__PURE__*/React.createElement("span", {
      key: i,
      style: {
        position: "absolute",
        left: `calc(${x}% - 30px)`,
        top: `calc(${y}% - 22px)`,
        width: 60,
        display: "flex",
        flexDirection: "column",
        alignItems: "center",
        zIndex: 2
      }
    }, /*#__PURE__*/React.createElement("img", {
      src: pl.ava,
      alt: "",
      style: {
        width: 26,
        height: 26,
        borderRadius: "50%",
        objectFit: "cover",
        border: `1.5px solid ${accent}`,
        boxShadow: "0 3px 9px rgba(0,0,0,.7)"
      },
      onError: e => {
        e.currentTarget.style.visibility = "hidden";
      }
    }), /*#__PURE__*/React.createElement("span", {
      style: {
        width: "100%",
        boxSizing: "border-box",
        marginTop: -3,
        padding: "3px 4px 2px",
        borderRadius: 6,
        background: "rgba(10,10,12,.96)",
        border: "1px solid rgba(255,255,255,.11)",
        display: "flex",
        flexDirection: "column",
        alignItems: "center",
        boxShadow: "0 3px 8px rgba(0,0,0,.5)"
      }
    }, /*#__PURE__*/React.createElement("span", {
      "data-i18n": "off",
      style: {
        maxWidth: "100%",
        fontFamily: TS_SANS,
        fontWeight: 700,
        fontSize: 7.5,
        lineHeight: 1.2,
        color: "#8A8A93",
        whiteSpace: "nowrap",
        overflow: "hidden",
        textOverflow: "ellipsis"
      }
    }, pl.nick), /*#__PURE__*/React.createElement("span", {
      style: {
        fontFamily: TS_MONO,
        fontWeight: 700,
        fontSize: 8.5,
        lineHeight: 1.25,
        color: "#fff",
        fontVariantNumeric: "tabular-nums",
        whiteSpace: "nowrap"
      }
    }, money(pl.stack))));
  })), /*#__PURE__*/React.createElement("div", {
    style: {
      display: "flex",
      gap: 9,
      marginTop: 8
    }
  }, full ? /*#__PURE__*/React.createElement(React.Fragment, null, /*#__PURE__*/React.createElement("button", {
    onClick: onSit,
    style: cta(false)
  }, "OPEN TABLE"), /*#__PURE__*/React.createElement("button", {
    onClick: onQueue,
    style: cta(true)
  }, "JOIN THE QUEUE")) : /*#__PURE__*/React.createElement("button", {
    onClick: onSit,
    style: cta(true)
  }, "OPEN TABLE")));
}
function TsTile7({
  t,
  g,
  accent,
  sit,
  open,
  onToggle
}) {
  const full = t.taken >= t.max;
  const keys = tsTagKeys(t);
  return /*#__PURE__*/React.createElement("button", {
    onClick: () => {
      tsClick(1300);
      onToggle();
    },
    style: {
      ...tsCardBase(full, accent),
      opacity: full ? 0.82 : 1,
      cursor: "pointer",
      boxSizing: "border-box",
      flex: "none",
      height: 77,
      borderRadius: 12,
      padding: "0 12px 0 0",
      display: "flex",
      alignItems: "center",
      gap: 9
    }
  }, /*#__PURE__*/React.createElement("span", {
    style: {
      flex: "none",
      width: 66,
      display: "flex",
      alignItems: "center",
      justifyContent: "center"
    }
  }, /*#__PURE__*/React.createElement(TsSeatTable, {
    taken: t.taken,
    max: t.max,
    accent: accent,
    full: full
  })), /*#__PURE__*/React.createElement("span", {
    style: {
      flex: 1,
      minWidth: 0,
      display: "flex",
      flexDirection: "column",
      gap: 4
    }
  }, /*#__PURE__*/React.createElement("span", {
    style: {
      display: "flex",
      alignItems: "center",
      gap: 8,
      minWidth: 0
    }
  }, /*#__PURE__*/React.createElement("span", {
    style: {
      flex: 1,
      minWidth: 0,
      fontFamily: TS_MONO,
      fontWeight: 700,
      fontSize: 15,
      color: "#fff",
      letterSpacing: ".03em",
      whiteSpace: "nowrap",
      overflow: "hidden",
      textOverflow: "ellipsis"
    }
  }, tsName(t))), keys.length > 0 && /*#__PURE__*/React.createElement("span", {
    style: {
      display: "flex",
      alignItems: "center",
      gap: 4
    }
  }, keys.map(k => /*#__PURE__*/React.createElement(TsTagIcon, {
    key: k,
    k: k,
    size: 20
  })))), /*#__PURE__*/React.createElement("span", {
    style: {
      flex: "none",
      display: "flex",
      flexDirection: "column",
      alignItems: "flex-end",
      gap: 3
    }
  }, /*#__PURE__*/React.createElement("span", {
    style: {
      fontFamily: TS_SANS,
      fontWeight: 700,
      fontSize: 10.5,
      letterSpacing: ".06em",
      color: full ? "rgba(255,255,255,.5)" : accent,
      whiteSpace: "nowrap"
    }
  }, window.Term ? /*#__PURE__*/React.createElement(window.Term, {
    k: "BUY-IN"
  }, "BUY-IN FROM") : "BUY-IN FROM"), /*#__PURE__*/React.createElement("span", {
    style: {
      fontFamily: TS_MONO,
      fontWeight: 700,
      fontSize: 15,
      color: "#fff",
      letterSpacing: ".01em",
      whiteSpace: "nowrap",
      fontVariantNumeric: "tabular-nums",
      lineHeight: 1.1
    }
  }, g.buyInFrom)), /*#__PURE__*/React.createElement("span", {
    style: {
      flex: "none",
      width: 34,
      height: 34,
      borderRadius: "50%",
      background: full ? "rgba(255,255,255,.08)" : accent,
      border: full ? "1px solid rgba(255,255,255,.22)" : 0,
      display: "flex",
      alignItems: "center",
      justifyContent: "center",
      boxShadow: full ? "none" : `0 5px 14px ${accent}66`,
      transform: open ? "rotate(180deg)" : "none",
      transition: "transform 220ms"
    }
  }, /*#__PURE__*/React.createElement("svg", {
    width: "15",
    height: "15",
    viewBox: "0 0 24 24",
    fill: "none",
    stroke: full ? "#D8D8DF" : tsInk(accent),
    strokeWidth: "3",
    strokeLinecap: "round",
    strokeLinejoin: "round"
  }, /*#__PURE__*/React.createElement("path", {
    d: "M6 9l6 6 6-6"
  }))));
}
const TS_TILES = {
  1: TsTile1,
  2: TsTile2,
  3: TsTile3,
  4: TsTile4,
  5: TsTile5,
  6: TsTile6,
  7: TsTile7
};

// ── screen: ALL + stake rail, tile list (sections in ALL mode) ───────────
// filter checkbox — fixed 20x20 box (border-box, no shrink) so the square never deforms
// Правка 18: підпис увімкненої і вимкненої галочки — ОДНАКОВОГО кегля і ваги,
// різниця лише в кольорі. compact — варіант для тісного ряду над списком.
function TsCheck({
  on,
  accent,
  label,
  onClick,
  compact
}) {
  const box = compact ? 17 : 20;
  return /*#__PURE__*/React.createElement("button", {
    onClick: onClick,
    style: {
      flex: "none",
      display: "flex",
      alignItems: "center",
      gap: compact ? 7 : 9,
      height: 44,
      padding: "0 2px",
      background: "none",
      border: "none",
      cursor: "pointer"
    }
  }, /*#__PURE__*/React.createElement("span", {
    style: {
      boxSizing: "border-box",
      flex: "none",
      width: box,
      height: box,
      borderRadius: compact ? 5 : 6,
      display: "flex",
      alignItems: "center",
      justifyContent: "center",
      background: on ? "#D71921" : "rgba(255,255,255,.07)",
      border: "1px solid " + (on ? "#D71921" : "rgba(255,255,255,.26)"),
      transition: "background .15s, border-color .15s"
    }
  }, on && /*#__PURE__*/React.createElement("svg", {
    width: compact ? 10 : 12,
    height: compact ? 10 : 12,
    viewBox: "0 0 24 24",
    fill: "none",
    stroke: "#fff",
    strokeWidth: "3.4",
    strokeLinecap: "round",
    strokeLinejoin: "round",
    style: {
      flex: "none",
      display: "block"
    }
  }, /*#__PURE__*/React.createElement("path", {
    d: "M4 12.5l5.5 5.5L20 6.5"
  }))), /*#__PURE__*/React.createElement("span", {
    style: {
      fontFamily: TS_SANS,
      fontWeight: 700,
      fontSize: compact ? 9.5 : 10.5,
      letterSpacing: compact ? ".04em" : ".16em",
      color: on ? "#fff" : "#A9A9B2",
      whiteSpace: "nowrap"
    }
  }, label));
}

// ── нижня шторка фільтрів (правка 11) ─────────────────────────────────────
// Той самий силует, що в решти шторок додатка: ручка, заголовок з хрестиком,
// прокрутний вміст, закріплена панель дій.
function TsSheet({
  open,
  onClose,
  title,
  children,
  cta
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
      zIndex: 60,
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
      minWidth: 0,
      fontFamily: TS_MONO,
      fontWeight: 700,
      fontSize: 15,
      color: "#fff",
      letterSpacing: ".04em"
    }
  }, title), /*#__PURE__*/React.createElement("button", {
    onClick: () => {
      tsClick(900);
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
// підпис секції всередині шторки
function TsSheetLabel({
  children
}) {
  return /*#__PURE__*/React.createElement("div", {
    style: {
      fontFamily: TS_SANS,
      fontWeight: 700,
      fontSize: 10.5,
      letterSpacing: ".2em",
      color: "#8A8A93",
      margin: "16px 0 10px"
    }
  }, children);
}
function TableSelect({
  open,
  onClose,
  onSit,
  accent = "#D71921",
  discipline = "HOLD'EM",
  tile = 2,
  balance = window.pxMoney && window.pxWallets ? window.pxMoney(window.pxWallets().usd) : "$4 827",
  groups = null,
  title = "CHOOSE A TABLE",
  sub = null,
  rail = null,
  railVal = null,
  onRail = null,
  top = null,
  discRail = null,
  discVal = "ALL",
  onDisc = null,
  discOnly = null,
  stakeOnly = null,
  hideStakeRail = false,
  viewTabs = false,
  onQuickPick = null,
  onTourn = null,
  noAnim = false
}) {
  const [mounted, setMounted] = React.useState(false);
  // empty set = ALL; several disciplines and several limits can be on at once
  const [discSel, setDiscSel] = React.useState(() => discVal && discVal !== "ALL" ? [discVal] : []);
  const [tierSel, setTierSel] = React.useState([]);
  const [hideFull, setHideFull] = React.useState(false); // off by default
  const [hideEmpty, setHideEmpty] = React.useState(true); // on by default
  // правка 11: смуга фільтрів більше не розсувається всередині екрана —
  // «ФИЛЬТРЫ» відкривають нижню шторку, а верхня зона лишається закріпленою
  const [fOpen, setFOpen] = React.useState(false);
  const [sizeSel, setSizeSel] = React.useState([]); // 6 / 9, порожньо = будь-який
  const [openId, setOpenId] = React.useState(null); // стіл із розкритим превʼю
  const [tagSel, setTagSel] = React.useState([]); // мітки столу
  React.useEffect(() => {
    if (!open) return;
    if (noAnim) {
      setMounted(true);
      return;
    }
    setMounted(false);
    const r = requestAnimationFrame(() => setMounted(true));
    const f = setTimeout(() => setMounted(true), 60);
    return () => {
      cancelAnimationFrame(r);
      clearTimeout(f);
    };
  }, [open]);
  React.useEffect(() => {
    if (!open) {
      setFOpen(false);
      setOpenId(null);
    }
  }, [open]);
  // дисципліну обрали на іншій вкладці — підхоплюємо, щоб рядок не «стрибав»
  React.useEffect(() => {
    setDiscSel(discVal && discVal !== "ALL" ? [discVal] : []);
  }, [discVal]);
  if (!open) return null;
  const Tile = TS_TILES[Number(tile)] || TsTile1;
  // Один вибір, як на «Быстром меню»: рядок дисциплін однаковий на обох
  // вкладках і поводиться однаково — це перемикач, а не набір галочок.
  const toggleDisc = d => {
    setDiscSel(d === "ALL" ? [] : [d]);
    if (onDisc) onDisc(d);
  };
  const toggleTier = i => setTierSel(cur => i < 0 ? [] : cur.indexOf(i) >= 0 ? cur.filter(x => x !== i) : cur.concat(i));
  const discOn = d => d === "ALL" ? discSel.length === 0 : discSel.indexOf(d) >= 0;
  const DC = window.CL_DISC_COLOR || {};
  const sit = (t, g) => onSit({
    ...t,
    name: tsName(t),
    stake: g.stake,
    buyIn: g.buyIn
  });
  const pill = (on, c, h) => ({
    flex: "none",
    height: h || 44,
    padding: "0 16px",
    display: "inline-flex",
    alignItems: "center",
    borderRadius: 125,
    cursor: "pointer",
    border: `1px solid ${on ? c || accent : "rgba(255,255,255,.18)"}`,
    background: on ? c || accent : "rgba(255,255,255,.065)",
    fontFamily: TS_MONO,
    fontWeight: 700,
    fontSize: 12,
    letterSpacing: ".02em",
    color: on ? tsInk(c || accent) : "rgba(255,255,255,.72)",
    transition: "background .15s, border-color .15s",
    boxShadow: on ? `0 6px 16px ${accent}44` : "none"
  });
  // sticky section header — stays pinned at the top of the list, swapped out by the next one
  // Правка 16: один рядок-розділювач — ЛІМІТ зліва, РОЗМІР СТОЛУ справа,
  // кількість столів не показуємо. Окремого заголовка з лімітом більше немає.
  const stickyHead = (g, first) => {
    const c = DC[g.disc] || accent;
    return /*#__PURE__*/React.createElement("div", {
      style: {
        position: "sticky",
        top: 0,
        zIndex: 3,
        margin: first ? "0 -14px 8px" : "14px -14px 8px",
        background: "#0a0a0c"
      }
    }, /*#__PURE__*/React.createElement("div", {
      style: {
        height: 1,
        background: `${c}80`
      }
    }), /*#__PURE__*/React.createElement("div", {
      style: {
        padding: "4px 17px 5px"
      }
    }, /*#__PURE__*/React.createElement("span", {
      style: {
        fontFamily: TS_MONO,
        fontWeight: 700,
        fontSize: 13,
        color: "#fff",
        letterSpacing: ".03em",
        whiteSpace: "nowrap"
      }
    }, tsStake(g))), /*#__PURE__*/React.createElement("div", {
      style: {
        height: 1,
        background: `${c}40`
      }
    }));
  };

  // discipline rail (classic path): filter a stake group's tables by discipline,
  // ALL keeps the chip order: HOLD'EM → PLO → PLO5 → PLO6 → SHORT DECK
  const DISC_ORDER = ["HOLD'EM", "PLO", "PLO5", "PLO6", "SHORT DECK"];
  const discIdx = d => {
    const i = DISC_ORDER.indexOf(String(d || "").toUpperCase());
    return i < 0 ? 99 : i;
  };
  // and tag each tile with its discipline while ALL is selected
  // розмір столу і мітки — те саме сито для обох гілок
  const bySizeTag = ts => {
    let out = ts;
    if (sizeSel.length) out = out.filter(t => sizeSel.indexOf(t.max) >= 0);
    if (tagSel.length) out = out.filter(t => tagSel.some(k => t[k]));
    return out;
  };
  const byDisc = g => {
    if (!discRail) {
      let ts = discOnly ? g.tables.filter(t => t.disc === discOnly) : g.tables;
      if (hideFull) ts = ts.filter(t => t.taken < t.max);
      if (hideEmpty) ts = ts.filter(t => t.taken > 0);
      ts = bySizeTag(ts);
      return ts === g.tables ? g : {
        ...g,
        tables: ts
      };
    }
    let ts = discSel.length === 0 ? g.tables.map(t => ({
      ...t,
      discTag: t.disc
    })).slice().sort((a, b) => discIdx(a.disc) - discIdx(b.disc)) : g.tables.filter(t => discSel.indexOf(t.disc) >= 0).map(t => ({
      ...t,
      discTag: t.disc
    })).slice().sort((a, b) => discIdx(a.disc) - discIdx(b.disc));
    if (hideFull) ts = ts.filter(t => t.taken < t.max);
    if (hideEmpty) ts = ts.filter(t => t.taken > 0);
    ts = bySizeTag(ts);
    return {
      ...g,
      tables: ts
    };
  };
  // CASH GAMES entry passes one limit: pin the list to that stake tier and
  // split it into per-discipline sections in the chip order
  const pinned = stakeOnly ? TS_TIERS.find(g => g.sb === stakeOnly.sb && g.bb === stakeOnly.bb) : null;
  const discGroups = pinned && discSel.length === 0 ? DISC_ORDER.map(d => ({
    ...pinned,
    disc: d,
    tables: pinned.tables.filter(x => x.disc === d).map(x => ({
      ...x,
      discTag: d
    }))
  })).filter(g => g.tables.length) : null;
  // which stake tiers the list shows — every one when no limit pill is on
  const tierIdx = TS_TIERS.map((g, i) => i).filter(i => !tierSel.length || tierSel.indexOf(i) >= 0);
  // how many tables the current filter set actually shows
  const shownCount = (discGroups || (pinned ? [pinned] : groups) || tierIdx.map(i => TS_TIERS[i])).reduce((n, g) => n + byDisc(g).tables.length, 0);
  // короткий опис активних фільтрів для згорнутої панелі
  const filtersOn = discSel.length > 0 || tierSel.length > 0 || sizeSel.length > 0 || tagSel.length > 0;
  const filterCount = discSel.length + tierSel.length + sizeSel.length + tagSel.length;
  // Один ліміт — один блок. Кількість місць видно на іконці стола (1/6, 8/9),
  // тож окремі підсекції 6-MAX / 9-MAX більше не потрібні.
  const renderGroup = (g0, withHead, first) => {
    const g = byDisc(g0);
    if (!g.tables.length) return null;
    return /*#__PURE__*/React.createElement(React.Fragment, {
      key: (g.disc || "") + g.stake
    }, /*#__PURE__*/React.createElement("div", null, stickyHead(g, first), /*#__PURE__*/React.createElement("div", {
      style: {
        display: "flex",
        flexDirection: "column",
        gap: 9
      }
    }, g.tables.map(t => {
      const c = DC[t.disc] || accent;
      const on = openId === t.id;
      return /*#__PURE__*/React.createElement("div", {
        key: t.id
      }, /*#__PURE__*/React.createElement(Tile, {
        t: t,
        g: g,
        accent: c,
        sit: sit,
        open: on,
        onToggle: () => setOpenId(on ? null : t.id)
      }), on && /*#__PURE__*/React.createElement(TsPreview, {
        t: t,
        g: g,
        accent: c,
        onSit: () => {
          tsClick(1400);
          sit(t, g);
        },
        onQueue: () => {
          tsClick(1400);
          sit({
            ...t,
            queue: true
          }, g);
        }
      }));
    }))));
  };
  return /*#__PURE__*/React.createElement("div", {
    style: {
      position: "absolute",
      inset: 0,
      zIndex: 110,
      background: "#0a0a0c",
      animation: noAnim ? "none" : "px-up 360ms cubic-bezier(0.2,0.8,0.2,1) both",
      display: "flex",
      flexDirection: "column"
    }
  }, /*#__PURE__*/React.createElement("div", {
    style: {
      position: "absolute",
      top: 0,
      left: 0,
      right: 0,
      height: 210,
      pointerEvents: "none",
      background: `radial-gradient(ellipse 90% 70% at 50% 0%, ${accent}22, transparent 62%)`
    }
  }), /*#__PURE__*/React.createElement("div", {
    style: {
      position: "absolute",
      inset: 0,
      pointerEvents: "none",
      backgroundImage: "radial-gradient(circle, rgba(255,255,255,.045) 0.6px, transparent 1px)",
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
      tsClick(900);
      onClose();
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
  }))), window.PxSectionTitle && viewTabs ? /*#__PURE__*/React.createElement(window.PxSectionTitle, {
    label: "CASH GAMES",
    accent: accent,
    topInset: 104
  }) : /*#__PURE__*/React.createElement("span", {
    style: {
      flex: 1
    }
  }), window.PxBalance ? /*#__PURE__*/React.createElement(window.PxBalance, {
    value: balance,
    onTap: () => {
      tsClick(1250);
      if (window.openDeposit) window.openDeposit();
    }
  }) : null), viewTabs ? /*#__PURE__*/React.createElement("div", {
    style: {
      position: "relative",
      zIndex: 5,
      padding: "12px 14px 12px"
    }
  }, /*#__PURE__*/React.createElement("div", {
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
  }, /*#__PURE__*/React.createElement("button", {
    style: {
      flex: 1,
      minWidth: 0,
      borderRadius: 9,
      border: 0,
      cursor: "default",
      display: "flex",
      alignItems: "center",
      justifyContent: "center",
      background: "#D71921",
      color: "#fff",
      fontFamily: TS_MONO,
      fontWeight: 700,
      fontSize: 10.5,
      letterSpacing: ".1em",
      whiteSpace: "nowrap",
      boxShadow: "0 4px 12px rgba(0,0,0,.45)"
    }
  }, "ALL TABLES"), /*#__PURE__*/React.createElement("button", {
    onClick: () => {
      tsClick(1150);
      onQuickPick && onQuickPick();
    },
    style: {
      flex: 1,
      minWidth: 0,
      borderRadius: 9,
      border: 0,
      cursor: "pointer",
      display: "flex",
      alignItems: "center",
      justifyContent: "center",
      background: "transparent",
      color: "rgba(255,255,255,.55)",
      fontFamily: TS_MONO,
      fontWeight: 700,
      fontSize: 10.5,
      letterSpacing: ".1em",
      whiteSpace: "nowrap"
    }
  }, "QUICK PICK"))) : /*#__PURE__*/React.createElement("div", {
    style: {
      position: "relative",
      zIndex: 5,
      padding: "14px 14px 14px",
      textAlign: "center"
    }
  }, /*#__PURE__*/React.createElement("div", {
    style: {
      display: "inline-flex",
      alignItems: "center",
      justifyContent: "center",
      gap: 7,
      maxWidth: "100%"
    }
  }, /*#__PURE__*/React.createElement("span", {
    style: {
      fontFamily: TS_MONO,
      fontWeight: 700,
      fontSize: 15,
      color: "#fff",
      letterSpacing: ".16em"
    }
  }, title), window.InfoDot ? /*#__PURE__*/React.createElement(window.InfoDot, {
    title: title,
    accent: accent
  }) : null)), discRail && /*#__PURE__*/React.createElement("div", {
    style: {
      position: "relative",
      zIndex: 4,
      display: "flex",
      gap: 7,
      padding: "0 14px 10px",
      overflowX: "auto",
      scrollbarWidth: "none"
    }
  }, discRail.map(d => /*#__PURE__*/React.createElement("button", {
    key: d,
    onClick: () => {
      tsClick(1250);
      toggleDisc(d);
    },
    style: pill(discOn(d), d === "ALL" ? "#D71921" : DC[d], 38)
  }, d))), /*#__PURE__*/React.createElement("div", {
    style: {
      position: "relative",
      zIndex: 4,
      display: "flex",
      alignItems: "center",
      gap: 10,
      padding: "0 14px 12px"
    }
  }, /*#__PURE__*/React.createElement("span", {
    style: {
      flex: 1,
      minWidth: 0,
      display: "flex",
      alignItems: "center",
      gap: 12
    }
  }, /*#__PURE__*/React.createElement(TsCheck, {
    compact: true,
    on: hideFull,
    accent: accent,
    label: "HIDE FULL",
    onClick: () => {
      tsClick(1050);
      setHideFull(!hideFull);
    }
  }), /*#__PURE__*/React.createElement(TsCheck, {
    compact: true,
    on: hideEmpty,
    accent: accent,
    label: "HIDE EMPTY",
    onClick: () => {
      tsClick(1050);
      setHideEmpty(!hideEmpty);
    }
  })), /*#__PURE__*/React.createElement("button", {
    onClick: () => {
      tsClick(1100);
      setFOpen(true);
    },
    style: {
      flex: "none",
      boxSizing: "border-box",
      width: 116,
      height: 40,
      padding: 0,
      borderRadius: 12,
      cursor: "pointer",
      background: filtersOn ? accent + "1f" : "rgba(255,255,255,.055)",
      border: `1px solid ${filtersOn ? accent + "88" : "rgba(255,255,255,.14)"}`,
      display: "flex",
      alignItems: "center",
      justifyContent: "center",
      gap: 8
    }
  }, /*#__PURE__*/React.createElement("svg", {
    width: "15",
    height: "15",
    viewBox: "0 0 24 24",
    fill: "none",
    stroke: filtersOn ? accent : "#A9A9B2",
    strokeWidth: "2",
    strokeLinecap: "round",
    style: {
      flex: "none"
    }
  }, /*#__PURE__*/React.createElement("path", {
    d: "M3 6h18M6 12h12M10 18h4"
  })), /*#__PURE__*/React.createElement("span", {
    style: {
      fontFamily: TS_MONO,
      fontWeight: 700,
      fontSize: 11,
      letterSpacing: ".12em",
      color: "#fff",
      whiteSpace: "nowrap"
    }
  }, "FILTERS"))), /*#__PURE__*/React.createElement("div", {
    style: {
      flex: 1,
      overflowY: "auto",
      overflowX: "hidden",
      WebkitOverflowScrolling: "touch",
      padding: "0 14px 40px",
      position: "relative",
      zIndex: 2
    }
  }, top, shownCount === 0 ? /*#__PURE__*/React.createElement("div", {
    style: {
      padding: "56px 24px",
      textAlign: "center"
    }
  }, /*#__PURE__*/React.createElement("div", {
    style: {
      width: 46,
      height: 46,
      margin: "0 auto 14px",
      borderRadius: 14,
      background: "rgba(255,255,255,.05)",
      border: "1px solid rgba(255,255,255,.12)",
      display: "flex",
      alignItems: "center",
      justifyContent: "center"
    }
  }, /*#__PURE__*/React.createElement("svg", {
    width: "22",
    height: "22",
    viewBox: "0 0 24 24",
    fill: "none",
    stroke: "#6A6A72",
    strokeWidth: "1.8",
    strokeLinecap: "round",
    strokeLinejoin: "round"
  }, /*#__PURE__*/React.createElement("rect", {
    x: "2.5",
    y: "7",
    width: "19",
    height: "10",
    rx: "5"
  }), /*#__PURE__*/React.createElement("path", {
    d: "M7 4.5v2M12 4.5v2M17 4.5v2M7 17.5v2M12 17.5v2M17 17.5v2"
  }))), /*#__PURE__*/React.createElement("div", {
    style: {
      fontFamily: TS_MONO,
      fontWeight: 700,
      fontSize: 13.5,
      letterSpacing: ".12em",
      color: "#fff"
    }
  }, "NO ACTIVE TABLES"), /*#__PURE__*/React.createElement("div", {
    style: {
      fontFamily: TS_SANS,
      fontWeight: 600,
      fontSize: 11.5,
      lineHeight: 1.5,
      color: "#8A8A93",
      marginTop: 8,
      textWrap: "pretty"
    }
  }, "Nothing matches these filters right now. Change the discipline or reset the filters."), /*#__PURE__*/React.createElement("button", {
    onClick: () => {
      tsClick(1250);
      setDiscSel([]);
      setTierSel([]);
      setSizeSel([]);
      setTagSel([]);
      setHideFull(false);
      setHideEmpty(true);
      if (onDisc) onDisc("ALL");
    },
    style: Object.assign(UI.btn("m", "outline", accent), {
      marginTop: 16
    })
  }, "RESET FILTERS")) : discGroups ? discGroups.map((g, i) => renderGroup(g, true, i === 0 && !top)) : pinned ? renderGroup(pinned, false, true) : groups ? groups.map((g, i) => renderGroup(g, true, i === 0 && !top)) : discRail && discSel.length === 0
  /* «ВСЕ»: сортуємо дисциплінами, всередині кожної — ліміти згори вниз */ ? (() => {
    const out = [];
    let firstBand = !top;
    DISC_ORDER.forEach(d => {
      const rows = [];
      tierIdx.forEach(i => {
        const g0 = TS_TIERS[i];
        const g = {
          ...g0,
          disc: d,
          tables: g0.tables.filter(t => t.disc === d)
        };
        if (!g.tables.length) return;
        const r = renderGroup(g, true, firstBand && rows.length === 0);
        if (r) rows.push(r);
      });
      if (!rows.length) return;
      // заголовка дисципліни немає: дисципліну видно з кольору
      // картки і з назви стола (NLH / PLO / PLO5 / SD)
      firstBand = false;
      out.push(/*#__PURE__*/React.createElement(React.Fragment, {
        key: "discwrap-" + d
      }, rows));
    });
    return out;
  })() : tierIdx.map((i, n) => renderGroup(TS_TIERS[i], true, n === 0 && !top))), /*#__PURE__*/React.createElement(TsSheet, {
    open: fOpen,
    onClose: () => setFOpen(false),
    title: "FILTERS",
    cta: /*#__PURE__*/React.createElement("div", {
      style: {
        display: "flex",
        gap: 9
      }
    }, /*#__PURE__*/React.createElement("button", {
      onClick: () => {
        tsClick(900);
        setDiscSel([]);
        setTierSel([]);
        setSizeSel([]);
        setTagSel([]);
        setHideFull(false);
        setHideEmpty(true);
        if (onDisc) onDisc("ALL");
      },
      style: {
        flex: "none",
        boxSizing: "border-box",
        height: 48,
        padding: "0 20px",
        borderRadius: 125,
        cursor: "pointer",
        background: "rgba(255,255,255,.065)",
        border: "1px solid rgba(255,255,255,.18)",
        color: "#fff",
        fontFamily: TS_SANS,
        fontWeight: 700,
        fontSize: 11,
        letterSpacing: ".14em"
      }
    }, "RESET"), /*#__PURE__*/React.createElement("button", {
      onClick: () => {
        tsClick(1350);
        setFOpen(false);
      },
      style: {
        flex: 1,
        boxSizing: "border-box",
        height: 48,
        borderRadius: 125,
        cursor: "pointer",
        border: 0,
        background: accent,
        color: tsInk(accent),
        fontFamily: TS_SANS,
        fontWeight: 700,
        fontSize: 12.5,
        letterSpacing: ".14em",
        boxShadow: `0 10px 24px ${accent}55`
      }
    }, "APPLY · " + shownCount + " TABLES"))
  }, discRail && /*#__PURE__*/React.createElement(React.Fragment, null, /*#__PURE__*/React.createElement(TsSheetLabel, null, "DISCIPLINE"), /*#__PURE__*/React.createElement("div", {
    style: {
      display: "flex",
      flexWrap: "wrap",
      gap: 8
    }
  }, discRail.map(d => /*#__PURE__*/React.createElement("button", {
    key: d,
    onClick: () => {
      tsClick(1250);
      toggleDisc(d);
    },
    style: pill(discOn(d), DC[d], 40)
  }, d)))), /*#__PURE__*/React.createElement(TsSheetLabel, null, "TABLES"), /*#__PURE__*/React.createElement("div", {
    style: {
      display: "flex",
      alignItems: "center",
      gap: 18,
      flexWrap: "wrap"
    }
  }, /*#__PURE__*/React.createElement(TsCheck, {
    on: hideFull,
    accent: accent,
    label: "HIDE FULL",
    onClick: () => {
      tsClick(1050);
      setHideFull(!hideFull);
    }
  }), /*#__PURE__*/React.createElement(TsCheck, {
    on: hideEmpty,
    accent: accent,
    label: "HIDE EMPTY",
    onClick: () => {
      tsClick(1050);
      setHideEmpty(!hideEmpty);
    }
  })), /*#__PURE__*/React.createElement(TsSheetLabel, null, "TABLE SIZE"), /*#__PURE__*/React.createElement("div", {
    style: {
      display: "flex",
      gap: 8
    }
  }, /*#__PURE__*/React.createElement("button", {
    onClick: () => {
      tsClick(1250);
      setSizeSel([]);
    },
    style: pill(sizeSel.length === 0, null, 40)
  }, "ANY"), /*#__PURE__*/React.createElement("button", {
    onClick: () => {
      tsClick(1250);
      setSizeSel(sizeSel.indexOf(6) >= 0 ? sizeSel.filter(x => x !== 6) : sizeSel.concat(6));
    },
    style: pill(sizeSel.indexOf(6) >= 0, null, 40)
  }, "6-MAX"), /*#__PURE__*/React.createElement("button", {
    onClick: () => {
      tsClick(1250);
      setSizeSel(sizeSel.indexOf(9) >= 0 ? sizeSel.filter(x => x !== 9) : sizeSel.concat(9));
    },
    style: pill(sizeSel.indexOf(9) >= 0, null, 40)
  }, "9-MAX")), !hideStakeRail && /*#__PURE__*/React.createElement(React.Fragment, null, /*#__PURE__*/React.createElement(TsSheetLabel, null, "LIMITS"), /*#__PURE__*/React.createElement("div", {
    style: {
      display: "flex",
      flexWrap: "wrap",
      gap: 8
    }
  }, rail ? rail.map(r => /*#__PURE__*/React.createElement("button", {
    key: r,
    onClick: () => {
      tsClick(1250);
      onRail && onRail(r);
    },
    style: pill(r === railVal, null, 40)
  }, r)) : /*#__PURE__*/React.createElement(React.Fragment, null, /*#__PURE__*/React.createElement("button", {
    onClick: () => {
      tsClick(1250);
      toggleTier(-1);
    },
    style: pill(tierSel.length === 0, null, 40)
  }, "ALL"), TS_TIERS.map((g, i) => /*#__PURE__*/React.createElement("button", {
    key: g.stake,
    onClick: () => {
      tsClick(1250);
      toggleTier(i);
    },
    style: pill(tierSel.indexOf(i) >= 0, null, 40)
  }, tsStake(g)))))), /*#__PURE__*/React.createElement(TsSheetLabel, null, "TABLE TAGS"), /*#__PURE__*/React.createElement("div", {
    style: {
      display: "flex",
      flexDirection: "column",
      gap: 8,
      paddingBottom: 4
    }
  }, ["bomb", "dbl", "vpip", "squid"].map(k => {
    const on = tagSel.indexOf(k) >= 0;
    const m = TS_TAG_META[k];
    return /*#__PURE__*/React.createElement("button", {
      key: k,
      onClick: () => {
        tsClick(1250);
        setTagSel(on ? tagSel.filter(x => x !== k) : tagSel.concat(k));
      },
      style: {
        width: "100%",
        boxSizing: "border-box",
        height: 52,
        padding: "0 12px",
        borderRadius: 12,
        cursor: "pointer",
        background: on ? m.c + "1f" : "rgba(255,255,255,.05)",
        border: `1px solid ${on ? m.c + "99" : "rgba(255,255,255,.12)"}`,
        display: "flex",
        alignItems: "center",
        gap: 11
      }
    }, /*#__PURE__*/React.createElement(TsTagIcon, {
      k: k,
      size: 28
    }), /*#__PURE__*/React.createElement("span", {
      style: {
        flex: 1,
        minWidth: 0,
        textAlign: "left",
        fontFamily: TS_MONO,
        fontWeight: 700,
        fontSize: 13,
        letterSpacing: ".04em",
        color: "#fff",
        whiteSpace: "nowrap"
      }
    }, m.label), /*#__PURE__*/React.createElement("span", {
      style: {
        boxSizing: "border-box",
        flex: "none",
        width: 20,
        height: 20,
        borderRadius: 6,
        display: "flex",
        alignItems: "center",
        justifyContent: "center",
        background: on ? m.c : "rgba(255,255,255,.07)",
        border: "1px solid " + (on ? m.c : "rgba(255,255,255,.26)")
      }
    }, on && /*#__PURE__*/React.createElement("svg", {
      width: "12",
      height: "12",
      viewBox: "0 0 24 24",
      fill: "none",
      stroke: "#fff",
      strokeWidth: "3.4",
      strokeLinecap: "round",
      strokeLinejoin: "round"
    }, /*#__PURE__*/React.createElement("path", {
      d: "M4 12.5l5.5 5.5L20 6.5"
    }))));
  }))));
}
window.TableListScreen = TableSelect;
Object.assign(window, {
  TS_TIERS,
  TsTagIcon,
  TS_TAG_META,
  TS_MONEY
});