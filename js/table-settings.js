// Table settings — the full desk-client preference set, rebuilt for the phone.
// Reference layout is a two-pane desktop dialog (rail + page + Apply bar); on a
// 375-wide screen that becomes a scrollable tab rail, one pane at a time, and a
// docked APPLY bar. Desktop-only rows (mouse wheel, window) are re-cast as their
// touch equivalents. House style: black, dot grid, Arcanium red, mono headings.

const TSET_MONO = UI.font;
const TSET_SANS = UI.fontUI;
const tsetClick = (f, v) => {
  if (window.playClick) window.playClick(f || 1100, v || 0.035);
};
const TSET_TABS = [{
  id: "bet",
  label: "BETTING"
}, {
  id: "buyin",
  label: "BUY-IN"
}, {
  id: "sound",
  label: "SOUNDS"
}, {
  id: "focus",
  label: "AUTO-FOCUS"
}, {
  id: "quick",
  label: "QUICK ACTIONS"
}, {
  id: "theme",
  label: "TABLE THEME"
}, {
  id: "bank",
  label: "TIME BANK"
}, {
  id: "money",
  label: "CURRENCY"
}, {
  id: "view",
  label: "TABLE VIEW"
}, {
  id: "lang",
  label: "LANGUAGE"
}, {
  id: "tz",
  label: "TIME ZONE"
}, {
  id: "emoji",
  label: "EMOJI KEYS"
}];
const TSET_DEFAULTS = {
  betUnit: "BB",
  confirmBet: "NEVER",
  roundBlind: false,
  openSizes: ["2 BB", "3 BB", "4 BB", "POT"],
  potSizes: ["33%", "50%", "75%", "MAX"],
  buyinSource: "USD",
  buyinPct: 55,
  autoBuyin: false,
  sounds: true,
  volMusic: 60,
  volFx: 72,
  volDealer: 55,
  dealerVoice: true,
  voice: "laura",
  autoFocus: true,
  quick: true,
  pre: {
    checkFold: true,
    callAny: false,
    raiseAny: false,
    autoMuck: true
  },
  felt: "carbon",
  deck: "4col",
  back: "red",
  bank: "money-no-blinds",
  money: "BOTH",
  view: {
    avatars: true,
    compact: false,
    nicknames: true,
    dealerTrail: true
  },
  lang: "EN",
  tz: "UTC+02:00 · KYIV",
  emoji: true,
  emojiSet: {
    win: ["😎", "🤫", "😜"],
    lose: ["😱", "🤯", "😤"],
    draw: ["😐", "🤝", "😏"]
  }
};
const TSET_OPEN_OPTS = ["2 BB", "2.5 BB", "3 BB", "4 BB", "5 BB", "POT"];
const TSET_POT_OPTS = ["25%", "33%", "50%", "66%", "75%", "100%", "MAX"];
const TSET_VOICES = [{
  id: "laura",
  name: "LAURA",
  tag: "EN"
}, {
  id: "johnny",
  name: "JOHNNY",
  tag: "EN"
}, {
  id: "linlin",
  name: "LINLIN",
  tag: "TW"
}, {
  id: "yuki",
  name: "YUKI",
  tag: "JP"
}];
const TSET_FELTS = [{
  id: "carbon",
  name: "CARBON",
  c: "#16181c"
}, {
  id: "green",
  name: "CLASSIC",
  c: "#124d2e"
}, {
  id: "blue",
  name: "MIDNIGHT",
  c: "#132a4d"
}, {
  id: "wine",
  name: "WINE",
  c: "#3d1119"
}];
const TSET_BANK_MODES = [{
  id: "always",
  t: "On every decision",
  s: "Time bank runs on each of your turns until it is spent."
}, {
  id: "money-blinds",
  t: "Only with money in the pot",
  s: "Blinds and antes included."
}, {
  id: "money-no-blinds",
  t: "Only with money in the pot",
  s: "Blinds and antes excluded."
}, {
  id: "manual",
  t: "Manual",
  s: "You start the time bank yourself."
}];
const TSET_LANGS = ["EN · ENGLISH", "UK · УКРАЇНСЬКА", "RU · РУССКИЙ", "PT · PORTUGUÊS", "ES · ESPAÑOL", "ZH · 中文", "JA · 日本語"];
const TSET_TZS = ["UTC−05:00 · NEW YORK", "UTC+00:00 · LONDON", "UTC+01:00 · BERLIN", "UTC+02:00 · KYIV", "UTC+03:00 · ISTANBUL", "UTC+04:00 · DUBAI", "UTC+08:00 · MANILA"];
const TSET_EMOJI_POOL = ["😎", "🤫", "😜", "😱", "🤯", "😤", "😐", "🤝", "😏", "🥶", "🙃", "🤠", "😴", "🤡", "👑", "🔥"];

// ── controls ───────────────────────────────────────────────────────────────
function TsetSwitch({
  on,
  accent
}) {
  return /*#__PURE__*/React.createElement("span", {
    style: {
      flex: "none",
      width: 42,
      height: 24,
      borderRadius: 12,
      background: on ? accent : "rgba(255,255,255,.12)",
      border: `1px solid ${on ? accent : "rgba(255,255,255,.2)"}`,
      position: "relative",
      transition: "background 160ms, border-color 160ms"
    }
  }, /*#__PURE__*/React.createElement("span", {
    style: {
      position: "absolute",
      top: 2,
      left: on ? 20 : 2,
      width: 18,
      height: 18,
      borderRadius: "50%",
      background: "#fff",
      transition: "left 160ms cubic-bezier(.2,.8,.2,1)"
    }
  }));
}
function TsetToggleRow({
  label,
  note,
  on,
  accent,
  onTap,
  first
}) {
  return /*#__PURE__*/React.createElement("button", {
    onClick: () => {
      tsetClick(1150);
      onTap();
    },
    style: {
      display: "flex",
      alignItems: "center",
      gap: 12,
      width: "100%",
      padding: "13px 13px",
      cursor: "pointer",
      textAlign: "left",
      background: "transparent",
      border: 0,
      borderTop: first ? 0 : "1px solid rgba(255,255,255,.07)"
    }
  }, /*#__PURE__*/React.createElement("span", {
    style: {
      flex: 1,
      minWidth: 0
    }
  }, /*#__PURE__*/React.createElement("span", {
    style: {
      display: "block",
      fontFamily: TSET_SANS,
      fontWeight: 700,
      fontSize: 12,
      letterSpacing: ".06em",
      color: "#fff"
    }
  }, label), note ? /*#__PURE__*/React.createElement("span", {
    style: {
      display: "block",
      marginTop: 3,
      fontFamily: TSET_SANS,
      fontWeight: 600,
      fontSize: 10.5,
      color: "#8A8A93",
      lineHeight: 1.4
    }
  }, note) : null), /*#__PURE__*/React.createElement(TsetSwitch, {
    on: on,
    accent: accent
  }));
}
function TsetSeg({
  options,
  value,
  onPick,
  accent
}) {
  return /*#__PURE__*/React.createElement("div", {
    style: {
      display: "flex",
      gap: 6
    }
  }, options.map(o => {
    const on = o === value;
    return /*#__PURE__*/React.createElement("button", {
      key: o,
      onClick: () => {
        tsetClick(1200);
        onPick(o);
      },
      style: {
        flex: 1,
        minWidth: 0,
        height: 36,
        borderRadius: 12,
        cursor: "pointer",
        padding: "0 8px",
        background: on ? accent : "rgba(255,255,255,.055)",
        border: `1px solid ${on ? accent : "rgba(255,255,255,.14)"}`,
        fontFamily: TSET_SANS,
        fontWeight: 700,
        fontSize: 10.5,
        letterSpacing: ".1em",
        color: on ? "#fff" : "rgba(255,255,255,.6)",
        whiteSpace: "nowrap",
        overflow: "hidden",
        textOverflow: "ellipsis"
      }
    }, o);
  }));
}
function TsetRadio({
  on,
  accent
}) {
  return /*#__PURE__*/React.createElement("span", {
    style: {
      flex: "none",
      width: 19,
      height: 19,
      borderRadius: "50%",
      border: `1.6px solid ${on ? accent : "rgba(255,255,255,.28)"}`,
      background: on ? `${accent}22` : "transparent",
      display: "flex",
      alignItems: "center",
      justifyContent: "center"
    }
  }, on ? /*#__PURE__*/React.createElement("span", {
    style: {
      width: 9,
      height: 9,
      borderRadius: "50%",
      background: accent
    }
  }) : null);
}
function TsetRadioRow({
  title,
  sub,
  on,
  accent,
  onTap,
  first
}) {
  return /*#__PURE__*/React.createElement("button", {
    onClick: () => {
      tsetClick(1150);
      onTap();
    },
    style: {
      display: "flex",
      alignItems: "flex-start",
      gap: 11,
      width: "100%",
      padding: "12px 13px",
      cursor: "pointer",
      textAlign: "left",
      background: on ? "rgba(255,255,255,.03)" : "transparent",
      border: 0,
      borderTop: first ? 0 : "1px solid rgba(255,255,255,.07)"
    }
  }, /*#__PURE__*/React.createElement("span", {
    style: {
      marginTop: 1
    }
  }, /*#__PURE__*/React.createElement(TsetRadio, {
    on: on,
    accent: accent
  })), /*#__PURE__*/React.createElement("span", {
    style: {
      flex: 1,
      minWidth: 0
    }
  }, /*#__PURE__*/React.createElement("span", {
    style: {
      display: "block",
      fontFamily: TSET_SANS,
      fontWeight: 700,
      fontSize: 12,
      letterSpacing: ".04em",
      color: on ? "#fff" : "rgba(255,255,255,.82)"
    }
  }, title), sub ? /*#__PURE__*/React.createElement("span", {
    style: {
      display: "block",
      marginTop: 3,
      fontFamily: TSET_SANS,
      fontWeight: 600,
      fontSize: 10.5,
      color: "#8A8A93",
      lineHeight: 1.45
    }
  }, sub) : null));
}
function TsetSelect({
  value,
  options,
  onPick,
  accent
}) {
  const [open, setOpen] = React.useState(false);
  return /*#__PURE__*/React.createElement("div", {
    style: {
      position: "relative",
      flex: 1,
      minWidth: 0
    }
  }, /*#__PURE__*/React.createElement("button", {
    onClick: () => {
      tsetClick(1100);
      setOpen(!open);
    },
    style: {
      width: "100%",
      height: 34,
      padding: "0 9px",
      borderRadius: 12,
      cursor: "pointer",
      background: "rgba(255,255,255,.06)",
      border: `1px solid ${open ? accent : "rgba(255,255,255,.15)"}`,
      display: "flex",
      alignItems: "center",
      justifyContent: "space-between",
      gap: 4
    }
  }, /*#__PURE__*/React.createElement("span", {
    style: {
      fontFamily: TSET_MONO,
      fontWeight: 700,
      fontSize: 11,
      color: "#fff",
      whiteSpace: "nowrap",
      overflow: "hidden",
      textOverflow: "ellipsis"
    }
  }, value), /*#__PURE__*/React.createElement("svg", {
    width: "12",
    height: "12",
    viewBox: "0 0 24 24",
    fill: "none",
    stroke: "rgba(255,255,255,.5)",
    strokeWidth: "2.6",
    strokeLinecap: "round",
    strokeLinejoin: "round",
    style: {
      flex: "none",
      transform: open ? "rotate(180deg)" : "none",
      transition: "transform 150ms"
    }
  }, /*#__PURE__*/React.createElement("path", {
    d: "M6 9l6 6 6-6"
  }))), open && /*#__PURE__*/React.createElement("div", {
    style: {
      position: "absolute",
      top: 38,
      left: 0,
      right: 0,
      zIndex: 12,
      borderRadius: 12,
      overflow: "hidden",
      background: "#141419",
      border: "1px solid rgba(255,255,255,.16)",
      boxShadow: "0 18px 36px rgba(0,0,0,.7)"
    }
  }, options.map((o, i) => /*#__PURE__*/React.createElement("button", {
    key: o,
    onClick: () => {
      tsetClick(1050);
      onPick(o);
      setOpen(false);
    },
    style: {
      width: "100%",
      padding: "10px 10px",
      textAlign: "left",
      cursor: "pointer",
      border: 0,
      borderTop: i ? "1px solid rgba(255,255,255,.07)" : 0,
      background: o === value ? `${accent}26` : "transparent",
      fontFamily: TSET_MONO,
      fontWeight: 700,
      fontSize: 11,
      color: o === value ? "#fff" : "rgba(255,255,255,.7)"
    }
  }, o))));
}
function TsetSlider({
  value,
  onChange,
  accent,
  min = 0,
  max = 100,
  left,
  right,
  badge
}) {
  const ref = React.useRef(null);
  const set = clientX => {
    const r = ref.current.getBoundingClientRect();
    const p = Math.min(1, Math.max(0, (clientX - r.left) / r.width));
    onChange(Math.round(min + p * (max - min)));
  };
  const start = e => {
    e.preventDefault();
    const move = ev => set(ev.touches ? ev.touches[0].clientX : ev.clientX);
    move(e.nativeEvent);
    const up = () => {
      window.removeEventListener("pointermove", move);
      window.removeEventListener("pointerup", up);
    };
    window.addEventListener("pointermove", move);
    window.addEventListener("pointerup", up);
  };
  const pct = (value - min) / (max - min) * 100;
  return /*#__PURE__*/React.createElement("div", {
    style: {
      display: "flex",
      alignItems: "center",
      gap: 10
    }
  }, left ? /*#__PURE__*/React.createElement("span", {
    style: {
      flex: "none",
      fontFamily: TSET_SANS,
      fontWeight: 700,
      fontSize: 10.5,
      letterSpacing: ".1em",
      color: "#8A8A93"
    }
  }, left) : null, /*#__PURE__*/React.createElement("div", {
    ref: ref,
    onPointerDown: start,
    style: {
      flex: 1,
      position: "relative",
      height: 26,
      display: "flex",
      alignItems: "center",
      cursor: "pointer",
      touchAction: "none"
    }
  }, /*#__PURE__*/React.createElement("span", {
    style: {
      position: "absolute",
      left: 0,
      right: 0,
      height: 4,
      borderRadius: 2,
      background: "rgba(255,255,255,.14)"
    }
  }), /*#__PURE__*/React.createElement("span", {
    style: {
      position: "absolute",
      left: 0,
      width: pct + "%",
      height: 4,
      borderRadius: 2,
      background: accent,
      boxShadow: `0 0 10px ${accent}77`
    }
  }), /*#__PURE__*/React.createElement("span", {
    style: {
      position: "absolute",
      left: `calc(${pct}% - 9px)`,
      width: 18,
      height: 18,
      borderRadius: "50%",
      background: "#fff",
      boxShadow: "0 2px 8px rgba(0,0,0,.6)"
    }
  }), badge ? /*#__PURE__*/React.createElement("span", {
    style: {
      position: "absolute",
      left: `calc(${pct}% - 20px)`,
      top: -14,
      width: 40,
      textAlign: "center",
      fontFamily: TSET_MONO,
      fontWeight: 700,
      fontSize: 10.5,
      color: accent
    }
  }, value, "%") : null), right ? /*#__PURE__*/React.createElement("span", {
    style: {
      flex: "none",
      fontFamily: TSET_SANS,
      fontWeight: 700,
      fontSize: 10.5,
      letterSpacing: ".1em",
      color: "#8A8A93"
    }
  }, right) : null);
}
const tsetCard = {
  borderRadius: 14,
  background: "linear-gradient(155deg,#141419 0%,#0c0c0f 62%,#0a0a0c 100%)",
  border: "1px solid rgba(255,255,255,.09)",
  overflow: "hidden"
};
function TsetGroup({
  title,
  children,
  note
}) {
  return /*#__PURE__*/React.createElement("div", {
    style: {
      marginBottom: 14
    }
  }, title ? /*#__PURE__*/React.createElement("div", {
    style: {
      fontFamily: TSET_SANS,
      fontWeight: 700,
      fontSize: 10.5,
      letterSpacing: ".2em",
      color: "#8A8A93",
      padding: "0 3px 8px"
    }
  }, title) : null, /*#__PURE__*/React.createElement("div", {
    style: tsetCard
  }, children), note ? /*#__PURE__*/React.createElement("div", {
    style: {
      fontFamily: TSET_SANS,
      fontWeight: 600,
      fontSize: 10.5,
      lineHeight: 1.5,
      color: "#8A8A93",
      padding: "8px 3px 0",
      textWrap: "pretty"
    }
  }, note) : null);
}

// ── panes ──────────────────────────────────────────────────────────────────
function TsetPane({
  id,
  v,
  set,
  accent
}) {
  const pad = {
    padding: "13px 13px"
  };
  if (id === "bet") return /*#__PURE__*/React.createElement(React.Fragment, null, /*#__PURE__*/React.createElement(TsetGroup, {
    title: "BET SIZING"
  }, /*#__PURE__*/React.createElement("div", {
    style: pad
  }, /*#__PURE__*/React.createElement("div", {
    style: {
      fontFamily: TSET_SANS,
      fontWeight: 700,
      fontSize: 11,
      color: "#D8D8DF",
      letterSpacing: ".04em",
      marginBottom: 8
    }
  }, "Change the bet in steps of"), /*#__PURE__*/React.createElement(TsetSeg, {
    options: ["BB", "MONEY"],
    value: v.betUnit,
    onPick: o => set("betUnit", o),
    accent: accent
  }), /*#__PURE__*/React.createElement("div", {
    style: {
      fontFamily: TSET_SANS,
      fontWeight: 700,
      fontSize: 11,
      color: "#D8D8DF",
      letterSpacing: ".04em",
      margin: "14px 0 8px"
    }
  }, "Ask to confirm before the bet goes in"), /*#__PURE__*/React.createElement(TsetSeg, {
    options: ["ALWAYS", "OVER POT", "NEVER"],
    value: v.confirmBet,
    onPick: o => set("confirmBet", o),
    accent: accent
  })), /*#__PURE__*/React.createElement(TsetToggleRow, {
    label: "ROUND TO THE NEAREST BLIND",
    note: "Bet amounts snap to whole blinds",
    on: v.roundBlind,
    accent: accent,
    onTap: () => set("roundBlind", !v.roundBlind)
  })), /*#__PURE__*/React.createElement(TsetGroup, {
    title: "BET BUTTONS",
    note: "Four shortcuts sit above the bet slider at the table \u2014 the first row is used when you open the action, the second when there is already a bet to raise."
  }, /*#__PURE__*/React.createElement("div", {
    style: {
      display: "flex",
      alignItems: "center",
      gap: 6,
      padding: "11px 11px",
      background: "rgba(255,255,255,.03)",
      borderBottom: "1px solid rgba(255,255,255,.07)"
    }
  }, [0, 1, 2, 3].map(i => /*#__PURE__*/React.createElement("span", {
    key: i,
    style: {
      flex: 1,
      height: 30,
      borderRadius: 8,
      background: "rgba(255,255,255,.07)",
      border: "1px solid rgba(255,255,255,.14)",
      display: "flex",
      alignItems: "center",
      justifyContent: "center",
      fontFamily: TSET_MONO,
      fontWeight: 700,
      fontSize: 10.5,
      color: "#fff"
    }
  }, v.openSizes[i]))), /*#__PURE__*/React.createElement("div", {
    style: pad
  }, /*#__PURE__*/React.createElement("div", {
    style: {
      fontFamily: TSET_SANS,
      fontWeight: 700,
      fontSize: 11,
      letterSpacing: ".04em",
      color: "#fff"
    }
  }, "OPENING BET"), /*#__PURE__*/React.createElement("div", {
    style: {
      fontFamily: TSET_SANS,
      fontWeight: 600,
      fontSize: 10.5,
      color: "#8A8A93",
      marginTop: 2,
      marginBottom: 8
    }
  }, "in big blinds"), /*#__PURE__*/React.createElement("div", {
    style: {
      display: "flex",
      gap: 6
    }
  }, [0, 1, 2, 3].map(i => /*#__PURE__*/React.createElement(TsetSelect, {
    key: i,
    value: v.openSizes[i],
    options: TSET_OPEN_OPTS,
    accent: accent,
    onPick: o => set("openSizes", v.openSizes.map((x, j) => j === i ? o : x))
  }))), /*#__PURE__*/React.createElement("div", {
    style: {
      fontFamily: TSET_SANS,
      fontWeight: 700,
      fontSize: 11,
      letterSpacing: ".04em",
      color: "#fff",
      marginTop: 14
    }
  }, "RAISE / BET INTO A POT"), /*#__PURE__*/React.createElement("div", {
    style: {
      fontFamily: TSET_SANS,
      fontWeight: 600,
      fontSize: 10.5,
      color: "#8A8A93",
      marginTop: 2,
      marginBottom: 8
    }
  }, "% of the pot"), /*#__PURE__*/React.createElement("div", {
    style: {
      display: "flex",
      gap: 6
    }
  }, [0, 1, 2, 3].map(i => /*#__PURE__*/React.createElement(TsetSelect, {
    key: i,
    value: v.potSizes[i],
    options: TSET_POT_OPTS,
    accent: accent,
    onPick: o => set("potSizes", v.potSizes.map((x, j) => j === i ? o : x))
  }))))));
  if (id === "buyin") return /*#__PURE__*/React.createElement(React.Fragment, null, /*#__PURE__*/React.createElement(TsetGroup, {
    title: "DEFAULT BUY-IN"
  }, /*#__PURE__*/React.createElement("div", {
    style: pad
  }, /*#__PURE__*/React.createElement("div", {
    style: {
      fontFamily: TSET_SANS,
      fontWeight: 700,
      fontSize: 11,
      color: "#D8D8DF",
      letterSpacing: ".04em",
      marginBottom: 8
    }
  }, "Pay the buy-in from"), /*#__PURE__*/React.createElement(TsetSeg, {
    options: ["USD", "CASH$"],
    value: v.buyinSource,
    onPick: o => set("buyinSource", o),
    accent: accent
  }), /*#__PURE__*/React.createElement("div", {
    style: {
      marginTop: 22
    }
  }, /*#__PURE__*/React.createElement(TsetSlider, {
    value: v.buyinPct,
    onChange: n => set("buyinPct", n),
    accent: accent,
    min: 0,
    max: 100,
    left: "MIN",
    right: "MAX",
    badge: true
  })))), /*#__PURE__*/React.createElement(TsetGroup, {
    note: "If the amount falls below the table minimum you are seated with the table's minimum buy-in."
  }, /*#__PURE__*/React.createElement(TsetToggleRow, {
    first: true,
    label: "AUTO BUY-IN",
    note: "Take the seat straight away, without the buy-in window",
    on: v.autoBuyin,
    accent: accent,
    onTap: () => set("autoBuyin", !v.autoBuyin)
  })));
  if (id === "sound") return /*#__PURE__*/React.createElement(React.Fragment, null, /*#__PURE__*/React.createElement(TsetGroup, null, /*#__PURE__*/React.createElement(TsetToggleRow, {
    first: true,
    label: "TABLE SOUND",
    note: "Chips, cards, the clock and the dealer",
    on: v.sounds,
    accent: accent,
    onTap: () => set("sounds", !v.sounds)
  })), /*#__PURE__*/React.createElement(TsetGroup, {
    title: "LEVELS"
  }, /*#__PURE__*/React.createElement("div", {
    style: {
      ...pad,
      opacity: v.sounds ? 1 : .4,
      pointerEvents: v.sounds ? "auto" : "none"
    }
  }, [["volMusic", "BACKGROUND MUSIC"], ["volFx", "SOUND EFFECTS"], ["volDealer", "DEALER VOICE"]].map(([k, label], i) => /*#__PURE__*/React.createElement("div", {
    key: k,
    style: {
      marginTop: i ? 14 : 0
    }
  }, /*#__PURE__*/React.createElement("div", {
    style: {
      display: "flex",
      justifyContent: "space-between",
      fontFamily: TSET_SANS,
      fontWeight: 700,
      fontSize: 10.5,
      letterSpacing: ".1em",
      color: "#A9A9B2",
      marginBottom: 2
    }
  }, /*#__PURE__*/React.createElement("span", null, label), /*#__PURE__*/React.createElement("span", {
    style: {
      fontFamily: TSET_MONO,
      color: "#fff"
    }
  }, v[k])), /*#__PURE__*/React.createElement(TsetSlider, {
    value: v[k],
    onChange: n => set(k, n),
    accent: accent
  }))))), /*#__PURE__*/React.createElement(TsetGroup, {
    title: "DEALER VOICE"
  }, /*#__PURE__*/React.createElement(TsetToggleRow, {
    first: true,
    label: "ANNOUNCE THE ACTION",
    note: "The dealer calls bets, streets and showdown",
    on: v.dealerVoice,
    accent: accent,
    onTap: () => set("dealerVoice", !v.dealerVoice)
  }), /*#__PURE__*/React.createElement("div", {
    style: {
      display: "grid",
      gridTemplateColumns: "1fr 1fr",
      gap: 7,
      padding: "0 13px 13px",
      opacity: v.dealerVoice ? 1 : .4,
      pointerEvents: v.dealerVoice ? "auto" : "none"
    }
  }, TSET_VOICES.map(vo => {
    const on = vo.id === v.voice;
    return /*#__PURE__*/React.createElement("button", {
      key: vo.id,
      onClick: () => {
        tsetClick(1200);
        set("voice", vo.id);
      },
      style: {
        display: "flex",
        alignItems: "center",
        gap: 8,
        padding: "9px 10px",
        borderRadius: 12,
        cursor: "pointer",
        background: on ? `${accent}1c` : "rgba(255,255,255,.05)",
        border: `1px solid ${on ? accent : "rgba(255,255,255,.13)"}`
      }
    }, /*#__PURE__*/React.createElement(TsetRadio, {
      on: on,
      accent: accent
    }), /*#__PURE__*/React.createElement("span", {
      style: {
        flex: "none",
        padding: "1px 5px",
        borderRadius: 4,
        background: "rgba(255,255,255,.1)",
        fontFamily: TSET_SANS,
        fontWeight: 700,
        fontSize: 8.5,
        letterSpacing: ".08em",
        color: "#D8D8DF"
      }
    }, vo.tag), /*#__PURE__*/React.createElement("span", {
      style: {
        fontFamily: TSET_SANS,
        fontWeight: 700,
        fontSize: 11,
        letterSpacing: ".06em",
        color: "#fff"
      }
    }, vo.name));
  }))));
  if (id === "focus") return /*#__PURE__*/React.createElement(React.Fragment, null, /*#__PURE__*/React.createElement(TsetGroup, {
    note: "With auto-focus on, the app brings the table that needs a decision to the front \u2014 the others stay in the bubble row at the top of the screen."
  }, /*#__PURE__*/React.createElement(TsetToggleRow, {
    first: true,
    label: "AUTO-FOCUS",
    note: "Show the table it is your turn on",
    on: v.autoFocus,
    accent: accent,
    onTap: () => set("autoFocus", !v.autoFocus)
  })), /*#__PURE__*/React.createElement("div", {
    style: {
      ...tsetCard,
      padding: "22px 16px",
      display: "flex",
      alignItems: "center",
      justifyContent: "center",
      height: 168,
      position: "relative"
    }
  }, [0, 1, 2].map(i => {
    const front = i === 2;
    return /*#__PURE__*/React.createElement("span", {
      key: i,
      style: {
        position: "absolute",
        width: 132,
        height: 84,
        borderRadius: 125,
        left: `calc(50% - 66px + ${(i - 1) * 26}px)`,
        top: 30 + i * 14,
        background: front ? "radial-gradient(ellipse 80% 90% at 50% 40%, #1c2027, #0d0f12)" : "#0f1114",
        border: `1.5px solid ${front && v.autoFocus ? accent : "rgba(255,255,255,.14)"}`,
        boxShadow: front && v.autoFocus ? `0 12px 28px ${accent}55` : "0 8px 18px rgba(0,0,0,.5)",
        opacity: front ? 1 : .5,
        transition: "border-color 200ms, box-shadow 200ms"
      }
    }, front ? /*#__PURE__*/React.createElement("span", {
      style: {
        position: "absolute",
        left: "50%",
        top: "50%",
        transform: "translate(-50%,-50%)",
        display: "flex",
        gap: 3
      }
    }, [0, 1, 2].map(k => /*#__PURE__*/React.createElement("span", {
      key: k,
      style: {
        width: 11,
        height: 15,
        borderRadius: 2,
        background: "rgba(255,255,255,.82)"
      }
    }))) : null);
  }), /*#__PURE__*/React.createElement("span", {
    style: {
      position: "absolute",
      bottom: 12,
      fontFamily: TSET_SANS,
      fontWeight: 700,
      fontSize: 10.5,
      letterSpacing: ".16em",
      color: v.autoFocus ? accent : "rgba(255,255,255,.35)"
    }
  }, v.autoFocus ? "YOUR TURN — BROUGHT FORWARD" : "TABLES STAY WHERE THEY ARE")));
  if (id === "quick") return /*#__PURE__*/React.createElement(React.Fragment, null, /*#__PURE__*/React.createElement(TsetGroup, {
    note: "Pre-actions are armed while the other players decide; the moment the action reaches you they fire."
  }, /*#__PURE__*/React.createElement(TsetToggleRow, {
    first: true,
    label: "PRE-ACTION BUTTONS",
    note: "Arm your move before your turn arrives",
    on: v.quick,
    accent: accent,
    onTap: () => set("quick", !v.quick)
  })), /*#__PURE__*/React.createElement(TsetGroup, {
    title: "ARMED ACTIONS"
  }, /*#__PURE__*/React.createElement("div", {
    style: {
      opacity: v.quick ? 1 : .4,
      pointerEvents: v.quick ? "auto" : "none"
    }
  }, [["checkFold", "CHECK / FOLD", "Check when free, fold to a bet"], ["callAny", "CALL ANY", "Call whatever it costs"], ["raiseAny", "RAISE ANY", "Raise as soon as it is on you"], ["autoMuck", "AUTO-MUCK LOSING HANDS", "Never show a beaten hand"]].map(([k, label, note], i) => /*#__PURE__*/React.createElement(TsetToggleRow, {
    key: k,
    first: i === 0,
    label: label,
    note: note,
    on: v.pre[k],
    accent: accent,
    onTap: () => set("pre", {
      ...v.pre,
      [k]: !v.pre[k]
    })
  })))));
  if (id === "theme") return /*#__PURE__*/React.createElement(React.Fragment, null, /*#__PURE__*/React.createElement(TsetGroup, {
    title: "FELT"
  }, /*#__PURE__*/React.createElement("div", {
    style: {
      display: "grid",
      gridTemplateColumns: "1fr 1fr",
      gap: 8,
      padding: 13
    }
  }, TSET_FELTS.map(f => {
    const on = f.id === v.felt;
    return /*#__PURE__*/React.createElement("button", {
      key: f.id,
      onClick: () => {
        tsetClick(1200);
        set("felt", f.id);
      },
      style: {
        padding: 0,
        borderRadius: 12,
        overflow: "hidden",
        cursor: "pointer",
        background: "transparent",
        border: `1.5px solid ${on ? accent : "rgba(255,255,255,.13)"}`,
        boxShadow: on ? `0 8px 20px ${accent}44` : "none"
      }
    }, /*#__PURE__*/React.createElement("span", {
      style: {
        display: "block",
        height: 52,
        background: `radial-gradient(ellipse 80% 90% at 50% 35%, ${f.c}, #08090b)`
      }
    }), /*#__PURE__*/React.createElement("span", {
      style: {
        display: "flex",
        alignItems: "center",
        justifyContent: "center",
        gap: 6,
        padding: "7px 0",
        background: "rgba(255,255,255,.04)",
        fontFamily: TSET_SANS,
        fontWeight: 700,
        fontSize: 10.5,
        letterSpacing: ".12em",
        color: on ? "#fff" : "rgba(255,255,255,.6)"
      }
    }, on ? /*#__PURE__*/React.createElement("svg", {
      width: "11",
      height: "11",
      viewBox: "0 0 24 24",
      fill: "none",
      stroke: accent,
      strokeWidth: "3.4",
      strokeLinecap: "round",
      strokeLinejoin: "round"
    }, /*#__PURE__*/React.createElement("path", {
      d: "M5 12l5 5L20 6"
    })) : null, f.name));
  }))), /*#__PURE__*/React.createElement(TsetGroup, {
    title: "CARDS"
  }, /*#__PURE__*/React.createElement("div", {
    style: pad
  }, /*#__PURE__*/React.createElement("div", {
    style: {
      fontFamily: TSET_SANS,
      fontWeight: 700,
      fontSize: 11,
      color: "#D8D8DF",
      marginBottom: 8
    }
  }, "Deck colours"), /*#__PURE__*/React.createElement(TsetSeg, {
    options: ["2-COLOUR", "4-COLOUR"],
    value: v.deck === "4col" ? "4-COLOUR" : "2-COLOUR",
    onPick: o => set("deck", o === "4-COLOUR" ? "4col" : "2col"),
    accent: accent
  }), /*#__PURE__*/React.createElement("div", {
    style: {
      fontFamily: TSET_SANS,
      fontWeight: 700,
      fontSize: 11,
      color: "#D8D8DF",
      margin: "14px 0 8px"
    }
  }, "Card back"), /*#__PURE__*/React.createElement("div", {
    style: {
      display: "flex",
      gap: 8
    }
  }, [["red", "#D71921"], ["blue", "#3B82F6"], ["mono", "#8b8b93"]].map(([id, col]) => {
    const on = id === v.back;
    return /*#__PURE__*/React.createElement("button", {
      key: id,
      onClick: () => {
        tsetClick(1200);
        set("back", id);
      },
      style: {
        flex: 1,
        height: 56,
        borderRadius: 12,
        cursor: "pointer",
        background: `repeating-linear-gradient(135deg, ${col} 0 5px, ${col}bb 5px 10px)`,
        border: `2px solid ${on ? "#fff" : "rgba(255,255,255,.14)"}`,
        boxShadow: on ? `0 6px 16px ${col}66` : "none"
      }
    });
  })))));
  if (id === "bank") return /*#__PURE__*/React.createElement(React.Fragment, null, /*#__PURE__*/React.createElement(TsetGroup, {
    title: "AUTOMATIC TIME BANK"
  }, /*#__PURE__*/React.createElement("div", {
    style: {
      display: "flex",
      alignItems: "center",
      gap: 14,
      padding: 14
    }
  }, /*#__PURE__*/React.createElement("span", {
    style: {
      flex: "none",
      width: 62,
      height: 62,
      borderRadius: 16,
      background: `linear-gradient(160deg, ${accent}, #7d0f16)`,
      border: "1px solid rgba(255,255,255,.2)",
      boxShadow: `0 10px 24px ${accent}55`,
      display: "flex",
      alignItems: "center",
      justifyContent: "center",
      fontFamily: TSET_MONO,
      fontWeight: 700,
      fontSize: 18,
      color: "#fff"
    }
  }, "+30"), /*#__PURE__*/React.createElement("span", {
    style: {
      flex: 1,
      fontFamily: TSET_SANS,
      fontWeight: 600,
      fontSize: 11,
      lineHeight: 1.55,
      color: "#A9A9B2",
      textWrap: "pretty"
    }
  }, "Adds your time bank automatically on your turn. It keeps working until the bank is spent."))), /*#__PURE__*/React.createElement(TsetGroup, {
    title: "WHEN TO SPEND IT"
  }, TSET_BANK_MODES.map((m, i) => /*#__PURE__*/React.createElement(TsetRadioRow, {
    key: m.id,
    first: i === 0,
    title: m.t,
    sub: m.s,
    on: v.bank === m.id,
    accent: accent,
    onTap: () => set("bank", m.id)
  }))));
  if (id === "money") return /*#__PURE__*/React.createElement(TsetGroup, {
    title: "SHOW AMOUNTS AS",
    note: "Applies to stacks, pots and every bet button at the table."
  }, [["MONEY", "Money", "$1 240"], ["BB", "Big blinds", "124 BB"], ["BOTH", "Both", "$1 240 · 124 BB"]].map(([id2, t, ex], i) => /*#__PURE__*/React.createElement("button", {
    key: id2,
    onClick: () => {
      tsetClick(1150);
      set("money", id2);
    },
    style: {
      display: "flex",
      alignItems: "center",
      gap: 11,
      width: "100%",
      padding: "12px 13px",
      cursor: "pointer",
      textAlign: "left",
      background: v.money === id2 ? "rgba(255,255,255,.03)" : "transparent",
      border: 0,
      borderTop: i ? "1px solid rgba(255,255,255,.07)" : 0
    }
  }, /*#__PURE__*/React.createElement(TsetRadio, {
    on: v.money === id2,
    accent: accent
  }), /*#__PURE__*/React.createElement("span", {
    style: {
      flex: 1,
      fontFamily: TSET_SANS,
      fontWeight: 700,
      fontSize: 12,
      color: "#fff"
    }
  }, t), /*#__PURE__*/React.createElement("span", {
    style: {
      fontFamily: TSET_MONO,
      fontWeight: 700,
      fontSize: 11,
      color: "#A9A9B2"
    }
  }, ex))));
  if (id === "view") return /*#__PURE__*/React.createElement(TsetGroup, {
    title: "AT THE TABLE"
  }, [["avatars", "PLAYER AVATARS", "Photos in the seats"], ["nicknames", "NICKNAMES", "Names above the stacks"], ["compact", "COMPACT SEATS", "Smaller plates, more felt"], ["dealerTrail", "CHIP ANIMATION", "Chips travel to the pot"]].map(([k, label, note], i) => /*#__PURE__*/React.createElement(TsetToggleRow, {
    key: k,
    first: i === 0,
    label: label,
    note: note,
    on: v.view[k],
    accent: accent,
    onTap: () => set("view", {
      ...v.view,
      [k]: !v.view[k]
    })
  })));
  if (id === "lang") return /*#__PURE__*/React.createElement(TsetGroup, {
    title: "LANGUAGE"
  }, TSET_LANGS.map((l, i) => /*#__PURE__*/React.createElement(TsetRadioRow, {
    key: l,
    first: i === 0,
    title: l,
    on: v.lang === l.slice(0, 2),
    accent: accent,
    onTap: () => set("lang", l.slice(0, 2))
  })));
  if (id === "tz") return /*#__PURE__*/React.createElement(TsetGroup, {
    title: "TIME ZONE",
    note: "Tournament start times and the hand history are printed in this zone."
  }, TSET_TZS.map((z, i) => /*#__PURE__*/React.createElement(TsetRadioRow, {
    key: z,
    first: i === 0,
    title: z,
    on: v.tz === z,
    accent: accent,
    onTap: () => set("tz", z)
  })));
  if (id === "emoji") return /*#__PURE__*/React.createElement(React.Fragment, null, /*#__PURE__*/React.createElement(TsetGroup, null, /*#__PURE__*/React.createElement(TsetToggleRow, {
    first: true,
    label: "EMOJI KEYS",
    note: "Send a reaction at showdown",
    on: v.emoji,
    accent: accent,
    onTap: () => set("emoji", !v.emoji)
  })), /*#__PURE__*/React.createElement("div", {
    style: {
      opacity: v.emoji ? 1 : .4,
      pointerEvents: v.emoji ? "auto" : "none"
    }
  }, [["win", "WHEN YOU WIN"], ["lose", "WHEN YOU LOSE"], ["draw", "WHEN IT IS SPLIT"]].map(([k, title]) => /*#__PURE__*/React.createElement(TsetGroup, {
    key: k,
    title: title
  }, /*#__PURE__*/React.createElement("div", {
    style: {
      padding: 12
    }
  }, /*#__PURE__*/React.createElement("div", {
    style: {
      display: "flex",
      gap: 7,
      marginBottom: 9
    }
  }, v.emojiSet[k].map((e, i) => /*#__PURE__*/React.createElement("span", {
    key: i,
    style: {
      flex: "none",
      width: 42,
      height: 42,
      borderRadius: 12,
      background: `${accent}1c`,
      border: `1px solid ${accent}66`,
      display: "flex",
      alignItems: "center",
      justifyContent: "center",
      fontSize: 21
    }
  }, e)), /*#__PURE__*/React.createElement("span", {
    style: {
      flex: 1,
      display: "flex",
      alignItems: "center",
      fontFamily: TSET_SANS,
      fontWeight: 600,
      fontSize: 10.5,
      letterSpacing: ".08em",
      color: "#8A8A93",
      paddingLeft: 4
    }
  }, "TAP BELOW TO SWAP")), /*#__PURE__*/React.createElement("div", {
    style: {
      display: "flex",
      flexWrap: "wrap",
      gap: 6
    }
  }, TSET_EMOJI_POOL.map(e => {
    const on = v.emojiSet[k].indexOf(e) !== -1;
    return /*#__PURE__*/React.createElement("button", {
      key: e,
      onClick: () => {
        tsetClick(1250);
        const cur = v.emojiSet[k];
        const next = on ? cur.filter(x => x !== e) : cur.length >= 3 ? cur.slice(1).concat(e) : cur.concat(e);
        set("emojiSet", {
          ...v.emojiSet,
          [k]: next
        });
      },
      style: {
        width: 34,
        height: 34,
        borderRadius: 12,
        cursor: "pointer",
        fontSize: 17,
        background: on ? "rgba(255,255,255,.12)" : "rgba(255,255,255,.045)",
        border: `1px solid ${on ? "rgba(255,255,255,.3)" : "rgba(255,255,255,.1)"}`
      }
    }, e);
  })))))));
  return null;
}

// ── the screen ─────────────────────────────────────────────────────────────
function TableSettingsScreen({
  open,
  onClose,
  accent = "#D71921"
}) {
  const [mounted, setMounted] = React.useState(false);
  const [tab, setTab] = React.useState("bet");
  const [v, setV] = React.useState(TSET_DEFAULTS);
  const [saved, setSaved] = React.useState(TSET_DEFAULTS);
  const [toast, setToast] = React.useState(false);
  const bodyRef = React.useRef(null);
  React.useEffect(() => {
    if (!open) {
      setMounted(false);
      return;
    }
    setToast(false);
    const r = requestAnimationFrame(() => setMounted(true));
    return () => cancelAnimationFrame(r);
  }, [open]);
  React.useEffect(() => {
    if (bodyRef.current) bodyRef.current.scrollTop = 0;
  }, [tab]);
  if (!open) return null;
  const set = (k, val) => setV(p => ({
    ...p,
    [k]: val
  }));
  const dirty = JSON.stringify(v) !== JSON.stringify(saved);
  return /*#__PURE__*/React.createElement("div", {
    style: {
      position: "absolute",
      inset: 0,
      zIndex: 160,
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
      height: 200,
      pointerEvents: "none",
      background: `radial-gradient(ellipse 90% 70% at 50% 0%, ${accent}20, transparent 62%)`
    }
  }), /*#__PURE__*/React.createElement("div", {
    style: {
      position: "absolute",
      inset: 0,
      pointerEvents: "none",
      backgroundImage: "radial-gradient(circle, rgba(255,255,255,.045) .6px, transparent 1px)",
      backgroundSize: "11px 11px"
    }
  }), /*#__PURE__*/React.createElement("div", {
    style: {
      position: "relative",
      zIndex: 5,
      paddingTop: 54,
      paddingLeft: 14,
      paddingRight: 16,
      paddingBottom: 8,
      display: "flex",
      alignItems: "center",
      gap: 10
    }
  }, /*#__PURE__*/React.createElement("button", {
    onClick: () => {
      tsetClick(900, .04);
      onClose && onClose();
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
      marginRight: 36,
      fontFamily: TSET_MONO,
      fontWeight: 700,
      fontSize: 15,
      color: "#fff",
      letterSpacing: ".16em"
    }
  }, "TABLE SETTINGS")), /*#__PURE__*/React.createElement("div", {
    style: {
      position: "relative",
      zIndex: 4,
      display: "flex",
      gap: 6,
      padding: "6px 16px 0",
      overflowX: "auto",
      scrollbarWidth: "none"
    }
  }, TSET_TABS.map(t => {
    const on = t.id === tab;
    return /*#__PURE__*/React.createElement("button", {
      key: t.id,
      onClick: () => {
        tsetClick(1150);
        setTab(t.id);
      },
      style: {
        flex: "none",
        height: 32,
        padding: "0 13px",
        borderRadius: 125,
        cursor: "pointer",
        background: on ? accent : "rgba(255,255,255,.055)",
        border: `1px solid ${on ? accent : "rgba(255,255,255,.14)"}`,
        fontFamily: TSET_SANS,
        fontWeight: 700,
        fontSize: 10.5,
        letterSpacing: ".12em",
        color: on ? "#fff" : "rgba(255,255,255,.6)",
        whiteSpace: "nowrap"
      }
    }, t.label);
  })), /*#__PURE__*/React.createElement("div", {
    ref: bodyRef,
    style: {
      flex: 1,
      minHeight: 0,
      overflowY: "auto",
      WebkitOverflowScrolling: "touch",
      position: "relative",
      zIndex: 2,
      padding: "14px 16px 20px"
    }
  }, /*#__PURE__*/React.createElement(TsetPane, {
    key: tab,
    id: tab,
    v: v,
    set: set,
    accent: accent
  })), /*#__PURE__*/React.createElement("div", {
    style: {
      position: "relative",
      zIndex: 6,
      display: "flex",
      gap: 9,
      padding: "10px 16px 26px",
      background: "linear-gradient(180deg, transparent, #000 34%)"
    }
  }, /*#__PURE__*/React.createElement("button", {
    onClick: () => {
      tsetClick(850, .04);
      setV(TSET_DEFAULTS);
    },
    style: {
      flex: "none",
      padding: "0 18px",
      height: 46,
      borderRadius: 125,
      cursor: "pointer",
      background: "transparent",
      border: "1px solid rgba(255,255,255,.22)",
      fontFamily: TSET_SANS,
      fontWeight: 700,
      fontSize: 11,
      letterSpacing: ".14em",
      color: "#D8D8DF"
    }
  }, "RESET"), /*#__PURE__*/React.createElement("button", {
    onClick: () => {
      if (!dirty) return;
      tsetClick(1500, .05);
      setSaved(v);
      setToast(true);
      setTimeout(() => setToast(false), 1600);
    },
    style: {
      flex: 1,
      height: 46,
      borderRadius: 125,
      cursor: dirty ? "pointer" : "default",
      border: 0,
      background: dirty ? accent : "rgba(255,255,255,.08)",
      color: dirty ? "#fff" : "rgba(255,255,255,.4)",
      boxShadow: dirty ? `0 12px 26px ${accent}55` : "none",
      fontFamily: TSET_MONO,
      fontWeight: 700,
      fontSize: 14,
      letterSpacing: ".14em",
      transition: "background 160ms, color 160ms"
    }
  }, "APPLY")), toast && /*#__PURE__*/React.createElement("div", {
    style: {
      position: "absolute",
      left: 0,
      right: 0,
      bottom: 92,
      zIndex: 9,
      display: "flex",
      justifyContent: "center",
      pointerEvents: "none"
    }
  }, /*#__PURE__*/React.createElement("span", {
    style: {
      display: "inline-flex",
      alignItems: "center",
      gap: 8,
      padding: "9px 16px",
      borderRadius: 125,
      background: "rgba(91,217,106,.14)",
      border: "1px solid rgba(91,217,106,.5)"
    }
  }, /*#__PURE__*/React.createElement("svg", {
    width: "13",
    height: "13",
    viewBox: "0 0 24 24",
    fill: "none",
    stroke: "#5BD96A",
    strokeWidth: "3.4",
    strokeLinecap: "round",
    strokeLinejoin: "round"
  }, /*#__PURE__*/React.createElement("path", {
    d: "M5 12l5 5L20 6"
  })), /*#__PURE__*/React.createElement("span", {
    style: {
      fontFamily: TSET_SANS,
      fontWeight: 700,
      fontSize: 11,
      letterSpacing: ".14em",
      color: "#5BD96A"
    }
  }, "SETTINGS APPLIED"))));
}
Object.assign(window, {
  TableSettingsScreen
});