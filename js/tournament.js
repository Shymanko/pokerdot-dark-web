function _extends() { return _extends = Object.assign ? Object.assign.bind() : function (n) { for (var e = 1; e < arguments.length; e++) { var t = arguments[e]; for (var r in t) ({}).hasOwnProperty.call(t, r) && (n[r] = t[r]); } return n; }, _extends.apply(null, arguments); }
// Tournament — "next event" home widget + full-screen event detail page.
// On-brand: NDOT/Space Mono type, dot-matrix bars, Arcanium red, suit pips,
// pure-black canvas, graphic cover (no stock photo). Cash lobby still; this is
// the single nearest scheduled event surfaced on the home feed.

// ── shared schedule. Start = fixed offset from first load (live countdown). ──
const TOURNAMENT_START = Date.now() + (2 * 3600 + 47 * 60 + 33) * 1000;
const NEXT_TOURNAMENT = {
  name: "DAILY DEEP",
  series: "ARCANIUM SERIES",
  buyIn: "$110 000",
  gtd: "$500 000 000",
  gtdNum: 500000000,
  poolPerEntry: 100000,
  // $ of each buy-in that feeds the prize pool
  dateLabel: "TODAY · JUN 1",
  timeLabel: "21:00 EET",
  structure: "Texas Hold'em · Table for 8 · DEEP",
  lateReg: "LATE REG 60M",
  startStack: "10 000",
  startBB: "100 BB",
  levelTime: "6 MIN",
  reEntry: "UNLIMITED",
  buyInNum: 110000,
  // $ total = prize contribution + fee
  feeNum: 10000,
  startField: 3850,
  // registered so far
  accentSuit: "heart"
};
const OVERLAY_GOLD = "#f0c75e";
// ink for micro-labels that NAME a value (never for disabled/inactive states)
const INK_LABEL = "rgba(255,255,255,.58)";
const regKeyFor = n => "pp_tourn_reg_" + n;
const remindKeyFor = n => "pp_tourn_remind_" + n;

// ── live countdown to a target timestamp ─────────────────────────────────
function useCountdown(targetMs) {
  const calc = () => Math.max(0, Math.floor((targetMs - Date.now()) / 1000));
  const [secs, setSecs] = React.useState(calc);
  React.useEffect(() => {
    const t = setInterval(() => setSecs(calc()), 1000);
    return () => clearInterval(t);
  }, [targetMs]);
  const h = Math.floor(secs / 3600);
  const m = Math.floor(secs % 3600 / 60);
  const s = secs % 60;
  const pad = n => String(n).padStart(2, "0");
  return {
    h,
    m,
    s,
    secs,
    done: secs <= 0,
    hhmmss: `${pad(h)}:${pad(m)}:${pad(s)}`
  };
}
const MONO_T = UI.font;
const SANS_T = UI.fontUI;
if (typeof document !== "undefined" && !document.getElementById("pp-halo-kf")) {
  const st = document.createElement("style");
  st.id = "pp-halo-kf";
  st.textContent = "@keyframes pp-halo{0%,100%{opacity:.25}50%{opacity:1}}";
  document.head.appendChild(st);
}

// Guarantee-emphasis variant selector for the Next Event widget.
// A = labeled stat row · B = band (shipped) · C = oversized · D = red pill.
// Threaded via context so several lobbies can render different variants at once;
// no provider → the live app uses this default.
const NevVariantContext = React.createContext("B");

// ═════════════════════════════════════════════════════════════════════════
// Value zone — how the GUARANTEED prize is presented. Four structural variants,
// all making the guarantee the accented figure; tile chrome + CTA are shared.
// ═════════════════════════════════════════════════════════════════════════
function NevValueZone({
  variant,
  t,
  suitColor
}) {
  const lblRed = {
    fontFamily: MONO_T,
    fontSize: 10.5,
    color: suitColor,
    letterSpacing: ".24em",
    textTransform: "uppercase"
  };
  const lblDim = {
    fontFamily: MONO_T,
    fontSize: 10.5,
    color: "#A9A9B2",
    letterSpacing: ".24em",
    textTransform: "uppercase"
  };
  const num = {
    fontFamily: MONO_T,
    lineHeight: 1,
    fontVariantNumeric: "tabular-nums",
    letterSpacing: ".005em"
  };
  const dateStyle = {
    fontFamily: SANS_T,
    fontWeight: 600,
    fontSize: 10.5,
    letterSpacing: ".1em",
    color: "#A9A9B2"
  };
  const dateStr = `${t.dateLabel} · ${t.timeLabel}`;

  // B — guarantee band (isolated red-tinted container around the prize)
  if (variant === "B") {
    return /*#__PURE__*/React.createElement(React.Fragment, null, /*#__PURE__*/React.createElement("div", {
      style: {
        ...dateStyle,
        marginTop: 6
      }
    }, dateStr), /*#__PURE__*/React.createElement("div", {
      style: {
        marginTop: 11,
        display: "flex",
        alignItems: "center",
        justifyContent: "space-between",
        padding: "11px 14px",
        borderRadius: 12,
        background: "rgba(215,25,33,.12)",
        border: "1px solid rgba(215,25,33,.3)"
      }
    }, /*#__PURE__*/React.createElement("div", null, /*#__PURE__*/React.createElement("div", {
      style: lblRed
    }, "GUARANTEED"), /*#__PURE__*/React.createElement("div", {
      style: {
        ...num,
        color: suitColor,
        fontSize: t.gtd.length > 9 ? 20 : 27,
        marginTop: 4
      }
    }, t.gtd)), /*#__PURE__*/React.createElement("div", {
      style: {
        textAlign: "right"
      }
    }, /*#__PURE__*/React.createElement("div", {
      style: lblDim
    }, window.Term ? /*#__PURE__*/React.createElement(window.Term, {
      k: "BUY-IN"
    }, "BUY-IN") : "BUY-IN"), /*#__PURE__*/React.createElement("div", {
      style: {
        ...num,
        color: "#fff",
        fontSize: 16,
        marginTop: 5,
        letterSpacing: ".02em"
      }
    }, t.buyIn))));
  }

  // C — oversized headline (guarantee dominates by pure size)
  if (variant === "C") {
    return /*#__PURE__*/React.createElement(React.Fragment, null, /*#__PURE__*/React.createElement("div", {
      style: {
        marginTop: 13
      }
    }, /*#__PURE__*/React.createElement("div", {
      style: {
        ...num,
        color: suitColor,
        fontSize: t.gtd.length > 9 ? 28 : 42
      }
    }, t.gtd), /*#__PURE__*/React.createElement("div", {
      style: {
        ...lblRed,
        fontSize: 10.5,
        marginTop: 7
      }
    }, "GUARANTEED PRIZE POOL")), /*#__PURE__*/React.createElement("div", {
      style: {
        ...dateStyle,
        display: "flex",
        alignItems: "center",
        gap: 8,
        marginTop: 13
      }
    }, /*#__PURE__*/React.createElement("span", null, dateStr), /*#__PURE__*/React.createElement("span", {
      style: {
        color: "#8A8A93"
      }
    }, "|"), /*#__PURE__*/React.createElement("span", {
      style: {
        color: "#D8D8DF"
      }
    }, "BUY-IN ", t.buyIn)));
  }

  // D — solid red pill (prize gets the loud primary-CTA treatment)
  if (variant === "D") {
    return /*#__PURE__*/React.createElement(React.Fragment, null, /*#__PURE__*/React.createElement("div", {
      style: {
        ...dateStyle,
        display: "flex",
        alignItems: "center",
        gap: 8,
        marginTop: 6
      }
    }, /*#__PURE__*/React.createElement("span", null, dateStr), /*#__PURE__*/React.createElement("span", {
      style: {
        color: "#8A8A93"
      }
    }, "|"), /*#__PURE__*/React.createElement("span", {
      style: {
        color: "#D8D8DF"
      }
    }, "BUY-IN ", t.buyIn)), /*#__PURE__*/React.createElement("div", {
      style: {
        marginTop: 13,
        display: "flex"
      }
    }, /*#__PURE__*/React.createElement("div", {
      style: {
        display: "inline-flex",
        alignItems: "baseline",
        gap: 9,
        padding: "10px 18px",
        borderRadius: 125,
        background: suitColor,
        boxShadow: `0 8px 20px ${suitColor}4d`
      }
    }, /*#__PURE__*/React.createElement("span", {
      style: {
        ...num,
        color: "#fff",
        fontSize: t.gtd.length > 9 ? 18 : 23,
        letterSpacing: ".01em"
      }
    }, t.gtd), /*#__PURE__*/React.createElement("span", {
      style: {
        fontFamily: MONO_T,
        fontSize: 11,
        color: "#D8D8DF",
        letterSpacing: ".18em"
      }
    }, "GTD"))));
  }

  // A (default) — labeled stat row: GUARANTEED hero figure, BUY-IN secondary
  return /*#__PURE__*/React.createElement(React.Fragment, null, /*#__PURE__*/React.createElement("div", {
    style: {
      ...dateStyle,
      marginTop: 6
    }
  }, dateStr), /*#__PURE__*/React.createElement("div", {
    style: {
      display: "flex",
      alignItems: "flex-end",
      gap: 15,
      marginTop: 12
    }
  }, /*#__PURE__*/React.createElement("div", {
    style: {
      minWidth: 0
    }
  }, /*#__PURE__*/React.createElement("div", {
    style: lblRed
  }, "GUARANTEED"), /*#__PURE__*/React.createElement("div", {
    style: {
      ...num,
      color: suitColor,
      fontSize: t.gtd.length > 9 ? 23 : 31,
      marginTop: 5
    }
  }, t.gtd)), /*#__PURE__*/React.createElement("div", {
    style: {
      width: 1,
      alignSelf: "stretch",
      background: "rgba(255,255,255,.1)",
      margin: "1px 0"
    }
  }), /*#__PURE__*/React.createElement("div", null, /*#__PURE__*/React.createElement("div", {
    style: lblDim
  }, window.Term ? /*#__PURE__*/React.createElement(window.Term, {
    k: "BUY-IN"
  }, "BUY-IN") : "BUY-IN"), /*#__PURE__*/React.createElement("div", {
    style: {
      ...num,
      color: "#fff",
      fontSize: 17,
      marginTop: 6,
      letterSpacing: ".02em"
    }
  }, t.buyIn))));
}

// ═════════════════════════════════════════════════════════════════════════
// Home widget — compact "next event" strip. Taps through to detail.
// ═════════════════════════════════════════════════════════════════════════
function NextTournamentWidget({
  onOpen,
  onAllEvents,
  accent = "#D71921",
  variant
}) {
  const cd = useCountdown(TOURNAMENT_START);
  const t = NEXT_TOURNAMENT;
  const isRed = t.accentSuit === "heart" || t.accentSuit === "diamond";
  const suitColor = isRed ? accent : "#fff";
  const ctxVariant = React.useContext(NevVariantContext);
  let urlNev = null;
  try {
    urlNev = new URLSearchParams(location.search).get("nev");
  } catch (e) {}
  const NEV = String(variant || urlNev || ctxVariant || "B").toUpperCase();
  const [press, setPress] = React.useState(false);
  return /*#__PURE__*/React.createElement("div", {
    "data-nev-widget": NEV,
    style: {
      marginTop: 22
    }
  }, /*#__PURE__*/React.createElement("div", {
    onClick: onOpen,
    onMouseDown: () => setPress(true),
    onMouseUp: () => setPress(false),
    onMouseLeave: () => setPress(false),
    onTouchStart: () => setPress(true),
    onTouchEnd: () => setPress(false),
    style: {
      margin: "0 14px",
      position: "relative",
      overflow: "hidden",
      borderRadius: 16,
      background: "linear-gradient(160deg, #1f1f27, #0a0a0c)",
      border: "1px solid rgba(255,255,255,.13)",
      boxShadow: press ? "0 6px 14px rgba(0,0,0,.4)" : "0 12px 26px rgba(0,0,0,.45)",
      transform: press ? "translateY(1px) scale(.995)" : "none",
      transition: "transform 120ms ease, box-shadow 120ms ease",
      cursor: "pointer"
    }
  }, /*#__PURE__*/React.createElement("div", {
    style: {
      position: "absolute",
      inset: 0,
      background: `radial-gradient(circle at 88% 18%, ${accent}33 0%, transparent 55%)`,
      pointerEvents: "none"
    }
  }), /*#__PURE__*/React.createElement(Suit, {
    kind: t.accentSuit,
    size: 150,
    color: suitColor + "12",
    style: {
      position: "absolute",
      right: -34,
      top: -28,
      transform: "rotate(-12deg)"
    }
  }), /*#__PURE__*/React.createElement("div", {
    style: {
      position: "relative",
      padding: "12px 14px"
    }
  }, /*#__PURE__*/React.createElement("div", {
    style: {
      fontFamily: MONO_T,
      fontSize: 11,
      color: "#A9A9B2",
      letterSpacing: ".22em",
      textTransform: "uppercase",
      marginBottom: 12
    }
  }, "NEXT EVENT"), /*#__PURE__*/React.createElement("div", {
    style: {
      display: "flex",
      justifyContent: "space-between",
      alignItems: "center"
    }
  }, /*#__PURE__*/React.createElement(Chip, {
    color: suitColor,
    bg: isRed ? "rgba(215,25,33,.14)" : "rgba(255,255,255,.13)"
  }, t.series), /*#__PURE__*/React.createElement("div", {
    style: {
      display: "flex",
      alignItems: "center",
      gap: 6
    }
  }, /*#__PURE__*/React.createElement("span", {
    style: {
      width: 6,
      height: 6,
      borderRadius: "50%",
      background: accent,
      boxShadow: `0 0 7px ${accent}`,
      animation: "pp-pulse 1.4s ease-in-out infinite",
      flex: "none"
    }
  }), /*#__PURE__*/React.createElement("span", {
    style: {
      fontFamily: MONO_T,
      fontSize: 14,
      color: "#fff",
      letterSpacing: ".06em",
      fontVariantNumeric: "tabular-nums"
    }
  }, cd.hhmmss))), /*#__PURE__*/React.createElement("div", {
    style: {
      fontFamily: MONO_T,
      fontSize: 19,
      color: "#fff",
      letterSpacing: ".04em",
      whiteSpace: "nowrap",
      minWidth: 0,
      marginTop: 10
    }
  }, t.name), /*#__PURE__*/React.createElement(NevValueZone, {
    variant: NEV,
    t: t,
    suitColor: suitColor
  }))));
}

// ═════════════════════════════════════════════════════════════════════════
// Detail page — full-screen overlay sliding up over the lobby.
// ═════════════════════════════════════════════════════════════════════════
function TournamentDetail({
  open,
  onClose,
  accent = "#D71921",
  liveEvent,
  onDeposit
}) {
  const ev = liveEvent || null; // the tapped event, running or not
  const lv = ev && ev.start && ev.start <= Date.now() ? ev : null; // only a STARTED event is live
  const live = !!lv;
  const parseT = s => Number(String(s || "").replace(/[^\d]/g, "")) || 0;
  const t = ev ? Object.assign({}, NEXT_TOURNAMENT, {
    name: ev.name,
    buyIn: ev.buyIn,
    gtd: ev.gtd,
    gtdNum: parseT(ev.gtd) || NEXT_TOURNAMENT.gtdNum,
    poolPerEntry: Math.round(parseT(ev.buyIn) * 0.9) || NEXT_TOURNAMENT.poolPerEntry,
    buyInNum: parseT(ev.buyIn) || NEXT_TOURNAMENT.buyInNum,
    feeNum: Math.round((parseT(ev.buyIn) || NEXT_TOURNAMENT.buyInNum) * 0.1),
    series: ev.cats && ev.cats.indexOf("satellite") >= 0 ? "SATELLITE" : NEXT_TOURNAMENT.series,
    feeds: ev.feeds || null
  }) : NEXT_TOURNAMENT;
  const REG_KEY = regKeyFor(t.name);
  const REMIND_KEY = remindKeyFor(t.name);
  const cd = useCountdown(ev?.start || TOURNAMENT_START);
  // скільки насправді сателітів веде в цей турнір — для мітки вкладки
  const satCount = (window.ladderFor ? window.ladderFor(ev || {
    name: t.name,
    feeds: t.feeds,
    cats: []
  }) : []).length;
  const isRed = t.accentSuit === "heart" || t.accentSuit === "diamond";
  const suitColor = isRed ? accent : "#fff";
  const [registered, setRegistered] = React.useState(false);
  const [reminding, setReminding] = React.useState(false);
  const [unregOpen, setUnregOpen] = React.useState(false);
  // нижній док росте (банер + підпис + дві кнопки) — резервуємо під нього
  // рівно стільки, скільки він займає, щоб контент не проступав крізь нього
  const dockRef = React.useRef(null);
  const [dockH, setDockH] = React.useState(120);
  React.useLayoutEffect(() => {
    const m = () => {
      if (dockRef.current) setDockH(dockRef.current.offsetHeight || 120);
    };
    m();
    const id = setTimeout(m, 260);
    window.addEventListener("resize", m);
    return () => {
      clearTimeout(id);
      window.removeEventListener("resize", m);
    };
  });
  const [entryOpen, setEntryOpen] = React.useState(false);
  const [paidWith, setPaidWith] = React.useState(null);
  const [field, setField] = React.useState(live && window.MTT_LIVE ? window.MTT_LIVE.entries : t.startField);
  const [mounted, setMounted] = React.useState(false);
  const [justReg, setJustReg] = React.useState(false); // confirmation flash
  const [shareOpen, setShareOpen] = React.useState(false);
  const [tab, setTab] = React.useState("overview");
  const [playersOpen, setPlayersOpen] = React.useState(false);

  // live prize pool + overlay derived from field
  const pool = field * t.poolPerEntry;
  const overlay = Math.max(0, t.gtdNum - pool);
  const pct = Math.min(100, Math.round(pool / t.gtdNum * 100));

  // restore persisted state on open
  React.useEffect(() => {
    if (!open) return;
    // Use the same registration state as the lobby and My Tables.
    setRegistered(ev?.id ? !!window.PXActivity?.isRegistered(ev.id) : localStorage.getItem(REG_KEY) === "1");
    setPaidWith(null);
    setUnregOpen(false);
    setEntryOpen(false);
    setReminding(localStorage.getItem(REMIND_KEY) === "1");
    setTab("overview");
    setPlayersOpen(false);
    setMounted(false);
    const r = requestAnimationFrame(() => setMounted(true));
    return () => cancelAnimationFrame(r);
  }, [open, t.name]);

  // live field growth — registrations tick up while page is open (frozen mid-game)
  React.useEffect(() => {
    if (!open || live) return;
    const iv = setInterval(() => {
      setField(f => f + Math.floor(Math.random() * 3));
    }, 2600);
    return () => clearInterval(iv);
  }, [open, t.name]);
  const doRegister = m => {
    if (window.playClick) window.playClick(1400, 0.05);
    setPaidWith(m && m.id === "ticket" ? "TICKET" : m ? "BALANCE" : null);
    setEntryOpen(false);
    if (window.PX_SET_REG && ev && ev.id) window.PX_SET_REG(ev.id, true);
    setRegistered(true);
    setField(f => f + 1);
    localStorage.setItem(REG_KEY, "1");
    setJustReg(true);
    setTimeout(() => setJustReg(false), 1800);
  };
  const doUnregister = () => {
    if (window.PX_SET_REG && ev && ev.id) window.PX_SET_REG(ev.id, false); // un-pin it in the lobby list
    setRegistered(false);
    setPaidWith(null);
    setField(f => Math.max(0, f - 1));
    localStorage.setItem(REG_KEY, "0");
    setUnregOpen(false);
  };
  const toggleRemind = () => {
    if (window.playClick) window.playClick(900, 0.04);
    setReminding(r => {
      const nv = !r;
      localStorage.setItem(REMIND_KEY, nv ? "1" : "0");
      return nv;
    });
  };
  if (!open) return null;
  if (ev?.status === "completed") return /*#__PURE__*/React.createElement(CompletedTournamentLobby, {
    event: ev,
    onClose: onClose
  });
  return /*#__PURE__*/React.createElement("div", {
    style: {
      position: "absolute",
      inset: 0,
      zIndex: 60,
      background: "#000",
      display: "flex",
      flexDirection: "column",
      transform: mounted ? "translateY(0)" : "translateY(100%)",
      transition: "transform 360ms cubic-bezier(0.2,0.8,0.2,1)"
    }
  }, /*#__PURE__*/React.createElement("div", {
    style: {
      position: "absolute",
      top: 0,
      left: 0,
      right: 0,
      zIndex: 10,
      paddingTop: 62,
      paddingLeft: 16,
      paddingRight: 16,
      paddingBottom: 10,
      display: "flex",
      alignItems: "center",
      justifyContent: "space-between",
      background: "linear-gradient(180deg, rgba(0,0,0,.7) 40%, transparent)"
    }
  }, /*#__PURE__*/React.createElement("button", {
    onClick: onClose,
    style: {
      width: 36,
      height: 36,
      borderRadius: 12,
      background: "rgba(0,0,0,.4)",
      border: "1px solid rgba(255,255,255,.18)",
      backdropFilter: "blur(8px)",
      WebkitBackdropFilter: "blur(8px)",
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
    onClick: () => {
      if (window.playClick) window.playClick(1250, .04);
      if (window.openDeposit) window.openDeposit();
    },
    style: {
      display: "inline-flex",
      alignItems: "center",
      gap: 8,
      cursor: "pointer",
      height: 36,
      boxSizing: "border-box",
      padding: "0 6px 0 12px",
      borderRadius: 12,
      background: "rgba(0,0,0,.4)",
      border: "1px solid rgba(255,255,255,.18)",
      backdropFilter: "blur(8px)",
      WebkitBackdropFilter: "blur(8px)"
    }
  }, /*#__PURE__*/React.createElement("span", {
    style: {
      display: "block",
      fontFamily: MONO_T,
      fontWeight: 700,
      fontSize: 12,
      lineHeight: 1,
      color: "#fff",
      letterSpacing: ".02em",
      fontVariantNumeric: "tabular-nums",
      whiteSpace: "nowrap"
    }
  }, window.pxMoney && window.pxWallets ? window.pxMoney(window.pxWallets().usd) : "$1 847 500"), /*#__PURE__*/React.createElement("span", {
    style: {
      flex: "none",
      width: 24,
      height: 24,
      borderRadius: 8,
      background: accent,
      display: "flex",
      alignItems: "center",
      justifyContent: "center"
    }
  }, /*#__PURE__*/React.createElement("svg", {
    width: "11",
    height: "11",
    viewBox: "0 0 24 24",
    fill: "none",
    stroke: "#fff",
    strokeWidth: "3.4",
    strokeLinecap: "round",
    style: {
      display: "block"
    }
  }, /*#__PURE__*/React.createElement("path", {
    d: "M12 5v14M5 12h14"
  })))), /*#__PURE__*/React.createElement("button", {
    onClick: () => {
      if (window.playClick) window.playClick(1100, 0.04);
      setShareOpen(true);
    },
    style: {
      width: 36,
      height: 36,
      borderRadius: 12,
      background: "rgba(0,0,0,.4)",
      border: "1px solid rgba(255,255,255,.18)",
      backdropFilter: "blur(8px)",
      WebkitBackdropFilter: "blur(8px)",
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
  })))), /*#__PURE__*/React.createElement("div", {
    style: {
      flex: 1,
      overflowY: "auto",
      overflowX: "hidden",
      WebkitOverflowScrolling: "touch",
      paddingBottom: dockH + 18
    }
  }, /*#__PURE__*/React.createElement(TournamentCover, {
    t: t,
    accent: accent,
    suitColor: suitColor,
    isRed: isRed,
    cd: cd,
    overlay: overlay,
    live: live
  }), /*#__PURE__*/React.createElement("div", {
    style: {
      display: "flex",
      borderBottom: "1px solid rgba(255,255,255,.13)",
      padding: "0 16px",
      gap: 4
    }
  }, [["overview", "EVENT INFO"], ["satellites", "SATELLITES · " + satCount], ["prize", "PRIZE POOL"]].map(([id, lb]) => {
    const on = tab === id;
    return /*#__PURE__*/React.createElement("button", {
      key: id,
      onClick: () => {
        if (window.playClick) window.playClick(1150, 0.04);
        setTab(id);
      },
      style: {
        flex: 1,
        padding: "13px 0 11px",
        background: "transparent",
        border: 0,
        borderBottom: on ? `2px solid ${accent}` : "2px solid transparent",
        cursor: "pointer",
        fontFamily: MONO_T,
        fontSize: 11,
        letterSpacing: ".14em",
        color: on ? "#fff" : "rgba(255,255,255,.45)",
        transition: "color 140ms"
      }
    }, lb);
  })), tab === "overview" && /*#__PURE__*/React.createElement("div", {
    style: {
      padding: "18px 16px 170px"
    }
  }, live && window.LiveStatusCards ? /*#__PURE__*/React.createElement(window.LiveStatusCards, {
    accent: accent,
    entries: field
  }) : null, /*#__PURE__*/React.createElement("div", {
    style: {
      display: "grid",
      gridTemplateColumns: "1fr 1fr 1fr",
      gap: 1,
      background: "rgba(255,255,255,.07)",
      borderRadius: 14,
      overflow: "hidden",
      border: "1px solid rgba(255,255,255,.07)"
    }
  }, /*#__PURE__*/React.createElement(InfoCell, {
    label: "DATE",
    value: "JUN 1"
  }), /*#__PURE__*/React.createElement(InfoCell, {
    label: "START",
    value: t.timeLabel
  }), /*#__PURE__*/React.createElement(InfoCell, {
    label: "BUY-IN",
    value: t.buyIn,
    accentVal: suitColor
  }), /*#__PURE__*/React.createElement(InfoCell, {
    label: "STARTING STACK",
    value: t.startStack,
    sub: t.startBB
  }), /*#__PURE__*/React.createElement(InfoCell, {
    label: "BLIND LEVELS",
    value: t.levelTime
  }), /*#__PURE__*/React.createElement(InfoCell, {
    label: "RE-ENTRY",
    value: t.reEntry
  }), /*#__PURE__*/React.createElement(InfoCell, {
    label: "EST. DURATION",
    value: "2H 40M"
  }), /*#__PURE__*/React.createElement(InfoCell, {
    label: "LATE REG",
    value: "60 MIN",
    sub: "LEVELS 1\u201310"
  }), /*#__PURE__*/React.createElement(InfoCell, {
    label: "TABLE",
    value: "8-MAX"
  })), /*#__PURE__*/React.createElement("button", {
    onClick: () => {
      if (window.playClick) window.playClick(1100, 0.04);
      setPlayersOpen(true);
    },
    style: {
      marginTop: 16,
      padding: "14px 16px",
      width: "100%",
      textAlign: "left",
      cursor: "pointer",
      borderRadius: 14,
      background: "rgba(255,255,255,.06)",
      border: "1px solid rgba(255,255,255,.07)",
      display: "flex",
      alignItems: "center",
      justifyContent: "space-between"
    }
  }, /*#__PURE__*/React.createElement("div", null, /*#__PURE__*/React.createElement("div", {
    style: {
      fontFamily: SANS_T,
      fontWeight: 700,
      fontSize: 10.5,
      color: "#A9A9B2",
      letterSpacing: ".2em"
    }
  }, live ? "PLAYERS LEFT" : "PLAYERS REGISTERED"), /*#__PURE__*/React.createElement("div", {
    style: {
      fontFamily: MONO_T,
      fontSize: 26,
      color: "#fff",
      marginTop: 6,
      letterSpacing: ".01em",
      fontVariantNumeric: "tabular-nums"
    }
  }, live && window.MTT_LIVE ? window.MTT_LIVE.left + " / " + field : field.toLocaleString("en-US").split(",").join(" "))), /*#__PURE__*/React.createElement("span", {
    style: {
      display: "flex",
      alignItems: "center",
      gap: 6
    }
  }, /*#__PURE__*/React.createElement("span", {
    style: {
      width: 6,
      height: 6,
      borderRadius: "50%",
      background: live ? accent : "#5BD96A",
      boxShadow: live ? `0 0 7px ${accent}` : "0 0 7px #5BD96A",
      animation: "pp-pulse 1.6s ease-in-out infinite",
      flex: "none"
    }
  }), /*#__PURE__*/React.createElement("span", {
    style: {
      fontFamily: SANS_T,
      fontWeight: 700,
      fontSize: 10.5,
      color: "#A9A9B2",
      letterSpacing: ".16em"
    }
  }, live ? "LIVE" : "FILLING"), /*#__PURE__*/React.createElement("svg", {
    width: "13",
    height: "13",
    viewBox: "0 0 24 24",
    fill: "none",
    stroke: "rgba(255,255,255,.55)",
    strokeWidth: "2.6",
    strokeLinecap: "round",
    strokeLinejoin: "round",
    style: {
      marginLeft: 4,
      flex: "none"
    }
  }, /*#__PURE__*/React.createElement("path", {
    d: "M9 6l6 6-6 6"
  })))), /*#__PURE__*/React.createElement(TournSpecList, {
    t: t
  }), live && t.feeds && window.TargetEventNote ? /*#__PURE__*/React.createElement(window.TargetEventNote, {
    accent: accent,
    name: t.feeds
  }) : null, /*#__PURE__*/React.createElement(BlindStructure, {
    levelTime: t.levelTime,
    currentLevel: live && window.MTT_LIVE && window.MTT_LIVE.levelNow ? window.MTT_LIVE.levelNow() : 0
  })), tab === "satellites" && /*#__PURE__*/React.createElement(SatLadderTab, {
    accent: accent,
    t: t,
    ev: ev
  }), tab === "prize" && /*#__PURE__*/React.createElement(PrizePoolTab, {
    accent: accent,
    pool: pool,
    gtdNum: t.gtdNum,
    live: live,
    feeds: t.feeds
  })), /*#__PURE__*/React.createElement("div", {
    ref: dockRef,
    style: {
      position: "absolute",
      left: 0,
      right: 0,
      bottom: 0,
      padding: "18px 16px 26px",
      background: "linear-gradient(180deg, rgba(0,0,0,0) 0%, rgba(0,0,0,.97) 9%, #000 19%)",
      backdropFilter: "blur(6px)",
      WebkitBackdropFilter: "blur(6px)"
    }
  }, live && window.LiveCtaDock ? /*#__PURE__*/React.createElement(window.LiveCtaDock, {
    accent: accent,
    t: t,
    registered: registered,
    onRegister: () => {
      if (window.playClick) window.playClick(1200, 0.04);
      setEntryOpen(true);
    },
    onUnregister: () => {
      if (window.playClick) window.playClick(800, 0.04);
      setUnregOpen(true);
    }
  }) : registered ? /*#__PURE__*/React.createElement("div", {
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
      padding: "11px 14px",
      borderRadius: 12,
      background: justReg ? "rgba(91,217,106,.16)" : "rgba(91,217,106,.10)",
      border: "1px solid rgba(91,217,106,.4)",
      transition: "background 300ms"
    }
  }, /*#__PURE__*/React.createElement("span", {
    style: {
      width: 22,
      height: 22,
      borderRadius: "50%",
      flex: "none",
      background: "#5BD96A",
      display: "flex",
      alignItems: "center",
      justifyContent: "center"
    }
  }, /*#__PURE__*/React.createElement("svg", {
    width: "12",
    height: "12",
    viewBox: "0 0 24 24",
    fill: "none",
    stroke: "#000",
    strokeWidth: "3.4",
    strokeLinecap: "round",
    strokeLinejoin: "round"
  }, /*#__PURE__*/React.createElement("path", {
    d: "M5 12l5 5L20 6"
  }))), /*#__PURE__*/React.createElement("div", {
    style: {
      flex: 1
    }
  }, /*#__PURE__*/React.createElement("div", {
    style: {
      fontFamily: MONO_T,
      fontSize: 13,
      color: "#fff",
      letterSpacing: ".06em"
    }
  }, "YOU'RE REGISTERED"), /*#__PURE__*/React.createElement("div", {
    style: {
      fontFamily: SANS_T,
      fontWeight: 600,
      fontSize: 10.5,
      color: "#A9A9B2",
      letterSpacing: ".1em",
      marginTop: 2
    }
  }, "STARTS IN ", cd.hhmmss, " \xB7 ", paidWith === "TICKET" ? "PAID WITH TICKET" : "SEAT RESERVED"))), /*#__PURE__*/React.createElement("div", {
    style: {
      height: 16,
      marginBottom: 6,
      display: "flex",
      alignItems: "center",
      justifyContent: "center",
      gap: 6,
      whiteSpace: "nowrap",
      opacity: reminding ? 1 : 0,
      transition: "opacity 180ms"
    }
  }, /*#__PURE__*/React.createElement("svg", {
    width: "11",
    height: "11",
    viewBox: "0 0 24 24",
    fill: "none",
    stroke: "#5BD96A",
    strokeWidth: "3",
    strokeLinecap: "round",
    strokeLinejoin: "round"
  }, /*#__PURE__*/React.createElement("path", {
    d: "M20 6L9 17l-5-5"
  })), /*#__PURE__*/React.createElement("span", {
    style: {
      fontFamily: SANS_T,
      fontWeight: 600,
      fontSize: 10.5,
      letterSpacing: ".06em",
      color: "#A9A9B2"
    }
  }, "We ping you 15 min before the start \xB7 tap again to cancel")), /*#__PURE__*/React.createElement("div", {
    style: {
      position: "relative",
      display: "flex",
      gap: 9
    }
  }, /*#__PURE__*/React.createElement("button", {
    onClick: toggleRemind,
    style: Object.assign(UI.btn("l", "ghost", accent), {
      flex: 1,
      background: reminding ? "rgba(255,255,255,.085)" : "transparent",
      border: `1px solid ${reminding ? "rgba(255,255,255,.5)" : "rgba(255,255,255,.22)"}`,
      color: reminding ? "#fff" : "rgba(255,255,255,.7)"
    })
  }, /*#__PURE__*/React.createElement("svg", {
    width: "16",
    height: "16",
    viewBox: "0 0 24 24",
    fill: reminding ? "#fff" : "none",
    stroke: reminding ? "#fff" : "rgba(255,255,255,.7)",
    strokeWidth: "2",
    strokeLinecap: "round",
    strokeLinejoin: "round"
  }, /*#__PURE__*/React.createElement("path", {
    d: "M6 8a6 6 0 0 1 12 0c0 7 3 9 3 9H3s3-2 3-9"
  }), /*#__PURE__*/React.createElement("path", {
    d: "M10 21a2 2 0 0 0 4 0"
  })), reminding ? "REMINDER SET" : "REMIND ME"), /*#__PURE__*/React.createElement("button", {
    onClick: () => {
      if (window.playClick) window.playClick(800, 0.04);
      setUnregOpen(true);
    },
    style: Object.assign(UI.btn("l", "outline", accent), {
      flex: "none",
      fontSize: 13
    })
  }, "UNREGISTER"))) : /*#__PURE__*/React.createElement("button", {
    onClick: () => {
      if (window.playClick) window.playClick(1200, 0.04);
      setEntryOpen(true);
    },
    onMouseDown: e => {
      e.currentTarget.style.transform = "translateY(1px)";
    },
    onMouseUp: e => {
      e.currentTarget.style.transform = "";
    },
    onMouseLeave: e => {
      e.currentTarget.style.transform = "";
    },
    style: Object.assign(UI.btn("xl", "primary", accent), {
      width: "100%",
      gap: 10,
      transition: "transform 100ms"
    })
  }, /*#__PURE__*/React.createElement("span", {
    style: {
      fontFamily: MONO_T,
      fontSize: 16,
      letterSpacing: ".12em",
      color: "#fff"
    }
  }, "REGISTER \xB7 ", t.buyIn), /*#__PURE__*/React.createElement("span", {
    style: {
      paddingLeft: 11,
      marginLeft: 1,
      borderLeft: "1px solid rgba(255,255,255,.35)",
      fontFamily: MONO_T,
      fontSize: 14,
      letterSpacing: ".04em",
      color: "#D8D8DF",
      fontVariantNumeric: "tabular-nums"
    }
  }, cd.hhmmss))), /*#__PURE__*/React.createElement(EntrySheet, {
    open: entryOpen,
    onClose: () => setEntryOpen(false),
    onDone: doRegister,
    accent: accent,
    t: t,
    onDeposit: onDeposit
  }), /*#__PURE__*/React.createElement(UnregSheet, {
    open: unregOpen,
    onClose: () => setUnregOpen(false),
    onDone: doUnregister,
    accent: accent,
    t: t
  }), playersOpen && /*#__PURE__*/React.createElement("div", {
    style: {
      position: "absolute",
      inset: 0,
      zIndex: 80,
      background: "#000",
      display: "flex",
      flexDirection: "column"
    }
  }, /*#__PURE__*/React.createElement("div", {
    style: {
      paddingTop: 62,
      paddingLeft: 14,
      paddingRight: 16,
      paddingBottom: 8,
      display: "flex",
      alignItems: "center",
      justifyContent: "space-between",
      flex: "none"
    }
  }, /*#__PURE__*/React.createElement("button", {
    onClick: () => {
      if (window.playClick) window.playClick(900, 0.04);
      setPlayersOpen(false);
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
      fontFamily: MONO_T,
      fontSize: 13,
      color: "#fff",
      letterSpacing: ".22em"
    }
  }, "PLAYERS"), /*#__PURE__*/React.createElement("span", {
    style: {
      width: 36,
      height: 36
    }
  })), /*#__PURE__*/React.createElement("div", {
    style: {
      flex: 1,
      overflowY: "auto",
      overflowX: "hidden",
      WebkitOverflowScrolling: "touch"
    }
  }, window.LivePlayersTab && live ? /*#__PURE__*/React.createElement(window.LivePlayersTab, {
    accent: accent
  }) : /*#__PURE__*/React.createElement(PlayersTab, {
    accent: accent,
    count: field,
    registered: registered
  }))), /*#__PURE__*/React.createElement(ShareStoryModal, {
    open: shareOpen,
    onClose: () => setShareOpen(false),
    accent: accent
  }));
}

// ── EVENT INFO extensions — spec list, blind structure, prize pool ──
const TD_ROW = {
  display: "flex",
  alignItems: "baseline",
  gap: 12,
  padding: "10px 2px",
  borderBottom: "1px solid rgba(255,255,255,.07)"
};
const TD_K = {
  flex: "none",
  width: 128,
  fontFamily: SANS_T,
  fontWeight: 700,
  fontSize: 10.5,
  letterSpacing: ".12em",
  color: "#A9A9B2"
};
const TD_V = {
  flex: 1,
  fontFamily: MONO_T,
  fontSize: 12,
  color: "#fff",
  letterSpacing: ".01em"
};
function TournSpecList({
  t
}) {
  const rows = [["GAME TYPE", "No Limit Hold'em"], ["BUY-IN BREAKDOWN", (() => {
    const n = Number(String(t.buyIn).replace(/[^\d]/g, ""));
    return n ? "$" + (n * 0.9).toLocaleString("en-US").split(",").join(" ") + " + $" + (n * 0.1).toLocaleString("en-US").split(",").join(" ") + " fee" : t.buyIn;
  })()], ["BREAK TIME", "5-min break every 55 min past the hour"], ["FT BLIND ROLLBACK", "Not applicable"], ["MIN~MAX PLAYERS", "2 – 9 999"], ["BUBBLE PROTECT", "Buy-in compensated if eliminated at the bubble"]];
  return /*#__PURE__*/React.createElement("div", {
    style: {
      marginTop: 16,
      padding: "4px 14px 6px",
      borderRadius: 14,
      background: "rgba(255,255,255,.05)",
      border: "1px solid rgba(255,255,255,.09)"
    }
  }, /*#__PURE__*/React.createElement("div", {
    style: {
      padding: "12px 2px 4px",
      fontFamily: SANS_T,
      fontWeight: 700,
      fontSize: 10.5,
      letterSpacing: ".2em",
      color: "#A9A9B2"
    }
  }, "DETAILS"), rows.map((r, i) => /*#__PURE__*/React.createElement("div", {
    key: r[0],
    style: {
      ...TD_ROW,
      borderBottom: i === rows.length - 1 ? "none" : TD_ROW.borderBottom
    }
  }, /*#__PURE__*/React.createElement("span", {
    style: TD_K
  }, r[0]), /*#__PURE__*/React.createElement("span", {
    style: TD_V
  }, r[1]))));
}
function AccSection({
  title,
  right,
  children,
  defOpen = false
}) {
  const [open, setOpen] = React.useState(defOpen);
  return /*#__PURE__*/React.createElement("div", {
    style: {
      marginTop: 12,
      borderRadius: 14,
      background: "rgba(255,255,255,.05)",
      border: "1px solid rgba(255,255,255,.09)",
      overflow: "hidden"
    }
  }, /*#__PURE__*/React.createElement("button", {
    onClick: () => {
      if (window.playClick) window.playClick(1050, 0.04);
      setOpen(v => !v);
    },
    style: {
      width: "100%",
      display: "flex",
      alignItems: "center",
      gap: 8,
      padding: "13px 14px",
      background: "transparent",
      border: 0,
      cursor: "pointer"
    }
  }, /*#__PURE__*/React.createElement("span", {
    style: {
      fontFamily: SANS_T,
      fontWeight: 700,
      fontSize: 10.5,
      letterSpacing: ".2em",
      color: "#D8D8DF"
    }
  }, title), right ? /*#__PURE__*/React.createElement("span", {
    style: {
      marginLeft: "auto",
      fontFamily: MONO_T,
      fontSize: 11,
      color: "#A9A9B2"
    }
  }, right) : /*#__PURE__*/React.createElement("span", {
    style: {
      marginLeft: "auto"
    }
  }), /*#__PURE__*/React.createElement("svg", {
    width: "12",
    height: "12",
    viewBox: "0 0 24 24",
    fill: "none",
    stroke: "rgba(255,255,255,.6)",
    strokeWidth: "2.4",
    strokeLinecap: "round",
    strokeLinejoin: "round",
    style: {
      transform: open ? "rotate(180deg)" : "none",
      transition: "transform 180ms",
      flex: "none"
    }
  }, /*#__PURE__*/React.createElement("path", {
    d: "M6 9l6 6 6-6"
  }))), open ? children : null);
}
function BlindStructure({
  levelTime = "6 MIN",
  currentLevel = 0
}) {
  const SB = [50, 60, 70, 80, 100, 125, 150, 175, 200, 225, 250, 300, 350, 400, 500, 600, 800, 1000, 1250, 1500, 1750, 2000, 2500, 3000];
  const mins = parseInt(levelTime, 10) || 6;
  const CH = {
    fontFamily: SANS_T,
    fontWeight: 700,
    fontSize: 10.5,
    letterSpacing: ".12em",
    color: "#A9A9B2"
  };
  const CV = {
    fontFamily: MONO_T,
    fontSize: 11,
    color: "#D8D8DF",
    fontVariantNumeric: "tabular-nums"
  };
  return /*#__PURE__*/React.createElement(AccSection, {
    title: "STRUCTURE",
    right: currentLevel > 0 ? `LIVE · LEVEL ${currentLevel}` : `LEVELS · ${levelTime}`,
    defOpen: currentLevel > 0
  }, /*#__PURE__*/React.createElement("div", {
    style: {
      padding: "0 14px 12px"
    }
  }, /*#__PURE__*/React.createElement("div", {
    style: {
      display: "grid",
      gridTemplateColumns: "38px 1fr 64px 54px 44px",
      gap: 6,
      padding: "6px 0",
      borderBottom: "1px solid rgba(255,255,255,.1)"
    }
  }, /*#__PURE__*/React.createElement("span", {
    style: CH
  }, "LVL"), /*#__PURE__*/React.createElement("span", {
    style: CH
  }, "BLINDS"), /*#__PURE__*/React.createElement("span", {
    style: {
      ...CH,
      textAlign: "right"
    }
  }, "ANTE"), /*#__PURE__*/React.createElement("span", {
    style: {
      ...CH,
      textAlign: "right"
    }
  }, "BANK"), /*#__PURE__*/React.createElement("span", {
    style: {
      ...CH,
      textAlign: "right"
    }
  }, "MIN")), SB.map((sb, i) => {
    const hl = i + 1 === currentLevel;
    return /*#__PURE__*/React.createElement("div", {
      key: i,
      style: {
        display: "grid",
        gridTemplateColumns: "38px 1fr 64px 54px 44px",
        gap: 6,
        padding: "5.5px 8px",
        margin: "0 -8px",
        borderBottom: i === SB.length - 1 ? "none" : "1px solid rgba(255,255,255,.05)",
        background: hl ? "rgba(215,25,33,.16)" : "transparent",
        borderLeft: hl ? "3px solid #D71921" : "3px solid transparent",
        borderRadius: 0
      }
    }, /*#__PURE__*/React.createElement("span", {
      style: {
        ...CV,
        color: hl ? "#ff6b72" : i === 0 ? "#fff" : CV.color,
        fontWeight: hl ? 700 : 400
      }
    }, i + 1), /*#__PURE__*/React.createElement("span", {
      style: CV
    }, sb.toLocaleString("en-US").split(",").join(" "), " | ", (sb * 2).toLocaleString("en-US").split(",").join(" ")), /*#__PURE__*/React.createElement("span", {
      style: {
        ...CV,
        textAlign: "right"
      }
    }, Math.round(sb * 0.3).toLocaleString("en-US").split(",").join(" ")), /*#__PURE__*/React.createElement("span", {
      style: {
        ...CV,
        textAlign: "right",
        color: "#A9A9B2"
      }
    }, i % 20 === 0 ? "5s" : "–"), /*#__PURE__*/React.createElement("span", {
      style: {
        ...CV,
        textAlign: "right"
      }
    }, mins));
  })));
}
function PrizePoolAcc({
  accent,
  pool = 0
}) {
  const PCT = [["1ST", 23], ["2ND", 15], ["3RD", 10.5], ["4TH", 8], ["5TH", 6], ["6TH", 4.5], ["7TH", 3.5], ["8TH", 2.75], ["9TH", 2.25]];
  return /*#__PURE__*/React.createElement(AccSection, {
    title: "PRIZE POOL",
    right: `$${pool.toLocaleString("en-US").split(",").join(" ")}`
  }, /*#__PURE__*/React.createElement("div", {
    style: {
      padding: "0 14px 12px"
    }
  }, PCT.map(([pl, pc], i) => /*#__PURE__*/React.createElement("div", {
    key: pl,
    style: {
      display: "flex",
      alignItems: "baseline",
      gap: 10,
      padding: "7px 0",
      borderBottom: i === PCT.length - 1 ? "none" : "1px solid rgba(255,255,255,.05)"
    }
  }, /*#__PURE__*/React.createElement("span", {
    style: {
      flex: "none",
      width: 44,
      fontFamily: SANS_T,
      fontWeight: 700,
      fontSize: 10.5,
      letterSpacing: ".12em",
      color: i === 0 ? accent : "rgba(255,255,255,.55)"
    }
  }, pl), /*#__PURE__*/React.createElement("span", {
    style: {
      fontFamily: MONO_T,
      fontSize: 12,
      color: i === 0 ? accent : "#fff",
      fontVariantNumeric: "tabular-nums"
    }
  }, "$", Math.round(pool * pc / 100).toLocaleString("en-US").split(",").join(" ")), /*#__PURE__*/React.createElement("span", {
    style: {
      marginLeft: "auto",
      fontFamily: MONO_T,
      fontSize: 10.5,
      color: "#A9A9B2"
    }
  }, pc, "%"))), /*#__PURE__*/React.createElement("p", {
    style: {
      margin: "10px 0 0",
      fontFamily: SANS_T,
      fontWeight: 600,
      fontSize: 11,
      lineHeight: 1.5,
      color: "#D8D8DF"
    }
  }, "Top 13% of the field is paid \u2014 the last spot before the money is the ", window.Term ? /*#__PURE__*/React.createElement(window.Term, {
    k: "BUBBLE"
  }, "bubble") : "bubble", ". Percentages shown for the current live pool.")));
}
// ── PRIZE POOL tab — live payout table ──
function PrizePoolTab({
  accent,
  pool = 0,
  gtdNum = 0,
  live,
  feeds
}) {
  const PCT = [["1ST", 23], ["2ND", 15], ["3RD", 10.5], ["4TH", 8], ["5TH", 6], ["6TH", 4.5], ["7TH", 3.5], ["8TH", 2.75], ["9TH", 2.25]];
  const eff = Math.max(pool, gtdNum); // payouts never drop below the guarantee
  const gtdActive = pool < gtdNum;
  if (live && feeds && window.PrizeLiveCallout) {
    return /*#__PURE__*/React.createElement("div", {
      style: {
        padding: "16px 16px 170px"
      }
    }, /*#__PURE__*/React.createElement(window.PrizeLiveCallout, {
      accent: accent,
      eff: eff,
      sat: true,
      feeds: feeds
    }), /*#__PURE__*/React.createElement("p", {
      style: {
        margin: "2px 2px 0",
        fontFamily: SANS_T,
        fontWeight: 600,
        fontSize: 11,
        lineHeight: 1.55,
        color: "#D8D8DF",
        textWrap: "pretty"
      }
    }, "Seats are awarded whole \u2014 the cash remainder goes to the first place below the seat line. Winners are auto-registered into the target event."));
  }
  return /*#__PURE__*/React.createElement("div", {
    style: {
      padding: "16px 16px 170px"
    }
  }, /*#__PURE__*/React.createElement("div", {
    style: {
      display: "flex",
      alignItems: "baseline",
      gap: 8
    }
  }, /*#__PURE__*/React.createElement("span", {
    style: {
      fontFamily: MONO_T,
      fontSize: 22,
      color: accent,
      fontVariantNumeric: "tabular-nums"
    }
  }, "$", eff.toLocaleString("en-US").split(",").join(" ")), /*#__PURE__*/React.createElement("span", {
    style: {
      fontFamily: SANS_T,
      fontWeight: 700,
      fontSize: 10.5,
      letterSpacing: ".18em",
      color: "#A9A9B2"
    }
  }, gtdActive ? "GUARANTEED PRIZE POOL" : "LIVE PRIZE POOL")), gtdActive ? /*#__PURE__*/React.createElement("div", {
    style: {
      marginTop: 6,
      fontFamily: SANS_T,
      fontWeight: 600,
      fontSize: 10.5,
      color: "#A9A9B2"
    }
  }, "Collected so far ", /*#__PURE__*/React.createElement("span", {
    style: {
      fontFamily: MONO_T,
      color: "#D8D8DF"
    }
  }, "$", pool.toLocaleString("en-US").split(",").join(" ")), " \u2014 the shortfall is covered by the guarantee (overlay).") : null, live && window.PrizeLiveCallout ? /*#__PURE__*/React.createElement(window.PrizeLiveCallout, {
    accent: accent,
    eff: eff
  }) : null, /*#__PURE__*/React.createElement("div", {
    style: {
      marginTop: 12,
      padding: "2px 14px",
      borderRadius: 14,
      background: "rgba(255,255,255,.05)",
      border: "1px solid rgba(255,255,255,.09)"
    }
  }, PCT.map(([pl, pc], i) => /*#__PURE__*/React.createElement("div", {
    key: pl,
    style: {
      display: "flex",
      alignItems: "baseline",
      gap: 10,
      padding: "9px 0",
      borderBottom: i === PCT.length - 1 ? "none" : "1px solid rgba(255,255,255,.06)"
    }
  }, /*#__PURE__*/React.createElement("span", {
    style: {
      flex: "none",
      width: 44,
      fontFamily: SANS_T,
      fontWeight: 700,
      fontSize: 10.5,
      letterSpacing: ".12em",
      color: i === 0 ? accent : "rgba(255,255,255,.55)"
    }
  }, pl), /*#__PURE__*/React.createElement("span", {
    style: {
      fontFamily: MONO_T,
      fontSize: 13,
      color: i === 0 ? accent : "#fff",
      fontVariantNumeric: "tabular-nums"
    }
  }, "$", Math.round(eff * pc / 100).toLocaleString("en-US").split(",").join(" ")), /*#__PURE__*/React.createElement("span", {
    style: {
      marginLeft: "auto",
      fontFamily: MONO_T,
      fontSize: 10.5,
      color: "#A9A9B2"
    }
  }, pc, "%")))), /*#__PURE__*/React.createElement("p", {
    style: {
      margin: "12px 2px 0",
      fontFamily: SANS_T,
      fontWeight: 600,
      fontSize: 11,
      lineHeight: 1.55,
      color: "#D8D8DF",
      textWrap: "pretty"
    }
  }, "Top 13% of the field is paid \u2014 the last spot before the money is the ", window.Term ? /*#__PURE__*/React.createElement(window.Term, {
    k: "BUBBLE"
  }, "bubble") : "bubble", ". Payouts update live as registrations grow."));
}
// ── slide-to-confirm — drag the knob the whole way to fire onDone ────────
function SlideConfirm({
  label = "SLIDE TO CONFIRM",
  accent = "#D71921",
  onDone
}) {
  const railRef = React.useRef(null);
  const [x, setX] = React.useState(0);
  const [drag, setDrag] = React.useState(false);
  const [done, setDone] = React.useState(false);
  const KNOB = 52,
    PAD = 4;
  const span = () => {
    const w = railRef.current ? railRef.current.offsetWidth : 300;
    return Math.max(1, w - KNOB - PAD * 2);
  };
  const move = clientX => {
    const r = railRef.current.getBoundingClientRect();
    setX(Math.max(0, Math.min(span(), (clientX - r.left) * (railRef.current.offsetWidth / r.width) - PAD - KNOB / 2)));
  };
  const start = e => {
    if (done) return;
    setDrag(true);
    move(e.touches ? e.touches[0].clientX : e.clientX);
  };
  React.useEffect(() => {
    if (!drag) return;
    const onMove = e => {
      e.preventDefault();
      move(e.touches ? e.touches[0].clientX : e.clientX);
    };
    const onUp = () => {
      setDrag(false);
      setX(cur => {
        if (cur >= span() - 2) {
          setDone(true);
          if (window.playClick) window.playClick(700, 0.06);
          setTimeout(() => onDone && onDone(), 220);
          return span();
        }
        if (window.playClick) window.playClick(500, 0.03);
        return 0;
      });
    };
    window.addEventListener("mousemove", onMove);
    window.addEventListener("mouseup", onUp);
    window.addEventListener("touchmove", onMove, {
      passive: false
    });
    window.addEventListener("touchend", onUp);
    return () => {
      window.removeEventListener("mousemove", onMove);
      window.removeEventListener("mouseup", onUp);
      window.removeEventListener("touchmove", onMove);
      window.removeEventListener("touchend", onUp);
    };
  }, [drag]);
  const pct = x / span();
  return /*#__PURE__*/React.createElement("div", {
    ref: railRef,
    style: {
      position: "relative",
      height: KNOB + PAD * 2,
      borderRadius: 125,
      overflow: "hidden",
      background: "rgba(255,255,255,.05)",
      border: `1px solid ${accent}55`,
      touchAction: "none",
      userSelect: "none",
      WebkitUserSelect: "none",
      cursor: done ? "default" : "grab"
    }
  }, /*#__PURE__*/React.createElement("div", {
    style: {
      position: "absolute",
      inset: 0,
      borderRadius: 125,
      background: `linear-gradient(90deg, ${accent}3d ${pct * 100}%, transparent ${pct * 100}%)`
    }
  }), /*#__PURE__*/React.createElement("div", {
    style: {
      position: "absolute",
      inset: 0,
      display: "flex",
      alignItems: "center",
      justifyContent: "center",
      gap: 8,
      pointerEvents: "none",
      fontFamily: MONO_T,
      fontSize: 13,
      letterSpacing: ".12em",
      color: done ? "#fff" : `rgba(255,255,255,${0.72 - pct * 0.5})`
    }
  }, done ? "UNREGISTERED" : label, !done && /*#__PURE__*/React.createElement("span", {
    style: {
      display: "flex",
      opacity: 0.5 - pct * 0.4
    }
  }, [0, 1, 2].map(i => /*#__PURE__*/React.createElement("svg", {
    key: i,
    width: "12",
    height: "12",
    viewBox: "0 0 24 24",
    fill: "none",
    stroke: "#fff",
    strokeWidth: "2.4",
    strokeLinecap: "round",
    strokeLinejoin: "round",
    style: {
      marginLeft: i ? -5 : 0,
      opacity: 0.35 + i * 0.3
    }
  }, /*#__PURE__*/React.createElement("path", {
    d: "M9 6l6 6-6 6"
  }))))), /*#__PURE__*/React.createElement("div", {
    onMouseDown: start,
    onTouchStart: start,
    style: {
      position: "absolute",
      top: PAD,
      left: PAD,
      width: KNOB,
      height: KNOB,
      borderRadius: "50%",
      transform: `translateX(${x}px)`,
      transition: drag ? "none" : "transform 260ms cubic-bezier(.2,.8,.2,1)",
      background: accent,
      boxShadow: `0 8px 20px ${accent}66`,
      display: "flex",
      alignItems: "center",
      justifyContent: "center",
      cursor: done ? "default" : "grab"
    }
  }, done ? /*#__PURE__*/React.createElement("svg", {
    width: "20",
    height: "20",
    viewBox: "0 0 24 24",
    fill: "none",
    stroke: "#fff",
    strokeWidth: "3.2",
    strokeLinecap: "round",
    strokeLinejoin: "round"
  }, /*#__PURE__*/React.createElement("path", {
    d: "M5 12l5 5L20 6"
  })) : /*#__PURE__*/React.createElement("svg", {
    width: "20",
    height: "20",
    viewBox: "0 0 24 24",
    fill: "none",
    stroke: "#fff",
    strokeWidth: "2.6",
    strokeLinecap: "round",
    strokeLinejoin: "round"
  }, /*#__PURE__*/React.createElement("path", {
    d: "M5 12h13M13 7l5 5-5 5"
  }))));
}

// ── entry sheet — how the buy-in is paid (balance / T$ / ticket) ─────────
const TICKETS_OWNED = {
  "DAILY DEEP": "EXPIRES TODAY",
  "HIGH ROLLER Big Bounty": "EXPIRES TODAY",
  "SUNDAY GRAND BOUNTY - 250 000 GTD": "EVERY SUN",
  "Omaholic Bounty": "7 DAYS",
  "Morning Run": "TODAY"
};
const BALANCE_KZT = 2480000;
const kztFmt = n => "$" + n.toLocaleString("en-US").split(",").join(" "); // $ formatter (name kept: referenced below)
const entryMethods = (name, price) => {
  const tk = TICKETS_OWNED[name];
  const rich = BALANCE_KZT >= price;
  return [{
    id: "balance",
    name: "BALANCE",
    sub: rich ? "USDT WALLET" : "NOT ENOUGH · TOP UP " + kztFmt(price - BALANCE_KZT),
    have: kztFmt(BALANCE_KZT),
    ok: rich
  }, {
    id: "tdollar",
    name: "TOURNAMENT DOLLARS",
    sub: "T$ 0 · WON IN SATELLITES",
    have: "T$ 0",
    ok: false
  }, {
    id: "ticket",
    name: "TICKET",
    sub: tk ? name + " · " + tk : "NO TICKET FOR THIS EVENT",
    have: tk ? "×1" : "—",
    ok: !!tk
  }];
};
function EntrySheet({
  open,
  onClose,
  onDone,
  accent,
  t,
  onDeposit
}) {
  const [mounted, setMounted] = React.useState(false);
  const [pick, setPick] = React.useState(null);
  const METHODS = entryMethods(t.name, t.buyInNum);
  const payable = METHODS.find(x => x.ok);
  React.useEffect(() => {
    if (!open) {
      setMounted(false);
      return;
    }
    setPick(payable ? payable.id : null);
    const r = requestAnimationFrame(() => setMounted(true));
    return () => cancelAnimationFrame(r);
  }, [open]);
  if (!open) return null;
  const kzt = n => "$" + n.toLocaleString("en-US").split(",").join(" ");
  const m = METHODS.find(x => x.id === pick);
  const free = pick === "ticket";
  return /*#__PURE__*/React.createElement("div", {
    style: {
      position: "absolute",
      inset: 0,
      zIndex: 120,
      display: "flex",
      flexDirection: "column",
      justifyContent: "flex-end"
    }
  }, /*#__PURE__*/React.createElement("div", {
    onClick: onClose,
    style: {
      position: "absolute",
      inset: 0,
      background: "rgba(0,0,0,.72)",
      opacity: mounted ? 1 : 0,
      transition: "opacity 200ms"
    }
  }), /*#__PURE__*/React.createElement("div", {
    style: {
      position: "relative",
      padding: "18px 16px 26px",
      borderRadius: "22px 22px 0 0",
      background: "#141416",
      boxShadow: "0 -3px 4px rgba(64,64,64,.31)",
      transform: mounted ? "translateY(0)" : "translateY(100%)",
      transition: "transform 300ms cubic-bezier(.2,.8,.2,1)"
    }
  }, /*#__PURE__*/React.createElement("div", {
    style: {
      width: 40,
      height: 4,
      borderRadius: 2,
      background: "rgba(255,255,255,.2)",
      margin: "0 auto 16px"
    }
  }), /*#__PURE__*/React.createElement("div", {
    style: {
      fontFamily: MONO_T,
      fontSize: 16,
      color: "#fff",
      letterSpacing: ".06em"
    }
  }, t.name), /*#__PURE__*/React.createElement("div", {
    style: {
      display: "flex",
      gap: 8,
      marginTop: 13
    }
  }, /*#__PURE__*/React.createElement("div", {
    style: {
      flex: 1,
      padding: "11px 13px",
      borderRadius: 12,
      background: "rgba(255,255,255,.05)",
      border: "1px solid rgba(255,255,255,.09)"
    }
  }, /*#__PURE__*/React.createElement("div", {
    style: {
      fontFamily: SANS_T,
      fontWeight: 700,
      fontSize: 10.5,
      letterSpacing: ".16em",
      color: INK_LABEL
    }
  }, "BUY-IN + FEE"), /*#__PURE__*/React.createElement("div", {
    style: {
      fontFamily: MONO_T,
      fontSize: 15,
      color: "#fff",
      marginTop: 5,
      whiteSpace: "nowrap"
    }
  }, kzt(t.buyInNum - t.feeNum), " ", /*#__PURE__*/React.createElement("span", {
    style: {
      color: "#8A8A93"
    }
  }, "+ ", kzt(t.feeNum)))), /*#__PURE__*/React.createElement("div", {
    style: {
      flex: "none",
      padding: "11px 13px",
      borderRadius: 12,
      background: "rgba(255,255,255,.05)",
      border: "1px solid rgba(255,255,255,.09)"
    }
  }, /*#__PURE__*/React.createElement("div", {
    style: {
      fontFamily: SANS_T,
      fontWeight: 700,
      fontSize: 10.5,
      letterSpacing: ".16em",
      color: INK_LABEL
    }
  }, "YOUR STACK"), /*#__PURE__*/React.createElement("div", {
    style: {
      fontFamily: MONO_T,
      fontSize: 15,
      color: "#fff",
      marginTop: 5,
      whiteSpace: "nowrap"
    }
  }, t.startStack, " ", /*#__PURE__*/React.createElement("span", {
    style: {
      color: "#8A8A93",
      fontSize: 12
    }
  }, t.startBB)))), /*#__PURE__*/React.createElement("div", {
    style: {
      fontFamily: SANS_T,
      fontWeight: 700,
      fontSize: 10.5,
      letterSpacing: ".2em",
      color: INK_LABEL,
      margin: "18px 2px 9px"
    }
  }, "PAY WITH"), /*#__PURE__*/React.createElement("div", {
    style: {
      display: "flex",
      flexDirection: "column",
      gap: 7
    }
  }, METHODS.map(e => {
    const on = pick === e.id;
    return /*#__PURE__*/React.createElement("button", {
      key: e.id,
      disabled: !e.ok,
      onClick: () => {
        if (window.playClick) window.playClick(1100, 0.04);
        setPick(e.id);
      },
      style: {
        display: "flex",
        alignItems: "center",
        gap: 11,
        width: "100%",
        textAlign: "left",
        padding: "12px 13px",
        borderRadius: 12,
        cursor: e.ok ? "pointer" : "default",
        opacity: e.ok ? 1 : 0.4,
        background: on ? `${accent}1f` : "rgba(255,255,255,.04)",
        border: `1px solid ${on ? accent : "rgba(255,255,255,.09)"}`,
        transition: "background 140ms, border-color 140ms"
      }
    }, /*#__PURE__*/React.createElement("span", {
      style: {
        flex: "none",
        boxSizing: "border-box",
        width: 20,
        height: 20,
        borderRadius: "50%",
        border: `2px solid ${on ? accent : "rgba(255,255,255,.28)"}`,
        background: on ? accent : "transparent",
        display: "flex",
        alignItems: "center",
        justifyContent: "center"
      }
    }, on && /*#__PURE__*/React.createElement("svg", {
      width: "11",
      height: "11",
      viewBox: "0 0 24 24",
      fill: "none",
      stroke: "#fff",
      strokeWidth: "3.6",
      strokeLinecap: "round",
      strokeLinejoin: "round"
    }, /*#__PURE__*/React.createElement("path", {
      d: "M5 12l5 5L20 6"
    }))), /*#__PURE__*/React.createElement("span", {
      style: {
        flex: 1,
        minWidth: 0
      }
    }, /*#__PURE__*/React.createElement("span", {
      style: {
        display: "block",
        fontFamily: MONO_T,
        fontSize: 13,
        color: "#fff",
        letterSpacing: ".05em"
      }
    }, e.name), /*#__PURE__*/React.createElement("span", {
      style: {
        display: "block",
        fontFamily: SANS_T,
        fontWeight: 600,
        fontSize: 10.5,
        letterSpacing: ".12em",
        color: "#8A8A93",
        marginTop: 3
      }
    }, e.sub)), /*#__PURE__*/React.createElement("span", {
      style: {
        flex: "none",
        fontFamily: MONO_T,
        fontSize: 13,
        color: e.ok ? "#fff" : "rgba(255,255,255,.5)",
        fontVariantNumeric: "tabular-nums"
      }
    }, e.have));
  })), /*#__PURE__*/React.createElement("button", {
    onClick: () => {
      if (window.playClick) window.playClick(1300, 0.05);
      if (payable) {
        onDone(m);
        return;
      }
      onClose();
      if (onDeposit) onDeposit();
    },
    style: {
      width: "100%",
      marginTop: 16,
      padding: "16px 0",
      borderRadius: 125,
      background: accent,
      color: "#fff",
      border: 0,
      cursor: "pointer",
      boxShadow: `0 14px 30px ${accent}66`,
      fontFamily: MONO_T,
      fontSize: 15,
      letterSpacing: ".1em"
    }
  }, !payable ? "TOP UP " + kzt(t.buyInNum - BALANCE_KZT) : free ? "REGISTER WITH TICKET" : "REGISTER · " + kzt(t.buyInNum)), /*#__PURE__*/React.createElement("button", {
    onClick: onClose,
    style: {
      width: "100%",
      marginTop: 9,
      padding: "13px 0",
      borderRadius: 125,
      cursor: "pointer",
      background: "transparent",
      border: "1px solid rgba(255,255,255,.18)",
      fontFamily: MONO_T,
      fontSize: 13,
      letterSpacing: ".1em",
      color: "#A9A9B2"
    }
  }, "CANCEL")));
}

// ── unregister sheet — slide to give up the seat ─────────────────────────
function UnregSheet({
  open,
  onClose,
  onDone,
  accent,
  t
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
  return /*#__PURE__*/React.createElement("div", {
    style: {
      position: "absolute",
      inset: 0,
      zIndex: 120,
      display: "flex",
      flexDirection: "column",
      justifyContent: "flex-end"
    }
  }, /*#__PURE__*/React.createElement("div", {
    onClick: onClose,
    style: {
      position: "absolute",
      inset: 0,
      background: "rgba(0,0,0,.72)",
      opacity: mounted ? 1 : 0,
      transition: "opacity 200ms"
    }
  }), /*#__PURE__*/React.createElement("div", {
    style: {
      position: "relative",
      padding: "18px 16px 26px",
      borderRadius: "22px 22px 0 0",
      background: "#141416",
      boxShadow: "0 -3px 4px rgba(64,64,64,.31)",
      transform: mounted ? "translateY(0)" : "translateY(100%)",
      transition: "transform 300ms cubic-bezier(.2,.8,.2,1)"
    }
  }, /*#__PURE__*/React.createElement("div", {
    style: {
      width: 40,
      height: 4,
      borderRadius: 2,
      background: "rgba(255,255,255,.2)",
      margin: "0 auto 16px"
    }
  }), /*#__PURE__*/React.createElement("div", {
    style: {
      fontFamily: MONO_T,
      fontSize: 16,
      color: "#fff",
      letterSpacing: ".06em"
    }
  }, "CANCEL REGISTRATION?"), /*#__PURE__*/React.createElement("div", {
    style: {
      fontFamily: SANS_T,
      fontWeight: 600,
      fontSize: 11,
      lineHeight: 1.6,
      color: "#D8D8DF",
      letterSpacing: ".04em",
      marginTop: 7,
      textWrap: "pretty"
    }
  }, "Your seat in ", t.name, " is released and ", t.buyIn, " goes back to your balance. You can register again while late registration is open."), /*#__PURE__*/React.createElement("div", {
    style: {
      marginTop: 18
    }
  }, /*#__PURE__*/React.createElement(SlideConfirm, {
    label: "SLIDE TO UNREGISTER",
    accent: accent,
    onDone: onDone
  })), /*#__PURE__*/React.createElement("button", {
    onClick: onClose,
    style: {
      width: "100%",
      marginTop: 10,
      padding: "13px 0",
      borderRadius: 125,
      cursor: "pointer",
      background: "transparent",
      border: "1px solid rgba(255,255,255,.18)",
      fontFamily: MONO_T,
      fontSize: 13,
      letterSpacing: ".1em",
      color: "#A9A9B2"
    }
  }, "KEEP MY SEAT")));
}

// ── PLAYERS tab — registered list ──
function PlayersTab({
  accent,
  count = 0,
  registered
}) {
  const NAMES = ["ShadowAce", "KyivGrinder", "RiverKing", "Mira_Bluff", "NightOwl77", "DniproShark", "TiltProof", "LadyLuck_UA", "CoolerMan", "OdesaWolf", "BigStackBo", "FoldEquity", "SplitPotPro", "CarpathianKid", "ZeroEV", "MsAllIn", "BountyHntr", "ChipLeader21", "LvivLion", "QuietRaise", "TurboSova", "DeltaQQ", "PocketRokets", "IceRegular", "SunriseCall"];
  const PAL = [accent, "#6FA8FF", "#5BD96A", "#f0c75e", "#7FD4F0", "#F5559F"];
  const Row = ({
    nick,
    you,
    i
  }) => /*#__PURE__*/React.createElement("div", {
    style: {
      display: "flex",
      alignItems: "center",
      gap: 11,
      padding: "9px 12px",
      borderRadius: 12,
      background: you ? `${accent}12` : "rgba(255,255,255,.04)",
      border: you ? `1px solid ${accent}66` : "1px solid rgba(255,255,255,.08)"
    }
  }, /*#__PURE__*/React.createElement("span", {
    style: {
      width: 28,
      height: 28,
      borderRadius: "50%",
      flex: "none",
      background: `${PAL[i % PAL.length]}2b`,
      border: `1px solid ${PAL[i % PAL.length]}66`,
      display: "flex",
      alignItems: "center",
      justifyContent: "center",
      fontFamily: MONO_T,
      fontWeight: 700,
      fontSize: 12,
      color: PAL[i % PAL.length]
    }
  }, nick[0].toUpperCase()), /*#__PURE__*/React.createElement("span", {
    style: {
      flex: 1,
      minWidth: 0,
      fontFamily: MONO_T,
      fontWeight: 700,
      fontSize: 12,
      color: "#fff",
      whiteSpace: "nowrap",
      overflow: "hidden",
      textOverflow: "ellipsis"
    }
  }, nick, you ? /*#__PURE__*/React.createElement("span", {
    style: {
      marginLeft: 7,
      fontFamily: SANS_T,
      fontWeight: 700,
      fontSize: 10.5,
      letterSpacing: ".12em",
      color: "#fff",
      padding: "2px 6px",
      borderRadius: 4,
      background: accent
    }
  }, "YOU") : null), /*#__PURE__*/React.createElement("span", {
    style: {
      flex: "none",
      display: "inline-flex",
      alignItems: "center",
      gap: 5,
      fontFamily: SANS_T,
      fontWeight: 700,
      fontSize: 10.5,
      letterSpacing: ".12em",
      color: "#A9A9B2"
    }
  }, /*#__PURE__*/React.createElement("span", {
    style: {
      width: 5,
      height: 5,
      borderRadius: "50%",
      background: "#5BD96A"
    }
  }), "REG"));
  return /*#__PURE__*/React.createElement("div", {
    style: {
      padding: "16px 16px 170px"
    }
  }, /*#__PURE__*/React.createElement("div", {
    style: {
      display: "flex",
      alignItems: "baseline",
      gap: 8
    }
  }, /*#__PURE__*/React.createElement("span", {
    style: {
      fontFamily: MONO_T,
      fontSize: 22,
      color: "#fff",
      fontVariantNumeric: "tabular-nums"
    }
  }, count.toLocaleString("en-US").split(",").join(" ")), /*#__PURE__*/React.createElement("span", {
    style: {
      fontFamily: SANS_T,
      fontWeight: 700,
      fontSize: 10.5,
      letterSpacing: ".18em",
      color: "#A9A9B2"
    }
  }, "PLAYERS REGISTERED")), /*#__PURE__*/React.createElement("div", {
    style: {
      display: "flex",
      flexDirection: "column",
      gap: 7,
      marginTop: 13
    }
  }, registered ? /*#__PURE__*/React.createElement(Row, {
    nick: "SASHA02",
    you: true,
    i: 0
  }) : null, NAMES.map((n, i) => /*#__PURE__*/React.createElement(Row, {
    key: n,
    nick: n,
    i: i + 1
  }))), /*#__PURE__*/React.createElement("div", {
    style: {
      marginTop: 12,
      textAlign: "center",
      fontFamily: SANS_T,
      fontWeight: 700,
      fontSize: 10.5,
      letterSpacing: ".1em",
      color: "#A9A9B2"
    }
  }, "+ ", Math.max(0, count - NAMES.length).toLocaleString("en-US").split(",").join(" "), " MORE \xB7 FULL LIST AT START"));
}

// ── SATELLITES tab — qualification ladder; this event is the highlighted
//    terminal node of the hierarchy (steps → satellite → tournament). ──
function SatLadderTab({
  accent,
  t,
  ev
}) {
  // F1 (правки продукту 07.09): тут була заглушка з трьох вигаданих сходинок
  // (MICRO/MID QUALIFIER, MEGA SATELLITE) — вона показувалась будь-якому
  // турніру без власних сателітів, звідси й скарга «степи і сати без
  // прив'язки до типу турніру». Заглушку прибрано: показуємо тільки реальну
  // драбину, а коли її немає — чесний порожній стан (C4).
  const hhmm = ms => {
    const d = new Date(ms);
    const p = n => String(n).padStart(2, "0");
    return p(d.getHours()) + ":" + p(d.getMinutes());
  };
  const self = ev || {
    name: t.name,
    feeds: t.feeds,
    cats: []
  };
  const real = (window.ladderFor ? window.ladderFor(self) : []).filter(e => String(e.name).toUpperCase() !== String(t.name).toUpperCase()) // не показуємо саму подію
  .map(e => {
    const seats = window.satSeats ? window.satSeats(e) : null;
    return {
      id: e.id,
      ev: e,
      type: (window.evTier ? window.evTier(e) : e.step ? "step1" : "satellite").replace("step1", "STEP 1").replace("step2", "STEP 2").replace("satellite", "SATELLITE").toUpperCase(),
      c: window.evTier && window.evTier(e).indexOf("step") === 0 || e.step ? "#7FD4F0" : "#6FA8FF",
      name: String(e.name).toUpperCase(),
      buyIn: e.buyIn,
      wins: seats ? seats.n + (seats.n === 1 ? " SEAT" : " SEATS") : "A SEAT",
      // слово WINS уже є в шаблоні нижче
      when: hhmm(e.start)
    };
  });
  const rows = real;
  const Ticket = ({
    c,
    s = 16
  }) => /*#__PURE__*/React.createElement("svg", {
    width: s,
    height: s,
    viewBox: "0 0 24 24",
    fill: c
  }, /*#__PURE__*/React.createElement("path", {
    fillRule: "evenodd",
    clipRule: "evenodd",
    d: "M4.6 6.6h14.8a1.6 1.6 0 0 1 1.6 1.6v1.9a2 2 0 0 0 0 3.8v1.9a1.6 1.6 0 0 1-1.6 1.6H4.6a1.6 1.6 0 0 1-1.6-1.6v-1.9a2 2 0 0 0 0-3.8V8.2a1.6 1.6 0 0 1 1.6-1.6zm10.65 2.05a.55.55 0 0 0-.55.55v1.15a.55.55 0 0 0 1.1 0V9.2a.55.55 0 0 0-.55-.55zm0 3.25a.55.55 0 0 0-.55.55v1.15a.55.55 0 0 0 1.1 0v-1.15a.55.55 0 0 0-.55-.55zm0 3.25a.55.55 0 0 0-.55.55v1.15a.55.55 0 0 0 1.1 0V15.7a.55.55 0 0 0-.55-.55z"
  }));
  const Arrow = ({
    c
  }) => /*#__PURE__*/React.createElement("div", {
    style: {
      position: "relative",
      zIndex: 1,
      width: 42,
      display: "flex",
      justifyContent: "center",
      margin: "2px 0"
    }
  }, /*#__PURE__*/React.createElement("svg", {
    width: "11",
    height: "11",
    viewBox: "0 0 24 24",
    fill: "none",
    stroke: c,
    strokeWidth: "2.6",
    strokeLinecap: "round",
    strokeLinejoin: "round"
  }, /*#__PURE__*/React.createElement("path", {
    d: "M12 20V6M6 12l6-6 6 6"
  })));
  // Тап по сходинці драбини відкриває СПИСОК УСІХ САТЕЛІТІВ цього турніру,
  // а не одну подію: звідти вже можна зайти в конкретний сателіт.
  // Механізм для цього (window.openEventsSearch) був у events.jsx, але його
  // ніхто не викликав — лишався мертвим кодом. Тут його і під'єднано.
  const openRung = r => {
    if (window.playClick) window.playClick(1150, 0.04);
    // Тап веде на СТОРІНКУ ЦЬОГО сателіта. Пошук із фільтрами тут не
    // потрібен: усі сателіти турніру вже перелічені вище на цій вкладці.
    if (r.ev && window.openEventDetail) {
      window.openEventDetail(r.ev);
      return;
    }
    const mins = r.when === "EVERY 30 MIN" ? 12 : r.when === "EVERY HOUR" ? 26 : 74;
    if (window.openEventDetail) window.openEventDetail({
      id: "rung-" + r.id,
      name: r.name,
      buyIn: r.buyIn,
      gtd: r.wins,
      cats: ["satellite"],
      step: r.type.indexOf("STEP") === 0,
      feeds: t.name,
      fmt: ["TURBO"],
      late: 30,
      suit: "spade",
      game: "nlh",
      start: Date.now() + mins * 60000,
      reg: Date.now() - 3600000
    });
  };
  // C4: порожній стан вкладки — коли для цієї події драбини немає.
  // Раніше вкладка казала «SATELLITES · 0», але показувала вигадані рядки.
  if (!rows.length) {
    const tier = window.evTier ? window.evTier(self) : "tournament";
    let ru = false;
    if (window.PXI18N && window.PXI18N.lang) ru = window.PXI18N.lang === "ru";else {
      try {
        ru = localStorage.getItem("pokerix_lang") === "ru";
      } catch (e) {}
    }
    const TITLE = {
      satellite: ["NO STEPS YET", "СТУПЕНЕЙ ПОКА НЕТ"],
      step2: ["NO STEP 1 QUALIFIERS YET", "ОТБОРОВ STEP 1 ПОКА НЕТ"],
      step1: ["NO QUALIFIERS YET", "ОТБОРОВ ПОКА НЕТ"],
      tournament: ["NO SATELLITES YET", "САТЕЛЛИТОВ ПОКА НЕТ"]
    };
    const ttl = (TITLE[tier] || TITLE.tournament)[ru ? 1 : 0];
    const body = ru ? "Сейчас в это событие нет отборов. Квалификации обычно открываются ближе к старту — загляните позже или входите напрямую." : "Nothing feeds this event right now. Qualifiers usually open closer to the start — check back later or enter directly.";
    const cta = ru ? "ВСЕ САТЕЛЛИТЫ" : "BROWSE ALL SATELLITES";
    return /*#__PURE__*/React.createElement("div", {
      "data-i18n": "off",
      style: {
        padding: "16px 16px 170px"
      }
    }, /*#__PURE__*/React.createElement("div", {
      style: {
        marginTop: 18,
        padding: "26px 20px",
        borderRadius: 16,
        textAlign: "center",
        background: "rgba(255,255,255,.04)",
        border: "1px solid rgba(255,255,255,.09)"
      }
    }, /*#__PURE__*/React.createElement("span", {
      style: {
        display: "inline-flex",
        width: 44,
        height: 44,
        borderRadius: 14,
        alignItems: "center",
        justifyContent: "center",
        background: "rgba(255,255,255,.05)",
        border: "1px solid rgba(255,255,255,.12)"
      }
    }, /*#__PURE__*/React.createElement("svg", {
      width: "25",
      height: "25",
      viewBox: "0 0 24 24",
      fill: "#9A9AA3"
    }, /*#__PURE__*/React.createElement("path", {
      fillRule: "evenodd",
      clipRule: "evenodd",
      d: "M4.6 6.6h14.8a1.6 1.6 0 0 1 1.6 1.6v1.9a2 2 0 0 0 0 3.8v1.9a1.6 1.6 0 0 1-1.6 1.6H4.6a1.6 1.6 0 0 1-1.6-1.6v-1.9a2 2 0 0 0 0-3.8V8.2a1.6 1.6 0 0 1 1.6-1.6zm10.65 2.05a.55.55 0 0 0-.55.55v1.15a.55.55 0 0 0 1.1 0V9.2a.55.55 0 0 0-.55-.55zm0 3.25a.55.55 0 0 0-.55.55v1.15a.55.55 0 0 0 1.1 0v-1.15a.55.55 0 0 0-.55-.55zm0 3.25a.55.55 0 0 0-.55.55v1.15a.55.55 0 0 0 1.1 0V15.7a.55.55 0 0 0-.55-.55z"
    }))), /*#__PURE__*/React.createElement("div", {
      style: {
        marginTop: 13,
        fontFamily: MONO_T,
        fontWeight: 700,
        fontSize: 13,
        letterSpacing: ".12em",
        color: "#fff"
      }
    }, ttl), /*#__PURE__*/React.createElement("div", {
      style: {
        marginTop: 8,
        fontFamily: SANS_T,
        fontWeight: 500,
        fontSize: 12,
        lineHeight: 1.55,
        color: "#A9A9B2",
        textWrap: "pretty"
      }
    }, body), /*#__PURE__*/React.createElement("button", {
      onClick: () => {
        if (window.playClick) window.playClick(1100, .04);
        if (window.openEventsSearch) window.openEventsSearch("", {
          type: "SATELLITE"
        });
      },
      style: Object.assign(UI.btn("s", "ghost", accent), {
        display: "inline-flex",
        marginTop: 16
      })
    }, cta)));
  }
  return /*#__PURE__*/React.createElement("div", {
    style: {
      padding: "16px 16px 170px"
    }
  }, /*#__PURE__*/React.createElement("div", {
    style: {
      fontFamily: SANS_T,
      fontWeight: 700,
      fontSize: 10.5,
      color: "#A9A9B2",
      letterSpacing: ".18em"
    }
  }, "QUALIFICATION PATH \xB7 FROM ", rows[0] ? rows[0].buyIn : "$2 500"), /*#__PURE__*/React.createElement("div", {
    style: {
      position: "relative",
      marginTop: 14
    }
  }, /*#__PURE__*/React.createElement("div", {
    style: {
      position: "absolute",
      left: 20,
      top: 12,
      bottom: 44,
      width: 2,
      background: "linear-gradient(180deg, " + accent + "88, #6FA8FF66, #7FD4F04d)"
    }
  }), /*#__PURE__*/React.createElement("div", {
    style: {
      position: "relative",
      display: "flex",
      gap: 11,
      alignItems: "center"
    }
  }, /*#__PURE__*/React.createElement("span", {
    style: {
      position: "relative",
      zIndex: 1,
      width: 42,
      height: 42,
      borderRadius: 12,
      flex: "none",
      background: `${accent}1f`,
      border: `1px solid ${accent}`,
      display: "flex",
      alignItems: "center",
      justifyContent: "center",
      boxShadow: `0 0 18px ${accent}44`
    }
  }, /*#__PURE__*/React.createElement("img", {
    src: "assets/tourn-icons/trophy.png",
    alt: "",
    style: {
      width: 27,
      height: 27,
      objectFit: "contain",
      display: "block"
    }
  })), /*#__PURE__*/React.createElement("div", {
    style: {
      flex: 1,
      minWidth: 0,
      padding: "11px 13px",
      borderRadius: 12,
      background: `${accent}12`,
      border: `1px solid ${accent}88`,
      boxShadow: `0 0 26px ${accent}1f`
    }
  }, /*#__PURE__*/React.createElement("div", {
    style: {
      display: "flex",
      alignItems: "center",
      gap: 7
    }
  }, /*#__PURE__*/React.createElement("span", {
    style: {
      fontFamily: SANS_T,
      fontWeight: 700,
      fontSize: 10.5,
      letterSpacing: ".12em",
      color: "#fff",
      padding: "2px 8px",
      borderRadius: 4,
      background: accent,
      flex: "none"
    }
  }, "THIS TOURNAMENT"), /*#__PURE__*/React.createElement("span", {
    style: {
      marginLeft: "auto",
      fontFamily: SANS_T,
      fontWeight: 700,
      fontSize: 10.5,
      letterSpacing: ".1em",
      color: "#A9A9B2"
    }
  }, t.timeLabel)), /*#__PURE__*/React.createElement("div", {
    style: {
      fontFamily: MONO_T,
      fontWeight: 700,
      fontSize: 14,
      color: "#fff",
      marginTop: 6
    }
  }, t.name), /*#__PURE__*/React.createElement("div", {
    style: {
      display: "flex",
      alignItems: "baseline",
      gap: 8,
      marginTop: 4
    }
  }, /*#__PURE__*/React.createElement("span", {
    style: {
      fontFamily: MONO_T,
      fontWeight: 700,
      fontSize: 15,
      color: accent
    }
  }, t.gtd), /*#__PURE__*/React.createElement("span", {
    style: {
      fontFamily: SANS_T,
      fontWeight: 700,
      fontSize: 10.5,
      letterSpacing: ".14em",
      color: "#A9A9B2"
    }
  }, "GTD"), /*#__PURE__*/React.createElement("span", {
    style: {
      marginLeft: "auto",
      fontFamily: MONO_T,
      fontSize: 11,
      color: "#D8D8DF"
    }
  }, t.buyIn, " DIRECT")))), /*#__PURE__*/React.createElement(Arrow, {
    c: accent
  }), rows.slice().reverse().map(r => /*#__PURE__*/React.createElement(React.Fragment, {
    key: r.id
  }, /*#__PURE__*/React.createElement("div", {
    onClick: () => openRung(r),
    style: {
      position: "relative",
      display: "flex",
      gap: 11,
      alignItems: "center",
      cursor: "pointer"
    }
  }, /*#__PURE__*/React.createElement("span", {
    style: {
      position: "relative",
      zIndex: 1,
      width: 42,
      height: 42,
      borderRadius: 12,
      flex: "none",
      background: "#0e0e11",
      border: `1px solid ${r.c}55`,
      display: "flex",
      alignItems: "center",
      justifyContent: "center"
    }
  }, /*#__PURE__*/React.createElement("img", {
    src: r.type.indexOf("STEP") === 0 ? "assets/tourn-icons/step.png" : "assets/tourn-icons/ticket.png",
    alt: "",
    style: {
      width: 27,
      height: 27,
      objectFit: "contain",
      display: "block"
    }
  })), /*#__PURE__*/React.createElement("div", {
    style: {
      position: "relative",
      flex: 1,
      minWidth: 0,
      padding: "9px 12px",
      borderRadius: 12,
      background: "rgba(255,255,255,.05)",
      border: "1px solid rgba(255,255,255,.11)"
    }
  }, /*#__PURE__*/React.createElement("div", {
    style: {
      display: "flex",
      alignItems: "center",
      gap: 7
    }
  }, /*#__PURE__*/React.createElement("span", {
    style: {
      fontFamily: SANS_T,
      fontWeight: 700,
      fontSize: 10.5,
      letterSpacing: ".1em",
      color: r.c,
      padding: "2px 7px",
      borderRadius: 4,
      background: `${r.c}1a`,
      border: `1px solid ${r.c}44`,
      flex: "none"
    }
  }, r.type), /*#__PURE__*/React.createElement("span", {
    style: {
      marginLeft: "auto",
      fontFamily: SANS_T,
      fontWeight: 700,
      fontSize: 10.5,
      letterSpacing: ".1em",
      color: "#A9A9B2",
      whiteSpace: "nowrap"
    }
  }, r.when)), /*#__PURE__*/React.createElement("div", {
    style: {
      display: "flex",
      alignItems: "baseline",
      gap: 8,
      marginTop: 5
    }
  }, /*#__PURE__*/React.createElement("span", {
    style: {
      fontFamily: MONO_T,
      fontWeight: 700,
      fontSize: 12,
      color: "#fff",
      whiteSpace: "nowrap",
      overflow: "hidden",
      textOverflow: "ellipsis"
    }
  }, r.name), /*#__PURE__*/React.createElement("span", {
    style: {
      marginLeft: "auto",
      fontFamily: MONO_T,
      fontSize: 11,
      color: "#D8D8DF",
      flex: "none"
    }
  }, r.buyIn)), /*#__PURE__*/React.createElement("div", {
    style: {
      marginTop: 3,
      fontFamily: SANS_T,
      fontWeight: 700,
      fontSize: 10.5,
      letterSpacing: ".08em",
      color: r.c
    }
  }, "WINS ", r.wins))), r.id === "s1" ? null : /*#__PURE__*/React.createElement(Arrow, {
    c: r.c
  })))), /*#__PURE__*/React.createElement("p", {
    style: {
      margin: "14px 2px 0",
      fontFamily: SANS_T,
      fontWeight: 600,
      fontSize: 11,
      lineHeight: 1.55,
      color: "#D8D8DF",
      textWrap: "pretty"
    }
  }, "Win any stage to climb one level \u2014 prizes are awarded as tickets to the stage above. Tap a stage to open its lobby."));
}

// ── cover banner — graphic, on-brand (no stock photo) ───────────────────
function TournamentCover({
  t,
  accent,
  suitColor,
  isRed,
  cd,
  overlay = 0,
  live
}) {
  const [, forceTick] = React.useState(0);
  React.useEffect(() => {
    if (!live) return;
    const iv = setInterval(() => forceTick(x => x + 1), 1000);
    return () => clearInterval(iv);
  }, [live]);
  const elapsed = live && window.MTT_LIVE && window.MTT_LIVE.elapsedStr ? window.MTT_LIVE.elapsedStr() : null;
  return /*#__PURE__*/React.createElement("div", {
    style: {
      position: "relative",
      height: 270,
      overflow: "hidden",
      background: "#0a0a0c"
    }
  }, /*#__PURE__*/React.createElement("div", {
    style: {
      position: "absolute",
      inset: 0,
      background: `radial-gradient(circle at 72% 24%, ${accent}55 0%, transparent 52%), radial-gradient(circle at 12% 92%, ${accent}2e 0%, transparent 46%)`
    }
  }), /*#__PURE__*/React.createElement("div", {
    style: {
      position: "absolute",
      inset: 0,
      backgroundImage: "radial-gradient(circle, rgba(255,255,255,.13) 0.7px, transparent 1px)",
      backgroundSize: "13px 13px",
      maskImage: "radial-gradient(ellipse 90% 80% at 60% 30%, black 30%, transparent 85%)",
      WebkitMaskImage: "radial-gradient(ellipse 90% 80% at 60% 30%, black 30%, transparent 85%)"
    }
  }), /*#__PURE__*/React.createElement(Suit, {
    kind: "heart",
    size: 190,
    color: accent + "22",
    style: {
      position: "absolute",
      right: -40,
      top: -30,
      transform: "rotate(-14deg)",
      animation: "pp-bobble 7s ease-in-out infinite"
    }
  }), /*#__PURE__*/React.createElement(Suit, {
    kind: "spade",
    size: 92,
    color: "rgba(255,255,255,.07)",
    style: {
      position: "absolute",
      left: 18,
      top: 84,
      transform: "rotate(12deg)",
      animation: "pp-bobble-2 8s ease-in-out infinite"
    }
  }), /*#__PURE__*/React.createElement(Suit, {
    kind: "diamond",
    size: 56,
    color: accent + "33",
    style: {
      position: "absolute",
      right: 120,
      bottom: 92,
      animation: "pp-bobble-3 6.5s ease-in-out infinite"
    }
  }), /*#__PURE__*/React.createElement("div", {
    style: {
      position: "absolute",
      inset: 0,
      background: "linear-gradient(180deg, transparent 35%, rgba(0,0,0,.65) 78%, #000 100%)"
    }
  }), /*#__PURE__*/React.createElement("div", {
    style: {
      position: "absolute",
      left: 16,
      right: 16,
      bottom: 16
    }
  }, /*#__PURE__*/React.createElement("div", {
    style: {
      display: "flex",
      alignItems: "center",
      justifyContent: "space-between",
      gap: 10,
      marginBottom: 10
    }
  }, /*#__PURE__*/React.createElement(Chip, {
    color: suitColor,
    bg: isRed ? "rgba(215,25,33,.16)" : "rgba(255,255,255,.1)",
    style: {
      minWidth: 0,
      height: 26,
      boxSizing: "border-box",
      padding: "0 9px",
      borderRadius: 8,
      whiteSpace: "nowrap",
      overflow: "hidden",
      textOverflow: "ellipsis"
    }
  }, t.series), /*#__PURE__*/React.createElement("span", {
    style: {
      flex: "none",
      display: "inline-flex",
      alignItems: "center",
      gap: 7,
      height: 26,
      boxSizing: "border-box",
      padding: "0 10px",
      borderRadius: 8,
      background: "rgba(0,0,0,.5)",
      border: "1px solid rgba(255,255,255,.18)",
      backdropFilter: "blur(8px)",
      WebkitBackdropFilter: "blur(8px)"
    }
  }, /*#__PURE__*/React.createElement("span", {
    style: {
      width: 6,
      height: 6,
      borderRadius: "50%",
      background: accent,
      boxShadow: `0 0 7px ${accent}`,
      animation: "pp-pulse 1.4s ease-in-out infinite",
      flex: "none"
    }
  }), /*#__PURE__*/React.createElement("span", {
    style: {
      fontFamily: MONO_T,
      fontWeight: 700,
      fontSize: 13,
      color: "#fff",
      letterSpacing: ".06em",
      fontVariantNumeric: "tabular-nums",
      lineHeight: 1
    }
  }, live && elapsed ? "LIVE " + elapsed : cd.hhmmss))), /*#__PURE__*/React.createElement("div", {
    style: {
      fontFamily: MONO_T,
      fontSize: 38,
      lineHeight: .96,
      color: "#fff",
      letterSpacing: ".01em"
    }
  }, t.name), /*#__PURE__*/React.createElement("div", {
    style: {
      display: "flex",
      alignItems: "center",
      gap: 10,
      marginTop: 12
    }
  }, /*#__PURE__*/React.createElement("span", {
    style: {
      fontFamily: MONO_T,
      fontSize: t.gtd.length > 12 ? 18 : 22,
      color: suitColor,
      letterSpacing: ".02em"
    }
  }, t.gtd), /*#__PURE__*/React.createElement("span", {
    style: {
      fontFamily: SANS_T,
      fontWeight: 600,
      fontSize: 11,
      color: "#A9A9B2",
      letterSpacing: ".16em"
    }
  }, "GUARANTEED")), overlay > 0 && /*#__PURE__*/React.createElement("span", {
    style: {
      display: "inline-flex",
      alignItems: "center",
      gap: 5,
      marginTop: 10,
      padding: "4px 9px",
      borderRadius: 6,
      background: "rgba(232,195,107,.16)",
      border: "1px solid rgba(232,195,107,.42)",
      fontFamily: SANS_T,
      fontWeight: 700,
      fontSize: 10.5,
      color: OVERLAY_GOLD,
      letterSpacing: ".12em"
    }
  }, /*#__PURE__*/React.createElement("svg", {
    width: "9",
    height: "9",
    viewBox: "0 0 10 10",
    fill: OVERLAY_GOLD
  }, /*#__PURE__*/React.createElement("path", {
    d: "M5 0l5 9H0z"
  })), "OVERLAY $", overlay.toLocaleString("en-US").split(",").join(" "))));
}
function InfoCell({
  label,
  value,
  accentVal,
  sub
}) {
  const len = String(value).length;
  const fs = len <= 6 ? 16 : len <= 9 ? 13 : 11;
  return /*#__PURE__*/React.createElement("div", {
    style: {
      background: "#0c0c0e",
      padding: "13px 13px",
      minWidth: 0,
      overflow: "hidden"
    }
  }, /*#__PURE__*/React.createElement("div", {
    style: {
      fontFamily: SANS_T,
      fontWeight: 700,
      fontSize: 10.5,
      color: INK_LABEL,
      letterSpacing: ".08em",
      lineHeight: 1.25,
      overflowWrap: "anywhere",
      minHeight: 26
    }
  }, window.Term && window.PX_TERMS && window.PX_TERMS[label] ? /*#__PURE__*/React.createElement(window.Term, {
    k: label
  }, label) : label), /*#__PURE__*/React.createElement("div", {
    style: {
      fontFamily: MONO_T,
      fontSize: fs,
      marginTop: 6,
      color: accentVal || "#fff",
      letterSpacing: ".02em",
      whiteSpace: "nowrap",
      overflow: "hidden",
      textOverflow: "ellipsis"
    }
  }, value), sub && /*#__PURE__*/React.createElement("div", {
    style: {
      fontFamily: SANS_T,
      fontWeight: 600,
      fontSize: 10.5,
      color: "#8A8A93",
      letterSpacing: ".1em",
      marginTop: 3
    }
  }, sub));
}
Object.assign(window, {
  NextTournamentWidget,
  TournamentDetail,
  NevVariantContext,
  SlideConfirm
});

// ═════════════════════════════════════════════════════════════════════════
// Share-to-stories — auto-generate a 9:16 (1080×1920) social card on canvas.
// Stories are vertical, so this renders portrait; data is pulled live.
// ═════════════════════════════════════════════════════════════════════════
function hexA(hex, a) {
  const h = hex.replace("#", "");
  const n = h.length === 3 ? h.split("").map(c => c + c).join("") : h;
  const r = parseInt(n.slice(0, 2), 16);
  const g = parseInt(n.slice(2, 4), 16);
  const b = parseInt(n.slice(4, 6), 16);
  return `rgba(${r},${g},${b},${a})`;
}
function drawStoryCard(canvas, t, accent, cd) {
  const W = 1080,
    H = 1920;
  canvas.width = W;
  canvas.height = H;
  const x = canvas.getContext("2d");
  const MONO = UI.font;
  const SANS = UI.fontUI;
  const M = 96;
  const MAXW = W - M * 2;

  // set a font that shrinks until `text` fits within maxW
  const fit = (text, weight, maxPx, maxW, family, sp) => {
    let px = maxPx;
    while (px > 10) {
      x.font = `${weight} ${px}px ${family}`;
      try {
        x.letterSpacing = (sp || 0) + "px";
      } catch (e) {}
      if (x.measureText(text).width <= maxW) break;
      px -= 2;
    }
    return px;
  };
  const clearSp = () => {
    try {
      x.letterSpacing = "0px";
    } catch (e) {}
  };

  // base
  x.fillStyle = "#08080a";
  x.fillRect(0, 0, W, H);

  // accent glows
  let g = x.createRadialGradient(W * 0.74, H * 0.26, 0, W * 0.74, H * 0.26, W * 1.0);
  g.addColorStop(0, hexA(accent, 0.5));
  g.addColorStop(0.45, hexA(accent, 0.10));
  g.addColorStop(1, "rgba(0,0,0,0)");
  x.fillStyle = g;
  x.fillRect(0, 0, W, H);
  let g2 = x.createRadialGradient(W * 0.1, H * 0.92, 0, W * 0.1, H * 0.92, W * 0.75);
  g2.addColorStop(0, hexA(accent, 0.18));
  g2.addColorStop(1, "rgba(0,0,0,0)");
  x.fillStyle = g2;
  x.fillRect(0, 0, W, H);

  // dot grid
  x.fillStyle = "rgba(255,255,255,0.05)";
  for (let yy = 0; yy < H; yy += 40) for (let xx = 0; xx < W; xx += 40) {
    x.beginPath();
    x.arc(xx, yy, 1.4, 0, 7);
    x.fill();
  }

  // big decorative suit pip
  x.save();
  x.translate(W * 0.84, H * 0.205);
  x.rotate(-0.16);
  x.font = "620px Arial, sans-serif";
  x.textAlign = "center";
  x.textBaseline = "middle";
  x.fillStyle = hexA(accent, 0.16);
  x.fillText("♥", 0, 0);
  x.restore();
  x.textAlign = "left";
  x.textBaseline = "alphabetic";

  // kicker
  fit(t.series, 700, 30, MAXW, MONO, 12);
  x.fillStyle = "rgba(255,255,255,0.6)";
  x.fillText(t.series, M, 200);
  clearSp();

  // accent rule
  x.fillStyle = accent;
  x.fillRect(M, 232, 120, 6);

  // tournament name (two lines, each fit independently)
  x.fillStyle = "#fff";
  const parts = t.name.split(" ");
  const l1 = parts[0] || t.name;
  const l2 = parts.slice(1).join(" ");
  fit(l1, 700, 178, MAXW, MONO, 0);
  x.fillText(l1, M - 6, 730);
  if (l2) {
    fit(l2, 700, 178, MAXW, MONO, 0);
    x.fillText(l2, M - 6, 900);
  }

  // guarantee
  x.fillStyle = accent;
  fit(t.gtd, 700, 132, MAXW, MONO, 0);
  x.fillText(t.gtd, M - 4, 1120);
  x.fillStyle = "rgba(255,255,255,0.55)";
  fit("GUARANTEED", 700, 34, MAXW, SANS, 8);
  x.fillText("GUARANTEED", M, 1180);
  clearSp();

  // divider
  x.fillStyle = "rgba(255,255,255,0.12)";
  x.fillRect(M, 1270, MAXW, 2);

  // meta lines — each auto-fit
  const metaA = `${t.dateLabel.replace("TODAY · ", "")} · ${t.timeLabel}`;
  const metaB = `BUY-IN ${t.buyIn}  ·  ${t.startStack} STACK`;
  const metaC = `8-MAX  ·  ${t.levelTime} BLINDS  ·  ${t.reEntry} RE-ENTRY`;
  x.fillStyle = "rgba(255,255,255,0.85)";
  fit(metaA, 400, 42, MAXW, MONO, 0);
  x.fillText(metaA, M, 1362);
  x.fillStyle = "rgba(255,255,255,0.6)";
  fit(metaB, 400, 36, MAXW, MONO, 0);
  x.fillText(metaB, M, 1432);
  fit(metaC, 400, 36, MAXW, MONO, 0);
  x.fillText(metaC, M, 1498);

  // CTA pill
  const py = 1610,
    ph = 152,
    pr = 76;
  x.fillStyle = accent;
  if (x.roundRect) {
    x.beginPath();
    x.roundRect(M, py, MAXW, ph, pr);
    x.fill();
  } else {
    x.fillRect(M, py, MAXW, ph);
  }
  x.fillStyle = "#fff";
  x.textAlign = "center";
  x.textBaseline = "middle";
  fit("REGISTER NOW", 700, 50, MAXW - 120, MONO, 6);
  x.fillText("REGISTER NOW", W / 2, py + ph / 2 + 2);
  clearSp();

  // handle / wordmark
  x.fillStyle = "rgba(255,255,255,0.5)";
  x.textAlign = "center";
  x.textBaseline = "alphabetic";
  fit("POKERDOT", 700, 38, MAXW, MONO, 14);
  x.fillText("POKERDOT", W / 2, 1860);
  clearSp();
}
function ShareStoryModal({
  open,
  onClose,
  accent = "#D71921"
}) {
  const t = NEXT_TOURNAMENT;
  const canvasRef = React.useRef(null);
  const [ready, setReady] = React.useState(false);
  const [toast, setToast] = React.useState(null);
  const toastRef = React.useRef(0);
  React.useEffect(() => {
    if (!open) return;
    let cancelled = false;
    setReady(false);
    setToast(null);
    const run = async () => {
      try {
        await document.fonts.ready;
      } catch (e) {}
      if (cancelled || !canvasRef.current) return;
      drawStoryCard(canvasRef.current, t, accent);
      setReady(true);
    };
    const id = requestAnimationFrame(run);
    return () => {
      cancelled = true;
      cancelAnimationFrame(id);
    };
  }, [open, accent]);
  const flash = msg => {
    setToast(msg);
    clearTimeout(toastRef.current);
    toastRef.current = setTimeout(() => setToast(null), 2400);
  };
  const SHARE_LINK = "https://play.pokerdot.com/e/daily-deep"; /* E7: бренд */
  const SHARE_TEXT = `${t.name} · ${t.gtd} GTD — starts ${t.dateLabel.replace("TODAY · ", "")} ${t.timeLabel}. Register on POKERDOT`;
  const enc = encodeURIComponent;
  const downloadImage = () => {
    const c = canvasRef.current;
    if (!c) return;
    try {
      const a = document.createElement("a");
      a.download = "pokerdot-daily-deep-story.png";
      a.href = c.toDataURL("image/png");
      a.click();
    } catch (e) {}
  };
  const openExt = url => {
    try {
      window.open(url, "_blank", "noopener");
    } catch (e) {}
  };
  const nativeShare = () => {
    const c = canvasRef.current;
    if (!c) {
      return;
    }
    try {
      c.toBlob(async blob => {
        const file = blob ? new File([blob], "pokerdot-story.png", {
          type: "image/png"
        }) : null;
        const data = {
          title: t.name,
          text: SHARE_TEXT,
          url: SHARE_LINK
        };
        if (file && navigator.canShare && navigator.canShare({
          files: [file]
        })) {
          try {
            await navigator.share({
              ...data,
              files: [file]
            });
          } catch (e) {}
        } else if (navigator.share) {
          try {
            await navigator.share(data);
          } catch (e) {}
        } else {
          downloadImage();
          flash("Картинку збережено");
        }
      }, "image/png");
    } catch (e) {
      downloadImage();
      flash("Картинку збережено");
    }
  };
  const handleTarget = id => {
    if (window.playClick) window.playClick(1150, 0.04);
    switch (id) {
      case "instagram":
        downloadImage();
        flash("Картинку збережено → відкрий Instagram Stories");
        break;
      case "telegram":
        openExt(`https://t.me/share/url?url=${enc(SHARE_LINK)}&text=${enc(SHARE_TEXT)}`);
        downloadImage();
        flash("Відкрито Telegram · картинку збережено");
        break;
      case "whatsapp":
        openExt(`https://wa.me/?text=${enc(SHARE_TEXT + " " + SHARE_LINK)}`);
        downloadImage();
        flash("Відкрито WhatsApp · картинку збережено");
        break;
      case "x":
        openExt(`https://twitter.com/intent/tweet?text=${enc(SHARE_TEXT)}&url=${enc(SHARE_LINK)}`);
        downloadImage();
        flash("Відкрито X · картинку збережено");
        break;
      case "copy":
        try {
          navigator.clipboard && navigator.clipboard.writeText(SHARE_LINK);
        } catch (e) {}
        flash("Посилання скопійовано");
        break;
      case "save":
        downloadImage();
        flash("Картинку збережено");
        break;
      case "more":
        nativeShare();
        break;
    }
  };
  if (!open) return null;
  return /*#__PURE__*/React.createElement("div", {
    onClick: onClose,
    style: {
      position: "absolute",
      inset: 0,
      zIndex: 80,
      background: "rgba(0,0,0,.72)",
      backdropFilter: "blur(10px)",
      WebkitBackdropFilter: "blur(10px)",
      display: "flex",
      flexDirection: "column",
      alignItems: "center",
      justifyContent: "center",
      padding: "20px 18px",
      boxSizing: "border-box",
      animation: "pp-fadeIn .2s ease"
    }
  }, /*#__PURE__*/React.createElement("div", {
    onClick: e => e.stopPropagation(),
    style: {
      width: "100%",
      maxWidth: 320,
      display: "flex",
      flexDirection: "column",
      alignItems: "center"
    }
  }, /*#__PURE__*/React.createElement("div", {
    style: {
      display: "flex",
      alignItems: "center",
      justifyContent: "space-between",
      width: "100%",
      marginBottom: 14
    }
  }, /*#__PURE__*/React.createElement("span", {
    style: {
      fontFamily: MONO_T,
      fontSize: 13,
      color: "#fff",
      letterSpacing: ".22em"
    }
  }, "SHARE TO STORIES"), /*#__PURE__*/React.createElement("button", {
    onClick: onClose,
    style: {
      width: 32,
      height: 32,
      borderRadius: 12,
      background: "rgba(255,255,255,.13)",
      border: "1px solid rgba(255,255,255,.16)",
      display: "flex",
      alignItems: "center",
      justifyContent: "center",
      cursor: "pointer",
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
      width: 230,
      height: 409,
      borderRadius: 20,
      overflow: "hidden",
      border: "1px solid rgba(255,255,255,.18)",
      boxShadow: "0 26px 60px rgba(0,0,0,.6)",
      background: "#08080a",
      position: "relative"
    }
  }, /*#__PURE__*/React.createElement("canvas", {
    ref: canvasRef,
    style: {
      width: "100%",
      height: "100%",
      display: "block",
      opacity: ready ? 1 : 0,
      transition: "opacity .25s"
    }
  }), !ready && /*#__PURE__*/React.createElement("div", {
    style: {
      position: "absolute",
      inset: 0,
      display: "flex",
      alignItems: "center",
      justifyContent: "center",
      fontFamily: MONO_T,
      fontSize: 11,
      color: "#A9A9B2",
      letterSpacing: ".2em"
    }
  }, "RENDERING\u2026")), /*#__PURE__*/React.createElement("div", {
    style: {
      fontFamily: SANS_T,
      fontWeight: 600,
      fontSize: 10.5,
      color: "#8A8A93",
      letterSpacing: ".14em",
      marginTop: 12
    }
  }, "1080 \xD7 1920 \xB7 9:16 STORY"), /*#__PURE__*/React.createElement("div", {
    style: {
      width: "100%",
      marginTop: 16,
      display: "flex",
      gap: 14,
      overflowX: "auto",
      padding: "2px 2px 6px",
      scrollbarWidth: "none",
      WebkitOverflowScrolling: "touch"
    }
  }, SHARE_TARGETS.map(target => /*#__PURE__*/React.createElement("button", {
    key: target.id,
    onClick: () => handleTarget(target.id),
    onMouseDown: e => {
      e.currentTarget.style.transform = "scale(.92)";
    },
    onMouseUp: e => {
      e.currentTarget.style.transform = "";
    },
    onMouseLeave: e => {
      e.currentTarget.style.transform = "";
    },
    style: {
      flex: "none",
      background: "transparent",
      border: 0,
      padding: 0,
      cursor: "pointer",
      display: "flex",
      flexDirection: "column",
      alignItems: "center",
      gap: 7,
      width: 58,
      transition: "transform 110ms ease"
    }
  }, /*#__PURE__*/React.createElement("span", {
    style: {
      width: 54,
      height: 54,
      borderRadius: "50%",
      background: target.bg,
      border: target.border ? "1px solid rgba(255,255,255,.22)" : "0",
      display: "flex",
      alignItems: "center",
      justifyContent: "center",
      boxShadow: "0 8px 18px rgba(0,0,0,.4)"
    }
  }, /*#__PURE__*/React.createElement(TargetGlyph, {
    id: target.id
  })), /*#__PURE__*/React.createElement("span", {
    style: {
      fontFamily: SANS_T,
      fontWeight: 700,
      fontSize: 10.5,
      color: "#D8D8DF",
      letterSpacing: ".1em",
      whiteSpace: "nowrap"
    }
  }, target.label)))), /*#__PURE__*/React.createElement("div", {
    style: {
      height: 30,
      marginTop: 4,
      display: "flex",
      alignItems: "center",
      justifyContent: "center",
      opacity: toast ? 1 : 0,
      transition: "opacity .2s"
    }
  }, toast && /*#__PURE__*/React.createElement("span", {
    style: {
      display: "inline-flex",
      alignItems: "center",
      gap: 7,
      padding: "6px 12px",
      borderRadius: 8,
      background: "rgba(91,217,106,.14)",
      border: "1px solid rgba(91,217,106,.34)",
      fontFamily: SANS_T,
      fontWeight: 600,
      fontSize: 10.5,
      color: "#5BD96A",
      letterSpacing: ".04em",
      textAlign: "center"
    }
  }, /*#__PURE__*/React.createElement("svg", {
    width: "11",
    height: "11",
    viewBox: "0 0 24 24",
    fill: "none",
    stroke: "#5BD96A",
    strokeWidth: "3",
    strokeLinecap: "round",
    strokeLinejoin: "round"
  }, /*#__PURE__*/React.createElement("path", {
    d: "M5 12l5 5L20 6"
  })), toast))));
}

// share targets — brand-colored quick destinations (image + link)
const SHARE_TARGETS = [{
  id: "instagram",
  label: "STORIES",
  bg: "linear-gradient(135deg,#feda75,#fa7e1e,#d62976,#962fbf,#4f5bd5)"
}, {
  id: "telegram",
  label: "TELEGRAM",
  bg: "#229ED9"
}, {
  id: "whatsapp",
  label: "WHATSAPP",
  bg: "#25D366"
}, {
  id: "x",
  label: "X",
  bg: "#000",
  border: true
}, {
  id: "copy",
  label: "COPY LINK",
  bg: "rgba(255,255,255,.16)"
}, {
  id: "save",
  label: "SAVE",
  bg: "#D71921"
}, {
  id: "more",
  label: "MORE",
  bg: "rgba(255,255,255,.16)"
}];
function TargetGlyph({
  id
}) {
  const W = {
    width: 23,
    height: 23,
    viewBox: "0 0 24 24"
  };
  switch (id) {
    case "instagram":
      return /*#__PURE__*/React.createElement("svg", _extends({}, W, {
        fill: "none",
        stroke: "#fff",
        strokeWidth: "2"
      }), /*#__PURE__*/React.createElement("rect", {
        x: "3",
        y: "3",
        width: "18",
        height: "18",
        rx: "5.2"
      }), /*#__PURE__*/React.createElement("circle", {
        cx: "12",
        cy: "12",
        r: "4.1"
      }), /*#__PURE__*/React.createElement("circle", {
        cx: "17.2",
        cy: "6.8",
        r: "1.2",
        fill: "#fff",
        stroke: "none"
      }));
    case "telegram":
      return /*#__PURE__*/React.createElement("svg", _extends({}, W, {
        fill: "none",
        stroke: "#fff",
        strokeWidth: "2",
        strokeLinejoin: "round",
        strokeLinecap: "round"
      }), /*#__PURE__*/React.createElement("path", {
        d: "M22 3 11 14"
      }), /*#__PURE__*/React.createElement("path", {
        d: "M22 3 15 21l-4-7-7-4 18-7z"
      }));
    case "whatsapp":
      return /*#__PURE__*/React.createElement("svg", _extends({}, W, {
        fill: "#fff"
      }), /*#__PURE__*/React.createElement("path", {
        d: "M6.6 10.8c1.4 2.8 3.8 5.2 6.6 6.6l2.2-2.2c.3-.3.7-.4 1.1-.2 1.1.4 2.3.6 3.5.6.6 0 1 .5 1 1V20c0 .6-.4 1-1 1C10.5 21 3 13.5 3 4c0-.6.5-1 1-1h3.5c.6 0 1 .4 1 1 0 1.2.2 2.4.6 3.5.1.4 0 .8-.3 1.1l-2.2 2.2z"
      }));
    case "x":
      return /*#__PURE__*/React.createElement("svg", _extends({}, W, {
        fill: "#fff"
      }), /*#__PURE__*/React.createElement("path", {
        d: "M18.9 2.5H22l-7.1 8.1L23 21.5h-6.4l-5-6.6-5.8 6.6H2.7l7.6-8.7L2.3 2.5h6.6l4.5 6 5.5-6z"
      }));
    case "copy":
      return /*#__PURE__*/React.createElement("svg", _extends({}, W, {
        fill: "none",
        stroke: "#fff",
        strokeWidth: "2",
        strokeLinecap: "round",
        strokeLinejoin: "round"
      }), /*#__PURE__*/React.createElement("rect", {
        x: "9",
        y: "9",
        width: "11",
        height: "11",
        rx: "2.5"
      }), /*#__PURE__*/React.createElement("path", {
        d: "M5 15V5a2 2 0 0 1 2-2h8"
      }));
    case "save":
      return /*#__PURE__*/React.createElement("svg", _extends({}, W, {
        fill: "none",
        stroke: "#fff",
        strokeWidth: "2",
        strokeLinecap: "round",
        strokeLinejoin: "round"
      }), /*#__PURE__*/React.createElement("path", {
        d: "M12 3v12M7 10l5 5 5-5M5 21h14"
      }));
    case "more":
      return /*#__PURE__*/React.createElement("svg", _extends({}, W, {
        fill: "none",
        stroke: "#fff",
        strokeWidth: "2",
        strokeLinecap: "round",
        strokeLinejoin: "round"
      }), /*#__PURE__*/React.createElement("path", {
        d: "M4 12v7a1 1 0 0 0 1 1h14a1 1 0 0 0 1-1v-7"
      }), /*#__PURE__*/React.createElement("path", {
        d: "M16 6l-4-4-4 4"
      }), /*#__PURE__*/React.createElement("path", {
        d: "M12 2v13"
      }));
    default:
      return null;
  }
}

// Completed mode of the tournament lobby, opened from historical results.
function CompletedTournamentLobby({
  event: e,
  onClose
}) {
  const [tab, setTab] = React.useState('overview');
  return /*#__PURE__*/React.createElement("section", {
    className: "me-overlay me-screen ms-completed-tournament",
    role: "dialog",
    "aria-modal": "true",
    "aria-label": 'Завершённый турнир: ' + e.name,
    "data-i18n": "off",
    style: {
      zIndex: 90,
      background: '#07080a',
      display: 'flex',
      flexDirection: 'column'
    }
  }, /*#__PURE__*/React.createElement("header", {
    className: "pd-screen-header"
  }, /*#__PURE__*/React.createElement("button", {
    "aria-label": "\u041D\u0430\u0437\u0430\u0434 \u043A \u0440\u0435\u0437\u0443\u043B\u044C\u0442\u0430\u0442\u0430\u043C \u0442\u0443\u0440\u043D\u0438\u0440\u043E\u0432",
    onClick: onClose
  }, /*#__PURE__*/React.createElement("svg", {
    width: "16",
    height: "16",
    viewBox: "0 0 24 24",
    fill: "none",
    stroke: "currentColor",
    strokeWidth: "2.4"
  }, /*#__PURE__*/React.createElement("path", {
    d: "m15 6-6 6 6 6"
  }))), /*#__PURE__*/React.createElement("h2", null, "\u041B\u041E\u0411\u0411\u0418 \u0422\u0423\u0420\u041D\u0418\u0420\u0410"), /*#__PURE__*/React.createElement("span", null)), /*#__PURE__*/React.createElement("div", {
    className: "me-scroll",
    style: {
      padding: '24px 20px 40px'
    }
  }, /*#__PURE__*/React.createElement("span", {
    className: "ms-completed-status"
  }, "\u0417\u0410\u0412\u0415\u0420\u0428\u0401\u041D \xB7 ", e.date), /*#__PURE__*/React.createElement("h1", null, e.name), /*#__PURE__*/React.createElement(window.SSegment, {
    options: [{
      id: 'overview',
      label: 'О СОБЫТИИ'
    }, {
      id: 'result',
      label: 'МОЙ РЕЗУЛЬТАТ'
    }],
    value: tab,
    onChange: setTab,
    accent: UI.accent
  }), tab === 'overview' ? /*#__PURE__*/React.createElement(React.Fragment, null, /*#__PURE__*/React.createElement("div", {
    className: "ms-completed-grid"
  }, /*#__PURE__*/React.createElement("div", null, /*#__PURE__*/React.createElement("small", null, "\u0414\u0410\u0422\u0410"), /*#__PURE__*/React.createElement("strong", null, e.date)), /*#__PURE__*/React.createElement("div", null, /*#__PURE__*/React.createElement("small", null, "\u0411\u0410\u0419-\u0418\u041D"), /*#__PURE__*/React.createElement("strong", null, e.buyIn)), /*#__PURE__*/React.createElement("div", null, /*#__PURE__*/React.createElement("small", null, "\u0418\u0413\u0420\u041E\u041A\u041E\u0412"), /*#__PURE__*/React.createElement("strong", null, e.entries.toLocaleString('ru'))), /*#__PURE__*/React.createElement("div", null, /*#__PURE__*/React.createElement("small", null, "\u0421\u0422\u0410\u0422\u0423\u0421"), /*#__PURE__*/React.createElement("strong", null, "\u0417\u0430\u0432\u0435\u0440\u0448\u0451\u043D"))), /*#__PURE__*/React.createElement("p", null, "\u0422\u0443\u0440\u043D\u0438\u0440 \u0437\u0430\u0432\u0435\u0440\u0448\u0451\u043D. \u0418\u0442\u043E\u0433\u0438 \u0432\u0430\u0448\u0435\u0433\u043E \u0443\u0447\u0430\u0441\u0442\u0438\u044F \u0434\u043E\u0441\u0442\u0443\u043F\u043D\u044B \u0432\u043E \u0432\u043A\u043B\u0430\u0434\u043A\u0435 \xAB\u041C\u043E\u0439 \u0440\u0435\u0437\u0443\u043B\u044C\u0442\u0430\u0442\xBB.")) : /*#__PURE__*/React.createElement("div", {
    className: "ms-completed-grid"
  }, /*#__PURE__*/React.createElement("div", null, /*#__PURE__*/React.createElement("small", null, "\u0412\u0410\u0428\u0415 \u041C\u0415\u0421\u0422\u041E"), /*#__PURE__*/React.createElement("strong", null, "#", e.place)), /*#__PURE__*/React.createElement("div", null, /*#__PURE__*/React.createElement("small", null, "\u0412\u0410\u0428 \u041F\u0420\u0418\u0417"), /*#__PURE__*/React.createElement("strong", {
    className: "ms-completed-prize"
  }, e.prize)), /*#__PURE__*/React.createElement("div", null, /*#__PURE__*/React.createElement("small", null, "\u0420\u0410\u0417\u041C\u0415\u0420 \u041F\u041E\u041B\u042F"), /*#__PURE__*/React.createElement("strong", null, e.entries.toLocaleString('ru'))), /*#__PURE__*/React.createElement("div", null, /*#__PURE__*/React.createElement("small", null, "\u0411\u0410\u0419-\u0418\u041D"), /*#__PURE__*/React.createElement("strong", null, e.buyIn)))));
}