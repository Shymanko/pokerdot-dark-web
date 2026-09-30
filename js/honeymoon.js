function _extends() { return _extends = Object.assign ? Object.assign.bind() : function (n) { for (var e = 1; e < arguments.length; e++) { var t = arguments[e]; for (var r in t) ({}).hasOwnProperty.call(t, r) && (n[r] = t[r]); } return n; }, _extends.apply(null, arguments); }
// Honeymoon — 30-day newcomer challenge, 1:1 with the GG-style system:
//   • manual opt-in ("START HONEYMOON"), window closes on day 7
//   • one mission per day, 30 days, reset 00:00 UTC (day 1 gets +24h grace)
//   • rewards hang on MILESTONES = number of missions completed, not on the day,
//     so a missed day only slows the ladder down, it never burns a reward
//   • mixed reward types on purpose: cash → product tickets → flagship seat
//
// Exposes: HoneymoonWidget (lobby strip) · HoneymoonScreen (takeover)
//          window.hmState() / window.hmStart() / window.hmClaim() — shared store

const MONO_HM = UI.font;
const SANS_HM = UI.fontUI;
const HM_GOLD = "#E0B44A";
const hmNum = n => n.toLocaleString("en-US").split(",").join(" ");
const hmKzt = n => "C$" + hmNum(n);

// ── the ladder — reward per NUMBER of completed missions ───────────────────
const HM_MILES = [{
  n: 1,
  cash: 2000,
  label: "C$2 000"
}, {
  n: 3,
  ticket: true,
  label: "3 × SPIN & WIN C$1 000",
  short: "3 TICKETS"
}, {
  n: 5,
  cash: 4000,
  label: "C$4 000"
}, {
  n: 7,
  cash: 6000,
  label: "C$6 000"
}, {
  n: 9,
  cash: 7000,
  label: "C$7 000"
}, {
  n: 11,
  cash: 8000,
  label: "C$8 000"
}, {
  n: 14,
  ticket: true,
  label: "SATELLITE STEP 3 C$10 000",
  short: "SAT STEP 3"
}, {
  n: 16,
  cash: 15000,
  label: "C$15 000"
}, {
  n: 19,
  cash: 20000,
  label: "C$20 000"
}, {
  n: 22,
  cash: 25000,
  label: "C$25 000"
}, {
  n: 26,
  ticket: true,
  label: "MAIN EVENT C$150 000",
  short: "MAIN EVENT",
  gold: true
}, {
  n: 30,
  cash: 150000,
  label: "C$150 000",
  gold: true
}];
const HM_TOTAL = 400000;

// ── reward art ─ the actual prize, never a gift box ─────────────────────
// Chrome renders on transparent background, one per reward type. Drop a new
// file over the same path to swap the art — no code change needed.
const HM_ART = {
  cash: "assets/rewards/cash.png",
  // chrome C$ glyph
  spin: "assets/rewards/ticket.png",
  // silver ticket — spins
  tourn: "assets/rewards/ticket.png" // silver ticket — tournament seat
};
const hmKind = m => !m || m.cash ? "cash" : /SPIN/i.test(m.label || "") ? "spin" : "tourn";
const hmArt = m => HM_ART[hmKind(m)];

// ── 30 daily missions ──────────────────────────────────────────────────────
const HM_DAYS = ["Play 30 hands of HOLD'EM", "Win a hand with a flush", "Play 3 SPIN & WIN games", "Play 50 hands of any cash game", "Enter any tournament", "Win 2 SPIN & WIN games", "Play 40 hands of OMAHA", "Reach the money in a tournament", "Play 60 hands of FAST POKER", "Win a hand holding pocket aces", "Play 5 SPIN & WIN games", "Play 2 tournaments", "Play 80 hands of any cash game", "Win a hand with a full house", "Play 40 hands of SHORT DECK", "Knock out a player in a tournament", "Play 100 hands of FAST POKER", "Win 3 SPIN & WIN games", "Play 3 tournaments", "Win a hand with four of a kind", "Play 120 hands of any cash game", "Reach a tournament final table", "Play 60 hands of OMAHA", "Win 4 SPIN & WIN games", "Play 150 hands of FAST POKER", "Score 3 knockouts in tournaments", "Play 4 tournaments", "Win a hand with a straight flush", "Play 200 hands of any cash game", "Cash in any tournament"];

// ── shared store (survives re-renders and reloads) ─────────────────────────
// per-day goal — the mission's own unit (goal for "Win 2 …" is 2, not 30 hands)
const HM_GOALS = [30, 1, 3, 50, 1, 2, 40, 1, 60, 1, 5, 2, 80, 1, 40, 1, 100, 3, 3, 1, 120, 1, 60, 4, 150, 3, 4, 1, 200, 1];
const HM_KEY = "pokerix.honeymoon.v3";
const hmDefault = {
  started: true,
  day: 13,
  done: 10,
  missed: [4, 9],
  claimed: [1, 3, 5, 7, 9],
  prog: 12,
  signupDay: 1
};
let HM = (() => {
  try {
    return Object.assign({}, hmDefault, JSON.parse(localStorage.getItem(HM_KEY) || "{}"));
  } catch (e) {
    return Object.assign({}, hmDefault);
  }
})();
const hmSave = () => {
  try {
    localStorage.setItem(HM_KEY, JSON.stringify(HM));
  } catch (e) {}
  window.dispatchEvent(new Event("hmchange"));
};
window.hmState = () => {
  // derive the counters so the number, the grid and the legend can never disagree
  const missed = (HM.missed || []).filter(n => n < HM.day);
  HM.done = Math.max(0, Math.min(30, HM.day - 1 - missed.length));
  const next = HM_MILES.find(m => m.n > HM.done) || null;
  const ready = HM_MILES.filter(m => m.n <= HM.done && HM.claimed.indexOf(m.n) < 0);
  const goal = HM_GOALS[Math.min(29, HM.day - 1)];
  return Object.assign({}, HM, {
    total: 30,
    next,
    ready,
    goal,
    missed,
    prog: Math.min(HM.prog, goal),
    todayDone: HM.prog >= goal,
    mission: HM_DAYS[Math.min(29, HM.day - 1)],
    startWindow: 7 - HM.signupDay
  });
};
window.hmStart = () => {
  HM.started = true;
  HM.day = 1;
  HM.done = 0;
  HM.missed = [];
  HM.claimed = [];
  HM.prog = 0;
  hmSave();
};
window.hmClaim = n => {
  if (HM.claimed.indexOf(n) < 0) {
    HM.claimed = HM.claimed.concat([n]);
    hmSave();
  }
};
window.hmComplete = () => {
  HM.prog = HM_GOALS[Math.min(29, HM.day - 1)];
  HM.done = Math.min(30, HM.done + 1);
  hmSave();
};
// live re-render hook
function useHm() {
  const [, force] = React.useState(0);
  React.useEffect(() => {
    const h = () => force(x => x + 1);
    window.addEventListener("hmchange", h);
    return () => window.removeEventListener("hmchange", h);
  }, []);
  return window.hmState();
}

// live countdown to the next 00:00 UTC reset — the daily pressure device
const hmLeft = () => {
  const now = new Date();
  const end = Date.UTC(now.getUTCFullYear(), now.getUTCMonth(), now.getUTCDate() + 1);
  let t = Math.max(0, Math.floor((end - now.getTime()) / 1000));
  const p = x => String(x).padStart(2, "0");
  return {
    str: p(Math.floor(t / 3600)) + ":" + p(Math.floor(t % 3600 / 60)) + ":" + p(t % 60),
    hot: t < 3 * 3600
  };
};
function useHmClock() {
  const [left, setLeft] = React.useState(hmLeft);
  React.useEffect(() => {
    const id = setInterval(() => setLeft(hmLeft()), 1000);
    return () => clearInterval(id);
  }, []);
  return left;
}
function HmIcon({
  kind,
  color = "#fff",
  size = 18
}) {
  const p = {
    width: size,
    height: size,
    viewBox: "0 0 24 24",
    fill: "none",
    stroke: color,
    strokeWidth: 2.2,
    strokeLinecap: "round",
    strokeLinejoin: "round"
  };
  switch (kind) {
    case "check":
      return /*#__PURE__*/React.createElement("svg", p, /*#__PURE__*/React.createElement("path", {
        d: "M4 12.5l5 5L20 6.5"
      }));
    case "cash":
      return /*#__PURE__*/React.createElement("svg", p, /*#__PURE__*/React.createElement("rect", {
        x: "3",
        y: "6",
        width: "18",
        height: "12",
        rx: "2"
      }), /*#__PURE__*/React.createElement("circle", {
        cx: "12",
        cy: "12",
        r: "2.6"
      }));
    case "ticket":
      return /*#__PURE__*/React.createElement("svg", _extends({}, p, {
        strokeWidth: "1.8"
      }), /*#__PURE__*/React.createElement("path", {
        d: "M3 8a2 2 0 0 1 2-2h14a2 2 0 0 1 2 2v2a2 2 0 0 0 0 4v2a2 2 0 0 1-2 2H5a2 2 0 0 1-2-2v-2a2 2 0 0 0 0-4z"
      }), /*#__PURE__*/React.createElement("path", {
        d: "M15 6v12",
        strokeDasharray: "2 2"
      }));
    case "lock":
      return /*#__PURE__*/React.createElement("svg", p, /*#__PURE__*/React.createElement("rect", {
        x: "5",
        y: "11",
        width: "14",
        height: "9",
        rx: "2"
      }), /*#__PURE__*/React.createElement("path", {
        d: "M8 11V8a4 4 0 0 1 8 0v3"
      }));
    case "chev":
      return /*#__PURE__*/React.createElement("svg", _extends({}, p, {
        strokeWidth: "2.6"
      }), /*#__PURE__*/React.createElement("path", {
        d: "M9 6l6 6-6 6"
      }));
  }
}

// 30-cell grid — one cell per mission: cleared, lost, today, still to come
function HmGrid({
  day,
  done,
  missed = [],
  accent
}) {
  return /*#__PURE__*/React.createElement("div", {
    style: {
      display: "grid",
      gridTemplateColumns: "repeat(15, 1fr)",
      gap: 4
    }
  }, Array.from({
    length: 30
  }, (_, i) => {
    const n = i + 1;
    const lost = n < day && missed.indexOf(n) >= 0;
    const isToday = n === day;
    const cleared = n < day && !lost;
    return /*#__PURE__*/React.createElement("span", {
      key: n,
      style: {
        aspectRatio: "1",
        borderRadius: 4,
        background: cleared ? "#5BD96A" : lost ? `${accent}33` : isToday ? "transparent" : "rgba(255,255,255,.09)",
        border: isToday ? `1.5px solid ${accent}` : lost ? `1px solid ${accent}66` : "none",
        boxShadow: isToday ? `0 0 9px ${accent}88` : "none"
      }
    });
  }));
}

// 30-cell dot-matrix day strip — the brand motif, one dot per day
function HmDots({
  day,
  done,
  accent,
  size = 5,
  gap = 3
}) {
  return /*#__PURE__*/React.createElement("span", {
    style: {
      display: "grid",
      gridTemplateColumns: `repeat(30, ${size}px)`,
      gap,
      alignItems: "center"
    }
  }, Array.from({
    length: 30
  }, (_, i) => {
    const n = i + 1;
    const filled = n <= done;
    const isToday = n === day;
    return /*#__PURE__*/React.createElement("span", {
      key: n,
      style: {
        width: size,
        height: size,
        borderRadius: "50%",
        background: filled ? accent : isToday ? "transparent" : "rgba(255,255,255,.16)",
        border: isToday && !filled ? `1px solid ${accent}` : "none",
        boxShadow: filled ? `0 0 6px ${accent}88` : "none"
      }
    });
  }));
}

// ── lobby strip — the counter, the gift, and today's mission in one glance ──
function HoneymoonWidget({
  onOpen,
  accent = "#D71921",
  style
}) {
  const s = useHm();
  const clock = useHmClock();
  const ready = s.ready;
  const readySum = ready.reduce((x, m) => x + (m.cash || 0), 0);
  const pct = Math.min(100, Math.round(s.prog / s.goal * 100));
  const away = s.next ? s.next.n - s.done : 0;
  return /*#__PURE__*/React.createElement("button", {
    onClick: () => {
      if (window.playClick) window.playClick(1200, 0.04);
      onOpen && onOpen();
    },
    style: Object.assign({
      position: "relative",
      overflow: "hidden",
      width: "100%",
      boxSizing: "border-box",
      textAlign: "left",
      cursor: "pointer",
      borderRadius: 20,
      padding: 0,
      border: `1px solid ${accent}59`,
      background: `linear-gradient(150deg, ${accent}2b 0%, #100c0e 54%, #08080a 100%)`,
      boxShadow: "0 14px 34px rgba(0,0,0,.55)",
      display: "block"
    }, style)
  }, /*#__PURE__*/React.createElement("span", {
    style: {
      position: "absolute",
      left: -60,
      top: -90,
      width: 240,
      height: 220,
      borderRadius: "50%",
      background: `radial-gradient(circle, ${accent}3a, transparent 66%)`,
      pointerEvents: "none"
    }
  }), !s.started ? /*#__PURE__*/React.createElement("span", {
    style: {
      position: "relative",
      display: "flex",
      flexDirection: "column",
      gap: 10,
      padding: "14px 15px 13px"
    }
  }, /*#__PURE__*/React.createElement("span", {
    style: {
      display: "flex",
      alignItems: "center",
      gap: 9
    }
  }, /*#__PURE__*/React.createElement("span", {
    style: {
      fontFamily: MONO_HM,
      fontSize: 14,
      color: "#fff",
      letterSpacing: ".12em"
    }
  }, "HONEYMOON"), /*#__PURE__*/React.createElement("span", {
    style: {
      flex: 1
    }
  }), /*#__PURE__*/React.createElement("span", {
    style: {
      display: "inline-flex",
      alignItems: "center",
      gap: 6,
      padding: "5px 11px",
      borderRadius: 125,
      background: `${accent}1c`,
      border: `1px solid ${accent}66`
    }
  }, /*#__PURE__*/React.createElement("span", {
    style: {
      fontFamily: SANS_HM,
      fontWeight: 700,
      fontSize: 10.5,
      letterSpacing: ".1em",
      color: accent
    }
  }, "STARTS IN"), /*#__PURE__*/React.createElement("span", {
    style: {
      fontFamily: MONO_HM,
      fontWeight: 700,
      fontSize: 12,
      color: "#fff",
      fontVariantNumeric: "tabular-nums"
    }
  }, s.startWindow, "D"))), /*#__PURE__*/React.createElement("span", {
    style: {
      display: "flex",
      alignItems: "center",
      gap: 12
    }
  }, /*#__PURE__*/React.createElement("span", {
    "aria-hidden": "true",
    style: {
      flex: "none",
      width: 58,
      height: 58,
      backgroundImage: `url(${HM_ART.cash})`,
      backgroundSize: "contain",
      backgroundPosition: "center",
      backgroundRepeat: "no-repeat"
    }
  }), /*#__PURE__*/React.createElement("span", {
    style: {
      flex: 1,
      minWidth: 0,
      display: "flex",
      flexDirection: "column",
      gap: 3
    }
  }, /*#__PURE__*/React.createElement("span", {
    style: {
      fontFamily: MONO_HM,
      fontWeight: 700,
      fontSize: 20,
      color: "#fff",
      lineHeight: 1
    }
  }, hmKzt(HM_TOTAL)), /*#__PURE__*/React.createElement("span", {
    style: {
      fontFamily: SANS_HM,
      fontWeight: 700,
      fontSize: 12,
      color: "#A9A9B2"
    }
  }, "across 30 missions")), /*#__PURE__*/React.createElement("span", {
    style: {
      flex: "none",
      padding: "10px 20px",
      borderRadius: 125,
      background: accent,
      color: "#fff",
      fontFamily: MONO_HM,
      fontWeight: 700,
      fontSize: 12,
      letterSpacing: ".12em",
      boxShadow: `0 8px 20px ${accent}55`
    }
  }, "START"))) : /*#__PURE__*/React.createElement("span", {
    style: {
      position: "relative",
      display: "block"
    }
  }, /*#__PURE__*/React.createElement("span", {
    style: {
      display: "flex",
      alignItems: "center",
      gap: 12,
      padding: "13px 15px 12px"
    }
  }, /*#__PURE__*/React.createElement("span", {
    style: {
      flex: "none",
      display: "flex",
      flexDirection: "column",
      gap: 4
    }
  }, /*#__PURE__*/React.createElement("span", {
    style: {
      fontFamily: SANS_HM,
      fontWeight: 700,
      fontSize: 10.5,
      letterSpacing: ".16em",
      color: accent
    }
  }, "HONEYMOON"), /*#__PURE__*/React.createElement("span", {
    style: {
      display: "flex",
      alignItems: "baseline",
      gap: 3
    }
  }, /*#__PURE__*/React.createElement("span", {
    style: {
      fontFamily: MONO_HM,
      fontWeight: 700,
      fontSize: 34,
      lineHeight: .9,
      color: "#fff",
      fontVariantNumeric: "tabular-nums"
    }
  }, s.done), /*#__PURE__*/React.createElement("span", {
    style: {
      fontFamily: MONO_HM,
      fontWeight: 700,
      fontSize: 15,
      color: "#8A8A93"
    }
  }, "/30")), /*#__PURE__*/React.createElement("span", {
    style: {
      fontFamily: SANS_HM,
      fontWeight: 700,
      fontSize: 10.5,
      letterSpacing: ".1em",
      color: "#8A8A93"
    }
  }, "CLEARED")), /*#__PURE__*/React.createElement("span", {
    style: {
      flex: 1,
      minWidth: 0,
      display: "flex",
      flexDirection: "column",
      gap: 7,
      alignSelf: "stretch",
      justifyContent: "center"
    }
  }, /*#__PURE__*/React.createElement("span", {
    style: {
      display: "grid",
      gridTemplateColumns: "repeat(15, 1fr)",
      gap: 2.5
    }
  }, Array.from({
    length: 30
  }, (_, i) => {
    const n = i + 1;
    const lost = n < s.day && s.missed.indexOf(n) >= 0;
    const isToday = n === s.day;
    const cleared = n < s.day && !lost;
    return /*#__PURE__*/React.createElement("span", {
      key: n,
      style: {
        aspectRatio: "1",
        borderRadius: 2.5,
        background: cleared ? "#5BD96A" : lost ? `${accent}33` : isToday ? "transparent" : "rgba(255,255,255,.1)",
        border: isToday ? `1.2px solid ${accent}` : "none"
      }
    });
  })), /*#__PURE__*/React.createElement("span", {
    style: {
      display: "inline-flex",
      alignSelf: "flex-start",
      alignItems: "center",
      gap: 6,
      padding: "4px 10px",
      borderRadius: 125,
      background: `${accent}1c`,
      border: `1px solid ${accent}66`
    }
  }, /*#__PURE__*/React.createElement("span", {
    style: {
      fontFamily: SANS_HM,
      fontWeight: 700,
      fontSize: 10.5,
      letterSpacing: ".1em",
      color: clock.hot ? "#FF4B52" : accent
    }
  }, s.todayDone ? "NEXT IN" : "ENDS IN"), /*#__PURE__*/React.createElement("span", {
    style: {
      fontFamily: MONO_HM,
      fontWeight: 700,
      fontSize: 12,
      color: "#fff",
      fontVariantNumeric: "tabular-nums"
    }
  }, clock.str)))), /*#__PURE__*/React.createElement("span", {
    style: {
      display: "flex",
      flexDirection: "column",
      gap: 6,
      padding: "0 15px 12px"
    }
  }, /*#__PURE__*/React.createElement("span", {
    style: {
      display: "flex",
      alignItems: "baseline",
      gap: 8
    }
  }, /*#__PURE__*/React.createElement("span", {
    style: {
      fontFamily: SANS_HM,
      fontWeight: 700,
      fontSize: 10.5,
      letterSpacing: ".14em",
      color: s.todayDone ? "#5BD96A" : "rgba(255,255,255,.5)"
    }
  }, s.todayDone ? "TODAY \u00b7 CLEARED" : "TODAY\u2019S MISSION"), /*#__PURE__*/React.createElement("span", {
    style: {
      flex: 1
    }
  }), s.todayDone ? /*#__PURE__*/React.createElement(HmIcon, {
    kind: "check",
    color: "#5BD96A",
    size: 15
  }) : null), /*#__PURE__*/React.createElement("span", {
    style: {
      fontFamily: MONO_HM,
      fontSize: 14,
      lineHeight: 1.25,
      color: s.todayDone ? "rgba(255,255,255,.62)" : "#fff"
    }
  }, s.mission)), /*#__PURE__*/React.createElement("span", {
    style: {
      display: "flex",
      alignItems: "center",
      gap: 11,
      padding: "10px 15px 11px",
      borderTop: "1px solid rgba(255,255,255,.09)",
      background: "rgba(0,0,0,.28)"
    }
  }, /*#__PURE__*/React.createElement("span", {
    "aria-hidden": "true",
    style: {
      flex: "none",
      width: 46,
      height: 46,
      backgroundImage: `url(${hmArt(ready.length ? ready[0] : s.next)})`,
      backgroundSize: "contain",
      backgroundPosition: "center",
      backgroundRepeat: "no-repeat"
    }
  }), /*#__PURE__*/React.createElement("span", {
    style: {
      flex: 1,
      minWidth: 0,
      display: "flex",
      flexDirection: "column",
      gap: 2
    }
  }, /*#__PURE__*/React.createElement("span", {
    style: {
      fontFamily: MONO_HM,
      fontWeight: 700,
      fontSize: 17,
      lineHeight: 1.05,
      color: "#fff",
      whiteSpace: "nowrap",
      overflow: "hidden",
      textOverflow: "ellipsis"
    }
  }, ready.length ? readySum ? hmKzt(readySum) : ready[0].short : s.next ? s.next.cash ? hmKzt(s.next.cash) : s.next.short : "ALL CLAIMED"), /*#__PURE__*/React.createElement("span", {
    style: {
      fontFamily: SANS_HM,
      fontWeight: 700,
      fontSize: 11,
      color: ready.length ? "#5BD96A" : "rgba(255,255,255,.55)"
    }
  }, ready.length ? "waiting for you" : "NEXT PRIZE IN " + away + (away === 1 ? " MISSION" : " MISSIONS"))), ready.length ? /*#__PURE__*/React.createElement("span", {
    style: {
      flex: "none",
      padding: "9px 17px",
      borderRadius: 125,
      background: accent,
      color: "#fff",
      fontFamily: MONO_HM,
      fontWeight: 700,
      fontSize: 11,
      letterSpacing: ".1em",
      boxShadow: `0 7px 18px ${accent}55`
    }
  }, "CLAIM") : /*#__PURE__*/React.createElement(HmIcon, {
    kind: "chev",
    color: "rgba(255,255,255,.4)",
    size: 16
  }))));
}

// mission → its chrome figurine (same foundry as the Activities tiles)
const hmMissionArt = txt => {
  const t = (txt || "").toLowerCase();
  if (t.indexOf("spin") >= 0) return "assets/comp/spin.png";
  if (t.indexOf("tournament") >= 0 || t.indexOf("final table") >= 0 || t.indexOf("knockout") >= 0 || t.indexOf("money") >= 0) return "assets/fig-trophy-fin.png";
  if (t.indexOf("omaha") >= 0) return "assets/disciplines/plo5.png";
  if (t.indexOf("short deck") >= 0) return "assets/disciplines/shortdeck.png";
  if (t.indexOf("fast poker") >= 0) return "assets/disciplines/flash-and-flush.png";
  if (t.indexOf("cash game") >= 0) return "assets/fig-cash.png";
  return "assets/disciplines/holdem.png";
};

// hairline panel — one shared shell for every block on the screen
function HmPanel({
  title,
  chip,
  right,
  children
}) {
  return /*#__PURE__*/React.createElement("div", {
    style: {
      flex: "none",
      borderRadius: 20,
      border: "1px solid rgba(255,255,255,.1)",
      background: "linear-gradient(180deg,#101014,#0a0a0c)",
      padding: "13px 14px 14px",
      display: "flex",
      flexDirection: "column",
      gap: 11
    }
  }, /*#__PURE__*/React.createElement("div", {
    style: {
      display: "flex",
      alignItems: "center",
      gap: 9
    }
  }, /*#__PURE__*/React.createElement("span", {
    style: {
      flex: 1,
      minWidth: 0
    }
  }, /*#__PURE__*/React.createElement("span", {
    style: {
      display: "block",
      fontFamily: MONO_HM,
      fontWeight: 700,
      fontSize: 13,
      color: "#fff",
      letterSpacing: ".14em"
    }
  }, title), chip ? /*#__PURE__*/React.createElement("span", {
    style: {
      display: "block",
      fontFamily: SANS_HM,
      fontWeight: 700,
      fontSize: 10.5,
      letterSpacing: ".1em",
      color: "#A9A9B2",
      marginTop: 4
    }
  }, chip) : null), right || null), children);
}

// reward ladder as a snapping rail — one card per threshold of successful missions
function HmLadderRail({
  s,
  accent,
  onClaim
}) {
  const ref = React.useRef(null);
  React.useEffect(() => {
    const el = ref.current;
    if (!el) return;
    const t = el.querySelector("[data-hm-focus]");
    if (t) el.scrollLeft = Math.max(0, t.offsetLeft - 14);
  }, [s.done, s.claimed.length]);
  const readyM = HM_MILES.find(m => m.n <= s.done && s.claimed.indexOf(m.n) < 0);
  const focusN = readyM ? readyM.n : s.next ? s.next.n : 30;
  return /*#__PURE__*/React.createElement("div", {
    ref: ref,
    style: {
      overflowX: "auto",
      scrollbarWidth: "none",
      scrollSnapType: "x mandatory",
      margin: "0 -14px",
      padding: "2px 14px 4px",
      display: "flex",
      gap: 10
    }
  }, HM_MILES.map(m => {
    const done = s.done >= m.n;
    const taken = s.claimed.indexOf(m.n) >= 0;
    const ready = done && !taken;
    const isNext = s.next && m.n === s.next.n;
    const col = m.gold ? HM_GOLD : accent;
    return /*#__PURE__*/React.createElement("div", {
      key: m.n,
      "data-hm-focus": m.n === focusN ? "1" : undefined,
      onClick: ready ? () => {
        if (window.playClick) window.playClick(1700, 0.05);
        const fire = () => onClaim(m.n);
        if (window.claimReward) window.claimReward({
          kicker: "HONEYMOON \u00b7 " + m.n + " MISSIONS",
          heading: "REWARD UNLOCKED",
          accent: col,
          gold: !!m.gold,
          items: [{
            amount: m.cash ? hmKzt(m.cash) : m.short || m.label,
            sub: m.cash ? "added to your balance" : "added to your tickets",
            icon: m.cash ? "chip" : "ticket"
          }],
          onCollect: fire
        });else fire();
      } : undefined,
      style: {
        flex: "none",
        width: 142,
        scrollSnapAlign: "start",
        borderRadius: 16,
        padding: "12px 11px 13px",
        cursor: ready ? "pointer" : "default",
        display: "flex",
        flexDirection: "column",
        alignItems: "center",
        gap: 8,
        textAlign: "center",
        border: `1px solid ${ready || isNext ? col : "rgba(255,255,255,.1)"}`,
        background: ready ? `linear-gradient(165deg, ${col}30, #0b0b0d 74%)` : isNext ? `linear-gradient(165deg, ${col}1c, #0a0a0c 78%)` : "linear-gradient(165deg,#101014,#0a0a0c 80%)",
        boxShadow: ready ? `0 0 24px ${col}45` : "none",
        opacity: taken ? .62 : 1
      }
    }, /*#__PURE__*/React.createElement("span", {
      style: {
        fontFamily: SANS_HM,
        fontWeight: 700,
        fontSize: 10.5,
        letterSpacing: ".12em",
        color: isNext || ready ? col : "rgba(255,255,255,.5)",
        whiteSpace: "nowrap"
      }
    }, m.n + (m.n === 1 ? " MISSION" : " MISSIONS")), /*#__PURE__*/React.createElement("span", {
      "aria-hidden": "true",
      style: {
        width: 74,
        height: 74,
        backgroundImage: `url(${hmArt(m)})`,
        backgroundSize: "contain",
        backgroundPosition: "center",
        backgroundRepeat: "no-repeat",
        opacity: taken ? .42 : done ? 1 : .76,
        filter: taken ? "grayscale(1)" : "none"
      }
    }), /*#__PURE__*/React.createElement("span", {
      style: {
        height: 24,
        display: "flex",
        alignItems: "center",
        fontFamily: MONO_HM,
        fontWeight: 700,
        fontSize: m.cash ? 16 : 12.5,
        lineHeight: 1.1,
        color: "#fff",
        whiteSpace: "nowrap"
      }
    }, m.cash ? hmKzt(m.cash) : m.short), /*#__PURE__*/React.createElement("span", {
      style: {
        alignSelf: "stretch",
        height: 30,
        display: "flex",
        alignItems: "center",
        justifyContent: "center"
      }
    }, ready ? /*#__PURE__*/React.createElement("span", {
      style: {
        flex: 1,
        padding: "8px 0",
        borderRadius: 125,
        background: col,
        fontFamily: MONO_HM,
        fontWeight: 700,
        fontSize: 11,
        letterSpacing: ".1em",
        color: m.gold ? "#1b1205" : "#fff"
      }
    }, "CLAIM") : /*#__PURE__*/React.createElement("span", {
      style: {
        display: "flex",
        alignItems: "center",
        gap: 5,
        fontFamily: SANS_HM,
        fontWeight: 700,
        fontSize: 11,
        letterSpacing: ".08em",
        color: taken ? "rgba(255,255,255,.45)" : isNext ? col : "rgba(255,255,255,.38)",
        whiteSpace: "nowrap"
      }
    }, taken ? /*#__PURE__*/React.createElement(React.Fragment, null, /*#__PURE__*/React.createElement(HmIcon, {
      kind: "check",
      color: "rgba(255,255,255,.45)",
      size: 11
    }), "CLAIMED") : m.n - s.done + " AWAY")));
  }));
}
const HM_RULES = ["One mission per day. Each mission has its own 24-hour countdown.", "Miss it and that mission is lost for good — the next one starts automatically with a fresh countdown.", "Rewards land the moment your number of SUCCESSFUL missions hits a threshold: 1, 3, 5, 7, 9, 11, 14, 16, 19, 22, 26, 30.", "Tournament missions count only after the tournament ends."];

// ── takeover screen ───────────────────────────────────────────────────────
// countdown chip — deadline while the mission is open, anticipation once done
function HmTimerChip({
  accent,
  done
}) {
  const clock = useHmClock();
  return /*#__PURE__*/React.createElement("span", {
    style: {
      display: "inline-flex",
      alignItems: "center",
      gap: 6,
      padding: "4px 10px",
      borderRadius: 125,
      background: done ? "rgba(255,255,255,.06)" : `${accent}1c`,
      border: `1px solid ${done ? "rgba(255,255,255,.14)" : accent + "66"}`
    }
  }, /*#__PURE__*/React.createElement("span", {
    style: {
      fontFamily: SANS_HM,
      fontWeight: 700,
      fontSize: 10.5,
      letterSpacing: ".1em",
      color: done ? "rgba(255,255,255,.5)" : accent
    }
  }, done ? "NEXT IN" : "ENDS IN"), /*#__PURE__*/React.createElement("span", {
    style: {
      fontFamily: MONO_HM,
      fontWeight: 700,
      fontSize: 12,
      color: "#fff",
      fontVariantNumeric: "tabular-nums",
      letterSpacing: ".04em"
    }
  }, clock.str));
}
function HoneymoonScreen({
  open,
  onClose,
  accent = "#D71921"
}) {
  const [mounted, setMounted] = React.useState(false);
  const s = useHm();
  React.useEffect(() => {
    if (!open) {
      setMounted(false);
      return;
    }
    const r = requestAnimationFrame(() => setMounted(true));
    const t = setTimeout(() => setMounted(true), 80);
    return () => {
      cancelAnimationFrame(r);
      clearTimeout(t);
    };
  }, [open]);
  if (!open) return null;
  const pct = Math.min(100, Math.round(s.prog / s.goal * 100));
  return /*#__PURE__*/React.createElement("div", {
    style: {
      position: "absolute",
      inset: 0,
      zIndex: 70,
      background: "#000",
      display: "flex",
      flexDirection: "column",
      transform: mounted ? "translateY(0)" : "translateY(100%)",
      transition: "transform 340ms cubic-bezier(0.2,0.8,0.2,1)"
    }
  }, /*#__PURE__*/React.createElement("div", {
    style: {
      position: "absolute",
      top: 0,
      left: 0,
      right: 0,
      height: 240,
      pointerEvents: "none",
      background: `radial-gradient(ellipse 90% 70% at 50% 0%, ${accent}26, transparent 62%)`
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
    className: "pd-screen-header",
    style: {
      position: "relative",
      zIndex: 5,
      paddingTop: 52,
      paddingLeft: 14,
      paddingRight: 16,
      paddingBottom: 8,
      display: "flex",
      alignItems: "center",
      gap: 10
    }
  }, /*#__PURE__*/React.createElement("button", {
    "aria-label": "\u041D\u0430\u0437\u0430\u0434",
    onClick: () => {
      if (window.playClick) window.playClick(900, 0.04);
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
    d: "M15 6l-6 6 6 6"
  }))), /*#__PURE__*/React.createElement("span", {
    style: {
      display: "inline-flex",
      alignItems: "center",
      gap: 7,
      minWidth: 0,
      maxWidth: "100%",
      flex: 1,
      justifyContent: "center"
    }
  }, /*#__PURE__*/React.createElement("span", {
    style: {
      textAlign: "center",
      fontFamily: MONO_HM,
      fontWeight: 700,
      fontSize: 15,
      color: "#fff",
      letterSpacing: ".16em"
    }
  }, "HONEYMOON"), window.InfoDot ? /*#__PURE__*/React.createElement(window.InfoDot, {
    title: "HONEYMOON"
  }) : null), /*#__PURE__*/React.createElement("span", {
    style: {
      flex: "none",
      width: 36
    }
  })), /*#__PURE__*/React.createElement("div", {
    style: {
      position: "relative",
      zIndex: 2,
      flex: 1,
      minHeight: 0,
      overflowY: "auto",
      WebkitOverflowScrolling: "touch",
      padding: "6px 16px 28px",
      display: "flex",
      flexDirection: "column",
      gap: 12
    }
  }, !s.started ?
  /*#__PURE__*/
  /* ── opt-in ── */
  React.createElement(React.Fragment, null, /*#__PURE__*/React.createElement("div", {
    style: {
      flex: "none",
      borderRadius: 20,
      border: `1px solid ${accent}66`,
      background: `linear-gradient(150deg, ${accent}34, #0c0c0f 68%)`,
      padding: "20px 18px 18px",
      display: "flex",
      flexDirection: "column",
      gap: 12
    }
  }, /*#__PURE__*/React.createElement("span", {
    style: {
      fontFamily: SANS_HM,
      fontWeight: 700,
      fontSize: 10.5,
      letterSpacing: ".16em",
      color: accent
    }
  }, "30-DAY CHALLENGE"), /*#__PURE__*/React.createElement("span", {
    style: {
      fontFamily: MONO_HM,
      fontSize: 26,
      color: "#fff",
      lineHeight: 1.05,
      letterSpacing: ".02em"
    }
  }, "30 DAYS.", /*#__PURE__*/React.createElement("br", null), "30 MISSIONS."), /*#__PURE__*/React.createElement("span", {
    style: {
      fontFamily: SANS_HM,
      fontWeight: 600,
      fontSize: 12,
      lineHeight: 1.5,
      color: "#D8D8DF"
    }
  }, "One simple mission a day. Rewards land the moment you clear a milestone \u2014 cash, Spin & Win tickets, and a seat in the Main Event."), /*#__PURE__*/React.createElement("span", {
    style: {
      display: "flex",
      alignItems: "baseline",
      gap: 8,
      marginTop: 2
    }
  }, /*#__PURE__*/React.createElement("span", {
    style: {
      fontFamily: MONO_HM,
      fontWeight: 700,
      fontSize: 24,
      color: "#fff"
    }
  }, hmKzt(HM_TOTAL)), /*#__PURE__*/React.createElement("span", {
    style: {
      fontFamily: SANS_HM,
      fontWeight: 700,
      fontSize: 10.5,
      letterSpacing: ".12em",
      color: "#A9A9B2"
    }
  }, "TOTAL REWARDS"))), /*#__PURE__*/React.createElement("div", {
    style: {
      flex: "none",
      borderRadius: 14,
      border: "1px dashed rgba(255,255,255,.16)",
      padding: "12px 13px",
      fontFamily: SANS_HM,
      fontWeight: 600,
      fontSize: 11,
      lineHeight: 1.5,
      color: "#A9A9B2"
    }
  }, "You have " + s.startWindow + (s.startWindow === 1 ? " day" : " days") + " left to start. The Honeymoon expires if you don't begin by day 7."), /*#__PURE__*/React.createElement(HmPanel, {
    title: "HOW IT WORKS",
    chip: HM_RULES.length + " RULES"
  }, /*#__PURE__*/React.createElement("div", {
    style: {
      display: "flex",
      flexDirection: "column",
      gap: 8
    }
  }, HM_RULES.map((r, i) => /*#__PURE__*/React.createElement("div", {
    key: i,
    style: {
      display: "flex",
      gap: 8,
      fontFamily: SANS_HM,
      fontWeight: 600,
      fontSize: 11,
      lineHeight: 1.45,
      color: "#D8D8DF"
    }
  }, /*#__PURE__*/React.createElement("span", {
    style: {
      flex: "none",
      width: 4,
      height: 4,
      borderRadius: "50%",
      background: accent,
      marginTop: 6
    }
  }), r)))), /*#__PURE__*/React.createElement("button", {
    onClick: () => {
      if (window.playClick) window.playClick(1500, 0.05);
      window.hmStart();
    },
    style: {
      marginTop: 4,
      width: "100%",
      padding: "16px 0",
      borderRadius: 125,
      border: 0,
      background: accent,
      color: "#fff",
      cursor: "pointer",
      fontFamily: MONO_HM,
      fontWeight: 700,
      fontSize: 14,
      letterSpacing: ".14em",
      boxShadow: `0 12px 28px ${accent}55`
    }
  }, "START HONEYMOON")) :
  /*#__PURE__*/
  /* ── running ── */
  React.createElement(React.Fragment, null, /*#__PURE__*/React.createElement("div", {
    style: {
      position: "relative",
      flex: "none",
      borderRadius: 20,
      border: `1px solid ${accent}59`,
      background: `linear-gradient(158deg, ${accent}2e 0%, #100c0e 52%, #08080a 100%)`,
      padding: "16px 16px 15px",
      overflow: "hidden",
      display: "flex",
      flexDirection: "column",
      alignItems: "center",
      gap: 10
    }
  }, /*#__PURE__*/React.createElement("span", {
    style: {
      position: "absolute",
      left: "50%",
      top: -110,
      width: 280,
      height: 240,
      marginLeft: -140,
      borderRadius: "50%",
      background: `radial-gradient(circle, ${accent}3d, transparent 66%)`,
      pointerEvents: "none"
    }
  }), /*#__PURE__*/React.createElement("span", {
    style: {
      position: "relative",
      fontFamily: SANS_HM,
      fontWeight: 700,
      fontSize: 11,
      letterSpacing: ".2em",
      color: accent
    }
  }, "SUCCESSFUL MISSIONS"), /*#__PURE__*/React.createElement("span", {
    style: {
      position: "relative",
      fontFamily: MONO_HM,
      fontWeight: 700,
      fontSize: 62,
      lineHeight: .92,
      color: "#fff",
      fontVariantNumeric: "tabular-nums",
      letterSpacing: "-.01em"
    }
  }, s.done, /*#__PURE__*/React.createElement("span", {
    style: {
      fontSize: 25,
      color: "#8A8A93"
    }
  }, "/30")), /*#__PURE__*/React.createElement("span", {
    style: {
      position: "relative",
      alignSelf: "stretch",
      marginTop: 2
    }
  }, /*#__PURE__*/React.createElement(HmGrid, {
    day: s.day,
    done: s.done,
    missed: s.missed,
    accent: accent
  })), /*#__PURE__*/React.createElement("span", {
    style: {
      position: "relative",
      alignSelf: "stretch",
      display: "flex",
      alignItems: "center",
      gap: 8,
      fontFamily: SANS_HM,
      fontWeight: 700,
      fontSize: 11,
      color: "#A9A9B2"
    }
  }, /*#__PURE__*/React.createElement("span", {
    style: {
      width: 9,
      height: 9,
      borderRadius: 3,
      background: "#5BD96A"
    }
  }), s.done + " cleared", /*#__PURE__*/React.createElement("span", {
    style: {
      width: 9,
      height: 9,
      borderRadius: 3,
      background: `${accent}33`,
      border: `1px solid ${accent}66`,
      marginLeft: 6
    }
  }), s.missed.length + " lost", /*#__PURE__*/React.createElement("span", {
    style: {
      flex: 1
    }
  }), 30 - s.day + " to come"), s.next ? /*#__PURE__*/React.createElement("span", {
    style: {
      position: "relative",
      alignSelf: "stretch",
      display: "flex",
      alignItems: "center",
      gap: 12,
      marginTop: 4,
      paddingTop: 12,
      borderTop: "1px solid rgba(255,255,255,.1)"
    }
  }, /*#__PURE__*/React.createElement("span", {
    "aria-hidden": "true",
    style: {
      flex: "none",
      width: 52,
      height: 52,
      backgroundImage: `url(${hmArt(s.next)})`,
      backgroundSize: "contain",
      backgroundPosition: "center",
      backgroundRepeat: "no-repeat"
    }
  }), /*#__PURE__*/React.createElement("span", {
    style: {
      flex: 1,
      minWidth: 0,
      display: "flex",
      flexDirection: "column",
      gap: 3
    }
  }, /*#__PURE__*/React.createElement("span", {
    style: {
      fontFamily: MONO_HM,
      fontWeight: 700,
      fontSize: 19,
      lineHeight: 1,
      color: "#fff",
      whiteSpace: "nowrap"
    }
  }, s.next.cash ? hmKzt(s.next.cash) : s.next.short), /*#__PURE__*/React.createElement("span", {
    style: {
      fontFamily: SANS_HM,
      fontWeight: 700,
      fontSize: 12,
      color: "#A9A9B2"
    }
  }, "NEXT PRIZE IN " + (s.next.n - s.done) + (s.next.n - s.done === 1 ? " MISSION" : " MISSIONS"))), /*#__PURE__*/React.createElement("span", {
    style: {
      flex: "none",
      display: "flex",
      flexDirection: "column",
      alignItems: "center",
      gap: 1,
      padding: "5px 11px",
      borderRadius: 12,
      background: `${accent}1f`,
      border: `1px solid ${accent}55`
    }
  }, /*#__PURE__*/React.createElement("span", {
    style: {
      fontFamily: SANS_HM,
      fontWeight: 700,
      fontSize: 10.5,
      letterSpacing: ".1em",
      color: accent
    }
  }, "MISSION #"), /*#__PURE__*/React.createElement("span", {
    style: {
      fontFamily: MONO_HM,
      fontWeight: 700,
      fontSize: 15,
      lineHeight: 1,
      color: "#fff",
      fontVariantNumeric: "tabular-nums"
    }
  }, s.next.n))) : null), /*#__PURE__*/React.createElement("div", {
    style: {
      position: "relative",
      flex: "none",
      borderRadius: 20,
      border: "1px solid rgba(255,255,255,.12)",
      background: "linear-gradient(180deg,#101014,#0a0a0c)",
      padding: "14px 15px 15px",
      overflow: "hidden",
      display: "flex",
      flexDirection: "column",
      gap: 10
    }
  }, /*#__PURE__*/React.createElement("img", {
    src: hmMissionArt(s.mission),
    alt: "",
    style: {
      position: "absolute",
      right: -16,
      bottom: -20,
      width: 118,
      height: 118,
      objectFit: "contain",
      mixBlendMode: "screen",
      opacity: .38,
      pointerEvents: "none"
    }
  }), /*#__PURE__*/React.createElement("span", {
    style: {
      position: "relative",
      display: "flex",
      alignItems: "center",
      gap: 8
    }
  }, /*#__PURE__*/React.createElement("span", {
    style: {
      fontFamily: SANS_HM,
      fontWeight: 700,
      fontSize: 11,
      letterSpacing: ".16em",
      color: s.todayDone ? "#5BD96A" : accent
    }
  }, s.todayDone ? "CLEARED TODAY" : "TODAY’S MISSION"), /*#__PURE__*/React.createElement("span", {
    style: {
      flex: 1
    }
  }), /*#__PURE__*/React.createElement(HmTimerChip, {
    accent: accent,
    done: s.todayDone
  })), /*#__PURE__*/React.createElement("span", {
    style: {
      position: "relative",
      fontFamily: MONO_HM,
      fontSize: 22,
      color: "#fff",
      lineHeight: 1.18,
      maxWidth: 236,
      textWrap: "pretty"
    }
  }, s.mission), /*#__PURE__*/React.createElement("span", {
    style: {
      position: "relative",
      fontFamily: SANS_HM,
      fontWeight: 600,
      fontSize: 11,
      lineHeight: 1.45,
      color: "#A9A9B2"
    }
  }, "24 hours to clear it. Miss it and this mission is lost for good \u2014 a different mission starts tomorrow.")), /*#__PURE__*/React.createElement(HmPanel, {
    title: "REWARD LADDER",
    chip: /*#__PURE__*/React.createElement(React.Fragment, null, /*#__PURE__*/React.createElement("span", null, "TOTAL"), " " + hmKzt(HM_TOTAL))
  }, /*#__PURE__*/React.createElement(HmLadderRail, {
    s: s,
    accent: accent,
    onClaim: window.hmClaim
  })), /*#__PURE__*/React.createElement(HmPanel, {
    title: "HOW IT WORKS",
    chip: HM_RULES.length + " RULES"
  }, /*#__PURE__*/React.createElement("div", {
    style: {
      display: "flex",
      flexDirection: "column",
      gap: 8
    }
  }, HM_RULES.map((r, i) => /*#__PURE__*/React.createElement("div", {
    key: i,
    style: {
      display: "flex",
      gap: 8,
      fontFamily: SANS_HM,
      fontWeight: 600,
      fontSize: 11,
      lineHeight: 1.45,
      color: "#D8D8DF"
    }
  }, /*#__PURE__*/React.createElement("span", {
    style: {
      flex: "none",
      width: 4,
      height: 4,
      borderRadius: "50%",
      background: accent,
      marginTop: 6
    }
  }), r)))))));
}
Object.assign(window, {
  HoneymoonWidget,
  HoneymoonScreen,
  HmDots,
  HmGrid
});