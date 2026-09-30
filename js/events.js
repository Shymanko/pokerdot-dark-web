// MTT — scheduled multi-table tournament lobby.
// Featured hero carousel (banners) + SINGLE-DAY STEPPER navigation with a
// month calendar that selects either one day OR a date range, and a
// chronological schedule list (grouped by day when a range is active).

const MONO_E = UI.font;
const SANS_E = UI.fontUI;
const EV_NOW = Date.now();
const DAY_MS = 86400000;
const TODAY0 = (() => {
  const d = new Date();
  d.setHours(0, 0, 0, 0);
  return d.getTime();
})();
const at = (off, h, m = 0) => TODAY0 + off * DAY_MS + h * 3600000 + m * 60000;
const soon = sec => EV_NOW + sec * 1000;
const WD = ["SUN", "MON", "TUE", "WED", "THU", "FRI", "SAT"];
const MO = ["JAN", "FEB", "MAR", "APR", "MAY", "JUN", "JUL", "AUG", "SEP", "OCT", "NOV", "DEC"];
const clock = ms => {
  const d = new Date(ms);
  return `${String(d.getHours()).padStart(2, "0")}:${String(d.getMinutes()).padStart(2, "0")}`;
};
const evOff = ms => {
  const d = new Date(ms);
  d.setHours(0, 0, 0, 0);
  return Math.round((d.getTime() - TODAY0) / DAY_MS);
};
function dayMeta(off) {
  const d = new Date(TODAY0 + off * DAY_MS);
  return {
    top: off === 0 ? "TODAY" : off === 1 ? "TOMORROW" : WD[d.getDay()],
    wd: WD[d.getDay()],
    sub: `${MO[d.getMonth()]} ${String(d.getDate()).padStart(2, "0")}`,
    date: d.getDate(),
    d
  };
}

// ── data: real weekly MTT grid (window.MTT_WEEK from mtt-data.js), projected over 14 days ──
const EVENTS = [];
(function () {
  const WEEK = window.MTT_WEEK || {};
  const WD_FULL = ["Sunday", "Monday", "Tuesday", "Wednesday", "Thursday", "Friday", "Saturday"];
  let _uid = 0;
  for (let off = -3; off < 14; off++) {
    const rows = WEEK[WD_FULL[new Date(TODAY0 + off * DAY_MS).getDay()]] || [];
    rows.forEach(t => {
      const start = at(off, t.h, t.m || 0);
      const lateMs = (t.late || 60) * 60000;
      const now = Date.now();
      const past = off < 0;
      if (off === 0 && now >= start + lateMs && now >= start + 3 * 3600000) return; // finished today
      const closed = past || off === 0 && now >= start + lateMs; // finished, or running with late reg over
      const reg = past ? Math.round(t.cap * (0.6 + (off + 4) % 3 * 0.12)) : off === 0 ? now >= start ? Math.round(t.cap * 0.55) : Math.round(t.cap * 0.3) : off === 1 ? Math.round(t.cap * 0.12) : 0;
      EVENTS.push({
        id: `m${_uid++}`,
        name: t.name.replace(/\s*-\s*[\d\s.,]+\s*GTD\s*$/i, ""),
        gtd: t.gtd,
        buyIn: t.buyIn,
        suit: "spade",
        cats: t.hr ? ["highroller"] : t.kind === "main" ? ["daily"] : ["satellite"],
        step: t.kind === "step",
        closed,
        finished: past,
        fmt: t.fmt,
        late: t.late,
        bfrac: t.bfrac,
        disc: t.disc,
        game: t.disc || "nlh",
        feeds: t.feeds,
        featured: !!t.big,
        start,
        reg,
        cap: t.cap
      });
    });
  }
})();
// showcase series event — Spring Millions (pink, sakura, series tag)
EVENTS.push({
  id: "spring",
  name: "SPRING MILLIONS",
  gtd: "$10 000 000 000",
  buyIn: "$5 500 000",
  suit: "heart",
  cats: ["highroller"],
  step: false,
  closed: false,
  fmt: ["PKO", "PLO5", "MULTIDAY"],
  late: 90,
  bfrac: 0.5,
  disc: "plo5",
  game: "plo",
  featured: true,
  start: Date.now() + 2 * 3600000,
  reg: 4200,
  cap: 20000,
  color: "#F5559F",
  glow: true,
  art: "assets/tourn-art/sakura.png",
  artAnim: "sakura",
  series: "assets/tourn-tags/spring-millions.png"
});
// Драбина відбору у Spring Millions. Показова подія була додана руками і
// лишалась без жодного сателіта — через це вкладка SATELLITES у неї завжди
// показувала порожній стан. Тут повна ланка: Step 1 → Step 2 → Satellite.
(function () {
  const H = 3600000;
  const rung = (id, name, tier, buyIn, gtd, cap, inMin) => EVENTS.push({
    id: "spring-" + id,
    name,
    gtd,
    buyIn,
    suit: "heart",
    cats: tier === "sat" ? ["satellite"] : ["satellite"],
    step: tier !== "sat",
    closed: false,
    fmt: tier === "sat" ? ["TURBO", "6-MAX"] : ["HYPER", "6-MAX"],
    late: 30,
    disc: "plo5",
    game: "plo",
    feeds: "SPRING MILLIONS",
    featured: false,
    start: Date.now() + inMin * 60000,
    reg: Math.round(cap * 0.45),
    cap
  });
  rung("s1a", "SPRING MILLIONS Step 1", "step1", "$250 000", "$5 500 000", 120, 35);
  rung("s1b", "SPRING MILLIONS Step 1 Turbo", "step1", "$250 000", "$5 500 000", 95, 65);
  rung("s2a", "SPRING MILLIONS Step 2", "step2", "$750 000", "$16 500 000", 70, 50);
  rung("s2b", "SPRING MILLIONS Step 2 Hyper", "step2", "$750 000", "$11 000 000", 48, 80);
  rung("sat1", "SPRING MILLIONS Satellite", "sat", "$1 500 000", "$55 000 000", 62, 45);
  rung("sat2", "SPRING MILLIONS Turbo Satellite", "sat", "$1 500 000", "$33 000 000", 41, 75);
  rung("sat3", "SPRING MILLIONS Last Chance Sat", "sat", "$1 500 000", "$22 000 000", 28, 105);
})();
// demo state tiles — always visible regardless of the clock: late reg running + reg closed
EVENTS.push({
  id: "demo-late",
  name: "Bounty Express",
  gtd: "$120 000 000",
  buyIn: "$2 000 000",
  suit: "club",
  cats: ["daily"],
  step: false,
  closed: false,
  fmt: ["PKO", "HYPER", "7-MAX"],
  late: 60,
  bfrac: 0.5,
  game: "nlh",
  featured: false,
  start: Date.now() - 10 * 60000,
  reg: 96,
  cap: 160
});
EVENTS.push({
  id: "demo-closed",
  name: "Deep Runner",
  gtd: "$90 000 000",
  buyIn: "$1 500 000",
  suit: "spade",
  cats: ["daily"],
  step: false,
  closed: true,
  fmt: ["HYPER", "7-MAX"],
  late: 20,
  game: "nlh",
  featured: false,
  start: Date.now() - 40 * 60000,
  reg: 84,
  cap: 140
});
// Registered showcase event several days away, alongside today's live and upcoming events.
EVENTS.push({
  id: "demo-days-away",
  name: "DEEPSTACK MASTERS",
  gtd: "$250 000",
  buyIn: "$215",
  suit: "spade",
  cats: ["daily"],
  step: false,
  closed: false,
  fmt: ["FREEZEOUT", "7-MAX"],
  late: 90,
  disc: "nlh",
  game: "nlh",
  featured: false,
  start: Date.now() + (2 * 24 + 4) * 3600000 + 30 * 60000,
  reg: 328,
  cap: 1500
});
const MAX_OFF = Math.max(...EVENTS.map(e => evOff(e.start)));
const MIN_OFF = -3; // history: finished events stay browsable for three days

const EV_CATS = [{
  id: "all",
  label: "ALL"
}, {
  id: "tournament",
  label: "TOURNAMENT"
}, {
  id: "satellite",
  label: "SATELLITE"
}, {
  id: "freeroll",
  label: "FREEROLL"
}];
// buy-in price buckets (second filter row)
const EV_PRICES = [{
  id: "all",
  label: "ALL",
  lo: 0,
  hi: Infinity
}, {
  id: "p1",
  label: "$0\u201310",
  lo: 0,
  hi: 10
}, {
  id: "p2",
  label: "$11\u201350",
  lo: 11,
  hi: 50
}, {
  id: "p3",
  label: "$51\u2013100",
  lo: 51,
  hi: 100
}, {
  id: "p4",
  label: "$100+",
  lo: 101,
  hi: Infinity
}];
const buyNum = e => e.buyIn === "FREE" ? 0 : parseFloat((e.buyIn || "").replace(/[^0-9.]/g, "")) || 0;
// buy-in slider bounds, derived from the schedule and rounded up to a tidy step
const PRICE_MAX = Math.max(1000000, Math.ceil(Math.max(...EVENTS.map(buyNum)) / 500000) * 500000);
const PRICE_CUR = "$";
const PRICE_STEP = 50000;
if (typeof document !== "undefined" && !document.getElementById("pp-rng-css")) {
  const st = document.createElement("style");
  st.id = "pp-rng-css";
  st.textContent = ".pp-rng{position:absolute;left:0;top:0;width:100%;height:32px;margin:0;background:transparent;-webkit-appearance:none;appearance:none;pointer-events:none}.pp-rng::-webkit-slider-thumb{-webkit-appearance:none;appearance:none;width:20px;height:20px;border-radius:50%;background:#fff;border:3px solid #0d0d10;box-shadow:0 2px 6px rgba(0,0,0,.5);cursor:grab;pointer-events:auto}.pp-rng::-moz-range-thumb{width:20px;height:20px;border-radius:50%;background:#fff;border:3px solid #0d0d10;box-shadow:0 2px 6px rgba(0,0,0,.5);cursor:grab;pointer-events:auto}.pp-rng:active::-webkit-slider-thumb{cursor:grabbing}";
  document.head.appendChild(st);
}
// dual-thumb buy-in range; value is {lo,hi}. Devs: persist this range across sessions.
function BuyInRange({
  value,
  onChange,
  accent
}) {
  const {
    lo,
    hi
  } = value;
  const pct = v => v / PRICE_MAX * 100;
  const fmt = v => v >= PRICE_MAX ? `${PRICE_CUR}${PRICE_MAX.toLocaleString("en-US").split(",").join(" ")}+` : `${PRICE_CUR}${v.toLocaleString("en-US").split(",").join(" ")}`;
  return /*#__PURE__*/React.createElement("div", {
    style: {
      padding: "12px 13px 14px"
    }
  }, /*#__PURE__*/React.createElement("div", {
    style: {
      display: "flex",
      alignItems: "center",
      marginBottom: 12
    }
  }, /*#__PURE__*/React.createElement("span", {
    style: {
      fontFamily: SANS_E,
      fontWeight: 700,
      fontSize: 10.5,
      letterSpacing: ".2em",
      color: "#A9A9B2"
    }
  }, "BUY-IN"), /*#__PURE__*/React.createElement("span", {
    style: {
      marginLeft: "auto",
      fontFamily: MONO_E,
      fontWeight: 700,
      fontSize: 12,
      color: "#fff",
      fontVariantNumeric: "tabular-nums"
    }
  }, lo <= 0 && hi >= PRICE_MAX ? "ANY" : `${lo <= 0 ? "FREE" : fmt(lo)} — ${fmt(hi)}`)), /*#__PURE__*/React.createElement("div", {
    style: {
      position: "relative",
      height: 32
    }
  }, /*#__PURE__*/React.createElement("div", {
    style: {
      position: "absolute",
      left: 0,
      right: 0,
      top: 14,
      height: 4,
      borderRadius: 3,
      background: "rgba(255,255,255,.16)"
    }
  }), /*#__PURE__*/React.createElement("div", {
    style: {
      position: "absolute",
      top: 14,
      height: 4,
      borderRadius: 3,
      left: `${pct(lo)}%`,
      right: `${100 - pct(hi)}%`,
      background: accent
    }
  }), /*#__PURE__*/React.createElement("input", {
    className: "pp-rng",
    type: "range",
    min: 0,
    max: PRICE_MAX,
    step: PRICE_STEP,
    value: lo,
    onChange: ev => {
      const v = Math.min(+ev.target.value, hi - PRICE_STEP);
      onChange({
        lo: Math.max(0, v),
        hi
      });
    },
    style: {
      zIndex: lo > PRICE_MAX - PRICE_STEP * 2 ? 5 : 4
    }
  }), /*#__PURE__*/React.createElement("input", {
    className: "pp-rng",
    type: "range",
    min: 0,
    max: PRICE_MAX,
    step: PRICE_STEP,
    value: hi,
    onChange: ev => {
      const v = Math.max(+ev.target.value, lo + PRICE_STEP);
      onChange({
        lo,
        hi: Math.min(PRICE_MAX, v)
      });
    },
    style: {
      zIndex: 6
    }
  })), /*#__PURE__*/React.createElement("div", {
    style: {
      display: "flex",
      justifyContent: "space-between",
      marginTop: 4,
      fontFamily: SANS_E,
      fontWeight: 700,
      fontSize: 10.5,
      letterSpacing: ".08em",
      color: "#A9A9B2"
    }
  }, /*#__PURE__*/React.createElement("span", null, "FREE"), /*#__PURE__*/React.createElement("span", null, PRICE_CUR, PRICE_MAX.toLocaleString("en-US").split(",").join(" "), "+")));
}

// game/discipline filter
const EV_GAMES = [{
  id: "all",
  label: "ALL"
}, {
  id: "nlh",
  label: "HOLD'EM"
}, {
  id: "plo",
  label: "PLO"
}, {
  id: "short",
  label: "SHORT DECK"
}];
// display / visibility toggles (screenshot parity)
const EV_TOGGLE_DEFS = [{
  id: "running",
  label: "Show Running"
}, {
  id: "completed",
  label: "Show Completed"
}, {
  id: "hideSat",
  label: "Hide Satellites"
}, {
  id: "hideStep",
  label: "Hide Step Satellites"
}, {
  id: "ticketValue",
  label: "Show Ticket Value"
}];
const EV_TOGGLE_DEFAULTS = {
  running: true,
  completed: true,
  hideSat: false,
  hideStep: false,
  ticketValue: false
};

// ── tournament TYPE system: every event is one of three types, colour-coded.
//   Tournament → Arcanium red · Satellite → kai-blue · Freeroll → green
const EV_TYPES = {
  tournament: {
    label: "TOURNAMENT",
    c: "#D71921",
    icon: "trophy"
  },
  satellite: {
    label: "SATELLITE",
    c: "#6FA8FF",
    icon: "seat"
  },
  step: {
    label: "STEP SATELLITE",
    c: "#7FD4F0",
    icon: "seat"
  },
  freeroll: {
    label: "FREEROLL",
    c: "#5BD96A",
    icon: "gift"
  }
};
const evType = e => e.cats.includes("freeroll") ? "freeroll" : e.cats.includes("satellite") ? e.step ? "step" : "satellite" : "tournament";
function EvTypeIcon({
  kind,
  size = 16,
  color = "#fff"
}) {
  const p = {
    width: size,
    height: size,
    viewBox: "0 0 24 24",
    fill: "none",
    stroke: color,
    strokeWidth: 1.9,
    strokeLinecap: "round",
    strokeLinejoin: "round"
  };
  if (kind === "trophy") return /*#__PURE__*/React.createElement("svg", p, /*#__PURE__*/React.createElement("path", {
    d: "M7 4h10v4a5 5 0 0 1-10 0z"
  }), /*#__PURE__*/React.createElement("path", {
    d: "M7 6H4v1a3 3 0 0 0 3 3M17 6h3v1a3 3 0 0 1-3 3"
  }), /*#__PURE__*/React.createElement("path", {
    d: "M10 14h4M9 20h6M12 14v6"
  }));
  if (kind === "seat") return /*#__PURE__*/React.createElement("svg", p, /*#__PURE__*/React.createElement("path", {
    d: "M3 8a2 2 0 0 1 2-2h14a2 2 0 0 1 2 2v2a2 2 0 0 0 0 4v2a2 2 0 0 1-2 2H5a2 2 0 0 1-2-2v-2a2 2 0 0 0 0-4z"
  }), /*#__PURE__*/React.createElement("path", {
    d: "M15 6v12",
    strokeDasharray: "2 2"
  }));
  if (kind === "gift") return /*#__PURE__*/React.createElement("svg", p, /*#__PURE__*/React.createElement("polyline", {
    points: "20 12 20 22 4 22 4 12"
  }), /*#__PURE__*/React.createElement("rect", {
    x: "2",
    y: "7",
    width: "20",
    height: "5"
  }), /*#__PURE__*/React.createElement("line", {
    x1: "12",
    y1: "22",
    x2: "12",
    y2: "7"
  }), /*#__PURE__*/React.createElement("path", {
    d: "M12 7H7.5a2.5 2.5 0 0 1 0-5C11 2 12 7 12 7z"
  }), /*#__PURE__*/React.createElement("path", {
    d: "M12 7h4.5a2.5 2.5 0 0 0 0-5C13 2 12 7 12 7z"
  }));
  return null;
}

// ── tournament TYPE icon — filled SVG (glove / target / ticket / gift / trophy),
//    resolved from cats + format. FILL, not stroke (design decision).
function tournArtKey(e) {
  const fmt = (e.fmt || []).join(" ");
  const nm = e.name || "";
  if (e.cats.includes("freeroll")) return "gift";
  if (e.cats.includes("satellite")) return e.step ? "step" : "ticket";
  if (/MYSTERY/.test(fmt) || /MYSTERY/.test(nm)) return "mystery";
  if (/PKO/.test(fmt)) return "pko";
  if (/\bKO\b|BOUNTY/.test(fmt) || /BOUNTY/.test(nm)) return "ko";
  return "trophy";
}
// discipline PNG art (user-supplied chrome renders) — shown as a PNG tag.
const DISC_SRC = {
  holdem: "assets/disciplines/holdem.png",
  plo5: "assets/disciplines/plo5.png",
  plo6: "assets/disciplines/plo6.png",
  flash: "assets/disciplines/flash-and-flush.png"
};
function EvFilledIcon({
  kind,
  size = 22,
  color = "#fff"
}) {
  const p = {
    width: size,
    height: size,
    viewBox: "0 0 24 24",
    fill: color
  };
  switch (kind) {
    case "step":
      return /*#__PURE__*/React.createElement("svg", p, /*#__PURE__*/React.createElement("path", {
        d: "M3 21v-5h5v-5h5V6h8v15H3z"
      }));
    case "ticket":
      return /*#__PURE__*/React.createElement("svg", p, /*#__PURE__*/React.createElement("path", {
        fillRule: "evenodd",
        clipRule: "evenodd",
        d: "M4.6 6.6h14.8a1.6 1.6 0 0 1 1.6 1.6v1.9a2 2 0 0 0 0 3.8v1.9a1.6 1.6 0 0 1-1.6 1.6H4.6a1.6 1.6 0 0 1-1.6-1.6v-1.9a2 2 0 0 0 0-3.8V8.2a1.6 1.6 0 0 1 1.6-1.6zm10.65 2.05a.55.55 0 0 0-.55.55v1.15a.55.55 0 0 0 1.1 0V9.2a.55.55 0 0 0-.55-.55zm0 3.25a.55.55 0 0 0-.55.55v1.15a.55.55 0 0 0 1.1 0v-1.15a.55.55 0 0 0-.55-.55zm0 3.25a.55.55 0 0 0-.55.55v1.15a.55.55 0 0 0 1.1 0V15.7a.55.55 0 0 0-.55-.55z"
      }));
    case "gift":
      return /*#__PURE__*/React.createElement("svg", p, /*#__PURE__*/React.createElement("rect", {
        x: "3.6",
        y: "8.4",
        width: "16.8",
        height: "3.4",
        rx: "1"
      }), /*#__PURE__*/React.createElement("rect", {
        x: "5",
        y: "11.8",
        width: "14",
        height: "8.2",
        rx: "1.4"
      }), /*#__PURE__*/React.createElement("rect", {
        x: "10.7",
        y: "8.4",
        width: "2.6",
        height: "11.6"
      }), /*#__PURE__*/React.createElement("path", {
        d: "M12 8.2C10.6 4.6 5.4 4.8 6.4 7.4 6.9 8.7 9.6 8.6 12 8.2zM12 8.2c1.4-3.6 6.6-3.4 5.6-.8-.5 1.3-3.2 1.2-5.6.8z"
      }));
    case "ko":
      return /*#__PURE__*/React.createElement("svg", p, /*#__PURE__*/React.createElement("path", {
        d: "M8 3.4h4.4A5.6 5.6 0 0 1 18 9v2.4a3.6 3.6 0 0 1-3.6 3.6H8a1 1 0 0 1-1-1V4.4a1 1 0 0 1 1-1z"
      }), /*#__PURE__*/React.createElement("path", {
        d: "M6 6.4H4.8A1.8 1.8 0 0 0 3 8.2v1.2a3 3 0 0 0 3 3h.9z"
      }), /*#__PURE__*/React.createElement("rect", {
        x: "7",
        y: "15.4",
        width: "9",
        height: "2.2",
        rx: "1"
      }), /*#__PURE__*/React.createElement("rect", {
        x: "7.4",
        y: "17.8",
        width: "8.2",
        height: "2.2",
        rx: "1"
      }));
    case "pko":
      return /*#__PURE__*/React.createElement("svg", p, /*#__PURE__*/React.createElement("path", {
        d: "M7 4h4A5 5 0 0 1 16 9v2.2a3.3 3.3 0 0 1-3.3 3.3H7a1 1 0 0 1-1-1V5a1 1 0 0 1 1-1z"
      }), /*#__PURE__*/React.createElement("path", {
        d: "M5.3 6.7H4.3A1.6 1.6 0 0 0 2.7 8.3v1a2.7 2.7 0 0 0 2.7 2.7h.6z"
      }), /*#__PURE__*/React.createElement("rect", {
        x: "6.2",
        y: "14.8",
        width: "8",
        height: "2",
        rx: ".9"
      }), /*#__PURE__*/React.createElement("rect", {
        x: "6.6",
        y: "17",
        width: "7.2",
        height: "2",
        rx: ".9"
      }), /*#__PURE__*/React.createElement("path", {
        d: "M17.4 3.1l3 2.6 3-2.6v2.2l-3 2.6-3-2.6zM17.4 7.1l3 2.6 3-2.6v2.2l-3 2.6-3-2.6z"
      }));
    case "mystery":
      return /*#__PURE__*/React.createElement("svg", p, /*#__PURE__*/React.createElement("path", {
        fillRule: "evenodd",
        clipRule: "evenodd",
        d: "M12 2.5a9.5 9.5 0 1 0 0 19 9.5 9.5 0 0 0 0-19zm0 3.4a6.1 6.1 0 1 1 0 12.2 6.1 6.1 0 0 1 0-12.2z"
      }), /*#__PURE__*/React.createElement("text", {
        x: "12",
        y: "16.1",
        textAnchor: "middle",
        fontSize: "9.5",
        fontWeight: "700",
        fontFamily: UI.fontUI,
        fill: color
      }, "?"));
    default:
      return /*#__PURE__*/React.createElement("svg", p, /*#__PURE__*/React.createElement("path", {
        d: "M6.5 4h11v4.6a5.5 5.5 0 0 1-4.2 5.35V16.4H15a1 1 0 0 1 1 1V20H8v-2.6a1 1 0 0 1 1-1h1.7v-2.05A5.5 5.5 0 0 1 6.5 8.6V4z"
      }), /*#__PURE__*/React.createElement("path", {
        d: "M6.5 5.4H4.4v1.1a2.6 2.6 0 0 0 2.1 2.55zM17.5 5.4h2.1v1.1a2.6 2.6 0 0 1-2.1 2.55z"
      }));
  }
}
if (typeof document !== "undefined" && !document.getElementById("pp-sakura-kf")) {
  const st = document.createElement("style");
  st.id = "pp-sakura-kf";
  st.textContent = "@keyframes pp-fall{0%{transform:translateY(0) translateX(0) rotate(0deg);opacity:0}14%{opacity:.92}86%{opacity:.92}100%{transform:translateY(92px) translateX(13px) rotate(320deg);opacity:0}} @keyframes pp-glow-step{0%,100%{box-shadow:0 0 4px rgba(127,212,240,.2)}50%{box-shadow:0 0 26px rgba(127,212,240,.8),0 0 8px rgba(127,212,240,.55)}} @keyframes pp-glow-tile{0%,100%{box-shadow:0 0 5px var(--gA)}50%{box-shadow:0 0 28px var(--gB),0 0 9px var(--gC)}}";
  document.head.appendChild(st);
}
// tournament TYPE icon art — swappable PNG per type. Drop Higgsfield renders at
// these paths (or override window.PD_TOURN_ICONS). Filled SVG is the fallback.
window.PD_TOURN_ICONS = window.PD_TOURN_ICONS || {
  trophy: "assets/tourn-icons/trophy.png",
  ticket: "assets/tourn-icons/ticket.png",
  step: "assets/tourn-icons/step.png",
  gift: "assets/tourn-icons/freeroll.png",
  ko: "assets/tourn-icons/ko.png",
  pko: "assets/tourn-icons/pko.png",
  mystery: "assets/tourn-icons/mystery.png"
};
function TypeArt({
  e,
  size = 22,
  color = "#fff"
}) {
  const key = tournArtKey(e);
  const src = (window.PD_TOURN_ICONS || {})[key];
  const [err, setErr] = React.useState(false);
  if (!src || err) return /*#__PURE__*/React.createElement(EvFilledIcon, {
    kind: key,
    size: size,
    color: color
  });
  return /*#__PURE__*/React.createElement("img", {
    src: src,
    alt: key,
    width: size,
    height: size,
    onError: () => setErr(true),
    style: {
      width: size,
      height: size,
      objectFit: "contain",
      display: "block"
    }
  });
}
// animated alpha sakura — CSS-instanced petals, seamless loop, transparent
function SakuraFall() {
  const P = [[6, 3.6, 0], [22, 4.4, -1.2], [38, 3.9, -0.5], [54, 4.8, -1.8], [70, 3.4, -0.9], [84, 4.2, -2.3], [30, 5.0, -3.0], [62, 3.7, -1.5]];
  return /*#__PURE__*/React.createElement(React.Fragment, null, P.map((pp, i) => /*#__PURE__*/React.createElement("img", {
    key: i,
    src: "assets/tourn-art/petal.png",
    alt: "",
    style: {
      position: "absolute",
      left: `${pp[0]}%`,
      top: "-16px",
      width: 12,
      height: 12,
      animation: `pp-fall ${pp[1]}s linear ${pp[2]}s infinite`,
      willChange: "transform"
    }
  })));
}

// ── tag SLOTS: STATE (reg status) is its own slot, off the type palette;
//    FORMAT chips (PKO, DEEPSTACK, …) are their own slot.
const EV_STATES = {
  live: {
    label: "LIVE",
    dot: "#D71921",
    text: "#fff",
    pulse: true
  },
  late: {
    label: "LATE REG",
    dot: "#f0c75e",
    text: "#f0c75e"
  },
  soon: {
    label: "STARTING SOON",
    dot: "#f0c75e",
    text: "#f0c75e"
  },
  open: {
    label: "REG OPEN",
    dot: "rgba(255,255,255,.55)",
    text: "rgba(255,255,255,.7)"
  }
};
const evState = secs => secs <= 0 ? "live" : secs < 45 * 60 ? "soon" : "open";
const prizeLabel = e => evType(e) === "satellite" || evType(e) === "step" ? "TICKETS" : "GTD";
// satellite prize is N seats × seat price. The TARGET tournament's buy-in is the
// source of truth; the pool is snapped to n × that price so every printed number agrees.
const numOf = s => Number(String(s).replace(/[^\d.]/g, "")) || 0;
const normName = s => String(s).toUpperCase().replace(/[^A-Z0-9 ]/g, " ").replace(/\s+/g, " ").trim();
const curSym = s => (String(s).match(/^\D+/) || ["$"])[0];
function seatPrice(e) {
  if (!(evType(e) === "satellite" || evType(e) === "step")) return null;
  const tot = numOf(e.gtd),
    bi = numOf(e.buyIn);
  if (!tot) return null;
  let each = 0;
  if (e.feeds) {
    const f = normName(e.feeds);
    const cand = EVENTS.filter(x => x.id !== e.id && evType(x) === "tournament" && numOf(x.buyIn) >= Math.max(bi, 1));
    const exact = cand.find(x => normName(x.name) === f);
    const pref = cand.filter(x => {
      const n = normName(x.name);
      return n.startsWith(f) || f.startsWith(n);
    }).sort((a, b) => normName(b.name).length - normName(a.name).length)[0];
    const tgt = exact || pref;
    if (tgt) each = numOf(tgt.buyIn);
  }
  if (!each && bi) each = [500000, 750000, 1000000, 1500000, 2000000, 3000000, 5500000].find(v => v >= bi * 4) || bi * 4;
  if (!each) return null;
  const n = Math.max(1, Math.round(tot / each));
  return {
    n,
    each
  };
}
// snap each satellite's pool to a whole number of target seats (one-time, at load)
EVENTS.forEach(e => {
  const s = seatPrice(e);
  if (s) e.gtd = curSym(e.gtd) + (s.n * s.each).toLocaleString("en-US").split(",").join(" ");
});
// Усі сателіти, що ведуть у турнір із такою назвою. Потрібно вкладці
// SATELLITES: раніше вона малювала три вигадані сходинки, тепер бере
// справжні події. Дублікати (той самий сателіт у різні дні) згортаємо
// в один рядок — лишаємо найближчий за часом.
function satellitesFor(name) {
  const f = normName(name);
  const hit = EVENTS.filter(e => {
    if (!(evType(e) === "satellite" || evType(e) === "step")) return false;
    if (!e.feeds) return false;
    const g = normName(e.feeds);
    return g === f || f.startsWith(g) || g.startsWith(f);
  });
  const byName = {};
  hit.forEach(e => {
    const k = normName(e.name);
    if (!byName[k] || e.start < byName[k].start) byName[k] = e;
  });
  return Object.keys(byName).map(k => byName[k]).sort((a, b) => numOf(a.buyIn) - numOf(b.buyIn));
}
// Рівень події в ієрархії кваліфікації.
// Дані знають лише Step1 (52 події), Step2 у них поки немає — гілка
// нижче все одно є, щоб при появі Step2 нічого не переписувати.
function evTier(e) {
  const n = String(e.name || "");
  if (/step\s*2/i.test(n)) return "step2";
  if (e.step || /step\s*1/i.test(n)) return "step1";
  if ((e.cats || []).indexOf("satellite") >= 0) return "satellite";
  return "tournament";
}

// Що показувати у вкладці SATELLITES — завжди рівень НИЖЧЕ поточного:
//   турнір  → сателіти, що ведуть у нього
//   сателіт → Step 2, а якщо їх немає — Step 1
//   Step 2  → Step 1, що ведуть у нього
//   Step 1  → нічого, це вже низ драбини
function ladderFor(ev) {
  if (!ev) return [];
  const tier = evTier(ev);
  if (tier === "step1") return [];
  // ціль, у яку веде сам ev; для турніру ціль — його власна назва
  const target = normName(tier === "tournament" ? ev.name : ev.feeds || ev.name);
  const feedsTarget = e => {
    const f = normName(e.feeds || "");
    return !!f && (f === target || target.startsWith(f) || f.startsWith(target));
  };
  const uniq = list => {
    const by = {};
    list.forEach(e => {
      const k = normName(e.name);
      if (!by[k] || e.start < by[k].start) by[k] = e;
    });
    return Object.keys(by).map(k => by[k]).sort((a, b) => numOf(a.buyIn) - numOf(b.buyIn));
  };
  const of = lvl => uniq(EVENTS.filter(e => e.id !== ev.id && evTier(e) === lvl && feedsTarget(e)));
  if (tier === "tournament") return of("satellite");
  if (tier === "satellite") {
    const s2 = of("step2");
    return s2.length ? s2 : of("step1");
  }
  return of("step1"); // step2
}
function satSeats(e) {
  const s = seatPrice(e);
  if (!s) return null;
  return {
    n: s.n,
    each: curSym(e.gtd) + s.each.toLocaleString("en-US").split(",").join(" "),
    total: curSym(e.gtd) + (s.n * s.each).toLocaleString("en-US").split(",").join(" ")
  };
}
function TicketGlyph({
  size = 10,
  color = "#fff"
}) {
  return /*#__PURE__*/React.createElement("svg", {
    width: size,
    height: Math.round(size * 0.7),
    viewBox: "0 0 20 14",
    style: {
      flex: "none",
      display: "block"
    }
  }, /*#__PURE__*/React.createElement("path", {
    d: "M1 1h18v3.2a2.4 2.4 0 0 0 0 4.8V13H1V9a2.4 2.4 0 0 0 0-4.8V1z",
    fill: color
  }));
}
void TicketGlyph; // kept as an SVG fallback if the PNG slot is ever removed
function SeatBreak({
  s,
  color,
  fs = 9.5
}) {
  const ih = Math.max(9, Math.round(fs));
  return /*#__PURE__*/React.createElement("span", {
    style: {
      display: "inline-flex",
      alignItems: "center",
      gap: 5,
      whiteSpace: "nowrap"
    }
  }, /*#__PURE__*/React.createElement("span", {
    style: {
      display: "inline-flex",
      alignItems: "center",
      gap: 3,
      padding: "2px 6px",
      borderRadius: 6,
      background: "rgba(255,255,255,.08)",
      border: "1px solid rgba(255,255,255,.16)"
    }
  }, /*#__PURE__*/React.createElement("span", {
    style: {
      fontFamily: MONO_E,
      fontWeight: 700,
      fontSize: Math.max(9, fs - 4),
      color: "#fff",
      lineHeight: 1
    }
  }, s.n), /*#__PURE__*/React.createElement("svg", {
    width: Math.round(ih * 1.29),
    height: ih,
    viewBox: "0 0 31 24",
    style: {
      flex: "none",
      display: "block"
    },
    "aria-hidden": "true"
  }, /*#__PURE__*/React.createElement("path", {
    d: "M3 3h25a2 2 0 0 1 2 2v4.3a2.7 2.7 0 0 0 0 5.4V19a2 2 0 0 1-2 2H3a2 2 0 0 1-2-2v-4.3a2.7 2.7 0 0 0 0-5.4V5a2 2 0 0 1 2-2z",
    fill: "#fff"
  }))), /*#__PURE__*/React.createElement("span", {
    style: {
      fontFamily: MONO_E,
      fontWeight: 700,
      fontSize: fs,
      color
    }
  }, s.total));
}
function EvStatePill({
  s
}) {
  const S = EV_STATES[s];
  return /*#__PURE__*/React.createElement("span", {
    style: {
      display: "inline-flex",
      alignItems: "center",
      gap: 5,
      padding: "3px 9px",
      borderRadius: 125,
      background: "rgba(255,255,255,.075)",
      border: "1px solid rgba(255,255,255,.13)",
      fontFamily: SANS_E,
      fontWeight: 700,
      fontSize: 10.5,
      letterSpacing: ".12em",
      color: S.text,
      whiteSpace: "nowrap"
    }
  }, /*#__PURE__*/React.createElement("span", {
    style: {
      width: 5,
      height: 5,
      borderRadius: "50%",
      background: S.dot,
      boxShadow: S.pulse ? `0 0 6px ${S.dot}` : "none",
      animation: S.pulse ? "pp-pulse 1.4s ease-in-out infinite" : "none"
    }
  }), S.label);
}
function EvFmtChip({
  label
}) {
  return /*#__PURE__*/React.createElement("span", {
    style: {
      fontFamily: SANS_E,
      fontWeight: 700,
      fontSize: 10.5,
      color: "#D8D8DF",
      letterSpacing: ".1em",
      padding: "3px 7px",
      borderRadius: 5,
      background: "rgba(255,255,255,.085)",
      border: "1px solid rgba(255,255,255,.18)",
      whiteSpace: "nowrap"
    }
  }, label);
}
function useCD(targetMs) {
  const calc = () => Math.max(0, Math.floor((targetMs - Date.now()) / 1000));
  const [s, setS] = React.useState(calc);
  React.useEffect(() => {
    const t = setInterval(() => setS(calc()), 1000);
    return () => clearInterval(t);
  }, [targetMs]);
  const h = Math.floor(s / 3600),
    m = Math.floor(s % 3600 / 60),
    sec = s % 60,
    p = n => String(n).padStart(2, "0");
  return `${p(h)}:${p(m)}:${p(sec)}`;
}
function useRel(targetMs) {
  const calc = () => Math.max(0, Math.floor((targetMs - Date.now()) / 1000));
  const [s, setS] = React.useState(calc);
  React.useEffect(() => {
    const t = setInterval(() => setS(calc()), 1000);
    return () => clearInterval(t);
  }, [targetMs]);
  const p = n => String(n).padStart(2, "0");
  const d = Math.floor(s / 86400),
    h = Math.floor(s % 86400 / 3600),
    m = Math.floor(s % 3600 / 60),
    sec = s % 60;
  if (s < 3600) return {
    txt: `${p(m)}:${p(sec)}`,
    live: true
  };
  if (d > 0) return {
    txt: `IN ${d}D ${h}H`,
    live: false
  };
  return {
    txt: `IN ${h}H ${p(m)}M`,
    live: false
  };
}

// ── calendar: single day OR date range ──
function EvCalendar({
  sel,
  accent,
  onApply,
  onClose
}) {
  const init = new Date(TODAY0 + sel.from * DAY_MS);
  const [view, setView] = React.useState({
    y: init.getFullYear(),
    m: init.getMonth()
  });
  const [from, setFrom] = React.useState(sel.from);
  const [to, setTo] = React.useState(sel.to);
  const [pending, setPending] = React.useState(false); // armed after first tap

  const first = new Date(view.y, view.m, 1);
  const startPad = first.getDay();
  const daysIn = new Date(view.y, view.m + 1, 0).getDate();
  const cells = [];
  for (let i = 0; i < startPad; i++) cells.push(null);
  for (let dnum = 1; dnum <= daysIn; dnum++) cells.push(dnum);
  const eventSet = new Set(EVENTS.map(e => evOff(e.start)));
  const cellOff = dnum => {
    const d = new Date(view.y, view.m, dnum);
    d.setHours(0, 0, 0, 0);
    return Math.round((d.getTime() - TODAY0) / DAY_MS);
  };
  const shift = n => setView(v => {
    const d = new Date(v.y, v.m + n, 1);
    return {
      y: d.getFullYear(),
      m: d.getMonth()
    };
  });
  const lo = Math.min(from, to),
    hi = Math.max(from, to);
  const tap = off => {
    if (window.playClick) window.playClick(1200, 0.03);
    if (!pending) {
      setFrom(off);
      setTo(off);
      setPending(true);
      return;
    } // first tap: arm start
    const a = Math.min(from, off),
      b = Math.max(from, off); // second tap: same day = 1 day, else range
    onApply({
      from: a,
      to: b
    });
    onClose();
  };
  const quick = (a, b) => {
    onApply({
      from: a,
      to: b
    });
    onClose();
  };
  return /*#__PURE__*/React.createElement("div", {
    onClick: onClose,
    style: {
      position: "absolute",
      inset: 0,
      zIndex: 60,
      background: "rgba(0,0,0,.5)",
      backdropFilter: "blur(14px) saturate(.9)",
      WebkitBackdropFilter: "blur(14px) saturate(.9)",
      display: "flex",
      alignItems: "center",
      justifyContent: "center",
      padding: 20
    }
  }, /*#__PURE__*/React.createElement("div", {
    onClick: e => e.stopPropagation(),
    style: {
      width: "100%",
      maxWidth: 320,
      background: "#101014",
      border: "1px solid rgba(255,255,255,.16)",
      borderRadius: 20,
      padding: 16,
      boxShadow: "0 22px 50px rgba(0,0,0,.66)"
    }
  }, /*#__PURE__*/React.createElement("div", {
    style: {
      display: "flex",
      alignItems: "center",
      justifyContent: "space-between",
      marginBottom: 10
    }
  }, /*#__PURE__*/React.createElement("button", {
    onClick: () => shift(-1),
    style: ev_navBtn
  }, "\u2039"), /*#__PURE__*/React.createElement("span", {
    style: {
      fontFamily: MONO_E,
      fontSize: 14,
      color: "#fff",
      letterSpacing: ".06em"
    }
  }, MO[view.m], " ", view.y), /*#__PURE__*/React.createElement("button", {
    onClick: () => shift(1),
    style: ev_navBtn
  }, "\u203A")), /*#__PURE__*/React.createElement("div", {
    style: {
      display: "grid",
      gridTemplateColumns: "repeat(7,1fr)",
      gap: 2,
      marginBottom: 6
    }
  }, ["S", "M", "T", "W", "T", "F", "S"].map((w, i) => /*#__PURE__*/React.createElement("div", {
    key: i,
    style: {
      textAlign: "center",
      fontFamily: SANS_E,
      fontWeight: 700,
      fontSize: 10.5,
      color: "#A9A9B2",
      letterSpacing: ".06em"
    }
  }, w))), /*#__PURE__*/React.createElement("div", {
    style: {
      display: "grid",
      gridTemplateColumns: "repeat(7,1fr)",
      gap: 2
    }
  }, cells.map((dnum, i) => {
    if (dnum === null) return /*#__PURE__*/React.createElement("div", {
      key: i
    });
    const off = cellOff(dnum);
    const has = eventSet.has(off);
    const past = off < MIN_OFF; // last three days stay tappable (history)
    let cellSel = false,
      mid = false;
    if (pending) {
      cellSel = off === from;
    } else if (from === to) {
      cellSel = off === from;
    } else if (off === lo || off === hi) {
      cellSel = true;
    } else if (off > lo && off < hi) {
      mid = true;
    }
    return /*#__PURE__*/React.createElement("button", {
      key: i,
      disabled: past,
      onClick: () => tap(off),
      style: {
        position: "relative",
        aspectRatio: "1",
        borderRadius: 8,
        border: "none",
        cursor: past ? "default" : "pointer",
        background: cellSel ? "#fff" : mid ? `${accent}30` : "transparent",
        color: cellSel ? "#000" : past ? "rgba(255,255,255,.2)" : "#fff",
        fontFamily: MONO_E,
        fontSize: 12,
        fontVariantNumeric: "tabular-nums",
        transition: "background 120ms",
        display: "flex",
        alignItems: "center",
        justifyContent: "center"
      }
    }, dnum, has && !cellSel && !mid && /*#__PURE__*/React.createElement("span", {
      style: {
        position: "absolute",
        bottom: 4,
        left: "50%",
        transform: "translateX(-50%)",
        width: 4,
        height: 4,
        borderRadius: "50%",
        background: accent
      }
    }));
  })), /*#__PURE__*/React.createElement("div", {
    style: {
      display: "flex",
      gap: 7,
      marginTop: 14
    }
  }, [["LAST 3 DAYS", () => quick(-3, 0)], ["TODAY", () => quick(0, 0)], ["NEXT 7 DAYS", () => quick(0, 6)]].map(([lbl, fn]) => /*#__PURE__*/React.createElement("button", {
    key: lbl,
    onClick: fn,
    style: {
      flex: 1,
      padding: "8px 0",
      borderRadius: 12,
      cursor: "pointer",
      background: "rgba(255,255,255,.075)",
      border: "1px solid rgba(255,255,255,.16)",
      color: "#D8D8DF",
      fontFamily: SANS_E,
      fontWeight: 700,
      fontSize: 10.5,
      letterSpacing: ".06em"
    }
  }, lbl))), /*#__PURE__*/React.createElement("div", {
    style: {
      marginTop: 12,
      textAlign: "center",
      fontFamily: SANS_E,
      fontWeight: 600,
      fontSize: 10.5,
      color: "#A9A9B2",
      letterSpacing: ".1em"
    }
  }, !pending ? "TAP A DAY" : "TAP SAME DAY = ONE DAY · OR PICK END DAY")));
}
const ev_navBtn = {
  width: 30,
  height: 30,
  borderRadius: 12,
  border: "1px solid rgba(255,255,255,.18)",
  background: "rgba(255,255,255,.075)",
  color: "#fff",
  fontSize: 18,
  cursor: "pointer",
  display: "flex",
  alignItems: "center",
  justifyContent: "center",
  fontFamily: MONO_E
};

// ── Filter sheet — one place to set TYPE + BUY-IN, replacing the two pill rows.
// Edits apply live; the footer button just dismisses and shows the count.
function EvFilterSheet({
  open,
  onClose,
  accent,
  cat,
  setCat,
  price,
  setPrice,
  game,
  setGame,
  toggles,
  setToggle,
  count,
  sel,
  setSel,
  onCalendar
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
  const click = f => {
    if (window.playClick) window.playClick(f, 0.03);
  };
  const reset = () => {
    click(900);
    setCat("all");
    setPrice({
      lo: 0,
      hi: PRICE_MAX
    });
    setGame("all");
    setSel && setSel({
      from: 0,
      to: 0
    });
    EV_TOGGLE_DEFS.forEach(t => setToggle(t.id, EV_TOGGLE_DEFAULTS[t.id]));
  };
  const pill = on => ({
    padding: "8px 13px",
    borderRadius: 125,
    cursor: "pointer",
    background: on ? accent : "rgba(255,255,255,.075)",
    color: on ? "#fff" : "rgba(255,255,255,.72)",
    border: `1px solid ${on ? accent : "rgba(255,255,255,.16)"}`,
    fontFamily: SANS_E,
    fontWeight: 700,
    fontSize: 10.5,
    letterSpacing: ".05em",
    whiteSpace: "nowrap",
    transition: "all 140ms"
  });
  const secLbl = {
    fontFamily: SANS_E,
    fontWeight: 700,
    fontSize: 10.5,
    letterSpacing: ".2em",
    color: "#A9A9B2"
  };
  const card = {
    position: "relative",
    borderRadius: 14,
    background: "linear-gradient(150deg,#1a1216 0%,#141419 44%,#111114 100%)",
    border: `1px solid ${accent}2b`
  };
  const dirty = cat !== "all" || price.lo > 0 || price.hi < PRICE_MAX || game !== "all" || sel && (sel.from !== 0 || sel.to !== 0) || EV_TOGGLE_DEFS.some(t => toggles[t.id] !== EV_TOGGLE_DEFAULTS[t.id]);
  const dFrom = sel ? dayMeta(sel.from) : null,
    dTo = sel ? dayMeta(sel.to) : null;
  const dRange = sel && sel.from !== sel.to;
  const dayBtn = (label, dis, onTap) => /*#__PURE__*/React.createElement("button", {
    onClick: () => {
      if (dis) return;
      click(1100);
      onTap();
    },
    style: {
      flex: "none",
      width: 34,
      height: 34,
      borderRadius: 12,
      cursor: dis ? "default" : "pointer",
      background: "rgba(255,255,255,.075)",
      border: "1px solid rgba(255,255,255,.16)",
      opacity: dis ? .3 : 1,
      color: "#fff",
      fontFamily: MONO_E,
      fontSize: 17,
      display: "flex",
      alignItems: "center",
      justifyContent: "center"
    }
  }, label);
  // a labeled pill group inside the "refine" card, divided by a hairline
  const PillGroup = ({
    label,
    items,
    val,
    on,
    set,
    row = false
  }) => /*#__PURE__*/React.createElement("div", {
    style: {
      padding: "10px 13px"
    }
  }, /*#__PURE__*/React.createElement("div", {
    style: {
      ...secLbl,
      marginBottom: 8
    }
  }, label), /*#__PURE__*/React.createElement("div", {
    style: {
      display: "flex",
      flexWrap: row ? "nowrap" : "wrap",
      gap: row ? 5 : 7
    }
  }, items.map(it => /*#__PURE__*/React.createElement("button", {
    key: it.id,
    onClick: () => {
      click(1100);
      set(it.id);
    },
    style: row ? {
      ...pill(it.id === val),
      flex: "none",
      padding: "8px 10px",
      fontSize: 10.5,
      letterSpacing: ".06em",
      whiteSpace: "nowrap"
    } : pill(it.id === val)
  }, it.label))));
  return /*#__PURE__*/React.createElement("div", {
    onClick: onClose,
    style: {
      position: "absolute",
      inset: 0,
      zIndex: 60,
      background: "rgba(0,0,0,.82)",
      display: "flex",
      flexDirection: "column",
      justifyContent: "flex-end",
      opacity: mounted ? 1 : 0,
      transition: "opacity 200ms"
    }
  }, /*#__PURE__*/React.createElement("div", {
    onClick: e => e.stopPropagation(),
    style: {
      position: "relative",
      overflow: "hidden",
      background: `linear-gradient(168deg, #241014 0%, #0c0c0f 46%, #0a0a0c 100%)`,
      borderTopLeftRadius: 22,
      borderTopRightRadius: 22,
      border: `1px solid ${accent}3d`,
      borderBottom: 0,
      padding: "12px 16px 26px",
      maxHeight: "94%",
      overflowY: "auto",
      WebkitOverflowScrolling: "touch",
      transform: mounted ? "translateY(0)" : "translateY(100%)",
      transition: "transform 340ms cubic-bezier(0.2,0.8,0.2,1)",
      boxShadow: "0 -18px 46px rgba(0,0,0,.6)"
    }
  }, /*#__PURE__*/React.createElement("span", {
    style: {
      position: "absolute",
      inset: 0,
      pointerEvents: "none",
      background: `radial-gradient(ellipse 70% 60% at 100% 0%, ${accent}26, transparent 60%)`
    }
  }), /*#__PURE__*/React.createElement("span", {
    style: {
      position: "absolute",
      inset: 0,
      pointerEvents: "none",
      backgroundImage: "radial-gradient(circle, rgba(255,255,255,.055) .8px, transparent 1.2px)",
      backgroundSize: "13px 13px",
      maskImage: "linear-gradient(168deg, black, transparent 62%)",
      WebkitMaskImage: "linear-gradient(168deg, black, transparent 62%)"
    }
  }), /*#__PURE__*/React.createElement("div", {
    style: {
      position: "relative",
      width: 38,
      height: 4,
      borderRadius: 2,
      background: "rgba(255,255,255,.2)",
      margin: "0 auto 12px"
    }
  }), /*#__PURE__*/React.createElement("div", {
    style: {
      position: "relative",
      display: "flex",
      alignItems: "center",
      gap: 10,
      marginBottom: 14
    }
  }, /*#__PURE__*/React.createElement("span", {
    style: {
      fontFamily: MONO_E,
      fontSize: 16,
      color: "#fff",
      letterSpacing: ".14em"
    }
  }, "FILTERS"), /*#__PURE__*/React.createElement("button", {
    onClick: reset,
    disabled: !dirty,
    style: {
      marginLeft: "auto",
      display: "inline-flex",
      alignItems: "center",
      gap: 7,
      padding: "9px 13px",
      borderRadius: 125,
      cursor: dirty ? "pointer" : "default",
      background: "rgba(255,255,255,.075)",
      border: "1px solid rgba(255,255,255,.18)",
      opacity: dirty ? 1 : 0.4,
      transition: "opacity 140ms"
    }
  }, /*#__PURE__*/React.createElement("svg", {
    width: "12",
    height: "12",
    viewBox: "0 0 24 24",
    fill: "none",
    stroke: "#fff",
    strokeWidth: "2.2",
    strokeLinecap: "round",
    strokeLinejoin: "round"
  }, /*#__PURE__*/React.createElement("path", {
    d: "M3 2v6h6"
  }), /*#__PURE__*/React.createElement("path", {
    d: "M3.5 8a9 9 0 1 0 2.3-3.7L3 8"
  })), /*#__PURE__*/React.createElement("span", {
    style: {
      fontFamily: SANS_E,
      fontWeight: 700,
      fontSize: 10.5,
      letterSpacing: ".12em",
      color: "#fff"
    }
  }, "RESET")), /*#__PURE__*/React.createElement("button", {
    onClick: () => {
      click(1300);
      onClose();
    },
    style: {
      display: "inline-flex",
      alignItems: "center",
      gap: 8,
      padding: "9px 16px",
      borderRadius: 125,
      border: 0,
      cursor: "pointer",
      background: accent,
      color: "#fff",
      boxShadow: `0 8px 20px ${accent}55`
    }
  }, /*#__PURE__*/React.createElement("span", {
    style: {
      fontFamily: SANS_E,
      fontWeight: 700,
      fontSize: 10.5,
      letterSpacing: ".12em"
    }
  }, "APPLY"), /*#__PURE__*/React.createElement("span", {
    style: {
      minWidth: 16,
      height: 16,
      borderRadius: 8,
      background: "rgba(0,0,0,.22)",
      fontFamily: SANS_E,
      fontWeight: 700,
      fontSize: 10.5,
      display: "flex",
      alignItems: "center",
      justifyContent: "center",
      padding: "0 5px",
      fontVariantNumeric: "tabular-nums"
    }
  }, count))), sel && /*#__PURE__*/React.createElement(React.Fragment, null, /*#__PURE__*/React.createElement("div", {
    style: {
      ...secLbl,
      position: "relative",
      marginBottom: 7
    }
  }, "DATE"), /*#__PURE__*/React.createElement("div", {
    style: {
      position: "relative",
      marginBottom: 13,
      display: "flex",
      alignItems: "center",
      gap: 9
    }
  }, dayBtn("‹", sel.from <= MIN_OFF, () => setSel({
    from: sel.from - 1,
    to: sel.from - 1
  })), /*#__PURE__*/React.createElement("button", {
    onClick: () => {
      click(1300);
      onCalendar && onCalendar();
    },
    style: {
      flex: 1,
      minWidth: 0,
      height: 42,
      borderRadius: 12,
      cursor: "pointer",
      background: "rgba(255,255,255,.06)",
      border: "1px solid rgba(255,255,255,.14)",
      display: "flex",
      alignItems: "center",
      justifyContent: "center",
      gap: 8
    }
  }, /*#__PURE__*/React.createElement("span", {
    style: {
      fontFamily: MONO_E,
      fontSize: 14,
      color: "#fff",
      letterSpacing: ".04em",
      whiteSpace: "nowrap"
    }
  }, dRange ? `${dFrom.sub} – ${dTo.sub}` : `${dFrom.top} · ${dFrom.sub}`), /*#__PURE__*/React.createElement("svg", {
    width: "13",
    height: "13",
    viewBox: "0 0 24 24",
    fill: "none",
    stroke: "rgba(255,255,255,.6)",
    strokeWidth: "2",
    strokeLinecap: "round"
  }, /*#__PURE__*/React.createElement("rect", {
    x: "3",
    y: "4.5",
    width: "18",
    height: "17",
    rx: "2.5"
  }), /*#__PURE__*/React.createElement("path", {
    d: "M3 9h18M8 2.5v4M16 2.5v4"
  }))), dayBtn("›", sel.to >= MAX_OFF, () => setSel({
    from: sel.to + 1,
    to: sel.to + 1
  })))), /*#__PURE__*/React.createElement("div", {
    style: {
      ...secLbl,
      position: "relative",
      marginBottom: 7
    }
  }, "SHOW"), /*#__PURE__*/React.createElement("div", {
    style: {
      ...card,
      padding: "2px 13px",
      marginBottom: 13
    }
  }, EV_TOGGLE_DEFS.map((t, i) => {
    const on = !!toggles[t.id];
    return /*#__PURE__*/React.createElement("button", {
      key: t.id,
      onClick: () => {
        click(1050);
        setToggle(t.id, !on);
      },
      style: {
        width: "100%",
        display: "flex",
        alignItems: "center",
        gap: 12,
        padding: "9px 0",
        background: "transparent",
        border: 0,
        borderTop: i ? "1px solid rgba(255,255,255,.085)" : 0,
        cursor: "pointer",
        textAlign: "left"
      }
    }, /*#__PURE__*/React.createElement("span", {
      style: {
        flex: "none",
        width: 21,
        height: 21,
        borderRadius: 6,
        background: on ? accent : "rgba(255,255,255,.075)",
        border: `1px solid ${on ? accent : "rgba(255,255,255,.2)"}`,
        display: "flex",
        alignItems: "center",
        justifyContent: "center",
        transition: "all 140ms"
      }
    }, on && /*#__PURE__*/React.createElement("svg", {
      width: "12",
      height: "12",
      viewBox: "0 0 24 24",
      fill: "none",
      stroke: "#fff",
      strokeWidth: "3",
      strokeLinecap: "round",
      strokeLinejoin: "round"
    }, /*#__PURE__*/React.createElement("path", {
      d: "M5 12l5 5L20 6"
    }))), /*#__PURE__*/React.createElement("span", {
      style: {
        fontFamily: SANS_E,
        fontWeight: 700,
        fontSize: 12,
        letterSpacing: ".02em",
        color: on ? "#fff" : "rgba(255,255,255,.7)"
      }
    }, t.label));
  })), /*#__PURE__*/React.createElement("div", {
    style: {
      ...secLbl,
      position: "relative",
      marginBottom: 7
    }
  }, "REFINE"), /*#__PURE__*/React.createElement("div", {
    style: {
      ...card,
      marginBottom: 4
    }
  }, /*#__PURE__*/React.createElement(PillGroup, {
    label: "TYPE",
    items: EV_CATS,
    val: cat,
    set: setCat,
    row: true
  }), /*#__PURE__*/React.createElement("div", {
    style: {
      height: 1,
      background: "rgba(255,255,255,.085)"
    }
  }), /*#__PURE__*/React.createElement(BuyInRange, {
    value: price,
    onChange: setPrice,
    accent: accent
  }), /*#__PURE__*/React.createElement("div", {
    style: {
      height: 1,
      background: "rgba(255,255,255,.085)"
    }
  }), /*#__PURE__*/React.createElement(PillGroup, {
    label: "GAME",
    items: EV_GAMES,
    val: game,
    set: setGame
  }))));
}
function EventsScreen({
  open,
  onClose,
  accent = "#D71921",
  onOpenEvent,
  layout = "grid",
  rowVariant = 1,
  nested = false,
  topInset = 0
}) {
  const [mounted, setMounted] = React.useState(false);
  const [cat, setCat] = React.useState("all");
  const [q, setQ] = React.useState("");
  const [qRun, setQRun] = React.useState("");
  const [searchOn, setSearchOn] = React.useState(false); // the field only appears on demand
  // window.openEventsSearch("SPRING MILLIONS") → lobby, already filtered
  React.useEffect(() => {
    // openEventsSearch(name) — from a tournament's SATELLITES tab: same landing
    // as a satellite tile tap (name + SATELLITE type filter)
    window.openEventsSearch = (text, opts) => {
      const s = String(text || "");
      // без тексту показуємо просто всі події обраного типу — поле пошуку
      // тоді не потрібне і не має відкриватись порожнім
      setQ(s);
      setQRun(s);
      setSearchOn(!!s);
      setSel({
        from: 0,
        to: MAX_OFF
      });
      setCat(opts && opts.cat ? opts.cat : "satellite");
      if (window.__goEvents) window.__goEvents();
    };
    return () => {
      delete window.openEventsSearch;
    };
  }, []);
  const [price, setPrice] = React.useState({
    lo: 0,
    hi: PRICE_MAX
  });
  const [game, setGame] = React.useState("all");
  const [toggles, setToggles] = React.useState({
    ...EV_TOGGLE_DEFAULTS
  });
  const setToggle = (id, v) => setToggles(t => ({
    ...t,
    [id]: v
  }));
  const isList = layout === "list";
  const [sel, setSel] = React.useState({
    from: 0,
    to: 0
  });
  // tournaments the player is registered for — pinned above everything else
  const registrations = window.useRegisteredEvents();
  const isReg = e => registrations.some(item => item.id === e.id);
  const toggleReg = e => window.PX_SET_REG(e.id, !isReg(e));
  const [calOpen, setCalOpen] = React.useState(false);
  const [myOpen, setMyOpen] = React.useState(false);
  const [filtersOpen, setFiltersOpen] = React.useState(false);
  // правка 14: коли рядок «СОБЫТИЯ · пошук · ФИЛЬТРЫ» ідe вгору, під шапкою
  // лишається САМА кнопка «ФИЛЬТРЫ» — окрема, напівпрозора, без чорної смуги
  const scRef = React.useRef(null);
  const filtRowRef = React.useRef(null);
  const [fabOn, setFabOn] = React.useState(false);
  const onScroll = () => {
    const sc = scRef.current,
      row = filtRowRef.current;
    if (!sc || !row) return;
    setFabOn(sc.scrollTop > row.offsetTop - (nested ? topInset : 0) + 4);
  };
  React.useEffect(() => {
    if (!open) setFabOn(false);
  }, [open]);
  // a screen-level modal owns the whole phone — tell the shell to hide its bar
  React.useEffect(() => {
    const on = open && (calOpen || filtersOpen || myOpen);
    window.__pxModalOpen = on;
    window.dispatchEvent(new Event("px-modal"));
    return () => {
      window.__pxModalOpen = false;
      window.dispatchEvent(new Event("px-modal"));
    };
  }, [open, calOpen, filtersOpen, myOpen]);

  // Виїзд знизу мусить програватись при КОЖНОМУ відкритті. React лишає
  // ту саму ноду, тож CSS-анімація сама не перезапускається — перезапускаємо
  // її вручну через скидання властивості й примусовий reflow.
  const rootRef = React.useRef(null);
  React.useEffect(() => {
    if (!open) return;
    const el = rootRef.current;
    if (!el) return;
    el.style.animation = "none";
    void el.offsetWidth;
    el.style.animation = "px-up 360ms cubic-bezier(0.2,0.8,0.2,1) both";
  }, [open]);
  if (!open) return null;
  const featured = EVENTS.filter(e => e.featured).sort((a, b) => a.start - b.start).slice(0, 5); // TOP EVENTS — max 5
  const isRange = sel.from !== sel.to;
  // type is derived, not a tag list: tournament / satellite (incl. steps) / freeroll
  const catOk = e => {
    if (cat === "all") return true;
    const t = evType(e);
    if (cat === "satellite") return t === "satellite" || t === "step";
    return t === cat;
  };
  const priceOk = e => buyNum(e) >= price.lo && buyNum(e) <= price.hi;
  const gameOk = e => game === "all" ? true : e.game === game;
  const now = Date.now();
  const statusOk = e => {
    const secs = Math.floor((e.start - now) / 1000);
    if (secs <= 0) return toggles.completed; // already started/finished
    if (secs < 45 * 60) return toggles.running; // live / late-reg window
    return true; // upcoming — always shown
  };
  const satOk = e => {
    if (toggles.hideSat && e.cats.includes("satellite")) return false;
    if (toggles.hideStep && e.step) return false;
    return true;
  };
  const openEv = ev => {
    if (onOpenEvent) onOpenEvent(ev);
  };
  const qs = qRun.trim().toLowerCase();
  const queryOk = e => {
    if (!qs) return true;
    const hay = [e.name, e.feeds, e.series, e.game, e.type, (e.cats || []).join(" ")].filter(Boolean).join(" ").toLowerCase();
    return hay.indexOf(qs) !== -1;
  };
  const visible = EVENTS.filter(e => {
    if (qs) return true;
    const o = evOff(e.start);
    return o >= sel.from && o <= sel.to;
  }).filter(queryOk).filter(catOk).filter(priceOk).filter(gameOk).filter(statusOk).filter(satOk).sort((a, b) => a.start - b.start);
  // pinned first, then chronological — the pinned ones ignore the date filter
  const pinned = EVENTS.filter(isReg).sort((a, b) => a.start - b.start);
  const rest = visible.filter(e => !isReg(e));
  // group by day for range mode
  const groups = [];
  if (isRange) {
    const byOff = {};
    visible.forEach(e => {
      const o = evOff(e.start);
      (byOff[o] = byOff[o] || []).push(e);
    });
    Object.keys(byOff).map(Number).sort((a, b) => a - b).forEach(o => groups.push({
      off: o,
      items: byOff[o]
    }));
  }
  const togglesActive = EV_TOGGLE_DEFS.filter(t => toggles[t.id] !== EV_TOGGLE_DEFAULTS[t.id]).length;
  const activeCount = (cat !== "all" ? 1 : 0) + (price.lo > 0 || price.hi < PRICE_MAX ? 1 : 0) + (game !== "all" ? 1 : 0) + (sel.from !== 0 || sel.to !== 0 ? 1 : 0) + togglesActive;
  const activeChips = [];
  if (cat !== "all") activeChips.push({
    key: "cat",
    label: (EV_CATS.find(c => c.id === cat) || {}).label,
    clear: () => setCat("all")
  });
  if (price.lo > 0 || price.hi < PRICE_MAX) activeChips.push({
    key: "price",
    label: `${price.lo <= 0 ? "FREE" : PRICE_CUR + price.lo.toLocaleString("en-US").split(",").join(" ")}–${price.hi >= PRICE_MAX ? PRICE_CUR + PRICE_MAX.toLocaleString("en-US").split(",").join(" ") + "+" : PRICE_CUR + price.hi.toLocaleString("en-US").split(",").join(" ")}`,
    clear: () => setPrice({
      lo: 0,
      hi: PRICE_MAX
    })
  });
  if (game !== "all") activeChips.push({
    key: "game",
    label: (EV_GAMES.find(g => g.id === game) || {}).label,
    clear: () => setGame("all")
  });
  EV_TOGGLE_DEFS.forEach(t => {
    if (toggles[t.id] !== EV_TOGGLE_DEFAULTS[t.id]) activeChips.push({
      key: t.id,
      label: t.label.toUpperCase(),
      clear: () => setToggle(t.id, EV_TOGGLE_DEFAULTS[t.id])
    });
  });
  const mFrom = dayMeta(sel.from),
    mTo = dayMeta(sel.to);
  // the filter button doubles as the date readout now that the stepper is gone
  const dayLabel = isRange ? `${mFrom.sub}–${mTo.sub}` : mFrom.top;
  const stepArrow = (dir, disabled, fn) => /*#__PURE__*/React.createElement("button", {
    onClick: () => {
      if (!disabled) {
        if (window.playClick) window.playClick(1200, 0.03);
        fn();
      }
    },
    disabled: disabled,
    style: {
      flex: "none",
      width: 44,
      height: 58,
      borderRadius: 14,
      cursor: disabled ? "default" : "pointer",
      background: "rgba(255,255,255,.075)",
      border: "1px solid rgba(255,255,255,.16)",
      opacity: disabled ? 0.3 : 1,
      color: "#fff",
      fontSize: 22,
      fontFamily: MONO_E,
      display: "flex",
      alignItems: "center",
      justifyContent: "center"
    }
  }, dir);
  return /*#__PURE__*/React.createElement("div", {
    ref: rootRef,
    style: {
      position: "absolute",
      inset: 0,
      zIndex: 36,
      background: "#000",
      animation: "px-up 360ms cubic-bezier(0.2,0.8,0.2,1) both",
      display: "flex",
      flexDirection: "column"
    }
  }, /*#__PURE__*/React.createElement("div", {
    style: {
      position: "absolute",
      top: 0,
      left: 0,
      right: 0,
      height: 220,
      pointerEvents: "none",
      background: `radial-gradient(ellipse 90% 70% at 50% 0%, ${accent}22, transparent 62%)`
    }
  }), /*#__PURE__*/React.createElement("div", {
    ref: scRef,
    onScroll: onScroll,
    style: {
      flex: 1,
      overflowY: "auto",
      overflowX: "hidden",
      WebkitOverflowScrolling: "touch",
      paddingBottom: 110,
      position: "relative",
      zIndex: 2
    }
  }, /*#__PURE__*/React.createElement("div", {
    style: {
      height: nested ? topInset : 58,
      flex: "none"
    }
  }), !nested && /*#__PURE__*/React.createElement("div", {
    style: {
      padding: "0 16px",
      textAlign: "center"
    }
  }, /*#__PURE__*/React.createElement("span", {
    style: {
      display: "inline-flex",
      alignItems: "center",
      gap: 7
    }
  }, /*#__PURE__*/React.createElement("span", {
    style: {
      fontFamily: MONO_E,
      fontWeight: 700,
      fontSize: 15,
      color: "#fff",
      letterSpacing: ".16em"
    }
  }, "TOURNAMENTS"), window.InfoDot ? /*#__PURE__*/React.createElement(window.InfoDot, {
    title: "TOURNAMENTS",
    accent: accent
  }) : null)), qs ? /*#__PURE__*/React.createElement("div", {
    style: {
      display: "flex",
      alignItems: "baseline",
      justifyContent: "space-between",
      padding: "18px 16px 0"
    }
  }, /*#__PURE__*/React.createElement("span", {
    style: {
      fontFamily: MONO_E,
      fontSize: 11,
      color: "#A9A9B2",
      letterSpacing: ".22em"
    }
  }, cat === "satellite" ? "SATELLITES" : "RESULTS"), /*#__PURE__*/React.createElement("span", {
    style: {
      fontFamily: SANS_E,
      fontWeight: 700,
      fontSize: 10.5,
      letterSpacing: ".12em",
      color: "#A9A9B2"
    }
  }, visible.length, " FOUND")) : /*#__PURE__*/React.createElement(React.Fragment, null, /*#__PURE__*/React.createElement("div", {
    style: {
      padding: "16px 16px 0"
    }
  }, /*#__PURE__*/React.createElement("span", {
    style: {
      fontFamily: MONO_E,
      fontSize: 11,
      color: "#A9A9B2",
      letterSpacing: ".22em"
    }
  }, "TOP EVENTS")), /*#__PURE__*/React.createElement("div", {
    style: {
      display: "flex",
      alignItems: "flex-start",
      gap: 12,
      overflowX: "auto",
      scrollSnapType: "x mandatory",
      padding: "12px 16px 4px",
      scrollbarWidth: "none"
    }
  }, featured.map(e => /*#__PURE__*/React.createElement(FeaturedEvent, {
    key: e.id,
    e: e,
    accent: accent,
    onOpen: () => openEv(e)
  }))), /*#__PURE__*/React.createElement("div", {
    style: {
      display: "flex",
      justifyContent: "center",
      gap: 5,
      marginTop: 8
    }
  }, featured.map((_, i) => /*#__PURE__*/React.createElement("span", {
    key: i,
    style: {
      width: i === 0 ? 16 : 5,
      height: 5,
      borderRadius: 3,
      background: i === 0 ? "#fff" : "rgba(255,255,255,.25)"
    }
  })))), /*#__PURE__*/React.createElement("div", {
    ref: filtRowRef,
    style: {
      display: "flex",
      alignItems: "center",
      gap: 7,
      padding: "12px 16px 0"
    }
  }, searchOn ? /*#__PURE__*/React.createElement("div", {
    style: {
      flex: 1,
      minWidth: 0,
      display: "flex",
      alignItems: "center",
      gap: 8,
      height: 32,
      padding: "0 11px",
      borderRadius: 125,
      background: "rgba(255,255,255,.055)",
      border: `1px solid ${qRun ? accent + "66" : "rgba(255,255,255,.18)"}`
    }
  }, /*#__PURE__*/React.createElement("svg", {
    width: "13",
    height: "13",
    viewBox: "0 0 24 24",
    fill: "none",
    stroke: "rgba(255,255,255,.55)",
    strokeWidth: "2.2",
    strokeLinecap: "round"
  }, /*#__PURE__*/React.createElement("circle", {
    cx: "11",
    cy: "11",
    r: "7"
  }), /*#__PURE__*/React.createElement("path", {
    d: "M20 20l-3.2-3.2"
  })), /*#__PURE__*/React.createElement("input", {
    autoFocus: true,
    value: q,
    onChange: ev => setQ(ev.target.value),
    onKeyDown: ev => {
      if (ev.key === "Enter") setQRun(q);
    },
    placeholder: "Search tournaments",
    style: {
      flex: 1,
      minWidth: 0,
      background: "transparent",
      border: 0,
      outline: "none",
      color: "#fff",
      fontFamily: SANS_E,
      fontWeight: 600,
      fontSize: 12,
      letterSpacing: ".01em"
    }
  }), /*#__PURE__*/React.createElement("button", {
    onClick: () => {
      if (window.playClick) window.playClick(900, 0.03);
      setQ("");
      setQRun("");
      setSearchOn(false);
    },
    style: {
      flex: "none",
      width: 18,
      height: 18,
      borderRadius: 8,
      background: "rgba(255,255,255,.12)",
      border: 0,
      color: "#D8D8DF",
      fontSize: 11,
      lineHeight: 1,
      cursor: "pointer",
      padding: 0
    }
  }, "\xD7")) : /*#__PURE__*/React.createElement("div", {
    style: {
      display: "flex",
      gap: 6,
      overflowX: "auto",
      scrollbarWidth: "none",
      flex: 1,
      minWidth: 0
    }
  }, activeChips.length === 0 ? /*#__PURE__*/React.createElement("span", {
    style: {
      fontFamily: SANS_E,
      fontWeight: 700,
      fontSize: 11,
      letterSpacing: ".22em",
      color: "#A9A9B2",
      alignSelf: "center",
      whiteSpace: "nowrap"
    }
  }, "EVENTS") : activeChips.map(ch => /*#__PURE__*/React.createElement("button", {
    key: ch.key,
    onClick: () => {
      if (window.playClick) window.playClick(900, 0.03);
      ch.clear();
    },
    style: {
      flex: "none",
      display: "inline-flex",
      alignItems: "center",
      gap: 5,
      padding: "5px 9px",
      borderRadius: 125,
      cursor: "pointer",
      background: "rgba(255,255,255,.075)",
      border: "1px solid rgba(255,255,255,.18)",
      fontFamily: SANS_E,
      fontWeight: 700,
      fontSize: 10.5,
      letterSpacing: ".06em",
      color: "#D8D8DF",
      whiteSpace: "nowrap"
    }
  }, ch.label, /*#__PURE__*/React.createElement("svg", {
    width: "10",
    height: "10",
    viewBox: "0 0 24 24",
    fill: "none",
    stroke: "rgba(255,255,255,.55)",
    strokeWidth: "2.8",
    strokeLinecap: "round"
  }, /*#__PURE__*/React.createElement("path", {
    d: "M6 6l12 12M18 6L6 18"
  }))))), !searchOn && /*#__PURE__*/React.createElement("button", {
    onClick: () => {
      if (window.playClick) window.playClick(1250, 0.04);
      setSearchOn(true);
    },
    "aria-label": "Search",
    style: {
      flex: "none",
      width: 32,
      height: 32,
      borderRadius: 125,
      cursor: "pointer",
      padding: 0,
      background: qRun ? accent : "rgba(255,255,255,.085)",
      border: `1px solid ${qRun ? accent : "rgba(255,255,255,.18)"}`,
      display: "flex",
      alignItems: "center",
      justifyContent: "center"
    }
  }, /*#__PURE__*/React.createElement("svg", {
    width: "14",
    height: "14",
    viewBox: "0 0 24 24",
    fill: "none",
    stroke: "#fff",
    strokeWidth: "2.2",
    strokeLinecap: "round"
  }, /*#__PURE__*/React.createElement("circle", {
    cx: "11",
    cy: "11",
    r: "7"
  }), /*#__PURE__*/React.createElement("path", {
    d: "M20 20l-3.2-3.2"
  }))), /*#__PURE__*/React.createElement("button", {
    onClick: () => {
      if (window.playClick) window.playClick(1300, 0.04);
      setFiltersOpen(true);
    },
    style: {
      flex: "none",
      display: "inline-flex",
      alignItems: "center",
      justifyContent: "center",
      gap: 6,
      height: 32,
      padding: "0 13px",
      borderRadius: 125,
      cursor: "pointer",
      background: activeCount ? accent : "rgba(255,255,255,.085)",
      border: `1px solid ${activeCount ? accent : "rgba(255,255,255,.18)"}`,
      transition: "all 140ms",
      boxShadow: activeCount ? `0 6px 16px ${accent}44` : "none"
    }
  }, /*#__PURE__*/React.createElement("svg", {
    width: "14",
    height: "14",
    viewBox: "0 0 24 24",
    fill: "none",
    stroke: "#fff",
    strokeWidth: "2",
    strokeLinecap: "round"
  }, /*#__PURE__*/React.createElement("line", {
    x1: "4",
    y1: "7",
    x2: "20",
    y2: "7"
  }), /*#__PURE__*/React.createElement("line", {
    x1: "4",
    y1: "12",
    x2: "20",
    y2: "12"
  }), /*#__PURE__*/React.createElement("line", {
    x1: "4",
    y1: "17",
    x2: "20",
    y2: "17"
  }), /*#__PURE__*/React.createElement("circle", {
    cx: "9",
    cy: "7",
    r: "2.4",
    fill: "#101014"
  }), /*#__PURE__*/React.createElement("circle", {
    cx: "15",
    cy: "12",
    r: "2.4",
    fill: "#101014"
  }), /*#__PURE__*/React.createElement("circle", {
    cx: "9",
    cy: "17",
    r: "2.4",
    fill: "#101014"
  })), /*#__PURE__*/React.createElement("span", {
    style: {
      fontFamily: SANS_E,
      fontWeight: 700,
      fontSize: 10.5,
      color: "#fff",
      letterSpacing: ".12em"
    }
  }, "FILTERS"), activeCount > 0 && /*#__PURE__*/React.createElement("span", {
    style: {
      minWidth: 16,
      height: 16,
      borderRadius: 8,
      background: "#fff",
      color: accent,
      fontFamily: SANS_E,
      fontWeight: 700,
      fontSize: 10.5,
      display: "flex",
      alignItems: "center",
      justifyContent: "center",
      padding: "0 4px"
    }
  }, activeCount))), !isRange && /*#__PURE__*/React.createElement("div", {
    style: {
      display: "grid",
      gridTemplateColumns: isList ? "1fr" : "1fr 1fr",
      gap: 10,
      padding: "10px 16px 0",
      alignItems: "stretch"
    }
  }, pinned.concat(rest).map(e => /*#__PURE__*/React.createElement(EventRow, {
    key: e.id,
    e: e,
    accent: accent,
    compact: isList,
    rv: rowVariant,
    registered: isReg(e),
    onToggleReg: toggleReg,
    onOpen: () => openEv(e)
  }))), isRange && /*#__PURE__*/React.createElement("div", {
    style: {
      padding: "14px 16px 0"
    }
  }, groups.map(g => /*#__PURE__*/React.createElement("div", {
    key: g.off,
    style: {
      marginBottom: 16
    }
  }, /*#__PURE__*/React.createElement(DaySep, {
    off: g.off,
    count: g.items.length,
    accent: accent
  }), /*#__PURE__*/React.createElement("div", {
    style: {
      display: "grid",
      gridTemplateColumns: isList ? "1fr" : "1fr 1fr",
      gap: 10,
      marginTop: 10,
      alignItems: "stretch"
    }
  }, g.items.map(e => /*#__PURE__*/React.createElement(EventRow, {
    key: e.id,
    e: e,
    accent: accent,
    compact: isList,
    rv: rowVariant,
    registered: isReg(e),
    onToggleReg: toggleReg,
    onOpen: () => openEv(e)
  })))))), visible.length === 0 && /*#__PURE__*/React.createElement("div", {
    style: {
      textAlign: "center",
      marginTop: 30,
      fontFamily: SANS_E,
      fontWeight: 600,
      fontSize: 11,
      color: "#A9A9B2",
      letterSpacing: ".1em"
    }
  }, "NO EVENTS \u2014 TRY ANOTHER DAY")), /*#__PURE__*/React.createElement("div", {
    style: {
      position: "absolute",
      top: (nested ? topInset : 10) + 6,
      right: 16,
      zIndex: 12,
      display: "flex",
      alignItems: "center",
      gap: 7,
      opacity: fabOn ? 1 : 0,
      transform: fabOn ? "translateY(0)" : "translateY(-8px)",
      pointerEvents: fabOn ? "auto" : "none",
      transition: "opacity 180ms ease, transform 180ms cubic-bezier(.2,.8,.2,1)"
    }
  }, /*#__PURE__*/React.createElement("button", {
    onClick: () => {
      if (window.playClick) window.playClick(1250, 0.04);
      setSearchOn(true);
      const sc = scRef.current,
        row = filtRowRef.current;
      if (sc && row) sc.scrollTo({
        top: Math.max(0, row.offsetTop - (nested ? topInset : 0) - 6),
        behavior: "smooth"
      });
    },
    "aria-label": "Search",
    style: {
      flex: "none",
      width: 34,
      height: 34,
      borderRadius: 125,
      cursor: "pointer",
      padding: 0,
      background: qRun ? accent + "E6" : "rgba(20,20,24,.72)",
      border: `1px solid ${qRun ? accent : "rgba(255,255,255,.22)"}`,
      backdropFilter: "blur(14px) saturate(140%)",
      WebkitBackdropFilter: "blur(14px) saturate(140%)",
      boxShadow: "0 10px 26px rgba(0,0,0,.6)",
      display: "flex",
      alignItems: "center",
      justifyContent: "center"
    }
  }, /*#__PURE__*/React.createElement("svg", {
    width: "14",
    height: "14",
    viewBox: "0 0 24 24",
    fill: "none",
    stroke: "#fff",
    strokeWidth: "2.2",
    strokeLinecap: "round"
  }, /*#__PURE__*/React.createElement("circle", {
    cx: "11",
    cy: "11",
    r: "7"
  }), /*#__PURE__*/React.createElement("path", {
    d: "M20 20l-3.2-3.2"
  }))), /*#__PURE__*/React.createElement("button", {
    onClick: () => {
      if (window.playClick) window.playClick(1300, 0.04);
      setFiltersOpen(true);
    },
    style: {
      flex: "none",
      display: "inline-flex",
      alignItems: "center",
      justifyContent: "center",
      gap: 6,
      height: 34,
      padding: "0 13px",
      borderRadius: 125,
      cursor: "pointer",
      background: activeCount ? accent + "E6" : "rgba(20,20,24,.72)",
      border: `1px solid ${activeCount ? accent : "rgba(255,255,255,.22)"}`,
      backdropFilter: "blur(14px) saturate(140%)",
      WebkitBackdropFilter: "blur(14px) saturate(140%)",
      boxShadow: "0 10px 26px rgba(0,0,0,.6)"
    }
  }, /*#__PURE__*/React.createElement("svg", {
    width: "14",
    height: "14",
    viewBox: "0 0 24 24",
    fill: "none",
    stroke: "#fff",
    strokeWidth: "2",
    strokeLinecap: "round"
  }, /*#__PURE__*/React.createElement("line", {
    x1: "4",
    y1: "7",
    x2: "20",
    y2: "7"
  }), /*#__PURE__*/React.createElement("line", {
    x1: "4",
    y1: "12",
    x2: "20",
    y2: "12"
  }), /*#__PURE__*/React.createElement("line", {
    x1: "4",
    y1: "17",
    x2: "20",
    y2: "17"
  }), /*#__PURE__*/React.createElement("circle", {
    cx: "9",
    cy: "7",
    r: "2.4",
    fill: "#101014"
  }), /*#__PURE__*/React.createElement("circle", {
    cx: "15",
    cy: "12",
    r: "2.4",
    fill: "#101014"
  }), /*#__PURE__*/React.createElement("circle", {
    cx: "9",
    cy: "17",
    r: "2.4",
    fill: "#101014"
  })), /*#__PURE__*/React.createElement("span", {
    style: {
      fontFamily: SANS_E,
      fontWeight: 700,
      fontSize: 10.5,
      color: "#fff",
      letterSpacing: ".12em",
      whiteSpace: "nowrap"
    }
  }, "FILTERS"), activeCount > 0 && /*#__PURE__*/React.createElement("span", {
    style: {
      minWidth: 16,
      height: 16,
      borderRadius: 8,
      background: "#fff",
      color: accent,
      fontFamily: SANS_E,
      fontWeight: 700,
      fontSize: 10.5,
      display: "flex",
      alignItems: "center",
      justifyContent: "center",
      padding: "0 4px"
    }
  }, activeCount))), calOpen && /*#__PURE__*/React.createElement(EvCalendar, {
    sel: sel,
    accent: accent,
    onApply: setSel,
    onClose: () => setCalOpen(false)
  }), /*#__PURE__*/React.createElement(EvFilterSheet, {
    open: filtersOpen,
    onClose: () => setFiltersOpen(false),
    accent: accent,
    sel: sel,
    setSel: setSel,
    onCalendar: () => {
      setFiltersOpen(false);
      setCalOpen(true);
    },
    cat: cat,
    setCat: setCat,
    price: price,
    setPrice: setPrice,
    game: game,
    setGame: setGame,
    toggles: toggles,
    setToggle: setToggle,
    count: visible.length
  }), window.MyTournaments && /*#__PURE__*/React.createElement(window.MyTournaments, {
    open: myOpen,
    onClose: () => setMyOpen(false),
    accent: accent,
    onOpenEvent: e => {
      openEv(e);
    }
  }));
}

// day separator for range view
function DaySep({
  off,
  count,
  accent
}) {
  const m = dayMeta(off);
  return /*#__PURE__*/React.createElement("div", {
    style: {
      display: "flex",
      alignItems: "center",
      gap: 10
    }
  }, /*#__PURE__*/React.createElement("span", {
    style: {
      fontFamily: MONO_E,
      fontSize: 13,
      color: "#fff",
      letterSpacing: ".06em"
    }
  }, m.top), /*#__PURE__*/React.createElement("span", {
    style: {
      fontFamily: SANS_E,
      fontWeight: 700,
      fontSize: 10.5,
      color: "#A9A9B2",
      letterSpacing: ".12em"
    }
  }, m.wd, " \xB7 ", m.sub), /*#__PURE__*/React.createElement("span", {
    style: {
      flex: 1,
      height: 1,
      background: "rgba(255,255,255,.1)"
    }
  }), /*#__PURE__*/React.createElement("span", {
    style: {
      fontFamily: SANS_E,
      fontWeight: 700,
      fontSize: 10.5,
      color: accent,
      letterSpacing: ".1em"
    }
  }, count, " EV"));
}
function FeaturedEvent({
  e,
  accent,
  onOpen
}) {
  const cd = useCD(e.start);
  const T = EV_TYPES[evType(e)];
  const c = T.c;
  const fill = Math.round(e.reg / e.cap * 100);
  return /*#__PURE__*/React.createElement("div", {
    onClick: onOpen,
    style: {
      flex: "0 0 86%",
      scrollSnapAlign: "center",
      position: "relative",
      overflow: "hidden",
      borderRadius: 20,
      cursor: "pointer",
      background: "linear-gradient(155deg, #1a1a20, #0a0a0c)",
      border: "1px solid rgba(255,255,255,.1)",
      boxShadow: "0 16px 34px rgba(0,0,0,.5)"
    }
  }, /*#__PURE__*/React.createElement("div", {
    style: {
      position: "absolute",
      inset: 0,
      background: `radial-gradient(circle at 82% 16%, ${c}44, transparent 55%)`
    }
  }), /*#__PURE__*/React.createElement("div", {
    style: {
      position: "relative",
      padding: "11px 13px 11px"
    }
  }, /*#__PURE__*/React.createElement("div", {
    style: {
      display: "flex",
      justifyContent: "space-between",
      alignItems: "center",
      gap: 8
    }
  }, /*#__PURE__*/React.createElement("span", {
    style: {
      display: "inline-flex",
      alignItems: "center",
      gap: 6,
      padding: "3px 9px",
      borderRadius: 6,
      background: `${c}1f`,
      border: `1px solid ${c}66`,
      fontFamily: SANS_E,
      fontWeight: 700,
      fontSize: 10.5,
      color: c,
      letterSpacing: ".12em",
      whiteSpace: "nowrap",
      flex: "none"
    }
  }, /*#__PURE__*/React.createElement(EvTypeIcon, {
    kind: T.icon,
    size: 11,
    color: c
  }), " ", T.label), /*#__PURE__*/React.createElement("span", {
    style: {
      display: "inline-flex",
      alignItems: "center",
      gap: 6,
      fontFamily: MONO_E,
      fontSize: 13,
      color: "#fff",
      letterSpacing: ".04em",
      fontVariantNumeric: "tabular-nums",
      whiteSpace: "nowrap",
      flex: "none"
    }
  }, /*#__PURE__*/React.createElement("span", {
    style: {
      width: 5,
      height: 5,
      borderRadius: "50%",
      background: c,
      boxShadow: `0 0 6px ${c}`,
      animation: "pp-pulse 1.4s ease-in-out infinite"
    }
  }), cd)), /*#__PURE__*/React.createElement("div", {
    style: {
      fontFamily: MONO_E,
      fontSize: 19,
      color: "#fff",
      letterSpacing: ".03em",
      marginTop: 9,
      whiteSpace: "nowrap",
      overflow: "hidden",
      textOverflow: "ellipsis"
    }
  }, e.name), /*#__PURE__*/React.createElement("div", {
    style: {
      display: "flex",
      alignItems: "baseline",
      gap: 7,
      marginTop: 5,
      whiteSpace: "nowrap",
      overflow: "hidden"
    }
  }, (() => {
    const s = satSeats(e);
    return s ? /*#__PURE__*/React.createElement(SeatBreak, {
      s: s,
      color: c,
      fs: 19
    }) : /*#__PURE__*/React.createElement("span", {
      style: {
        fontFamily: MONO_E,
        fontWeight: 700,
        fontSize: String(e.gtd).length > 12 ? 20 : String(e.gtd).length > 9 ? 24 : 27,
        color: c
      }
    }, e.gtd);
  })(), /*#__PURE__*/React.createElement("span", {
    style: {
      fontFamily: SANS_E,
      fontWeight: 700,
      fontSize: 10.5,
      color: "#A9A9B2",
      letterSpacing: ".14em",
      flex: "none"
    }
  }, prizeLabel(e))), /*#__PURE__*/React.createElement("div", {
    style: {
      display: "flex",
      alignItems: "baseline",
      gap: 5,
      marginTop: 4,
      whiteSpace: "nowrap"
    }
  }, /*#__PURE__*/React.createElement("span", {
    style: {
      fontFamily: SANS_E,
      fontWeight: 700,
      fontSize: 10.5,
      letterSpacing: ".12em",
      color: "#A9A9B2"
    }
  }, "BUY-IN"), /*#__PURE__*/React.createElement("span", {
    style: {
      fontFamily: MONO_E,
      fontWeight: 700,
      fontSize: 12,
      color: "#D8D8DF"
    }
  }, e.buyIn)), /*#__PURE__*/React.createElement("div", {
    style: {
      display: "flex",
      justifyContent: "space-between",
      gap: 8,
      marginTop: 9,
      fontFamily: SANS_E,
      fontWeight: 600,
      fontSize: 10.5,
      color: "#A9A9B2",
      letterSpacing: ".08em",
      whiteSpace: "nowrap"
    }
  }, /*#__PURE__*/React.createElement("span", {
    style: {
      overflow: "hidden",
      textOverflow: "ellipsis"
    }
  }, e.reg > 0 ? `${e.reg.toLocaleString("en-US").split(",").join(" ")} REGISTERED` : "REG NOW OPEN"), /*#__PURE__*/React.createElement("span", {
    style: {
      flex: "none"
    }
  }, clock(e.start), " \xB7 ", dayMeta(evOff(e.start)).sub))));
}
function EventRow({
  e,
  accent,
  onOpen,
  compact = false,
  rv = 1,
  registered = false,
  onToggleReg
}) {
  const rel = useRel(e.start);
  const relLate = useRel(e.start + (e.late || 60) * 60000); // late-reg window from the schedule
  const relReg = useRel(e.start - 86400000); // registration opens ≈ 24 h before start
  const secs = Math.max(0, Math.floor((e.start - Date.now()) / 1000));
  const T = EV_TYPES[evType(e)];
  const c = T.c;
  const cc = e.color || c;
  const kind = evType(e);
  const st = evState(secs);
  const live = st === "live";
  const hasReg = e.reg > 0;
  const fill = hasReg ? Math.min(100, Math.round(e.reg / e.cap * 100)) : 0;
  const fmt = (e.fmt || []).filter(f => f !== "FREEZEOUT")[0];
  const NOTCH = "#000";
  const isSat = kind === "satellite" || kind === "step";

  // ── compact single-row layouts (4 versions of LIVE + fill display) ──
  if (compact) {
    if (rv === 12 && window.EventRowS) return /*#__PURE__*/React.createElement(window.EventRowS, {
      e: e,
      accent: accent,
      s: 4,
      onOpen: onOpen,
      registered: registered,
      onToggleReg: onToggleReg
    });
    const regLabel = hasReg ? `${e.reg.toLocaleString("en-US").split(",").join(" ")} ${live ? "PLAYING" : "REG"}` : "REG SOON";
    const action = live ? "OBSERVE ›" : hasReg ? "JOIN ›" : "REMIND ›";
    const LivePill = ({
      sm
    }) => /*#__PURE__*/React.createElement("span", {
      style: {
        display: "inline-flex",
        alignItems: "center",
        gap: 4,
        padding: sm ? "2px 7px" : "3px 8px",
        borderRadius: 125,
        background: `${c}22`,
        border: `1px solid ${c}`,
        flex: "none"
      }
    }, /*#__PURE__*/React.createElement("span", {
      style: {
        width: 5,
        height: 5,
        borderRadius: "50%",
        background: c,
        boxShadow: `0 0 6px ${c}`,
        animation: "pp-pulse 1.2s ease-in-out infinite"
      }
    }), /*#__PURE__*/React.createElement("span", {
      style: {
        fontFamily: SANS_E,
        fontWeight: 700,
        fontSize: 10.5,
        letterSpacing: ".12em",
        color: "#fff"
      }
    }, "LIVE"));
    const TypeTag = () => /*#__PURE__*/React.createElement("span", {
      style: {
        display: "inline-flex",
        alignItems: "center",
        gap: 4,
        padding: "2px 7px",
        borderRadius: 5,
        background: `${c}1c`,
        border: `1px solid ${c}55`,
        flex: "none"
      }
    }, /*#__PURE__*/React.createElement(EvTypeIcon, {
      kind: T.icon,
      size: 9,
      color: c
    }), /*#__PURE__*/React.createElement("span", {
      style: {
        fontFamily: SANS_E,
        fontWeight: 700,
        fontSize: 10.5,
        letterSpacing: ".08em",
        color: c
      }
    }, T.label));
    const SubTag = () => isSat ? /*#__PURE__*/React.createElement("span", {
      style: {
        display: "inline-flex",
        alignItems: "center",
        gap: 4,
        flex: "none"
      }
    }, /*#__PURE__*/React.createElement("svg", {
      width: "10",
      height: "10",
      viewBox: "0 0 24 24",
      fill: "none",
      stroke: c,
      strokeWidth: "2.4",
      strokeLinecap: "round",
      strokeLinejoin: "round"
    }, /*#__PURE__*/React.createElement("path", {
      d: "M5 12h14M13 6l6 6-6 6"
    })), /*#__PURE__*/React.createElement("span", {
      style: {
        fontFamily: SANS_E,
        fontWeight: 700,
        fontSize: 10.5,
        letterSpacing: ".04em",
        color: "#A9A9B2"
      }
    }, e.feeds || "WINS A SEAT")) : fmt ? /*#__PURE__*/React.createElement("span", {
      style: {
        fontFamily: SANS_E,
        fontWeight: 700,
        fontSize: 10.5,
        letterSpacing: ".1em",
        color: "#A9A9B2",
        padding: "2px 6px",
        borderRadius: 4,
        background: "rgba(255,255,255,.085)",
        border: "1px solid rgba(255,255,255,.16)",
        flex: "none"
      }
    }, fmt) : null;
    const Prize = () => /*#__PURE__*/React.createElement("div", {
      style: {
        display: "flex",
        alignItems: "baseline",
        gap: 7,
        flexWrap: "wrap"
      }
    }, (() => {
      const s = satSeats(e);
      return s ? /*#__PURE__*/React.createElement(SeatBreak, {
        s: s,
        color: c,
        fs: 14
      }) : /*#__PURE__*/React.createElement("span", {
        style: {
          fontFamily: MONO_E,
          fontWeight: 700,
          fontSize: String(e.gtd).length > 11 ? 13.5 : 17,
          color: c,
          lineHeight: 1
        }
      }, e.gtd);
    })(), /*#__PURE__*/React.createElement("span", {
      style: {
        fontFamily: SANS_E,
        fontWeight: 700,
        fontSize: 10.5,
        color: "#A9A9B2",
        letterSpacing: ".12em"
      }
    }, prizeLabel(e)), /*#__PURE__*/React.createElement("span", {
      style: {
        fontFamily: MONO_E,
        fontSize: 10.5,
        color: e.buyIn === "FREE" ? c : "rgba(255,255,255,.75)",
        fontWeight: e.buyIn === "FREE" ? 700 : 400
      }
    }, e.buyIn), /*#__PURE__*/React.createElement("span", {
      style: {
        color: "#8A8A93",
        fontFamily: MONO_E,
        fontSize: 10.5
      }
    }, "\xB7"), /*#__PURE__*/React.createElement("span", {
      style: {
        fontFamily: MONO_E,
        fontSize: 10.5,
        color: "#A9A9B2",
        fontVariantNumeric: "tabular-nums"
      }
    }, clock(e.start)));
    const Name = () => /*#__PURE__*/React.createElement("div", {
      style: {
        fontFamily: MONO_E,
        fontSize: 14,
        color: "#fff",
        letterSpacing: ".01em",
        lineHeight: 1.15,
        textWrap: "pretty"
      }
    }, e.name);
    const Icon = ({
      s = 38
    }) => /*#__PURE__*/React.createElement("span", {
      style: {
        width: s,
        height: s,
        borderRadius: 12,
        background: `${cc}22`,
        border: `1px solid ${cc}66`,
        display: "flex",
        alignItems: "center",
        justifyContent: "center",
        flex: "none",
        overflow: "hidden"
      }
    }, /*#__PURE__*/React.createElement(TypeArt, {
      e: e,
      size: Math.round(s * 0.68),
      color: cc
    }));
    const shell = (children, extra) => /*#__PURE__*/React.createElement("button", {
      onClick: onOpen,
      onMouseDown: ev => {
        ev.currentTarget.style.transform = "scale(.992)";
      },
      onMouseUp: ev => {
        ev.currentTarget.style.transform = "";
      },
      onMouseLeave: ev => {
        ev.currentTarget.style.transform = "";
      },
      style: {
        position: "relative",
        overflow: "hidden",
        textAlign: "left",
        cursor: "pointer",
        width: "100%",
        borderRadius: 12,
        padding: 0,
        border: `1px solid ${live ? c + "66" : "rgba(255,255,255,.1)"}`,
        background: "linear-gradient(160deg, #1f1f27, #0a0a0c)",
        transition: "transform 110ms",
        display: "flex",
        alignItems: "stretch",
        ...extra
      }
    }, /*#__PURE__*/React.createElement("div", {
      style: {
        flex: "none",
        width: 3,
        background: c,
        opacity: .9
      }
    }), /*#__PURE__*/React.createElement("div", {
      style: {
        position: "absolute",
        inset: 0,
        background: `radial-gradient(circle at 2% 0%, ${c}1f, transparent 42%)`,
        pointerEvents: "none"
      }
    }), children);

    // ─ V12 — Compact lobby tile (CoinPoker-style IA in our dark/Arcanium look):
    //   type-art icon · title · stat row · status + CTA · footer tag strip. ─
    if (rv === 12) {
      const chipH = 17;
      const dropDup = ["KO", "PKO", "MYSTERY", "BOUNTY"];
      const DISC_LABEL = {
        holdem: "HOLD'EM",
        plo5: "PLO 5",
        plo6: "PLO 6",
        short: "SHORT DECK",
        flash: "FLASH & FLUSH",
        nlh: "HOLD'EM",
        plo: "PLO"
      };
      const _fs = (e.fmt || []).join(" ");
      const _discFromFmt = /PLO ?6|6-?CARD/i.test(_fs) ? "plo6" : /PLO ?5|5-?CARD/i.test(_fs) ? "plo5" : /PLO/i.test(_fs) ? "plo" : /SHORT/i.test(_fs) ? "short" : /FLASH/i.test(_fs) ? "flash" : null;
      const discWord = DISC_LABEL[e.disc] || DISC_LABEL[e.game] || DISC_LABEL[_discFromFmt] || "HOLD'EM";
      const fmtTags = (e.fmt || []).filter(f => f !== "FREEZEOUT" && !dropDup.includes(f) && !/^\d+-?MAX$/i.test(f) && !/^(PLO|HOLD|SHORT|FLASH|NLH|TURBO|HYPER)/i.test(f)).slice(0, 3);
      const TxtChip = ({
        children,
        color,
        bg,
        bd
      }) => /*#__PURE__*/React.createElement("span", {
        style: {
          height: chipH,
          display: "inline-flex",
          alignItems: "center",
          padding: "0 7px",
          borderRadius: 5,
          fontFamily: SANS_E,
          fontWeight: 700,
          fontSize: 10.5,
          letterSpacing: ".08em",
          color: color || "rgba(255,255,255,.62)",
          background: bg || "rgba(255,255,255,.085)",
          border: `1px solid ${bd || "rgba(255,255,255,.18)"}`,
          flex: "none",
          whiteSpace: "nowrap"
        }
      }, children);
      const PngChip = ({
        src
      }) => /*#__PURE__*/React.createElement("img", {
        src: src,
        alt: "",
        style: {
          height: chipH,
          width: "auto",
          borderRadius: 5,
          display: "block",
          flex: "none"
        }
      });
      const SI = {
        width: 12,
        height: 12,
        viewBox: "0 0 24 24",
        fill: "none",
        strokeWidth: 2,
        strokeLinecap: "round",
        strokeLinejoin: "round"
      };
      const Stat = ({
        children
      }) => /*#__PURE__*/React.createElement("span", {
        style: {
          display: "inline-flex",
          alignItems: "center",
          gap: 4,
          fontFamily: MONO_E,
          fontWeight: 700,
          fontSize: 12,
          color: "#fff",
          whiteSpace: "nowrap"
        }
      }, children);
      // registered + already running (late reg or closed) → the only action is PLAY
      const cta = registered && (live || e.closed) ? {
        t: "PLAY",
        c: "#5BD96A",
        play: true
      } : registered ? {
        t: "CANCEL",
        c: null,
        cancel: true
      } : e.closed ? {
        t: "OBSERVE",
        c: null
      } : live ? {
        t: "LATE REG",
        c: accent,
        cost: e.buyIn
      } : hasReg ? {
        t: "REGISTER",
        c: "#5BD96A",
        cost: e.buyIn
      } : {
        t: "REMIND",
        c: null
      };
      const dm = dayMeta(evOff(e.start));
      const schedTxt = `${dm.top} · ${clock(e.start)}`;
      // 4.5 — late registration prints its own countdown next to the button
      const regNote = e.closed ? {
        t: "REG CLOSED · RUNNING",
        c: "rgba(255,255,255,.45)"
      } : live ? {
        t: /*#__PURE__*/React.createElement(React.Fragment, null, /*#__PURE__*/React.createElement("span", null, "LATE REG"), " \u00B7 ", /*#__PURE__*/React.createElement("span", null, "LEFT"), " " + relLate.txt),
        c: "#f0c75e"
      } : hasReg ? null : {
        t: `REG OPENS ${relReg.txt}`,
        c: "rgba(255,255,255,.5)"
      };
      const artKind = tournArtKey(e);
      const bn = buyNum(e);
      const bounty = ["ko", "pko", "mystery"].includes(artKind) && bn > 0 ? "$" + Math.round(bn * (e.bfrac || 0.5)).toLocaleString("en-US").split(",").join(" ") : null;
      return shell(/*#__PURE__*/React.createElement("div", {
        style: {
          flex: 1,
          minWidth: 0,
          display: "flex",
          flexDirection: "column"
        }
      }, /*#__PURE__*/React.createElement("div", {
        style: {
          position: "relative",
          display: "flex",
          alignItems: "center",
          gap: 10,
          padding: "7px 10px 5px 9px"
        }
      }, e.art ? /*#__PURE__*/React.createElement("div", {
        style: {
          position: "absolute",
          top: 0,
          right: 0,
          bottom: 0,
          width: 116,
          zIndex: 0,
          pointerEvents: "none",
          overflow: "hidden",
          WebkitMaskImage: "linear-gradient(to right, transparent 0%, rgba(0,0,0,.5) 45%, #000 100%)",
          maskImage: "linear-gradient(to right, transparent 0%, rgba(0,0,0,.5) 45%, #000 100%)"
        }
      }, e.artVideo ? /*#__PURE__*/React.createElement("video", {
        src: e.artVideo,
        autoPlay: true,
        loop: true,
        muted: true,
        playsInline: true,
        style: {
          position: "absolute",
          inset: 0,
          width: "100%",
          height: "100%",
          objectFit: "cover"
        }
      }) : e.artAnim === "sakura" ? /*#__PURE__*/React.createElement(SakuraFall, null) : /*#__PURE__*/React.createElement("img", {
        src: e.art,
        alt: "",
        style: {
          position: "absolute",
          inset: 0,
          width: "100%",
          height: "100%",
          objectFit: "contain",
          objectPosition: "right center"
        }
      })) : null, /*#__PURE__*/React.createElement("div", {
        style: {
          position: "relative",
          zIndex: 1,
          flex: "none",
          width: 38,
          height: 38,
          display: "flex",
          alignItems: "center",
          justifyContent: "center"
        }
      }, /*#__PURE__*/React.createElement(TypeArt, {
        e: e,
        size: 36,
        color: cc
      })), /*#__PURE__*/React.createElement("div", {
        style: {
          position: "relative",
          zIndex: 1,
          flex: 1,
          minWidth: 0
        }
      }, /*#__PURE__*/React.createElement("div", {
        style: {
          display: "flex",
          alignItems: "center",
          gap: 6,
          minWidth: 0
        }
      }, registered && /*#__PURE__*/React.createElement("span", {
        style: {
          flex: "none",
          display: "inline-flex",
          alignItems: "center",
          gap: 3,
          height: 16,
          padding: "0 6px",
          borderRadius: 4,
          background: "#5BD96A22",
          border: "1px solid #5BD96A66",
          fontFamily: SANS_E,
          fontWeight: 700,
          fontSize: 9.5,
          letterSpacing: ".1em",
          color: "#5BD96A"
        }
      }, "REGISTERED"), /*#__PURE__*/React.createElement("span", {
        style: {
          fontFamily: MONO_E,
          fontWeight: 700,
          fontSize: 12,
          color: "#fff",
          whiteSpace: "nowrap",
          overflow: "hidden",
          textOverflow: "ellipsis"
        }
      }, e.name)), /*#__PURE__*/React.createElement("div", {
        style: {
          display: "flex",
          alignItems: "center",
          gap: 8,
          marginTop: 3
        }
      }, /*#__PURE__*/React.createElement(Stat, null, /*#__PURE__*/React.createElement("svg", {
        width: "13",
        height: "13",
        viewBox: "0 0 24 24",
        fill: "#fff"
      }, /*#__PURE__*/React.createElement("circle", {
        cx: "12",
        cy: "7.6",
        r: "4.1"
      }), /*#__PURE__*/React.createElement("path", {
        d: "M4.4 20a7.6 7.6 0 0 1 15.2 0z"
      })), hasReg ? live ? /*#__PURE__*/React.createElement("span", null, e.reg.toLocaleString("en-US").split(",").join(" "), /*#__PURE__*/React.createElement("span", {
        style: {
          color: "#8A8A93"
        }
      }, "/", e.cap.toLocaleString("en-US").split(",").join(" "))) : e.reg.toLocaleString("en-US").split(",").join(" ") : "—"))), /*#__PURE__*/React.createElement("div", {
        style: {
          position: "relative",
          zIndex: 1,
          flex: "none",
          display: "flex",
          flexDirection: "column",
          alignItems: "flex-end",
          justifyContent: "center",
          gap: 2
        }
      }, (() => {
        const s = satSeats(e);
        return s ? /*#__PURE__*/React.createElement(SeatBreak, {
          s: s,
          color: cc,
          fs: 15
        }) : /*#__PURE__*/React.createElement("span", {
          style: {
            fontFamily: MONO_E,
            fontWeight: 700,
            fontSize: String(e.gtd).length > 11 ? 13.5 : 16.5,
            color: cc,
            lineHeight: 1
          }
        }, e.gtd);
      })(), /*#__PURE__*/React.createElement("span", {
        style: {
          fontFamily: SANS_E,
          fontWeight: 700,
          fontSize: 10.5,
          letterSpacing: ".14em",
          color: "#A9A9B2"
        }
      }, prizeLabel(e)), /*#__PURE__*/React.createElement("span", {
        style: {
          marginTop: 2,
          display: "inline-flex",
          alignItems: "baseline",
          gap: 4
        }
      }, /*#__PURE__*/React.createElement("span", {
        style: {
          fontFamily: SANS_E,
          fontWeight: 700,
          fontSize: 10.5,
          letterSpacing: ".12em",
          color: "#A9A9B2"
        }
      }, "BUY-IN"), /*#__PURE__*/React.createElement("span", {
        style: {
          fontFamily: MONO_E,
          fontWeight: 700,
          fontSize: 11,
          color: e.buyIn === "FREE" ? "#5BD96A" : "rgba(255,255,255,.85)"
        }
      }, e.buyIn)))), /*#__PURE__*/React.createElement("div", {
        style: {
          position: "relative",
          zIndex: 1,
          display: "flex",
          alignItems: "center",
          gap: 8,
          padding: "0 10px 7px 9px"
        }
      }, /*#__PURE__*/React.createElement("span", {
        style: {
          flex: "none",
          display: "inline-flex",
          alignItems: "center",
          height: 25,
          fontFamily: MONO_E,
          fontWeight: 700,
          fontSize: 10.5,
          letterSpacing: ".05em",
          color: "#D8D8DF",
          whiteSpace: "nowrap"
        }
      }, schedTxt), /*#__PURE__*/React.createElement("span", {
        style: {
          flex: 1
        }
      }), regNote ? /*#__PURE__*/React.createElement("span", {
        style: {
          flex: "none",
          display: "inline-flex",
          alignItems: "center",
          gap: 5,
          fontFamily: MONO_E,
          fontWeight: 700,
          fontSize: 10.5,
          letterSpacing: ".04em",
          color: regNote.c,
          whiteSpace: "nowrap"
        }
      }, live && !e.closed ? /*#__PURE__*/React.createElement("span", {
        style: {
          width: 5,
          height: 5,
          borderRadius: "50%",
          background: accent,
          boxShadow: `0 0 6px ${accent}`,
          flex: "none",
          animation: "pp-pulse 1.4s ease-in-out infinite"
        }
      }) : null, regNote.t) : null, /*#__PURE__*/React.createElement("span", {
        onClick: ev => {
          if (cta.play) return;
          if (!onToggleReg) return;
          ev.stopPropagation();
          if (window.playClick) window.playClick(cta.cancel ? 800 : 1350, .04);
          onToggleReg(e);
        },
        style: {
          flex: "none",
          display: "inline-flex",
          alignItems: "center",
          justifyContent: "center",
          height: 25,
          minWidth: 86,
          padding: "0 10px",
          borderRadius: 125,
          cursor: onToggleReg ? "pointer" : "default",
          background: cta.cancel ? "transparent" : cta.c || "rgba(255,255,255,.09)",
          border: cta.cancel ? "1px solid rgba(255,255,255,.28)" : "1px solid transparent",
          fontFamily: MONO_E,
          fontWeight: 700,
          fontSize: cta.cost ? 9.5 : 10.5,
          letterSpacing: ".06em",
          color: cta.cancel ? "rgba(255,255,255,.75)" : cta.c ? "#fff" : "rgba(255,255,255,.8)",
          whiteSpace: "nowrap"
        }
      }, cta.t, cta.cost ? /*#__PURE__*/React.createElement("span", {
        style: {
          marginLeft: 5,
          opacity: .9
        }
      }, "\xB7 ", cta.cost) : null)), /*#__PURE__*/React.createElement("div", {
        style: {
          position: "relative",
          zIndex: 1,
          display: "flex",
          alignItems: "center",
          gap: 5,
          padding: "4px 10px",
          borderTop: "1px solid rgba(255,255,255,.07)",
          background: "rgba(255,255,255,.02)",
          flexWrap: "nowrap",
          overflow: "hidden"
        }
      }, e.series ? /*#__PURE__*/React.createElement(PngChip, {
        src: e.series
      }) : null, /*#__PURE__*/React.createElement(TxtChip, {
        color: cc,
        bg: `${cc}1c`,
        bd: `${cc}55`
      }, T.label), discWord ? /*#__PURE__*/React.createElement(TxtChip, null, discWord) : null, fmtTags.map(f => /*#__PURE__*/React.createElement(TxtChip, {
        key: f
      }, f)), bounty ? /*#__PURE__*/React.createElement("span", {
        style: {
          marginLeft: "auto",
          flex: "none",
          fontFamily: MONO_E,
          fontWeight: 700,
          fontSize: 10.5,
          color: "#f0c75e",
          whiteSpace: "nowrap"
        }
      }, "BOUNTY ", bounty) : null)), e.glow ? {
        animation: "pp-glow-tile 1.9s ease-in-out infinite",
        borderColor: cc + "66",
        "--gA": cc + "2e",
        "--gB": cc + "c4",
        "--gC": cc + "8a"
      } : undefined);
    }

    // ─ V1 — right perforated stub + vertical edge scale ─
    if (rv === 1) {
      return shell(/*#__PURE__*/React.createElement(React.Fragment, null, /*#__PURE__*/React.createElement("div", {
        style: {
          flex: "none",
          display: "flex",
          alignItems: "center",
          paddingLeft: 11
        }
      }, /*#__PURE__*/React.createElement(Icon, null)), /*#__PURE__*/React.createElement("div", {
        style: {
          position: "relative",
          flex: 1,
          minWidth: 0,
          padding: "11px 12px",
          display: "flex",
          flexDirection: "column",
          gap: 7,
          justifyContent: "center"
        }
      }, /*#__PURE__*/React.createElement(Name, null), /*#__PURE__*/React.createElement(Prize, null), /*#__PURE__*/React.createElement("div", {
        style: {
          display: "flex",
          flexWrap: "wrap",
          gap: 6
        }
      }, /*#__PURE__*/React.createElement(TypeTag, null), /*#__PURE__*/React.createElement(SubTag, null))), /*#__PURE__*/React.createElement("div", {
        style: {
          position: "relative",
          flex: "none",
          width: 94
        }
      }, /*#__PURE__*/React.createElement("span", {
        style: {
          position: "absolute",
          left: -6,
          top: -6,
          width: 12,
          height: 12,
          borderRadius: "50%",
          background: NOTCH
        }
      }), /*#__PURE__*/React.createElement("span", {
        style: {
          position: "absolute",
          left: -6,
          bottom: -6,
          width: 12,
          height: 12,
          borderRadius: "50%",
          background: NOTCH
        }
      }), /*#__PURE__*/React.createElement("div", {
        style: {
          height: "100%",
          borderLeft: "1.5px dashed rgba(255,255,255,.16)",
          background: "rgba(255,255,255,.025)",
          padding: "11px 13px 11px 13px",
          display: "flex",
          flexDirection: "column",
          alignItems: "flex-end",
          justifyContent: "center",
          gap: 6
        }
      }, live ? /*#__PURE__*/React.createElement(LivePill, null) : /*#__PURE__*/React.createElement("span", {
        style: {
          fontFamily: MONO_E,
          fontSize: 12,
          color: "#fff",
          fontVariantNumeric: "tabular-nums",
          whiteSpace: "nowrap"
        }
      }, rel.txt), /*#__PURE__*/React.createElement("span", {
        style: {
          fontFamily: SANS_E,
          fontWeight: 700,
          fontSize: 10.5,
          letterSpacing: ".04em",
          color: "#A9A9B2",
          whiteSpace: "nowrap"
        }
      }, hasReg ? /*#__PURE__*/React.createElement("span", null, /*#__PURE__*/React.createElement("span", {
        style: {
          color: "#fff"
        }
      }, e.reg.toLocaleString("en-US").split(",").join(" ")), " ", live ? "PLAYING" : "REG") : "REG SOON"), /*#__PURE__*/React.createElement("span", {
        style: {
          fontFamily: SANS_E,
          fontWeight: 700,
          fontSize: 10.5,
          color: c,
          letterSpacing: ".08em"
        }
      }, action)), /*#__PURE__*/React.createElement("div", {
        style: {
          position: "absolute",
          top: 11,
          bottom: 11,
          right: 4,
          width: 4,
          borderRadius: 125,
          background: "rgba(255,255,255,.13)",
          overflow: "hidden"
        }
      }, /*#__PURE__*/React.createElement("div", {
        style: {
          position: "absolute",
          left: 0,
          right: 0,
          bottom: 0,
          height: `${fill}%`,
          background: c,
          boxShadow: `0 0 6px ${c}99`,
          borderRadius: 125
        }
      })))));
    }

    // ─ V2 — content + full-width horizontal fill bar at the bottom ─
    if (rv === 2) {
      return shell(/*#__PURE__*/React.createElement("div", {
        style: {
          position: "relative",
          flex: 1,
          minWidth: 0,
          display: "flex",
          flexDirection: "column"
        }
      }, /*#__PURE__*/React.createElement("div", {
        style: {
          display: "flex",
          gap: 12,
          padding: "11px 13px 9px",
          alignItems: "flex-start"
        }
      }, /*#__PURE__*/React.createElement(Icon, null), /*#__PURE__*/React.createElement("div", {
        style: {
          flex: 1,
          minWidth: 0,
          display: "flex",
          flexDirection: "column",
          gap: 6
        }
      }, /*#__PURE__*/React.createElement("div", {
        style: {
          display: "flex",
          alignItems: "flex-start",
          gap: 8
        }
      }, /*#__PURE__*/React.createElement("div", {
        style: {
          flex: 1,
          minWidth: 0
        }
      }, /*#__PURE__*/React.createElement(Name, null)), /*#__PURE__*/React.createElement("span", {
        style: {
          flex: "none",
          marginTop: 1
        }
      }, live ? /*#__PURE__*/React.createElement(LivePill, null) : /*#__PURE__*/React.createElement("span", {
        style: {
          fontFamily: MONO_E,
          fontSize: 12,
          color: "#D8D8DF",
          fontVariantNumeric: "tabular-nums",
          whiteSpace: "nowrap"
        }
      }, rel.txt))), /*#__PURE__*/React.createElement(Prize, null), /*#__PURE__*/React.createElement("div", {
        style: {
          display: "flex",
          flexWrap: "wrap",
          gap: 6
        }
      }, /*#__PURE__*/React.createElement(TypeTag, null), /*#__PURE__*/React.createElement(SubTag, null)))), /*#__PURE__*/React.createElement("div", {
        style: {
          marginTop: "auto",
          padding: "8px 13px 9px",
          borderTop: "1px solid rgba(255,255,255,.07)",
          background: "rgba(255,255,255,.02)"
        }
      }, /*#__PURE__*/React.createElement("div", {
        style: {
          position: "relative",
          height: 5,
          borderRadius: 125,
          background: "rgba(255,255,255,.14)",
          overflow: "hidden"
        }
      }, /*#__PURE__*/React.createElement("div", {
        style: {
          position: "absolute",
          left: 0,
          top: 0,
          bottom: 0,
          width: `${fill}%`,
          background: c,
          boxShadow: `0 0 7px ${c}99`,
          borderRadius: 125
        }
      })), /*#__PURE__*/React.createElement("div", {
        style: {
          display: "flex",
          alignItems: "center",
          justifyContent: "space-between",
          marginTop: 6
        }
      }, /*#__PURE__*/React.createElement("span", {
        style: {
          fontFamily: SANS_E,
          fontWeight: 700,
          fontSize: 10.5,
          letterSpacing: ".06em",
          color: "#A9A9B2"
        }
      }, hasReg ? /*#__PURE__*/React.createElement("span", null, /*#__PURE__*/React.createElement("span", {
        style: {
          color: "#fff"
        }
      }, e.reg.toLocaleString("en-US").split(",").join(" ")), " ", live ? "PLAYING" : "REGISTERED") : "REG OPENS LATER"), /*#__PURE__*/React.createElement("span", {
        style: {
          fontFamily: SANS_E,
          fontWeight: 700,
          fontSize: 10.5,
          color: c,
          letterSpacing: ".08em"
        }
      }, action)))));
    }

    // ─ V3 — right column with a circular fill gauge ─
    if (rv === 3) {
      const R = 17,
        CIRC = 2 * Math.PI * R;
      return shell(/*#__PURE__*/React.createElement(React.Fragment, null, /*#__PURE__*/React.createElement("div", {
        style: {
          flex: "none",
          display: "flex",
          alignItems: "center",
          paddingLeft: 11
        }
      }, /*#__PURE__*/React.createElement(Icon, null)), /*#__PURE__*/React.createElement("div", {
        style: {
          position: "relative",
          flex: 1,
          minWidth: 0,
          padding: "11px 12px",
          display: "flex",
          flexDirection: "column",
          gap: 7,
          justifyContent: "center"
        }
      }, /*#__PURE__*/React.createElement(Name, null), /*#__PURE__*/React.createElement(Prize, null), /*#__PURE__*/React.createElement("div", {
        style: {
          display: "flex",
          flexWrap: "wrap",
          gap: 6
        }
      }, /*#__PURE__*/React.createElement(TypeTag, null), /*#__PURE__*/React.createElement(SubTag, null))), /*#__PURE__*/React.createElement("div", {
        style: {
          position: "relative",
          flex: "none",
          width: 92,
          borderLeft: "1px solid rgba(255,255,255,.13)",
          background: "rgba(255,255,255,.02)",
          display: "flex",
          flexDirection: "column",
          alignItems: "center",
          justifyContent: "center",
          gap: 6,
          padding: "10px 8px"
        }
      }, live ? /*#__PURE__*/React.createElement(LivePill, {
        sm: true
      }) : /*#__PURE__*/React.createElement("span", {
        style: {
          fontFamily: MONO_E,
          fontSize: 11,
          color: "#fff",
          fontVariantNumeric: "tabular-nums",
          whiteSpace: "nowrap"
        }
      }, rel.txt), /*#__PURE__*/React.createElement("div", {
        style: {
          position: "relative",
          width: 44,
          height: 44
        }
      }, /*#__PURE__*/React.createElement("svg", {
        width: "44",
        height: "44",
        style: {
          transform: "rotate(-90deg)"
        }
      }, /*#__PURE__*/React.createElement("circle", {
        cx: "22",
        cy: "22",
        r: R,
        fill: "none",
        stroke: "rgba(255,255,255,.16)",
        strokeWidth: "3.5"
      }), /*#__PURE__*/React.createElement("circle", {
        cx: "22",
        cy: "22",
        r: R,
        fill: "none",
        stroke: c,
        strokeWidth: "3.5",
        strokeLinecap: "round",
        strokeDasharray: CIRC,
        strokeDashoffset: CIRC * (1 - fill / 100),
        style: {
          filter: `drop-shadow(0 0 4px ${c}88)`
        }
      })), /*#__PURE__*/React.createElement("span", {
        style: {
          position: "absolute",
          inset: 0,
          display: "flex",
          flexDirection: "column",
          alignItems: "center",
          justifyContent: "center",
          lineHeight: 1
        }
      }, /*#__PURE__*/React.createElement("span", {
        style: {
          fontFamily: MONO_E,
          fontWeight: 700,
          fontSize: 10.5,
          color: "#fff"
        }
      }, hasReg ? e.reg >= 1000 ? (e.reg / 1000).toFixed(e.reg >= 10000 ? 0 : 1) + "k" : e.reg : "—"), /*#__PURE__*/React.createElement("span", {
        style: {
          fontFamily: SANS_E,
          fontWeight: 700,
          fontSize: 10.5,
          letterSpacing: ".1em",
          color: "#A9A9B2",
          marginTop: 1
        }
      }, live ? "LIVE" : "REG"))), /*#__PURE__*/React.createElement("span", {
        style: {
          fontFamily: SANS_E,
          fontWeight: 700,
          fontSize: 10.5,
          color: c,
          letterSpacing: ".08em"
        }
      }, action))));
    }

    // ─ V4 — dot-matrix capacity in the right column (brand motif) ─
    if (rv === 4) {
      const N = 12,
        filled = Math.max(hasReg ? 1 : 0, Math.round(fill / 100 * N));
      return shell(/*#__PURE__*/React.createElement(React.Fragment, null, /*#__PURE__*/React.createElement("div", {
        style: {
          flex: "none",
          display: "flex",
          alignItems: "center",
          paddingLeft: 11
        }
      }, /*#__PURE__*/React.createElement(Icon, null)), /*#__PURE__*/React.createElement("div", {
        style: {
          position: "relative",
          flex: 1,
          minWidth: 0,
          padding: "11px 12px",
          display: "flex",
          flexDirection: "column",
          gap: 7,
          justifyContent: "center"
        }
      }, /*#__PURE__*/React.createElement(Name, null), /*#__PURE__*/React.createElement(Prize, null), /*#__PURE__*/React.createElement("div", {
        style: {
          display: "flex",
          flexWrap: "wrap",
          gap: 6
        }
      }, /*#__PURE__*/React.createElement(TypeTag, null), /*#__PURE__*/React.createElement(SubTag, null))), /*#__PURE__*/React.createElement("div", {
        style: {
          position: "relative",
          flex: "none",
          width: 100,
          borderLeft: "1px solid rgba(255,255,255,.13)",
          background: "rgba(255,255,255,.02)",
          display: "flex",
          flexDirection: "column",
          alignItems: "flex-end",
          justifyContent: "center",
          gap: 7,
          padding: "11px 12px"
        }
      }, live ? /*#__PURE__*/React.createElement(LivePill, {
        sm: true
      }) : /*#__PURE__*/React.createElement("span", {
        style: {
          fontFamily: MONO_E,
          fontSize: 12,
          color: "#fff",
          fontVariantNumeric: "tabular-nums",
          whiteSpace: "nowrap"
        }
      }, rel.txt), window.DotBar && /*#__PURE__*/React.createElement(window.DotBar, {
        value: filled,
        max: N,
        color: c,
        size: 4,
        gap: 2
      }), /*#__PURE__*/React.createElement("span", {
        style: {
          fontFamily: SANS_E,
          fontWeight: 700,
          fontSize: 10.5,
          letterSpacing: ".04em",
          color: "#A9A9B2",
          whiteSpace: "nowrap"
        }
      }, hasReg ? /*#__PURE__*/React.createElement("span", null, /*#__PURE__*/React.createElement("span", {
        style: {
          color: "#fff"
        }
      }, e.reg.toLocaleString("en-US").split(",").join(" ")), " ", live ? "PLAYING" : "REG") : "REG SOON"), /*#__PURE__*/React.createElement("span", {
        style: {
          fontFamily: SANS_E,
          fontWeight: 700,
          fontSize: 10.5,
          color: c,
          letterSpacing: ".08em"
        }
      }, action))));
    }

    // ─ V5 — reg count as the hero, capacity fraction + dot-matrix footer ─
    if (rv === 5) {
      const N5 = 24,
        filled5 = Math.max(hasReg ? 1 : 0, Math.round(fill / 100 * N5));
      return shell(/*#__PURE__*/React.createElement("div", {
        style: {
          position: "relative",
          flex: 1,
          minWidth: 0,
          display: "flex",
          flexDirection: "column"
        }
      }, /*#__PURE__*/React.createElement("div", {
        style: {
          display: "flex",
          gap: 12,
          padding: "11px 13px 9px",
          alignItems: "flex-start"
        }
      }, /*#__PURE__*/React.createElement(Icon, null), /*#__PURE__*/React.createElement("div", {
        style: {
          flex: 1,
          minWidth: 0,
          display: "flex",
          flexDirection: "column",
          gap: 6
        }
      }, /*#__PURE__*/React.createElement("div", {
        style: {
          display: "flex",
          alignItems: "flex-start",
          gap: 8
        }
      }, /*#__PURE__*/React.createElement("div", {
        style: {
          flex: 1,
          minWidth: 0
        }
      }, /*#__PURE__*/React.createElement(Name, null)), /*#__PURE__*/React.createElement("span", {
        style: {
          flex: "none",
          marginTop: 1,
          textAlign: "right"
        }
      }, live ? /*#__PURE__*/React.createElement(LivePill, null) : /*#__PURE__*/React.createElement("span", {
        style: {
          fontFamily: MONO_E,
          fontSize: 12,
          color: "#D8D8DF",
          fontVariantNumeric: "tabular-nums",
          whiteSpace: "nowrap"
        }
      }, rel.txt))), /*#__PURE__*/React.createElement(Prize, null), /*#__PURE__*/React.createElement("div", {
        style: {
          display: "flex",
          flexWrap: "wrap",
          gap: 6
        }
      }, /*#__PURE__*/React.createElement(TypeTag, null), /*#__PURE__*/React.createElement(SubTag, null)))), /*#__PURE__*/React.createElement("div", {
        style: {
          marginTop: "auto",
          padding: "8px 13px 10px",
          borderTop: "1px solid rgba(255,255,255,.07)",
          background: "rgba(255,255,255,.02)",
          display: "flex",
          alignItems: "center",
          gap: 10
        }
      }, window.DotBar && /*#__PURE__*/React.createElement("span", {
        style: {
          flex: "none"
        }
      }, /*#__PURE__*/React.createElement(window.DotBar, {
        value: filled5,
        max: N5,
        color: c,
        size: 3.5,
        gap: 1.5
      })), /*#__PURE__*/React.createElement("span", {
        style: {
          fontFamily: SANS_E,
          fontWeight: 700,
          fontSize: 10.5,
          letterSpacing: ".04em",
          color: "#A9A9B2",
          whiteSpace: "nowrap"
        }
      }, hasReg ? /*#__PURE__*/React.createElement("span", null, /*#__PURE__*/React.createElement("span", {
        style: {
          color: "#fff",
          fontFamily: MONO_E,
          fontWeight: 700
        }
      }, e.reg.toLocaleString("en-US").split(",").join(" ")), " / ", e.cap.toLocaleString("en-US").split(",").join(" ")) : "REG SOON"), /*#__PURE__*/React.createElement("span", {
        style: {
          marginLeft: "auto",
          fontFamily: SANS_E,
          fontWeight: 700,
          fontSize: 10.5,
          color: c,
          letterSpacing: ".08em",
          flex: "none"
        }
      }, action))));
    }

    // shared player-count fraction (no fill scale) — "540 / 1,000"
    const Frac = ({
      size = 13
    }) => hasReg ? /*#__PURE__*/React.createElement("span", {
      style: {
        fontFamily: MONO_E,
        fontWeight: 700,
        fontSize: size,
        letterSpacing: ".01em",
        fontVariantNumeric: "tabular-nums",
        whiteSpace: "nowrap"
      }
    }, /*#__PURE__*/React.createElement("span", {
      style: {
        color: "#fff"
      }
    }, e.reg.toLocaleString("en-US").split(",").join(" ")), /*#__PURE__*/React.createElement("span", {
      style: {
        color: "#8A8A93"
      }
    }, " / ", e.cap.toLocaleString("en-US").split(",").join(" "))) : /*#__PURE__*/React.createElement("span", {
      style: {
        fontFamily: SANS_E,
        fontWeight: 700,
        fontSize: 10.5,
        letterSpacing: ".06em",
        color: "#A9A9B2"
      }
    }, "REG SOON");
    const Players = ({
      s = 11
    }) => /*#__PURE__*/React.createElement("svg", {
      width: s,
      height: s,
      viewBox: "0 0 24 24",
      fill: "none",
      stroke: "rgba(255,255,255,.55)",
      strokeWidth: "1.9",
      strokeLinecap: "round",
      strokeLinejoin: "round",
      style: {
        flex: "none"
      }
    }, /*#__PURE__*/React.createElement("circle", {
      cx: "9",
      cy: "8",
      r: "3.2"
    }), /*#__PURE__*/React.createElement("path", {
      d: "M3.5 19a5.5 5.5 0 0 1 11 0"
    }), /*#__PURE__*/React.createElement("path", {
      d: "M16 5.2a3.2 3.2 0 0 1 0 5.6M17.5 19a5.5 5.5 0 0 0-3-4.9"
    }));

    // ─ V6 — right column, players icon + fraction (no bar) ─
    if (rv === 6) {
      return shell(/*#__PURE__*/React.createElement(React.Fragment, null, /*#__PURE__*/React.createElement("div", {
        style: {
          flex: "none",
          display: "flex",
          alignItems: "center",
          paddingLeft: 11
        }
      }, /*#__PURE__*/React.createElement(Icon, null)), /*#__PURE__*/React.createElement("div", {
        style: {
          position: "relative",
          flex: 1,
          minWidth: 0,
          padding: "11px 12px",
          display: "flex",
          flexDirection: "column",
          gap: 7,
          justifyContent: "center"
        }
      }, /*#__PURE__*/React.createElement(Name, null), /*#__PURE__*/React.createElement(Prize, null), /*#__PURE__*/React.createElement("div", {
        style: {
          display: "flex",
          flexWrap: "wrap",
          gap: 6
        }
      }, /*#__PURE__*/React.createElement(TypeTag, null), /*#__PURE__*/React.createElement(SubTag, null))), /*#__PURE__*/React.createElement("div", {
        style: {
          position: "relative",
          flex: "none",
          width: 104,
          borderLeft: "1px solid rgba(255,255,255,.13)",
          background: "rgba(255,255,255,.02)",
          display: "flex",
          flexDirection: "column",
          alignItems: "center",
          justifyContent: "center",
          gap: 8,
          padding: "11px 10px"
        }
      }, live ? /*#__PURE__*/React.createElement(LivePill, {
        sm: true
      }) : /*#__PURE__*/React.createElement("span", {
        style: {
          fontFamily: MONO_E,
          fontSize: 12,
          color: "#fff",
          fontVariantNumeric: "tabular-nums",
          whiteSpace: "nowrap"
        }
      }, rel.txt), /*#__PURE__*/React.createElement("span", {
        style: {
          display: "inline-flex",
          alignItems: "center",
          gap: 5
        }
      }, /*#__PURE__*/React.createElement(Players, {
        s: 12
      }), /*#__PURE__*/React.createElement(Frac, {
        size: 13
      })), /*#__PURE__*/React.createElement("span", {
        style: {
          fontFamily: SANS_E,
          fontWeight: 700,
          fontSize: 10.5,
          letterSpacing: ".14em",
          color: "#A9A9B2"
        }
      }, live ? "PLAYING" : "PLAYERS"), /*#__PURE__*/React.createElement("span", {
        style: {
          fontFamily: SANS_E,
          fontWeight: 700,
          fontSize: 10.5,
          color: c,
          letterSpacing: ".08em"
        }
      }, action))));
    }

    // ─ V7 — count inline as a chip in the content, compact (no footer/bar) ─
    if (rv === 7) {
      return shell(/*#__PURE__*/React.createElement(React.Fragment, null, /*#__PURE__*/React.createElement("div", {
        style: {
          flex: "none",
          display: "flex",
          alignItems: "center",
          paddingLeft: 11
        }
      }, /*#__PURE__*/React.createElement(Icon, null)), /*#__PURE__*/React.createElement("div", {
        style: {
          position: "relative",
          flex: 1,
          minWidth: 0,
          padding: "11px 13px",
          display: "flex",
          flexDirection: "column",
          gap: 7,
          justifyContent: "center"
        }
      }, /*#__PURE__*/React.createElement("div", {
        style: {
          display: "flex",
          alignItems: "flex-start",
          gap: 8
        }
      }, /*#__PURE__*/React.createElement("div", {
        style: {
          flex: 1,
          minWidth: 0
        }
      }, /*#__PURE__*/React.createElement(Name, null)), /*#__PURE__*/React.createElement("span", {
        style: {
          flex: "none"
        }
      }, live ? /*#__PURE__*/React.createElement(LivePill, {
        sm: true
      }) : /*#__PURE__*/React.createElement("span", {
        style: {
          fontFamily: MONO_E,
          fontSize: 11,
          color: "#D8D8DF",
          fontVariantNumeric: "tabular-nums",
          whiteSpace: "nowrap"
        }
      }, rel.txt))), /*#__PURE__*/React.createElement(Prize, null), /*#__PURE__*/React.createElement("div", {
        style: {
          display: "flex",
          alignItems: "center",
          flexWrap: "wrap",
          gap: 7
        }
      }, /*#__PURE__*/React.createElement(TypeTag, null), /*#__PURE__*/React.createElement(SubTag, null), /*#__PURE__*/React.createElement("span", {
        style: {
          display: "inline-flex",
          alignItems: "center",
          gap: 5,
          padding: "2px 8px",
          borderRadius: 5,
          background: "rgba(255,255,255,.075)",
          border: "1px solid rgba(255,255,255,.16)"
        }
      }, /*#__PURE__*/React.createElement(Players, {
        s: 10
      }), /*#__PURE__*/React.createElement(Frac, {
        size: 11
      })), /*#__PURE__*/React.createElement("span", {
        style: {
          marginLeft: "auto",
          fontFamily: SANS_E,
          fontWeight: 700,
          fontSize: 10.5,
          color: c,
          letterSpacing: ".08em",
          flex: "none"
        }
      }, action)))));
    }

    // ─ V8 — PRIZE hero on the right; player count is secondary ─
    const plen = String(e.gtd).length;
    const pfs = plen <= 4 ? 22 : plen <= 7 ? 18 : 15;
    return shell(/*#__PURE__*/React.createElement(React.Fragment, null, /*#__PURE__*/React.createElement("div", {
      style: {
        flex: "none",
        display: "flex",
        alignItems: "center",
        paddingLeft: 11
      }
    }, /*#__PURE__*/React.createElement(Icon, null)), /*#__PURE__*/React.createElement("div", {
      style: {
        position: "relative",
        flex: 1,
        minWidth: 0,
        padding: "11px 12px",
        display: "flex",
        flexDirection: "column",
        gap: 7,
        justifyContent: "center"
      }
    }, /*#__PURE__*/React.createElement(Name, null), /*#__PURE__*/React.createElement("div", {
      style: {
        display: "flex",
        alignItems: "center",
        gap: 7,
        flexWrap: "wrap",
        fontFamily: MONO_E,
        fontSize: 10.5,
        color: "#A9A9B2",
        fontVariantNumeric: "tabular-nums"
      }
    }, /*#__PURE__*/React.createElement("span", {
      style: {
        color: e.buyIn === "FREE" ? c : "rgba(255,255,255,.8)",
        fontWeight: e.buyIn === "FREE" ? 700 : 400
      }
    }, e.buyIn), /*#__PURE__*/React.createElement("span", {
      style: {
        color: "#8A8A93"
      }
    }, "\xB7"), /*#__PURE__*/React.createElement("span", {
      style: {
        display: "inline-flex",
        alignItems: "center",
        gap: 4
      }
    }, /*#__PURE__*/React.createElement(Players, {
      s: 10
    }), /*#__PURE__*/React.createElement(Frac, {
      size: 10.5
    }))), /*#__PURE__*/React.createElement("div", {
      style: {
        display: "flex",
        flexWrap: "wrap",
        gap: 6
      }
    }, /*#__PURE__*/React.createElement(TypeTag, null), /*#__PURE__*/React.createElement(SubTag, null))), /*#__PURE__*/React.createElement("div", {
      style: {
        position: "relative",
        flex: "none",
        width: 112,
        borderLeft: "1px solid rgba(255,255,255,.13)",
        background: `linear-gradient(180deg, ${c}10, rgba(255,255,255,.02))`,
        display: "flex",
        flexDirection: "column",
        alignItems: "flex-end",
        justifyContent: "center",
        gap: 4,
        padding: "11px 12px"
      }
    }, live ? /*#__PURE__*/React.createElement(LivePill, {
      sm: true
    }) : /*#__PURE__*/React.createElement("span", {
      style: {
        fontFamily: MONO_E,
        fontSize: 11,
        color: "#fff",
        fontVariantNumeric: "tabular-nums",
        whiteSpace: "nowrap"
      }
    }, rel.txt), /*#__PURE__*/React.createElement("span", {
      style: {
        fontFamily: MONO_E,
        fontWeight: 700,
        fontSize: pfs,
        color: c,
        lineHeight: 1.05,
        whiteSpace: "nowrap",
        textShadow: `0 0 14px ${c}55`,
        marginTop: 2
      }
    }, e.gtd), /*#__PURE__*/React.createElement("span", {
      style: {
        fontFamily: SANS_E,
        fontWeight: 700,
        fontSize: 10.5,
        letterSpacing: ".14em",
        color: "#A9A9B2"
      }
    }, prizeLabel(e)), /*#__PURE__*/React.createElement("span", {
      style: {
        fontFamily: SANS_E,
        fontWeight: 700,
        fontSize: 10.5,
        color: c,
        letterSpacing: ".08em",
        marginTop: 3
      }
    }, action))));
  }
  return /*#__PURE__*/React.createElement("button", {
    onClick: onOpen,
    onMouseDown: ev => {
      ev.currentTarget.style.transform = "scale(.985)";
    },
    onMouseUp: ev => {
      ev.currentTarget.style.transform = "";
    },
    onMouseLeave: ev => {
      ev.currentTarget.style.transform = "";
    },
    style: {
      position: "relative",
      overflow: "hidden",
      textAlign: "left",
      cursor: "pointer",
      width: "100%",
      borderRadius: 14,
      padding: 0,
      border: `1px solid ${live ? c + "66" : "rgba(255,255,255,.1)"}`,
      background: "linear-gradient(160deg, #1f1f27, #0a0a0c)",
      transition: "transform 110ms",
      display: "flex",
      flexDirection: "column"
    }
  }, /*#__PURE__*/React.createElement("div", {
    style: {
      position: "absolute",
      left: 0,
      top: 0,
      bottom: 0,
      width: 3,
      background: c,
      opacity: .9
    }
  }), /*#__PURE__*/React.createElement("div", {
    style: {
      position: "absolute",
      inset: 0,
      background: `radial-gradient(circle at 92% 6%, ${c}26, transparent 52%)`,
      pointerEvents: "none"
    }
  }), /*#__PURE__*/React.createElement("div", {
    style: {
      position: "relative",
      padding: "11px 13px 11px 13px",
      flex: 1,
      display: "flex",
      flexDirection: "column",
      gap: 7
    }
  }, /*#__PURE__*/React.createElement("div", {
    style: {
      position: "absolute",
      top: 12,
      bottom: 12,
      right: 9,
      width: 5,
      borderRadius: 125,
      background: "rgba(255,255,255,.13)",
      overflow: "hidden"
    }
  }, /*#__PURE__*/React.createElement("div", {
    style: {
      position: "absolute",
      left: 0,
      right: 0,
      bottom: 0,
      height: `${fill}%`,
      background: c,
      boxShadow: `0 0 7px ${c}99`,
      borderRadius: 125,
      transition: "height .4s"
    }
  })), /*#__PURE__*/React.createElement("div", {
    style: {
      paddingRight: 12,
      display: "flex",
      flexDirection: "column",
      gap: 7
    }
  }, /*#__PURE__*/React.createElement("div", {
    style: {
      display: "flex",
      alignItems: "center",
      gap: 6
    }
  }, /*#__PURE__*/React.createElement("span", {
    style: {
      display: "inline-flex",
      alignItems: "center",
      gap: 5,
      padding: "3px 7px",
      borderRadius: 5,
      background: `${c}1c`,
      border: `1px solid ${c}55`,
      minWidth: 0
    }
  }, /*#__PURE__*/React.createElement(EvTypeIcon, {
    kind: T.icon,
    size: 11,
    color: c
  }), /*#__PURE__*/React.createElement("span", {
    style: {
      fontFamily: SANS_E,
      fontWeight: 700,
      fontSize: 10.5,
      letterSpacing: ".1em",
      color: c,
      whiteSpace: "nowrap"
    }
  }, T.label)), live ? /*#__PURE__*/React.createElement("span", {
    style: {
      marginLeft: "auto",
      display: "inline-flex",
      alignItems: "center",
      gap: 4,
      padding: "3px 8px",
      borderRadius: 125,
      background: `${c}22`,
      border: `1px solid ${c}`,
      flex: "none"
    }
  }, /*#__PURE__*/React.createElement("span", {
    style: {
      width: 5,
      height: 5,
      borderRadius: "50%",
      background: c,
      boxShadow: `0 0 6px ${c}`,
      animation: "pp-pulse 1.2s ease-in-out infinite"
    }
  }), /*#__PURE__*/React.createElement("span", {
    style: {
      fontFamily: SANS_E,
      fontWeight: 700,
      fontSize: 10.5,
      letterSpacing: ".12em",
      color: "#fff"
    }
  }, "LIVE")) : /*#__PURE__*/React.createElement("span", {
    style: {
      marginLeft: "auto",
      flex: "none",
      fontFamily: MONO_E,
      fontSize: 11,
      color: "#D8D8DF",
      fontVariantNumeric: "tabular-nums",
      whiteSpace: "nowrap"
    }
  }, rel.txt)), /*#__PURE__*/React.createElement("div", {
    style: {
      fontFamily: MONO_E,
      fontSize: 13,
      color: "#fff",
      letterSpacing: ".01em",
      lineHeight: 1.18,
      minHeight: 30,
      display: "-webkit-box",
      WebkitLineClamp: 2,
      WebkitBoxOrient: "vertical",
      overflow: "hidden"
    }
  }, e.name), /*#__PURE__*/React.createElement("div", {
    style: {
      display: "flex",
      alignItems: "baseline",
      gap: 5
    }
  }, (() => {
    const s = satSeats(e);
    return s ? /*#__PURE__*/React.createElement(SeatBreak, {
      s: s,
      color: c,
      fs: 15
    }) : /*#__PURE__*/React.createElement("span", {
      style: {
        fontFamily: MONO_E,
        fontWeight: 700,
        fontSize: String(e.gtd).length > 11 ? 15 : 19,
        color: c,
        lineHeight: 1
      }
    }, e.gtd);
  })(), /*#__PURE__*/React.createElement("span", {
    style: {
      fontFamily: SANS_E,
      fontWeight: 700,
      fontSize: 10.5,
      color: "#A9A9B2",
      letterSpacing: ".12em"
    }
  }, prizeLabel(e))), /*#__PURE__*/React.createElement("div", {
    style: {
      display: "flex",
      alignItems: "center",
      gap: 7,
      fontFamily: MONO_E,
      fontSize: 10.5,
      color: "#D8D8DF",
      fontVariantNumeric: "tabular-nums"
    }
  }, /*#__PURE__*/React.createElement("span", {
    style: {
      color: e.buyIn === "FREE" ? c : "#fff",
      fontWeight: 700
    }
  }, e.buyIn === "FREE" ? "FREE" : e.buyIn), /*#__PURE__*/React.createElement("span", {
    style: {
      color: "#8A8A93"
    }
  }, "\xB7"), /*#__PURE__*/React.createElement("span", null, clock(e.start))), /*#__PURE__*/React.createElement("div", {
    style: {
      fontFamily: SANS_E,
      fontWeight: 700,
      fontSize: 10.5,
      letterSpacing: ".06em",
      color: "#A9A9B2"
    }
  }, hasReg ? /*#__PURE__*/React.createElement("span", null, /*#__PURE__*/React.createElement("span", {
    style: {
      color: "#fff"
    }
  }, e.reg.toLocaleString("en-US").split(",").join(" ")), " ", live ? "PLAYING" : "REGISTERED") : "REG OPENS LATER"))), /*#__PURE__*/React.createElement("div", {
    style: {
      position: "relative",
      marginTop: "auto"
    }
  }, /*#__PURE__*/React.createElement("span", {
    style: {
      position: "absolute",
      left: -6,
      top: -6,
      width: 12,
      height: 12,
      borderRadius: "50%",
      background: NOTCH
    }
  }), /*#__PURE__*/React.createElement("span", {
    style: {
      position: "absolute",
      right: -6,
      top: -6,
      width: 12,
      height: 12,
      borderRadius: "50%",
      background: NOTCH
    }
  }), /*#__PURE__*/React.createElement("div", {
    style: {
      borderTop: "1.5px dashed rgba(255,255,255,.16)",
      display: "flex",
      alignItems: "center",
      gap: 8,
      padding: "9px 13px",
      background: "rgba(255,255,255,.025)"
    }
  }, isSat ? /*#__PURE__*/React.createElement("span", {
    style: {
      minWidth: 0,
      display: "flex",
      alignItems: "center",
      gap: 5,
      overflow: "hidden"
    }
  }, /*#__PURE__*/React.createElement("svg", {
    width: "11",
    height: "11",
    viewBox: "0 0 24 24",
    fill: "none",
    stroke: c,
    strokeWidth: "2.4",
    strokeLinecap: "round",
    strokeLinejoin: "round",
    style: {
      flex: "none"
    }
  }, /*#__PURE__*/React.createElement("path", {
    d: "M5 12h14M13 6l6 6-6 6"
  })), /*#__PURE__*/React.createElement("span", {
    style: {
      fontFamily: SANS_E,
      fontWeight: 700,
      fontSize: 10.5,
      letterSpacing: ".06em",
      color: "#A9A9B2",
      whiteSpace: "nowrap",
      overflow: "hidden",
      textOverflow: "ellipsis"
    }
  }, e.feeds || "SEAT")) : fmt ? /*#__PURE__*/React.createElement("span", {
    style: {
      fontFamily: SANS_E,
      fontWeight: 700,
      fontSize: 10.5,
      letterSpacing: ".1em",
      color: "#A9A9B2",
      padding: "2px 6px",
      borderRadius: 4,
      background: "rgba(255,255,255,.085)",
      border: "1px solid rgba(255,255,255,.16)",
      whiteSpace: "nowrap"
    }
  }, fmt) : /*#__PURE__*/React.createElement("span", null), /*#__PURE__*/React.createElement("span", {
    style: {
      marginLeft: "auto",
      flex: "none",
      fontFamily: SANS_E,
      fontWeight: 700,
      fontSize: 10.5,
      color: c,
      letterSpacing: ".08em"
    }
  }, live ? "OBSERVE ›" : hasReg ? "JOIN ›" : "REMIND ›"))));
}
Object.assign(window, {
  EventsScreen,
  EventRow,
  TypeArt,
  SeatBreak,
  satSeats,
  satellitesFor,
  ladderFor,
  evTier,
  EVENTS,
  EV_TYPES,
  EV_STATES,
  evType,
  evState,
  useRel,
  useCD,
  clock: clock,
  dayMeta,
  buyNum,
  tournArtKey,
  evOff,
  prizeLabel
});