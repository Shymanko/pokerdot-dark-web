function _extends() { return _extends = Object.assign ? Object.assign.bind() : function (n) { for (var e = 1; e < arguments.length; e++) { var t = arguments[e]; for (var r in t) ({}).hasOwnProperty.call(t, r) && (n[r] = t[r]); } return n; }, _extends.apply(null, arguments); }
// Competitions v2 — GG-style GENERAL leaderboards instead of one board per
// discipline × limit (the Club-GG scheme confused players):
//   1 · GRAND LEADERBOARD  season (quarter) · all cash games · one pool
//   2 · DAILY LEADERBOARD  resets 00:00 · all cash games · one pool
//   3 · MTT LEADERBOARD    weekly · all tournaments · one pool
// One page per board: the TOTAL prize pool is the headline, participants are
// FILTERED by limit tier inside. Prizes pay out per tier (pool shares).
// Friend Royale (referrals) stays a standalone board inside the referral hub.

const MONO_CP = UI.font;
const SANS_CP = UI.fontUI;
const cpNum = n => n.toLocaleString("en-US").split(",").join(" ");
const cpInk = c => {
  const h = String(c || "").replace("#", "");
  if (h.length !== 6) return "#fff";
  const v = [0, 2, 4].map(i => parseInt(h.slice(i, i + 2), 16) / 255).map(x => x <= 0.03928 ? x / 12.92 : Math.pow((x + 0.055) / 1.055, 2.4));
  return 0.2126 * v[0] + 0.7152 * v[1] + 0.0722 * v[2] > 0.22 ? "#08080A" : "#fff";
};
const cpKzt = n => "C$" + cpNum(n);
const cpField = b => Object.keys(b.field || {}).reduce((s, k) => s + (b.field[k] || 0), 0);

// ── chrome racing flags — unchanged brand emblem ───────────────────────────
function RaceFlags({
  size = 44,
  style = {}
}) {
  const u = "rf" + (RaceFlags.n = (RaceFlags.n || 0) + 1);
  const flag = "M0,1.5 C8,-2 15.5,4.6 23,1 L23,20 C15.5,23.6 8,17 0,20.5 Z";
  const G = id => "url(#" + u + id + ")";
  const Flag = ({
    x,
    y,
    rot,
    mirror,
    clip
  }) => /*#__PURE__*/React.createElement("g", {
    transform: "translate(" + x + " " + y + ") rotate(" + rot + ")"
  }, /*#__PURE__*/React.createElement("rect", {
    x: "-1.7",
    y: "-2",
    width: "3.4",
    height: "54",
    rx: "1.7",
    fill: G("pole")
  }), /*#__PURE__*/React.createElement("g", {
    transform: mirror ? "scale(-1 1)" : undefined
  }, /*#__PURE__*/React.createElement("g", {
    clipPath: "url(#" + u + clip + ")"
  }, /*#__PURE__*/React.createElement("path", {
    d: flag,
    fill: G("chk")
  }), /*#__PURE__*/React.createElement("path", {
    d: flag,
    fill: G("fold")
  }), /*#__PURE__*/React.createElement("path", {
    d: flag,
    fill: G("steel"),
    opacity: ".26"
  })), /*#__PURE__*/React.createElement("path", {
    d: flag,
    fill: "none",
    stroke: "#f2f5f8",
    strokeOpacity: ".5",
    strokeWidth: "1"
  })));
  return /*#__PURE__*/React.createElement("svg", {
    width: size,
    height: size,
    viewBox: "0 0 64 64",
    style: {
      display: "block",
      ...style
    }
  }, /*#__PURE__*/React.createElement("defs", null, /*#__PURE__*/React.createElement("linearGradient", {
    id: u + "steel",
    x1: "0",
    y1: "0",
    x2: "1",
    y2: "1"
  }, /*#__PURE__*/React.createElement("stop", {
    offset: "0",
    stopColor: "#f4f6f9"
  }), /*#__PURE__*/React.createElement("stop", {
    offset: ".28",
    stopColor: "#b9bfc8"
  }), /*#__PURE__*/React.createElement("stop", {
    offset: ".46",
    stopColor: "#6f757e"
  }), /*#__PURE__*/React.createElement("stop", {
    offset: ".62",
    stopColor: "#d6dbe2"
  }), /*#__PURE__*/React.createElement("stop", {
    offset: ".82",
    stopColor: "#7c828b"
  }), /*#__PURE__*/React.createElement("stop", {
    offset: "1",
    stopColor: "#c9ced6"
  })), /*#__PURE__*/React.createElement("linearGradient", {
    id: u + "pole",
    x1: "0",
    y1: "0",
    x2: "1",
    y2: "0"
  }, /*#__PURE__*/React.createElement("stop", {
    offset: "0",
    stopColor: "#5c626b"
  }), /*#__PURE__*/React.createElement("stop", {
    offset: ".3",
    stopColor: "#eef1f5"
  }), /*#__PURE__*/React.createElement("stop", {
    offset: ".55",
    stopColor: "#9aa1aa"
  }), /*#__PURE__*/React.createElement("stop", {
    offset: "1",
    stopColor: "#43484f"
  })), /*#__PURE__*/React.createElement("linearGradient", {
    id: u + "fold",
    x1: "0",
    y1: "0",
    x2: "1",
    y2: "0"
  }, /*#__PURE__*/React.createElement("stop", {
    offset: "0",
    stopColor: "#000",
    stopOpacity: ".42"
  }), /*#__PURE__*/React.createElement("stop", {
    offset: ".18",
    stopColor: "#fff",
    stopOpacity: ".34"
  }), /*#__PURE__*/React.createElement("stop", {
    offset: ".38",
    stopColor: "#000",
    stopOpacity: ".38"
  }), /*#__PURE__*/React.createElement("stop", {
    offset: ".58",
    stopColor: "#fff",
    stopOpacity: ".3"
  }), /*#__PURE__*/React.createElement("stop", {
    offset: ".78",
    stopColor: "#000",
    stopOpacity: ".4"
  }), /*#__PURE__*/React.createElement("stop", {
    offset: "1",
    stopColor: "#fff",
    stopOpacity: ".22"
  })), /*#__PURE__*/React.createElement("pattern", {
    id: u + "chk",
    width: "7",
    height: "7",
    patternUnits: "userSpaceOnUse"
  }, /*#__PURE__*/React.createElement("rect", {
    width: "7",
    height: "7",
    fill: "#20232a"
  }), /*#__PURE__*/React.createElement("rect", {
    width: "3.5",
    height: "3.5",
    fill: "#e6eaf0"
  }), /*#__PURE__*/React.createElement("rect", {
    x: "3.5",
    y: "3.5",
    width: "3.5",
    height: "3.5",
    fill: "#e6eaf0"
  })), /*#__PURE__*/React.createElement("clipPath", {
    id: u + "cA"
  }, /*#__PURE__*/React.createElement("path", {
    d: flag
  })), /*#__PURE__*/React.createElement("clipPath", {
    id: u + "cB"
  }, /*#__PURE__*/React.createElement("path", {
    d: flag
  }))), /*#__PURE__*/React.createElement(Flag, {
    x: 40,
    y: 8,
    rot: 26,
    clip: "cB"
  }), /*#__PURE__*/React.createElement(Flag, {
    x: 24,
    y: 8,
    rot: -26,
    mirror: true,
    clip: "cA"
  }), /*#__PURE__*/React.createElement("rect", {
    x: "26.4",
    y: "23.2",
    width: "11.2",
    height: "4.4",
    rx: "2.2",
    fill: G("pole")
  }));
}
function PtsBoard({
  pts,
  h = 26
}) {
  if (window.LockCounter) return /*#__PURE__*/React.createElement(window.LockCounter, {
    text: cpNum(pts),
    h: h,
    fs: Math.round(h * 0.66)
  });
  return /*#__PURE__*/React.createElement("span", {
    style: {
      fontFamily: MONO_CP,
      fontWeight: 700,
      fontSize: h * 0.62,
      color: "#fff"
    }
  }, cpNum(pts));
}

// ── limit tiers — the ONE filtering axis inside a board ────────────────────
// cash tiers by blinds, MTT tiers by buy-in. Prize pool splits across tiers so
// micro players never race the high rollers for the same money.
// п.14 (фінальне ревʼю 08.09): ліміти йдуть від дорогих до дешевих
const CASH_TIERS = [{
  id: "HIGH",
  lim: "$50/$100 +",
  share: 0.30
}, {
  id: "MID",
  lim: "$10/$20 – $25/$50",
  share: 0.30
}, {
  id: "LOW",
  lim: "$2/$5 – $5/$10",
  share: 0.25
}, {
  id: "MICRO",
  lim: "$0.50/$1 – $1/$2",
  share: 0.15
}];
const CP_DISC_COLOR = {
  "HOLD'EM": "#21C97B",
  "PLO": "#3B82F6",
  "PLO5": "#1FC8C8",
  "PLO6": "#8B7BF7",
  "SHORT DECK": "#F0A93C",
  "FREEZEOUT": "#21C97B",
  "PKO": "#3B82F6",
  "SATELLITES": "#F0A93C"
};
const CASH_DISCS = ["HOLD'EM", "PLO", "PLO5", "PLO6", "SHORT DECK"];
const MTT_DISCS = ["FREEZEOUT", "PKO", "SATELLITES"];
// display names — the ids stay stable for colours and presets
const CP_DISC_LABEL = {
  "SHORT DECK": "6+"
};
const cpDiscLabel = d => CP_DISC_LABEL[d] || d;
const MTT_TIERS = [{
  id: "HIGH",
  lim: "BUY-IN $200 +",
  share: 0.30
}, {
  id: "MID",
  lim: "BUY-IN $50 – $200",
  share: 0.30
}, {
  id: "LOW",
  lim: "BUY-IN $10 – $50",
  share: 0.25
}, {
  id: "MICRO",
  lim: "BUY-IN ≤ $10",
  share: 0.15
}];

// ── the three general boards (+ the referral board for the referral hub) ───
// you = the tier the player actually plays in + their standing there.
const BOARDS = [{
  id: "grand",
  name: "GRAND LEADERBOARD",
  sub: "ALL CASH GAMES · ONE SEASON POOL",
  color: "#D71921",
  cycle: "SEASON",
  scoring: "stake",
  pool: 500000000,
  ends: "38D 04:12",
  grand: true,
  art: "assets/comp/tourn-cup-crown.png",
  shown: 500,
  paid: 200,
  need: 2000,
  needUnit: "HANDS",
  // п.13 (фінальне ревʼю 08.09): гранд — один залік на всі дисципліни,
  // розбивка тільки за лімітами, тому пілзів дисциплін тут немає
  tiers: CASH_TIERS,
  discs: null,
  field: {
    MICRO: 21400,
    LOW: 9800,
    MID: 3400,
    HIGH: 640
  },
  you: {
    tier: "MID",
    rank: 1207,
    pts: 18450
  }
}, {
  id: "daily",
  name: "DAILY LEADERBOARD",
  sub: "ALL CASH GAMES · RESETS 00:00",
  color: "#21C97B",
  cycle: "DAILY",
  scoring: "stake",
  pool: 12000000,
  ends: "04:12:38",
  art: "assets/comp-daily-v3.png",
  shown: 200,
  paid: 50,
  need: 200,
  needUnit: "HANDS",
  tiers: CASH_TIERS,
  discs: CASH_DISCS,
  field: {
    MICRO: 8210,
    LOW: 3140,
    MID: 980,
    HIGH: 210
  },
  you: {
    tier: "MICRO",
    rank: 62,
    pts: 9610
  }
}, {
  id: "mtt",
  name: "MTT LEADERBOARD",
  sub: "ALL TOURNAMENTS · ENTRIES + ITM",
  color: "#f0c75e",
  cycle: "WEEKLY",
  scoring: "mtt",
  pool: 90000000,
  ends: "3D 04:12",
  art: "assets/comp-mtt-v3.png",
  shown: 300,
  paid: 100,
  need: 3,
  needUnit: "EVENTS",
  field: {
    MICRO: 6400,
    LOW: 4210,
    MID: 1480,
    HIGH: 320
  },
  you: {
    rank: 471,
    pts: 15600
  }
},
// referral board — lives in the referral hub, not in the main list
{
  id: "royale",
  name: "FRIEND ROYALE",
  sub: "REFERRALS · INVITE AND CLIMB",
  color: "#8E5CFF",
  cycle: "MONTHLY",
  scoring: "referral",
  pool: 40000000,
  ends: "18D 04:12",
  social: true,
  art: "assets/comp-friends.png",
  shown: 200,
  paid: 100,
  need: 3,
  needUnit: "FRIENDS",
  tiers: null,
  field: {
    ALL: 4210
  },
  you: {
    tier: "ALL",
    rank: 118,
    pts: 940
  }
}];
// map a table's stake / discipline onto the board axes, so opening the board
// from a HOLD'EM $5/$10 table lands on HOLD'EM · LOW instead of ALL · ALL
const CP_TIER_BB = [["MICRO", 0, 2], ["LOW", 2, 10], ["MID", 10, 50], ["HIGH", 50, 1e9]];
window.cpTierForStake = stake => {
  const m = String(stake || "").match(/([\d.]+)\s*\/\s*\$?([\d.]+)/);
  const bb = m ? parseFloat(m[2]) : NaN;
  if (!isFinite(bb)) return "ALL";
  const hit = CP_TIER_BB.find(([, lo, hi]) => bb > lo && bb <= hi);
  return hit ? hit[0] : "ALL";
};
window.cpDiscForTable = d => {
  const x = String(d || "").toUpperCase();
  if (/SHORT/.test(x)) return "SHORT DECK";
  if (/PLO\s*6|6\s*CARD/.test(x)) return "PLO6";
  if (/PLO\s*5|5\s*CARD/.test(x)) return "PLO5";
  if (/PLO|OMAHA/.test(x)) return "PLO";
  if (/HOLD/.test(x)) return "HOLD'EM";
  return "ALL";
};
const boardField = b => Object.values(b.field).reduce((s, n) => s + n, 0);
const tierOf = (b, id) => (b.tiers || []).find(t => t.id === id) || null;
const tierPool = (b, id) => {
  const t = tierOf(b, id);
  return t ? Math.round(b.pool * t.share) : b.pool;
};
// paid places scale with the tier's share of the pool
const tierPaid = (b, id) => {
  const t = tierOf(b, id);
  return t ? Math.max(20, Math.round(b.paid * t.share * 2)) : b.paid;
};
const SCORING_NOTE = {
  stake: "ACTIVITY × STAKE COEFFICIENT",
  mtt: "ENTRIES + ITM FINISHES",
  referral: "QUALIFIED REFERRED PLAYERS"
};
const CYC_MS = {
  DAILY: 864e5,
  WEEKLY: 7 * 864e5,
  MONTHLY: 30 * 864e5,
  SEASON: 90 * 864e5
};
const CP_MON = ["JAN", "FEB", "MAR", "APR", "MAY", "JUN", "JUL", "AUG", "SEP", "OCT", "NOV", "DEC"];
const cpLeft = s => {
  if (!s) return 0;
  const d = /(\d+)\s*D/i.exec(s);
  const t = /(\d{1,2}):(\d{2})(?::(\d{2}))?/.exec(s) || [];
  return (d ? +d[1] * 864e5 : 0) + (+t[1] || 0) * 36e5 + (+t[2] || 0) * 6e4 + (+t[3] || 0) * 1e3;
};
const cpStamp = ms => {
  const x = new Date(ms),
    p = n => String(n).padStart(2, "0");
  return x.getDate() + " " + CP_MON[x.getMonth()] + " " + p(x.getHours()) + ":" + p(x.getMinutes());
};
const cpWin = b => {
  const now = Date.now(),
    len = CYC_MS[b.cycle] || CYC_MS.WEEKLY;
  const start = now + cpLeft(b.ends) - len;
  return [cpStamp(start), cpStamp(start + len)];
};

// ── prizes — computed on the TIER pool, so 1st in MICRO ≠ 1st in HIGH ──────
const CP_AV = ["drebin", "sponge", "yanu", "girl"];
const cpAvatar = name => {
  let h = 0;
  for (let i = 0; i < name.length; i++) h = h * 31 + name.charCodeAt(i) & 0xffff;
  const key = CP_AV[h % CP_AV.length];
  return (window.CHAT_AV || {})[key] || "assets/chat/" + key + ".webp";
};
const CP_CUT = [0.18, 0.11, 0.075];
const TIX_STEP = [100000000, 50000000, 25000000, 10000000, 5000000, 2500000, 1000000, 500000, 250000, 100000, 50000, 25000, 10000];
const ticketFor = (pool, i) => {
  const worth = pool * CP_CUT[0];
  let top = TIX_STEP.findIndex(s => s <= worth);
  if (top < 0) top = TIX_STEP.length - 1;
  return "TICKET " + cpKzt(TIX_STEP[Math.min(TIX_STEP.length - 1, top + i)]);
};
const seatSpend = pool => CP_CUT.reduce((sum, k, i) => {
  const worth = pool * CP_CUT[0];
  let top = TIX_STEP.findIndex(s => s <= worth);
  if (top < 0) top = TIX_STEP.length - 1;
  return sum + TIX_STEP[Math.min(TIX_STEP.length - 1, top + i)];
}, 0);
const prizeAt = (pool, paid, rank) => {
  if (!rank || rank > paid) return null;
  if (rank <= 3) return {
    ticket: ticketFor(pool, rank - 1)
  };
  const rest = Math.max(0, pool - seatSpend(pool));
  const bands = [[4, 10, 0.34], [11, 50, 0.36], [51, paid, 0.3]];
  for (const [a, b0, k] of bands) {
    const b = Math.min(b0, paid);
    if (rank >= a && rank <= b) return {
      cash: cpKzt(Math.max(1000, Math.round(rest * k / (b - a + 1) / 1000) * 1000))
    };
  }
  return null;
};
const prizeTable = (pool, paid) => {
  const rows = CP_CUT.map((k, i) => ({
    place: String(i + 1),
    ticket: ticketFor(pool, i)
  }));
  const rest = Math.max(0, pool - seatSpend(pool));
  const bands = [[4, 10, 0.34], [11, 50, 0.36], [51, paid, 0.3]];
  bands.forEach(([a, b0, k]) => {
    const b = Math.min(b0, paid);
    if (b < a) return;
    const each = Math.max(1000, Math.round(rest * k / (b - a + 1) / 1000) * 1000);
    rows.push({
      place: a === b ? String(a) : a + "–" + b,
      cash: cpKzt(each)
    });
  });
  return rows;
};

// deterministic standings — seeded by board + tier so every filter view is stable
const CP_NAMES = ["AceHunter", "bluffKing", "rivr_rat", "MingTilt", "donk_99", "TheNit", "calling_stn", "gtoWizard", "shovemonkey", "felt_lord", "checkraise", "snapcall", "tightAgro", "limpKing", "coolerz"];
function boardRows(b, tier, disc, day) {
  let seed = 0;
  const key = b.id + ":" + tier + ":" + (disc || "ALL") + ":" + (day || 0);
  for (let i = 0; i < key.length; i++) seed = seed * 31 + key.charCodeAt(i) & 0xffff;
  const mineTier = b.you && b.you.tier === tier;
  const allView = tier === "ALL";
  const base = b.you && b.you.pts || 8000;
  const top = [];
  for (let i = 1; i <= 5; i++) {
    top.push({
      rank: i,
      name: CP_NAMES[(seed + i * 3) % CP_NAMES.length],
      pts: Math.round(base * (3.4 - i * 0.36) * (1 + (seed >> 3) % 7 / 40)),
      tier: allView ? b.tiers ? b.tiers[(seed + i) % b.tiers.length].id : "ALL" : tier
    });
  }
  const around = [];
  const rank0 = allView ? Math.round((b.you && b.you.rank || 0) * 1.8) : mineTier ? b.you.rank : 0;
  if (b.you && (allView || mineTier) && rank0) {
    for (let d = -2; d <= 2; d++) {
      const rank = rank0 + d;
      if (rank < 1) continue;
      around.push({
        rank,
        name: d === 0 ? "SASHA02" : CP_NAMES[(rank * 7 + seed) % CP_NAMES.length],
        pts: b.you.pts - d * 46,
        you: d === 0,
        tier: allView ? b.you.tier : tier
      });
    }
  }
  return {
    top,
    around
  };
}
function CpChip({
  children,
  tone,
  accent
}) {
  const c = tone === "hot" ? accent : tone === "gold" ? "#f0c75e" : null;
  return /*#__PURE__*/React.createElement("span", {
    style: {
      flex: "none",
      padding: "3px 7px",
      borderRadius: 6,
      background: c ? c + "1f" : "rgba(255,255,255,.06)",
      border: `1px solid ${c ? c + "66" : "rgba(255,255,255,.1)"}`,
      fontFamily: SANS_CP,
      fontWeight: 700,
      fontSize: 10.5,
      letterSpacing: ".12em",
      color: c || "rgba(255,255,255,.62)",
      whiteSpace: "nowrap"
    }
  }, children);
}
function CpGlyph({
  kind,
  color = "currentColor",
  size = 12
}) {
  const p = {
    width: size,
    height: size,
    viewBox: "0 0 24 24",
    fill: "none",
    stroke: color,
    strokeWidth: 2,
    strokeLinecap: "square",
    strokeLinejoin: "miter",
    style: {
      flex: "none",
      display: "block"
    }
  };
  switch (kind) {
    case "pool":
      return /*#__PURE__*/React.createElement("svg", p, /*#__PURE__*/React.createElement("rect", {
        x: "3",
        y: "7",
        width: "18",
        height: "11"
      }), /*#__PURE__*/React.createElement("path", {
        d: "M3 11h18M8 15h3"
      }));
    case "limit":
      return /*#__PURE__*/React.createElement("svg", p, /*#__PURE__*/React.createElement("path", {
        d: "M4 20V9M10 20V5M16 20v-8M22 20h-20"
      }));
    case "start":
      return /*#__PURE__*/React.createElement("svg", p, /*#__PURE__*/React.createElement("rect", {
        x: "3",
        y: "5",
        width: "18",
        height: "16"
      }), /*#__PURE__*/React.createElement("path", {
        d: "M3 10h18M8 3v4M16 3v4"
      }));
    case "end":
      return /*#__PURE__*/React.createElement("svg", p, /*#__PURE__*/React.createElement("rect", {
        x: "3",
        y: "5",
        width: "18",
        height: "16"
      }), /*#__PURE__*/React.createElement("path", {
        d: "M3 10h18M8 3v4M16 3v4M9 15l2 2 4-4"
      }));
    case "clock":
      return /*#__PURE__*/React.createElement("svg", _extends({}, p, {
        strokeLinecap: "round"
      }), /*#__PURE__*/React.createElement("circle", {
        cx: "12",
        cy: "12",
        r: "9"
      }), /*#__PURE__*/React.createElement("path", {
        d: "M12 7v5l3.5 2"
      }));
    case "field":
      return /*#__PURE__*/React.createElement("svg", p, /*#__PURE__*/React.createElement("circle", {
        cx: "9",
        cy: "8",
        r: "3.4"
      }), /*#__PURE__*/React.createElement("path", {
        d: "M3 20c0-3.4 2.7-5.6 6-5.6s6 2.2 6 5.6"
      }), /*#__PURE__*/React.createElement("path", {
        d: "M16 9.4a3.4 3.4 0 1 0-2.4-5.8M15.4 14.6c3 .3 5.6 2.3 5.6 5.4"
      }));
  }
  return null;
}

// ── Activities entry — unchanged shell, new copy ───────────────────────────
function CompetitionsWidget({
  accent = "#D71921",
  onOpen,
  style = {}
}) {
  const joined = BOARDS.filter(b => !b.social && b.you);
  const best = joined.reduce((x, b) => !x || b.you.rank < x.you.rank ? b : x, null);
  return /*#__PURE__*/React.createElement("button", {
    onClick: () => {
      if (window.playClick) window.playClick(1100, 0.04);
      onOpen && onOpen();
    },
    style: {
      position: "relative",
      overflow: "hidden",
      width: "100%",
      textAlign: "left",
      cursor: "pointer",
      borderRadius: 16,
      padding: 15,
      ...style,
      background: `linear-gradient(152deg, ${accent}1f 0%, #0c0c0f 62%, #0a0a0c 100%)`,
      border: `1px solid ${accent}3d`,
      boxShadow: "0 12px 30px rgba(0,0,0,.5)"
    }
  }, /*#__PURE__*/React.createElement("span", {
    style: {
      position: "absolute",
      inset: 0,
      pointerEvents: "none",
      background: `radial-gradient(ellipse 70% 90% at 100% 0%, ${accent}26, transparent 62%)`
    }
  }), /*#__PURE__*/React.createElement("span", {
    style: {
      position: "absolute",
      inset: 0,
      pointerEvents: "none",
      backgroundImage: "radial-gradient(circle, rgba(255,255,255,.055) .8px, transparent 1.2px)",
      backgroundSize: "13px 13px",
      maskImage: "linear-gradient(150deg, black, transparent 74%)",
      WebkitMaskImage: "linear-gradient(150deg, black, transparent 74%)"
    }
  }), /*#__PURE__*/React.createElement("div", {
    style: {
      position: "relative",
      display: "flex",
      alignItems: "center",
      gap: 12
    }
  }, /*#__PURE__*/React.createElement("span", {
    style: {
      flex: "none",
      width: 72,
      height: 72,
      marginLeft: -4,
      display: "flex",
      alignItems: "center",
      justifyContent: "center"
    }
  }, /*#__PURE__*/React.createElement(RaceFlags, {
    size: 76,
    style: {
      filter: "drop-shadow(0 8px 16px rgba(0,0,0,.6))"
    }
  })), /*#__PURE__*/React.createElement("div", {
    style: {
      flex: 1,
      minWidth: 0
    }
  }, /*#__PURE__*/React.createElement("div", {
    style: {
      fontFamily: MONO_CP,
      fontSize: 15,
      color: "#fff",
      letterSpacing: ".06em"
    }
  }, "COMPETITIONS"), /*#__PURE__*/React.createElement("div", {
    style: {
      fontFamily: SANS_CP,
      fontWeight: 600,
      fontSize: 10.5,
      color: "#A9A9B2",
      letterSpacing: ".02em",
      marginTop: 3
    }
  }, "GRAND \xB7 DAILY \xB7 MTT \xB7 best #", best ? cpNum(best.you.rank) : "—", " ", best ? "in " + best.name.split(" ")[0] : "")), /*#__PURE__*/React.createElement("svg", {
    width: "16",
    height: "16",
    viewBox: "0 0 24 24",
    fill: "none",
    stroke: "rgba(255,255,255,.45)",
    strokeWidth: "2.4",
    strokeLinecap: "round",
    strokeLinejoin: "round",
    style: {
      flex: "none"
    }
  }, /*#__PURE__*/React.createElement("path", {
    d: "M9 6l6 6-6 6"
  }))));
}

// ── lobby widget — the boards you stand on, best first ─────────────────────
function BestBoardWidget({
  accent = "#D71921",
  onOpen,
  style = {}
}) {
  const joined = BOARDS.filter(b => !b.social && b.you).sort((x, y) => x.you.rank - y.you.rank);
  const [i, setI] = React.useState(0);
  const railRef = React.useRef(null);
  if (!joined.length) return null;
  const onScroll = () => {
    const el = railRef.current;
    if (!el) return;
    const n = Math.round(el.scrollLeft / el.clientWidth);
    if (n !== i) setI(Math.max(0, Math.min(joined.length - 1, n)));
  };
  const Card = ({
    b
  }) => {
    const c = b.color;
    const t = tierOf(b, b.you.tier);
    const {
      around
    } = boardRows(b, b.you.tier);
    const rows = around.length ? around.slice(1, 4) : [];
    const mine = prizeAt(tierPool(b, b.you.tier), tierPaid(b, b.you.tier), b.you.rank);
    const topP = prizeAt(tierPool(b, b.you.tier), tierPaid(b, b.you.tier), 1);
    const shown = mine || topP;
    const isTix = !!(shown && shown.ticket);
    const shownTxt = shown ? isTix ? shown.ticket.replace(/^TICKET\s*/, "") : shown.cash : "\u2014";
    return /*#__PURE__*/React.createElement("button", {
      onClick: () => {
        if (window.playClick) window.playClick(1150, 0.04);
        onOpen && onOpen(b.id);
      },
      style: {
        position: "relative",
        overflow: "hidden",
        flex: "none",
        width: "100%",
        boxSizing: "border-box",
        scrollSnapAlign: "center",
        textAlign: "left",
        cursor: "pointer",
        padding: 0,
        borderRadius: 16,
        border: `1px solid ${c}3d`,
        background: `linear-gradient(152deg, ${c}1f 0%, #0c0c0f 62%, #0a0a0c 100%)`,
        boxShadow: "0 12px 30px rgba(0,0,0,.5)"
      }
    }, /*#__PURE__*/React.createElement("div", {
      style: {
        position: "absolute",
        inset: 0,
        pointerEvents: "none",
        background: `radial-gradient(ellipse 70% 90% at 100% 0%, ${c}26, transparent 62%)`
      }
    }), /*#__PURE__*/React.createElement("div", {
      style: {
        position: "absolute",
        inset: 0,
        pointerEvents: "none",
        backgroundImage: "radial-gradient(circle, rgba(255,255,255,.055) .8px, transparent 1.2px)",
        backgroundSize: "13px 13px",
        maskImage: "linear-gradient(150deg, black, transparent 72%)",
        WebkitMaskImage: "linear-gradient(150deg, black, transparent 72%)"
      }
    }), /*#__PURE__*/React.createElement("div", {
      style: {
        position: "relative",
        padding: "14px 15px 0"
      }
    }, /*#__PURE__*/React.createElement("span", {
      style: {
        display: "flex",
        alignItems: "center",
        gap: 6,
        height: 15
      }
    }, /*#__PURE__*/React.createElement("span", {
      style: {
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
        boxShadow: `0 0 6px ${c}`
      }
    }), /*#__PURE__*/React.createElement("span", {
      style: {
        fontFamily: SANS_CP,
        fontWeight: 700,
        fontSize: 10.5,
        letterSpacing: ".12em",
        color: "#fff"
      }
    }, "LIVE")), /*#__PURE__*/React.createElement("span", {
      style: {
        fontFamily: SANS_CP,
        fontWeight: 700,
        fontSize: 10.5,
        letterSpacing: ".14em",
        color: c,
        whiteSpace: "nowrap"
      }
    }, b.name), /*#__PURE__*/React.createElement("span", {
      style: {
        fontFamily: SANS_CP,
        fontWeight: 700,
        fontSize: 10.5,
        letterSpacing: ".14em",
        color: "#8A8A93",
        whiteSpace: "nowrap",
        overflow: "hidden",
        textOverflow: "ellipsis"
      }
    }, "\xB7 ", b.you.tier, t ? " · " + t.lim : "")), /*#__PURE__*/React.createElement("span", {
      style: {
        display: "flex",
        gap: 9,
        marginTop: 11
      }
    }, /*#__PURE__*/React.createElement("span", {
      style: {
        flex: "1 1 auto",
        minWidth: "max-content",
        borderRadius: 12,
        padding: "11px 12px 12px",
        background: "rgba(0,0,0,.34)",
        border: "1px solid rgba(255,255,255,.09)"
      }
    }, /*#__PURE__*/React.createElement("span", {
      style: {
        display: "flex",
        alignItems: "center",
        gap: 6,
        color: "#A9A9B2"
      }
    }, /*#__PURE__*/React.createElement(CpGlyph, {
      kind: "pool",
      size: 11
    }), /*#__PURE__*/React.createElement("span", {
      style: {
        fontFamily: SANS_CP,
        fontWeight: 700,
        fontSize: 10.5,
        letterSpacing: ".14em"
      }
    }, "TOTAL PRIZE POOL")), /*#__PURE__*/React.createElement("span", {
      style: {
        display: "block",
        marginTop: 7,
        fontFamily: MONO_CP,
        fontWeight: 700,
        fontSize: 20,
        color: "#fff",
        lineHeight: 1,
        whiteSpace: "nowrap"
      }
    }, cpKzt(b.pool))), /*#__PURE__*/React.createElement("span", {
      style: {
        flex: "0 1 auto",
        minWidth: 0,
        display: "flex",
        alignItems: "center",
        gap: 9,
        borderRadius: 12,
        padding: "11px 12px",
        background: `${c}1f`,
        border: `1px solid ${c}73`
      }
    }, /*#__PURE__*/React.createElement("span", {
      "aria-hidden": "true",
      style: {
        flex: "none",
        width: 38,
        height: 38,
        backgroundImage: "url(assets/gifts/silver.png)",
        backgroundSize: "contain",
        backgroundPosition: "center",
        backgroundRepeat: "no-repeat"
      }
    }), /*#__PURE__*/React.createElement("span", {
      style: {
        display: "flex",
        flexDirection: "column",
        gap: 2
      }
    }, /*#__PURE__*/React.createElement("span", {
      style: {
        fontFamily: SANS_CP,
        fontWeight: 700,
        fontSize: 10.5,
        letterSpacing: ".12em",
        color: c,
        whiteSpace: "nowrap"
      }
    }, mine ? "IN LINE FOR" : "TOP PRIZE"), /*#__PURE__*/React.createElement("span", {
      style: {
        fontFamily: MONO_CP,
        fontWeight: 700,
        fontSize: 14,
        color: "#fff",
        lineHeight: 1.05,
        whiteSpace: "nowrap"
      }
    }, shownTxt), isTix ? /*#__PURE__*/React.createElement("span", {
      style: {
        fontFamily: SANS_CP,
        fontWeight: 700,
        fontSize: 10.5,
        letterSpacing: ".12em",
        color: "#A9A9B2"
      }
    }, "TICKET") : null)))), /*#__PURE__*/React.createElement("div", {
      style: {
        height: 12
      }
    }), /*#__PURE__*/React.createElement("div", {
      style: {
        position: "relative",
        display: "flex",
        flexDirection: "column",
        gap: 4,
        padding: "0 15px"
      }
    }, rows.map(row => /*#__PURE__*/React.createElement("div", {
      key: row.rank,
      style: {
        display: "flex",
        alignItems: "center",
        gap: 9,
        padding: "6px 9px",
        borderRadius: 8,
        background: row.you ? c + "26" : "rgba(255,255,255,.05)",
        border: `1px solid ${row.you ? c : "rgba(255,255,255,.07)"}`
      }
    }, /*#__PURE__*/React.createElement("span", {
      style: {
        flex: "none",
        minWidth: 26,
        fontFamily: MONO_CP,
        fontWeight: 700,
        fontSize: 11,
        color: row.you ? "#fff" : "rgba(255,255,255,.55)",
        fontVariantNumeric: "tabular-nums"
      }
    }, row.rank), /*#__PURE__*/React.createElement("span", {
      style: {
        flex: 1,
        minWidth: 0,
        fontFamily: SANS_CP,
        fontWeight: row.you ? 800 : 600,
        fontSize: 11,
        color: row.you ? "#fff" : "rgba(255,255,255,.62)",
        whiteSpace: "nowrap",
        overflow: "hidden",
        textOverflow: "ellipsis"
      }
    }, row.name), /*#__PURE__*/React.createElement("span", {
      style: {
        flex: "none",
        fontFamily: MONO_CP,
        fontWeight: 700,
        fontSize: 11,
        color: row.you ? "#fff" : "rgba(255,255,255,.5)",
        fontVariantNumeric: "tabular-nums"
      }
    }, cpNum(row.pts))))), /*#__PURE__*/React.createElement("div", {
      style: {
        position: "relative",
        marginTop: 12,
        padding: "10px 15px 12px",
        borderTop: "1px solid rgba(255,255,255,.09)",
        background: "rgba(0,0,0,.3)",
        display: "flex",
        alignItems: "center",
        gap: 9
      }
    }, /*#__PURE__*/React.createElement("span", {
      style: {
        fontFamily: SANS_CP,
        fontWeight: 700,
        fontSize: 10.5,
        letterSpacing: ".12em",
        color: "#A9A9B2"
      }
    }, "YOU \xB7 ", b.you.tier), /*#__PURE__*/React.createElement("span", {
      style: {
        fontFamily: MONO_CP,
        fontWeight: 700,
        fontSize: 14,
        color: "#fff",
        fontVariantNumeric: "tabular-nums"
      }
    }, "#", cpNum(b.you.rank), /*#__PURE__*/React.createElement("span", {
      style: {
        fontSize: 11,
        color: "#8A8A93"
      }
    }, "/", cpNum(b.field[b.you.tier] || boardField(b)))), /*#__PURE__*/React.createElement("span", {
      style: {
        width: 1,
        height: 13,
        background: "rgba(255,255,255,.14)"
      }
    }), /*#__PURE__*/React.createElement("span", {
      style: {
        fontFamily: MONO_CP,
        fontWeight: 700,
        fontSize: 12,
        color: "#D8D8DF",
        fontVariantNumeric: "tabular-nums"
      }
    }, cpNum(b.you.pts), " PTS"), /*#__PURE__*/React.createElement("span", {
      style: {
        flex: 1
      }
    }), /*#__PURE__*/React.createElement("span", {
      style: {
        display: "flex",
        alignItems: "center",
        gap: 5,
        color: "#D8D8DF"
      }
    }, /*#__PURE__*/React.createElement(CpGlyph, {
      kind: "end",
      size: 11,
      color: c
    }), /*#__PURE__*/React.createElement("span", {
      style: {
        fontFamily: MONO_CP,
        fontWeight: 700,
        fontSize: 11,
        whiteSpace: "nowrap"
      }
    }, cpWin(b)[1]))));
  };
  return /*#__PURE__*/React.createElement("div", {
    style: {
      margin: "20px 0 0",
      ...style
    }
  }, /*#__PURE__*/React.createElement("div", {
    ref: railRef,
    onScroll: onScroll,
    style: {
      display: "flex",
      gap: 10,
      padding: "0 14px",
      overflowX: "auto",
      overflowY: "hidden",
      scrollSnapType: "x mandatory",
      scrollbarWidth: "none",
      msOverflowStyle: "none",
      WebkitOverflowScrolling: "touch"
    }
  }, joined.map(b => /*#__PURE__*/React.createElement("div", {
    key: b.id,
    style: {
      flex: "none",
      width: "100%",
      scrollSnapAlign: "center",
      display: "flex"
    }
  }, /*#__PURE__*/React.createElement(Card, {
    b: b
  })))), joined.length > 1 && /*#__PURE__*/React.createElement("div", {
    style: {
      display: "flex",
      justifyContent: "center",
      gap: 5,
      marginTop: 9
    }
  }, joined.map((b, k) => /*#__PURE__*/React.createElement("span", {
    key: b.id,
    style: {
      width: k === i ? 16 : 5,
      height: 5,
      borderRadius: 3,
      background: k === i ? joined[k].color : "rgba(255,255,255,.22)",
      transition: "width 180ms, background 180ms"
    }
  }))));
}

// ── day pager — tappable, opens a month calendar ───────────────────────────
const CP_WD = ["SUNDAY", "MONDAY", "TUESDAY", "WEDNESDAY", "THURSDAY", "FRIDAY", "SATURDAY"];
const cpDayLabel = day => {
  const d = new Date(Date.now() + day * 864e5);
  return day === 0 ? "TODAY" : day === -1 ? "YESTERDAY" : CP_WD[d.getDay()];
};
function CpCalendar({
  day,
  setDay,
  accent,
  onClose
}) {
  const today = new Date();
  const [mOff, setMOff] = React.useState(0);
  const view = new Date(today.getFullYear(), today.getMonth() + mOff, 1);
  const first = (view.getDay() + 6) % 7; // monday-first grid
  const days = new Date(view.getFullYear(), view.getMonth() + 1, 0).getDate();
  const dayOffsetOf = n => Math.round((new Date(view.getFullYear(), view.getMonth(), n) - new Date(today.getFullYear(), today.getMonth(), today.getDate())) / 864e5);
  const cells = [];
  for (let i = 0; i < first; i++) cells.push(null);
  for (let n = 1; n <= days; n++) cells.push(n);
  return /*#__PURE__*/React.createElement("div", {
    onClick: onClose,
    style: {
      position: "absolute",
      inset: 0,
      zIndex: 40,
      background: "rgba(0,0,0,.72)",
      backdropFilter: "blur(5px)",
      WebkitBackdropFilter: "blur(5px)",
      display: "flex",
      alignItems: "center",
      justifyContent: "center",
      padding: "0 18px"
    }
  }, /*#__PURE__*/React.createElement("div", {
    onClick: e => e.stopPropagation(),
    style: {
      width: "100%",
      maxWidth: 330,
      borderRadius: 20,
      border: `1px solid ${accent}66`,
      background: "linear-gradient(160deg,#111116,#0a0a0c)",
      boxShadow: "0 26px 60px rgba(0,0,0,.75)",
      padding: "16px 16px 18px"
    }
  }, /*#__PURE__*/React.createElement("div", {
    style: {
      display: "flex",
      alignItems: "center",
      gap: 10
    }
  }, /*#__PURE__*/React.createElement("button", {
    onClick: () => setMOff(mOff - 1),
    style: {
      flex: "none",
      width: 34,
      height: 34,
      borderRadius: 12,
      background: "rgba(255,255,255,.06)",
      border: "1px solid rgba(255,255,255,.14)",
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
    strokeLinecap: "round",
    strokeLinejoin: "round"
  }, /*#__PURE__*/React.createElement("path", {
    d: "M15 6l-6 6 6 6"
  }))), /*#__PURE__*/React.createElement("span", {
    style: {
      flex: 1,
      textAlign: "center",
      fontFamily: MONO_CP,
      fontWeight: 700,
      fontSize: 13,
      letterSpacing: ".18em",
      color: "#fff"
    }
  }, CP_MON[view.getMonth()], " ", view.getFullYear()), /*#__PURE__*/React.createElement("button", {
    disabled: mOff >= 0,
    onClick: () => setMOff(Math.min(0, mOff + 1)),
    style: {
      flex: "none",
      width: 34,
      height: 34,
      borderRadius: 12,
      background: "rgba(255,255,255,.06)",
      border: "1px solid rgba(255,255,255,.14)",
      cursor: mOff >= 0 ? "default" : "pointer",
      opacity: mOff >= 0 ? .35 : 1,
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
    strokeLinecap: "round",
    strokeLinejoin: "round"
  }, /*#__PURE__*/React.createElement("path", {
    d: "M9 6l6 6-6 6"
  })))), /*#__PURE__*/React.createElement("div", {
    style: {
      display: "grid",
      gridTemplateColumns: "repeat(7, 1fr)",
      gap: 4,
      marginTop: 14
    }
  }, ["M", "T", "W", "T", "F", "S", "S"].map((w, i) => /*#__PURE__*/React.createElement("span", {
    key: i,
    style: {
      textAlign: "center",
      fontFamily: SANS_CP,
      fontWeight: 700,
      fontSize: 10.5,
      letterSpacing: ".1em",
      color: "#8A8A93",
      paddingBottom: 4
    }
  }, w)), cells.map((n, i) => {
    if (n === null) return /*#__PURE__*/React.createElement("span", {
      key: "e" + i
    });
    const off = dayOffsetOf(n);
    const future = off > 0,
      on = off === day;
    return /*#__PURE__*/React.createElement("button", {
      key: n,
      disabled: future,
      onClick: () => {
        if (window.playClick) window.playClick(1100, .03);
        setDay(off);
        onClose();
      },
      style: {
        height: 38,
        borderRadius: 12,
        cursor: future ? "default" : "pointer",
        padding: 0,
        background: on ? accent : "rgba(255,255,255,.05)",
        border: `1px solid ${on ? accent : "rgba(255,255,255,.09)"}`,
        fontFamily: MONO_CP,
        fontWeight: 700,
        fontSize: 12,
        color: future ? "rgba(255,255,255,.22)" : on ? cpInk(accent) : "#fff",
        fontVariantNumeric: "tabular-nums"
      }
    }, n);
  })), /*#__PURE__*/React.createElement("button", {
    onClick: () => {
      setDay(0);
      onClose();
    },
    style: {
      width: "100%",
      marginTop: 14,
      padding: "12px 0",
      borderRadius: 125,
      cursor: "pointer",
      background: "rgba(255,255,255,.05)",
      border: "1px solid rgba(255,255,255,.14)",
      color: "#D8D8DF",
      fontFamily: MONO_CP,
      fontWeight: 700,
      fontSize: 12,
      letterSpacing: ".16em"
    }
  }, "JUMP TO TODAY")));
}
function CpDayBar({
  day,
  setDay,
  accent,
  onPick
}) {
  const d = new Date(Date.now() + day * 864e5);
  const sub = CP_WD[d.getDay()].slice(0, 3) + " · " + CP_MON[d.getMonth()] + " " + d.getDate() + (day === 0 ? " · LIVE" : " · FINAL");
  const Btn = ({
    dir,
    dis
  }) => /*#__PURE__*/React.createElement("button", {
    disabled: dis,
    onClick: () => {
      if (window.playClick) window.playClick(1000, .03);
      setDay(day + dir);
    },
    style: {
      flex: "none",
      width: 46,
      height: 54,
      borderRadius: 14,
      background: "rgba(255,255,255,.06)",
      border: "1px solid rgba(255,255,255,.12)",
      display: "flex",
      alignItems: "center",
      justifyContent: "center",
      cursor: dis ? "default" : "pointer",
      opacity: dis ? .35 : 1,
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
    d: dir < 0 ? "M15 6l-6 6 6 6" : "M9 6l6 6-6 6"
  })));
  return /*#__PURE__*/React.createElement("div", {
    style: {
      display: "flex",
      gap: 9,
      marginTop: 12
    }
  }, /*#__PURE__*/React.createElement(Btn, {
    dir: -1,
    dis: false
  }), /*#__PURE__*/React.createElement("button", {
    onClick: () => {
      if (window.playClick) window.playClick(1150, .04);
      onPick();
    },
    style: {
      flex: 1,
      minWidth: 0,
      height: 54,
      borderRadius: 14,
      cursor: "pointer",
      padding: 0,
      background: "rgba(255,255,255,.045)",
      border: "1px solid rgba(255,255,255,.12)",
      display: "flex",
      flexDirection: "column",
      alignItems: "center",
      justifyContent: "center",
      gap: 3
    }
  }, /*#__PURE__*/React.createElement("span", {
    style: {
      display: "flex",
      alignItems: "center",
      justifyContent: "center",
      gap: 6,
      fontFamily: MONO_CP,
      fontWeight: 700,
      fontSize: 13,
      letterSpacing: ".18em",
      color: "#fff"
    }
  }, cpDayLabel(day), /*#__PURE__*/React.createElement(CpGlyph, {
    kind: "start",
    size: 12,
    color: accent
  })), /*#__PURE__*/React.createElement("span", {
    style: {
      fontFamily: SANS_CP,
      fontWeight: 700,
      fontSize: 10.5,
      letterSpacing: ".16em",
      color: "#A9A9B2"
    }
  }, sub)), /*#__PURE__*/React.createElement(Btn, {
    dir: 1,
    dis: day >= 0
  }));
}

// deterministic full standings for one view (board × tier × discipline × day)
function cpViewRows(b, tier, disc, day) {
  let seed = 0;
  const key = b.id + ":" + tier + ":" + disc + ":" + day;
  for (let i = 0; i < key.length; i++) seed = seed * 31 + key.charCodeAt(i) & 0xffff;
  const base = (b.you && b.you.pts || 8000) * (1 + (seed >> 4) % 9 / 30);
  const name = r => CP_NAMES[(seed + r * 7) % CP_NAMES.length];
  const pts = r => Math.max(60, Math.round(base * 3.2 / Math.pow(r, 0.42) - r * 3));
  return {
    name,
    pts,
    seed
  };
}

// prize cell — the reward drawn, not just written
function CpPrize({
  won,
  accent,
  you
}) {
  if (!won) return null;
  const tix = !!won.ticket;
  return /*#__PURE__*/React.createElement("span", {
    style: {
      flex: "none",
      display: "inline-flex",
      alignItems: "center",
      gap: 6
    }
  }, /*#__PURE__*/React.createElement("img", {
    src: tix ? "assets/rewards/ticket.png" : "assets/rewards/cash.png",
    alt: "",
    style: {
      width: 22,
      height: 22,
      objectFit: "contain",
      flex: "none"
    }
  }), /*#__PURE__*/React.createElement("span", {
    style: {
      fontFamily: MONO_CP,
      fontWeight: 700,
      fontSize: 11,
      color: tix ? "#f0c75e" : you ? "#fff" : "rgba(255,255,255,.82)",
      whiteSpace: "nowrap",
      fontVariantNumeric: "tabular-nums"
    }
  }, tix ? won.ticket.replace(/^TICKET\s*/, "") : won.cash));
}

// ── in-app push — leaderboard prize notice ────────────────────────────────
function CpPush({
  data,
  onClose,
  onOpen
}) {
  const [up, setUp] = React.useState(false);
  React.useEffect(() => {
    if (!data) {
      setUp(false);
      return;
    }
    const r = requestAnimationFrame(() => setUp(true));
    const t = setTimeout(() => {
      setUp(false);
      setTimeout(onClose, 220);
    }, 6000);
    return () => {
      cancelAnimationFrame(r);
      clearTimeout(t);
    };
  }, [data]);
  if (!data) return null;
  const c = data.color;
  return (
    /*#__PURE__*/
    // сповіщення стоїть ПІД шапкою екрана: на top:46 воно накривало заголовок
    React.createElement("div", {
      style: {
        position: "absolute",
        top: 104,
        left: 12,
        right: 12,
        zIndex: 90,
        pointerEvents: up ? "auto" : "none"
      }
    }, /*#__PURE__*/React.createElement("button", {
      onClick: () => {
        if (window.playClick) window.playClick(1200, .04);
        onOpen && onOpen();
      },
      style: {
        width: "100%",
        boxSizing: "border-box",
        textAlign: "left",
        cursor: "pointer",
        padding: "12px 13px",
        borderRadius: 20,
        border: `1px solid ${c}80`,
        background: "linear-gradient(150deg, rgba(24,24,29,.98), rgba(10,10,12,.98))",
        boxShadow: `0 18px 42px rgba(0,0,0,.7), inset 0 1px 0 ${c}33`,
        display: "flex",
        alignItems: "center",
        gap: 11,
        transform: up ? "translateY(0) scale(1)" : "translateY(-16px) scale(.97)",
        opacity: up ? 1 : 0,
        transition: "transform 240ms cubic-bezier(.2,.8,.2,1), opacity 200ms",
        backdropFilter: "blur(10px)",
        WebkitBackdropFilter: "blur(10px)"
      }
    }, /*#__PURE__*/React.createElement("span", {
      style: {
        position: "relative",
        flex: "none",
        width: 42,
        height: 42,
        borderRadius: 12,
        background: `${c}22`,
        border: `1px solid ${c}66`,
        display: "flex",
        alignItems: "center",
        justifyContent: "center"
      }
    }, /*#__PURE__*/React.createElement("img", {
      src: data.tix ? "assets/rewards/ticket.png" : "assets/rewards/cash.png",
      alt: "",
      style: {
        width: 30,
        height: 30,
        objectFit: "contain"
      }
    }), /*#__PURE__*/React.createElement("span", {
      style: {
        position: "absolute",
        top: -3,
        right: -3,
        width: 9,
        height: 9,
        borderRadius: "50%",
        background: c,
        boxShadow: `0 0 8px ${c}`
      }
    })), /*#__PURE__*/React.createElement("span", {
      style: {
        flex: 1,
        minWidth: 0,
        display: "flex",
        flexDirection: "column",
        gap: 3
      }
    }, /*#__PURE__*/React.createElement("span", {
      style: {
        display: "flex",
        alignItems: "center",
        gap: 7
      }
    }, /*#__PURE__*/React.createElement("span", {
      style: {
        fontFamily: SANS_CP,
        fontWeight: 700,
        fontSize: 9.5,
        letterSpacing: ".18em",
        color: c,
        whiteSpace: "nowrap"
      }
    }, "PRIZE POSITION"), /*#__PURE__*/React.createElement("span", {
      style: {
        fontFamily: SANS_CP,
        fontWeight: 700,
        fontSize: 9.5,
        letterSpacing: ".12em",
        color: "#8A8A93",
        whiteSpace: "nowrap",
        overflow: "hidden",
        textOverflow: "ellipsis"
      }
    }, data.board)), /*#__PURE__*/React.createElement("span", {
      style: {
        fontFamily: MONO_CP,
        fontWeight: 700,
        fontSize: 13,
        color: "#fff",
        lineHeight: 1.25
      }
    }, "#", cpNum(data.rank), " \xB7 in line for ", data.prize), /*#__PURE__*/React.createElement("span", {
      style: {
        fontFamily: SANS_CP,
        fontWeight: 600,
        fontSize: 10.5,
        color: "#A9A9B2"
      }
    }, data.note)), /*#__PURE__*/React.createElement("svg", {
      width: "15",
      height: "15",
      viewBox: "0 0 24 24",
      fill: "none",
      stroke: "rgba(255,255,255,.4)",
      strokeWidth: "2.4",
      strokeLinecap: "round",
      strokeLinejoin: "round",
      style: {
        flex: "none"
      }
    }, /*#__PURE__*/React.createElement("path", {
      d: "M9 6l6 6-6 6"
    }))))
  );
}

// ── board detail — total pool → day pager → discipline pills + limit filter →
//    pinned TOP-10 with prizes → the list, opened at YOUR position ──────────
function BoardDetail({
  b,
  accent,
  onBack,
  embedded,
  preset,
  nested = false,
  topInset = 0
}) {
  const [day, setDay] = React.useState(0);
  const [disc, setDisc] = React.useState(preset && b.discs && b.discs.indexOf(preset.disc) >= 0 ? preset.disc : b.discs ? b.discs[0] : "ALL");
  // за замовчуванням — загальний залік; ліміт гравець вибирає сам
  const [tier, setTier] = React.useState(preset && b.tiers && b.tiers.some(t => t.id === preset.tier) ? preset.tier : "ALL");
  const [dd, setDd] = React.useState(false);
  const [cal, setCal] = React.useState(false);
  // повноекранний під-екран — ховаємо верхню смугу активних столів
  React.useEffect(() => {
    if (embedded) return;
    window.dispatchEvent(new CustomEvent("px-full", {
      detail: 1
    }));
    return () => window.dispatchEvent(new CustomEvent("px-full", {
      detail: -1
    }));
  }, [embedded]);
  const listRef = React.useRef(null);
  const hasTiers = !!b.tiers,
    hasDiscs = !!b.discs;
  const inTier = hasTiers && tier !== "ALL";
  const pool = inTier ? tierPool(b, tier) : b.pool;
  const paid = inTier ? tierPaid(b, tier) : b.paid;
  const field = inTier ? b.field[tier] || 0 : boardField(b);
  const youRank = b.you ? inTier ? b.you.rank : Math.round(b.you.rank * 1.8) : 0;
  const V = cpViewRows(b, tier, disc, day);
  const youPrize = youRank ? prizeAt(pool, paid, youRank) : null;
  const topN = Math.min(20, Math.max(10, Math.round(paid / 10) * 10));
  const dcOf = d => d === "ALL" ? b.color : CP_DISC_COLOR[d] || b.color;
  // the list under the top-10: a window around the player, auto-scrolled to them
  const listFrom = topN + 1;
  const list = [];
  let last = 10;
  const win = youRank > 0 ? [Math.max(listFrom, youRank - 8), youRank + 8] : [listFrom, listFrom + 15];
  for (let r = listFrom; r <= listFrom + 11; r++) {
    list.push(r);
    last = r;
  }
  if (win[0] > last + 1) list.push(null); // gap divider
  for (let r = Math.max(win[0], last + 1); r <= win[1]; r++) list.push(r);
  React.useEffect(() => {
    const el = listRef.current;
    if (!el) return;
    const fit = () => {
      const y = el.querySelector('[data-you="1"]');
      if (!y) return;
      const yr = y.getBoundingClientRect(),
        er = el.getBoundingClientRect();
      el.scrollTop = Math.max(0, el.scrollTop + (yr.top - er.top) - el.clientHeight / 2 + yr.height / 2);
    };
    fit();
    const r = requestAnimationFrame(fit);
    return () => cancelAnimationFrame(r);
  }, [tier, disc, day]);
  const label = extra => ({
    fontFamily: MONO_CP,
    fontWeight: 700,
    fontSize: 10.5,
    letterSpacing: ".2em",
    color: "#A9A9B2",
    margin: "18px 2px 9px",
    ...extra
  });
  const Row = ({
    rank,
    pinned
  }) => {
    const you = rank === youRank;
    const won = prizeAt(pool, paid, rank);
    return /*#__PURE__*/React.createElement("div", {
      "data-you": you ? "1" : "0",
      style: {
        display: "flex",
        alignItems: "center",
        gap: 7,
        padding: "10px 12px",
        background: you ? `${accent}26` : rank % 2 ? "rgba(255,255,255,.03)" : "transparent",
        borderLeft: `3px solid ${you ? accent : "transparent"}`
      }
    }, /*#__PURE__*/React.createElement("span", {
      style: {
        flex: "none",
        minWidth: 34,
        textAlign: "right",
        fontFamily: MONO_CP,
        fontWeight: 700,
        fontSize: 12,
        fontVariantNumeric: "tabular-nums",
        color: rank <= 3 ? accent : "rgba(255,255,255,.55)"
      }
    }, cpNum(rank)), /*#__PURE__*/React.createElement(window.FramedAvatar, {
      src: cpAvatar(you ? "SASHA02" : V.name(rank)),
      size: 26,
      player: !!you
    }), /*#__PURE__*/React.createElement("div", {
      style: {
        flex: 1,
        minWidth: 0
      }
    }, /*#__PURE__*/React.createElement("div", {
      style: {
        fontFamily: SANS_CP,
        fontWeight: you ? 800 : 700,
        fontSize: 13,
        lineHeight: 1.1,
        color: you ? "#fff" : "rgba(255,255,255,.85)",
        whiteSpace: "nowrap",
        overflow: "hidden",
        textOverflow: "ellipsis"
      }
    }, you ? "SASHA02" : V.name(rank), you && /*#__PURE__*/React.createElement("span", {
      style: {
        fontFamily: SANS_CP,
        fontWeight: 700,
        fontSize: 10.5,
        letterSpacing: ".14em",
        color: accent,
        marginLeft: 8
      }
    }, "YOU")), /*#__PURE__*/React.createElement("div", {
      style: {
        fontFamily: MONO_CP,
        fontWeight: 700,
        fontSize: 10.5,
        lineHeight: 1.1,
        color: "#A9A9B2",
        marginTop: 3,
        fontVariantNumeric: "tabular-nums"
      }
    }, cpNum(you && b.you ? b.you.pts : V.pts(rank)), " PTS")), /*#__PURE__*/React.createElement(CpPrize, {
      won: won,
      accent: accent,
      you: you
    }));
  };
  return /*#__PURE__*/React.createElement(React.Fragment, null, embedded ? null : /*#__PURE__*/React.createElement("div", {
    className: "pd-screen-header",
    style: {
      position: "relative",
      zIndex: 5,
      padding: (nested ? topInset + 14 + "px" : "62px") + " 16px 8px 14px",
      display: "flex",
      alignItems: "center",
      gap: 8
    }
  }, /*#__PURE__*/React.createElement("button", {
    "aria-label": "\u041D\u0430\u0437\u0430\u0434",
    onClick: () => {
      if (window.playClick) window.playClick(800, 0.04);
      onBack();
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
  }))), /*#__PURE__*/React.createElement("span", {
    style: {
      flex: 1,
      minWidth: 0,
      display: "flex",
      flexDirection: "column",
      alignItems: "center",
      gap: 3
    }
  }, /*#__PURE__*/React.createElement("span", {
    style: {
      display: "inline-flex",
      alignItems: "center",
      gap: 7,
      minWidth: 0,
      maxWidth: "100%"
    }
  }, /*#__PURE__*/React.createElement("span", {
    style: {
      maxWidth: "100%",
      fontFamily: MONO_CP,
      fontSize: 12,
      color: "#fff",
      letterSpacing: ".12em",
      whiteSpace: "nowrap",
      overflow: "hidden",
      textOverflow: "ellipsis"
    }
  }, b.name), window.InfoDot ? /*#__PURE__*/React.createElement(window.InfoDot, {
    title: b.name,
    accent: accent
  }) : null)), /*#__PURE__*/React.createElement("span", {
    style: {
      flex: "none",
      width: 36
    }
  })), /*#__PURE__*/React.createElement("div", {
    style: {
      flex: 1,
      overflowY: embedded ? "visible" : "auto",
      overflowX: "hidden",
      WebkitOverflowScrolling: "touch",
      position: "relative",
      zIndex: 2,
      padding: embedded ? "0 0 8px" : "4px 16px 110px"
    }
  }, /*#__PURE__*/React.createElement("div", {
    style: {
      position: "relative",
      overflow: "hidden",
      borderRadius: 20,
      padding: "15px 16px 16px",
      marginTop: 4,
      border: `1px solid ${accent}3d`,
      background: `linear-gradient(152deg, ${accent}1f 0%, #0c0c0f 62%, #0a0a0c 100%)`,
      boxShadow: "0 12px 30px rgba(0,0,0,.5)"
    }
  }, /*#__PURE__*/React.createElement("span", {
    style: {
      position: "absolute",
      right: -54,
      top: -54,
      width: 176,
      height: 176,
      borderRadius: "50%",
      background: `radial-gradient(circle, ${accent} 0%, transparent 66%)`,
      opacity: .2,
      pointerEvents: "none"
    }
  }), /*#__PURE__*/React.createElement("div", {
    style: {
      position: "relative",
      display: "flex",
      alignItems: "center",
      gap: 7,
      color: accent
    }
  }, /*#__PURE__*/React.createElement(CpGlyph, {
    kind: "pool",
    size: 12,
    color: accent
  }), /*#__PURE__*/React.createElement("span", {
    style: {
      fontFamily: SANS_CP,
      fontWeight: 700,
      fontSize: 10.5,
      letterSpacing: ".16em"
    }
  }, "TOTAL PRIZE POOL", hasTiers ? " · ALL LIMITS" : "")), /*#__PURE__*/React.createElement("div", {
    style: {
      position: "relative",
      marginTop: 9,
      fontFamily: MONO_CP,
      fontWeight: 700,
      fontSize: 32,
      color: "#fff",
      lineHeight: 1,
      whiteSpace: "nowrap",
      overflow: "hidden",
      textOverflow: "ellipsis"
    }
  }, cpKzt(b.pool)), /*#__PURE__*/React.createElement("div", {
    style: {
      position: "relative",
      display: "flex",
      alignItems: "center",
      gap: 12,
      marginTop: 11,
      paddingTop: 11,
      borderTop: "1px solid rgba(255,255,255,.09)"
    }
  }, /*#__PURE__*/React.createElement("span", {
    style: {
      display: "flex",
      alignItems: "center",
      gap: 5,
      color: "#D8D8DF"
    }
  }, /*#__PURE__*/React.createElement(CpGlyph, {
    kind: "field",
    size: 12
  }), /*#__PURE__*/React.createElement("span", {
    style: {
      fontFamily: MONO_CP,
      fontWeight: 700,
      fontSize: 11,
      fontVariantNumeric: "tabular-nums"
    }
  }, cpNum(boardField(b)), " PLAYERS")), /*#__PURE__*/React.createElement("span", {
    style: {
      flex: 1
    }
  }), /*#__PURE__*/React.createElement("span", {
    style: {
      display: "flex",
      alignItems: "center",
      gap: 5,
      color: "#fff"
    }
  }, /*#__PURE__*/React.createElement(CpGlyph, {
    kind: "end",
    size: 12,
    color: accent
  }), /*#__PURE__*/React.createElement("span", {
    style: {
      fontFamily: MONO_CP,
      fontWeight: 700,
      fontSize: 11,
      whiteSpace: "nowrap"
    }
  }, "ENDS ", cpWin(b)[1])))), /*#__PURE__*/React.createElement("div", {
    style: {
      display: "flex",
      alignItems: "center",
      gap: 10,
      marginTop: 10,
      padding: "12px 13px",
      borderRadius: 16,
      border: `1px solid ${youRank ? accent + "80" : "rgba(255,255,255,.12)"}`,
      background: youRank ? `linear-gradient(120deg, ${accent}26, rgba(0,0,0,.4) 62%)` : "rgba(255,255,255,.04)"
    }
  }, /*#__PURE__*/React.createElement(window.FramedAvatar, {
    src: cpAvatar("SASHA02"),
    size: 36
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
      fontFamily: SANS_CP,
      fontWeight: 700,
      fontSize: 10.5,
      letterSpacing: ".16em",
      color: accent
    }
  }, "YOUR POSITION", inTier ? " · " + tier : ""), /*#__PURE__*/React.createElement("span", {
    style: {
      display: "flex",
      alignItems: "baseline",
      gap: 6,
      whiteSpace: "nowrap"
    }
  }, /*#__PURE__*/React.createElement("span", {
    style: {
      fontFamily: MONO_CP,
      fontWeight: 700,
      fontSize: 19,
      color: "#fff",
      lineHeight: 1,
      fontVariantNumeric: "tabular-nums"
    }
  }, youRank ? "#" + cpNum(youRank) : "\u2014"), /*#__PURE__*/React.createElement("span", {
    style: {
      fontFamily: MONO_CP,
      fontWeight: 700,
      fontSize: 10.5,
      color: "#A9A9B2"
    }
  }, "/ ", cpNum(field)), /*#__PURE__*/React.createElement("span", {
    style: {
      width: 1,
      height: 10,
      background: "rgba(255,255,255,.18)"
    }
  }), /*#__PURE__*/React.createElement("span", {
    style: {
      fontFamily: MONO_CP,
      fontWeight: 700,
      fontSize: 11,
      color: "#D8D8DF",
      fontVariantNumeric: "tabular-nums"
    }
  }, b.you ? cpNum(b.you.pts) : 0, " PTS"))), /*#__PURE__*/React.createElement("span", {
    style: {
      flex: "none",
      display: "flex",
      flexDirection: "column",
      alignItems: "flex-end",
      gap: 4,
      maxWidth: 118
    }
  }, /*#__PURE__*/React.createElement("span", {
    style: {
      fontFamily: SANS_CP,
      fontWeight: 700,
      fontSize: 9.5,
      letterSpacing: ".1em",
      color: "#A9A9B2",
      whiteSpace: "nowrap",
      textAlign: "right"
    }
  }, youPrize ? "IN LINE FOR" : "NOT IN THE MONEY"), youPrize ? /*#__PURE__*/React.createElement(CpPrize, {
    won: youPrize,
    accent: accent,
    you: true
  }) : /*#__PURE__*/React.createElement("span", {
    style: {
      fontFamily: MONO_CP,
      fontWeight: 700,
      fontSize: 11,
      color: "#A9A9B2",
      whiteSpace: "nowrap"
    }
  }, /*#__PURE__*/React.createElement("span", null, "TOP"), " " + cpNum(paid) + " ", /*#__PURE__*/React.createElement("span", null, "PAY")))), !embedded && /*#__PURE__*/React.createElement(CpDayBar, {
    day: day,
    setDay: setDay,
    accent: accent,
    onPick: () => setCal(true)
  }), hasDiscs && /*#__PURE__*/React.createElement("div", {
    style: {
      display: "flex",
      gap: 6,
      marginTop: 12
    }
  }, b.discs.map(d => {
    const on = disc === d,
      dc = dcOf(d);
    return /*#__PURE__*/React.createElement("button", {
      key: d,
      onClick: () => {
        if (window.playClick) window.playClick(1000, 0.03);
        setDisc(d);
      },
      style: {
        flex: "1 1 0",
        minWidth: 0,
        height: 42,
        padding: "0 4px",
        borderRadius: 125,
        cursor: "pointer",
        display: "inline-flex",
        alignItems: "center",
        justifyContent: "center",
        background: on ? dc : "rgba(255,255,255,.05)",
        border: `1px solid ${on ? dc : dc + "55"}`,
        fontFamily: SANS_CP,
        fontWeight: 700,
        fontSize: 10.5,
        letterSpacing: ".08em",
        color: on ? cpInk(dc) : "rgba(255,255,255,.66)",
        whiteSpace: "nowrap"
      }
    }, cpDiscLabel(d));
  })), hasTiers && /*#__PURE__*/React.createElement("div", {
    style: {
      position: "relative",
      marginTop: 10,
      zIndex: 8
    }
  }, /*#__PURE__*/React.createElement("button", {
    onClick: () => {
      if (window.playClick) window.playClick(1000, 0.03);
      setDd(!dd);
    },
    style: {
      width: "100%",
      boxSizing: "border-box",
      height: 46,
      padding: "0 14px",
      borderRadius: 12,
      cursor: "pointer",
      background: "rgba(255,255,255,.05)",
      border: `1px solid ${inTier ? accent : "rgba(255,255,255,.14)"}`,
      display: "flex",
      alignItems: "center",
      gap: 9
    }
  }, /*#__PURE__*/React.createElement(CpGlyph, {
    kind: "limit",
    size: 12,
    color: inTier ? accent : "rgba(255,255,255,.55)"
  }), /*#__PURE__*/React.createElement("span", {
    style: {
      fontFamily: SANS_CP,
      fontWeight: 700,
      fontSize: 10.5,
      letterSpacing: ".14em",
      color: "#A9A9B2"
    }
  }, "LIMITS"), /*#__PURE__*/React.createElement("span", {
    style: {
      fontFamily: MONO_CP,
      fontWeight: 700,
      fontSize: 12,
      color: "#fff"
    }
  }, tier === "ALL" ? "ALL LIMITS" : tier + " · " + tierOf(b, tier).lim), /*#__PURE__*/React.createElement("span", {
    style: {
      flex: 1
    }
  }), inTier && /*#__PURE__*/React.createElement("span", {
    style: {
      fontFamily: MONO_CP,
      fontWeight: 700,
      fontSize: 11,
      color: accent,
      whiteSpace: "nowrap"
    }
  }, cpKzt(pool)), /*#__PURE__*/React.createElement("svg", {
    width: "14",
    height: "14",
    viewBox: "0 0 24 24",
    fill: "none",
    stroke: "rgba(255,255,255,.6)",
    strokeWidth: "2.4",
    strokeLinecap: "round",
    strokeLinejoin: "round",
    style: {
      transform: dd ? "rotate(180deg)" : "none",
      transition: "transform 160ms"
    }
  }, /*#__PURE__*/React.createElement("path", {
    d: "M6 9l6 6 6-6"
  }))), dd && /*#__PURE__*/React.createElement("div", {
    style: {
      position: "absolute",
      top: "calc(100% + 6px)",
      left: 0,
      right: 0,
      borderRadius: 12,
      overflow: "hidden",
      background: "rgba(16,16,20,.99)",
      border: "1px solid rgba(255,255,255,.14)",
      boxShadow: "0 18px 44px rgba(0,0,0,.7)"
    }
  }, b.tiers.map((t, i) => {
    const on = tier === t.id;
    return /*#__PURE__*/React.createElement("div", {
      key: t.id,
      onClick: () => {
        if (window.playClick) window.playClick(1100, 0.03);
        setTier(t.id);
        setDd(false);
      },
      style: {
        display: "flex",
        alignItems: "center",
        gap: 10,
        padding: "12px 14px",
        cursor: "pointer",
        background: on ? `${accent}1f` : "transparent",
        borderTop: i ? "1px solid rgba(255,255,255,.07)" : "none"
      }
    }, /*#__PURE__*/React.createElement("span", {
      style: {
        fontFamily: MONO_CP,
        fontWeight: 700,
        fontSize: 12,
        color: on ? accent : "#fff",
        minWidth: 52
      }
    }, t.id), /*#__PURE__*/React.createElement("span", {
      style: {
        fontFamily: SANS_CP,
        fontWeight: 600,
        fontSize: 11,
        color: "#A9A9B2",
        flex: 1,
        minWidth: 0,
        whiteSpace: "nowrap",
        overflow: "hidden",
        textOverflow: "ellipsis"
      }
    }, t.lim), t.share ? /*#__PURE__*/React.createElement("span", {
      style: {
        fontFamily: MONO_CP,
        fontWeight: 700,
        fontSize: 11,
        color: on ? accent : "rgba(255,255,255,.5)",
        whiteSpace: "nowrap"
      }
    }, cpKzt(Math.round(b.pool * t.share))) : null);
  }))), /*#__PURE__*/React.createElement("div", {
    style: label({
      marginBottom: 9
    })
  }, "TOP ", topN, " \xB7 ", disc === "ALL" ? "ALL GAMES" : disc, inTier ? " · " + tier : ""), /*#__PURE__*/React.createElement("div", {
    style: {
      borderRadius: 14,
      border: `1px solid ${accent}40`,
      overflow: "hidden",
      background: "rgba(0,0,0,.25)"
    }
  }, Array.from({
    length: topN
  }, (_, i) => i + 1).map(r => /*#__PURE__*/React.createElement(Row, {
    key: r,
    rank: r,
    pinned: true
  }))), /*#__PURE__*/React.createElement("div", {
    style: label()
  }, "LEADERBOARD RULES"), /*#__PURE__*/React.createElement("div", {
    style: {
      borderRadius: 14,
      border: "1px solid rgba(255,255,255,.09)",
      overflow: "hidden"
    }
  }, [["SCORING", SCORING_NOTE[b.scoring]], ["CYCLE", b.cycle + (b.cycle === "SEASON" ? " · FULL QUARTER" : b.cycle === "DAILY" ? " · RESETS 00:00" : " SNAPSHOT")], ["PRIZES PAID", b.cycle === "DAILY" ? "NEXT DAY 06:00" : b.cycle === "WEEKLY" ? "MONDAY 06:00" : b.cycle === "SEASON" ? "SEASON END 06:00" : "1ST DAY 06:00"], ...(hasTiers ? [["LIMIT TIERS", b.tiers.map(t => t.id).join(" · ")]] : []), ["PLACES PAID", inTier ? cpNum(paid) + " IN " + tier : hasTiers ? "PER TIER · " + cpNum(b.paid) + " TOTAL" : cpNum(b.paid)], ["ENTRY THRESHOLD", cpNum(b.need) + " " + b.needUnit]].map(([k, v], i) => /*#__PURE__*/React.createElement("div", {
    key: k,
    style: {
      display: "flex",
      alignItems: "center",
      gap: 10,
      padding: "11px 13px",
      background: i % 2 ? "rgba(255,255,255,.03)" : "transparent"
    }
  }, /*#__PURE__*/React.createElement("span", {
    style: {
      flex: "none",
      fontFamily: SANS_CP,
      fontWeight: 700,
      fontSize: 10.5,
      letterSpacing: ".14em",
      color: "#A9A9B2"
    }
  }, k), /*#__PURE__*/React.createElement("span", {
    style: {
      marginLeft: "auto",
      fontFamily: MONO_CP,
      fontWeight: 700,
      fontSize: 11,
      color: "#fff",
      textAlign: "right"
    }
  }, v)))), /*#__PURE__*/React.createElement("div", {
    style: {
      display: "flex",
      flexDirection: "column",
      gap: 7,
      marginTop: 11
    }
  }, ["Points are scored on every hand you play inside the board's window — no opt-in, no registration.", "Prizes are computed on the limit tier you played in, so micro stakes never race high rollers for the same money.", "Play several limits and you stand on several tier ladders at once; each pays on its own.", "The board freezes at the end of its window and prizes land on your balance at the stated time."].map((t, i) => /*#__PURE__*/React.createElement("div", {
    key: i,
    style: {
      display: "flex",
      alignItems: "flex-start",
      gap: 8
    }
  }, /*#__PURE__*/React.createElement("span", {
    style: {
      flex: "none",
      width: 5,
      height: 5,
      borderRadius: "50%",
      background: accent,
      marginTop: 5
    }
  }), /*#__PURE__*/React.createElement("span", {
    style: {
      fontFamily: SANS_CP,
      fontWeight: 600,
      fontSize: 11,
      lineHeight: 1.45,
      color: "#D8D8DF"
    }
  }, t))))), cal && /*#__PURE__*/React.createElement(CpCalendar, {
    day: day,
    setDay: setDay,
    accent: accent,
    onClose: () => setCal(false)
  }));
}

// ── board tiles — the V5 hierarchy: hero · V5 tiles · one quiet row ────────
function CpHero({
  b,
  onTap
}) {
  const c = b.color;
  return /*#__PURE__*/React.createElement("button", {
    onClick: () => {
      if (window.playClick) window.playClick(1150, 0.04);
      onTap(b);
    },
    style: {
      position: "relative",
      overflow: "hidden",
      width: "100%",
      boxSizing: "border-box",
      textAlign: "left",
      cursor: "pointer",
      borderRadius: 20,
      padding: "16px 17px 14px",
      border: `1px solid ${c}52`,
      background: `linear-gradient(152deg, ${c}2b 0%, #0c0c0f 58%, #0a0a0c 100%)`,
      boxShadow: "0 16px 36px rgba(0,0,0,.55)"
    }
  }, /*#__PURE__*/React.createElement("span", {
    style: {
      position: "absolute",
      right: -46,
      top: -58,
      width: 190,
      height: 190,
      borderRadius: "50%",
      background: `radial-gradient(circle, ${c} 0%, transparent 66%)`,
      opacity: .24,
      pointerEvents: "none"
    }
  }), /*#__PURE__*/React.createElement("span", {
    style: {
      position: "absolute",
      inset: 0,
      pointerEvents: "none",
      backgroundImage: "radial-gradient(circle, rgba(255,255,255,.055) .8px, transparent 1.2px)",
      backgroundSize: "13px 13px",
      maskImage: "linear-gradient(150deg, black, transparent 74%)",
      WebkitMaskImage: "linear-gradient(150deg, black, transparent 74%)"
    }
  }), /*#__PURE__*/React.createElement("div", {
    style: {
      position: "relative",
      display: "flex",
      alignItems: "flex-start",
      gap: 14
    }
  }, /*#__PURE__*/React.createElement("div", {
    style: {
      flex: 1,
      minWidth: 0
    }
  }, /*#__PURE__*/React.createElement("div", {
    style: {
      display: "flex",
      alignItems: "center",
      gap: 7
    }
  }, /*#__PURE__*/React.createElement("span", {
    style: {
      flex: "none",
      width: 6,
      height: 6,
      borderRadius: "50%",
      background: c,
      boxShadow: `0 0 9px ${c}`
    }
  }), /*#__PURE__*/React.createElement("span", {
    style: {
      fontFamily: SANS_CP,
      fontWeight: 700,
      fontSize: 10.5,
      letterSpacing: ".18em",
      color: c,
      whiteSpace: "nowrap"
    }
  }, b.cycle, " \xB7 ENDS IN ", b.ends)), /*#__PURE__*/React.createElement("div", {
    style: {
      marginTop: 9,
      fontFamily: MONO_CP,
      fontSize: 19,
      color: "#fff",
      letterSpacing: ".04em",
      lineHeight: 1.15
    }
  }, b.name), /*#__PURE__*/React.createElement("div", {
    style: {
      marginTop: 13,
      fontFamily: SANS_CP,
      fontWeight: 700,
      fontSize: 10.5,
      letterSpacing: ".16em",
      color: "#8A8A93"
    }
  }, "TOTAL PRIZE POOL"), /*#__PURE__*/React.createElement("div", {
    style: {
      marginTop: 6,
      fontFamily: MONO_CP,
      fontWeight: 700,
      fontSize: 27,
      color: "#fff",
      lineHeight: 1,
      whiteSpace: "nowrap"
    }
  }, cpKzt(b.pool))), b.art ? /*#__PURE__*/React.createElement("span", {
    style: {
      flex: "none",
      width: 104,
      height: 104,
      marginTop: -2,
      display: "flex",
      alignItems: "center",
      justifyContent: "center"
    }
  }, /*#__PURE__*/React.createElement("img", {
    src: b.art,
    alt: "",
    style: {
      width: "100%",
      height: "100%",
      objectFit: "contain",
      filter: `drop-shadow(0 14px 26px rgba(0,0,0,.7)) drop-shadow(0 0 22px ${c}55)`
    }
  })) : null), /*#__PURE__*/React.createElement("div", {
    style: {
      position: "relative",
      display: "flex",
      alignItems: "center",
      gap: 16,
      marginTop: 13,
      paddingTop: 12,
      borderTop: "1px solid rgba(255,255,255,.1)"
    }
  }, /*#__PURE__*/React.createElement("span", {
    style: {
      display: "flex",
      alignItems: "center",
      gap: 5
    }
  }, /*#__PURE__*/React.createElement(CpGlyph, {
    kind: "field",
    size: 11,
    color: "rgba(255,255,255,.45)"
  }), /*#__PURE__*/React.createElement("span", {
    style: {
      fontFamily: SANS_CP,
      fontWeight: 700,
      fontSize: 10.5,
      letterSpacing: ".1em",
      color: "#A9A9B2"
    }
  }, cpNum(cpField(b)), " PLAYERS")), b.you ? /*#__PURE__*/React.createElement("span", {
    style: {
      display: "flex",
      alignItems: "center",
      gap: 6
    }
  }, /*#__PURE__*/React.createElement("span", {
    style: {
      fontFamily: SANS_CP,
      fontWeight: 700,
      fontSize: 10.5,
      letterSpacing: ".1em",
      color: "#8A8A93"
    }
  }, "YOUR RANK"), /*#__PURE__*/React.createElement("span", {
    style: {
      fontFamily: MONO_CP,
      fontWeight: 700,
      fontSize: 12,
      color: "#fff"
    }
  }, "#", cpNum(b.you.rank))) : null, /*#__PURE__*/React.createElement("span", {
    style: {
      flex: 1
    }
  }), /*#__PURE__*/React.createElement("svg", {
    width: "15",
    height: "15",
    viewBox: "0 0 24 24",
    fill: "none",
    stroke: "#fff",
    strokeWidth: "2.2",
    strokeLinecap: "round",
    style: {
      opacity: .5
    }
  }, /*#__PURE__*/React.createElement("path", {
    d: "M9 6l6 6-6 6"
  }))));
}
function CpQuiet({
  b,
  onTap
}) {
  const c = b.color;
  return /*#__PURE__*/React.createElement("button", {
    onClick: () => {
      if (window.playClick) window.playClick(1150, 0.04);
      onTap(b);
    },
    style: {
      position: "relative",
      overflow: "hidden",
      width: "100%",
      boxSizing: "border-box",
      textAlign: "left",
      cursor: "pointer",
      borderRadius: 14,
      padding: "11px 14px",
      display: "flex",
      alignItems: "center",
      gap: 12,
      border: "1px solid rgba(255,255,255,.09)",
      background: "linear-gradient(150deg, #121216, #0a0a0c)"
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
      gap: 6
    }
  }, /*#__PURE__*/React.createElement("span", {
    style: {
      flex: "none",
      width: 5,
      height: 5,
      borderRadius: "50%",
      background: c
    }
  }), /*#__PURE__*/React.createElement("span", {
    style: {
      fontFamily: MONO_CP,
      fontSize: 13,
      letterSpacing: ".08em",
      color: "#D8D8DF",
      whiteSpace: "nowrap"
    }
  }, b.name)), /*#__PURE__*/React.createElement("span", {
    style: {
      display: "block",
      marginTop: 4,
      fontFamily: SANS_CP,
      fontWeight: 700,
      fontSize: 10.5,
      letterSpacing: ".1em",
      color: "#A9A9B2"
    }
  }, b.cycle, " \xB7 ", b.ends, " \xB7 ", cpNum(cpField(b)), " PLAYERS")), /*#__PURE__*/React.createElement("span", {
    style: {
      flex: "none",
      fontFamily: MONO_CP,
      fontWeight: 700,
      fontSize: 14,
      color: "#D8D8DF",
      whiteSpace: "nowrap"
    }
  }, cpKzt(b.pool)), b.art ? /*#__PURE__*/React.createElement("span", {
    style: {
      flex: "none",
      width: 38,
      height: 38,
      display: "flex",
      alignItems: "center",
      justifyContent: "center"
    }
  }, /*#__PURE__*/React.createElement("img", {
    src: b.art,
    alt: "",
    style: {
      width: "100%",
      height: "100%",
      objectFit: "contain"
    }
  })) : null, /*#__PURE__*/React.createElement("svg", {
    width: "14",
    height: "14",
    viewBox: "0 0 24 24",
    fill: "none",
    stroke: "#fff",
    strokeWidth: "2.2",
    strokeLinecap: "round",
    style: {
      flex: "none",
      opacity: .26
    }
  }, /*#__PURE__*/React.createElement("path", {
    d: "M9 6l6 6-6 6"
  })));
}
function BoardCard({
  b,
  onTap,
  rank
}) {
  if (rank === "hero") return /*#__PURE__*/React.createElement(CpHero, {
    b: b,
    onTap: onTap
  });
  if (rank === "quiet") return /*#__PURE__*/React.createElement(CpQuiet, {
    b: b,
    onTap: onTap
  });
  const c = b.color;
  return /*#__PURE__*/React.createElement("button", {
    onClick: () => {
      if (window.playClick) window.playClick(1150, 0.04);
      onTap(b);
    },
    style: {
      position: "relative",
      overflow: "hidden",
      width: "100%",
      boxSizing: "border-box",
      textAlign: "left",
      cursor: "pointer",
      borderRadius: 16,
      padding: "15px 16px",
      display: "flex",
      alignItems: "center",
      gap: 14,
      border: `1px solid ${c}3d`,
      background: `linear-gradient(152deg, ${c}1f 0%, #0c0c0f 62%, #0a0a0c 100%)`,
      boxShadow: "0 12px 30px rgba(0,0,0,.5)"
    }
  }, /*#__PURE__*/React.createElement("span", {
    style: {
      position: "absolute",
      inset: 0,
      pointerEvents: "none",
      background: `radial-gradient(ellipse 52% 130% at 100% 50%, ${c}24, transparent 70%)`
    }
  }), /*#__PURE__*/React.createElement("span", {
    style: {
      position: "absolute",
      inset: 0,
      pointerEvents: "none",
      backgroundImage: "radial-gradient(circle, rgba(255,255,255,.055) .8px, transparent 1.2px)",
      backgroundSize: "13px 13px",
      maskImage: "linear-gradient(150deg, black, transparent 74%)",
      WebkitMaskImage: "linear-gradient(150deg, black, transparent 74%)"
    }
  }), /*#__PURE__*/React.createElement("span", {
    style: {
      position: "relative",
      flex: 1,
      minWidth: 0,
      display: "flex",
      flexDirection: "column"
    }
  }, /*#__PURE__*/React.createElement("span", {
    style: {
      display: "flex",
      alignItems: "center",
      gap: 7
    }
  }, /*#__PURE__*/React.createElement("span", {
    style: {
      flex: "none",
      width: 5,
      height: 5,
      borderRadius: "50%",
      background: c,
      boxShadow: `0 0 8px ${c}`
    }
  }), /*#__PURE__*/React.createElement("span", {
    style: {
      fontFamily: SANS_CP,
      fontWeight: 700,
      fontSize: 10.5,
      letterSpacing: ".18em",
      color: c,
      whiteSpace: "nowrap"
    }
  }, b.cycle)), /*#__PURE__*/React.createElement("span", {
    style: {
      display: "block",
      marginTop: 8,
      fontFamily: MONO_CP,
      fontSize: 15,
      color: "#fff",
      letterSpacing: ".04em",
      lineHeight: 1.2
    }
  }, b.name), /*#__PURE__*/React.createElement("span", {
    style: {
      display: "flex",
      alignItems: "baseline",
      gap: 7,
      marginTop: 9
    }
  }, /*#__PURE__*/React.createElement("span", {
    style: {
      fontFamily: MONO_CP,
      fontWeight: 700,
      fontSize: 17,
      color: "#fff",
      whiteSpace: "nowrap"
    }
  }, cpKzt(b.pool)), /*#__PURE__*/React.createElement("span", {
    style: {
      fontFamily: SANS_CP,
      fontWeight: 700,
      fontSize: 10.5,
      letterSpacing: ".12em",
      color: "#8A8A93"
    }
  }, "POOL")), /*#__PURE__*/React.createElement("span", {
    style: {
      display: "flex",
      alignItems: "center",
      gap: 5,
      marginTop: 8
    }
  }, /*#__PURE__*/React.createElement(CpGlyph, {
    kind: "clock",
    size: 11,
    color: c
  }), /*#__PURE__*/React.createElement("span", {
    style: {
      fontFamily: SANS_CP,
      fontWeight: 700,
      fontSize: 10.5,
      letterSpacing: ".1em",
      color: c + "b3",
      whiteSpace: "nowrap"
    }
  }, "ENDS IN ", b.ends))), b.art ? /*#__PURE__*/React.createElement("span", {
    style: {
      position: "relative",
      flex: "none",
      width: 72,
      height: 72,
      display: "flex",
      alignItems: "center",
      justifyContent: "center"
    }
  }, /*#__PURE__*/React.createElement("img", {
    src: b.art,
    alt: "",
    style: {
      width: "100%",
      height: "100%",
      objectFit: "contain",
      filter: `drop-shadow(0 12px 22px rgba(0,0,0,.7)) drop-shadow(0 0 18px ${c}4d)`
    }
  })) : null);
}

// ── the Competitions screen — four equal tiles ─────────────────────────────
function CompetitionsScreen({
  open,
  onClose,
  accent = "#D71921",
  initialRace = null,
  onReferral,
  preset = null,
  nested = false,
  topInset = 0
}) {
  const [mounted, setMounted] = React.useState(false);
  const [sel, setSel] = React.useState(null);
  const [push, setPush] = React.useState(null);
  if (typeof window !== "undefined") window.__compNav = {
    sel: setSel,
    boards: BOARDS,
    push: setPush
  };
  // opening a board you are winning money on raises an in-app notice
  const raise = b => {
    if (!b || !b.you) return;
    const tier = preset && b.tiers && b.tiers.some(t => t.id === preset.tier) ? preset.tier : b.you.tier;
    const pool = tierPool(b, tier),
      paid = tierPaid(b, tier);
    // simulate the live notice: if the standing is outside the money we show the
    // climb that just put the player inside it
    const climbed = b.you.rank > paid;
    const rank = climbed ? Math.max(3, Math.round(paid * 0.6)) : b.you.rank;
    const won = prizeAt(pool, paid, rank);
    if (!won) return;
    setTimeout(() => setPush({
      board: b.name,
      color: b.color,
      rank,
      tix: !!won.ticket,
      prize: won.ticket ? won.ticket.replace(/^TICKET\s*/, "") : won.cash,
      note: (climbed ? "Moved into the prize zone" : "In the money") + " \u00b7 " + (b.cycle === "DAILY" ? "paid tomorrow 06:00" : b.cycle === "WEEKLY" ? "paid Monday 06:00" : "paid at season end")
    }), 700);
  };
  React.useEffect(() => {
    if (!open) {
      setSel(null);
      setPush(null);
      return;
    }
    if (initialRace) {
      const b = BOARDS.find(x => x.id === initialRace);
      if (b) {
        setSel(b);
        raise(b);
      }
    }
    setMounted(false);
    const r = requestAnimationFrame(() => setMounted(true));
    return () => cancelAnimationFrame(r);
  }, [open, initialRace]);
  if (!open) return null;
  const back = () => {
    if (window.playClick) window.playClick(800, 0.04);
    if (sel) return setSel(null);
    onClose();
  };
  return /*#__PURE__*/React.createElement("div", {
    style: {
      position: "absolute",
      inset: 0,
      zIndex: 70,
      background: "#000",
      transform: mounted ? "translateY(0)" : "translateY(100%)",
      transition: "transform 340ms cubic-bezier(0.2,0.8,0.2,1)",
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
      background: `radial-gradient(ellipse 90% 70% at 50% 0%, ${sel ? sel.color : accent}22, transparent 62%)`
    }
  }), /*#__PURE__*/React.createElement("div", {
    style: {
      position: "absolute",
      inset: 0,
      pointerEvents: "none",
      backgroundImage: "radial-gradient(circle, rgba(255,255,255,.045) 0.6px, transparent 1px)",
      backgroundSize: "11px 11px"
    }
  }), /*#__PURE__*/React.createElement(CpPush, {
    data: push,
    onClose: () => setPush(null),
    onOpen: () => setPush(null)
  }), sel ? /*#__PURE__*/React.createElement(BoardDetail, {
    nested: nested,
    topInset: topInset,
    key: sel.id + ":" + (preset ? preset.disc + preset.tier : ""),
    b: sel,
    accent: sel.color,
    onBack: () => setSel(null),
    preset: preset
  }) : /*#__PURE__*/React.createElement(React.Fragment, null, /*#__PURE__*/React.createElement("div", {
    className: "pd-screen-header",
    style: {
      position: "relative",
      zIndex: 5,
      padding: (nested ? topInset + 14 + "px" : "62px") + " 16px 8px 14px",
      display: "flex",
      alignItems: "center",
      gap: 8
    }
  }, /*#__PURE__*/React.createElement("button", {
    "aria-label": "\u041D\u0430\u0437\u0430\u0434",
    onClick: back,
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
      fontFamily: MONO_CP,
      fontSize: 15,
      color: "#fff",
      letterSpacing: ".16em",
      whiteSpace: "nowrap"
    }
  }, "COMPETITIONS"), window.InfoDot ? /*#__PURE__*/React.createElement(window.InfoDot, {
    title: "COMPETITIONS",
    accent: accent
  }) : null), /*#__PURE__*/React.createElement("span", {
    style: {
      flex: "none",
      width: 36
    }
  })), /*#__PURE__*/React.createElement("div", {
    style: {
      flex: 1,
      minHeight: 0,
      overflowY: "auto",
      WebkitOverflowScrolling: "touch",
      position: "relative",
      zIndex: 2,
      padding: "6px 16px 110px",
      display: "flex",
      flexDirection: "column",
      gap: 12
    }
  }, BOARDS.map((b, i) => /*#__PURE__*/React.createElement(BoardCard, {
    key: b.id,
    b: b,
    rank: i === 0 ? "hero" : null,
    onTap: x => {
      if (x.social && onReferral) {
        onReferral();
        return;
      }
      setSel(x);
      raise(x);
    }
  })))));
}

// best standing across the general boards — Activities tile
window.cpBest = () => {
  const j = BOARDS.filter(b => !b.social && b.you);
  if (!j.length) return null;
  const b = j.reduce((x, y) => y.you.rank < x.you.rank ? y : x);
  return {
    rank: b.you.rank,
    name: b.name,
    joined: j.length,
    total: BOARDS.filter(x => !x.social).length,
    id: b.id
  };
};
// усі дошки, що показані на екрані змагань — для плитки в Нагородах
window.cpBoards = () => BOARDS.map(b => ({
  id: b.id,
  name: b.name,
  pool: b.pool
}));
window.cpSummary = () => ({
  races: BOARDS.filter(b => !b.social).length,
  joined: BOARDS.filter(b => !b.social && b.you).length,
  pool: BOARDS.filter(b => !b.social).reduce((s, b) => s + b.pool, 0)
});

// the Friend Royale board — standalone inside the referral hub
function RoyaleBoard({
  accent = "#D71921"
}) {
  const b = BOARDS.find(x => x.id === "royale");
  if (!b) return null;
  return /*#__PURE__*/React.createElement(BoardDetail, {
    b: b,
    accent: accent,
    embedded: true
  });
}
Object.assign(window, {
  CompetitionsWidget,
  CompetitionsScreen,
  BestBoardWidget,
  RaceFlags,
  RoyaleBoard
});