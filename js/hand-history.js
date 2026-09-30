// Hand History — the player's own last 100 hands, opened from PROFILE.
// A row per hand: when, table + stakes, your hole cards, the result.
// Tapping a row opens the existing replay overlay.

const MONO_HH = UI.font;
const SANS_HH = UI.fontUI;
const HH_CAP = 100; // 7.6 — nothing older than the last 100

const HH_DISCS = ["ALL", "HOLD'EM", "PLO", "PLO6", "SHORT DECK"];
// E4 (Финальная оценка, п.4): у історії були лише кеш-руки. Формат —
// другий вимір: кеш / турнір / Spin & Win; у турнірних і спінових руках
// замість лімітів показуємо назву події і рівень блайндів.
const HH_FORMATS = ["ALL", "CASH", "TOURNEY", "SPIN & WIN"];
const HH_FMT_RU = {
  "ALL": "ВСЕ",
  "CASH": "КЭШ",
  "TOURNEY": "ТУРНИРЫ",
  "SPIN & WIN": "SPIN"
};
const HH_DISC_RU = {
  "ALL": "ВСЕ",
  "HOLD'EM": "ХОЛДЕМ",
  "PLO": "PLO",
  "PLO6": "PLO6",
  "SHORT DECK": "КОРОТКАЯ"
};
const HH_EVENTS = ["SPRING MILLIONS", "DAILY MAIN EVENT", "HYPER NIGHT BOUNTY", "OMAHOLIC BIG BOUNTY", "LAST CHANCE"];
const HH_LEVELS = ["LVL 4 · 200/400", "LVL 7 · 600/1 200", "LVL 11 · 2 000/4 000", "LVL 15 · 6 000/12 000"];
const HH_SPINS = ["$1 SPIN & WIN", "$3 SPIN & WIN", "$5 SPIN & WIN", "$20 SPIN & WIN"];
const HH_RANKS = ["A", "K", "Q", "J", "T", "9", "8", "7", "6", "5", "4", "3", "2"];
const HH_SUITS = ["spade", "heart", "diamond", "club"];
const HH_STAKES = {
  "HOLD'EM": ["$0.50 / $1", "$1 / $2", "$2 / $5"],
  "PLO": ["$0.25 / $0.50", "$1 / $2"],
  "PLO6": ["$0.50 / $1"],
  "SHORT DECK": ["$2 / $4"]
};
const HH_STREETS = ["PREFLOP", "FLOP", "TURN", "RIVER", "SHOWDOWN"];

// deterministic pseudo-random so the list is stable between renders
function hhRand(seed) {
  let x = Math.sin(seed) * 10000;
  return x - Math.floor(x);
}
const HH_HANDS = Array.from({
  length: HH_CAP
}, (_, i) => {
  const r = k => hhRand(i * 7.13 + k);
  const disc = HH_DISCS[1 + Math.floor(r(1) * 4)];
  const stakes = HH_STAKES[disc][Math.floor(r(2) * HH_STAKES[disc].length)];
  const n = disc === "PLO6" ? 6 : disc === "PLO" ? 4 : 2;
  const cards = Array.from({
    length: n
  }, (_, c) => ({
    r: HH_RANKS[Math.floor(r(10 + c) * HH_RANKS.length)],
    s: HH_SUITS[Math.floor(r(30 + c) * 4)]
  }));
  const won = r(3) > 0.56;
  const bb = Number(String(stakes).split("/").pop().replace(/[^0-9.]/g, "")) || 1;
  const amt = Math.round(bb * (2 + r(4) * 60) * 100) / 100;
  const mins = Math.round(i * (11 + r(5) * 40));
  const t = new Date(Date.now() - mins * 60000);
  const pad = x => String(x).padStart(2, "0");
  // 55% кеш, 30% турніри, 15% Spin & Win — приблизно як у реальному трафіку
  const fr = r(8);
  const format = fr < 0.55 ? "CASH" : fr < 0.85 ? "TOURNEY" : "SPIN & WIN";
  const event = format === "TOURNEY" ? HH_EVENTS[Math.floor(r(9) * HH_EVENTS.length)] : format === "SPIN & WIN" ? HH_SPINS[Math.floor(r(9) * HH_SPINS.length)] : null;
  const level = format === "TOURNEY" ? HH_LEVELS[Math.floor(r(11) * HH_LEVELS.length)] : null;
  return {
    id: "h" + i,
    disc: format === "SPIN & WIN" ? "HOLD'EM" : disc,
    stakes,
    cards,
    won,
    amt,
    format,
    event,
    level,
    street: HH_STREETS[Math.floor(r(6) * HH_STREETS.length)],
    table: "TABLE " + (10 + Math.floor(r(7) * 80)),
    when: `${t.getFullYear()}/${pad(t.getMonth() + 1)}/${pad(t.getDate())} ${pad(t.getHours())}:${pad(t.getMinutes())}`
  };
});
const HH_COLOR = {
  "HOLD'EM": "#16948B",
  "PLO": "#C9A227",
  "PLO6": "#7A5CD6",
  "SHORT DECK": "#E2603A"
};
const hhClick = f => {
  if (window.playClick) window.playClick(f || 1100, 0.04);
};
function HhCards({
  cards,
  color
}) {
  return /*#__PURE__*/React.createElement("span", {
    style: {
      display: "inline-flex",
      alignItems: "center",
      gap: cards.length > 4 ? 3 : 5
    }
  }, cards.map((c, i) => {
    // п.6 (ревʼю 08.09): як у пілзах активних столів — номінал завжди
    // білий, масть червона для черв і буб, біла для пік і треф
    const red = c.s === "heart" || c.s === "diamond";
    const ink = red ? "#E5484D" : "#fff";
    return /*#__PURE__*/React.createElement("span", {
      key: i,
      style: {
        display: "inline-flex",
        flexDirection: "column",
        alignItems: "center",
        lineHeight: 1
      }
    }, window.Suit ? /*#__PURE__*/React.createElement(window.Suit, {
      kind: c.s,
      size: cards.length > 4 ? 8 : 9.5,
      color: ink
    }) : null, /*#__PURE__*/React.createElement("span", {
      style: {
        fontFamily: MONO_HH,
        fontWeight: 700,
        fontSize: cards.length > 4 ? 9.5 : 11,
        color: "#fff",
        lineHeight: 1.05,
        marginTop: 1
      }
    }, c.r));
  }));
}
function HhHandRow({
  hand: h,
  onOpen
}) {
  const c = HH_COLOR[h.disc] || UI.accent,
    sim = window.hdSim ? window.hdSim(h) : null,
    delta = sim ? sim.heroDelta : h.won ? h.amt : -h.amt;
  return /*#__PURE__*/React.createElement("button", {
    className: "hh-hand-row",
    style: {
      '--hand-color': c
    },
    onClick: onOpen,
    "aria-label": `Раздача ${h.event || h.disc + ' ' + h.stakes} ${h.when}`
  }, /*#__PURE__*/React.createElement("i", null), /*#__PURE__*/React.createElement("span", {
    className: "hh-hand-copy"
  }, /*#__PURE__*/React.createElement("span", {
    className: "hh-hand-top"
  }, /*#__PURE__*/React.createElement(HhCards, {
    cards: h.cards,
    color: c
  }), /*#__PURE__*/React.createElement("b", null, h.format === 'CASH' ? h.disc + ' · ' + h.stakes : h.event)), /*#__PURE__*/React.createElement("small", null, h.when, " \xB7 ", h.street)), /*#__PURE__*/React.createElement("span", {
    className: "hh-hand-money",
    "data-positive": delta > 0,
    "data-negative": delta < 0
  }, (delta > 0 ? '+' : delta < 0 ? '−' : '') + '$' + Math.abs(delta).toFixed(2)), /*#__PURE__*/React.createElement("svg", {
    width: "12",
    height: "12",
    viewBox: "0 0 24 24",
    fill: "none",
    stroke: "#8792a3",
    strokeWidth: "1.5"
  }, /*#__PURE__*/React.createElement("path", {
    d: "m9 5 7 7-7 7"
  })));
}
function HandHistoryScreen({
  open,
  onClose,
  accent = "#D71921",
  initialFormat = 'ALL',
  initialDisc = 'ALL'
}) {
  const [mounted, setMounted] = React.useState(false);
  const [disc, setDisc] = React.useState(initialDisc);
  const [replay, setReplay] = React.useState(null);
  const [detail, setDetail] = React.useState(-1);
  const [limit, setLimit] = React.useState(8);
  const [fmt, setFmt] = React.useState(initialFormat); // E4: кеш / турнір / Spin & Win
  React.useEffect(() => {
    if (!open) return;
    window.dispatchEvent(new CustomEvent("px-full", {
      detail: 1
    }));
    return () => window.dispatchEvent(new CustomEvent("px-full", {
      detail: -1
    }));
  }, [open]);
  React.useEffect(() => {
    if (!open) {
      setMounted(false);
      setDisc(initialDisc);
      setFmt(initialFormat);
      setReplay(null);
      setDetail(-1);
      setLimit(8);
      return;
    }
    const r = requestAnimationFrame(() => setMounted(true));
    const grow = setTimeout(() => setLimit(25), 260);
    return () => {
      cancelAnimationFrame(r);
      clearTimeout(grow);
    };
  }, [open, initialDisc, initialFormat]);
  if (!open) return null;
  let hhRu = false;
  if (window.PXI18N && window.PXI18N.lang) hhRu = window.PXI18N.lang === "ru";else {
    try {
      hhRu = localStorage.getItem("pokerix_lang") === "ru";
    } catch (e) {}
  }
  const rows = HH_HANDS.filter(h => (fmt === "ALL" || h.format === fmt) && (disc === "ALL" || h.disc === disc));
  const page = rows.slice(0, limit);
  return /*#__PURE__*/React.createElement("div", {
    "data-hand-history": "true",
    role: "dialog",
    "aria-label": "\u0418\u0441\u0442\u043E\u0440\u0438\u044F \u0440\u0430\u0437\u0434\u0430\u0447",
    style: {
      position: "absolute",
      inset: 0,
      zIndex: 62,
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
      height: 220,
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
      paddingRight: 16,
      paddingBottom: 8,
      display: "flex",
      alignItems: "center",
      gap: 10
    }
  }, /*#__PURE__*/React.createElement("button", {
    onClick: () => {
      hhClick(900);
      onClose();
    },
    "aria-label": "Back",
    style: {
      flex: "none",
      width: 36,
      height: 36,
      borderRadius: 12,
      background: "#14171c",
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
      marginRight: 36,
      fontFamily: MONO_HH,
      fontWeight: 700,
      fontSize: 15,
      letterSpacing: ".16em",
      color: "#fff"
    }
  }, "HAND HISTORY")), /*#__PURE__*/React.createElement("div", {
    style: {
      position: "relative",
      zIndex: 3,
      padding: "6px 16px 0"
    }
  }, /*#__PURE__*/React.createElement("div", {
    "data-i18n": "off",
    style: {
      display: "flex",
      gap: 3,
      height: 40,
      boxSizing: "border-box",
      padding: 3,
      borderRadius: 12,
      background: "#14171c",
      border: "1px solid rgba(255,255,255,.13)"
    }
  }, HH_FORMATS.map(f => {
    const on = f === fmt;
    return /*#__PURE__*/React.createElement("button", {
      key: f,
      onClick: () => {
        hhClick(1150);
        setFmt(f);
        if (f === "SPIN & WIN") setDisc("ALL");
      },
      style: {
        flex: 1,
        minWidth: 0,
        padding: "0 6px",
        borderRadius: 8,
        border: 0,
        cursor: "pointer",
        display: "flex",
        alignItems: "center",
        justifyContent: "center",
        background: on ? accent : "transparent",
        color: on ? "#fff" : "rgba(255,255,255,.55)",
        fontFamily: MONO_HH,
        fontWeight: 700,
        fontSize: 12,
        letterSpacing: ".1em",
        whiteSpace: "nowrap",
        overflow: "hidden",
        textOverflow: "ellipsis",
        transition: "all 160ms"
      }
    }, hhRu ? HH_FMT_RU[f] || f : f === "SPIN & WIN" ? "SPIN" : f);
  }))), /*#__PURE__*/React.createElement("div", {
    "data-i18n": "off",
    style: {
      position: "relative",
      zIndex: 3,
      padding: "8px 16px 0"
    }
  }, /*#__PURE__*/React.createElement("div", {
    style: {
      display: "flex",
      gap: 3,
      height: 34,
      boxSizing: "border-box",
      padding: 3,
      borderRadius: 12,
      background: "rgba(255,255,255,.055)",
      border: "1px solid rgba(255,255,255,.1)",
      overflowX: "auto",
      scrollbarWidth: "none"
    }
  }, HH_DISCS.map(d => {
    const on = d === disc;
    const c = HH_COLOR[d] || accent;
    return /*#__PURE__*/React.createElement("button", {
      key: d,
      onClick: () => {
        hhClick(1150);
        setDisc(d);
      },
      style: {
        flex: "1 1 auto",
        minWidth: "max-content",
        padding: "0 8px",
        borderRadius: 8,
        border: 0,
        cursor: "pointer",
        display: "flex",
        alignItems: "center",
        justifyContent: "center",
        whiteSpace: "nowrap",
        background: on ? c : "transparent",
        color: on ? "#fff" : "rgba(255,255,255,.5)",
        fontFamily: MONO_HH,
        fontWeight: 700,
        fontSize: 12,
        letterSpacing: ".08em",
        transition: "all 160ms"
      }
    }, hhRu ? HH_DISC_RU[d] || d : d);
  }))), /*#__PURE__*/React.createElement("div", {
    style: {
      position: "relative",
      zIndex: 2,
      padding: "12px 16px 0"
    }
  }, /*#__PURE__*/React.createElement("span", {
    style: {
      fontFamily: MONO_HH,
      fontSize: 12,
      letterSpacing: ".22em",
      color: "#A9A9B2"
    }
  }, "LAST " + HH_CAP + " HANDS")), /*#__PURE__*/React.createElement("div", {
    style: {
      flex: 1,
      minHeight: 0,
      overflowY: "auto",
      WebkitOverflowScrolling: "touch",
      position: "relative",
      zIndex: 2,
      padding: "10px 16px 104px",
      visibility: detail >= 0 ? "hidden" : "visible"
    }
  }, /*#__PURE__*/React.createElement("div", {
    style: {
      borderRadius: 14,
      overflow: "hidden",
      background: "linear-gradient(150deg,#141419 0%,#0c0c0f 62%,#0a0a0c 100%)",
      border: "1px solid rgba(255,255,255,.08)"
    }
  }, page.map((h, i) => /*#__PURE__*/React.createElement(HhHandRow, {
    key: h.id,
    hand: h,
    onOpen: () => {
      hhClick(1250);
      setDetail(i);
    }
  }))), limit < rows.length && /*#__PURE__*/React.createElement("button", {
    onClick: () => {
      hhClick(1100);
      setLimit(limit + 25);
    },
    style: Object.assign(UI.btn("m", "ghost", accent), {
      width: "100%",
      marginTop: 10
    })
  }, typeof window.t === "function" ? window.t("hh.more") : "SHOW MORE", " \xB7 ", rows.length - limit), /*#__PURE__*/React.createElement("div", {
    style: {
      marginTop: 12,
      textAlign: "center",
      fontFamily: SANS_HH,
      fontWeight: 600,
      fontSize: 12,
      lineHeight: 1.6,
      color: "#8A8A93"
    }
  }, "Only the last ", HH_CAP, " hands are kept. Tournament hands are stored with the event.")), window.HandDetailScreen && /*#__PURE__*/React.createElement(window.HandDetailScreen, {
    open: detail >= 0,
    hand: rows[detail] || null,
    index: detail,
    total: rows.length,
    accent: HH_COLOR[(rows[detail] || {}).disc] || accent,
    onClose: () => setDetail(-1),
    onPrev: () => setDetail(d => Math.max(0, d - 1)),
    onNext: () => setDetail(d => Math.min(rows.length - 1, d + 1)),
    onReplay: () => setReplay(rows[detail] || null)
  }), replay && (window.HandReplayV2 ? /*#__PURE__*/React.createElement(window.HandReplayV2, {
    open: true,
    hand: replay,
    onClose: () => setReplay(null),
    accent: HH_COLOR[replay.disc] || accent
  }) : window.HandReplay ? /*#__PURE__*/React.createElement(window.HandReplay, {
    open: true,
    onClose: () => setReplay(null),
    accent: HH_COLOR[replay.disc] || accent,
    discipline: replay.disc,
    stakes: replay.stakes
  }) : null));
}
Object.assign(window, {
  HandHistoryScreen,
  HhHandRow,
  HhCards,
  hhHands: HH_HANDS
});