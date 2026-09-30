// tile-structure-variants.jsx — 5 structural arrangements of the SAME tile elements.
// Shared discipline: two-line CTA block (action + cost), fixed right rail width so
// prize/buy-in/CTA sit on one vertical axis, footer never clips the bounty.
// window.EventRowS({ e, accent, s: 1..5 })

const TSV_MONO_S = UI.font;
const TSV_SANS_S = UI.fontUI;
const RAIL_W = 106;
function tsData(e, accent) {
  const {
    EV_TYPES,
    evType,
    evState,
    satSeats,
    buyNum,
    tournArtKey,
    dayMeta,
    evOff,
    clock,
    prizeLabel
  } = window;
  const T = EV_TYPES[evType(e)];
  const c = e.color || T.c;
  const secs = Math.max(0, Math.floor((e.start - Date.now()) / 1000));
  const live = evState(secs) === "live";
  const hasReg = e.reg > 0;
  const relLate = window.useRel(e.start + (e.late || 60) * 60000);
  const relReg = window.useRel(e.start - 86400000);
  const cta = e.closed ? {
    t: "OBSERVE",
    c: null
  } : live ? {
    t: "LATE REG",
    c: accent
  } : hasReg ? {
    t: "REGISTER",
    c: "#177d36"
  } : {
    t: "REMIND",
    c: null
  };
  // registered + already running → PLAY; cancelling is no longer possible
  const started = live || !!e.closed;
  // a running event says RUNNING with a live dot; while late reg is open it
  // also prints how long is left to join
  // Поки турнір іде, відлік стосується ПІЗНЬОЇ РЕЄСТРАЦІЇ, а не кінця
  // турніру. Раніше писало "RUNNING · LEFT 32:37" — читалось так, ніби
  // за 32 хвилини турнір завершиться. Тепер прямо: пізня реєстрація,
  // і скільки її лишилось. Червоний пульсуючий кружечок і так каже, що
  // турнір іде.
  // Кружечок: червоний = турнір іде, зелений = реєстрація відкрита.
  const note = e.closed ? {
    t: /*#__PURE__*/React.createElement("span", null, "RUNNING"),
    c: "#f0c75e",
    dot: 1,
    dotC: "#D71921"
  } : live ? {
    t: /*#__PURE__*/React.createElement(React.Fragment, null, /*#__PURE__*/React.createElement("span", null, "LATE REG"), " \u00B7 ", /*#__PURE__*/React.createElement("span", null, "LEFT"), " " + relLate.txt),
    c: "#f0c75e",
    dot: 1,
    dotC: "#D71921"
  } : hasReg ? {
    t: "REG OPEN",
    c: "#5BD96A",
    dot: 1,
    dotC: "#5BD96A"
  } : {
    t: `OPENS ${relReg.txt}`,
    c: "rgba(255,255,255,.5)"
  };
  const dm = dayMeta(evOff(e.start));
  const sched = `${dm.top} · ${clock(e.start)}`;
  const seats = satSeats(e);
  const DISC_LABEL = {
    holdem: "HOLD'EM",
    plo5: "PLO 5",
    plo6: "PLO 6",
    short: "SHORT DECK",
    flash: "FLASH & FLUSH",
    nlh: "HOLD'EM",
    plo: "PLO"
  };
  const discWord = DISC_LABEL[e.disc] || DISC_LABEL[e.game] || "HOLD'EM";
  const dropDup = ["KO", "PKO", "MYSTERY", "BOUNTY"];
  const fmtTags = (e.fmt || []).filter(f => f !== "FREEZEOUT" && !dropDup.includes(f) && !/^\d+-?MAX$/i.test(f) && !/^(PLO|HOLD|SHORT|FLASH|NLH|TURBO|HYPER)/i.test(f)).slice(0, 2);
  const artKind = tournArtKey(e);
  const bn = buyNum(e);
  const bounty = ["ko", "pko", "mystery"].includes(artKind) && bn > 0 ? "₸" + Math.round(bn * (e.bfrac || 0.5)).toLocaleString("en-US").split(",").join(" ") : null;
  return {
    T,
    c,
    live,
    hasReg,
    cta,
    note,
    sched,
    seats,
    discWord,
    fmtTags,
    bounty,
    started,
    label: prizeLabel(e)
  };
}
const tsChip = (color, bg, bd) => ({
  height: 16,
  display: "inline-flex",
  alignItems: "center",
  padding: "0 7px",
  borderRadius: 5,
  fontFamily: TSV_SANS_S,
  fontWeight: 700,
  fontSize: 10.5,
  letterSpacing: ".08em",
  color: color || "rgba(255,255,255,.62)",
  background: bg || "rgba(255,255,255,.085)",
  border: `1px solid ${bd || "rgba(255,255,255,.18)"}`,
  flex: "none",
  whiteSpace: "nowrap"
});
function TsTitle({
  name,
  fs = 13.5
}) {
  return /*#__PURE__*/React.createElement("div", {
    style: {
      fontFamily: TSV_MONO_S,
      fontWeight: 700,
      fontSize: fs,
      color: "#fff",
      lineHeight: 1.25,
      display: "-webkit-box",
      WebkitLineClamp: 2,
      WebkitBoxOrient: "vertical",
      overflow: "hidden",
      textWrap: "pretty"
    }
  }, name);
}
// prize value: guarantee OR n×ticket — one nowrap unit, auto-shrinking
function TsPrize({
  d,
  e,
  fs = 17,
  align = "left",
  stack = false,
  bare = false,
  white = false
}) {
  const vc = white ? "#fff" : d.c;
  const val = d.seats ? /*#__PURE__*/React.createElement(window.SeatBreak, {
    s: d.seats,
    color: vc,
    fs: fs - 2
  }) : /*#__PURE__*/React.createElement("span", {
    style: {
      fontFamily: TSV_MONO_S,
      fontWeight: 700,
      fontSize: String(e.gtd).length > 12 ? Math.max(10.5, fs - 4) : String(e.gtd).length > 9 ? fs - 2 : fs,
      color: vc,
      lineHeight: 1
    }
  }, e.gtd);
  if (bare) return val;
  const lbl = /*#__PURE__*/React.createElement("span", {
    style: {
      fontFamily: TSV_SANS_S,
      fontWeight: 700,
      fontSize: 10.5,
      letterSpacing: ".14em",
      color: "#A9A9B2"
    }
  }, d.label);
  if (stack) return /*#__PURE__*/React.createElement("span", {
    style: {
      display: "inline-flex",
      flexDirection: "column",
      alignItems: align === "right" ? "flex-end" : "flex-start",
      gap: 3,
      whiteSpace: "nowrap"
    }
  }, val, lbl);
  return /*#__PURE__*/React.createElement("span", {
    style: {
      display: "inline-flex",
      alignItems: "baseline",
      gap: 5,
      whiteSpace: "nowrap"
    }
  }, val, lbl);
}
function TsBuy({
  e,
  fs = 10.5
}) {
  return /*#__PURE__*/React.createElement("span", {
    style: {
      display: "inline-flex",
      alignItems: "baseline",
      gap: 4,
      whiteSpace: "nowrap"
    }
  }, /*#__PURE__*/React.createElement("span", {
    style: {
      fontFamily: TSV_SANS_S,
      fontWeight: 700,
      fontSize: 10.5,
      letterSpacing: ".12em",
      color: "#A9A9B2"
    }
  }, "BUY-IN"), /*#__PURE__*/React.createElement("span", {
    style: {
      fontFamily: TSV_MONO_S,
      fontWeight: 700,
      fontSize: fs,
      color: e.buyIn === "FREE" ? "#5BD96A" : "rgba(255,255,255,.85)"
    }
  }, e.buyIn));
}
function TsPlayers({
  e,
  d
}) {
  return /*#__PURE__*/React.createElement("span", {
    style: {
      display: "inline-flex",
      alignItems: "center",
      gap: 4,
      fontFamily: TSV_MONO_S,
      fontWeight: 700,
      fontSize: 10.5,
      color: "#D8D8DF",
      whiteSpace: "nowrap"
    }
  }, /*#__PURE__*/React.createElement("svg", {
    width: "11",
    height: "11",
    viewBox: "0 0 24 24",
    fill: "rgba(255,255,255,.8)"
  }, /*#__PURE__*/React.createElement("circle", {
    cx: "12",
    cy: "7.6",
    r: "4.1"
  }), /*#__PURE__*/React.createElement("path", {
    d: "M4.4 20a7.6 7.6 0 0 1 15.2 0z"
  })), d.hasReg ? d.live ? /*#__PURE__*/React.createElement("span", null, e.reg.toLocaleString("en-US").split(",").join(" "), /*#__PURE__*/React.createElement("span", {
    style: {
      color: "#8A8A93"
    }
  }, "/", e.cap.toLocaleString("en-US").split(",").join(" "))) : e.reg.toLocaleString("en-US").split(",").join(" ") : "—");
}
function TsSched({
  d
}) {
  return /*#__PURE__*/React.createElement("span", {
    style: {
      fontFamily: TSV_MONO_S,
      fontWeight: 700,
      fontSize: 10.5,
      letterSpacing: ".05em",
      color: "#fff",
      whiteSpace: "nowrap"
    }
  }, d.sched);
}
function TsNote({
  d,
  accent
}) {
  if (!d.note) return null;
  return /*#__PURE__*/React.createElement("span", {
    style: {
      display: "inline-flex",
      alignItems: "center",
      gap: 5,
      fontFamily: TSV_SANS_S,
      fontWeight: 700,
      fontSize: 10.5,
      letterSpacing: ".08em",
      color: d.note.c,
      whiteSpace: "nowrap",
      minWidth: 0,
      overflow: "hidden",
      textOverflow: "ellipsis"
    }
  }, d.note.dot ? /*#__PURE__*/React.createElement("span", {
    style: {
      width: 5,
      height: 5,
      borderRadius: "50%",
      background: d.note.dotC || accent,
      boxShadow: `0 0 6px ${d.note.dotC || accent}`,
      flex: "none",
      animation: "pp-pulse 1.4s ease-in-out infinite"
    }
  }) : null, d.note.t);
}
// two-line CTA: action label on top, cost below — fixed block, never overflows
// one button box for every state — sized so the longest label ("LATE REG",
// "ПОЗДНЯЯ РЕГ.") sets the type size for all of them (3)
const TS_BTN_W = 96,
  TS_BTN_H = 36,
  TS_BTN_FS = 9.5;
function TsCta({
  d,
  w = TS_BTN_W,
  cost
}) {
  const solid = d.cta.c;
  const price = cost || d.cta.cost;
  return /*#__PURE__*/React.createElement("span", {
    style: {
      flex: "none",
      width: w,
      minHeight: TS_BTN_H,
      padding: "4px 7px",
      borderRadius: 12,
      boxSizing: "border-box",
      display: "inline-flex",
      flexDirection: "column",
      alignItems: "center",
      justifyContent: "center",
      gap: 2,
      background: solid || "rgba(255,255,255,.08)",
      border: `1px solid ${solid ? "rgba(255,255,255,.14)" : "rgba(255,255,255,.16)"}`
    }
  }, /*#__PURE__*/React.createElement("span", {
    style: {
      fontFamily: TSV_SANS_S,
      fontWeight: 700,
      fontSize: TS_BTN_FS,
      letterSpacing: ".08em",
      lineHeight: 1.15,
      textAlign: "center",
      color: solid ? "#fff" : "rgba(255,255,255,.85)"
    }
  }, d.cta.t), price ? /*#__PURE__*/React.createElement("span", {
    style: {
      fontFamily: TSV_MONO_S,
      fontWeight: 700,
      fontSize: 10.5,
      color: "#fff",
      whiteSpace: "nowrap"
    }
  }, price) : null);
}
function TsArt({
  e
}) {
  if (!e.art) return null;
  return /*#__PURE__*/React.createElement("div", {
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
  }, /*#__PURE__*/React.createElement("img", {
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
  }));
}
function TsShell({
  d,
  e,
  children,
  onOpen
}) {
  const extra = e.glow ? {
    animation: "pp-glow-tile 1.9s ease-in-out infinite",
    borderColor: d.c + "66",
    "--gA": d.c + "2e",
    "--gB": d.c + "c4",
    "--gC": d.c + "8a"
  } : {};
  return /*#__PURE__*/React.createElement("button", {
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
      border: `1px solid ${d.live && !e.closed ? d.c + "66" : "rgba(255,255,255,.1)"}`,
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
      background: d.c,
      opacity: .9
    }
  }), /*#__PURE__*/React.createElement("div", {
    style: {
      position: "absolute",
      inset: 0,
      background: `radial-gradient(circle at 2% 0%, ${d.c}1f, transparent 42%)`,
      pointerEvents: "none"
    }
  }), /*#__PURE__*/React.createElement("div", {
    style: {
      flex: 1,
      minWidth: 0,
      display: "flex",
      flexDirection: "column",
      position: "relative"
    }
  }, children));
}
function TsIcon({
  e,
  c,
  s = 38
}) {
  return /*#__PURE__*/React.createElement("span", {
    style: {
      flex: "none",
      width: s,
      height: s,
      display: "flex",
      alignItems: "center",
      justifyContent: "center"
    }
  }, /*#__PURE__*/React.createElement(window.TypeArt, {
    e: e,
    size: s - 2,
    color: c
  }));
}
function TsChips({
  d,
  e,
  narrow
}) {
  const ser = !!e.series,
    hasB = !!d.bounty;
  const out = [];
  if (ser) out.push(/*#__PURE__*/React.createElement("img", {
    key: "ser",
    src: e.series,
    alt: "",
    style: {
      height: 16,
      width: "auto",
      borderRadius: 5,
      display: "block",
      flex: "none"
    }
  }));
  const type = /*#__PURE__*/React.createElement("span", {
    key: "type",
    style: tsChip(d.c, `${d.c}1c`, `${d.c}55`)
  }, d.T.label);
  const disc = /*#__PURE__*/React.createElement("span", {
    key: "disc",
    style: tsChip()
  }, d.discWord);
  const bChip = hasB ? /*#__PURE__*/React.createElement("span", {
    key: "b",
    style: tsChip()
  }, "BOUNTY") : null;
  if (narrow) {
    if (ser) out.push(type);else out.push(type, disc);
    if (bChip && !ser) out.push(bChip);
  } else {
    out.push(type, disc);
    if (bChip) out.push(bChip);
    const fmts = ser ? [] : d.fmtTags.slice(0, hasB ? 1 : 2);
    fmts.forEach(f => out.push(/*#__PURE__*/React.createElement("span", {
      key: f,
      style: tsChip()
    }, f)));
  }
  return /*#__PURE__*/React.createElement("div", {
    style: {
      display: "flex",
      alignItems: "center",
      gap: 5,
      minWidth: 0,
      flex: "1 1 auto"
    }
  }, out);
}
// footer: budgeted chips row, nothing else
function TsFooter({
  d,
  e
}) {
  return /*#__PURE__*/React.createElement("div", {
    style: {
      position: "relative",
      zIndex: 1,
      marginTop: "auto",
      display: "flex",
      alignItems: "center",
      gap: 8,
      padding: "3px 10px",
      borderTop: "1px solid rgba(255,255,255,.07)",
      background: "rgba(255,255,255,.02)"
    }
  }, /*#__PURE__*/React.createElement(TsChips, {
    d: d,
    e: e
  }));
}
function TsRegisteredTime({
  e
}) {
  window.useRel(e.start);
  const seconds = Math.max(0, Math.ceil((e.start - Date.now()) / 1000)),
    playing = e.start <= Date.now(),
    days = seconds >= 86400;
  const remaining = days ? `${Math.floor(seconds / 86400)}D ${Math.floor(seconds % 86400 / 3600)}H` : [Math.floor(seconds / 3600), Math.floor(seconds % 3600 / 60), seconds % 60].map(n => String(n).padStart(2, '0')).join(':');
  return /*#__PURE__*/React.createElement("span", {
    className: "mt-tournament-time",
    style: {
      display: 'grid',
      gridTemplateColumns: '88px auto',
      alignItems: 'baseline',
      columnGap: 8,
      lineHeight: '18px'
    }
  }, /*#__PURE__*/React.createElement("span", {
    style: {
      fontFamily: TSV_SANS_S,
      fontSize: 11,
      fontWeight: 600,
      letterSpacing: '.04em',
      color: '#A9A9B2',
      whiteSpace: 'nowrap'
    }
  }, playing ? window.dayMeta(window.evOff(e.start)).top : 'STARTS IN'), /*#__PURE__*/React.createElement("span", {
    "data-i18n": days && !playing ? undefined : 'off',
    style: {
      fontFamily: TSV_MONO_S,
      fontSize: 14,
      fontWeight: 700,
      color: '#fff',
      fontVariantNumeric: 'tabular-nums',
      whiteSpace: 'nowrap'
    }
  }, playing ? window.clock(e.start) : remaining));
}
function EventRowS({
  e,
  accent = "#D71921",
  s = 1,
  onOpen,
  registered = false,
  onToggleReg
}) {
  const d = tsData(e, accent);
  // registration is a mark, not a banner — the title needs the width (2)
  const regBadge = registered ? /*#__PURE__*/React.createElement("span", {
    title: "REGISTERED",
    style: {
      flex: "none",
      width: 16,
      height: 16,
      borderRadius: "50%",
      background: "rgba(91,217,106,.16)",
      border: "1px solid rgba(91,217,106,.6)",
      display: "inline-flex",
      alignItems: "center",
      justifyContent: "center"
    }
  }, /*#__PURE__*/React.createElement("svg", {
    width: "9",
    height: "9",
    viewBox: "0 0 24 24",
    fill: "none",
    stroke: "#5BD96A",
    strokeWidth: "3.6",
    strokeLinecap: "round",
    strokeLinejoin: "round"
  }, /*#__PURE__*/React.createElement("path", {
    d: "M5 12l5 5L20 6"
  }))) : null;
  const cancelBtn = /*#__PURE__*/React.createElement("span", {
    onClick: ev => {
      ev.stopPropagation();
      if (window.playClick) window.playClick(800, .04);
      onOpen && onOpen();
    },
    style: {
      position: "relative",
      zIndex: 2,
      flex: "none",
      width: TS_BTN_W,
      minHeight: TS_BTN_H,
      padding: "6px 8px",
      borderRadius: 12,
      boxSizing: "border-box",
      cursor: "pointer",
      display: "inline-flex",
      alignItems: "center",
      justifyContent: "center",
      textAlign: "center",
      background: "transparent",
      border: "1px solid rgba(255,255,255,.3)",
      fontFamily: TSV_SANS_S,
      fontWeight: 700,
      fontSize: TS_BTN_FS,
      letterSpacing: ".08em",
      lineHeight: 1.15,
      color: "#D8D8DF"
    }
  }, "CANCEL");
  const playBtn = /*#__PURE__*/React.createElement("span", {
    onClick: ev => {
      ev.stopPropagation();
      if (window.playClick) window.playClick(1350, .04);
      onOpen && onOpen();
    },
    style: {
      position: "relative",
      zIndex: 2,
      flex: "none",
      width: TS_BTN_W,
      minHeight: TS_BTN_H,
      padding: "6px 8px",
      borderRadius: 12,
      boxSizing: "border-box",
      cursor: "pointer",
      display: "inline-flex",
      alignItems: "center",
      justifyContent: "center",
      textAlign: "center",
      background: "#177d36",
      border: "1px solid #177d36",
      fontFamily: TSV_SANS_S,
      fontWeight: 700,
      fontSize: TS_BTN_FS,
      letterSpacing: ".08em",
      lineHeight: 1.15,
      color: "#fff"
    }
  }, "PLAY");

  // S1 — класична сітка: title зліва, права вісь RAIL_W (prize над CTA)
  if (s === 1) {
    return /*#__PURE__*/React.createElement(TsShell, {
      d: d,
      e: e,
      onOpen: onOpen
    }, /*#__PURE__*/React.createElement("div", {
      style: {
        position: "relative",
        display: "flex",
        gap: 10,
        padding: "10px 11px 10px 10px",
        alignItems: "flex-start",
        flex: 1
      }
    }, /*#__PURE__*/React.createElement(TsArt, {
      e: e
    }), /*#__PURE__*/React.createElement(TsIcon, {
      e: e,
      c: d.c
    }), /*#__PURE__*/React.createElement("div", {
      style: {
        position: "relative",
        zIndex: 1,
        flex: 1,
        minWidth: 0,
        display: "flex",
        flexDirection: "column",
        gap: 6
      }
    }, /*#__PURE__*/React.createElement(TsTitle, {
      name: e.name
    }), /*#__PURE__*/React.createElement("div", {
      style: {
        display: "flex",
        alignItems: "center",
        gap: 10
      }
    }, /*#__PURE__*/React.createElement(TsSched, {
      d: d
    }), /*#__PURE__*/React.createElement(TsPlayers, {
      e: e,
      d: d
    })), /*#__PURE__*/React.createElement("div", {
      style: {
        marginTop: "auto"
      }
    }, /*#__PURE__*/React.createElement(TsNote, {
      d: d,
      accent: accent
    }))), /*#__PURE__*/React.createElement("div", {
      style: {
        position: "relative",
        zIndex: 1,
        flex: "none",
        width: RAIL_W,
        display: "flex",
        flexDirection: "column",
        alignItems: "flex-end",
        gap: 6
      }
    }, /*#__PURE__*/React.createElement(TsPrize, {
      d: d,
      e: e,
      fs: 16,
      align: "right",
      stack: true
    }), /*#__PURE__*/React.createElement(TsBuy, {
      e: e
    }), /*#__PURE__*/React.createElement("span", {
      style: {
        marginTop: "auto"
      }
    }, /*#__PURE__*/React.createElement(TsCta, {
      d: d
    })))), /*#__PURE__*/React.createElement(TsFooter, {
      d: d,
      e: e
    }));
  }

  // S2 — назва на всю ширину; під нею value-блок зліва і CTA справа
  if (s === 2) {
    return /*#__PURE__*/React.createElement(TsShell, {
      d: d,
      e: e,
      onOpen: onOpen
    }, /*#__PURE__*/React.createElement("div", {
      style: {
        position: "relative",
        padding: "10px 11px 10px 10px",
        flex: 1,
        display: "flex",
        flexDirection: "column"
      }
    }, /*#__PURE__*/React.createElement(TsArt, {
      e: e
    }), /*#__PURE__*/React.createElement("div", {
      style: {
        position: "relative",
        zIndex: 1,
        display: "flex",
        gap: 10,
        alignItems: "flex-start"
      }
    }, /*#__PURE__*/React.createElement(TsIcon, {
      e: e,
      c: d.c,
      s: 36
    }), /*#__PURE__*/React.createElement("div", {
      style: {
        flex: 1,
        minWidth: 0
      }
    }, /*#__PURE__*/React.createElement(TsTitle, {
      name: e.name,
      fs: 14
    }), /*#__PURE__*/React.createElement("div", {
      style: {
        display: "flex",
        alignItems: "center",
        gap: 10,
        marginTop: 5
      }
    }, /*#__PURE__*/React.createElement(TsSched, {
      d: d
    }), /*#__PURE__*/React.createElement(TsPlayers, {
      e: e,
      d: d
    })))), /*#__PURE__*/React.createElement("div", {
      style: {
        position: "relative",
        zIndex: 1,
        display: "flex",
        alignItems: "flex-end",
        gap: 10,
        marginTop: 10
      }
    }, /*#__PURE__*/React.createElement("div", {
      style: {
        flex: 1,
        minWidth: 0,
        display: "flex",
        flexDirection: "column",
        gap: 5
      }
    }, /*#__PURE__*/React.createElement(TsPrize, {
      d: d,
      e: e,
      fs: 18
    }), /*#__PURE__*/React.createElement("div", {
      style: {
        display: "flex",
        alignItems: "center",
        gap: 10
      }
    }, /*#__PURE__*/React.createElement(TsBuy, {
      e: e
    }), /*#__PURE__*/React.createElement(TsNote, {
      d: d,
      accent: accent
    }))), /*#__PURE__*/React.createElement(TsCta, {
      d: d
    }))), /*#__PURE__*/React.createElement(TsFooter, {
      d: d,
      e: e
    }));
  }

  // S3 — права рейка на всю висоту: prize / buy-in / CTA; теги інлайном, без футера
  if (s === 3) {
    return /*#__PURE__*/React.createElement(TsShell, {
      d: d,
      e: e,
      onOpen: onOpen
    }, /*#__PURE__*/React.createElement("div", {
      style: {
        display: "flex",
        alignItems: "stretch",
        flex: 1
      }
    }, /*#__PURE__*/React.createElement("div", {
      style: {
        position: "relative",
        flex: 1,
        minWidth: 0,
        padding: "10px 11px 10px 10px",
        display: "flex",
        flexDirection: "column",
        gap: 6
      }
    }, /*#__PURE__*/React.createElement(TsArt, {
      e: e
    }), /*#__PURE__*/React.createElement("div", {
      style: {
        position: "relative",
        zIndex: 1,
        display: "flex",
        gap: 10,
        alignItems: "flex-start"
      }
    }, /*#__PURE__*/React.createElement(TsIcon, {
      e: e,
      c: d.c,
      s: 36
    }), /*#__PURE__*/React.createElement("div", {
      style: {
        flex: 1,
        minWidth: 0
      }
    }, /*#__PURE__*/React.createElement(TsTitle, {
      name: e.name
    }))), /*#__PURE__*/React.createElement("div", {
      style: {
        position: "relative",
        zIndex: 1,
        display: "flex",
        alignItems: "center",
        gap: 10,
        paddingLeft: 46
      }
    }, /*#__PURE__*/React.createElement(TsSched, {
      d: d
    }), /*#__PURE__*/React.createElement(TsPlayers, {
      e: e,
      d: d
    }), /*#__PURE__*/React.createElement(TsNote, {
      d: d,
      accent: accent
    })), /*#__PURE__*/React.createElement("div", {
      style: {
        position: "relative",
        zIndex: 1,
        display: "flex",
        alignItems: "center",
        gap: 8,
        marginTop: "auto"
      }
    }, /*#__PURE__*/React.createElement(TsChips, {
      d: d,
      e: e,
      narrow: true
    }))), /*#__PURE__*/React.createElement("div", {
      style: {
        flex: "none",
        width: RAIL_W + 22,
        borderLeft: "1px solid rgba(255,255,255,.09)",
        background: "rgba(255,255,255,.025)",
        display: "flex",
        flexDirection: "column",
        alignItems: "center",
        justifyContent: "center",
        gap: 6,
        padding: "10px 11px"
      }
    }, /*#__PURE__*/React.createElement(TsPrize, {
      d: d,
      e: e,
      fs: 15,
      align: "right",
      stack: true
    }), /*#__PURE__*/React.createElement(TsBuy, {
      e: e
    }), /*#__PURE__*/React.createElement(TsCta, {
      d: d
    }))));
  }

  // S4 — стат-сітка: title + CTA зверху, підписана 3-колонкова сітка знизу
  if (s === 4) {
    const cell = {
      flex: 1,
      minWidth: 0,
      padding: "7px 10px"
    };
    const lbl = {
      fontFamily: TSV_SANS_S,
      fontWeight: 700,
      fontSize: 10.5,
      letterSpacing: ".16em",
      color: "#A9A9B2",
      whiteSpace: "nowrap"
    };
    return /*#__PURE__*/React.createElement(TsShell, {
      d: d,
      e: e,
      onOpen: onOpen
    }, /*#__PURE__*/React.createElement("div", {
      style: {
        position: "relative",
        display: "flex",
        gap: 10,
        padding: "10px 11px 0 10px",
        alignItems: "flex-start"
      }
    }, /*#__PURE__*/React.createElement(TsArt, {
      e: e
    }), /*#__PURE__*/React.createElement(TsIcon, {
      e: e,
      c: d.c,
      s: 36
    }), /*#__PURE__*/React.createElement("div", {
      style: {
        position: "relative",
        zIndex: 1,
        flex: 1,
        minWidth: 0
      }
    }, /*#__PURE__*/React.createElement("div", {
      style: {
        minWidth: 0,
        overflow: "hidden"
      }
    }, /*#__PURE__*/React.createElement(TsTitle, {
      name: e.name
    })), /*#__PURE__*/React.createElement("div", {
      style: {
        display: "flex",
        alignItems: "center",
        gap: 9,
        marginTop: 5,
        minWidth: 0
      }
    }, regBadge, registered ? /*#__PURE__*/React.createElement(TsRegisteredTime, {
      e: e
    }) : /*#__PURE__*/React.createElement(React.Fragment, null, /*#__PURE__*/React.createElement(TsSched, {
      d: d
    }), /*#__PURE__*/React.createElement(TsNote, {
      d: d,
      accent: accent
    }))))), /*#__PURE__*/React.createElement("div", {
      style: {
        position: "relative",
        zIndex: 1,
        display: "flex",
        alignItems: "stretch",
        margin: "9px 10px 10px",
        borderRadius: 8,
        background: "rgba(255,255,255,.045)",
        border: "1px solid rgba(255,255,255,.08)"
      }
    }, /*#__PURE__*/React.createElement("div", {
      style: {
        ...cell,
        flex: 1.25,
        background: `linear-gradient(160deg, ${d.c}e8, ${d.c}b8)`,
        borderRadius: "8px 0 0 8px"
      }
    }, /*#__PURE__*/React.createElement("div", {
      style: {
        ...lbl,
        color: "#D8D8DF"
      }
    }, d.label), /*#__PURE__*/React.createElement("div", {
      style: {
        marginTop: 3
      }
    }, /*#__PURE__*/React.createElement(TsPrize, {
      d: d,
      e: e,
      fs: 13.5,
      bare: true,
      white: true
    }))), /*#__PURE__*/React.createElement("div", {
      style: {
        width: 1,
        background: "rgba(255,255,255,.08)"
      }
    }), /*#__PURE__*/React.createElement("div", {
      style: {
        ...cell,
        flex: .75,
        display: "flex",
        flexDirection: "column",
        justifyContent: "center",
        background: `${d.c}14`
      }
    }, /*#__PURE__*/React.createElement("div", {
      style: lbl
    }, "BUY-IN"), /*#__PURE__*/React.createElement("div", {
      style: {
        marginTop: 3,
        fontFamily: TSV_MONO_S,
        fontWeight: 700,
        fontSize: 10.5,
        color: e.buyIn === "FREE" ? "#5BD96A" : "rgba(255,255,255,.72)",
        whiteSpace: "nowrap"
      }
    }, e.buyIn)), /*#__PURE__*/React.createElement("div", {
      style: {
        width: 1,
        background: "rgba(255,255,255,.08)"
      }
    }), /*#__PURE__*/React.createElement("div", {
      style: {
        ...cell,
        flex: .6,
        display: "flex",
        flexDirection: "column",
        justifyContent: "center",
        background: `${d.c}14`,
        borderRadius: "0 8px 8px 0"
      }
    }, /*#__PURE__*/React.createElement("div", {
      style: lbl
    }, "PLAYERS"), /*#__PURE__*/React.createElement("div", {
      style: {
        marginTop: 3
      }
    }, /*#__PURE__*/React.createElement(TsPlayers, {
      e: e,
      d: d
    })))), /*#__PURE__*/React.createElement(TsFooter, {
      d: d,
      e: e
    }));
  }

  // S6 — за скетчем: 4 окремі рядки, кожен зі своїм вирівнюванням.
  // 1) гарантія (праворуч, велика) · 2) іконка + назва · 3) розклад/статус (ліворуч)
  // 4) двоярусна кнопка дія+вартість (праворуч). Футер чіпів — п'ятою смугою.
  if (s === 6) {
    return /*#__PURE__*/React.createElement(TsShell, {
      d: d,
      e: e,
      onOpen: onOpen
    }, /*#__PURE__*/React.createElement("div", {
      style: {
        position: "relative",
        flex: 1,
        padding: "10px 12px 10px 10px",
        display: "flex",
        flexDirection: "column",
        gap: 8
      }
    }, /*#__PURE__*/React.createElement(TsArt, {
      e: e
    }), /*#__PURE__*/React.createElement("div", {
      style: {
        position: "relative",
        zIndex: 1,
        display: "flex",
        alignItems: "baseline",
        justifyContent: "flex-end",
        gap: 7
      }
    }, /*#__PURE__*/React.createElement("span", {
      style: {
        fontFamily: TSV_SANS_S,
        fontWeight: 700,
        fontSize: 10.5,
        letterSpacing: ".18em",
        color: "#A9A9B2"
      }
    }, d.label), /*#__PURE__*/React.createElement(TsPrize, {
      d: d,
      e: e,
      fs: 25,
      align: "right",
      bare: true
    })), /*#__PURE__*/React.createElement("div", {
      style: {
        position: "relative",
        zIndex: 1,
        display: "flex",
        alignItems: "center",
        gap: 10
      }
    }, /*#__PURE__*/React.createElement(TsIcon, {
      e: e,
      c: d.c,
      s: 32
    }), /*#__PURE__*/React.createElement("div", {
      style: {
        flex: 1,
        minWidth: 0
      }
    }, /*#__PURE__*/React.createElement(TsTitle, {
      name: e.name,
      fs: 14
    }))), /*#__PURE__*/React.createElement("div", {
      style: {
        position: "relative",
        zIndex: 1,
        display: "flex",
        alignItems: "center",
        gap: 10,
        flexWrap: "wrap"
      }
    }, /*#__PURE__*/React.createElement(TsSched, {
      d: d
    }), /*#__PURE__*/React.createElement(TsPlayers, {
      e: e,
      d: d
    }), /*#__PURE__*/React.createElement(TsNote, {
      d: d,
      accent: accent
    })), /*#__PURE__*/React.createElement("div", {
      style: {
        position: "relative",
        zIndex: 1,
        display: "flex",
        justifyContent: "flex-end",
        marginTop: "auto"
      }
    }, /*#__PURE__*/React.createElement(TsCta, {
      d: d,
      w: 132,
      cost: e.buyIn
    }))), /*#__PURE__*/React.createElement(TsFooter, {
      d: d,
      e: e
    }));
  }

  // S5 — «квиток»: контент ліворуч, перфорація, корінець із прайсом і CTA
  const NOTCH = "#000";
  return /*#__PURE__*/React.createElement(TsShell, {
    d: d,
    e: e,
    onOpen: onOpen
  }, /*#__PURE__*/React.createElement("div", {
    style: {
      display: "flex",
      alignItems: "stretch",
      flex: 1
    }
  }, /*#__PURE__*/React.createElement("div", {
    style: {
      position: "relative",
      flex: 1,
      minWidth: 0,
      padding: "10px 12px 10px 10px",
      display: "flex",
      flexDirection: "column",
      gap: 6
    }
  }, /*#__PURE__*/React.createElement(TsArt, {
    e: e
  }), /*#__PURE__*/React.createElement("div", {
    style: {
      position: "relative",
      zIndex: 1,
      display: "flex",
      gap: 10,
      alignItems: "flex-start"
    }
  }, /*#__PURE__*/React.createElement(TsIcon, {
    e: e,
    c: d.c,
    s: 36
  }), /*#__PURE__*/React.createElement("div", {
    style: {
      flex: 1,
      minWidth: 0
    }
  }, /*#__PURE__*/React.createElement(TsTitle, {
    name: e.name
  }))), /*#__PURE__*/React.createElement("div", {
    style: {
      position: "relative",
      zIndex: 1,
      display: "flex",
      alignItems: "center",
      gap: 10,
      paddingLeft: 46
    }
  }, /*#__PURE__*/React.createElement(TsSched, {
    d: d
  }), /*#__PURE__*/React.createElement(TsPlayers, {
    e: e,
    d: d
  })), /*#__PURE__*/React.createElement("div", {
    style: {
      position: "relative",
      zIndex: 1,
      display: "flex",
      alignItems: "center",
      gap: 8,
      marginTop: "auto"
    }
  }, /*#__PURE__*/React.createElement(TsChips, {
    d: d,
    e: e,
    narrow: true
  }), /*#__PURE__*/React.createElement("span", {
    style: {
      flex: "none",
      display: "inline-flex"
    }
  }, /*#__PURE__*/React.createElement(TsNote, {
    d: d,
    accent: accent
  })))), /*#__PURE__*/React.createElement("div", {
    style: {
      position: "relative",
      flex: "none",
      width: RAIL_W + 24
    }
  }, /*#__PURE__*/React.createElement("span", {
    style: {
      position: "absolute",
      left: -6,
      top: -6,
      width: 12,
      height: 12,
      borderRadius: "50%",
      background: NOTCH,
      zIndex: 2
    }
  }), /*#__PURE__*/React.createElement("span", {
    style: {
      position: "absolute",
      left: -6,
      bottom: -6,
      width: 12,
      height: 12,
      borderRadius: "50%",
      background: NOTCH,
      zIndex: 2
    }
  }), /*#__PURE__*/React.createElement("div", {
    style: {
      height: "100%",
      borderLeft: "1.5px dashed rgba(255,255,255,.16)",
      background: "rgba(255,255,255,.025)",
      padding: "10px 11px",
      display: "flex",
      flexDirection: "column",
      alignItems: "center",
      justifyContent: "center",
      gap: 5
    }
  }, /*#__PURE__*/React.createElement(TsPrize, {
    d: d,
    e: e,
    fs: 15,
    align: "right",
    stack: true
  }), /*#__PURE__*/React.createElement(TsBuy, {
    e: e
  }), /*#__PURE__*/React.createElement(TsCta, {
    d: d
  })))));
}

// ── My Tournaments row — same S4 grammar: header (icon · 2-line title · CTA),
//    labeled stat grid, footer chips. Registered semantics: ENTER / REGISTERED.
function MyTourneyRow({
  m,
  accent = "#D71921",
  onView
}) {
  const MAP = {
    tournament: {
      c: "#D71921",
      label: "TOURNAMENT"
    },
    satellite: {
      c: "#6FA8FF",
      label: "SATELLITE"
    },
    freeroll: {
      c: "#5BD96A",
      label: "FREEROLL"
    }
  };
  const T = MAP[m.type] || MAP.tournament;
  const c = T.c;
  const live = m.state === "live";
  const fstr = (m.fmt || []).join(" ");
  const artKey = m.type === "satellite" ? "ticket" : m.type === "freeroll" ? "gift" : /MYSTERY/.test(fstr) ? "mystery" : /PKO|KO/.test(fstr) ? "pko" : "trophy";
  const artSrc = (window.PD_TOURN_ICONS || {})[artKey];
  const chips = (m.fmt || []).filter(f => !/^\d+-?MAX$/i.test(f) && !/^(NLH|PLO|HOLD|SHORT|FLASH|FREEZEOUT)$/i.test(f)).slice(0, 2);
  const cell = {
    flex: 1,
    minWidth: 0,
    padding: "7px 10px"
  };
  const lbl = {
    fontFamily: TSV_SANS_S,
    fontWeight: 700,
    fontSize: 10.5,
    letterSpacing: ".16em",
    color: "#A9A9B2",
    whiteSpace: "nowrap"
  };
  const isTicketPrize = m.prizeLabel === "TICKETS";
  return /*#__PURE__*/React.createElement("div", {
    style: {
      position: "relative",
      overflow: "hidden",
      borderRadius: 12,
      border: `1px solid ${live ? c + "66" : "rgba(255,255,255,.1)"}`,
      background: "linear-gradient(160deg, #1f1f27, #0a0a0c)",
      display: "flex",
      alignItems: "stretch"
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
  }), /*#__PURE__*/React.createElement("div", {
    style: {
      flex: 1,
      minWidth: 0,
      display: "flex",
      flexDirection: "column",
      position: "relative"
    }
  }, /*#__PURE__*/React.createElement("div", {
    style: {
      position: "relative",
      zIndex: 1,
      display: "flex",
      gap: 10,
      padding: "10px 11px 0 10px",
      alignItems: "flex-start"
    }
  }, /*#__PURE__*/React.createElement("button", {
    onClick: () => {
      if (window.playClick) window.playClick(1200, 0.04);
      onView && onView(m);
    },
    style: {
      flex: 1,
      minWidth: 0,
      display: "flex",
      gap: 10,
      alignItems: "flex-start",
      background: "transparent",
      border: 0,
      padding: 0,
      textAlign: "left",
      cursor: "pointer"
    }
  }, /*#__PURE__*/React.createElement("span", {
    style: {
      flex: "none",
      width: 36,
      height: 36,
      display: "flex",
      alignItems: "center",
      justifyContent: "center"
    }
  }, artSrc ? /*#__PURE__*/React.createElement("img", {
    src: artSrc,
    alt: "",
    style: {
      width: 34,
      height: 34,
      objectFit: "contain",
      display: "block"
    }
  }) : null), /*#__PURE__*/React.createElement("span", {
    style: {
      flex: 1,
      minWidth: 0
    }
  }, /*#__PURE__*/React.createElement(TsTitle, {
    name: m.name
  }), /*#__PURE__*/React.createElement("span", {
    style: {
      display: "flex",
      alignItems: "center",
      gap: 10,
      marginTop: 5
    }
  }, /*#__PURE__*/React.createElement("span", {
    style: {
      fontFamily: TSV_MONO_S,
      fontWeight: 700,
      fontSize: 10.5,
      letterSpacing: ".05em",
      color: "#fff",
      whiteSpace: "nowrap"
    }
  }, "TODAY \xB7 ", m.time), live && m.seat ? /*#__PURE__*/React.createElement("span", {
    style: {
      fontFamily: TSV_SANS_S,
      fontWeight: 700,
      fontSize: 10.5,
      color: c,
      letterSpacing: ".12em",
      whiteSpace: "nowrap"
    }
  }, m.seat) : null))), live ? /*#__PURE__*/React.createElement("button", {
    onClick: () => {
      if (window.playClick) window.playClick(1500, 0.05);
    },
    style: {
      flex: "none",
      width: RAIL_W,
      minHeight: 40,
      borderRadius: 12,
      border: "1px solid rgba(255,255,255,.14)",
      cursor: "pointer",
      background: accent,
      display: "inline-flex",
      alignItems: "center",
      justifyContent: "center",
      gap: 6,
      boxShadow: `0 6px 16px ${accent}55`
    }
  }, /*#__PURE__*/React.createElement("span", {
    style: {
      fontFamily: TSV_SANS_S,
      fontWeight: 700,
      fontSize: 10.5,
      letterSpacing: ".16em",
      color: "#fff"
    }
  }, "ENTER \u203A")) : /*#__PURE__*/React.createElement("span", {
    style: {
      flex: "none",
      width: RAIL_W,
      minHeight: 40,
      borderRadius: 12,
      boxSizing: "border-box",
      background: "rgba(91,217,106,.08)",
      border: "1px solid rgba(91,217,106,.45)",
      display: "inline-flex",
      alignItems: "center",
      justifyContent: "center",
      gap: 5
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
      fontFamily: TSV_SANS_S,
      fontWeight: 700,
      fontSize: 10.5,
      letterSpacing: ".1em",
      color: "#5BD96A"
    }
  }, "REGISTERED"))), /*#__PURE__*/React.createElement("div", {
    style: {
      position: "relative",
      zIndex: 1,
      display: "flex",
      alignItems: "stretch",
      margin: "9px 10px 10px",
      borderRadius: 8,
      background: "rgba(255,255,255,.045)",
      border: "1px solid rgba(255,255,255,.08)"
    }
  }, /*#__PURE__*/React.createElement("div", {
    style: {
      ...cell,
      background: `linear-gradient(160deg, ${c}e8, ${c}b8)`,
      borderRadius: "8px 0 0 8px"
    }
  }, /*#__PURE__*/React.createElement("div", {
    style: {
      ...lbl,
      color: "#D8D8DF"
    }
  }, m.prizeLabel), /*#__PURE__*/React.createElement("div", {
    style: {
      marginTop: 3,
      display: "inline-flex",
      alignItems: "center",
      gap: 5,
      whiteSpace: "nowrap"
    }
  }, isTicketPrize ? /*#__PURE__*/React.createElement("svg", {
    width: "15",
    height: "11",
    viewBox: "0 0 31 24",
    "aria-hidden": "true"
  }, /*#__PURE__*/React.createElement("path", {
    d: "M3 3h25a2 2 0 0 1 2 2v4.3a2.7 2.7 0 0 0 0 5.4V19a2 2 0 0 1-2 2H3a2 2 0 0 1-2-2v-4.3a2.7 2.7 0 0 0 0-5.4V5a2 2 0 0 1 2-2z",
    fill: "#fff"
  })) : null, /*#__PURE__*/React.createElement("span", {
    style: {
      fontFamily: TSV_MONO_S,
      fontWeight: 700,
      fontSize: String(m.prize).length > 12 ? 11 : 13.5,
      color: "#fff",
      lineHeight: 1
    }
  }, m.prize))), /*#__PURE__*/React.createElement("div", {
    style: {
      width: 1,
      background: "rgba(255,255,255,.08)"
    }
  }), /*#__PURE__*/React.createElement("div", {
    style: {
      ...cell,
      flex: .9,
      background: `${c}14`
    }
  }, /*#__PURE__*/React.createElement("div", {
    style: lbl
  }, "BUY-IN"), /*#__PURE__*/React.createElement("div", {
    style: {
      marginTop: 3,
      fontFamily: TSV_MONO_S,
      fontWeight: 700,
      fontSize: 11,
      color: m.buyIn === "FREE" ? "#5BD96A" : "#fff",
      whiteSpace: "nowrap"
    }
  }, m.buyIn)), /*#__PURE__*/React.createElement("div", {
    style: {
      width: 1,
      background: "rgba(255,255,255,.08)"
    }
  }), /*#__PURE__*/React.createElement("div", {
    style: {
      ...cell,
      flex: .9,
      background: `${c}14`,
      borderRadius: "0 8px 8px 0"
    }
  }, /*#__PURE__*/React.createElement("div", {
    style: lbl
  }, "STARTS"), /*#__PURE__*/React.createElement("div", {
    style: {
      marginTop: 3,
      display: "inline-flex",
      alignItems: "center",
      gap: 5,
      fontFamily: TSV_MONO_S,
      fontWeight: 700,
      fontSize: 11,
      color: live ? "#fff" : "rgba(255,255,255,.85)",
      whiteSpace: "nowrap"
    }
  }, live ? /*#__PURE__*/React.createElement("span", {
    style: {
      width: 5,
      height: 5,
      borderRadius: "50%",
      background: accent,
      boxShadow: `0 0 6px ${accent}`,
      flex: "none",
      animation: "pp-pulse 1.4s ease-in-out infinite"
    }
  }) : null, live ? "PLAYING" : m.rel.replace("IN ", "IN ")))), /*#__PURE__*/React.createElement("div", {
    style: {
      position: "relative",
      zIndex: 1,
      marginTop: "auto",
      display: "flex",
      alignItems: "center",
      gap: 5,
      padding: "6px 11px",
      borderTop: "1px solid rgba(255,255,255,.07)",
      background: "rgba(255,255,255,.02)"
    }
  }, /*#__PURE__*/React.createElement("span", {
    style: tsChip(c, `${c}1c`, `${c}55`)
  }, T.label), /*#__PURE__*/React.createElement("span", {
    style: tsChip()
  }, "HOLD'EM"), chips.map(f => /*#__PURE__*/React.createElement("span", {
    key: f,
    style: tsChip()
  }, f)))));
}
Object.assign(window, {
  EventRowS,
  MyTourneyRow
});