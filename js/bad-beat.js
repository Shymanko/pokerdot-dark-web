// Grand Jackpot — one shared prize pool feeding TWO jackpots: Bad Beat + High
// Hand. Opened by tapping the Grand Jackpot widget in the lobby. Cardomancer
// house style: pure black, one Arcanium red, Chakra mono, flat surfaces.
//
// Structure: shared LIVE POOL hero → BAD BEAT / HIGH HAND type tabs →
// WINNERS / RULES sub-tabs. Rules shows a no-scroll 2-col trigger grid, the
// pool-by-stake table and the payout breakdown.

const BBJ_MONO = UI.font;
const BBJ_SANS = UI.fontUI;
const BBJ_ARC = "#D71921";
const BBJ_GOLD = "#f0c75e";

// ── one playing card ──────────────────────────────────────────────────────
function BbCard({
  r,
  s,
  w = 34
}) {
  const red = s === "heart" || s === "diamond";
  const col = red ? BBJ_ARC : "#0b0b0d";
  const h = Math.round(w * 1.42);
  const uni = {
    heart: "\u2665",
    diamond: "\u2666",
    club: "\u2663",
    spade: "\u2660"
  }[s];
  return /*#__PURE__*/React.createElement("span", {
    style: {
      position: "relative",
      width: w,
      height: h,
      borderRadius: Math.max(4, w * 0.14),
      background: "#fff",
      boxShadow: "0 3px 8px rgba(0,0,0,.5), inset 0 0 0 1px rgba(0,0,0,.08)",
      display: "flex",
      alignItems: "center",
      justifyContent: "center",
      flex: "none"
    }
  }, /*#__PURE__*/React.createElement("span", {
    style: {
      position: "absolute",
      top: w * 0.06,
      left: w * 0.12,
      fontFamily: BBJ_MONO,
      fontWeight: 700,
      fontSize: w * 0.34,
      color: col,
      lineHeight: 1
    }
  }, r), window.Suit ? /*#__PURE__*/React.createElement(window.Suit, {
    kind: s,
    size: w * 0.5,
    color: col
  }) : /*#__PURE__*/React.createElement("span", {
    style: {
      fontSize: w * 0.5,
      color: col,
      lineHeight: 1
    }
  }, uni), /*#__PURE__*/React.createElement("span", {
    style: {
      position: "absolute",
      bottom: w * 0.06,
      right: w * 0.12,
      fontFamily: BBJ_MONO,
      fontWeight: 700,
      fontSize: w * 0.34,
      color: col,
      lineHeight: 1,
      transform: "rotate(180deg)"
    }
  }, r));
}

// ── triggers per jackpot ───────────────────────────────────────────────────
// Bad Beat: minimum LOSING hand that qualifies. High Hand: minimum WINNING
// hand shown down. One tile per game — rendered as a static 2×N grid (no swipe).
// п.2 (ревʼю 08.09): у швидкого покеру власні умови тригера — за столом
// роздають помітно більше рук, тому поріг там вищий, ніж у звичайному кеші.
// Умови задані по кожній дисципліні окремо, як і в кеші.
const BB_TRIGGERS_CASH = [{
  game: "HOLD'EM",
  sub: "Cash tables",
  cond: "Aces full of tens"
}, {
  game: "PLO",
  sub: "4-card Omaha",
  cond: "Quad deuces"
}, {
  game: "PLO-5",
  sub: "5-card Omaha",
  cond: "Quad eights"
}, {
  game: "PLO-6",
  sub: "6-card Omaha",
  cond: "Quad jacks"
}, {
  game: "SHORT DECK",
  sub: "6+ Hold'em",
  cond: "Quad sixes",
  wide: true
}];
// у швидкому покері грають ТІЛЬКИ холдем — інших дисциплін там немає
const BB_TRIGGERS_FAST = [{
  game: "HOLD'EM",
  sub: "Fast Poker",
  cond: "Quad deuces",
  wide: true
}];
const BB_ROOMS = [["cash", "CASH"], ["fast", "FAST POKER"]];
const BB_TRIGGERS = BB_TRIGGERS_CASH;
// High Hand qualifying tiers. Same three ranks for every game; only the
// Straight Flush example changes for Short Deck (2-5 stripped → A-6-7-8-9).
function hhTriggers(game) {
  const sf = game === "shortdeck" ? [["9", "heart"], ["8", "heart"], ["7", "heart"], ["6", "heart"], ["A", "heart"]] : [["5", "heart"], ["4", "heart"], ["3", "heart"], ["2", "heart"], ["A", "heart"]];
  return [{
    title: "ROYAL FLUSH",
    cards: [["A", "spade"], ["K", "spade"], ["Q", "spade"], ["J", "spade"], ["10", "spade"]],
    note: {
      pre: "",
      hi: "A-K-Q-J-10",
      tail: "suited"
    }
  }, {
    title: "STRAIGHT FLUSH",
    cards: sf,
    note: {
      pre: "",
      hi: "Any straight flush",
      tail: ""
    }
  }, {
    title: "QUAD TENS OR BETTER",
    cards: [["10", "spade"], ["10", "heart"], ["10", "club"], ["10", "diamond"]],
    note: {
      pre: "",
      hi: "TTTT",
      tail: "or better"
    }
  }];
}

// ── shared pool broken down by stake (from the rules sheet) ─────────────────
const GJ_POOL_BY_STAKE = [{
  stake: "$1 000 / $2 000",
  pool: "$101 101.27"
}, {
  stake: "$50 / $100",
  pool: "$5 058.56"
}, {
  stake: "$10 / $20",
  pool: "$1 011.71"
}, {
  stake: "$2 / $5",
  pool: "$252.92"
}, {
  stake: "$1 / $2",
  pool: "$101.17"
}, {
  stake: "$0.50 / $1",
  pool: "$50.58"
}, {
  stake: "$0.25 / $0.50",
  pool: "$25.29"
}, {
  stake: "$0.10 / $0.25",
  pool: "$12.64"
}, {
  stake: "$0.05 / $0.10",
  pool: "$5.05"
}, {
  stake: "$0.01 / $0.02",
  pool: "$1.01"
}];

// ── payout breakdown per jackpot ────────────────────────────────────────────
const GJ_PAYOUT = {
  badbeat: [{
    who: "BAD BEAT WINNER",
    sub: "The losing monster hand",
    pct: "10%"
  }, {
    who: "OPPONENT",
    sub: "The winning hand",
    pct: "3%"
  }, {
    who: "EACH OTHER PLAYER",
    sub: "Dealt into the hand",
    pct: "0.8%"
  }],
  highhand: [{
    who: "ROYAL FLUSH",
    sub: "50 BB Omaha · 50× ante Short Deck",
    pct: "100 BB"
  }, {
    who: "STRAIGHT FLUSH",
    sub: "20 BB Omaha · 20× ante Short Deck",
    pct: "40 BB"
  }, {
    who: "FOUR OF A KIND",
    sub: "10 BB Omaha · 10× ante Short Deck",
    pct: "20 BB"
  }]
};

// High Hand payout scales by game (BB multiple for flop games, ante for Short
// Deck). PLO / PLO-5 / PLO-6 all share the Omaha rate, so the selector groups
// them under "PLO".
const HH_PAYOUT_BY_GAME = {
  holdem: {
    label: "Hold'em cash",
    unit: "BB",
    rows: [["ROYAL FLUSH", "100"], ["STRAIGHT FLUSH", "40"], ["FOUR OF A KIND", "20"]]
  },
  plo: {
    label: "Pot-Limit Omaha",
    unit: "BB",
    rows: [["ROYAL FLUSH", "50"], ["STRAIGHT FLUSH", "20"], ["FOUR OF A KIND", "10"]]
  },
  shortdeck: {
    label: "Short Deck",
    unit: "ante",
    rows: [["ROYAL FLUSH", "50"], ["STRAIGHT FLUSH", "20"], ["FOUR OF A KIND", "10"]]
  }
};
const HH_GAMES = [["holdem", "HOLD'EM"], ["plo", "PLO"], ["shortdeck", "SHORT DECK"]];
const GJ_RULES = {
  badbeat: ["The Bad Beat jackpot triggers when a very strong hand still loses the pot at a qualifying cash table.", "Both the losing and winning hands must use both hole cards (Hold'em) or the game's required hole cards (Omaha).", "The minimum qualifying losing hand depends on the game — see the triggers above.", "All players dealt into the hand share the table portion. You must be seated and dealt in to qualify.", "The remaining balance reseeds the next Grand Jackpot after every drop."],
  highhand: ["The High Hand jackpot pays the strongest qualifying hand made during each hour on a qualifying cash table.", "You must reach showdown with the hand — pots won before showdown don't qualify.", "The minimum qualifying hand depends on the game — see the triggers above.", "If two players make the same rank, the earlier hand of the hour wins.", "High Hand and Bad Beat share one Grand Jackpot pool, fed by the same table fee."]
};

// ── jackpot meta ────────────────────────────────────────────────────────────
const GJ_JACKPOTS = {
  badbeat: {
    label: "BAD BEAT",
    verb: "Lose with",
    triggers: BB_TRIGGERS,
    blurb: "When a monster hand still loses at a qualifying cash table, this pool drops."
  },
  highhand: {
    label: "HIGH HAND",
    verb: "Win with",
    triggers: hhTriggers("holdem"),
    blurb: "Make the strongest qualifying hand of the hour to claim from this pool."
  }
};

// ── recent winners (tagged by jackpot) ──────────────────────────────────────
const GJ_WINNERS = [{
  name: "DREBIN88",
  jp: "badbeat",
  game: "PLO-5",
  amt: "$182 940",
  hand: "Quad 8s",
  when: "2d ago",
  suit: "diamond"
}, {
  name: "yanu_ua",
  jp: "badbeat",
  game: "HOLD'EM",
  amt: "$96 120",
  hand: "Quad Aces",
  when: "6d ago",
  suit: "spade"
}, {
  name: "MAX_K",
  jp: "highhand",
  game: "PLO",
  amt: "$41 505",
  hand: "Straight flush",
  when: "1h ago",
  suit: "heart"
}, {
  name: "sponge99",
  jp: "badbeat",
  game: "SHORT DECK",
  amt: "$74 300",
  hand: "Quad 6s",
  when: "3w ago",
  suit: "club"
}, {
  name: "kyiv_rock",
  jp: "highhand",
  game: "HOLD'EM",
  amt: "$28 650",
  hand: "Quad Kings",
  when: "2h ago",
  suit: "spade"
}, {
  name: "La_Rana",
  jp: "badbeat",
  game: "PLO-6",
  amt: "$154 020",
  hand: "Quad Jacks",
  when: "5w ago",
  suit: "heart"
}, {
  name: "nightjar",
  jp: "highhand",
  game: "PLO",
  amt: "$52 400",
  hand: "Straight flush",
  when: "5h ago",
  suit: "diamond"
}, {
  name: "coldcall_",
  jp: "badbeat",
  game: "HOLD'EM",
  amt: "$69 880",
  hand: "Quad Queens",
  when: "7w ago",
  suit: "club"
}, {
  name: "riverboat",
  jp: "highhand",
  game: "SHORT DECK",
  amt: "$32 910",
  hand: "Straight flush",
  when: "8h ago",
  suit: "heart"
}, {
  name: "tiltking",
  jp: "highhand",
  game: "PLO-5",
  amt: "$45 600",
  hand: "Quad Aces",
  when: "11h ago",
  suit: "spade"
}, {
  name: "o_maha",
  jp: "badbeat",
  game: "PLO",
  amt: "$91 240",
  hand: "Quad 10s",
  when: "10w ago",
  suit: "diamond"
}, {
  name: "deuce4",
  jp: "badbeat",
  game: "HOLD'EM",
  amt: "$58 700",
  hand: "Quad Deuces",
  when: "11w ago",
  suit: "club"
}, {
  name: "shovehappy",
  jp: "highhand",
  game: "PLO-6",
  amt: "$61 330",
  hand: "Straight flush",
  when: "1d ago",
  suit: "heart"
}, {
  name: "quadzilla",
  jp: "highhand",
  game: "SHORT DECK",
  amt: "$30 150",
  hand: "Quad 9s",
  when: "1d ago",
  suit: "spade"
}, {
  name: "chipmagnet",
  jp: "badbeat",
  game: "HOLD'EM",
  amt: "$103 470",
  hand: "Quad Aces",
  when: "13w ago",
  suit: "diamond"
}, {
  name: "bluff_ua",
  jp: "highhand",
  game: "PLO",
  amt: "$38 900",
  hand: "Quad Kings",
  when: "2d ago",
  suit: "club"
}, {
  name: "slowroll7",
  jp: "highhand",
  game: "PLO-5",
  amt: "$49 275",
  hand: "Straight flush",
  when: "2d ago",
  suit: "heart"
}, {
  name: "ace_hi",
  jp: "badbeat",
  game: "HOLD'EM",
  amt: "$64 510",
  hand: "Quad Jacks",
  when: "13w ago",
  suit: "spade"
}];
const bbAmt = s => parseInt(String(s).replace(/[^0-9]/g, ""), 10) || 0;
const gjWinnersFor = jp => GJ_WINNERS.filter(w => w.jp === jp);
const gjTopFor = jp => gjWinnersFor(jp).reduce((a, b) => bbAmt(b.amt) > bbAmt(a.amt) ? b : a);
function BbSection({
  children,
  accent,
  sub
}) {
  return /*#__PURE__*/React.createElement("div", {
    style: {
      marginTop: 24,
      marginBottom: 13
    }
  }, /*#__PURE__*/React.createElement("div", {
    style: {
      display: "flex",
      alignItems: "center",
      gap: 9
    }
  }, /*#__PURE__*/React.createElement("span", {
    style: {
      width: 5,
      height: 14,
      borderRadius: 2,
      background: accent
    }
  }), /*#__PURE__*/React.createElement("span", {
    style: {
      fontFamily: BBJ_MONO,
      fontWeight: 700,
      fontSize: 12,
      letterSpacing: ".18em",
      color: "#fff"
    }
  }, children)), sub && /*#__PURE__*/React.createElement("div", {
    style: {
      fontFamily: BBJ_SANS,
      fontWeight: 600,
      fontSize: 10.5,
      color: "#A9A9B2",
      letterSpacing: ".04em",
      marginTop: 6,
      marginLeft: 14
    }
  }, sub));
}

// ── Bad Beat: six plain game tiles, no hands drawn ─────────────────────────
function BbGameGrid({
  games,
  verb,
  accent
}) {
  return /*#__PURE__*/React.createElement("div", {
    style: {
      display: "grid",
      gridTemplateColumns: "1fr 1fr",
      gap: 8
    }
  }, games.map(g => /*#__PURE__*/React.createElement("div", {
    key: g.game,
    style: {
      gridColumn: g.wide ? "span 2" : "auto",
      position: "relative",
      overflow: "hidden",
      borderRadius: 14,
      padding: "13px 12px 14px",
      display: "flex",
      flexDirection: "column",
      gap: 7,
      background: `linear-gradient(150deg, ${accent}1c 0%, #0c0c0f 62%, #0a0a0c 100%)`,
      border: `1px solid ${accent}33`
    }
  }, /*#__PURE__*/React.createElement("span", {
    style: {
      position: "absolute",
      inset: 0,
      pointerEvents: "none",
      backgroundImage: "radial-gradient(circle, rgba(255,255,255,.05) .8px, transparent 1.2px)",
      backgroundSize: "13px 13px",
      maskImage: "linear-gradient(150deg, black, transparent 72%)",
      WebkitMaskImage: "linear-gradient(150deg, black, transparent 72%)"
    }
  }), /*#__PURE__*/React.createElement("span", {
    style: {
      position: "relative",
      fontFamily: BBJ_MONO,
      fontWeight: 700,
      fontSize: 13,
      color: "#fff",
      letterSpacing: ".04em"
    }
  }, g.game), /*#__PURE__*/React.createElement("span", {
    style: {
      position: "relative",
      fontFamily: BBJ_SANS,
      fontWeight: 700,
      fontSize: 10.5,
      letterSpacing: ".12em",
      color: "#8A8A93"
    }
  }, g.sub.toUpperCase()), /*#__PURE__*/React.createElement("span", {
    style: {
      position: "relative",
      marginTop: 3,
      paddingTop: 9,
      borderTop: "1px solid rgba(255,255,255,.1)",
      fontFamily: BBJ_SANS,
      fontWeight: 600,
      fontSize: 11,
      lineHeight: 1.35,
      color: "#D8D8DF"
    }
  }, verb, " ", /*#__PURE__*/React.createElement("span", {
    style: {
      color: "#FF8A93",
      fontWeight: 700
    }
  }, g.cond), " or better"))));
}

// ── no-scroll trigger grid (2 columns; the widest tile spans full width) ────
function BbTriggerGrid({
  triggers,
  verb,
  accent
}) {
  const wideIdx = triggers.reduce((mi, t, i, a) => t.cards.length > a[mi].cards.length ? i : mi, 0);
  const ordered = [triggers[wideIdx], ...triggers.filter((_, i) => i !== wideIdx)];
  return /*#__PURE__*/React.createElement("div", {
    style: {
      display: "grid",
      gridTemplateColumns: "1fr 1fr",
      gap: 8
    }
  }, ordered.map(t => {
    const wide = t === triggers[wideIdx];
    const cw = wide ? 34 : t.cards.length >= 5 ? 25 : 30;
    return /*#__PURE__*/React.createElement("div", {
      key: t.title || t.game,
      style: {
        gridColumn: wide ? "1 / -1" : "auto",
        borderRadius: 14,
        background: "rgba(255,255,255,.06)",
        border: "1px solid rgba(255,255,255,.13)",
        padding: "12px 10px 13px",
        display: "flex",
        flexDirection: "column",
        alignItems: "center",
        textAlign: "center",
        gap: 9
      }
    }, /*#__PURE__*/React.createElement("div", {
      style: {
        fontFamily: BBJ_MONO,
        fontWeight: 700,
        fontSize: 11,
        color: "#fff",
        letterSpacing: ".03em"
      }
    }, t.title || t.game), /*#__PURE__*/React.createElement("div", {
      style: {
        display: "flex",
        justifyContent: "center",
        gap: 3.5
      }
    }, t.cards.map((c, j) => /*#__PURE__*/React.createElement(BbCard, {
      key: j,
      r: c[0],
      s: c[1],
      w: cw
    }))), /*#__PURE__*/React.createElement("div", {
      style: {
        fontFamily: BBJ_SANS,
        fontWeight: 600,
        fontSize: 11,
        lineHeight: 1.4,
        color: "#D8D8DF"
      }
    }, t.note ? /*#__PURE__*/React.createElement(React.Fragment, null, t.note.pre, /*#__PURE__*/React.createElement("span", {
      style: {
        color: "#FF8A93",
        fontWeight: 700
      }
    }, t.note.hi), t.note.tail ? " " + t.note.tail : "") : /*#__PURE__*/React.createElement(React.Fragment, null, verb, " ", /*#__PURE__*/React.createElement("span", {
      style: {
        color: "#FF8A93",
        fontWeight: 700
      }
    }, t.cond), " or better")));
  }));
}

// ── pool-by-stake table ─────────────────────────────────────────────────────
function BbPoolTable() {
  return /*#__PURE__*/React.createElement("div", {
    style: {
      borderRadius: 16,
      background: "rgba(255,255,255,.06)",
      border: "1px solid rgba(255,255,255,.13)",
      overflow: "hidden"
    }
  }, /*#__PURE__*/React.createElement("div", {
    style: {
      display: "flex",
      padding: "10px 15px",
      background: "rgba(255,255,255,.06)"
    }
  }, /*#__PURE__*/React.createElement("span", {
    style: {
      flex: 1,
      fontFamily: BBJ_SANS,
      fontWeight: 700,
      fontSize: 10.5,
      letterSpacing: ".16em",
      color: "#A9A9B2"
    }
  }, "STAKE"), /*#__PURE__*/React.createElement("span", {
    style: {
      fontFamily: BBJ_SANS,
      fontWeight: 700,
      fontSize: 10.5,
      letterSpacing: ".16em",
      color: "#A9A9B2"
    }
  }, "POOL")), GJ_POOL_BY_STAKE.map((r, i) => /*#__PURE__*/React.createElement("div", {
    key: i,
    style: {
      display: "flex",
      alignItems: "center",
      padding: "9px 15px",
      borderTop: "1px solid rgba(255,255,255,.085)"
    }
  }, /*#__PURE__*/React.createElement("span", {
    style: {
      flex: 1,
      fontFamily: BBJ_MONO,
      fontWeight: 700,
      fontSize: 11,
      color: "#fff",
      fontVariantNumeric: "tabular-nums",
      letterSpacing: ".02em"
    }
  }, r.stake), /*#__PURE__*/React.createElement("span", {
    style: {
      fontFamily: BBJ_MONO,
      fontWeight: 700,
      fontSize: 11,
      color: BBJ_GOLD,
      fontVariantNumeric: "tabular-nums"
    }
  }, r.pool))));
}

// ── payout breakdown ────────────────────────────────────────────────────────
function BbPayout({
  rows,
  accent
}) {
  return /*#__PURE__*/React.createElement("div", {
    style: {
      borderRadius: 16,
      background: "rgba(255,255,255,.06)",
      border: "1px solid rgba(255,255,255,.13)",
      overflow: "hidden"
    }
  }, rows.map((r, i) => /*#__PURE__*/React.createElement("div", {
    key: i,
    style: {
      display: "flex",
      alignItems: "center",
      gap: 12,
      padding: "13px 15px",
      borderTop: i ? "1px solid rgba(255,255,255,.085)" : 0
    }
  }, /*#__PURE__*/React.createElement("span", {
    style: {
      flex: 1,
      minWidth: 0
    }
  }, /*#__PURE__*/React.createElement("span", {
    style: {
      display: "block",
      fontFamily: BBJ_MONO,
      fontWeight: 700,
      fontSize: 12,
      color: "#fff",
      letterSpacing: ".04em"
    }
  }, r.who), r.sub ? /*#__PURE__*/React.createElement("span", {
    style: {
      display: "block",
      fontFamily: BBJ_SANS,
      fontWeight: 600,
      fontSize: 10.5,
      color: "#A9A9B2",
      marginTop: 3
    }
  }, r.sub) : null), /*#__PURE__*/React.createElement("span", {
    style: {
      fontFamily: BBJ_MONO,
      fontWeight: 700,
      fontSize: 20,
      color: i === 0 ? accent : "#fff",
      fontVariantNumeric: "tabular-nums"
    }
  }, r.pct))));
}

// count-up used by the all-time-biggest hero slot
function useBbCountUp(target, run, ms) {
  const [v, setV] = React.useState(0);
  React.useEffect(() => {
    if (!run) {
      setV(0);
      return;
    }
    let raf, start;
    const dur = ms || 1500;
    const tick = t => {
      if (start == null) start = t;
      const p = Math.min(1, (t - start) / dur);
      setV(Math.round(target * (1 - Math.pow(1 - p, 3))));
      if (p < 1) raf = requestAnimationFrame(tick);
    };
    raf = requestAnimationFrame(tick);
    return () => cancelAnimationFrame(raf);
  }, [run, target]);
  return v;
}

// Seamless-loop background: Higgsfield clips don't frame-match end→start, so
// we crossfade two offset copies — one fades in while the other wraps.
function BbChipsBg() {
  const a = React.useRef(null),
    b = React.useRef(null);
  React.useEffect(() => {
    const A = a.current,
      B = b.current;
    if (!A || !B) return;
    const CF = 0.7;
    let active = A,
      idle = B,
      raf = 0;
    A.style.opacity = "1";
    B.style.opacity = "0";
    A.play().catch(() => {});
    const tick = () => {
      const d = active.duration || 5,
        rem = d - active.currentTime;
      if (rem <= CF && isFinite(d)) {
        if (idle.paused) {
          idle.currentTime = 0;
          idle.play().catch(() => {});
        }
        const t = Math.min(1, (CF - rem) / CF);
        active.style.opacity = String(0.5 * (1 - t));
        idle.style.opacity = String(0.5 * t);
        if (rem <= 0.03 || active.ended) {
          active.pause();
          active.style.opacity = "0";
          const tmp = active;
          active = idle;
          idle = tmp;
          active.style.opacity = "0.5";
        }
      } else {
        active.style.opacity = "0.5";
      }
      raf = requestAnimationFrame(tick);
    };
    raf = requestAnimationFrame(tick);
    return () => cancelAnimationFrame(raf);
  }, []);
  const base = {
    position: "absolute",
    inset: 0,
    width: "100%",
    height: "100%",
    objectFit: "cover",
    pointerEvents: "none",
    opacity: 0
  };
  return /*#__PURE__*/React.createElement(React.Fragment, null, /*#__PURE__*/React.createElement("video", {
    ref: a,
    src: "assets/chips-falling.mp4",
    muted: true,
    playsInline: true,
    preload: "auto",
    style: base
  }), /*#__PURE__*/React.createElement("video", {
    ref: b,
    src: "assets/chips-falling.mp4",
    muted: true,
    playsInline: true,
    preload: "auto",
    style: base
  }));
}

// Featured all-time record hit: numbers roll up like a counter, then glow.
function BbTopWinner({
  w,
  accent,
  onOpen
}) {
  const [run, setRun] = React.useState(false);
  const [glow, setGlow] = React.useState(false);
  const target = bbAmt(w.amt);
  React.useEffect(() => {
    setRun(false);
    setGlow(false);
    const r = requestAnimationFrame(() => setRun(true));
    const t = setTimeout(() => setGlow(true), 1500);
    return () => {
      cancelAnimationFrame(r);
      clearTimeout(t);
    };
  }, [w]);
  const v = useBbCountUp(target, run, 1550);
  return /*#__PURE__*/React.createElement("button", {
    onClick: onOpen,
    style: {
      position: "relative",
      overflow: "hidden",
      width: "100%",
      textAlign: "left",
      cursor: "pointer",
      borderRadius: 20,
      border: `1px solid ${accent}`,
      background: `linear-gradient(150deg, ${accent}26, ${accent}0a 58%, transparent)`,
      padding: "15px 16px 16px",
      marginBottom: 12
    }
  }, /*#__PURE__*/React.createElement(BbChipsBg, null), /*#__PURE__*/React.createElement("div", {
    style: {
      position: "absolute",
      inset: 0,
      pointerEvents: "none",
      background: `linear-gradient(150deg, ${accent}30, rgba(10,10,12,.72) 60%, rgba(10,10,12,.92))`
    }
  }), /*#__PURE__*/React.createElement("div", {
    style: {
      position: "absolute",
      inset: 0,
      pointerEvents: "none",
      background: `radial-gradient(ellipse 72% 62% at 82% 0%, ${accent}33, transparent 60%)`
    }
  }), /*#__PURE__*/React.createElement("div", {
    style: {
      position: "relative",
      display: "flex",
      alignItems: "center",
      gap: 8,
      marginBottom: 13
    }
  }, /*#__PURE__*/React.createElement("span", {
    style: {
      fontFamily: BBJ_SANS,
      fontWeight: 700,
      fontSize: 10.5,
      letterSpacing: ".18em",
      color: "#fff",
      background: accent,
      padding: "4px 10px",
      borderRadius: 125,
      boxShadow: `0 4px 14px ${accent}66`
    }
  }, "ALL-TIME BIGGEST"), /*#__PURE__*/React.createElement("span", {
    style: {
      fontFamily: BBJ_SANS,
      fontWeight: 700,
      fontSize: 10.5,
      letterSpacing: ".16em",
      color: "#A9A9B2"
    }
  }, "RECORD HIT")), /*#__PURE__*/React.createElement("div", {
    style: {
      position: "relative",
      display: "flex",
      alignItems: "center",
      gap: 13
    }
  }, /*#__PURE__*/React.createElement(BbAvatar, {
    name: w.name,
    suit: w.suit,
    size: 46
  }), /*#__PURE__*/React.createElement("span", {
    style: {
      flex: 1,
      minWidth: 0
    }
  }, /*#__PURE__*/React.createElement("span", {
    style: {
      display: "block",
      fontFamily: BBJ_MONO,
      fontWeight: 700,
      fontSize: 15,
      color: "#fff",
      letterSpacing: ".02em"
    }
  }, w.name), /*#__PURE__*/React.createElement("span", {
    style: {
      display: "block",
      fontFamily: BBJ_SANS,
      fontWeight: 600,
      fontSize: 10.5,
      color: "#A9A9B2",
      marginTop: 3
    }
  }, w.game, " \xB7 ", w.hand)), /*#__PURE__*/React.createElement("svg", {
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
  }))), /*#__PURE__*/React.createElement("div", {
    style: {
      position: "relative",
      marginTop: 13,
      fontFamily: BBJ_MONO,
      fontWeight: 700,
      fontSize: 40,
      lineHeight: 1,
      letterSpacing: ".01em",
      color: BBJ_GOLD,
      fontVariantNumeric: "tabular-nums",
      textShadow: glow ? `0 0 26px ${BBJ_GOLD}99, 0 0 8px ${BBJ_GOLD}66` : "none",
      transition: "text-shadow .7s ease"
    }
  }, "$", v.toLocaleString("en-US").split(",").join("\u00A0")));
}

// initial-based avatar
const BBJ_AV_BG = ["#3a2a2f", "#2a3340", "#33322a", "#2e2a3a", "#2a3a33", "#382a34"];
function BbAvatar({
  name = "?",
  suit,
  size = 40
}) {
  const clean = name.replace(/[^A-Za-z0-9]/g, "");
  const letter = (clean.charAt(0) || "?").toUpperCase();
  let h = 0;
  for (let i = 0; i < name.length; i++) h = h * 31 + name.charCodeAt(i) >>> 0;
  const bg = BBJ_AV_BG[h % BBJ_AV_BG.length];
  const red = suit === "heart" || suit === "diamond";
  return /*#__PURE__*/React.createElement("span", {
    style: {
      flex: "none",
      width: size,
      height: size,
      borderRadius: "50%",
      background: `linear-gradient(150deg, ${bg}, #141418)`,
      border: `1.5px solid ${red ? "rgba(215,25,33,.5)" : "rgba(255,255,255,.16)"}`,
      display: "flex",
      alignItems: "center",
      justifyContent: "center"
    }
  }, /*#__PURE__*/React.createElement("span", {
    style: {
      fontFamily: BBJ_MONO,
      fontWeight: 700,
      fontSize: Math.round(size * 0.4),
      color: "#fff",
      letterSpacing: ".02em"
    }
  }, letter));
}
function BadBeatPage({
  open,
  onClose,
  accent = BBJ_ARC,
  onPlayCash
}) {
  const [mounted, setMounted] = React.useState(false);
  const [jackpot, setJackpot] = React.useState(1247389.45);
  const [jp, setJp] = React.useState("badbeat"); // which jackpot: badbeat | highhand
  const [tab, setTab] = React.useState("winners"); // winners | rules
  const [hhGame, setHhGame] = React.useState("holdem"); // High Hand game filter
  const [room, setRoom] = React.useState("cash"); // п.2: кеш або швидкий покер
  const [winner, setWinner] = React.useState(null);
  React.useEffect(() => {
    if (!open) {
      setMounted(false);
      return;
    }
    const r = requestAnimationFrame(() => setMounted(true));
    return () => cancelAnimationFrame(r);
  }, [open]);
  React.useEffect(() => {
    if (!open) return;
    const j = setInterval(() => setJackpot(v => v + Math.random() * 4.5 + 0.5), 1500);
    return () => clearInterval(j);
  }, [open]);
  if (!open) return null;
  const click = f => {
    if (window.playClick) window.playClick(f, 0.04);
  };
  const value = jackpot.toLocaleString("en-US", {
    minimumFractionDigits: 2,
    maximumFractionDigits: 2
  });
  const dollars = value.split(".")[0].split(",").join("\u00A0"),
    cents = value.split(".")[1];
  const meta = GJ_JACKPOTS[jp];
  const hhPay = HH_PAYOUT_BY_GAME[hhGame];
  const payoutRows = jp === "badbeat" ? GJ_PAYOUT.badbeat : hhPay.rows.map(([who, val]) => ({
    who,
    sub: "",
    pct: `${val} ${hhPay.unit}`
  }));
  const winners = gjWinnersFor(jp);
  const top = gjTopFor(jp);
  const rest = winners.filter(w => w !== top);
  return /*#__PURE__*/React.createElement("div", {
    style: {
      position: "absolute",
      inset: 0,
      zIndex: 70,
      background: "#070708",
      transform: mounted ? "translateY(0)" : "translateY(100%)",
      transition: "transform 360ms cubic-bezier(0.2,0.8,0.2,1)",
      display: "flex",
      flexDirection: "column"
    }
  }, /*#__PURE__*/React.createElement("style", null, `@keyframes bbj-shine{0%{transform:translateX(-120%)}60%,100%{transform:translateX(320%)}}@keyframes bbj-pulse{0%,100%{opacity:1}50%{opacity:.4}}`), /*#__PURE__*/React.createElement("div", {
    style: {
      position: "absolute",
      inset: 0,
      pointerEvents: "none",
      backgroundImage: "radial-gradient(circle, rgba(255,255,255,.045) .6px, transparent 1px)",
      backgroundSize: "12px 12px"
    }
  }), /*#__PURE__*/React.createElement("div", {
    style: {
      position: "relative",
      zIndex: 5,
      paddingTop: 52,
      paddingLeft: 14,
      paddingRight: 14,
      paddingBottom: 8,
      display: "flex",
      alignItems: "center"
    }
  }, /*#__PURE__*/React.createElement("button", {
    onClick: () => {
      click(900);
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
      fontFamily: BBJ_MONO,
      fontWeight: 700,
      fontSize: 15,
      color: "#fff",
      letterSpacing: ".16em"
    }
  }, "GRAND JACKPOT"), window.InfoDot ? /*#__PURE__*/React.createElement(window.InfoDot, {
    title: "GRAND JACKPOT"
  }) : null), /*#__PURE__*/React.createElement("span", {
    style: {
      flex: "none",
      width: 36
    }
  })), /*#__PURE__*/React.createElement("div", {
    style: {
      flex: 1,
      overflowY: "auto",
      overflowX: "hidden",
      WebkitOverflowScrolling: "touch",
      padding: "6px 16px 48px",
      position: "relative",
      zIndex: 2
    }
  }, /*#__PURE__*/React.createElement("div", {
    style: {
      position: "relative",
      overflow: "hidden",
      borderRadius: 20,
      border: `1px solid ${accent}`,
      backgroundColor: "#12060a",
      backgroundImage: "url('assets/jackpot-bg/hero-v15.png')",
      backgroundSize: "100% calc(100% + 30px)",
      backgroundPosition: "center bottom",
      backgroundRepeat: "no-repeat",
      padding: "26px 18px 24px",
      minHeight: 204,
      textAlign: "center",
      boxShadow: "0 18px 44px rgba(0,0,0,.5)"
    }
  }, /*#__PURE__*/React.createElement("div", {
    style: {
      position: "absolute",
      inset: 0,
      background: "linear-gradient(180deg, rgba(0,0,0,.14) 0%, rgba(0,0,0,0) 40%, rgba(0,0,0,.12) 100%)",
      pointerEvents: "none"
    }
  }), /*#__PURE__*/React.createElement("div", {
    style: {
      position: "absolute",
      inset: 0,
      backgroundImage: "radial-gradient(circle, rgba(255,255,255,.14) .8px, transparent 1.2px)",
      backgroundSize: "14px 14px",
      maskImage: "linear-gradient(160deg, black, transparent 62%)",
      WebkitMaskImage: "linear-gradient(160deg, black, transparent 62%)",
      pointerEvents: "none"
    }
  }), /*#__PURE__*/React.createElement("div", {
    style: {
      position: "absolute",
      top: 0,
      bottom: 0,
      width: 90,
      background: "linear-gradient(105deg, transparent, rgba(255,255,255,.35), transparent)",
      animation: "bbj-shine 4.5s ease-in-out infinite",
      pointerEvents: "none"
    }
  }), window.MarqueeSign ? /*#__PURE__*/React.createElement("span", {
    style: {
      position: "relative",
      display: "block",
      width: "80%",
      maxWidth: 272,
      margin: "14px auto 0"
    }
  }, /*#__PURE__*/React.createElement(window.MarqueeSign, {
    width: "100%",
    px: 272
  })) : /*#__PURE__*/React.createElement("img", {
    src: "assets/wordmarks/grand-jackpot.png",
    alt: "Grand Jackpot",
    style: {
      position: "relative",
      display: "block",
      width: "78%",
      maxWidth: 268,
      height: "auto",
      margin: "14px auto 4px",
      filter: "drop-shadow(0 6px 16px rgba(0,0,0,.55))"
    }
  }), /*#__PURE__*/React.createElement("div", {
    style: {
      position: "relative",
      marginTop: 116,
      display: "flex",
      alignItems: "flex-start",
      justifyContent: "center",
      color: "#fff"
    }
  }, window.LockCounter ? /*#__PURE__*/React.createElement(window.LockCounter, {
    text: dollars,
    h: 58,
    prefix: "$",
    sepColor: "rgba(255,255,255,.72)"
  }) : /*#__PURE__*/React.createElement("span", {
    style: {
      fontFamily: BBJ_MONO,
      fontWeight: 700,
      fontSize: 60,
      lineHeight: 1,
      fontVariantNumeric: "tabular-nums"
    }
  }, "$", dollars)), /*#__PURE__*/React.createElement("div", {
    style: {
      position: "relative",
      marginTop: 14,
      fontFamily: BBJ_SANS,
      fontWeight: 600,
      fontSize: 11,
      color: "#fff",
      textShadow: "0 1px 3px rgba(0,0,0,.85)",
      lineHeight: 1.5,
      maxWidth: 300,
      marginLeft: "auto",
      marginRight: "auto",
      textWrap: "pretty"
    }
  }, "One pool, two ways to win \u2014 Bad Beat & High Hand.")), /*#__PURE__*/React.createElement("button", {
    onClick: () => {
      click(1400);
      if (onPlayCash) onPlayCash();else if (window.__nav) {
        onClose();
        window.__nav.cash(true);
      }
    },
    style: {
      width: "100%",
      marginTop: 16,
      padding: "15px 0",
      borderRadius: 125,
      cursor: "pointer",
      border: 0,
      background: accent,
      boxShadow: `0 14px 30px ${accent}55`,
      display: "flex",
      alignItems: "center",
      justifyContent: "center",
      gap: 9
    }
  }, /*#__PURE__*/React.createElement("span", {
    style: {
      fontFamily: BBJ_MONO,
      fontWeight: 700,
      fontSize: 13,
      letterSpacing: ".14em",
      color: "#fff"
    }
  }, "PLAY CASH GAMES"), /*#__PURE__*/React.createElement("svg", {
    width: "15",
    height: "15",
    viewBox: "0 0 24 24",
    fill: "none",
    stroke: "#fff",
    strokeWidth: "2.4",
    strokeLinecap: "round",
    strokeLinejoin: "round"
  }, /*#__PURE__*/React.createElement("path", {
    d: "M9 6l6 6-6 6"
  }))), /*#__PURE__*/React.createElement("div", {
    style: {
      display: "flex",
      gap: 5,
      marginTop: 16,
      padding: 4,
      borderRadius: 125,
      background: "rgba(255,255,255,.075)",
      border: "1px solid rgba(255,255,255,.13)"
    }
  }, Object.keys(GJ_JACKPOTS).map(id => {
    const on = jp === id;
    return /*#__PURE__*/React.createElement("button", {
      key: id,
      onClick: () => {
        click(1150);
        setJp(id);
      },
      style: {
        flex: 1,
        padding: "12px 0",
        borderRadius: 125,
        border: 0,
        cursor: "pointer",
        background: on ? accent : "transparent",
        color: on ? "#fff" : "rgba(255,255,255,.55)",
        fontFamily: BBJ_MONO,
        fontWeight: 700,
        fontSize: 12,
        letterSpacing: ".14em",
        boxShadow: on ? `0 6px 16px ${accent}55` : "none",
        transition: "background .15s, color .15s"
      }
    }, GJ_JACKPOTS[id].label);
  })), /*#__PURE__*/React.createElement("div", {
    style: {
      marginTop: 12,
      textAlign: "center",
      fontFamily: BBJ_SANS,
      fontWeight: 600,
      fontSize: 11,
      lineHeight: 1.5,
      color: "#D8D8DF",
      maxWidth: 320,
      marginLeft: "auto",
      marginRight: "auto",
      textWrap: "pretty"
    }
  }, meta.blurb), /*#__PURE__*/React.createElement("div", {
    style: {
      display: "flex",
      marginTop: 18,
      borderBottom: "1px solid rgba(255,255,255,.14)"
    }
  }, [["winners", "WINNERS"], ["rules", "RULES"]].map(([id, label]) => {
    const on = tab === id;
    return /*#__PURE__*/React.createElement("button", {
      key: id,
      onClick: () => {
        click(1100);
        setTab(id);
      },
      style: {
        flex: 1,
        position: "relative",
        background: "transparent",
        border: 0,
        cursor: "pointer",
        padding: "2px 0 11px",
        fontFamily: BBJ_MONO,
        fontWeight: 700,
        fontSize: 12,
        letterSpacing: ".14em",
        color: on ? "#fff" : "rgba(255,255,255,.42)",
        transition: "color .15s"
      }
    }, label, on && /*#__PURE__*/React.createElement("span", {
      style: {
        position: "absolute",
        left: 0,
        right: 0,
        bottom: -1,
        height: 2,
        borderRadius: 2,
        background: accent
      }
    }));
  })), tab === "winners" ? /*#__PURE__*/React.createElement(React.Fragment, null, /*#__PURE__*/React.createElement("div", {
    style: {
      display: "flex",
      alignItems: "center",
      justifyContent: "space-between",
      margin: "18px 3px 12px"
    }
  }, /*#__PURE__*/React.createElement("span", {
    style: {
      fontFamily: BBJ_SANS,
      fontWeight: 700,
      fontSize: 10.5,
      letterSpacing: ".2em",
      color: "#A9A9B2"
    }
  }, winners.length, " ", meta.label, " WINNERS"), /*#__PURE__*/React.createElement("span", {
    style: {
      fontFamily: BBJ_SANS,
      fontWeight: 700,
      fontSize: 10.5,
      letterSpacing: ".16em",
      color: "#A9A9B2"
    }
  }, "RECENT")), /*#__PURE__*/React.createElement(BbTopWinner, {
    w: top,
    accent: accent,
    onOpen: () => {
      click(1300);
      setWinner(top);
    }
  }), /*#__PURE__*/React.createElement("div", {
    style: {
      display: "flex",
      flexDirection: "column",
      gap: 8
    }
  }, rest.map((w, i) => /*#__PURE__*/React.createElement("button", {
    key: i,
    onClick: () => {
      click(1200);
      setWinner(w);
    },
    style: {
      display: "flex",
      alignItems: "center",
      gap: 12,
      borderRadius: 14,
      background: "rgba(255,255,255,.06)",
      border: "1px solid rgba(255,255,255,.13)",
      padding: "10px 12px",
      cursor: "pointer",
      textAlign: "left",
      width: "100%"
    }
  }, /*#__PURE__*/React.createElement(BbAvatar, {
    name: w.name,
    suit: w.suit
  }), /*#__PURE__*/React.createElement("span", {
    style: {
      flex: 1,
      minWidth: 0
    }
  }, /*#__PURE__*/React.createElement("span", {
    style: {
      display: "block",
      fontFamily: BBJ_MONO,
      fontWeight: 700,
      fontSize: 13,
      color: "#fff",
      letterSpacing: ".02em"
    }
  }, w.name), /*#__PURE__*/React.createElement("span", {
    style: {
      display: "block",
      fontFamily: BBJ_SANS,
      fontWeight: 600,
      fontSize: 10.5,
      color: "#A9A9B2",
      letterSpacing: ".03em",
      marginTop: 3
    }
  }, w.game, " \xB7 ", w.hand, " \xB7 ", w.when)), /*#__PURE__*/React.createElement("span", {
    style: {
      fontFamily: BBJ_MONO,
      fontWeight: 700,
      fontSize: 14,
      color: BBJ_GOLD,
      fontVariantNumeric: "tabular-nums",
      whiteSpace: "nowrap"
    }
  }, w.amt), /*#__PURE__*/React.createElement("svg", {
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
  })))))) : /*#__PURE__*/React.createElement(React.Fragment, null, jp === "highhand" && /*#__PURE__*/React.createElement("div", {
    style: {
      display: "flex",
      alignItems: "center",
      gap: 10,
      marginTop: 20
    }
  }, /*#__PURE__*/React.createElement("span", {
    style: {
      fontFamily: BBJ_SANS,
      fontWeight: 700,
      fontSize: 10.5,
      letterSpacing: ".18em",
      color: "#A9A9B2"
    }
  }, "GAME"), /*#__PURE__*/React.createElement("div", {
    style: {
      display: "flex",
      gap: 6,
      flexWrap: "wrap"
    }
  }, HH_GAMES.map(([id, label]) => {
    const on = hhGame === id;
    return /*#__PURE__*/React.createElement("button", {
      key: id,
      onClick: () => {
        click(1050);
        setHhGame(id);
      },
      style: {
        padding: "7px 13px",
        borderRadius: 125,
        cursor: "pointer",
        border: `1px solid ${on ? accent : "rgba(255,255,255,.16)"}`,
        background: on ? accent : "rgba(255,255,255,.065)",
        color: on ? "#fff" : "rgba(255,255,255,.6)",
        fontFamily: BBJ_MONO,
        fontWeight: 700,
        fontSize: 10.5,
        letterSpacing: ".06em",
        boxShadow: on ? `0 5px 14px ${accent}44` : "none",
        transition: "background .15s"
      }
    }, label);
  }))), /*#__PURE__*/React.createElement(BbSection, {
    accent: accent,
    sub: jp === "badbeat" ? "Qualifying losing hand per game" : `Qualifying hands · ${hhPay.label}`
  }, jp === "badbeat" ? "WHERE IT RUNS" : "WHAT TRIGGERS IT"), jp === "badbeat" && /*#__PURE__*/React.createElement("div", {
    style: {
      display: "flex",
      gap: 3,
      height: 40,
      boxSizing: "border-box",
      padding: 3,
      marginBottom: 10,
      borderRadius: 12,
      background: "rgba(255,255,255,.075)",
      border: "1px solid rgba(255,255,255,.13)"
    }
  }, BB_ROOMS.map(([id, label]) => {
    const on = room === id;
    return /*#__PURE__*/React.createElement("button", {
      key: id,
      onClick: () => {
        click(1050);
        setRoom(id);
      },
      style: {
        flex: 1,
        minWidth: 0,
        borderRadius: 8,
        border: 0,
        cursor: "pointer",
        display: "flex",
        alignItems: "center",
        justifyContent: "center",
        whiteSpace: "nowrap",
        background: on ? accent : "transparent",
        color: on ? "#fff" : "rgba(255,255,255,.55)",
        fontFamily: BBJ_MONO,
        fontWeight: 700,
        fontSize: 10.5,
        letterSpacing: ".1em",
        transition: "all 160ms"
      }
    }, label);
  })), jp === "badbeat" ? /*#__PURE__*/React.createElement(BbGameGrid, {
    games: room === "fast" ? BB_TRIGGERS_FAST : BB_TRIGGERS_CASH,
    verb: meta.verb,
    accent: accent
  }) : /*#__PURE__*/React.createElement(BbTriggerGrid, {
    triggers: hhTriggers(hhGame),
    verb: meta.verb,
    accent: accent
  }), /*#__PURE__*/React.createElement(BbSection, {
    accent: accent,
    sub: "You play for the pool at your table's stake"
  }, "POOL BY STAKE"), /*#__PURE__*/React.createElement(BbPoolTable, null), /*#__PURE__*/React.createElement(BbSection, {
    accent: accent,
    sub: jp === "badbeat" ? "Same rates across every game" : hhPay.label
  }, "JACKPOT PAYOUT"), /*#__PURE__*/React.createElement(BbPayout, {
    rows: payoutRows,
    accent: accent
  }), /*#__PURE__*/React.createElement("div", {
    style: {
      marginTop: 8,
      fontFamily: BBJ_SANS,
      fontWeight: 600,
      fontSize: 11,
      lineHeight: 1.5,
      color: "#D8D8DF",
      textAlign: "center"
    }
  }, jp === "badbeat" ? "The remaining balance reseeds the next Grand Jackpot." : "Paid from the shared pool as a fixed multiple of the big blind."), /*#__PURE__*/React.createElement(BbSection, {
    accent: accent
  }, "RULES"), /*#__PURE__*/React.createElement("div", {
    style: {
      borderRadius: 16,
      background: "rgba(255,255,255,.06)",
      border: "1px solid rgba(255,255,255,.13)",
      padding: "6px 16px"
    }
  }, GJ_RULES[jp].map((r, i) => /*#__PURE__*/React.createElement("div", {
    key: i,
    style: {
      display: "flex",
      gap: 11,
      padding: "12px 0",
      borderTop: i ? "1px solid rgba(255,255,255,.085)" : 0
    }
  }, /*#__PURE__*/React.createElement("span", {
    style: {
      flex: "none",
      fontFamily: BBJ_MONO,
      fontWeight: 700,
      fontSize: 11,
      color: accent,
      marginTop: 1,
      width: 16
    }
  }, String(i + 1).padStart(2, "0")), /*#__PURE__*/React.createElement("span", {
    style: {
      fontFamily: BBJ_SANS,
      fontWeight: 500,
      fontSize: 12,
      lineHeight: 1.55,
      color: "#D8D8DF",
      textWrap: "pretty"
    }
  }, r)))), /*#__PURE__*/React.createElement("button", {
    onClick: () => {
      if (window.playClick) window.playClick(1100, .04);
      if (window.showScreenInfo) window.showScreenInfo({
        kicker: "BAD BEAT JACKPOT",
        title: "RULES",
        body: "Lose with four of a kind (eights or better) at a qualifying hold'em table and the jackpot pays: 50% to the losing hand, 25% to the winner, 25% split between the table. Both hole cards must play.",
        accent: "#D71921",
        noLink: true
      });
    },
    style: {
      width: "100%",
      marginTop: 10,
      padding: "14px 0",
      borderRadius: 125,
      cursor: "pointer",
      background: "rgba(255,255,255,.075)",
      border: "1px solid rgba(255,255,255,.18)",
      cursor: "default",
      opacity: 0.55,
      display: "flex",
      alignItems: "center",
      justifyContent: "center",
      gap: 8
    }
  }, /*#__PURE__*/React.createElement("span", {
    style: {
      fontFamily: BBJ_MONO,
      fontWeight: 700,
      fontSize: 12,
      letterSpacing: ".12em",
      color: "#D8D8DF"
    }
  }, "MORE RULES"), /*#__PURE__*/React.createElement("svg", {
    width: "14",
    height: "14",
    viewBox: "0 0 24 24",
    fill: "none",
    stroke: "rgba(255,255,255,.6)",
    strokeWidth: "2.2",
    strokeLinecap: "round",
    strokeLinejoin: "round"
  }, /*#__PURE__*/React.createElement("path", {
    d: "M9 6l6 6-6 6"
  })))), /*#__PURE__*/React.createElement("div", {
    style: {
      marginTop: 20,
      textAlign: "center",
      fontFamily: BBJ_SANS,
      fontWeight: 600,
      fontSize: 11,
      letterSpacing: ".06em",
      color: "#D8D8DF",
      lineHeight: 1.5
    }
  }, "Jackpot values update live. Qualifying rules apply per game and stake. Play responsibly.")), winner && /*#__PURE__*/React.createElement("div", {
    style: {
      position: "absolute",
      inset: 0,
      zIndex: 80,
      background: "#070708",
      display: "flex",
      flexDirection: "column"
    }
  }, /*#__PURE__*/React.createElement("div", {
    style: {
      position: "absolute",
      inset: 0,
      pointerEvents: "none",
      backgroundImage: "radial-gradient(circle, rgba(255,255,255,.045) .6px, transparent 1px)",
      backgroundSize: "12px 12px"
    }
  }), /*#__PURE__*/React.createElement("div", {
    style: {
      position: "relative",
      zIndex: 5,
      paddingTop: 52,
      paddingLeft: 14,
      paddingRight: 14,
      paddingBottom: 8,
      display: "flex",
      alignItems: "center"
    }
  }, /*#__PURE__*/React.createElement("button", {
    onClick: () => {
      click(900);
      setWinner(null);
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
      flex: 1,
      textAlign: "center",
      fontFamily: BBJ_MONO,
      fontSize: 12,
      color: "#D8D8DF",
      letterSpacing: ".2em"
    }
  }, "HAND REPLAY"), /*#__PURE__*/React.createElement("span", {
    style: {
      width: 36
    }
  })), /*#__PURE__*/React.createElement("div", {
    style: {
      flex: 1,
      display: "flex",
      flexDirection: "column",
      alignItems: "center",
      justifyContent: "center",
      padding: "0 30px",
      position: "relative",
      zIndex: 2,
      textAlign: "center"
    }
  }, /*#__PURE__*/React.createElement("span", {
    style: {
      fontFamily: BBJ_MONO,
      fontWeight: 700,
      fontSize: 20,
      color: "#fff",
      letterSpacing: ".03em"
    }
  }, winner.name), /*#__PURE__*/React.createElement("span", {
    style: {
      fontFamily: BBJ_SANS,
      fontWeight: 600,
      fontSize: 11,
      color: "#A9A9B2",
      letterSpacing: ".06em",
      marginTop: 8
    }
  }, winner.game, " \xB7 ", winner.hand, " \xB7 ", winner.when), /*#__PURE__*/React.createElement("span", {
    style: {
      fontFamily: BBJ_MONO,
      fontWeight: 700,
      fontSize: 30,
      color: BBJ_GOLD,
      marginTop: 16,
      fontVariantNumeric: "tabular-nums"
    }
  }, winner.amt), /*#__PURE__*/React.createElement("span", {
    style: {
      marginTop: 26,
      fontFamily: BBJ_SANS,
      fontWeight: 600,
      fontSize: 12,
      color: "#8A8A93",
      letterSpacing: ".14em"
    }
  }, "[ HAND REPLAY \u2014 COMING SOON ]"))));
}
Object.assign(window, {
  BadBeatPage,
  BB_TRIGGERS_CASH,
  BB_TRIGGERS_FAST
});