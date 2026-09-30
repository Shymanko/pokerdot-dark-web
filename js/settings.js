// Settings — full screen with sub-routing. Curated for our multi-table crypto
// cash-poker shell: HUD, Betting, Buy-in, Sounds, Smart Focus, Table Theme,
// Time Bank, Currency, Language, Time Zone. Tab-style (dock stays visible).

const SETTINGS_LIST = [{
  id: "betting",
  label: "BETTING",
  sub: "Bet-size shortcuts"
}, {
  id: "buyin",
  label: "BUY-IN",
  sub: "Default seat amount"
}, {
  id: "sounds",
  label: "SOUNDS",
  sub: "Music · effects"
}, {
  id: "focus",
  label: "SMART FOCUS",
  sub: "Auto-pop active table"
}, {
  id: "theme",
  label: "TABLE THEME",
  sub: "Felt & deck look"
}, {
  id: "emoji",
  label: "EMOJI",
  sub: "Quick reactions · win · draw · loss"
}, {
  id: "timebank",
  label: "TIME BANK",
  sub: "Auto-use rules"
}, {
  id: "currency",
  label: "CURRENCY DISPLAY",
  sub: "How balances show"
}, {
  id: "language",
  label: "LANGUAGE",
  sub: "English",
  dynamicSub: "language"
}, {
  id: "timezone",
  label: "TIME ZONE",
  sub: "UTC-8"
}];

// English + Русский are fully localised; the rest are listed but fall back to EN copy.
const LANGS = ["English", "Русский", "Deutsch", "Español", "Français", "Polski", "Português", "Română", "Türkçe", "Українська", "中文", "日本語"];
const THEMES = [{
  id: "classic",
  label: "CLASSIC",
  felt: "#0a6b3b"
}, {
  id: "emerald",
  label: "EMERALD",
  felt: "#0f8a6a"
}, {
  id: "midnight",
  label: "MIDNIGHT",
  felt: "#1b2740"
}, {
  id: "crimson",
  label: "CRIMSON",
  felt: "#5e1118"
}];
function SettingsScreen({
  open,
  onClose,
  accent = "#D71921",
  initialSection = "list",
  onPreferenceChange
}) {
  // повноекранний під-екран — ховаємо верхню смугу активних столів,
  // інакше вона малюється поверх власної шапки екрана
  React.useEffect(() => {
    if (!open) return;
    window.dispatchEvent(new CustomEvent("px-full", {
      detail: 1
    }));
    return () => window.dispatchEvent(new CustomEvent("px-full", {
      detail: -1
    }));
  }, [open]);
  const [mounted, setMounted] = React.useState(false);
  const [sub, setSub] = React.useState(initialSection);
  const [cfg, setCfg] = React.useState({
    hud: true,
    hudStats: {
      vpip: true,
      pfr: true,
      threebet: false,
      hands: true
    },
    // E1 (Финальная оценка, п.1): беттінг за референсом із доку — крок
    // ставки (BB/MONEY), підтвердження, чотири слоти швидких кнопок
    // окремо для опен-рейзу і для ставки в банк. Один набір на всі
    // формати (кеш / турніри / Spin&Win) — окремо не розводимо.
    betWith: "sb",
    roundBlind: false,
    betStep: "bb",
    betConfirm: "never",
    openBet: ["2bb", "3bb", "4bb", "pot"],
    potBet: ["33", "50", "75", "max"],
    buyinSrc: "usdt",
    buyinPct: 50,
    autoBuyin: false,
    sounds: true,
    music: 60,
    sfx: 70,
    dealer: 55,
    dealerOn: true,
    voice: "laura",
    focus: true,
    theme: "classic",
    timebank: "pot_excl",
    currency: (window.PX_CUR || "USD").toLowerCase(),
    emoji: {
      win: ["😎", "🔥", "👏"],
      draw: ["🤝", "🤔", "🍀"],
      loss: ["😭", "😡", "🤡"]
    },
    language: typeof window !== "undefined" && window.PXI18N && window.PXI18N.lang === "ru" ? "Русский" : "English",
    timezone: localStorage.getItem("pd-timezone") || "UTC-8"
  });
  React.useEffect(() => {
    window.pxSoundPrefs = {
      enabled: cfg.sounds,
      volume: cfg.sfx / 100
    };
    if (!cfg.sounds || cfg.sfx === 0) window.cmCardWheelAudio?.stop();
  }, [cfg.sounds, cfg.sfx]);
  const set = patch => {
    if (patch.currency) window.pxSetCurrency?.(patch.currency.toUpperCase());
    if (patch.language && window.PXI18N) window.PXI18N.setLang(window.PXI18N.fromLabel(patch.language));
    if (patch.timezone) localStorage.setItem("pd-timezone", patch.timezone);
    onPreferenceChange?.(patch);
    setCfg(c => ({
      ...c,
      ...patch
    }));
  };
  React.useEffect(() => {
    if (!open) {
      setSub(initialSection);
      return;
    }
    setSub(initialSection);
    setMounted(false);
    const r = requestAnimationFrame(() => setMounted(true));
    return () => cancelAnimationFrame(r);
  }, [open, initialSection]);
  if (!open) return null;
  const title = sub === "list" ? "GAME SETTINGS" : (SETTINGS_LIST.find(s => s.id === sub) || {}).label || "SETTINGS";
  const back = () => {
    if (window.playClick) window.playClick(1000, 0.04);
    sub === "list" || initialSection !== "list" ? onClose() : setSub("list");
  };
  return /*#__PURE__*/React.createElement("div", {
    className: "ps-detail ps-game-settings",
    style: {
      position: "absolute",
      inset: 0,
      zIndex: 38,
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
      background: `radial-gradient(ellipse 90% 70% at 50% 0%, ${accent}1c, transparent 60%)`
    }
  }), /*#__PURE__*/React.createElement("div", {
    className: "pd-screen-header",
    style: {
      position: "relative",
      zIndex: 5,
      paddingTop: 52,
      paddingLeft: 14,
      paddingRight: 14,
      paddingBottom: 8,
      display: "flex",
      alignItems: "center",
      justifyContent: "space-between"
    }
  }, /*#__PURE__*/React.createElement("button", {
    "aria-label": "\u041D\u0430\u0437\u0430\u0434 \u043A \u043D\u0430\u0441\u0442\u0440\u043E\u0439\u043A\u0430\u043C",
    onClick: back,
    style: {
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
      fontFamily: MONO_S,
      fontWeight: 700,
      fontSize: 15,
      color: "#fff",
      letterSpacing: ".16em"
    }
  }, title), /*#__PURE__*/React.createElement("span", {
    style: {
      width: 36
    }
  })), /*#__PURE__*/React.createElement("div", {
    className: "ps-content",
    style: {
      flex: 1,
      overflowY: "auto",
      overflowX: "hidden",
      WebkitOverflowScrolling: "touch",
      paddingBottom: 110,
      position: "relative",
      zIndex: 2,
      padding: "4px 16px 110px"
    }
  }, sub === "list" && /*#__PURE__*/React.createElement(SCard, null, SETTINGS_LIST.filter(s => !['currency', 'language', 'timezone'].includes(s.id)).map((s, i) => /*#__PURE__*/React.createElement("button", {
    className: "ps-game-row",
    key: s.id,
    onClick: () => {
      if (window.playClick) window.playClick(1100, 0.03);
      setSub(s.id);
    },
    style: {
      display: "flex",
      alignItems: "center",
      justifyContent: "space-between",
      width: "100%",
      padding: "14px 14px",
      cursor: "pointer",
      background: "transparent",
      border: 0,
      borderTop: i === 0 ? "0" : "1px solid rgba(255,255,255,.085)",
      textAlign: "left"
    }
  }, /*#__PURE__*/React.createElement("span", {
    style: {
      minWidth: 0
    }
  }, /*#__PURE__*/React.createElement("span", {
    style: {
      display: "block",
      fontFamily: MONO_S,
      fontSize: 13,
      color: "#fff",
      letterSpacing: ".03em"
    },
    "data-i18n": "off"
  }, window.PXI18N?.lang === 'ru' ? {
    betting: 'Ставки',
    buyin: 'Вход за стол',
    sounds: 'Звук',
    focus: 'Умный фокус',
    theme: 'Оформление стола',
    emoji: 'Быстрые реакции',
    timebank: 'Таймбанк'
  }[s.id] : s.label), /*#__PURE__*/React.createElement("span", {
    style: {
      display: "block",
      fontFamily: SANS_S,
      fontWeight: 600,
      fontSize: 10.5,
      color: "#A9A9B2",
      letterSpacing: ".04em",
      marginTop: 3
    }
  }, s.dynamicSub === "language" ? cfg.language : s.sub)), /*#__PURE__*/React.createElement("svg", {
    width: "14",
    height: "14",
    viewBox: "0 0 24 24",
    fill: "none",
    stroke: "rgba(255,255,255,.35)",
    strokeWidth: "2.4",
    strokeLinecap: "round",
    strokeLinejoin: "round"
  }, /*#__PURE__*/React.createElement("path", {
    d: "M9 6l6 6-6 6"
  }))))), sub === "betting" && /*#__PURE__*/React.createElement(SubBetting, {
    cfg: cfg,
    set: set,
    accent: accent
  }), sub === "buyin" && /*#__PURE__*/React.createElement(SubBuyin, {
    cfg: cfg,
    set: set,
    accent: accent
  }), sub === "sounds" && /*#__PURE__*/React.createElement(SubSounds, {
    cfg: cfg,
    set: set,
    accent: accent
  }), sub === "focus" && /*#__PURE__*/React.createElement(SubFocus, {
    cfg: cfg,
    set: set,
    accent: accent
  }), sub === "theme" && /*#__PURE__*/React.createElement(SubTheme, {
    cfg: cfg,
    set: set,
    accent: accent
  }), sub === "emoji" && /*#__PURE__*/React.createElement(SubEmoji, {
    cfg: cfg,
    set: set,
    accent: accent
  }), sub === "timebank" && /*#__PURE__*/React.createElement(SubTimebank, {
    cfg: cfg,
    set: set,
    accent: accent
  }), sub === "currency" && /*#__PURE__*/React.createElement(SubCurrency, {
    cfg: cfg,
    set: set,
    accent: accent
  }), sub === "language" && /*#__PURE__*/React.createElement(SubLanguage, {
    cfg: cfg,
    set: set,
    accent: accent
  }), sub === "timezone" && /*#__PURE__*/React.createElement(SubTimezone, {
    cfg: cfg,
    set: set,
    accent: accent
  })));
}
const VolIcon = ({
  mute
}) => /*#__PURE__*/React.createElement("svg", {
  width: "18",
  height: "18",
  viewBox: "0 0 24 24",
  fill: "none",
  stroke: "rgba(255,255,255,.6)",
  strokeWidth: "1.8",
  strokeLinecap: "round",
  strokeLinejoin: "round"
}, /*#__PURE__*/React.createElement("path", {
  d: "M4 9v6h4l5 4V5L8 9z"
}), mute ? /*#__PURE__*/React.createElement("path", {
  d: "M22 9l-5 6M17 9l5 6"
}) : /*#__PURE__*/React.createElement("path", {
  d: "M16 8.5a4 4 0 0 1 0 7"
}));
function SubSounds({
  cfg,
  set,
  accent
}) {
  return /*#__PURE__*/React.createElement("div", null, /*#__PURE__*/React.createElement(SCard, null, /*#__PURE__*/React.createElement(SRow, {
    label: "SOUNDS"
  }, /*#__PURE__*/React.createElement(SToggle, {
    on: cfg.sounds,
    onToggle: () => set({
      sounds: !cfg.sounds
    }),
    accent: accent
  }))), cfg.sounds && /*#__PURE__*/React.createElement(SCard, {
    style: {
      marginTop: 12
    }
  }, /*#__PURE__*/React.createElement("div", {
    style: {
      padding: "14px 14px"
    }
  }, /*#__PURE__*/React.createElement("div", {
    style: {
      fontFamily: MONO_S,
      fontSize: 12,
      color: "#fff",
      marginBottom: 10
    }
  }, "BACKGROUND MUSIC"), /*#__PURE__*/React.createElement(SSlider, {
    value: cfg.music,
    onChange: v => set({
      music: v
    }),
    accent: accent,
    left: /*#__PURE__*/React.createElement(VolIcon, {
      mute: true
    }),
    right: /*#__PURE__*/React.createElement(VolIcon, null)
  })), /*#__PURE__*/React.createElement("div", {
    style: {
      padding: "14px 14px",
      borderTop: "1px solid rgba(255,255,255,.085)"
    }
  }, /*#__PURE__*/React.createElement("div", {
    style: {
      fontFamily: MONO_S,
      fontSize: 12,
      color: "#fff",
      marginBottom: 10
    }
  }, "SOUND EFFECT"), /*#__PURE__*/React.createElement(SSlider, {
    value: cfg.sfx,
    onChange: v => set({
      sfx: v
    }),
    accent: accent,
    left: /*#__PURE__*/React.createElement(VolIcon, {
      mute: true
    }),
    right: /*#__PURE__*/React.createElement(VolIcon, null)
  }))));
}
function SubBetting({
  cfg,
  set,
  accent
}) {
  // Значення, доступні для кожного слота швидкої кнопки. Опен-рейз меряємо
  // в блайндах, ставку в банк — у відсотках банку: так само, як на столі.
  const OPEN_OPTS = [{
    id: "2bb",
    label: "2 BB"
  }, {
    id: "2.5bb",
    label: "2.5 BB"
  }, {
    id: "3bb",
    label: "3 BB"
  }, {
    id: "3.5bb",
    label: "3.5 BB"
  }, {
    id: "4bb",
    label: "4 BB"
  }, {
    id: "5bb",
    label: "5 BB"
  }, {
    id: "pot",
    label: "POT"
  }];
  const POT_OPTS = [{
    id: "25",
    label: "25%"
  }, {
    id: "33",
    label: "33%"
  }, {
    id: "50",
    label: "50%"
  }, {
    id: "66",
    label: "66%"
  }, {
    id: "75",
    label: "75%"
  }, {
    id: "100",
    label: "100%"
  }, {
    id: "max",
    label: "MAX"
  }];
  const setSlot = (key, i, v) => {
    const next = (cfg[key] || []).slice();
    next[i] = v;
    set({
      [key]: next
    });
  };
  // ряд із чотирьох слотів — тап по слоту гортає значення далі по списку
  const slotRow = (key, opts) => /*#__PURE__*/React.createElement("div", {
    style: {
      display: "grid",
      gridTemplateColumns: "repeat(4, 1fr)",
      gap: 8
    }
  }, (cfg[key] || []).map((v, i) => {
    const idx = Math.max(0, opts.findIndex(o => o.id === v));
    const cur = opts[idx] || opts[0];
    return /*#__PURE__*/React.createElement("button", {
      key: i,
      onClick: () => {
        if (window.playClick) window.playClick(1150, .035);
        setSlot(key, i, opts[(idx + 1) % opts.length].id);
      },
      style: {
        height: 52,
        boxSizing: "border-box",
        padding: 0,
        borderRadius: 14,
        cursor: "pointer",
        display: "flex",
        flexDirection: "column",
        alignItems: "center",
        justifyContent: "center",
        gap: 3,
        background: "#111419",
        border: "1px solid rgba(255,255,255,.14)"
      }
    }, /*#__PURE__*/React.createElement("span", {
      style: {
        fontFamily: SC_MONO_S,
        fontWeight: 700,
        fontSize: 13,
        color: "#fff",
        letterSpacing: ".02em",
        lineHeight: 1
      }
    }, cur.label), /*#__PURE__*/React.createElement("span", {
      style: {
        fontFamily: SC_SANS_S,
        fontWeight: 700,
        fontSize: 8.5,
        letterSpacing: ".12em",
        color: "#8A8A93",
        lineHeight: 1
      }
    }, "SLOT " + (i + 1)));
  }));
  return /*#__PURE__*/React.createElement("div", null, /*#__PURE__*/React.createElement(SLabel, null, "BET SIZING"), /*#__PURE__*/React.createElement(SCard, null, /*#__PURE__*/React.createElement("div", {
    style: {
      padding: "14px 14px"
    }
  }, /*#__PURE__*/React.createElement("div", {
    style: {
      fontFamily: SC_MONO_S,
      fontWeight: 700,
      fontSize: 13,
      color: "#fff",
      letterSpacing: ".03em"
    }
  }, "BET STEP"), /*#__PURE__*/React.createElement("div", {
    style: {
      fontFamily: SC_SANS_S,
      fontWeight: 500,
      fontSize: 10.5,
      color: "#8A8A93",
      letterSpacing: ".02em",
      marginTop: 4,
      lineHeight: 1.45
    }
  }, "What the +/\u2212 on the table's raise slider adds"), /*#__PURE__*/React.createElement("div", {
    style: {
      height: 12
    }
  }), /*#__PURE__*/React.createElement(SSegment, {
    value: cfg.betStep,
    onChange: v => set({
      betStep: v
    }),
    accent: accent,
    options: [{
      id: "bb",
      label: "BB"
    }, {
      id: "money",
      label: "MONEY"
    }]
  })), /*#__PURE__*/React.createElement("div", {
    style: {
      height: 1,
      background: "rgba(255,255,255,.07)"
    }
  }), /*#__PURE__*/React.createElement("div", {
    style: {
      padding: "14px 14px"
    }
  }, /*#__PURE__*/React.createElement("div", {
    style: {
      fontFamily: SC_MONO_S,
      fontWeight: 700,
      fontSize: 13,
      color: "#fff",
      letterSpacing: ".03em"
    }
  }, "CONFIRM THE BET"), /*#__PURE__*/React.createElement("div", {
    style: {
      fontFamily: SC_SANS_S,
      fontWeight: 500,
      fontSize: 10.5,
      color: "#8A8A93",
      letterSpacing: ".02em",
      marginTop: 4,
      lineHeight: 1.45
    }
  }, "Ask before the bet goes in"), /*#__PURE__*/React.createElement("div", {
    style: {
      height: 12
    }
  }), /*#__PURE__*/React.createElement(SSegment, {
    value: cfg.betConfirm,
    onChange: v => set({
      betConfirm: v
    }),
    accent: accent,
    options: [{
      id: "always",
      label: "ALWAYS"
    }, {
      id: "overpot",
      label: "OVER POT"
    }, {
      id: "never",
      label: "NEVER"
    }]
  })), /*#__PURE__*/React.createElement("div", {
    style: {
      height: 1,
      background: "rgba(255,255,255,.07)"
    }
  }), /*#__PURE__*/React.createElement(SRow, {
    label: "ROUND TO THE NEAREST BLIND",
    sub: "Bet amounts snap to whole blinds"
  }, /*#__PURE__*/React.createElement(SToggle, {
    on: cfg.roundBlind,
    onToggle: () => set({
      roundBlind: !cfg.roundBlind
    }),
    accent: accent
  }))), /*#__PURE__*/React.createElement("div", {
    style: {
      marginTop: 20
    }
  }, /*#__PURE__*/React.createElement(SLabel, null, "OPENING BET \xB7 IN BIG BLINDS"), slotRow("openBet", OPEN_OPTS)), /*#__PURE__*/React.createElement("div", {
    style: {
      marginTop: 20
    }
  }, /*#__PURE__*/React.createElement(SLabel, null, "RAISE / BET INTO A POT \xB7 % OF THE POT"), slotRow("potBet", POT_OPTS)), /*#__PURE__*/React.createElement("p", {
    style: {
      margin: "16px 0 0",
      fontFamily: SC_SANS_S,
      fontWeight: 500,
      fontSize: 11,
      lineHeight: 1.55,
      color: "#A9A9B2",
      textWrap: "pretty"
    }
  }, "These four shortcuts sit above the bet slider at the table. The first row is used when the pot is still unopened, the second when there is already a bet to raise. One set for every format \u2014 cash, tournaments and Spin & Win."));
}
function SubBuyin({
  cfg,
  set,
  accent
}) {
  return /*#__PURE__*/React.createElement("div", null, /*#__PURE__*/React.createElement(SLabel, null, "DEFAULT BUY-IN SOURCE"), /*#__PURE__*/React.createElement(SSegment, {
    options: [{
      id: "usdt",
      label: "USD"
    }, {
      id: "cash",
      label: "CASH$"
    }],
    value: cfg.buyinSrc,
    onChange: v => set({
      buyinSrc: v
    }),
    accent: accent
  }), /*#__PURE__*/React.createElement("div", {
    style: {
      marginTop: 18
    }
  }, /*#__PURE__*/React.createElement(SLabel, null, "BUY-IN AMOUNT"), /*#__PURE__*/React.createElement(SCard, null, /*#__PURE__*/React.createElement("div", {
    style: {
      padding: "16px 14px"
    }
  }, /*#__PURE__*/React.createElement("div", {
    style: {
      textAlign: "center",
      fontFamily: MONO_S,
      fontWeight: 700,
      fontSize: 24,
      color: accent,
      marginBottom: 12
    }
  }, cfg.buyinPct, "%"), /*#__PURE__*/React.createElement(SSlider, {
    value: cfg.buyinPct,
    onChange: v => set({
      buyinPct: v
    }),
    accent: accent,
    left: /*#__PURE__*/React.createElement("span", {
      style: {
        fontFamily: MONO_S,
        fontSize: 11,
        color: "#A9A9B2"
      }
    }, "MIN"),
    right: /*#__PURE__*/React.createElement("span", {
      style: {
        fontFamily: MONO_S,
        fontSize: 11,
        color: "#A9A9B2"
      }
    }, "MAX")
  }), /*#__PURE__*/React.createElement("div", {
    style: {
      fontFamily: SANS_S,
      fontWeight: 600,
      fontSize: 11,
      color: "#D8D8DF",
      letterSpacing: ".04em",
      textAlign: "center",
      marginTop: 12,
      lineHeight: 1.5
    }
  }, "If below the table minimum, you'll be seated with the lowest buy-in allowed.")))), /*#__PURE__*/React.createElement("div", {
    style: {
      marginTop: 18
    }
  }, /*#__PURE__*/React.createElement(SCard, null, /*#__PURE__*/React.createElement(SRow, {
    label: "AUTOMATIC BUY-IN",
    sub: "Get seated immediately without opening the buy-in window."
  }, /*#__PURE__*/React.createElement(SToggle, {
    on: cfg.autoBuyin,
    onToggle: () => set({
      autoBuyin: !cfg.autoBuyin
    }),
    accent: accent
  })))));
}
function SubFocus({
  cfg,
  set,
  accent
}) {
  return /*#__PURE__*/React.createElement("div", null, /*#__PURE__*/React.createElement(SCard, null, /*#__PURE__*/React.createElement(SRow, {
    label: "SMART FOCUS"
  }, /*#__PURE__*/React.createElement(SToggle, {
    on: cfg.focus,
    onToggle: () => set({
      focus: !cfg.focus
    }),
    accent: accent
  }))), /*#__PURE__*/React.createElement("div", {
    style: {
      marginTop: 14,
      padding: "0 4px",
      fontFamily: SANS_S,
      fontWeight: 600,
      fontSize: 11,
      color: "#D8D8DF",
      letterSpacing: ".04em",
      lineHeight: 1.6
    }
  }, "When playing multiple tables, the game automatically determines your most important table and pops it to the front when it's your turn."));
}
function SubHud({
  cfg,
  set,
  accent
}) {
  const stat = k => set({
    hudStats: {
      ...cfg.hudStats,
      [k]: !cfg.hudStats[k]
    }
  });
  return /*#__PURE__*/React.createElement("div", null, /*#__PURE__*/React.createElement(SCard, null, /*#__PURE__*/React.createElement(SRow, {
    label: "HUD",
    sub: "Show opponent stats on the table"
  }, /*#__PURE__*/React.createElement(SToggle, {
    on: cfg.hud,
    onToggle: () => set({
      hud: !cfg.hud
    }),
    accent: accent
  }))), cfg.hud && /*#__PURE__*/React.createElement("div", {
    style: {
      marginTop: 16
    }
  }, /*#__PURE__*/React.createElement(SLabel, null, "STATS SHOWN"), /*#__PURE__*/React.createElement(SCard, null, /*#__PURE__*/React.createElement(SRow, {
    label: "VPIP",
    sub: "Voluntarily put $ in pot"
  }, /*#__PURE__*/React.createElement(SToggle, {
    on: cfg.hudStats.vpip,
    onToggle: () => stat("vpip"),
    accent: accent
  })), /*#__PURE__*/React.createElement(SRow, {
    top: true,
    label: "PFR",
    sub: "Pre-flop raise %"
  }, /*#__PURE__*/React.createElement(SToggle, {
    on: cfg.hudStats.pfr,
    onToggle: () => stat("pfr"),
    accent: accent
  })), /*#__PURE__*/React.createElement(SRow, {
    top: true,
    label: "3-BET",
    sub: "Three-bet %"
  }, /*#__PURE__*/React.createElement(SToggle, {
    on: cfg.hudStats.threebet,
    onToggle: () => stat("threebet"),
    accent: accent
  })), /*#__PURE__*/React.createElement(SRow, {
    top: true,
    label: "HANDS",
    sub: "Hands observed"
  }, /*#__PURE__*/React.createElement(SToggle, {
    on: cfg.hudStats.hands,
    onToggle: () => stat("hands"),
    accent: accent
  })))));
}
function SubTheme({
  cfg,
  set,
  accent
}) {
  return /*#__PURE__*/React.createElement("div", null, /*#__PURE__*/React.createElement(SLabel, null, "TABLE FELT"), /*#__PURE__*/React.createElement("div", {
    style: {
      display: "grid",
      gridTemplateColumns: "1fr 1fr",
      gap: 10
    }
  }, THEMES.map(t => {
    const on = t.id === cfg.theme;
    return /*#__PURE__*/React.createElement("button", {
      key: t.id,
      onClick: () => {
        if (window.playClick) window.playClick(1100, 0.03);
        set({
          theme: t.id
        });
      },
      style: {
        padding: 8,
        borderRadius: 14,
        cursor: "pointer",
        background: "rgba(255,255,255,.06)",
        border: `1px solid ${on ? accent : "rgba(255,255,255,.1)"}`,
        transition: "all 140ms"
      }
    }, /*#__PURE__*/React.createElement("div", {
      style: {
        height: 72,
        borderRadius: 8,
        background: `radial-gradient(ellipse at 50% 40%, ${t.felt}, ${t.felt}cc)`,
        border: "1px solid rgba(255,255,255,.1)",
        display: "flex",
        alignItems: "center",
        justifyContent: "center"
      }
    }, /*#__PURE__*/React.createElement("span", {
      style: {
        width: 30,
        height: 42,
        borderRadius: 4,
        background: "#fff",
        boxShadow: "0 3px 8px rgba(0,0,0,.4)",
        transform: "rotate(-8deg)"
      }
    }), /*#__PURE__*/React.createElement("span", {
      style: {
        width: 30,
        height: 42,
        borderRadius: 4,
        background: "#fff",
        boxShadow: "0 3px 8px rgba(0,0,0,.4)",
        transform: "rotate(8deg)",
        marginLeft: -10
      }
    })), /*#__PURE__*/React.createElement("div", {
      style: {
        display: "flex",
        alignItems: "center",
        justifyContent: "space-between",
        marginTop: 9,
        padding: "0 2px"
      }
    }, /*#__PURE__*/React.createElement("span", {
      style: {
        fontFamily: MONO_S,
        fontSize: 11,
        color: "#fff",
        letterSpacing: ".06em"
      }
    }, t.label), on && /*#__PURE__*/React.createElement("span", {
      style: {
        width: 16,
        height: 16,
        borderRadius: "50%",
        background: accent,
        display: "flex",
        alignItems: "center",
        justifyContent: "center"
      }
    }, /*#__PURE__*/React.createElement("svg", {
      width: "9",
      height: "9",
      viewBox: "0 0 24 24",
      fill: "none",
      stroke: "#fff",
      strokeWidth: "3.6",
      strokeLinecap: "round",
      strokeLinejoin: "round"
    }, /*#__PURE__*/React.createElement("path", {
      d: "M5 12l5 5L20 6"
    })))));
  })));
}
function SubTimebank({
  cfg,
  set,
  accent
}) {
  return /*#__PURE__*/React.createElement("div", null, /*#__PURE__*/React.createElement(SCard, {
    style: {
      marginBottom: 16
    }
  }, /*#__PURE__*/React.createElement("div", {
    style: {
      padding: "20px 14px",
      display: "flex",
      flexDirection: "column",
      alignItems: "center",
      gap: 12
    }
  }, /*#__PURE__*/React.createElement("span", {
    style: {
      width: 64,
      height: 48,
      borderRadius: 8,
      background: accent,
      display: "flex",
      alignItems: "center",
      justifyContent: "center",
      boxShadow: `0 8px 18px ${accent}55`,
      fontFamily: MONO_S,
      fontWeight: 700,
      fontSize: 18,
      color: "#fff"
    }
  }, "+30"), /*#__PURE__*/React.createElement("span", {
    style: {
      fontFamily: SANS_S,
      fontWeight: 600,
      fontSize: 11,
      color: "#D8D8DF",
      textAlign: "center",
      lineHeight: 1.5,
      letterSpacing: ".03em"
    }
  }, "Auto-use your Time Bank on your turns until it is exhausted."))), /*#__PURE__*/React.createElement(SLabel, null, "OPTIONS"), /*#__PURE__*/React.createElement(SRadioList, {
    value: cfg.timebank,
    onChange: v => set({
      timebank: v
    }),
    accent: accent,
    options: [{
      id: "all",
      label: "ALWAYS",
      sub: "Auto-use on all of your turns."
    }, {
      id: "pot_incl",
      label: "POT · INCL. BLINDS",
      sub: "Only when you have money in the pot, including blinds/ante."
    }, {
      id: "pot_excl",
      label: "POT · EXCL. BLINDS",
      sub: "Only when you have money in the pot, excluding blinds/ante."
    }, {
      id: "manual",
      label: "MANUAL",
      sub: "Use your Time Bank manually."
    }]
  }));
}
function SubCurrency({
  cfg,
  set,
  accent
}) {
  return /*#__PURE__*/React.createElement("div", null, /*#__PURE__*/React.createElement(SLabel, null, "DISPLAY BALANCES IN"), /*#__PURE__*/React.createElement(SRadioList, {
    value: cfg.currency,
    onChange: v => set({
      currency: v
    }),
    accent: accent,
    options: [...Object.keys(window.PX_CURRENCIES).map(code => ({
      id: code.toLowerCase(),
      label: code,
      sub: {
        USD: "US Dollar",
        EUR: "Euro",
        KZT: "Kazakhstani Tenge"
      }[code]
    }))]
  }));
}
function SubLanguage({
  cfg,
  set,
  accent
}) {
  return /*#__PURE__*/React.createElement("div", null, /*#__PURE__*/React.createElement(SLabel, null, "LANGUAGE"), /*#__PURE__*/React.createElement("div", {
    "data-i18n": "off"
  }, /*#__PURE__*/React.createElement(SRadioList, {
    cols: 2,
    value: cfg.language,
    onChange: v => set({
      language: v
    }),
    accent: accent,
    options: LANGS.map(l => ({
      id: l,
      label: l
    }))
  })));
}
function SubTimezone({
  cfg,
  set,
  accent
}) {
  const zones = ["UTC-8", "UTC-5", "UTC", "UTC+1", "UTC+2", "UTC+3", "UTC+8"];
  const now = new Date();
  const offset = Number(cfg.timezone.replace("UTC", "") || 0),
    shifted = new Date(now.getTime() + offset * 3600000);
  const hh = String(shifted.getUTCHours()).padStart(2, "0"),
    mm = String(shifted.getUTCMinutes()).padStart(2, "0");
  return /*#__PURE__*/React.createElement("div", null, /*#__PURE__*/React.createElement(SLabel, null, "TIME ZONE"), /*#__PURE__*/React.createElement(SRadioList, {
    cols: 3,
    value: cfg.timezone,
    onChange: v => set({
      timezone: v
    }),
    accent: accent,
    options: zones.map(z => ({
      id: z,
      label: z
    }))
  }), /*#__PURE__*/React.createElement("div", {
    style: {
      marginTop: 16
    }
  }, /*#__PURE__*/React.createElement(SCard, null, /*#__PURE__*/React.createElement("div", {
    style: {
      padding: "18px 14px",
      textAlign: "center"
    }
  }, /*#__PURE__*/React.createElement("div", {
    style: {
      fontFamily: SANS_S,
      fontWeight: 700,
      fontSize: 10.5,
      color: "#A9A9B2",
      letterSpacing: ".2em"
    }
  }, "TIME DISPLAY SAMPLE"), /*#__PURE__*/React.createElement("div", {
    style: {
      fontFamily: MONO_S,
      fontWeight: 700,
      fontSize: 20,
      color: "#fff",
      marginTop: 8
    }
  }, hh, ":", mm, " (", cfg.timezone, ")")))));
}
const EMOJI_CHOICES = ["😎", "😂", "🤯", "😭", "😡", "👏", "🔥", "🍀", "🤝", "🤡"];
const EMOJI_SCENARIOS = [{
  id: "win",
  label: "WIN"
}, {
  id: "draw",
  label: "DRAW"
}, {
  id: "loss",
  label: "LOSS"
}];
function SubEmoji({
  cfg,
  set,
  accent
}) {
  const [scn, setScn] = React.useState("win");
  const cur = cfg.emoji[scn] || [];
  const EM_FONT = "'Apple Color Emoji','Segoe UI Emoji','Noto Color Emoji',sans-serif";
  const toggle = e => {
    if (window.playClick) window.playClick(1300, 0.03);
    const has = cur.includes(e);
    let next;
    if (has) next = cur.filter(x => x !== e); // remove
    else if (cur.length >= 3) next = [...cur.slice(1), e]; // full → drop oldest, add
    else next = [...cur, e]; // add
    set({
      emoji: {
        ...cfg.emoji,
        [scn]: next
      }
    });
  };
  return /*#__PURE__*/React.createElement("div", null, /*#__PURE__*/React.createElement(SLabel, null, "QUICK REACTIONS"), /*#__PURE__*/React.createElement(SCard, null, /*#__PURE__*/React.createElement("div", {
    style: {
      padding: "14px 14px",
      display: "flex",
      flexDirection: "column",
      gap: 11
    }
  }, EMOJI_SCENARIOS.map((s, i) => {
    const list = cfg.emoji[s.id] || [];
    const on = scn === s.id;
    return /*#__PURE__*/React.createElement("button", {
      key: s.id,
      onClick: () => {
        if (window.playClick) window.playClick(1100, 0.03);
        setScn(s.id);
      },
      style: {
        display: "flex",
        alignItems: "center",
        justifyContent: "space-between",
        gap: 10,
        width: "100%",
        cursor: "pointer",
        padding: "10px 11px",
        borderRadius: 12,
        textAlign: "left",
        background: on ? `${accent}16` : "transparent",
        border: `1px solid ${on ? accent : "rgba(255,255,255,.13)"}`,
        transition: "all .15s"
      }
    }, /*#__PURE__*/React.createElement("span", {
      style: {
        fontFamily: SANS_S,
        fontWeight: 700,
        fontSize: 10.5,
        letterSpacing: ".16em",
        color: on ? "#fff" : "rgba(255,255,255,.55)"
      }
    }, s.label), /*#__PURE__*/React.createElement("span", {
      style: {
        display: "flex",
        gap: 7
      }
    }, [0, 1, 2].map(k => /*#__PURE__*/React.createElement("span", {
      key: k,
      style: {
        width: 38,
        height: 38,
        borderRadius: 12,
        display: "flex",
        alignItems: "center",
        justifyContent: "center",
        background: "#14171c",
        border: "1px solid rgba(255,255,255,.1)"
      }
    }, /*#__PURE__*/React.createElement("span", {
      style: {
        fontFamily: EM_FONT,
        fontSize: 21,
        lineHeight: 1,
        opacity: list[k] ? 1 : 0.25
      }
    }, list[k] || "+")))));
  }))), /*#__PURE__*/React.createElement("div", {
    style: {
      margin: "12px 4px 0",
      fontFamily: SANS_S,
      fontWeight: 600,
      fontSize: 11,
      color: "#D8D8DF",
      letterSpacing: ".03em",
      lineHeight: 1.6
    }
  }, "After a hand resolves, your three quick-reaction buttons appear. Tap one to show that emoji to the other players."), /*#__PURE__*/React.createElement("div", {
    style: {
      marginTop: 22
    }
  }, /*#__PURE__*/React.createElement("div", {
    style: {
      display: "flex",
      alignItems: "baseline",
      justifyContent: "space-between",
      margin: "0 2px 11px"
    }
  }, /*#__PURE__*/React.createElement("span", {
    style: {
      fontFamily: SANS_S,
      fontWeight: 700,
      fontSize: 10.5,
      color: "#A9A9B2",
      letterSpacing: ".2em"
    }
  }, (EMOJI_SCENARIOS.find(s => s.id === scn) || {}).label, " \xB7 PICK 3"), /*#__PURE__*/React.createElement("span", {
    style: {
      fontFamily: MONO_S,
      fontWeight: 700,
      fontSize: 11,
      color: accent
    }
  }, cur.length, "/3")), /*#__PURE__*/React.createElement(SCard, null, /*#__PURE__*/React.createElement("div", {
    style: {
      padding: 14,
      display: "grid",
      gridTemplateColumns: "repeat(5, 1fr)",
      gap: 9
    }
  }, EMOJI_CHOICES.map(e => {
    const idx = cur.indexOf(e);
    const on = idx >= 0;
    return /*#__PURE__*/React.createElement("button", {
      key: e,
      onClick: () => toggle(e),
      style: {
        position: "relative",
        aspectRatio: "1",
        borderRadius: 12,
        cursor: "pointer",
        display: "flex",
        alignItems: "center",
        justifyContent: "center",
        background: on ? `${accent}22` : "rgba(255,255,255,.065)",
        border: `1px solid ${on ? accent : "rgba(255,255,255,.1)"}`,
        boxShadow: on ? `0 0 0 1px ${accent}, 0 6px 16px ${accent}33` : "none",
        transition: "all .14s"
      }
    }, /*#__PURE__*/React.createElement("span", {
      style: {
        fontFamily: EM_FONT,
        fontSize: 24,
        lineHeight: 1
      }
    }, e), on && /*#__PURE__*/React.createElement("span", {
      style: {
        position: "absolute",
        top: -6,
        right: -6,
        width: 17,
        height: 17,
        borderRadius: "50%",
        background: accent,
        border: "2px solid #000",
        display: "flex",
        alignItems: "center",
        justifyContent: "center",
        fontFamily: MONO_S,
        fontWeight: 700,
        fontSize: 10.5,
        color: "#fff"
      }
    }, idx + 1));
  })))));
}

// ── Правка 7 (архітектура 09.09): «Настройки игры» — шторка з вікна посадки.
// Три вкладки: ОБЩИЕ (столові тумблери) · БАЙ-ИН (за замовчуванням + автодокупка)
// · ПАРАМЕТРЫ СТАВОК (той самий екран беттінгу, що в налаштуваннях).
function GameSettingsSheet({
  open,
  accent = "#D71921",
  onClose,
  amount,
  cfg,
  set
}) {
  const [tab, setTab] = React.useState("buyin");
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
  const TABS = [["general", "GENERAL"], ["buyin", "BUY-IN"], ["bets", "BET PRESETS"]];
  const money = n => window.pxMoney ? window.pxMoney(n) : "$" + n;
  return /*#__PURE__*/React.createElement("div", {
    onClick: onClose,
    style: {
      position: "absolute",
      inset: 0,
      zIndex: 240,
      display: "flex",
      flexDirection: "column",
      justifyContent: "flex-end",
      background: "rgba(0,0,0,.66)",
      backdropFilter: "blur(5px)",
      WebkitBackdropFilter: "blur(5px)",
      opacity: up ? 1 : 0,
      transition: "opacity 200ms ease"
    }
  }, /*#__PURE__*/React.createElement("div", {
    onClick: e => e.stopPropagation(),
    style: {
      position: "relative",
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
      padding: "10px 16px 12px"
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
      fontFamily: SC_MONO_S,
      fontWeight: 700,
      fontSize: 13,
      letterSpacing: ".16em",
      color: "#fff"
    }
  }, "GAME SETTINGS"), /*#__PURE__*/React.createElement("button", {
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
      display: "flex",
      gap: 3,
      height: 40,
      boxSizing: "border-box",
      padding: 3,
      marginTop: 12,
      borderRadius: 12,
      background: "#14171c",
      border: "1px solid rgba(255,255,255,.13)"
    }
  }, TABS.map(([id, label]) => {
    const on = tab === id;
    return /*#__PURE__*/React.createElement("button", {
      key: id,
      onClick: () => {
        if (window.playClick) window.playClick(1100, .03);
        setTab(id);
      },
      style: {
        flex: 1,
        minWidth: 0,
        borderRadius: 8,
        border: 0,
        cursor: "pointer",
        whiteSpace: "nowrap",
        display: "flex",
        alignItems: "center",
        justifyContent: "center",
        background: on ? accent : "transparent",
        color: on ? "#fff" : "rgba(255,255,255,.55)",
        fontFamily: SC_MONO_S,
        fontWeight: 700,
        fontSize: 10.5,
        letterSpacing: ".1em",
        transition: "all 160ms"
      }
    }, label);
  }))), /*#__PURE__*/React.createElement("div", {
    style: {
      flex: 1,
      minHeight: 0,
      overflowY: "auto",
      WebkitOverflowScrolling: "touch",
      padding: "0 16px calc(26px + env(safe-area-inset-bottom))"
    }
  }, tab === "general" && /*#__PURE__*/React.createElement(SCard, null, /*#__PURE__*/React.createElement(SRow, {
    label: "SOUNDS",
    sub: "Chips, cards and dealer at the table"
  }, /*#__PURE__*/React.createElement(SToggle, {
    on: cfg.sounds,
    onToggle: () => set({
      sounds: !cfg.sounds
    }),
    accent: accent
  })), /*#__PURE__*/React.createElement(SRow, {
    top: true,
    label: "STACK IN BIG BLINDS",
    sub: "Show every stack in BB instead of money"
  }, /*#__PURE__*/React.createElement(SToggle, {
    on: !!cfg.stackBB,
    onToggle: () => set({
      stackBB: !cfg.stackBB
    }),
    accent: accent
  })), /*#__PURE__*/React.createElement(SRow, {
    top: true,
    label: "FOUR-COLOUR DECK",
    sub: "A colour of its own for every suit"
  }, /*#__PURE__*/React.createElement(SToggle, {
    on: cfg.fourColour !== false,
    onToggle: () => set({
      fourColour: cfg.fourColour === false
    }),
    accent: accent
  })), /*#__PURE__*/React.createElement(SRow, {
    top: true,
    label: "CONFIRM SIT OUT",
    sub: "Ask before you skip a hand"
  }, /*#__PURE__*/React.createElement(SToggle, {
    on: !!cfg.confirmSitOut,
    onToggle: () => set({
      confirmSitOut: !cfg.confirmSitOut
    }),
    accent: accent
  }))), tab === "buyin" && /*#__PURE__*/React.createElement(SCard, null, /*#__PURE__*/React.createElement(SRow, {
    label: "DEFAULT BUY-IN",
    sub: "If your buy-in is below the table minimum, you take the seat with the minimum"
  }, /*#__PURE__*/React.createElement(SToggle, {
    on: !!cfg.defaultBuyin,
    onToggle: () => set({
      defaultBuyin: !cfg.defaultBuyin
    }),
    accent: accent
  })), /*#__PURE__*/React.createElement(SRow, {
    top: true,
    label: "AUTO RE-BUY",
    sub: "Top the stack back up to your buy-in whenever it drops below it"
  }, /*#__PURE__*/React.createElement(SToggle, {
    on: !!cfg.autoBuyin,
    onToggle: () => set({
      autoBuyin: !cfg.autoBuyin
    }),
    accent: accent
  }))), tab === "bets" && /*#__PURE__*/React.createElement("div", {
    style: {
      marginTop: -2
    }
  }, /*#__PURE__*/React.createElement(SubBetting, {
    cfg: cfg,
    set: set,
    accent: accent
  })))));
}
Object.assign(window, {
  SettingsScreen,
  GameSettingsSheet
});